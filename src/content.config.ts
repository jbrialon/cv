import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

// a text written in both languages, the build fails if one is missing
const localized = z.object({ en: z.string(), fr: z.string() });

const mediaBase = {
  position: z.string().default("50% 50%"),
  theme: z.enum(["light", "dark"]).default("light"),
};

const mediaSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("video"),
    src: z.string(),
    poster: z.string(),
    position: mediaBase.position,
    theme: mediaBase.theme,
  }),
  z.object({
    type: z.literal("image"),
    src: z.string(),
    alt: localized,
    position: mediaBase.position,
    theme: mediaBase.theme,
  }),
]);

const experience = defineCollection({
  loader: file("src/content/experience.json"),
  schema: z.object({
    role: localized,
    formerRole: localized.optional(),
    company: z.string(),
    location: localized,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    highlights: z.array(localized).min(1),
  }),
});

const projects = defineCollection({
  loader: file("src/content/projects.json"),
  schema: z.object({
    order: z.number().int().positive(),
    name: z.string(),
    detail: localized.optional(),
    year: z.number().int().optional(),
    role: localized,
    summary: localized.optional(),
    award: z.string().optional(),
    inks: z.tuple([z.string(), z.string()]).default(["#93b6c9", "#f5b595"]),
    // without media, the thumb shows a blurred ink placeholder
    media: mediaSchema.optional(),
  }),
});

const education = defineCollection({
  loader: file("src/content/education.json"),
  schema: z.object({
    degree: localized,
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
    detail: localized,
    how: localized,
    field: localized,
    year: z.string().optional(),
    summary: localized,
    award: z.string().optional(),
    href: z.url().optional(),
    linkLabel: z.string().optional(),
    inks: z.tuple([z.string(), z.string()]).default(["#93b6c9", "#f5b595"]),
    // without media, the plate shows a blurred ink placeholder
    media: mediaSchema.optional(),
  }),
});

export const collections = { experience, projects, education, lab };
