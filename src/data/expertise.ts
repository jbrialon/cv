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
      "Modern CSS",
      "Accessibility · WCAG 2.2",
      "Design systems & tokens",
      "Headless CMS",
      "GSAP",
      "Vite · Node.js · CI/CD",
      "Claude Code / Copilot",
    ],
  },
  {
    title: "3D & Creative",
    emphasis: "secondary",
    skills: [
      "WebGPU / WebGL",
      "Three.js",
      "React Three Fiber",
      "Shaders · TSL / GLSL",
      "PixiJS",
      "Unreal Engine",
      "Blender",
    ],
  },
];
