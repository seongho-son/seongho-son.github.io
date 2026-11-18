import rules from '../data/ingredient-highlights.json' with { type: 'json' };
const modifiers = new Set(rules.modifiers);
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function ingredientPattern(ingredients) {
  const names = new Set();
  for (const [raw] of ingredients) {
    const main = raw.split('·')[0].replace(/\(.*?\)/g, '').trim();
    if (main && !modifiers.has(main)) names.add(main);
    for (const word of main.split(/\s+/)) if (word && !modifiers.has(word)) names.add(word);
  }
  // Only expand names present in this recipe; aliases are not substitute ingredients.
  for (const name of [...names]) for (const alias of rules.aliases[name] || []) names.add(alias);
  if (!names.size) return null;
  const alternatives = [...names].sort((a, b) => b.length - a.length || a.localeCompare(b)).map(escape).join('|');
  // Require a whole ingredient plus an optional Korean particle (not 소금 in 소금물).
  return `(?<![가-힣A-Za-z0-9_])(${alternatives})(?=(?:${rules.particles.join('|')})?(?:[^가-힣A-Za-z0-9_]|$))`;
}
export function markIngredients(html, ingredients) {
  const pattern = ingredientPattern(ingredients);
  const rx = pattern ? new RegExp(pattern, 'g') : null;
  return html.replace(/<\/?strong\b[^>]*>/g, '').split(/(<[^>]+>)/)
    .map(part => part.startsWith('<') || !rx ? part : part.replace(rx, '<strong class="rb-ing">$1</strong>')).join('');
}
