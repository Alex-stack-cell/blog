const WORDS_PER_MINUTE = 200;

/** "Manette Xbox : Drift !" → "manette-xbox-drift" */
export function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "manette, game pass, " → ['manette', 'game pass'] */
export function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '');
}

/** Temps de lecture en minutes (au moins 1). */
export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Date du jour (fuseau local) au format ISO `YYYY-MM-DD`, comme dans api/db.json. */
export function todayIso(): string {
  // La locale suédoise formate nativement en année-mois-jour.
  return new Intl.DateTimeFormat('sv-SE').format(new Date());
}

/** Valeur du `select` qui signifie « saisir une nouvelle catégorie ». */
export const OTHER_CATEGORY = '__other__';

/**
 * Catégorie à enregistrer : celle choisie, ou la saisie libre.
 * Une saisie qui correspond (sans tenir compte de la casse) à une catégorie existante la réutilise.
 */
export function resolveCategory(
  selected: string,
  custom: string,
  existing: readonly string[],
): string {
  if (selected !== OTHER_CATEGORY) {
    return selected;
  }
  const name = custom.trim();
  return existing.find((category) => category.toLowerCase() === name.toLowerCase()) ?? name;
}
