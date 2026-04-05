import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const post = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/post" }),
  schema: z.object({
    subject_tags: z.array(z.string()),
    created: z.coerce.date(),
    modified: z.coerce.date(),
    note_type: z.string(),
    publish: z.boolean(),
    website_tags: z.array(z.string()),
    image: z.string().optional(),
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { post };
