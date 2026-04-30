/**
 * replace_images.ts
 * 흑백 사진 제거 + 자연환경 전신 사진으로 교체
 *
 * 전략:
 * - Pexels에서 동물당 3장 수집 (야생/자연 환경 쿼리)
 * - alt text에서 흑백/close-up/zoo/enclosure 키워드 → 패널티
 * - wild/full body/walking/natural habitat 키워드 → 보너스
 * - 점수 낮으면 기존 이미지 유지
 *
 * 실행: npm run replace:images
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { Animal } from './types'

const DATA_DIR = join(process.cwd(), 'scripts', 'data')

// 흑백 확정 제거 목록 (pexels ID)
const BLACKLIST_IDS = new Set([
  '9765280',  // cheetah - "Black and white close-up"
  '6498745',  // elephant - "Black and white photo"
])

// 야생 환경 전신 쿼리 — 동물원/인공 환경 최대한 배제
const SEARCH_QUERIES: Record<string, string> = {
  'bison':         'American bison wild grassland full body',
  'brown-bear':    'brown bear wild forest full body',
  'camel':         'camel wild desert full body',
  'cheetah':       'cheetah wild savannah walking',
  'chimpanzee':    'chimpanzee wild forest full body',
  'deer':          'deer wild nature full body',
  'elephant':      'African elephant wild savannah walking',
  'fox':           'red fox wild nature full body',
  'giant-panda':   'giant panda wild bamboo forest',
  'giraffe':       'giraffe wild savannah full body',
  'gorilla':       'gorilla wild forest full body',
  'hedgehog':      'hedgehog wild nature full body',
  'hippopotamus':  'hippopotamus wild river full body',
  'hyena':         'spotted hyena wild savannah full body',
  'jaguar':        'jaguar wild amazon full body',
  'kangaroo':      'kangaroo wild Australia full body',
  'koala':         'koala wild eucalyptus tree',
  'komodo-dragon': 'komodo dragon wild island full body',
  'leopard':       'leopard wild africa full body',
  'lion':          'lion wild savannah full body',
  'meerkat':       'meerkat wild standing upright',
  'orangutan':     'orangutan wild rainforest full body',
  'polar-bear':    'polar bear wild arctic ice close',
  'raccoon':       'raccoon wild full body',
  'rhinoceros':    'rhinoceros wild savannah full body',
  'sloth':         'sloth wild rainforest hanging',
  'tiger':         'tiger wild forest full body',
  'wild-boar':     'wild boar wild forest full body',
  'wolf':          'wolf wild forest full body',
  'zebra':         'zebra wild savannah full body',
}

const BAD_KEYWORDS = [
  'black and white', 'monochrome', 'grayscale',
  'close-up', 'closeup', 'close up',
  'portrait', 'face', 'head shot', 'headshot',
  'zoo', 'zoological', 'enclosure', 'cage', 'captive', 'captivity',
  'sanctuary', 'reserve', 'rescue center',
]

const GOOD_KEYWORDS = [
  'full body', 'full-body', 'walking', 'standing', 'running',
  'wild', 'wildlife', 'natural habitat', 'in the wild',
  'savannah', 'forest', 'grassland', 'jungle', 'desert', 'arctic',
  'nature', 'outdoors',
]

function scoreAlt(alt: string): number {
  const lower = alt.toLowerCase()
  let score = 0
  for (const kw of BAD_KEYWORDS) {
    if (lower.includes(kw)) score -= 10
  }
  for (const kw of GOOD_KEYWORDS) {
    if (lower.includes(kw)) score += 3
  }
  return score
}

interface PexelsPhoto {
  id: number
  alt: string
  src: { large: string }
}

async function fetchPexelsCandidates(query: string): Promise<PexelsPhoto[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`
  const res = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY! },
  })
  if (!res.ok) {
    console.log(`  [Pexels 실패] ${res.status}`)
    return []
  }
  const data = await res.json()
  return data.photos ?? []
}

function selectBest(photos: PexelsPhoto[], existing: string[]): string[] {
  const existingIds = new Set(
    existing.map(u => u.match(/photos\/(\d+)\//)?.[1]).filter(Boolean)
  )

  const scored = photos
    .filter(p => !BLACKLIST_IDS.has(String(p.id)))
    .filter(p => !existingIds.has(String(p.id)))
    .map(p => ({ url: p.src.large, score: scoreAlt(p.alt), alt: p.alt, id: p.id }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, 3).map(p => p.url)
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function processAnimal(slug: string): Promise<void> {
  const filePath = join(DATA_DIR, `${slug}.json`)
  const animal: Animal = JSON.parse(readFileSync(filePath, 'utf-8'))

  // 기존 이미지에서 블랙리스트 제거
  const clean = animal.images.filter(u => {
    const id = u.match(/photos\/(\d+)\//)?.[1]
    return !id || !BLACKLIST_IDS.has(id)
  })

  const query = SEARCH_QUERIES[slug] ?? `${slug} wildlife`
  console.log(`\n[${slug}] "${query}"`)

  const candidates = await fetchPexelsCandidates(query)

  // 점수 로그 출력
  candidates.forEach(p => {
    const score = scoreAlt(p.alt)
    const flag = score < 0 ? '❌' : score >= 6 ? '✅' : '🔸'
    console.log(`  ${flag} [${score > 0 ? '+' : ''}${score}] ${p.alt.substring(0, 80)}`)
  })

  const newUrls = selectBest(candidates, clean)

  // 기존 clean + 새 이미지 합쳐서 3장
  const merged = [...newUrls, ...clean]
  const deduped = [...new Set(merged)].slice(0, 3)

  animal.images = deduped
  writeFileSync(filePath, JSON.stringify(animal, null, 2), 'utf-8')
  console.log(`  → ${animal.images.length}장 저장`)

  await sleep(1500)
}

async function main() {
  if (!process.env.PEXELS_API_KEY) {
    console.error('PEXELS_API_KEY가 필요합니다.')
    process.exit(1)
  }

  const slugs = readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))

  console.log(`전체 ${slugs.length}개 동물 이미지 재선별 시작\n`)

  for (const slug of slugs) {
    await processAnimal(slug)
  }

  console.log('\n\n완료! npm run migrate:images 로 Storage에 업로드하세요.')
}

main()
