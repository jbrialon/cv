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
  role: "Senior Front-End Developer - Immersive experiences",
  location: "Annecy (FR) · Geneva (CH)",
  email: "jeremy.brialon@pm.me",
  headline: "Front-End & Immersive Experiences",
  summary: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
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
