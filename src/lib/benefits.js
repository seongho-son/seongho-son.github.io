/**
 * 제도별 산정 로직 단일 소스.
 *
 * 왜 한곳에 모으나: 같은 상수가 계산기 페이지마다 흩어져 있으면 제도값이 바뀔 때 한쪽만 고쳐
 * 조용히 어긋난다(이 사이트에서 실제로 겪은 문제). 개별 계산기와 통합 진단이 모두 이 파일을 쓴다.
 *
 * ⚠️ 값을 고칠 때는 아래 SOURCES 의 기준연도·출처도 함께 갱신하고,
 *    해당 제도를 설명하는 글(src/content/blog/*)의 수치와 어긋나지 않는지 확인할 것.
 */

export const SOURCES = {
  laborCredit: '국세청 근로장려금 산정표(조세특례제한법 시행령 별표11), 2024년 귀속 기준',
  childCredit: '국세청 자녀장려금 산정표(별표11의2), 2024년 귀속 기준',
  medianIncome: '보건복지부 2026년 기준 중위소득 고시',
  youthRent: '국토교통부 청년월세 한시 특별지원(2차) 사업 매뉴얼',
  parenting: '보건복지부 부모급여·아동수당·첫만남이용권 안내(2026년 기준)',
};

/* ─────────────────────────── 기준 중위소득 ─────────────────────────── */

export const MEDIAN_2026 = [2_564_238, 4_199_292, 5_359_036, 6_494_738, 7_556_719, 8_555_952];
export const MEDIAN_STEP = MEDIAN_2026[5] - MEDIAN_2026[4];

/** 가구원 수별 월 기준 중위소득. 7인 이상은 1인당 (6인−5인) 차액 가산 */
export const medianFor = (size) =>
  size <= 6 ? MEDIAN_2026[size - 1] : MEDIAN_2026[5] + MEDIAN_STEP * (size - 6);

/** 대표 커트라인(%) — 제도별 세부 요건은 별도 */
export const MEDIAN_CUTS = {
  생계급여: 30,
  의료급여: 40,
  주거급여: 48,
  교육급여: 50,
};

/* ─────────────────────────── 근로장려금 ─────────────────────────── */

// [점증 상한, 최대지급액, 평탄 종료, 총소득 상한]
export const LABOR_TABLE = {
  single: { label: '단독가구', inCap: 4_000_000, max: 1_650_000, flatEnd: 9_000_000, limit: 22_000_000 },
  one: { label: '홑벌이가구', inCap: 7_000_000, max: 2_850_000, flatEnd: 14_000_000, limit: 32_000_000 },
  dual: { label: '맞벌이가구', inCap: 8_000_000, max: 3_300_000, flatEnd: 17_000_000, limit: 44_000_000 },
};

/** 산정액이 이 금액 미만이면 지급하지 않음 (근로·자녀장려금 공통) */
export const MIN_PAYOUT = 15_000;

export function laborCredit(type, income) {
  const t = LABOR_TABLE[type];
  if (income <= 0) return { amount: 0, phase: '소득 없음', t };
  if (income >= t.limit) return { amount: 0, phase: `소득 상한(${won(t.limit)}) 초과 — 대상 아님`, t };
  if (income < t.inCap) {
    // 홑벌이가구의 400만원 미만 구간은 산정표상 단독가구와 동일한 금액이 적용됨
    if (type === 'one' && income < LABOR_TABLE.single.inCap) {
      const s = LABOR_TABLE.single;
      return {
        amount: (income * s.max) / s.inCap,
        phase: '점증 구간 (소득이 늘수록 증가, 400만원 미만은 단독가구와 동일)',
        t,
      };
    }
    return { amount: (income * t.max) / t.inCap, phase: '점증 구간 (소득이 늘수록 증가)', t };
  }
  if (income < t.flatEnd) return { amount: t.max, phase: '평탄 구간 (지급액 상한에 해당)', t };

  const amount = t.max - ((income - t.flatEnd) * t.max) / (t.limit - t.flatEnd);
  const cut = amount < MIN_PAYOUT ? 0 : amount;
  return {
    amount: Math.max(0, cut),
    phase:
      cut === 0
        ? `점감 구간 — 산정액이 최소지급액(${won(MIN_PAYOUT)}) 미만이라 미지급`
        : '점감 구간 (소득이 늘수록 감소)',
    t,
  };
}

