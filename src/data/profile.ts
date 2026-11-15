import { localize, type LocalizedText } from "../i18n/localize";

export interface Profile {
  name: string;
  role: LocalizedText;
  location: LocalizedText;
  email: string;
  website: string;
  availability: LocalizedText;
  resumeHref?: LocalizedText;
  resumeFilename?: LocalizedText;
  summary: LocalizedText[];
  contactLinks: ContactLink[];
  languages: Language[];
}

export interface ContactLink {
  label: string;
  href: string;
  external: boolean;
  printLabel?: string;
}

export interface Language {
  name: LocalizedText;
  level: LocalizedText;
}

export const profile: Profile = {
  name: "Jérémy Brialon",
  role: {
    en: "Senior Front-End Developer · Immersive Experiences",
    fr: "Développeur front-end senior · Expériences immersives",
  },
  location: {
    en: "Annecy (FR) · Geneva (CH) · Cross-border permit (G)",
    fr: "Annecy (FR) · Genève (CH) · Permis de travail frontalier (permis G)",
  },
  email: "jeremy.brialon@pm.me",
  website: "https://cv.jerem.cool",
  availability: {
    en: "Looking for a permanent position in the Annecy or Geneva area, in a team that cares about craft, performance and accessibility.",
    fr: "À la recherche d'un poste en CDI dans la région d'Annecy ou de Genève, au sein d'une équipe qui accorde une réelle importance à la qualité du travail, la performance et à l'accessibilité.",
  },
  resumeHref: {
    en: "/jeremy-brialon-cv-en.pdf",
    fr: "/jeremy-brialon-cv-fr.pdf",
  },
  resumeFilename: {
    en: "jeremy-brialon-cv-en.pdf",
    fr: "jeremy-brialon-cv-fr.pdf",
  },
  summary: [
    {
      en: "Senior front-end developer with 12+ years of experience. At Merkle Switzerland, I built websites for luxury watch brands: Vacheron Constantin, Audemars Piguet, Chopard, Hublot, Baume & Mercier.",
      fr: "Développeur front-end senior, fort de 12+ ans d'expérience. Chez Merkle Switzerland, j'ai conçu et développé des sites web pour plusieurs grandes maisons horlogères de luxe : Vacheron Constantin, Audemars Piguet, Chopard, Hublot et Baume & Mercier.",
    },
    {
      en: "I build front-end architectures that last through redesigns and I add real-time 3D when a project calls for it, from the first prototype to the live website.",
      fr: "Je conçois des architectures front-end robustes, capables d'évoluer au fil des refontes. J'intègre également la 3D temps réel lorsque le projet le nécessite, du premier prototype jusqu'à la mise en production.",
    },
  ],
  contactLinks: [
    { label: "+33 6 07 26 55 12", href: "tel:+33607265512", external: false },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jeremy-brialon-81694543/",
      external: true,
      printLabel: "linkedin.com/in/jeremy-brialon",
    },
    { label: "GitHub", href: "https://github.com/jbrialon", external: true },
  ],
  languages: [
    {
      name: { en: "French", fr: "Français" },
      level: { en: "native", fr: "langue maternelle" },
    },
    {
      name: { en: "English", fr: "Anglais" },
      level: {
        en: "professional working proficiency",
        fr: "niveau professionnel",
      },
    },
  ],
};

export function getProfile(locale: string | undefined) {
  return localize(profile, locale);
}
