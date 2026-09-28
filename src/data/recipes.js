import * as kimchi from './kimchi-jjigae.js';
import * as jeyuk from './kim-seoul-jeyuk.js';
import { additionalRecipes } from './more-recipes.js';
export const recipes = [
  ...additionalRecipes,
  {
    ...jeyuk, videoId: 'PlLBBlFEmLg', channel: '킴서울', category: '집밥 · 볶음',
    preview: '조회수 1,000만을 넘긴 제육볶음. 여러 레시피를 돌다 이걸로 정착했어요.',
    measureNote: '큰술은 밥숟가락 기준입니다. 원본 한 근 분량을 3–4인분으로, 절반을 1–2인분으로 나눈 편집상 기준입니다.',
    sourceNote: '킴서울의 작성자 고정 댓글을 기준으로 정리했습니다. 인분 환산과 손질 크기, 불 조절은 편집자가 덧붙였으며 직접 조리 검증 전입니다.',
  },
  {
    ...kimchi, videoId: 'qWbHSOplcvY', channel: '백종원 PAIK JONG WON', category: '집밥 · 찌개',
    preview: '돼지고기부터 푹 끓이는 김치찌개. 재료는 1–2인분과 3–4인분으로 나란히 적어뒀어요.',
    measureNote: '컵은 180ml 종이컵, 큰술은 밥숟가락 기준입니다. 김치와 고기는 잘라서 느슨하게 담습니다.',
    sourceNote: '백종원 채널의 영상 설명란을 정리한 글로, 직접 조리 검증 전입니다.',
  },
];
