export const TOOLS = [
  {href: '/tools/labor-tax-credit', title: '근로장려금 계산 근거', desc: '총소득과 총급여액을 구분하고, 구간별 근사액과 재산 감액을 확인합니다.'},
  {href: '/tools/child-tax-credit', title: '자녀장려금 계산 근거', desc: '부양자녀 수에 따른 근사액과 별도로 확인할 공제 항목을 확인합니다.'},
];
export function toolLabel(href: string): string | null {
  return TOOLS.find(t => t.href === href)?.title ?? null;
}
