import { defaultLocale, languages, type Locale } from "./ui";

export type LocalizedText = Record<Locale, string>;

// the same shape as Value, with every { en, fr } replaced by a plain string
export type Localized<Value> = Value extends LocalizedText
  ? string
  : Value extends Date
    ? Value
    : Value extends object
      ? { [Key in keyof Value]: Localized<Value[Key]> }
      : Value;

const localeCodes: string[] = languages.map((language) => language.locale);

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length === localeCodes.length && keys.every((key) => localeCodes.includes(key));
}

export function localize<Value>(value: Value, locale: string | undefined): Localized<Value> {
  const resolvedLocale = (localeCodes.includes(locale ?? "") ? locale : defaultLocale) as Locale;

  if (isLocalizedText(value)) return value[resolvedLocale] as Localized<Value>;
  if (Array.isArray(value)) return value.map((item) => localize(item, resolvedLocale)) as Localized<Value>;
  if (typeof value !== "object" || value === null || value instanceof Date) return value as Localized<Value>;

  const localizedEntries = Object.entries(value).map(([key, item]) => [key, localize(item, resolvedLocale)]);
  return Object.fromEntries(localizedEntries) as Localized<Value>;
}
