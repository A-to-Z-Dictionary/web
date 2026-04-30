export interface AnimalTranslation {
  name: string
  family_name: string
  description: string
  fun_fact: string
  habitat: string[]
  tags: string[]
}

export interface Animal {
  slug: string
  name_scientific: string
  family_scientific: string
  category: 'land' | 'sea' | 'insect' | 'dinosaur'
  lifespan_min: number
  lifespan_max: number
  height_min: number
  height_max: number
  weight_min: number
  weight_max: number
  diet: 'carnivore' | 'herbivore' | 'omnivore'
  images: string[]
  sound_url: string
  translations: {
    ko: AnimalTranslation
    en: AnimalTranslation
  }
}

export interface AnimalListItem {
  slug: string
  name_ko: string
  name_en: string
  wiki_title: string
}
