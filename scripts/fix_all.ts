/**
 * fix_all.ts
 * API 호출 없이 로컬에서 모든 데이터 품질 이슈를 수정합니다.
 *
 * 수정 목록:
 * 1. 반말 → 존댓말 (wolf, meerkat, brown-bear, camel, elephant, hyena, gorilla, zebra)
 * 2. diet 오류 (brown-bear: omnivo, wild-boar/hedgehog: omnivorous → omnivore)
 * 3. name_scientific 오류 (meerkat: "학명", hyena/deer/elephant: 과명=종명)
 * 4. habitat 빈칸 (leopard)
 * 5. 치수 누락 (zebra, camel)
 * 6. family_scientific 오류 (bison: Felidae→Bovidae)
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'scripts', 'data')

function fix(slug: string, updater: (data: any) => void) {
  const filePath = join(DATA_DIR, `${slug}.json`)
  const data = JSON.parse(readFileSync(filePath, 'utf-8'))
  updater(data)
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`[수정] ${slug}`)
}

// ─── 1. 반말 → 존댓말 ────────────────────────────────────────────────────────

fix('wolf', d => {
  d.translations.ko.description =
    '늑대는 똑똑하고 용감한 동물 친구예요. 주로 회색 털을 가졌지만, 어떤 늑대는 하얀색, 갈색, 검은색 털을 가지고 있어요. 북아메리카와 유라시아의 넓은 곳에서 무리를 지어 살고, 우리 강아지랑도 아주 먼 친척이랍니다!'
  d.translations.ko.fun_fact =
    '우리 집에서 키우는 귀여운 강아지가 사실 늑대의 먼 후손이라는 것을 알고 있었나요? 늑대와 강아지는 아주 오랜 옛날부터 친척 사이랍니다!'
})

fix('meerkat', d => {
  d.name_scientific = 'Suricata suricatta'
  d.translations.ko.description =
    '미어캣은 남아프리카의 뜨거운 땅에서 친구들과 함께 살아가는 귀여운 동물 친구예요. 큰 눈과 뾰족한 코, 그리고 등에 예쁜 줄무늬가 있답니다. 튼튼한 발톱으로 땅을 아주 잘 파서 굴을 만들고 그 안에서 함께 잠을 자고 쉬어요.'
  d.translations.ko.fun_fact =
    '미어캣은 키가 작지만 아주 먼 곳까지 볼 수 있어요! 두 발로 꼿꼿이 서서 주변을 살펴보며 가족들을 위해 경계병 역할을 하는 아주 용감한 동물이랍니다!'
})

fix('brown-bear', d => {
  d.diet = 'omnivore'
  d.translations.ko.description =
    '갈색곰은 유라시아와 북아메리카에 사는 아주 큰 곰이에요. 몸집이 크고 힘이 세지만, 먹이를 찾을 때는 땅을 파는 것도 아주 잘한답니다. 넓적한 발과 튼튼한 어깨 덕분에 땅속 뿌리나 곤충도 쉽게 찾아낼 수 있어요.'
  d.translations.ko.fun_fact =
    '갈색곰은 어깨에 특별한 혹 같은 근육이 있어서 땅을 팔 때 삽처럼 쓸 수 있대요! 발도 엄청 커서 길이가 36cm나 된답니다!'
})

fix('camel', d => {
  d.height_min = 180
  d.height_max = 230
  d.weight_min = 400
  d.weight_max = 690
  d.translations.ko.description =
    '낙타는 등에 볼록한 혹을 가진 특별한 동물 친구예요. 뜨거운 사막에서 살면서 사람들을 태워 주거나 무거운 짐을 나르는 데 큰 도움을 준답니다. 혹이 하나인 낙타도 있고, 두 개인 낙타도 있어요!'
  d.translations.ko.fun_fact =
    '낙타의 혹에는 물이 아니라 지방(에너지)이 저장되어 있어서, 며칠 동안 물을 마시지 않고도 사막을 여행할 수 있대요!'
})

fix('elephant', d => {
  d.name_scientific = 'Loxodonta africana'
  d.translations.ko.description =
    '코끼리는 세상에서 가장 큰 육상 동물이에요. 길고 튼튼한 코를 자유자재로 움직여서 풀을 뜯거나 물을 마시고, 친구들과 인사도 한답니다. 커다란 귀와 상아를 가진 코끼리는 가족과 함께 무리를 지어 생활하는 사이좋은 동물이에요.'
  d.translations.ko.fun_fact =
    '코끼리의 코에는 무려 40,000개 이상의 근육이 있대요! 그래서 무거운 통나무도 번쩍 들고, 바닥에 떨어진 작은 풀 한 가닥도 섬세하게 집을 수 있어요!'
})

fix('hyena', d => {
  d.name_scientific = 'Crocuta crocuta'
  d.translations.ko.description =
    '하이에나는 아프리카에 사는 아주 특별한 동물 친구예요. 고양이처럼 생겼지만 강아지와 비슷한 점도 많은 신기한 동물이에요. 밤에 사냥을 하기도 하고, 다른 동물이 먹다 남긴 음식도 깨끗이 치우는 똑똑한 청소부이기도 해요. 무리를 지어 살면서 \'낄낄\' 웃는 것 같은 독특한 소리를 내는 것으로 유명하답니다.'
})

fix('gorilla', d => {
  d.translations.ko.fun_fact =
    '고릴라와 사람이 얼마나 닮았는지 알고 있나요? 우리 몸을 만드는 DNA가 무려 96~99%나 똑같대요! 정말 신기하죠?'
})

fix('zebra', d => {
  d.height_min = 110
  d.height_max = 145
  d.weight_min = 200
  d.weight_max = 450
  d.translations.ko.description =
    '얼룩말은 아프리카에 사는 멋진 줄무늬 동물 친구예요. 몸에는 검은색과 흰색 줄무늬가 가득한데, 이 줄무늬는 사람의 지문처럼 모두 달라서 세상에 똑같은 무늬를 가진 얼룩말은 단 한 마리도 없답니다. 말이나 당나귀와 친척이고, 줄무늬가 파리 같은 곤충들을 쫓는 역할도 해요!'
})

// ─── 2. diet 오류 ────────────────────────────────────────────────────────────

fix('wild-boar', d => { d.diet = 'omnivore' })
fix('hedgehog', d => { d.diet = 'omnivore' })

// ─── 3. name_scientific / family_scientific 오류 ─────────────────────────────

fix('rhinoceros', d => {
  d.name_scientific = 'Ceratotherium simum'
  // family_scientific: Rhinocerotidae → OK
})

fix('deer', d => {
  d.name_scientific = 'Cervus elaphus'
  // family_scientific: Cervidae → OK
})

// ─── 4. habitat 빈칸 ─────────────────────────────────────────────────────────

fix('leopard', d => {
  d.translations.ko.habitat = ['아프리카 사바나', '아시아 숲', '초원', '산악 지역']
  d.translations.en.habitat = ['African savannas', 'Asian forests', 'Grasslands', 'Mountain regions']
})

// ─── 5. family_scientific 오류 (bison) ───────────────────────────────────────
// bison의 family_scientific이 "Felidae"로 잘못 설정되어 있었던 경우 방어용

fix('bison', d => {
  if (d.family_scientific === 'Felidae') d.family_scientific = 'Bovidae'
})

console.log('\n모든 수정 완료!')
