#!/usr/bin/env node
/**
 * 행정안전부_대한민국 공공서비스(혜택) 정보(공공데이터포털 15113968, odcloud)를 내려받아
 * src/data/benefits-gov24.json 으로 저장한다.
 *
 * - 인증키는 .env 의 DATA_GO_KR_KEY_DECODED (odcloud는 디코딩 키를 쓴다 — apis.data.go.kr 과 다름)
 * - 결과 JSON은 커밋한다 → 빌드에 키 불필요
 * - 원문(선정기준·지원내용 전문)은 저장하지 않는다. 목록·요약만 구조화하고 상세는 정부24 링크로 위임.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'src/data/benefits-gov24.json');
const URL_BASE = 'https://api.odcloud.kr/api/gov24/v3/serviceList';
const PER_PAGE = 1000;

function loadKey() {
  if (process.env.DATA_GO_KR_KEY_DECODED) return process.env.DATA_GO_KR_KEY_DECODED;
  const envPath = path.join(ROOT, '.env');
  const m = fs.readFileSync(envPath, 'utf8').match(/^DATA_GO_KR_KEY_DECODED\s*=\s*"?([^"\n]+)"?/m);
  if (!m) throw new Error('.env 에 DATA_GO_KR_KEY_DECODED 가 없습니다.');
  return m[1].trim();
}

const KEY = loadKey();

/** 줄바꿈·중복 공백을 정리하고 길이를 자른다 (원문 전재 방지 + JSON 크기 억제) */
const clean = (s, max) => {
  const t = String(s ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!max || t.length <= max) return t;
  return t.slice(0, max).replace(/[\s,·]+$/, '') + '…';
};

async function fetchPage(page) {
  const url = `${URL_BASE}?serviceKey=${encodeURIComponent(KEY)}&page=${page}&perPage=${PER_PAGE}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(90_000) });
  const json = await res.json();
  if (!res.ok || !json.data) throw new Error(`API 실패 (page ${page}): ${JSON.stringify(json).slice(0, 300)}`);
  return json;
}

const all = [];
let page = 1;
let total = Infinity;
while (all.length < total) {
  const json = await fetchPage(page);
  total = json.totalCount;
  if (!json.data.length) break;
  for (const r of json.data) {
    all.push({
      id: String(r['서비스ID'] ?? ''),
      name: clean(r['서비스명']),
      purpose: clean(r['서비스목적요약'], 160),
      field: clean(r['서비스분야']),
      org: clean(r['소관기관명']),
      orgType: clean(r['소관기관유형']),
      target: clean(r['지원대상'], 140),
      supportType: clean(r['지원유형']),
      applyMethod: clean(r['신청방법']),
      deadline: clean(r['신청기한'], 60),
      receiver: clean(r['접수기관']),
      userType: clean(r['사용자구분']),
      url: clean(r['상세조회URL']),
      views: Number(r['조회수']) || 0,
    });
  }
  console.log(`page ${page}: ${all.length}/${total}`);
  page += 1;
  if (page > 30) break; // 안전장치
}

const byId = new Map();
for (const r of all) if (r.id && !byId.has(r.id)) byId.set(r.id, r);
const rows = [...byId.values()].sort((a, b) => b.views - a.views || a.id.localeCompare(b.id));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: '공공데이터포털 행정안전부_대한민국 공공서비스(혜택) 정보(15113968)',
      fetchedAt: new Date().toISOString().slice(0, 10),
      count: rows.length,
      rows,
    },
    null,
    0
  ) + '\n'
);
console.log(`saved ${rows.length} rows → ${path.relative(ROOT, OUT)}`);
