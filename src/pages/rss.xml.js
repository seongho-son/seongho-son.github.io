import { recipes } from '../data/recipes.js';
const escapeXml = (value) => String(value).replace(/[<>&"']/g, char => ({'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;'}[char]));
export function GET({ site }) {
  const items = recipes.map(({recipeMeta, ingredients, steps, videoId, measureNote, sourceNote}) => {
    const url = new URL(recipeMeta.path, site).href;
    const content = `<p>${recipeMeta.description}</p><h2>재료 준비</h2><p>${measureNote}</p><ul>${ingredients.map(([name, small, large]) => `<li>${name}: 1–2인분 ${small} / 3–4인분 ${large}</li>`).join('')}</ul>${steps.map((step, i) => `<h2>${i + 1}. ${step.name}</h2>${step.paragraphs.map(text => `<p>${text}</p>`).join('')}`).join('')}<p>${sourceNote}</p><p><a href="https://www.youtube.com/watch?v=${videoId}">원본 영상</a> · <a href="${url}">그림과 함께 레시피 보기</a></p>`;
    return `<item><title>${escapeXml(recipeMeta.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(recipeMeta.description)}</description><content:encoded>${escapeXml(content)}</content:encoded></item>`;
  }).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel><title>레시피 나와라 뚝딱!</title><link>${escapeXml(site.href)}</link><description>유튜브에서 찾은 인기 집밥 레시피를 요리할 때 보기 편하게 담았어요.</description><language>ko</language><atom:link href="${escapeXml(new URL('/rss.xml', site).href)}" rel="self" type="application/rss+xml" />
${items}
</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
