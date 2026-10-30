// Dump the site's recipe data (same shape the Instagram card builder reads) to a JSON file.
// Usage: node scripts/instagram/export-source.mjs <out.json>
import { writeFileSync } from 'node:fs';
import { recipes } from '../../src/data/recipes.js';
const out = process.argv[2];
if (!out) throw new Error('output path required');
writeFileSync(out, JSON.stringify(recipes, null, 2) + '\n');
console.log(`exported ${recipes.length} recipes → ${out}`);
