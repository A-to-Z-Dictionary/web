/**
 * migrate_images.ts
 * scripts/data/*.json의 이미지 URL을 Supabase Storage로 이전합니다.
 *
 * 동작 방식:
 * 1. 각 동물 JSON의 images[] URL을 순서대로 다운로드
 * 2. animals/{slug}/{index}.jpg 경로로 Supabase Storage 업로드
 * 3. JSON의 images[] 배열을 Storage 공개 URL로 교체
 *
 * 알려진 오염 이미지 (generic 이미지, 재취득 필요):
 * Unsplash photo-1474511320723: bison, brown-bear, camel, cheetah, chimpanzee,
 *   deer, elephant, fox, giant-panda, giraffe, gorilla, hedgehog, hippopotamus,
 *   hyena, jaguar
 * → SKIP_UPLOAD_BROKEN=true 환경변수로 건너뛰고 수동 처리 가능
 *
 * 실행:
 * npm run migrate:images
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { Animal } from './types'

const DATA_DIR = join(process.cwd(), 'scripts', 'data')
const BUCKET = 'animal-images'

// 이 Unsplash ID는 잘못된 generic 이미지 (사자가 아닌 동물 데이터에 잘못 들어간 것)
const BROKEN_UNSPLASH_ID = 'photo-1474511320723-9a56873867b5'
// 이 Pexels ID도 같은 batch에서 들어간 오염 이미지
const BROKEN_PEXELS_ID = 'pexels-photo-30011316'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)
  if (!exists) {
    await supabase.storage.createBucket(BUCKET, { public: true })
    console.log(`[버킷 생성] ${BUCKET}`)
  }
}

function isBrokenImage(url: string): boolean {
  return url.includes(BROKEN_UNSPLASH_ID) || url.includes(BROKEN_PEXELS_ID)
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

function guessExtension(url: string): string {
  if (url.includes('.png')) return 'png'
  if (url.includes('.webp')) return 'webp'
  return 'jpg'
}

async function migrateAnimal(animal: Animal): Promise<string[]> {
  const newUrls: string[] = []

  for (let i = 0; i < animal.images.length; i++) {
    const url = animal.images[i]

    if (isBrokenImage(url)) {
      console.log(`  [건너뜀] ${animal.slug}[${i}] — 오염된 이미지 (수동 교체 필요)`)
      newUrls.push(url) // 일단 기존 URL 유지
      continue
    }

    const ext = guessExtension(url)
    const storagePath = `${animal.slug}/${i}.${ext}`

    // 이미 업로드된 경우 스킵
    const { data: existing } = await supabase.storage.from(BUCKET).list(animal.slug)
    if (existing?.some(f => f.name === `${i}.${ext}`)) {
      const { data: pubUrl } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
      console.log(`  [이미 존재] ${storagePath}`)
      newUrls.push(pubUrl.publicUrl)
      continue
    }

    const buffer = await downloadImage(url)
    if (!buffer) {
      console.log(`  [다운로드 실패] ${url}`)
      newUrls.push(url)
      continue
    }

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
      contentType: ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg',
      upsert: true,
    })

    if (error) {
      console.log(`  [업로드 실패] ${storagePath}:`, error.message)
      newUrls.push(url)
    } else {
      const { data: pubUrl } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
      newUrls.push(pubUrl.publicUrl)
      console.log(`  [업로드 완료] ${storagePath}`)
    }
  }

  return newUrls
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY가 필요합니다. .env.local을 확인하세요.')
    process.exit(1)
  }

  await ensureBucket()

  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  console.log(`\n${files.length}개 동물 이미지 마이그레이션 시작\n`)

  for (const file of files) {
    const filePath = join(DATA_DIR, file)
    const animal: Animal = JSON.parse(readFileSync(filePath, 'utf-8'))
    console.log(`[처리중] ${animal.slug} (이미지 ${animal.images.length}장)`)

    const newUrls = await migrateAnimal(animal)
    animal.images = newUrls

    writeFileSync(filePath, JSON.stringify(animal, null, 2), 'utf-8')
    await sleep(500) // Storage rate limit 대응
  }

  console.log('\n마이그레이션 완료!')
  console.log('※ 오염된 이미지(broken)는 수동으로 교체해야 합니다.')
  console.log('  영향 동물: bison, brown-bear, camel, cheetah, chimpanzee,')
  console.log('  deer, elephant, fox, giant-panda, giraffe, gorilla, hedgehog, hippopotamus, hyena, jaguar')
}

main()
