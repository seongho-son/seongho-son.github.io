// 검색 결과용 <title>. 본문 h1은 감성형 제목을 그대로 두고, 앞부분 "요리명"에 '레시피'를 붙여
// 사람들이 실제로 치는 "백종원 떡볶이 레시피" 같은 검색어와 맞춘다. recipeMeta.searchTitle이 있으면 그걸 쓴다.
export function searchTitle(meta) {
  if (meta.searchTitle) return meta.searchTitle;
  const { title } = meta;
  if (title.includes('레시피')) return title;
  const cut = title.indexOf(', ');
  if (cut < 0) return `${title} 레시피`;
  const head = title.slice(0, cut).replace(/\s*따라하기$/, '');
  return `${head} 레시피, ${title.slice(cut + 2)}`;
}
