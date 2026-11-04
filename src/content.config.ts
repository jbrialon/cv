import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const experience = defineCollection({
  loader: file("src/content/experience.json"),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    highlights: z.array(z.string()).min(1),
  }),
});

export const collections = { experience };
