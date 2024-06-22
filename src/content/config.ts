// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

// 2. Define your collection(s)
const postCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: z.object({
    subject_tags: z.array(z.string()), // Array of strings for subject tags
    created: z.date(), // Dates as string; consider using z.date() if you want to enforce Date objects
    modified: z.date(), // Similar to 'created'
    note_type: z.string(), // A string to denote the type of note
    publish: z.boolean(), // Boolean to check if it should be published
    website_tags: z.array(z.string()), // Array of strings for website tags
    image: z.string().optional(),
  }),
});
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  post: postCollection,
};
