export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  website: string;
  availability: string;
  resumeHref?: string;
  resumeFilename?: string;
  summary: string[];
  contactLinks: ContactLink[];
  languages: Language[];
}

export interface ContactLink {
  label: string;
  href: string;
  external: boolean;
}

export interface Language {
  name: string;
  level: string;
}

export const profile: Profile = {
  name: "Jérémy Brialon",
  role: "Senior Front-End Developer · Immersive Experiences",
  location: "Annecy (FR) · Geneva (CH) · Cross-border permit (G)",
  email: "jeremy.brialon@pm.me",
  website: "https://cv.jerem.cool",
  availability:
    "Looking for a permanent position in the Geneva or Annecy area, in a team that cares about craft, performance and accessibility.",
  resumeHref: "/jeremy-brialon-cv-en.pdf",
  resumeFilename: "jeremy-brialon-cv-en.pdf",
  summary: [
    "Senior front-end developer with 12 years at Merkle Switzerland, building websites for luxury watch brands: Vacheron Constantin, Audemars Piguet, Chopard, Hublot, Baume & Mercier.",
    "I build front-end architectures that last through several redesigns, and I add real-time 3D when a project calls for it, from the first prototype to the live site.",
  ],
  contactLinks: [
    { label: "+33 6 07 26 55 12", href: "tel:+33607265512", external: false },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jeremy-brialon/",
      external: true,
    },
    { label: "GitHub", href: "https://github.com/jbrialon", external: true },
  ],
  languages: [
    { name: "French", level: "native" },
    { name: "English", level: "professional working proficiency" },
  ],
};
