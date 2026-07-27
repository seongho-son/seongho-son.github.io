import data from '../data/welfare-local.json';

export interface Service {
  id: string;
  name: string;
  summary: string;
  sido: string;
  sigungu: string;
  dept: string;
  applyMethod: string;
  provision: string;
  cycle: string;
  lifecycle: string;
  themes: string;
  link: string;
  views: number;
  updated: string;
}

/**
 * 시군구 개별 페이지 생성 스위치.
 * 애드센스 심사(2026-07 기준 "준비 중") 동안에는 자동 생성 페이지가 기존 콘텐츠 수를 압도하지 않도록
 * false 로 두고 시·도 페이지 16개만 배포한다. 승인되면 true 로 바꾸고 재배포하면 200개가 열린다.
 */
export const ENABLE_SIGUNGU_PAGES = false;

/** 시군구 페이지를 따로 만드는 최소 제도 수. 이보다 적으면 시도 페이지에만 노출(얇은 페이지 방지). */
export const MIN_SERVICES_FOR_PAGE = 5;

export const SOURCE = data.source as string;
export const FETCHED_AT = data.fetchedAt as string;
const rows = data.rows as Service[];

/** 시도명 → URL 슬러그 (고정 표기) */
const SIDO_SLUG: Record<string, string> = {
  서울특별시: 'seoul',
  부산광역시: 'busan',
  대구광역시: 'daegu',
  인천광역시: 'incheon',
  광주광역시: 'gwangju',
  대전광역시: 'daejeon',
  울산광역시: 'ulsan',
  세종특별자치시: 'sejong',
  경기도: 'gyeonggi',
  강원특별자치도: 'gangwon',
  충청북도: 'chungbuk',
  충청남도: 'chungnam',
  전북특별자치도: 'jeonbuk',
  전라남도: 'jeonnam',
  경상북도: 'gyeongbuk',
  경상남도: 'gyeongnam',
  제주특별자치도: 'jeju',
};

/** 시도 짧은 이름 (제목·본문용) */
const SIDO_SHORT: Record<string, string> = {
  서울특별시: '서울',
  부산광역시: '부산',
  대구광역시: '대구',
  인천광역시: '인천',
  광주광역시: '광주',
  대전광역시: '대전',
  울산광역시: '울산',
  세종특별자치시: '세종',
  경기도: '경기',
  강원특별자치도: '강원',
  충청북도: '충북',
  충청남도: '충남',
  전북특별자치도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주',
};

const CHO = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
// 종성 28개(없음 + ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ) — 개수가 어긋나면 ㅇ이 t로 나온다
const JONG = ['','k','k','k','n','n','n','t','l','k','m','p','t','t','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];

/** 한글 → 로마자 (URL 슬러그용 근사 표기, 자음동화 미적용) */
function romanize(korean: string): string {
  let out = '';
  for (const ch of korean) {
    const code = ch.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) continue;
    out += CHO[Math.floor(code / 588)] + JUNG[Math.floor((code % 588) / 28)] + JONG[code % 28];
  }
  return out;
}

/** 자음동화가 적용돼 규칙 변환과 표준 표기가 다른 지명 */
const SLUG_OVERRIDE: Record<string, string> = {
  종로구: 'jongno-gu',
  울릉군: 'ulleung-gun',
  중랑구: 'jungnang-gu',
  강릉시: 'gangneung-si',
  동래구: 'dongnae-gu',
};

/** 시군구명 → 슬러그 (예: 성남시 → seongnam-si, 옥천군 → okcheon-gun) */
export function sigunguSlug(name: string): string {
  if (SLUG_OVERRIDE[name]) return SLUG_OVERRIDE[name];
  const suffix = name.slice(-1);
  const tail = { 시: '-si', 군: '-gun', 구: '-gu' }[suffix];
  return tail ? romanize(name.slice(0, -1)) + tail : romanize(name);
}

