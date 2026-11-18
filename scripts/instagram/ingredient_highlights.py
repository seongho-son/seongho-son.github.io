"""Recipe-scoped ingredient aliases, shared with the blog via JSON rules."""
from pathlib import Path
import json
import re
import html
RULES = json.loads((Path(__file__).resolve().parents[2] / 'src/data/ingredient-highlights.json').read_text())

def ingredient_re(ingredients):
    names = set()
    modifiers = set(RULES['modifiers'])
    for raw, *_ in ingredients:
        main = re.sub(r'\(.*?\)', '', raw.split('·')[0]).strip()
        if main and main not in modifiers:
            names.add(main)
        names.update(w for w in main.split() if w not in modifiers)
    for name in list(names):
        names.update(RULES['aliases'].get(name, []))
    if not names:
        return None
    alternatives = '|'.join(re.escape(n) for n in sorted(names, key=lambda n: (-len(n), n)))
    particles = '|'.join(RULES['particles'])
    return re.compile(r'(?<![가-힣A-Za-z0-9_])(' + alternatives + r')(?=(?:' + particles + r')?(?:[^가-힣A-Za-z0-9_]|$))')

def mark(text, rx):
    # Match before escaping so entities cannot become part of a matched name.
    if not rx:
        return html.escape(text)
    parts, end = [], 0
    for match in rx.finditer(text):
        parts.extend([html.escape(text[end:match.start()]), '<strong class="ing">' + html.escape(match[0]) + '</strong>'])
        end = match.end()
    return ''.join(parts) + html.escape(text[end:])
