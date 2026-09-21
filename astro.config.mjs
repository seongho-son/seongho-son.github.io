import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { isCurrentGuide } from './src/lib/editorial.js';
import { RETIRED_TOOLS } from './src/lib/retired-tools.js';

// 커스텀 도메인(gibalpeople.com)으로 배포. public/CNAME 이 gh-pages 로 함께 배포됨.
export default defineConfig({
  site: 'https://gibalpeople.com',
  integrations: [sitemap({filter: (url) => {
    const path = new URL(url).pathname.replace(/\/$/, '');
    if (['/check', '/archive', '/404', '/404.html'].includes(path)) return false;
    if (path.startsWith('/guides/')) return isCurrentGuide(path.split('/').pop());
    if (path.startsWith('/tools/')) return !Object.hasOwn(RETIRED_TOOLS, path.split('/').pop());
    return true;
  }})],
});
