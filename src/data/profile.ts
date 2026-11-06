export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  headline: string;
  summary: string[];
  contactLinks: ContactLink[];
}

export interface ContactLink {
  label: string;
  href: string;
  external: boolean;
}

export const profile: Profile = {
  name: "Jérémy Brialon",
  role: "Senior Front-End Developer - Immersive Experiences",
  location: "Annecy (FR) · Geneva (CH)",
  email: "jeremy.brialon@pm.me",
  headline: "Front-End & Immersive Experiences",
  summary: [
    "Senior front-end developer with 10+ years building websites for watchmaking and luxury brands and the immersive, real-time 3D experiences that go with them.",
  ],
  contactLinks: [
    { label: "+33 6 07 26 55 12", href: "tel:+33607265512", external: false },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jeremy-brialon-81694543/",
      external: true,
    },
    { label: "GitHub", href: "https://github.com/jbrialon", external: true },
  ],
};