export const sidoSlug = (sido: string) => SIDO_SLUG[sido] ?? romanize(sido);
export const sidoShort = (sido: string) => SIDO_SHORT[sido] ?? sido;

/** 지자체가 아닌 값(교육청·'-' 등)을 걸러낸다 */
const isRealSigungu = (name: string) => /[시군구]$/.test(name) && !name.includes('교육청');

export interface SigunguGroup {
  name: string;
  slug: string;
  services: Service[];
  hasPage: boolean;
}

export interface SidoGroup {
  name: string;
  short: string;
  slug: string;
  /** 시군구 없이 시도가 직접 시행하는 사업 */
  wideServices: Service[];
  sigungus: SigunguGroup[];
  total: number;
}

function build(): SidoGroup[] {
  const map = new Map<string, { wide: Service[]; sgg: Map<string, Service[]> }>();
  for (const r of rows) {
    if (!r.sido || !SIDO_SLUG[r.sido]) continue;
    if (!map.has(r.sido)) map.set(r.sido, { wide: [], sgg: new Map() });
    const entry = map.get(r.sido)!;
    if (r.sigungu && isRealSigungu(r.sigungu)) {
      if (!entry.sgg.has(r.sigungu)) entry.sgg.set(r.sigungu, []);
      entry.sgg.get(r.sigungu)!.push(r);
    } else {
      entry.wide.push(r);
    }
  }

  const groups = [...map.entries()]
    .map(([name, { wide, sgg }]) => {
      const sigungus = [...sgg.entries()]
        .map(([sName, services]) => ({
          name: sName,
          slug: sigunguSlug(sName),
          services,
          hasPage: ENABLE_SIGUNGU_PAGES && services.length >= MIN_SERVICES_FOR_PAGE,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

      // 슬러그 충돌은 조용히 넘기면 페이지가 덮어써지므로 빌드를 실패시킨다
      const seen = new Set<string>();
      for (const s of sigungus) {
        if (seen.has(s.slug)) throw new Error(`시군구 슬러그 충돌: ${name} ${s.name} (${s.slug})`);
        seen.add(s.slug);
      }

      return {
        name,
        short: sidoShort(name),
        slug: sidoSlug(name),
        wideServices: wide,
        sigungus,
        total: wide.length + sigungus.reduce((n, s) => n + s.services.length, 0),
      };
    })
    .sort((a, b) => b.total - a.total);

  return groups;
}

export const sidoGroups: SidoGroup[] = build();

export const findSido = (slug: string) => sidoGroups.find((g) => g.slug === slug);

export const TOTAL_SERVICES = sidoGroups.reduce((n, g) => n + g.total, 0);

/** 제도 목록에서 상위 테마를 세어 지역 요약 문장에 쓴다 */
export function topThemes(services: Service[], limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const s of services) {
    for (const t of s.themes.split(',').map((x) => x.trim())) {
      if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'))
    .slice(0, limit)
    .map(([t]) => t);
}

/** 생애주기(영유아·아동·청소년·청년·중장년·노년) 분포 */
export function lifecycleCounts(services: Service[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const s of services) {
    for (const t of s.lifecycle.split(',').map((x) => x.trim())) {
      if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  const order = ['임신·출산', '영유아', '아동', '청소년', '청년', '중장년', '노년'];
  const rank = (k: string) => {
    const i = order.indexOf(k);
    return i === -1 ? order.length : i;
  };
  return [...counts.entries()].sort((a, b) => rank(a[0]) - rank(b[0]) || b[1] - a[1]);
}

/** 받침 유무에 따라 조사를 고른다 (예: 성남시 → '가', 옥천군 → '이') */
export function josa(word: string, withBatchim: string, withoutBatchim: string): string {
  const last = word.charCodeAt(word.length - 1) - 0xac00;
  if (last < 0 || last > 11171) return withoutBatchim;
  return last % 28 === 0 ? withoutBatchim : withBatchim;
}
