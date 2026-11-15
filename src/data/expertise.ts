import { localize, type LocalizedText } from "../i18n/localize";

// tool names stay a plain string, the rest gets both languages
type SkillText = string | LocalizedText;

export interface SkillGroup {
  title: SkillText;
  emphasis: "primary" | "secondary";
  skills: SkillText[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Front-End",
    emphasis: "primary",
    skills: [
      "TypeScript",
      "Vue 3 / Nuxt",
      "Astro",
      { en: "Accessibility · WCAG 2.2", fr: "Accessibilité · WCAG 2.2" },
      { en: "Headless CMS", fr: "CMS headless" },
      { en: "Modern CSS", fr: "CSS moderne" },
      "Design systems & tokens",
      "Vite · Node.js · CI/CD",
      "Claude Code / Copilot",
    ],
  },
  {
    title: { en: "3D & Creative", fr: "3D & création" },
    emphasis: "secondary",
    skills: [
      "Three.js",
      "React Three Fiber",
      "WebGPU / WebGL",
      "Blender",
      "GSAP",
      "Shaders · TSL / GLSL",
      "PixiJS",
      "Unreal Engine",
    ],
  },
];

export function getSkillGroups(locale: string | undefined) {
  return localize(skillGroups, locale);
}
