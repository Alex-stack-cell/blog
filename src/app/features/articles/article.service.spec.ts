import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { Article, NewArticle } from './article.model';
import { ArticleService } from './article.service';

const NEW_ARTICLE: NewArticle = {
  title: 'Titre',
  slug: 'titre',
  excerpt: 'Résumé',
  content: 'Contenu',
  author: 'Alex',
  category: 'Tests',
  tags: ['a'],
  imageUrl: '',
  publishedAt: '2026-10-12',
  readingTimeMinutes: 1,
};

const EXISTING: Article[] = [
  { ...NEW_ARTICLE, id: 1, title: 'Un', category: 'Hardware', likes: 0 },
  { ...NEW_ARTICLE, id: 5, title: 'Cinq', category: 'Guides', likes: 0 },
];

describe('ArticleService', () => {
  let service: ArticleService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ArticleService);
    http = TestBed.inject(HttpTestingController);
  });

  /** Simule la réponse de l'API et laisse les signaux se mettre à jour. */
  async function settle(): Promise<void> {
    await TestBed.inject(ApplicationRef).whenStable();
  }

  async function loadArticles(articles: Article[]): Promise<void> {
    TestBed.tick();
    http.expectOne(`${environment.apiUrl}/articles`).flush(articles);
    await settle();
  }

  describe('chargement', () => {
    it('commence vide et en chargement', () => {
      TestBed.tick();

      expect(service.articles()).toEqual([]);
      expect(service.isLoading()).toBe(true);
    });

    it('expose les articles renvoyés par l\'API', async () => {
      await loadArticles(EXISTING);

      expect(service.articles()).toEqual(EXISTING);
      expect(service.isLoading()).toBe(false);
    });

    it('dérive les catégories des articles reçus', async () => {
      await loadArticles(EXISTING);

      expect(service.categories()).toEqual(['Hardware', 'Guides']);
    });

    it('expose une erreur quand l\'API échoue', async () => {
      TestBed.tick();
      http
        .expectOne(`${environment.apiUrl}/articles`)
        .flush('boom', { status: 500, statusText: 'Server Error' });
      await settle();

      expect(service.error()).toBeTruthy();
      expect(service.articles()).toEqual([]);
    });
  });

  describe('add', () => {
    const POST_ARTICLES = { method: 'POST', url: `${environment.apiUrl}/articles` };
    const CREATED: Article = { ...NEW_ARTICLE, id: 9, likes: 0 };

    it("envoie l'article en POST avec likes à 0 et renvoie celui créé par le serveur", async () => {
      await loadArticles(EXISTING);

      const result = service.add(NEW_ARTICLE);
      const request = http.expectOne(POST_ARTICLES);
      expect(request.request.body).toEqual({ ...NEW_ARTICLE, likes: 0 });
      request.flush(CREATED);

      await expect(result).resolves.toEqual(CREATED);
    });

    it('ne fabrique pas l\'id côté client', async () => {
      await loadArticles(EXISTING);

      const result = service.add(NEW_ARTICLE);
      const request = http.expectOne(POST_ARTICLES);
      expect(request.request.body).not.toHaveProperty('id');
      request.flush(CREATED);
      await result;
    });

    it('recharge la liste après la création', async () => {
      await loadArticles(EXISTING);

      const result = service.add(NEW_ARTICLE);
      http.expectOne(POST_ARTICLES).flush(CREATED);
      await result;
      TestBed.tick();

      const reload = http.expectOne({ method: 'GET', url: `${environment.apiUrl}/articles` });
      reload.flush([...EXISTING, CREATED]);
      await settle();

      expect(service.articles().find((a) => a.id === 9)?.title).toBe('Titre');
    });

    it("rejette quand l'API échoue", async () => {
      await loadArticles(EXISTING);

      const result = service.add(NEW_ARTICLE);
      http.expectOne(POST_ARTICLES).flush('boom', { status: 500, statusText: 'Server Error' });

      await expect(result).rejects.toBeTruthy();
      expect(service.articles()).toEqual(EXISTING);
    });
  });

  describe('detail', () => {
    const detailUrl = (id: number) => `${environment.apiUrl}/articles/${id}`;

    /** Le service charge aussi la liste à sa création : on la résout pour que l'appli redevienne stable. */
    function flushList(): void {
      http.expectOne({ method: 'GET', url: `${environment.apiUrl}/articles` }).flush([]);
    }

    it('charge un article par son id via GET /articles/:id', async () => {
      const resource = TestBed.runInInjectionContext(() => service.detail(() => '5'));
      TestBed.tick();
      flushList();

      http.expectOne(detailUrl(5)).flush(EXISTING[1]);
      await settle();

      expect(resource.hasValue()).toBe(true);
      expect(resource.value()?.title).toBe('Cinq');
    });

    it("ne déclenche aucune requête quand l'id n'est pas un entier", () => {
      TestBed.runInInjectionContext(() => service.detail(() => 'abc'));
      TestBed.tick();
      flushList();

      http.expectNone((request) => request.url.includes('/articles/'));
    });

    it("recharge quand l'id change", async () => {
      const id = signal('1');
      const resource = TestBed.runInInjectionContext(() => service.detail(id));
      TestBed.tick();
      flushList();
      http.expectOne(detailUrl(1)).flush(EXISTING[0]);
      await settle();

      id.set('5');
      TestBed.tick();
      http.expectOne(detailUrl(5)).flush(EXISTING[1]);
      await settle();

      expect(resource.value()?.id).toBe(5);
    });
  });
});
