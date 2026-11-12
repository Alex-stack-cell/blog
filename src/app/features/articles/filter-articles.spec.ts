import { filterArticles } from './filter-articles';

describe('filterArticles', () => {
  const articles = [
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
  ];
  const emptyArticles: [] = [];
  it("renvoie l'article qui correspond à la recherche et à la catégorie", () => {
    const search = 'manette';
    const category = 'Hardware';
    expect(filterArticles(articles, search, category)).toEqual([articles[0]]);
  });
  it('garde les articles dont le titre contient la recherche', () => {
    const title = 'Pourquoi ma manette';
    expect(filterArticles(articles, title, '')).toEqual([articles[0]]);
  });
  it('garde les articles de la catégorie choisie', () => {
    const category = 'Game Pass';
    expect(filterArticles(articles, '', category)).toEqual([articles[1]]);
  });
  it('ignore la casse de la recherche', () => {
    const title = 'game pass : ';
    expect(filterArticles(articles, title, '')).toEqual([articles[1]]);
  });
  it('renvoie une liste vide quand aucun article ne correspond', () => {
    const unknownTitle = 'Banjo Kazooi: Le retour';
    expect(filterArticles(articles, unknownTitle, '')).toEqual([]);
  });
  it('renvoie une liste vide quand aucune catégorie ne correspond', () => {
    const unknownCategory = 'Retro';
    expect(filterArticles(articles, '', unknownCategory)).toEqual([]);
  });
  it('renvoie une liste vide quand le titre ne correspond pas à la bonne catégorie', () => {
    const categoryArticle1 = 'Hardware';
    const titleArticle2 = "Game Pass : j'ai 400 jeux et je rejoue à Minesweeper";

    expect(filterArticles(articles, titleArticle2, categoryArticle1)).toEqual([]);
  });
  it('renvoie une liste vide quand aucun article existe en db', () => {
    expect(filterArticles(emptyArticles, '', '')).toEqual([]);
  });
  it('ignore les espaces autour de la recherche', () => {
    const unTrimTitle = '     Game Pass :         ';
    expect(filterArticles(articles, unTrimTitle, '')).toEqual([articles[1]]);
  });
});
