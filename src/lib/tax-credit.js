/** 2025년 소득 / 2026년 정기 신청. 공식 산정표를 대체하지 않는 연속 근사식.
 * 근거·검증 범위: src/lib/editorial.js 및 /editorial/.
 * 최소지급액 특례, 세액공제, 체납 충당, 실제 산정표 반올림은 구현하지 않는다.
 */
export const TAX_YEAR = 2025;
export const PROPERTY_DATE = '2025-06-01';
export const RULES = {
  single: {label: '단독가구', rise: 4e6, flat: 9e6, limit: 22e6, max: 165e4},
  one: {label: '홑벌이가구', rise: 7e6, flat: 14e6, limit: 32e6, max: 285e4},
  dual: {label: '맞벌이가구', rise: 8e6, flat: 17e6, limit: 44e6, max: 330e4},
};
export function parseAmount(raw) {
  if (raw.trim() === '') return null;
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(raw.trim())) throw new Error('금액은 0 이상의 정수로 입력하세요. 쉼표는 세 자리 단위로 넣어 주세요.');
  const value = Number(raw.replaceAll(',', ''));
  if (!Number.isSafeInteger(value)) throw new Error('입력 금액이 너무 큽니다. 원 단위를 확인하세요.');
  return value;
}
export function estimateCredit({kind, household, salary, totalIncome, property, kids = 0, late = false}) {
  const rule = RULES[household];
  if (!rule || !['labor', 'child'].includes(kind) || (kind === 'child' && household === 'single')) throw new Error('가구 유형을 확인하세요.');
  for (const value of [salary, totalIncome, property]) {
    if (value !== null && (!Number.isSafeInteger(value) || value < 0)) throw new Error('금액은 0 이상의 정수여야 합니다.');
  }
  if (salary === null) throw new Error('2025년 연간 총급여액 등을 입력하세요.');
  if (!Number.isInteger(kids) || kids < 0 || kids > 20) throw new Error('자녀 수는 0~20명의 정수로 입력하세요.');
  if (household === 'dual' && salary < 6e6) throw new Error('맞벌이는 각각 총급여액 등이 300만원 이상이어야 합니다. 가구 구분을 다시 확인하세요.');
  const pending = ['국적·거주·가구원 요건 및 신청 제외 조건', '공식 산정표의 세부 구간·최소 지급 특례·체납 충당'];
  if (totalIncome === null) pending.push('총소득 미입력: 소득 신청 요건 미확인');
  if (property === null) pending.push('재산 미입력: 재산 요건 및 감액 미확인');
  if (kind === 'child') pending.push('자녀의 나이·소득·부양 요건, 자녀세액공제 중복 조정');
  const limit = kind === 'child' ? 7e7 : rule.limit;
  let reason = '';
  if (totalIncome !== null && totalIncome >= limit) reason = '입력한 총소득이 이 제도의 신청 기준 이상입니다.';
  if (property !== null && property >= 24e7) reason = '입력한 재산이 2억 4천만원 이상입니다.';
  if (kind === 'child' && kids === 0) reason = '부양자녀 수가 0명입니다.';
  if (reason) return {amount: null, reason, pending, steps: []};
  if (salary === 0) return {amount: null, reason: '근로·사업·종교인 소득과 계산 대상 소득을 공식 안내에서 확인하세요. 0원 입력만으로 수급 여부를 판단하지 않습니다.', pending, steps: []};
  if (totalIncome !== null && totalIncome < salary) throw new Error('총소득이 총급여액 등보다 작습니다. 소득 종류와 금액을 다시 확인하세요.');
  let amount, formula, phase;
  const n = (v) => v.toLocaleString('ko-KR');
  if (kind === 'labor') {
    if (salary >= rule.limit) return {amount: null, reason: '총급여액 등이 계산 구간을 벗어났습니다. 총소득과 입력 기준을 확인하세요.', pending, steps: []};
    if (salary < rule.rise) {
      // 저소득 특례가 있는 구간은 정밀 산정표로 안내한다.
      return {amount: null, reason: '최대 지급 구간보다 낮은 소득은 산정표의 특례 확인이 필요합니다. 홈택스 계산을 이용하세요.', pending, steps: []};
    } else if (salary < rule.flat) {
      amount = rule.max; phase = '최대 지급 구간'; formula = `${rule.label} 최대 구간: ${n(rule.max)}원`;
    } else {
      amount = rule.max - (salary - rule.flat) * rule.max / (rule.limit - rule.flat);
      phase = '소득이 늘수록 감소하는 구간';
      formula = `${n(rule.max)} − (${n(salary)} − ${n(rule.flat)}) × ${n(rule.max)} ÷ ${n(rule.limit - rule.flat)}`;
    }
  } else {
    if (salary >= 7e7) return {amount: null, reason: '총급여액 등이 자녀장려금 계산 구간을 벗어났습니다.', pending, steps: []};
    const flat = household === 'dual' ? 25e6 : 21e6;
    amount = kids * (1e6 - Math.max(0, salary - flat) * 5e5 / (7e7 - flat));
    phase = salary <= flat ? '최대 지급 구간' : '소득이 늘수록 감소하는 구간';
    formula = `${kids}명 × [1,000,000 − ${n(Math.max(0, salary - flat))} × 500,000 ÷ ${n(7e7 - flat)}]`;
  }
  const steps = [`구간: ${phase}`, `감액 전 산식(원): ${formula}`];
  if (property !== null && property >= 17e7) { amount *= .5; steps.push('재산 1억 7천만원 이상: 근사액 × 50%'); }
  else steps.push(property === null ? '재산 미입력: 재산 감액 계산 생략' : '입력 재산 기준 추가 감액 없음');
  if (late) { amount *= .95; steps.push('기한 후 신청 가정: 근사액 × 95%'); }
  if (amount < 1e5) return {amount: null, reason: '소액 구간은 최소 지급 특례와 공식 산정표를 확인해야 합니다. 홈택스에서 계산하세요.', pending, steps};
  return {amount, pending, steps, reason: '입력한 조건의 구간별 근사액입니다. 수급 자격을 판정한 결과가 아닙니다.'};
}
