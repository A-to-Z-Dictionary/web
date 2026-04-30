import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'scripts', 'data')

const FAMILY_NAMES: Record<string, { ko: string; en: string }> = {
  lion:          { ko: '고양이과',      en: 'Felidae' },
  tiger:         { ko: '고양이과',      en: 'Felidae' },
  leopard:       { ko: '고양이과',      en: 'Felidae' },
  cheetah:       { ko: '고양이과',      en: 'Felidae' },
  jaguar:        { ko: '고양이과',      en: 'Felidae' },
  hyena:         { ko: '하이에나과',    en: 'Hyaenidae' },
  kangaroo:      { ko: '캥거루과',      en: 'Macropodidae' },
  koala:         { ko: '코알라과',      en: 'Phascolarctidae' },
  'komodo-dragon': { ko: '왕도마뱀과', en: 'Varanidae' },
  meerkat:       { ko: '몽구스과',      en: 'Herpestidae' },
  orangutan:     { ko: '사람과',        en: 'Hominidae' },
  'polar-bear':  { ko: '곰과',          en: 'Ursidae' },
  'brown-bear':  { ko: '곰과',          en: 'Ursidae' },
  raccoon:       { ko: '아메리카너구리과', en: 'Procyonidae' },
  rhinoceros:    { ko: '코뿔소과',      en: 'Rhinocerotidae' },
  sloth:         { ko: '나무늘보과',    en: 'Bradypodidae' },
  'wild-boar':   { ko: '멧돼지과',      en: 'Suidae' },
  wolf:          { ko: '개과',          en: 'Canidae' },
  fox:           { ko: '개과',          en: 'Canidae' },
  zebra:         { ko: '말과',          en: 'Equidae' },
  elephant:      { ko: '코끼리과',      en: 'Elephantidae' },
  giraffe:       { ko: '기린과',        en: 'Giraffidae' },
  hippopotamus:  { ko: '하마과',        en: 'Hippopotamidae' },
  gorilla:       { ko: '사람과',        en: 'Hominidae' },
  chimpanzee:    { ko: '사람과',        en: 'Hominidae' },
  deer:          { ko: '사슴과',        en: 'Cervidae' },
  'giant-panda': { ko: '곰과',          en: 'Ursidae' },
  camel:         { ko: '낙타과',        en: 'Camelidae' },
  bison:         { ko: '소과',          en: 'Bovidae' },
  hedgehog:      { ko: '고슴도치과',    en: 'Erinaceidae' },
}

const LIFESPAN_FIXES: Record<string, { min: number; max: number }> = {
  camel:          { min: 17, max: 50 },
  cheetah:        { min: 10, max: 12 },
  'giant-panda':  { min: 15, max: 20 },
  kangaroo:       { min: 6,  max: 23 },
  koala:          { min: 13, max: 18 },
  'komodo-dragon':{ min: 30, max: 30 },
  leopard:        { min: 12, max: 17 },
  meerkat:        { min: 12, max: 14 },
  raccoon:        { min: 2,  max: 5  },
  zebra:          { min: 20, max: 25 },
}

const DIET_FIXES: Record<string, 'carnivore' | 'herbivore' | 'omnivore'> = {
  zebra: 'herbivore',
}

function patchFile(slug: string) {
  const filePath = join(DATA_DIR, `${slug}.json`)
  const data = JSON.parse(readFileSync(filePath, 'utf-8'))
  let changed = false

  // family_name 패치
  const family = FAMILY_NAMES[slug]
  if (family) {
    if (!data.translations?.ko?.family_name) {
      data.translations.ko.family_name = family.ko
      changed = true
    }
    if (!data.translations?.en?.family_name) {
      data.translations.en.family_name = family.en
      changed = true
    }
  }

  // lifespan 패치
  const lifespan = LIFESPAN_FIXES[slug]
  if (lifespan && data.lifespan_min === 0 && data.lifespan_max === 0) {
    data.lifespan_min = lifespan.min
    data.lifespan_max = lifespan.max
    changed = true
  }

  // diet 패치
  const diet = DIET_FIXES[slug]
  if (diet && data.diet !== diet) {
    data.diet = diet
    changed = true
  }

  if (changed) {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`[패치] ${slug}`)
  } else {
    console.log(`[스킵] ${slug}`)
  }
}

const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
files.forEach(f => patchFile(f.replace('.json', '')))
console.log('\n패치 완료!')
