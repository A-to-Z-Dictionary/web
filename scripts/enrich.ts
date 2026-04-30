import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { Animal, AnimalTranslation } from './types'

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
    "name": "영어 이름",
    "family_name": "과 이름 (영어). 예: Cat family, Dog family",
    "description": "7~8세 아이 눈높이 영어 설명 3~4문장",
    "fun_fact": "아이들이 흥미로워할 영어 사실 1가지",
    "habitat": ["habitat1", "habitat2"],
    "tags": ["tag1", "tag2", ... 10~15개 영어 태그]
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

    // ko.family_name까지 있어야 완료로 간주
    if (raw.translations?.en && raw.translations?.ko?.family_name) {
      console.log(`[건너뜀] ${raw.translations?.ko?.name ?? raw.slug}`)
      continue
    }

    const nameKo = raw.name_ko ?? raw.translations?.ko?.name ?? ''
    const nameEn = raw.name_en ?? raw.translations?.en?.name ?? ''
    console.log(`[보강중] ${nameKo}...`)

    const existingKo: AnimalTranslation = {
      name: nameKo,
      family_name: raw.family ?? '',
      description: raw.description ?? '',
      fun_fact: raw.fun_fact ?? '',
      habitat: raw.habitat ?? [],
      tags: raw.tags ?? [],
    }

    const [enriched, unsplash, pexels, pixabay] = await Promise.all([
      generateEnrichData(nameKo, nameEn, existingKo),
      fetchUnsplashImage(`${nameEn} animal`),
      fetchPexelsImage(`${nameEn} animal`),
      fetchPixabayImage(nameEn),
    ])

    const images = [unsplash, pexels, pixabay].filter(Boolean)

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
    console.log(`[완료] ${nameKo} — 과: ${enriched.family_scientific}, 이미지: ${images.length}장`)

    if (i < files.length - 1) await sleep(5000)
  }

  console.log('\n보강 완료!')
}

main()
