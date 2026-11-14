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
      "TypeScript",
      "Vue 3 / Nuxt",
      "Astro",
      "Accessibility · WCAG 2.2",
      "Headless CMS",
      "Modern CSS",
      "Design systems & tokens",
      "Vite · Node.js · CI/CD",
      "Claude Code / Copilot",
    ],
  },
  {
    title: "3D & Creative",
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
