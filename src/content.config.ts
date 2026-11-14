import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const experience = defineCollection({
  loader: file("src/content/experience.json"),
  schema: z.object({
    role: z.string(),
    formerRole: z.string().optional(),
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
    year: z.number().int().optional(),
    role: z.string(),
    summary: z.string().optional(),
    award: z.string().optional(),
    inks: z.tuple([z.string(), z.string()]).default(["#93b6c9", "#f5b595"]),
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

const lab = defineCollection({
  loader: file("src/content/lab.json"),
  schema: z.object({
    order: z.number().int().positive(),
    name: z.string(),
    detail: z.string(),
    how: z.string(),
    field: z.string(),
    year: z.string().optional(),
    summary: z.string(),
    award: z.string().optional(),
    href: z.url().optional(),
    linkLabel: z.string().optional(),
    inks: z.tuple([z.string(), z.string()]).default(["#93b6c9", "#f5b595"]),
    // without media, the plate shows a blurred ink placeholder
    media: z
      .discriminatedUnion("type", [
        z.object({ type: z.literal("video"), src: z.string(), poster: z.string(), position: z.string().default("50% 50%") }),
        z.object({ type: z.literal("image"), src: z.string(), alt: z.string(), position: z.string().default("50% 50%") }),
      ])
      .optional(),
  }),
});

export const collections = { experience, projects, education, lab };
