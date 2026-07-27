/** 2026년 기준 중위소득(월, 원) — 보건복지부 고시. 페이지 표와 계산기 스크립트가 같은 값을 쓰도록 여기서만 정의한다. */
export const MEDIAN_2026 = [2_564_238, 4_199_292, 5_359_036, 6_494_738, 7_556_719, 8_555_952];

/** 7인 이상 가구는 1인 늘 때마다 (6인 − 5인) 차액을 더한다 */
export const MEDIAN_STEP = MEDIAN_2026[5] - MEDIAN_2026[4];

export const medianFor = (size: number) =>
  size <= 6 ? MEDIAN_2026[size - 1] : MEDIAN_2026[5] + MEDIAN_STEP * (size - 6);
