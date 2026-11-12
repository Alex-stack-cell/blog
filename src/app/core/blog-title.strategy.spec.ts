import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BlogTitleStrategy, formatPageTitle } from './blog-title.strategy';

describe('formatPageTitle', () => {
  it('ajoute le nom du site après le titre de la page', () => {
    expect(formatPageTitle('Mes articles')).toBe('Mes articles | Xbox blog');
  });

  it('retourne le nom du site seul sans titre de page', () => {
    expect(formatPageTitle()).toBe('Xbox blog');
    expect(formatPageTitle('')).toBe('Xbox blog');
  });
});

describe('BlogTitleStrategy', () => {
  const snapshot = {} as RouterStateSnapshot;
  let strategy: BlogTitleStrategy;
  let setTitle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setTitle = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: Title, useValue: { setTitle } }],
    });
    strategy = TestBed.inject(BlogTitleStrategy);
  });

  it('met à jour le titre du document avec le titre de la route', () => {
    vi.spyOn(TitleStrategy.prototype, 'buildTitle').mockReturnValue('Détail');

    strategy.updateTitle(snapshot);

    expect(setTitle).toHaveBeenCalledWith('Détail | Xbox blog');
  });

  it('utilise le nom du site quand la route n’a pas de titre', () => {
    vi.spyOn(TitleStrategy.prototype, 'buildTitle').mockReturnValue(undefined);

    strategy.updateTitle(snapshot);

    expect(setTitle).toHaveBeenCalledWith('Xbox blog');
  });
});
