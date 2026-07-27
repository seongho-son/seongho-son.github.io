import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 루트 사용자 사이트(seongho-son.github.io)로 배포 → base '/' 그대로.
// ⚠️ 나중에 커스텀 도메인 연결 시 site 값만 그 도메인으로 바꾸면 됩니다.
export default defineConfig({
  site: 'https://seongho-son.github.io',
  integrations: [sitemap()],
});
