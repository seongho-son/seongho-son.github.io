import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://gibalpeople.com',
  integrations: [sitemap({ filter: (url) => !new URL(url).pathname.includes('404') })],
});
