import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { Animal } from './types'

const DATA_DIR = join(process.cwd(), 'scripts', 'data')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function uploadAnimal(animal: Animal) {
  // 1. animals 테이블 upsert
  const { data: animalRow, error: animalError } = await supabase
    .from('animals')
    .upsert(
      {
        slug: animal.slug,
        name_scientific: animal.name_scientific,
        family_scientific: animal.family_scientific,
        category: animal.category,
        lifespan_min: animal.lifespan_min,
        lifespan_max: animal.lifespan_max,
        height_min: animal.height_min,
        height_max: animal.height_max,
        weight_min: animal.weight_min,
        weight_max: animal.weight_max,
        diet: animal.diet,
        images: animal.images,
        sound_url: animal.sound_url,
      },
      { onConflict: 'slug' },
    )
    .select('id')
    .single()

  if (animalError) {
    console.error(`[오류] ${animal.slug} animals 삽입 실패:`, animalError.message)
    return
  }

  const animalId = animalRow.id

  // 2. animal_translations 테이블 upsert (ko, en)
  const locales = ['ko', 'en'] as const
  for (const locale of locales) {
    const t = animal.translations[locale]
    if (!t) continue

    const { error: transError } = await supabase.from('animal_translations').upsert(
      {
        animal_id: animalId,
        locale,
        name: t.name,
        family_name: t.family_name,
        description: t.description,
        fun_fact: t.fun_fact,
        habitat: t.habitat,
        tags: t.tags,
      },
      { onConflict: 'animal_id,locale' },
    )

    if (transError) {
      console.error(`[오류] ${animal.slug} (${locale}) 번역 삽입 실패:`, transError.message)
    }
  }

  console.log(`[완료] ${animal.slug}`)
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('NEXT_PUBLIC_SUPABASE_URL이 없습니다.')
    process.exit(1)
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY가 없습니다. .env.local을 확인하세요.')
    process.exit(1)
  }

  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  console.log(`${files.length}개 파일 업로드 시작\n`)

  for (const file of files) {
    const animal: Animal = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8'))
    await uploadAnimal(animal)
  }

  console.log('\n업로드 완료!')
}

main()
