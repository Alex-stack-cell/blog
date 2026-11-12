import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Article } from '../article.model';
import { ArticleCard } from './article-card';

describe('ArticleCard', () => {
  let fixture: ComponentFixture<ArticleCard>;

  const article: Article = {
    id: 2,
    title: "Game Pass : j'ai 400 jeux et je rejoue à Minesweeper",
    slug: 'game-pass-400-jeux-minesweeper',
    excerpt: 'Le syndrome du buffet à volonté appliqué au jeu vidéo.',
    content:
      "Chaque soir je scrolle 45 minutes dans la bibliothèque Game Pass, puis j'éteins la console. Le paradoxe du choix a gagné. Je suis officiellement le meilleur client de Microsoft qui ne joue jamais.",
    author: 'Kevin Gamerscore',
    category: 'Game Pass',
    tags: ['gamepass', 'backlog', 'paradoxe'],
    publishedAt: '2026-02-03',
    readingTimeMinutes: 5,
    likes: 342,
    imageUrl: 'https://picsum.photos/seed/xbox2/800/450',
  };

  const text = (): string => fixture.nativeElement.textContent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCard);
    fixture.componentRef.setInput('article', article);
    await fixture.whenStable();
  });

  it('affiche le titre', () => {
    expect(text()).toContain(article.title);
  });

  it('affiche le résumé', () => {
    expect(text()).toContain(article.excerpt);
  });

  it('affiche la catégorie', () => {
    expect(text()).toContain(article.category);
  });

  it('affiche chaque tag précédé de #', () => {
    for (const tag of article.tags) {
      expect(text()).toContain(`#${tag}`);
    }
  });

  it("mène à la page de l'article depuis le titre", () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');

    expect(link.getAttribute('href')).toBe('/articles/2');
  });
});
