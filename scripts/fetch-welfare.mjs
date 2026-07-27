#!/usr/bin/env node
/**
 * 지자체복지서비스(공공데이터포털 15108347) 목록을 전부 내려받아
 * src/data/welfare-local.json 으로 저장한다.
 *
 * - 인증키는 .env 의 DATA_GO_KR_KEY_ENCODED (커밋 금지)
 * - 결과 JSON은 커밋한다 → 빌드/배포 시에는 키가 필요 없고, API 장애와 무관하게 빌드가 재현된다
 * - 갱신하려면: node scripts/fetch-welfare.mjs
 *
 * ⚠️ 개발계정은 일일 트래픽 제한이 있다. 목록만 받으면 9~10회 호출로 끝난다(상세조회는 건당 1회라 미사용).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'src/data/welfare-local.json');
const BASE = 'https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist';
const PAGE_SIZE = 500;

function loadKey() {
  if (process.env.DATA_GO_KR_KEY_ENCODED) return process.env.DATA_GO_KR_KEY_ENCODED;
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) throw new Error('.env 가 없습니다. DATA_GO_KR_KEY_ENCODED 를 설정하세요.');
  const m = fs.readFileSync(envPath, 'utf8').match(/^DATA_GO_KR_KEY_ENCODED\s*=\s*"?([^"\n]+)"?/m);
  if (!m) throw new Error('.env 에 DATA_GO_KR_KEY_ENCODED 가 없습니다.');
  return m[1].trim();
}

const KEY = loadKey();

// 태그 하나만 뽑는 최소 파서 (응답이 단순 플랫 XML이라 정규식으로 충분)
const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1]).trim() : '';
};

async function fetchPage(pageNo) {
  const url = `${BASE}?serviceKey=${KEY}&pageNo=${pageNo}&numOfRows=${PAGE_SIZE}&callTp=L&srchKeyCode=003`;
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  const xml = await res.text();
  if (!res.ok || !xml.includes('<resultCode>0</resultCode>')) {
    throw new Error(`API 실패 (page ${pageNo}): ${xml.slice(0, 300)}`);
  }
  const total = parseInt(pick(xml, 'totalCount') || '0', 10);
  const rows = [...xml.matchAll(/<servList>([\s\S]*?)<\/servList>/g)].map(([, s]) => ({
    id: pick(s, 'servId'),
    name: pick(s, 'servNm'),
    summary: pick(s, 'servDgst'),
    sido: pick(s, 'ctpvNm'),
    sigungu: pick(s, 'sggNm'),
    dept: pick(s, 'bizChrDeptNm'),
    applyMethod: pick(s, 'aplyMtdNm'),
    provision: pick(s, 'srvPvsnNm'),
    cycle: pick(s, 'sprtCycNm'),
    lifecycle: pick(s, 'lifeNmArray'),
    themes: pick(s, 'intrsThemaNmArray'),
    link: pick(s, 'servDtlLink'),
    views: parseInt(pick(s, 'inqNum') || '0', 10),
    updated: pick(s, 'lastModYmd'),
  }));
  return { total, rows };
}

const all = [];
let page = 1;
let total = Infinity;
while (all.length < total) {
  const { total: t, rows } = await fetchPage(page);
  total = t;
  if (!rows.length) break;
  all.push(...rows);
  console.log(`page ${page}: +${rows.length} (${all.length}/${total})`);
  page += 1;
  if (page > 50) break; // 안전장치
}

// servId 중복 제거 + 안정 정렬(조회수 내림차순 → id) : 빌드 재현성 확보
const byId = new Map();
for (const r of all) if (r.id && !byId.has(r.id)) byId.set(r.id, r);
const rows = [...byId.values()].sort((a, b) => b.views - a.views || a.id.localeCompare(b.id));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: '공공데이터포털 한국사회보장정보원_지자체복지서비스(15108347)',
      fetchedAt: new Date().toISOString().slice(0, 10),
      count: rows.length,
      rows,
    },
    null,
    0
  ) + '\n'
);
console.log(`saved ${rows.length} rows → ${path.relative(ROOT, OUT)}`);
