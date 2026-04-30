/**
 * refix_images.ts
 * 오염된 이미지(generic unsplash/pexels)가 들어간 15개 동물의 이미지를 재취득합니다.
 *
 * 전략:
 * - Pexels → Pixabay → Unsplash 순으로 각각 3장 시도
 * - 이미 오염된 URL(BROKEN_IDS)은 결과에서 제거
 * - 각 소스마다 1.5초 딜레이로 rate limit 방지
 * - 최종 결과를 images[] 배열에 교체 후 JSON 저장
 *
 * 실행: npm run refix:images
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { Animal } from './types'

const DATA_DIR = join(process.cwd(), 'scripts', 'data')

const BROKEN_IDS = [
  'photo-1474511320723',
  'pexels-photo-30011316',
]

const BROKEN_SLUGS = [
  'bison', 'brown-bear', 'camel', 'cheetah', 'chimpanzee',
  'deer', 'elephant', 'fox', 'giant-panda', 'giraffe',
  'gorilla', 'hedgehog', 'hippopotamus', 'hyena', 'jaguar',
]

// 영어 이름 매핑 (검색 쿼리용)
const ENGLISH_NAMES: Record<string, string> = {
  'bison': 'American bison',
  'brown-bear': 'brown bear',
  'camel': 'camel',
  'cheetah': 'cheetah',
  'chimpanzee': 'chimpanzee',
  'deer': 'deer',
  'elephant': 'African elephant',
  'fox': 'red fox',
  'giant-panda': 'giant panda',
  'giraffe': 'giraffe',
  'gorilla': 'gorilla',
  'hedgehog': 'hedgehog',
  'hippopotamus': 'hippopotamus',
  'hyena': 'spotted hyena',
  'jaguar': 'jaguar',
}

function isBroken(url: string): boolean {
  return BROKEN_IDS.some(id => url.includes(id))
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchPexels(query: string): Promise<string[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`
  const res = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY! },
  })
  if (!res.ok) {
    console.log(`  [Pexels] 실패 (${res.status})`)
    return []
  }
  const data = await res.json()
  const urls: string[] = (data.photos ?? []).map((p: any) => p.src.large)
  console.log(`  [Pexels] ${urls.length}장`)
  return urls.filter(u => !isBroken(u))
}

async function fetchPixabay(query: string): Promise<string[]> {
  const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true`
  const res = await fetch(url)
  if (!res.ok) {
    console.log(`  [Pixabay] 실패 (${res.status})`)
    return []
  }
  const data = await res.json()
  const urls: string[] = (data.hits ?? []).map((h: any) => h.webformatURL)
  console.log(`  [Pixabay] ${urls.length}장`)
  return urls.filter(u => !isBroken(u))
}

async function fetchUnsplash(query: string): Promise<string[]> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  })
  if (!res.ok) {
    console.log(`  [Unsplash] 실패 (${res.status})`)
    return []
  }
  const data = await res.json()
  const urls: string[] = (data.results ?? []).map((r: any) => r.urls.regular)
  console.log(`  [Unsplash] ${urls.length}장`)
  return urls.filter(u => !isBroken(u))
}

async function refixAnimal(slug: string): Promise<void> {
  const filePath = join(DATA_DIR, `${slug}.json`)
  const animal: Animal = JSON.parse(readFileSync(filePath, 'utf-8'))

  const query = `${ENGLISH_NAMES[slug]} animal wildlife`
  console.log(`\n[${slug}] 검색 쿼리: "${query}"`)

  // 기존 이미지 중 오염되지 않은 것은 유지
  const clean = animal.images.filter(u => !isBroken(u))
  console.log(`  기존 정상 이미지: ${clean.length}장`)

  await sleep(1500)
  const pexels = await fetchPexels(query)
  await sleep(1500)
  const pixabay = await fetchPixabay(query)
  await sleep(1500)
  const unsplash = await fetchUnsplash(query)

  // 중복 제거 후 합치기 (Pexels 우선)
  const all = [...clean, ...pexels, ...pixabay, ...unsplash]
  const deduped = [...new Set(all)]

  if (deduped.length === 0) {
    console.log(`  [경고] 가져온 이미지가 없습니다!`)
    return
  }

  animal.images = deduped.slice(0, 3)
  writeFileSync(filePath, JSON.stringify(animal, null, 2), 'utf-8')
  console.log(`  → ${animal.images.length}장으로 교체 완료`)
}

async function main() {
  const missing = ['PEXELS_API_KEY', 'PIXABAY_API_KEY', 'UNSPLASH_ACCESS_KEY'].filter(
    k => !process.env[k],
  )
  if (missing.length > 0) {
    console.error(`환경변수 누락: ${missing.join(', ')}`)
    process.exit(1)
  }

  console.log(`오염 이미지 재취득 시작 (${BROKEN_SLUGS.length}개 동물)\n`)

  for (const slug of BROKEN_SLUGS) {
    await refixAnimal(slug)
  }

  console.log('\n\n재취득 완료!')
  console.log('이후 npm run migrate:images 로 Storage에 업로드하세요.')
}

main()
