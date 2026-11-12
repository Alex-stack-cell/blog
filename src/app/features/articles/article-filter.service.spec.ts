import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArticleFilterService } from './article-filter.service';
import { ArticleService } from './article.service';
import { Article } from './article.model';

const article = (id: number, title: string, category: string): Article => ({
  id,
  title,
  slug: `article-${id}`,
  excerpt: '',
  content: '',
  author: 'Jean-Michel Joystick',
  category,
  tags: [],
  publishedAt: '2026-01-12',
  readingTimeMinutes: 1,
  likes: 0,
  imageUrl: '',
});

const articles: Article[] = [
  article(1, 'Ma manette Xbox drifte', 'Hardware'),
  article(2, "Game Pass : 400 jeux et je rejoue à Minesweeper", 'Game Pass'),
  article(3, 'Test de la manette Elite', 'Tests'),
];

describe('ArticleFilterService', () => {
  let service: ArticleFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ArticleService, useValue: { articles: signal(articles) } }],
    });

    service = TestBed.inject(ArticleFilterService);
  });

  it('renvoie tous les articles sans filtre', () => {
    expect(service.filteredArticles()).toEqual(articles);
    expect(service.hasActiveFilter()).toBe(false);
  });

  it('combine la recherche et la catégorie', () => {
    service.setSearch('manette');
    service.setCategory('Tests');

    expect(service.filteredArticles()).toEqual([articles[2]]);
    expect(service.hasActiveFilter()).toBe(true);
  });

  it("ne considère pas une recherche faite d'espaces comme un filtre actif", () => {
    service.setSearch('   ');

    expect(service.hasActiveFilter()).toBe(false);
  });

  it('resetFilters vide la recherche et la catégorie', () => {
    service.setSearch('manette');
    service.setCategory('Hardware');

    service.resetFilters();

    expect(service.search()).toBe('');
    expect(service.category()).toBe('');
    expect(service.filteredArticles()).toEqual(articles);
  });
});