/* ─────────────────────────── 자녀장려금 ─────────────────────────── */

export const CHILD_TABLE = {
  one: { label: '홑벌이가구', flatEnd: 21_000_000, denom: 49_000_000 },
  dual: { label: '맞벌이가구', flatEnd: 25_000_000, denom: 45_000_000 },
};
export const CHILD_LIMIT = 70_000_000;
export const CHILD_PER_MAX = 1_000_000;
export const CHILD_PER_TAPER = 500_000; // 점감 폭 → 자녀 1명당 하한 50만원

export function childCredit(type, kids, income) {
  const t = CHILD_TABLE[type];
  if (kids <= 0) return { amount: 0, phase: '부양자녀 없음 — 자녀장려금 대상 아님', t };
  if (income >= CHILD_LIMIT) {
    return { amount: 0, phase: `총소득 상한(${won(CHILD_LIMIT)}) 이상 — 대상 아님`, t };
  }
  if (income < t.flatEnd) {
    return { amount: kids * CHILD_PER_MAX, phase: `최대 지급 구간 (${won(t.flatEnd)} 미만)`, t };
  }
  const taper = ((income - t.flatEnd) * (kids * CHILD_PER_TAPER)) / t.denom;
  return {
    amount: Math.max(kids * CHILD_PER_MAX - taper, kids * CHILD_PER_TAPER),
    phase: '점감 구간 (소득이 늘수록 감소, 자녀 1명당 50만원까지)',
    t,
  };
}

/* ───────────────────── 재산 요건 (근로·자녀장려금 공통) ───────────────────── */

export const PROPERTY_CUT = 240_000_000; // 이상이면 제외
export const PROPERTY_HALF = 170_000_000; // 이상이면 50% 감액

export function applyProperty(amount, property) {
  if (!property || property <= 0) {
    return { amount, note: '재산 정보 미입력 (재산 요건 미반영)', missing: true };
  }
  if (property >= PROPERTY_CUT) return { amount: 0, note: '재산 2.4억원 이상 — 지급 대상 제외' };
  if (property >= PROPERTY_HALF) return { amount: amount * 0.5, note: '재산 1.7억~2.4억원 — 50% 감액 적용' };
  return { amount, note: '재산 요건 충족 (감액 없음)' };
}

/** 1,000원 단위 올림 + 최소지급액 미만 미지급 */
export const roundPayout = (amount) =>
  amount < MIN_PAYOUT ? 0 : Math.ceil(amount / 1000) * 1000;

/* ─────────────────────────── 청년월세 지원 ─────────────────────────── */

export const YOUTH_RENT = {
  ageMin: 19,
  ageMax: 34,
  depositCap: 50_000_000,
  rentCap: 700_000,
  convertedCap: 900_000, // 보증금 월세환산액 + 월세
  convRate: 0.055,
  selfIncomeRatio: 0.6, // 청년 본인 가구: 중위 60% 이하
  parentIncomeRatio: 1.0, // 원가구: 중위 100% 이하
  monthlyMax: 200_000,
  months: 24,
};

export const convertedRent = (deposit) =>
  Math.floor((deposit * YOUTH_RENT.convRate) / 12);

/* ─────────────────────────── 출산·육아 ─────────────────────────── */

export const PARENTING = {
  parentalBenefit0: 1_000_000, // 0세 월
  parentalBenefit1: 500_000, // 1세 월
  childAllowance: 100_000, // 8세 미만 월
  childAllowanceUntilAge: 8,
  firstMeetFirst: 2_000_000, // 첫만남이용권 첫째
  firstMeetOther: 3_000_000, // 둘째 이상
};

/* ─────────────────────────── 공통 포맷 ─────────────────────────── */

export function won(n) {
  return Math.round(n).toLocaleString('ko-KR') + '원';
}
