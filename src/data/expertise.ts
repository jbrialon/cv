export interface SkillGroup {
  title: string;
  emphasis: "primary" | "secondary";
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Front-End",
    emphasis: "primary",
    skills: [
      "Vue 3 / Nuxt",
      "Astro",
      "TypeScript",
      "Modern CSS",
      "Accessibility - WCAG 2.2",
      "Design Systems & Tokens",
      "Headless CMS",
      "GSAP",
      "Vite - Node.js - CI/CD",
      "Code Review & Mentoring",
    ],
  },
  {
    title: "3D & Creative",
    emphasis: "secondary",
    skills: [
      "WebGPU / WebGL",
      "Three.js",
      "React Three Fiber",
      "Shaders - TSL / GLSL",
      "PixiJS",
      "Unreal Engine",
      "Blender",
    ],
  },
];
