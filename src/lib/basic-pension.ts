/**
 * 기초연금 계산기 상수 — 페이지(표)와 스크립트(계산)가 같은 값을 쓴다.
 *
 * ⚠️ 금액은 보건복지부가 해마다 고시한다. 아래는 2025년 확정 기준값이며,
 *    2026년 고시가 확정되면 숫자만 갱신하면 된다(구조는 그대로).
 *    실제 수령액은 소득역전방지 감액·국민연금 연계 감액 등으로 줄 수 있어
 *    이 계산기는 "월 최대"의 참고용 추정만 제공한다.
 */
export const BP_YEAR = 2025;
export const BP_SOURCE = '보건복지부 기초연금 사업';
export const BP_CONFIRMED_AT = '2026-08';

/** 선정기준액(월 소득인정액 상한, 원). 이 값 이하라야 대상이 된다. */
export const SELECTION_SINGLE = 2_280_000; // 단독가구
export const SELECTION_COUPLE = 3_648_000; // 부부가구

/** 기준연금액(단독가구 월 최대, 원). */
export const MAX_PENSION_SINGLE = 342_510;
/** 부부가 함께 받으면 각자 20% 감액. */
export const COUPLE_REDUCTION = 0.2;
/** 부부가구 합산 월 최대(각자 20% 감액 후 2인). */
export const MAX_PENSION_COUPLE = Math.round(MAX_PENSION_SINGLE * (1 - COUPLE_REDUCTION)) * 2;

export type HouseholdType = 'single' | 'couple';

export interface BpResult {
  eligible: boolean;
  threshold: number; // 선정기준액
  gap: number; // 선정기준액 - 소득인정액 (양수=여유, 음수=초과)
  maxMonthly: number; // 예상 월 최대 수령액(가구 기준)
}

/** 소득인정액과 가구형태로 대상 가능성과 월 최대 수령액(참고용)을 추정한다. */
export function estimateBasicPension(type: HouseholdType, incomeRecognized: number): BpResult {
  const threshold = type === 'single' ? SELECTION_SINGLE : SELECTION_COUPLE;
  const maxMonthly = type === 'single' ? MAX_PENSION_SINGLE : MAX_PENSION_COUPLE;
  return {
    eligible: incomeRecognized <= threshold,
    threshold,
    gap: threshold - incomeRecognized,
    maxMonthly,
  };
}
