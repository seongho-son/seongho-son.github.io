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
  {
    href: '/tools/basic-pension',
    emoji: '👵',
    title: '기초연금 계산기',
    desc: '만 65세 이상, 소득인정액으로 대상 여부와 예상 월 수령액을 계산',
  },
];

/**
 * relatedTool 경로 → 링크 문구.
 * 글 하단 CTA가 "관련 계산기"라고만 하면 어디로 가는지 알 수 없어, 무관한 계산기가 떠도
 * 사용자는 클릭한 뒤에야 안다(실제로 청년내일저축계좌 글에 근로장려금 계산기가 걸려 있었다).
 * 도구 이름을 그대로 노출해 클릭 전에 기대가 맞도록 한다.
 */
export function toolLabel(href: string): string | null {
  if (href === '/check') return '내가 받을 수 있는 지원금 한 번에 진단하기';
  const t = TOOLS.find((x) => x.href === href);
  return t ? `${t.title}로 계산해보기` : null;
}
