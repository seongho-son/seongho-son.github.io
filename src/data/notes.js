// 레시피 비교·계량 노트 목록과, 노트 페이지가 레시피 데이터에서 분량을 읽어오는 도우미.
// 분량은 절대 여기서 다시 적지 않고 recipes.js 의 재료표에서 그대로 가져온다.
import { recipes } from './recipes.js';

export const notes = [
  {
    slug: 'jjigae-seasoning-compare',
    path: '/notes/jjigae-seasoning-compare/',
    title: '찌개 양념 비교, 물과 장은 얼마나 다를까',
    short: '찌개·짜글이·닭볶음탕 다섯 가지의 물과 양념 비교',
    description: '김치찌개, 된장찌개, 스팸순두부찌개, 감자짜글이, 닭볶음탕의 물과 양념 분량을 한 표에 모아 시작 방식과 간 맞추는 순서를 비교했어요.',
  },
  {
    slug: 'noodle-compare',
    path: '/notes/noodle-compare/',
    title: '국수 양념 비교, 오늘은 어떤 면으로 할까',
    short: '비빔국수·잔치국수·간장비빔국수·볶음우동 양념 비교',
    description: '고추장 비빔국수, 잔치국수, 간장 비빔국수, 볶음우동의 양념 구성을 한 표에 모으고 상황별로 고르는 기준을 정리했어요.',
  },
  {
    slug: 'paper-cup-measuring',
    path: '/notes/paper-cup-measuring/',
    title: '종이컵·밥숟가락 계량 가이드',
    short: '180ml 종이컵, 밥숟가락, 인분 환산 기준 안내',
    description: '이 블로그 레시피의 종이컵(180ml)과 밥숟가락 계량 기준, 무게와 부피를 구분하는 이유, 1–2인분과 3–4인분을 나누는 방법을 정리했어요.',
  },
];

export const findRecipe = path => recipes.find(entry => entry.recipeMeta.path === path);

// 재료명이 정규식에 맞는 행을 [재료명, 1–2인분, 3–4인분] 그대로 돌려준다.
export const rowsMatching = (recipe, pattern, exclude) =>
  (recipe?.ingredients ?? []).filter(([name]) => pattern.test(name) && !(exclude && exclude.test(name)));

// 표 칸에 쓸 문자열. col 1 = 1–2인분, col 2 = 3–4인분.
export const cell = (recipe, pattern, col = 1, exclude) => {
  const rows = rowsMatching(recipe, pattern, exclude);
  return rows.length ? rows.map(row => `${row[0]} ${row[col]}`).join(' · ') : '—';
};

// 본문에 분량을 인용할 때 쓰는 값. 재료명이 바뀌어 못 찾으면 숫자를 지어내지 않고 표 참고로 안내한다.
export const amount = (recipe, name, col = 1) => {
  const row = (recipe?.ingredients ?? []).find(([n]) => n === name || n.split(' · ')[0] === name);
  if (!row) {
    console.warn(`[notes] ${recipe?.recipeMeta?.path ?? '?'}: 재료 '${name}'을 찾지 못했어요.`);
    return '(레시피 표 참고)';
  }
  return row[col];
};
