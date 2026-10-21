#!/usr/bin/env python3
"""Check a built recipe's publication wiring; no network or project mutations."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.links, self.images, self.ids, self.scripts, self.schemas = [], [], set(), [], []
        self.canonical = None
        self.in_head = False
        self.schema_text = None
        self.tip_text = {}          # tip-N id -> visible text inside that section
        self.cooked_h2 = False      # id="cooked" section contains an h2
        self.sections = []          # stack of open <section> ids (None for unnamed)
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'head':
            self.in_head = True
        if 'id' in a:
            self.ids.add(a['id'])
        if tag == 'section':
            self.sections.append(a.get('id'))
        if tag == 'h2' and 'cooked' in self.sections:
            self.cooked_h2 = True
        if tag == 'a':
            self.links.append(a.get('href', ''))
        if tag == 'img':
            self.images.append(a.get('src', ''))
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a.get('href')
        if tag == 'script':
            self.scripts.append((a, self.in_head))
            if a.get('type') == 'application/ld+json':
                self.schema_text = ''

    def handle_data(self, data):
        if self.schema_text is not None:
            self.schema_text += data
        for sid in self.sections:
            if sid and sid.startswith('tip-'):
                self.tip_text[sid] = self.tip_text.get(sid, '') + data

    def handle_endtag(self, tag):
        if tag == 'head':
            self.in_head = False
        if tag == 'section' and self.sections:
            self.sections.pop()
        if tag == 'script' and self.schema_text is not None:
            self.schemas.append(json.loads(self.schema_text))
            self.schema_text = None

def require(condition, message):
    if not condition:
        raise ValueError(message)

def entities(value):
    if isinstance(value, list):
        for item in value:
            yield from entities(item)
    elif isinstance(value, dict):
        yield value
        yield from entities(value.get('@graph', []))

def audit(project, slug):
    dist = project / 'dist'
    path = f'/recipes/{slug}/'
    url = f'https://gibalpeople.com{path}'
    page = Page(dist / 'recipes' / slug / 'index.html')
    home = Page(dist / 'index.html')
    require(page.canonical == url, 'Detail canonical does not match its route')
    require(any(urlparse(link).path == path for link in home.links), 'Recipe missing from home')
    html = (dist / 'recipes' / slug / 'index.html').read_text()
    require('1–2인분' in html and '3–4인분' in html, 'Missing 1–2인분 / 3–4인분 portions')
    # 원본에 없는 편집자 팁: tip-N 섹션 2개 이상, 팁 섹션 글자 합계 300자 이상(제목 포함, 연속 공백은 1자).
    tip_ids = [i for i in page.ids if i.startswith('tip-')]
    require(len(tip_ids) >= 2, f'Need >= 2 practical tip sections (id="tip-N"), found {len(tip_ids)}')
    tip_chars = sum(len(' '.join(text.split())) for text in page.tip_text.values())
    require(tip_chars >= 300, f'Tip sections too thin: {tip_chars} chars (need >= 300)')
    # 직접 조리 기록(cooked)은 사이트 주인만 채운다. 있으면 제목(h2)까지 렌더돼야 한다.
    require('cooked' not in page.ids or page.cooked_h2, 'id="cooked" section is missing its h2')
    recipes = [e for e in entities(page.schemas) if e.get('@type') == 'Recipe']
    require(len(recipes) == 1, 'Expected one Recipe schema')
    recipe = recipes[0]
    require(recipe.get('url') == url, 'Recipe URL mismatch')
    require(recipe.get('name') and recipe.get('recipeIngredient'), 'Missing recipe name/ingredients')
    steps = recipe.get('recipeInstructions', [])
    require(steps, 'Missing recipe steps')

    def local_image(value):
        require(isinstance(value, str), 'Image must be a URL string')
        parsed = urlparse(value)
        require(parsed.scheme == 'https' and parsed.netloc == 'gibalpeople.com', 'Use own absolute image URL in Recipe')
        target = (dist / parsed.path.lstrip('/')).resolve()
        require(target.is_relative_to(dist.resolve()), 'Image escapes dist')
        require(target.is_file() and target.stat().st_size > 0, f'Missing image: {value}')
        require(parsed.path in page.images or value in page.images, 'Schema image is not visible in recipe')

    hero = recipe.get('image')
    for value in hero if isinstance(hero, list) else [hero]:
        local_image(value)
    for step in steps:
        require(step.get('@type') == 'HowToStep' and step.get('text'), 'Incomplete step')
        parsed = urlparse(step.get('url', ''))
        require(step.get('url', '').startswith(url + '#') and parsed.fragment in page.ids, 'Invalid step anchor')
        local_image(step.get('image'))

    rss = ET.parse(dist / 'rss.xml')
    matches = [item for item in rss.findall('./channel/item') if item.findtext('link') == url]
    require(len(matches) == 1, 'Recipe missing/duplicated in RSS')
    require(matches[0].findtext('title') == recipe['name'], 'RSS title differs from Recipe')
    loc_tag = '{http://www.sitemaps.org/schemas/sitemap/0.9}loc'
    locations = {node.text for file in dist.glob('sitemap*.xml') for node in ET.parse(file).iter(loc_tag)}
    require(url in locations, 'Recipe missing from sitemap')
    ads = [(attrs, head) for attrs, head in page.scripts if 'adsbygoogle.js' in attrs.get('src', '')]
    require(len(ads) == 1, 'AdSense script missing/duplicated')
    attrs, head = ads[0]
    require(head and 'async' in attrs and attrs.get('crossorigin') == 'anonymous', 'AdSense must be async in head')
    require(attrs['src'] == 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5644793210860513', 'Unexpected publisher')
    print(f'PASS {path}: listing, canonical, portions, {len(tip_ids)} tips ({tip_chars} chars), {len(steps)} steps, images, RSS, sitemap, AdSense')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', type=Path, required=True)
    parser.add_argument('--slug', required=True)
    args = parser.parse_args()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', args.slug):
        parser.error('slug must be lowercase letters, digits and hyphens')
    try:
        audit(args.project, args.slug)
    except (ValueError, OSError, ET.ParseError) as error:
        parser.exit(1, f'FAIL: {error}\n')

if __name__ == '__main__':
    main()
