import { afterEach, describe, expect, it, vi } from 'vitest';
import { OTHER_CATEGORY, parseTags, resolveCategory, todayIso } from './article-fields';

describe('todayIso', () => {
  afterEach(() => vi.useRealTimers());

  it('renvoie une date au format YYYY-MM-DD', () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('utilise la date locale, pas la date UTC', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 13, 0, 30)); // 13 oct. 00h30 en heure locale

    expect(todayIso()).toBe('2026-10-13');
  });
});

describe('resolveCategory', () => {
  const existing = ['Tests', 'Actualités'];

  it('renvoie la catégorie choisie telle quelle', () => {
    expect(resolveCategory('Tests', 'ignoré', existing)).toBe('Tests');
  });

  it('renvoie la saisie libre sans les espaces autour', () => {
    expect(resolveCategory(OTHER_CATEGORY, '  Guides  ', existing)).toBe('Guides');
  });

  it('réutilise une catégorie existante malgré une casse différente', () => {
    expect(resolveCategory(OTHER_CATEGORY, ' actualités ', existing)).toBe('Actualités');
  });
});

describe('parseTags', () => {
  const tags = ['manette', 'game pass'];

  it('découpe les tags séparés par des virgules', () => {
    expect(parseTags('manette, game pass')).toStrictEqual(tags);
  });

  it('renvoie un tableau vide pour une saisie vide', () => {
    expect(parseTags('')).toStrictEqual([]);
  });

  it('ignore les virgules en trop et les segments vides', () => {
    expect(parseTags('manette, game pass, , ')).toStrictEqual(['manette', 'game pass']);
  });
});
