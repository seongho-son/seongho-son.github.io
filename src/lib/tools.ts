/** 계산기 목록 단일 소스 — 홈(index)과 계산기 허브(/tools)가 같은 배열을 쓴다. */
export interface Tool {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}

export const TOOLS: Tool[] = [
  {
    href: '/tools/labor-tax-credit',
    emoji: '💸',
    title: '근로장려금 계산기',
    desc: '가구유형·소득만 넣으면 예상 장려금을 바로 계산',
  },
  {
    href: '/tools/child-tax-credit',
    emoji: '🧒',
    title: '자녀장려금 계산기',
    desc: '부양자녀 수·소득으로 예상 지급액 계산 (근로장려금과 중복 가능)',
  },
  {
    href: '/tools/parenting-benefit',
    emoji: '👶',
    title: '출산·육아 지원금 총액 계산기',
    desc: '부모급여+첫만남+아동수당 총액 시뮬레이션',
  },
  {
    href: '/tools/youth-rent',
    emoji: '🏠',
    title: '청년월세 지원 자격 체크',
    desc: '소득·나이·주거 조건으로 대상 여부 자가진단',
  },
  {
    href: '/tools/unemployment-benefit',
    emoji: '💼',
    title: '실업급여 예상 수령액 계산기',
    desc: '나이·가입기간·평균임금으로 총 수령액 계산',
  },
  {
    href: '/tools/median-income',
    emoji: '📊',
    title: '기준 중위소득 계산기',
    desc: '내 소득이 중위소득 몇 %인지, 어떤 복지 커트라인에 드는지 확인',
  },
];
