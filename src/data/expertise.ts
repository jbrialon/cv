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
      "Code review & mentoring",
    ],
  },
  {
    title: "3D & Creative",
    emphasis: "secondary",
    skills: [
      "WebGPU",
      "Three.js",
      "Shaders · TSL / GLSL",
      "WebGL",
      "PixiJS",
      "Unreal Engine",
      "Blender",
    ],
  },
];
