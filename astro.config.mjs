import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 커스텀 도메인(gibalpeople.com)으로 배포. public/CNAME 이 gh-pages 로 함께 배포됨.
export default defineConfig({
  site: 'https://gibalpeople.com',
  integrations: [sitemap()],
});
