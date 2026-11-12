import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleList } from './article-list';
import { ArticleService } from '../article.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ArticleFilterService } from '../article-filter.service';
import { Article } from '../article.model';

const articles: Article[] = [
  {
    id: 1,
    title: 'Pourquoi ma manette Xbox a plus de drift que ma vie amoureuse',
    slug: 'manette-xbox-drift-vie-amoureuse',
    excerpt: 'Le stick gauche part tout seul vers la droite. Comme mon ex.',
    content:
      "Après 400 heures sur Forza, mon stick gauche a décidé de vivre sa vie. J'ai tout essayé : air comprimé, alcool isopropylique, prières. Résultat : ma voiture finit toujours dans le décor, mais au moins elle est cohérente.",
    author: 'Jean-Michel Joystick',
    category: 'Hardware',
    tags: ['manette', 'drift', 'galère'],
    publishedAt: '2026-01-12',
    readingTimeMinutes: 4,
    likes: 128,
    imageUrl: 'https://picsum.photos/seed/xbox1/800/450',
  },
  {
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
  },
  {
    id: 3,
    title: "Test : la Xbox Series X comme chauffage d'appoint",
    slug: 'test-xbox-series-x-chauffage',
    excerpt: 'Économisez sur le gaz cet hiver, jouez à Starfield.',
    content:
      "Après trois heures de Starfield, la température de mon salon est passée de 17 à 23 degrés. Le ventilateur fait le bruit d'un petit avion mais mon chat a adopté le dessus de la console comme nouveau canapé.",
    author: 'Brigitte Hardware',
    category: 'Tests',
    tags: ['series-x', 'chauffage', 'test'],
    publishedAt: '2026-03-21',
    readingTimeMinutes: 3,
    likes: 87,
    imageUrl: 'https://picsum.photos/seed/xbox3/800/450',
  },
];

describe('ArticleList', () => {
  let fixture: ComponentFixture<ArticleList>;
  const filteredArticles = signal<Article[]>([]);
  const error = signal<Error | undefined>(undefined);
  const isLoading = signal(false);
  const hasActiveFilter = signal(false);
  const resetFilters = vi.fn();

  beforeEach(async () => {
    filteredArticles.set(articles);
    error.set(undefined);
    isLoading.set(false);
    hasActiveFilter.set(false);
    resetFilters.mockReset();

    await TestBed.configureTestingModule({
      imports: [ArticleList],
      providers: [
        provideRouter([]),
        {
          provide: ArticleService,
          useValue: {
            error,
            isLoading,
          },
        },
        {
          provide: ArticleFilterService,
          useValue: {
            filteredArticles,
            hasActiveFilter,
            resetFilters,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ArticleList);
  });

  function counterText(): string {
    return fixture.nativeElement.querySelector('p[aria-live]').textContent;
  }

  function resetButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('button');
  }

  it('affiche « Aucun article » quand la liste est vide', async () => {
    filteredArticles.set([]);
    await fixture.whenStable();

    expect(counterText()).toContain('Aucun article');
  });

  it('affiche « 1 article » au singulier', async () => {
    filteredArticles.set([articles[0]]);
    await fixture.whenStable();

    expect(counterText()).toContain('1 article');
  });

  it('affiche « 3 articles » au pluriel', async () => {
    await fixture.whenStable();

    expect(counterText()).toContain('3 articles');
  });

  it("affiche le message d'erreur quand le chargement échoue", async () => {
    error.set(new Error('API indisponible'));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('ui-error-message')).not.toBeNull();
  });

  it('affiche une carte par article', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-article-card')).toHaveLength(3);
  });

  it('affiche le chargement tant que les articles arrivent', async () => {
    isLoading.set(true);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('ui-loading')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-article-card')).toBeNull();
  });

  it("affiche un message quand aucun article ne correspond", async () => {
    filteredArticles.set([]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Aucun article ne correspond');
  });

  it("n'affiche pas « Réinitialiser » quand aucun filtre n'est actif", async () => {
    filteredArticles.set([]);
    await fixture.whenStable();

    expect(resetButton()).toBeNull();
  });

  it('réinitialise les filtres au clic sur « Réinitialiser »', async () => {
    filteredArticles.set([]);
    hasActiveFilter.set(true);
    await fixture.whenStable();

    resetButton()?.click();

    expect(resetFilters).toHaveBeenCalledTimes(1);
  });
});
