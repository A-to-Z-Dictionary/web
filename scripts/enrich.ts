import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { Animal, AnimalTranslation } from './types'
import { LAND_ANIMALS } from './animal_list'

const ANIMAL_MAP = Object.fromEntries(LAND_ANIMALS.map(a => [a.slug, a]))

const DATA_DIR = join(process.cwd(), 'scripts', 'data')
const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })

async function fetchUnsplashImage(query: string): Promise<string> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
  )
  if (!res.ok) return ''
  const data = await res.json()
  return data.results?.[0]?.urls?.regular ?? ''
}

async function fetchPexelsImage(query: string): Promise<string> {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: process.env.PEXELS_API_KEY ?? '' } }
  )
  if (!res.ok) return ''
  const data = await res.json()
  return data.photos?.[0]?.src?.large ?? ''
}

async function fetchPixabayImage(query: string): Promise<string> {
  const res = await fetch(
    `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&category=animals&per_page=3&safesearch=true`
  )
  if (!res.ok) return ''
  const data = await res.json()
  return data.hits?.[0]?.webformatURL ?? ''
}

async function fetchWikipediaSummary(nameEn: string): Promise<string> {
  const wikiTitle = nameEn.replace(/ /g, '_')
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`, {
    headers: { 'User-Agent': 'AnimalDictionary/1.0 (educational children app)' },
  })
  if (!res.ok) return ''
  const data = await res.json()
  return data.extract ?? ''
}

// 한국어 + 영어 전부 생성 (깨진 파일용)
// ▶ 반드시 존댓말로 작성 (예: ~예요, ~해요, ~답니다, ~있어요)
// ▶ 1인칭 동물 시점("나는 ~야") 절대 사용 금지
// ▶ 아동용 친근한 어투 (7~8세 눈높이)
async function generateFullData(nameKo: string, nameEn: string, wikiSummary: string): Promise<{
  family_scientific: string
  ko: AnimalTranslation & { family_name: string }
  en: AnimalTranslation & { family_name: string }
}> {
  const prompt = `
너는 아동용 동물 백과사전 데이터를 만드는 전문가야.
동물: ${nameKo} (${nameEn})
Wikipedia 요약: ${wikiSummary || '정보 없음. 네가 알고 있는 지식을 사용해.'}

아래 JSON 형식으로만 반환해. 설명 없이 순수 JSON만.

{
  "family_scientific": "생물 분류 과(Family) 학명. 예: Felidae",
  "ko": {
    "name": "${nameKo}",
    "family_name": "과 이름 (한국어). 예: 고양잇과",
    "description": "7~8세 아이 눈높이의 친근한 한국어 설명 (3~4문장). 반드시 존댓말(~예요,~해요,~답니다)로 작성. 1인칭 동물 시점 금지.",
    "fun_fact": "아이들이 '우와!' 할 만한 흥미로운 한국어 사실 1가지. 존댓말로 작성.",
    "habitat": ["서식지1", "서식지2"],
    "tags": ["태그1", "태그2", ... 10~15개 한국어 태그]
  },
  "en": {
    "name": "${nameEn}",
    "family_name": "Family name in English. e.g. Cat family",
    "description": "3-4 sentences for 7-8 year old children in English",
    "fun_fact": "One exciting fun fact in English",
    "habitat": ["habitat1", "habitat2"],
    "tags": ["tag1", "tag2", ... 10~15 English tags]
  }
}
  `.trim()

  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt,
  })

  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  return JSON.parse(cleaned)
}

// 영어 + family 정보만 생성 (한국어 데이터는 있는 파일용)
async function generateEnrichData(nameKo: string, nameEn: string, existingKo: AnimalTranslation): Promise<{
  family_scientific: string
  ko_family_name: string
  en: AnimalTranslation
}> {
  const prompt = `
동물: ${nameKo} (${nameEn})

아래 JSON 형식으로만 반환해. 설명 없이 순수 JSON만.

{
  "family_scientific": "생물 분류 과(Family) 학명. 예: Felidae, Canidae",
  "ko_family_name": "과 이름 (한국어). 예: 고양잇과, 개과, 곰과",
  "en": {
    "name": "${nameEn}",
    "family_name": "Family name in English. e.g. Cat family",
    "description": "3-4 sentences for 7-8 year old children in English",
    "fun_fact": "One exciting fun fact in English",
    "habitat": ["habitat1", "habitat2"],
    "tags": ["tag1", "tag2", ... 10~15 English tags]
  }
}

한국어 설명 참고 (번역 참고용):
description: ${existingKo.description}
fun_fact: ${existingKo.fun_fact}
  `.trim()

  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt,
  })

  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  return JSON.parse(cleaned)
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const required = ['GEMINI_API_KEY', 'UNSPLASH_ACCESS_KEY', 'PEXELS_API_KEY', 'PIXABAY_API_KEY']
  const missing = required.filter(k => !process.env[k])
  if (missing.length) {
    console.error(`누락된 환경변수: ${missing.join(', ')}`)
    process.exit(1)
  }

  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  console.log(`${files.length}개 파일 보강 시작\n`)

  for (let i = 0; i < files.length; i++) {
    const filePath = join(DATA_DIR, files[i])
    const raw: any = JSON.parse(readFileSync(filePath, 'utf-8'))

    const koName: string = raw.translations?.ko?.name ?? ''
    const enName: string = raw.name_en ?? raw.translations?.en?.name ?? ''
    const koFamilyName: string = raw.translations?.ko?.family_name ?? ''
    const koDesc: string = raw.translations?.ko?.description ?? ''

    // 완료 판정: ko.name, ko.description, ko.family_name, en 번역 모두 있어야 완료
    const isComplete = koName && koDesc && koFamilyName && raw.translations?.en?.name
    if (isComplete) {
      console.log(`[건너뜀] ${koName}`)
      continue
    }

    // animal_list.ts가 정보의 원본 — 파일 내 이름보다 우선
    const listItem = ANIMAL_MAP[raw.slug]
    const isBroken = !koName || !koDesc || (listItem && koName !== listItem.name_ko)

    if (isBroken) {
      // 한국어 데이터 자체가 없거나 다른 동물 데이터로 오염됨 → 전부 재생성
      const nameEn = listItem?.name_en || raw.slug
      const nameKo = listItem?.name_ko || raw.slug
      console.log(`[전체생성] ${nameKo} (${nameEn})...`)

      const [wikiSummary, unsplash, pexels, pixabay] = await Promise.all([
        fetchWikipediaSummary(nameEn),
        raw.images?.length ? Promise.resolve('') : fetchUnsplashImage(`${nameEn} animal`),
        raw.images?.length ? Promise.resolve('') : fetchPexelsImage(`${nameEn} animal`),
        raw.images?.length ? Promise.resolve('') : fetchPixabayImage(nameEn),
      ])

      const fullData = await generateFullData(nameKo, nameEn, wikiSummary)
      const images = raw.images?.length ? raw.images : [unsplash, pexels, pixabay].filter(Boolean)

      const animal: Animal = {
        slug: raw.slug,
        name_scientific: raw.name_scientific ?? '',
        family_scientific: fullData.family_scientific,
        category: raw.category ?? 'land',
        lifespan_min: raw.lifespan_min ?? 0,
        lifespan_max: raw.lifespan_max ?? 0,
        height_min: raw.height_min ?? 0,
        height_max: raw.height_max ?? 0,
        weight_min: raw.weight_min ?? 0,
        weight_max: raw.weight_max ?? 0,
        diet: raw.diet ?? 'omnivore',
        images,
        sound_url: raw.sound_url ?? '',
        translations: {
          ko: fullData.ko,
          en: fullData.en,
        },
      }

      writeFileSync(filePath, JSON.stringify(animal, null, 2), 'utf-8')
      console.log(`[완료] ${fullData.ko.name} (${nameEn}) — 과: ${fullData.family_scientific}`)
    } else {
      // 한국어는 있지만 영어/family_name 없음 → 영어만 생성
      console.log(`[보강중] ${koName}...`)

      const existingKo: AnimalTranslation = {
        name: koName,
        family_name: koFamilyName,
        description: koDesc,
        fun_fact: raw.translations?.ko?.fun_fact ?? '',
        habitat: raw.translations?.ko?.habitat ?? [],
        tags: raw.translations?.ko?.tags ?? [],
      }

      const [enriched, unsplash, pexels, pixabay] = await Promise.all([
        generateEnrichData(koName, enName, existingKo),
        raw.images?.length ? Promise.resolve('') : fetchUnsplashImage(`${enName} animal`),
        raw.images?.length ? Promise.resolve('') : fetchPexelsImage(`${enName} animal`),
        raw.images?.length ? Promise.resolve('') : fetchPixabayImage(enName),
      ])

      const images = raw.images?.length ? raw.images : [unsplash, pexels, pixabay].filter(Boolean)

      const animal: Animal = {
        slug: raw.slug,
        name_scientific: raw.name_scientific ?? '',
        family_scientific: enriched.family_scientific,
        category: raw.category ?? 'land',
        lifespan_min: raw.lifespan_min ?? 0,
        lifespan_max: raw.lifespan_max ?? 0,
        height_min: raw.height_min ?? 0,
        height_max: raw.height_max ?? 0,
        weight_min: raw.weight_min ?? 0,
        weight_max: raw.weight_max ?? 0,
        diet: raw.diet ?? 'omnivore',
        images,
        sound_url: raw.sound_url ?? '',
        translations: {
          ko: { ...existingKo, family_name: enriched.ko_family_name },
          en: enriched.en,
        },
      }

      writeFileSync(filePath, JSON.stringify(animal, null, 2), 'utf-8')
      console.log(`[완료] ${koName} — 과: ${enriched.family_scientific}`)
    }

    if (i < files.length - 1) await sleep(5000)
  }

  console.log('\n보강 완료!')
}

main()
