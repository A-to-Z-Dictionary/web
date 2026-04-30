import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { LAND_ANIMALS } from './animal_list'
import type { Animal, AnimalListItem } from './types'

const DATA_DIR = join(process.cwd(), 'scripts', 'data')
const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })

async function fetchUnsplashImage(query: string): Promise<string> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  })
  if (!res.ok) return ''
  const data = await res.json()
  return data.results?.[0]?.urls?.regular ?? ''
}

async function fetchWikipediaSummary(wikiTitle: string): Promise<string> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AnimalDictionary/1.0 (educational children app)' },
  })
  if (!res.ok) return ''
  const data = await res.json()
  return data.extract ?? ''
}

function buildPrompt(item: AnimalListItem, wikiSummary: string): string {
  return `
너는 아동용 동물 백과사전 데이터를 만드는 전문가야.
아래 Wikipedia 정보를 참고하여 JSON 데이터를 만들어줘.

동물: ${item.name_ko} (${item.name_en})
Wikipedia 요약: ${wikiSummary || '정보 없음. 네가 알고 있는 지식을 사용해.'}

다음 JSON 형식으로만 반환해. 설명, 마크다운, 코드블럭 없이 순수 JSON만.

{
  "name_scientific": "학명",
  "lifespan_min": 최소 수명(년, 숫자),
  "lifespan_max": 최대 수명(년, 숫자),
  "height_min": 최소 키(cm, 숫자),
  "height_max": 최대 키(cm, 숫자),
  "weight_min": 최소 몸무게(kg, 숫자),
  "weight_max": 최대 몸무게(kg, 숫자),
  "habitat": ["서식지1", "서식지2"],
  "diet": "carnivore 또는 herbivore 또는 omnivore",
  "description": "7~8세 아이 눈높이의 친근한 설명 (3~4문장, 한국어)",
  "fun_fact": "아이들이 '우와!' 할 만한 흥미로운 사실 1가지 (한국어)",
  "tags": ["태그1", "태그2", ... 10~15개 한국어 태그]
}

tags 기준: 서식지, 식성, 생활방식, 신체 특징, 행동 특성 — 아이가 "이런 동물 찾아줘" 할 때 쓸 법한 키워드.
  `.trim()
}

async function processAnimal(item: AnimalListItem): Promise<void> {
  const outputPath = join(DATA_DIR, `${item.slug}.json`)

  if (existsSync(outputPath)) {
    console.log(`[건너뜀] ${item.name_ko} — 이미 존재`)
    return
  }

  console.log(`[처리중] ${item.name_ko}...`)

  const [wikiSummary, imageUrl] = await Promise.all([
    fetchWikipediaSummary(item.wiki_title),
    fetchUnsplashImage(`${item.name_en} animal`),
  ])
  const prompt = buildPrompt(item, wikiSummary)

  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt,
  })

  let parsed: Partial<Animal>
  try {
    parsed = JSON.parse(text.trim())
  } catch {
    console.error(`[오류] ${item.name_ko} JSON 파싱 실패:`, text)
    return
  }

  const animal: Animal = {
    slug: item.slug,
    name_ko: item.name_ko,
    name_en: item.name_en,
    name_scientific: parsed.name_scientific ?? '',
    category: 'land',
    lifespan_min: parsed.lifespan_min ?? 0,
    lifespan_max: parsed.lifespan_max ?? 0,
    height_min: parsed.height_min ?? 0,
    height_max: parsed.height_max ?? 0,
    weight_min: parsed.weight_min ?? 0,
    weight_max: parsed.weight_max ?? 0,
    habitat: parsed.habitat ?? [],
    diet: parsed.diet ?? 'omnivore',
    description: parsed.description ?? '',
    fun_fact: parsed.fun_fact ?? '',
    image_url: imageUrl,
    sound_url: '',
    tags: parsed.tags ?? [],
  }

  writeFileSync(outputPath, JSON.stringify(animal, null, 2), 'utf-8')
  console.log(`[완료] ${item.name_ko} → scripts/data/${item.slug}.json`)
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요.')
    process.exit(1)
  }
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error('UNSPLASH_ACCESS_KEY가 설정되지 않았습니다. .env.local을 확인하세요.')
    process.exit(1)
  }

  mkdirSync(DATA_DIR, { recursive: true })
  console.log(`총 ${LAND_ANIMALS.length}마리 처리 시작\n`)

  for (let i = 0; i < LAND_ANIMALS.length; i++) {
    await processAnimal(LAND_ANIMALS[i])
    if (i < LAND_ANIMALS.length - 1) await sleep(5000) // 무료 티어 rate limit 대응
  }

  console.log('\n모든 동물 데이터 수집 완료!')
}

main()
