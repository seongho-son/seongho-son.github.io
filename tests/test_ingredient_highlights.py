import importlib.util
import json
from pathlib import Path
import re
import subprocess
import unittest
ROOT = Path(__file__).parents[1]
spec = importlib.util.spec_from_file_location('highlight', ROOT/'scripts/instagram/ingredient_highlights.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)

class HighlightTests(unittest.TestCase):
    def matches(self, ingredients, text):
        rx = h.ingredient_re([[x] for x in ingredients])
        return [m[0] for m in rx.finditer(text)] if rx else []

    def test_chicken_and_modifiers(self):
        self.assertEqual(self.matches(['토막 닭고기'], '토막 낸 닭을 데쳐요. 생닭과 닭고기도 준비해요.'), ['닭','생닭','닭고기'])

    def test_short_names_and_compounds(self):
        self.assertEqual(self.matches(['물', '밥', '무', '소금'], '물엿 국물 물기는 무게 밥솥 소금물. 물에 밥을 무와 소금으로'), ['물','밥','무','소금'])

    def test_recipe_scoped_aliases(self):
        self.assertEqual(self.matches(['달걀', '참치통조림'], '계란을 참치와 섞어요. 닭은 없어요.'), ['계란','참치'])
        self.assertEqual(self.matches(['양파'], '설탕과 소금'), [])

    def test_longest_name_and_alternatives(self):
        self.assertEqual(self.matches(['고운 고춧가루','전분 또는 밀가루'], '고운 고춧가루와 전분 또는 밀가루를 넣어요.'), ['고운 고춧가루','전분 또는 밀가루'])

    def test_escape(self):
        self.assertEqual(h.mark('<닭> &',h.ingredient_re([['닭고기']])), '&lt;<strong class="ing">닭</strong>&gt; &amp;')

    def test_blog_instagram_parity_for_all_recipes(self):
        script = """
import {recipes} from './src/data/recipes.js';
import {ingredientPattern,markIngredients} from './src/lib/ingredient-highlights.js';
const samples=recipes.flatMap(r=>r.steps.flatMap(s=>[s.caption||'',...s.paragraphs]).map(text=>({ingredients:r.ingredients,text:text.replace(/<[^>]*>/g,''),pattern:ingredientPattern(r.ingredients)})));
for(const s of samples)s.matches=[...s.text.matchAll(new RegExp(s.pattern,'g'))].map(m=>m[0]);
console.log(JSON.stringify(samples));
"""
        samples=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
        self.assertGreater(len(samples),100)
        for s in samples:
            self.assertEqual([m[0] for m in h.ingredient_re(s['ingredients']).finditer(s['text'])],s['matches'],s['text'])
