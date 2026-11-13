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

const projects = defineCollection({
  loader: file("src/content/projects.json"),
  schema: z.object({
    order: z.number().int().positive(),
    name: z.string(),
    detail: z.string().optional(),
    role: z.string(),
    summary: z.string().optional(),
    award: z.string().optional(),
  }),
});

const education = defineCollection({
  loader: file("src/content/education.json"),
  schema: z.object({
    degree: z.string(),
    school: z.string(),
    startYear: z.number().int(),
    endYear: z.number().int(),
  }),
});

export const collections = { experience, projects, education };
