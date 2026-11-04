export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  headline: string;
  summary: string[];
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
};
