// Recipe 구조화 데이터에 공통으로 붙이는 항목: 원작자, 처음 발행한 날, 원본 영상, 검색 키워드.
// 발행일은 글 slug가 저장소에 처음 들어온 커밋 날짜에서 읽는다(경로는 데이터에 그대로 적히지 않는 글도 있다). git이 없으면 그 항목만 뺀다.
import { execFileSync } from 'node:child_process';

const SITE_NAME = '레시피 나와라 뚝딱';
const firstSeen = new Map();

function datePublished(path) {
  if (!firstSeen.has(path)) {
    let date;
    try {
      const out = execFileSync('git', ['log', '--reverse', '--format=%aI', '-S', path.split('/').filter(Boolean).pop(), '--', 'src/data', 'src/pages/recipes'], { encoding: 'utf8' });
      date = out.split('\n')[0] || undefined;
    } catch {
      date = undefined;
    }
    firstSeen.set(path, date);
  }
  return firstSeen.get(path);
}

export function recipeExtras({ path, channel, sourceUrl, tags, site }) {
  const keywords = (tags ?? '').split(/\s+/).map(tag => tag.replace(/^#/, '')).filter(Boolean).join(', ');
  return {
    ...(channel && { author: { '@type': 'Organization', name: channel } }),
    publisher: { '@type': 'Organization', name: SITE_NAME, url: site },
    ...(datePublished(path) && { datePublished: datePublished(path) }),
    ...(keywords && { keywords }),
    isBasedOn: sourceUrl,
  };
}
