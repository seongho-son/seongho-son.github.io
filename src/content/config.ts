import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().default('정부지원금'),
    tags: z.array(z.string()).default([]),
    // 관련 계산기 도구로 유도하는 내부 링크(선택) — 토픽 클러스터 강화용
    relatedTool: z.string().optional(),
  }),
});

export const collections = { blog };
