import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getProfile } from "../data/profile";
import { localize } from "../i18n/localize";

const locale = "en";
const profile = getProfile(locale);

export const GET: APIRoute = async () => {
  const experience = localize(await getCollection("experience"), locale);
  const projects = localize(await getCollection("projects"), locale);
  const education = localize(await getCollection("education"), locale);

  const experienceLines = experience.map((entry) => {
    const years = `${entry.data.startDate.getFullYear()}-${entry.data.endDate.getFullYear()}`;
    const highlights = entry.data.highlights
      .map((highlight) => `  - ${highlight}`)
      .join("\n");
    return `- ${entry.data.role}, ${entry.data.company} (${entry.data.location}, ${years})\n${highlights}`;
  });

  const projectLines = projects
    .sort((first, second) => first.data.order - second.data.order)
    .map((project) => {
      const year = project.data.year ? ` (${project.data.year})` : "";
      const detail = project.data.detail ? `, ${project.data.detail}` : "";
      const lines = [
        `- ${project.data.name}${detail}${year}: ${project.data.role}`,
      ];
      if (project.data.summary) lines.push(`  ${project.data.summary}`);
      if (project.data.award) lines.push(`  Award: ${project.data.award}`);
      return lines.join("\n");
    });

  const lab = localize(await getCollection("lab"), locale);
  const labLines = lab
    .sort((first, second) => first.data.order - second.data.order)
    .map((entry) => {
      const year = entry.data.year ? ` (${entry.data.year})` : "";
      const link = entry.data.href ? ` ${entry.data.href}` : "";
      const lines = [
        `- ${entry.data.name}${year}: ${entry.data.detail}, ${entry.data.how}.${link}`,
      ];
      lines.push(`  ${entry.data.summary}`);
      if (entry.data.award) lines.push(`  Award: ${entry.data.award}`);
      return lines.join("\n");
    });

  const languageLines = profile.languages.map(
    (language) => `- ${language.name}: ${language.level}`,
  );

  const educationLines = education.map(
    (entry) =>
      `- ${entry.data.degree}, ${entry.data.school} (${entry.data.startYear}-${entry.data.endYear})`,
  );

  const contactLines = profile.contactLinks
    .filter((link) => link.external)
    .map((link) => `- [${link.label}](${link.href})`);

  const text = [
    `# ${profile.name}`,
    "",
    `> ${profile.role}. ${profile.location}`,
    "",
    profile.summary.join("\n\n"),
    "",
    profile.availability,
    "",
    "## Experience",
    experienceLines.join("\n"),
    "",
    "## Selected client projects",
    projectLines.join("\n"),
    "",
    "## After hours (personal projects)",
    labLines.join("\n"),
    "",
    "## Education",
    educationLines.join("\n"),
    "",
    "## Languages",
    languageLines.join("\n"),
    "",
    "## Contact",
    `- Email: ${profile.email}`,
    contactLines.join("\n"),
    "",
  ].join("\n");

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
