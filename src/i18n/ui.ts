export const defaultLocale = "en";

export const languages = [
  { locale: "en", label: "EN", name: "English" },
  { locale: "fr", label: "FR", name: "Français" },
] as const;

const en = {
  "meta.description":
    "Resume of Jérémy Brialon, senior front-end developer with 12 years of experience, specialised in immersive experiences and real-time 3D on the web.",
  "nav.contactAndLanguage": "Contact and language",
  "nav.language": "Language",
  "nav.contact": "Contact",
  "link.newTab": "(opens in a new tab)",
  "range.to": "to",
  "awards.label": "Awards:",

  "profile.title": "Profile",
  "profile.location": "Location",

  "experience.title": "Experience",
  "experience.filename": "experience",
  "experience.joinedAs": "Joined as",

  "expertise.title": "Expertise",

  "projects.title": "Selected client projects",
  "projects.filename": "selected client projects",
  "projects.items": "items",

  "lab.title": "After hours",
  "lab.intro":
    "Outside client work, I still build things for the pleasure of it, from the first idea to the server: a 3D character for Twitch streamers, my photography portfolio and a tool to tell travel stories and many more.",
  "lab.name": "Name",
  "lab.what": "What",
  "lab.how": "How",

  "education.title": "Education",
  "languages.title": "Languages",

  "footer.email": "email",
  "footer.backToTop": "Back to top",
};

type TranslationKey = keyof typeof en;

const fr: Record<TranslationKey, string> = {
  "meta.description":
    "CV de Jérémy Brialon, développeur front-end senior avec 12 ans d'expérience, spécialisé dans les expériences immersives et la 3D temps réel sur le web.",
  "nav.contactAndLanguage": "Contact et langue",
  "nav.language": "Langue",
  "nav.contact": "Me contacter",
  "link.newTab": "(ouvrir dans un nouvel onglet)",
  "range.to": "à",
  "awards.label": "Distinctions :",

  "profile.title": "Profil",
  "profile.location": "Basé à",

  "experience.title": "Parcours professionnel",
  "experience.filename": "parcours professionnel",
  "experience.joinedAs": "Rejoint en tant que",

  "expertise.title": "Compétences",

  "projects.title": "Projets clients sélectionnés",
  "projects.filename": "projets clients",
  "projects.items": "projets",

  "lab.title": "Projets personnels",
  "lab.intro":
    "En parallèle de mes missions pour mes clients, je développe aussi mes propres idées et leur donne vie, de la conception jusqu'à la mise en ligne : un bot 3D pour les streamers Twitch, mon portfolio photo, un outil pour créer et partager des carnets de voyage, et bien d'autres projets.",

  "lab.name": "Nom",
  "lab.what": "Description",
  "lab.how": "Réalisation",

  "education.title": "Formation",
  "languages.title": "Langues",

  "footer.email": "E-mail",
  "footer.backToTop": "Retour en haut de page",
};

const dictionaries = { en, fr };

export type Locale = keyof typeof dictionaries;

export function useTranslations(locale: string | undefined) {
  const dictionary = dictionaries[(locale ?? defaultLocale) as Locale] ?? en;
  return (key: TranslationKey) => dictionary[key];
}
