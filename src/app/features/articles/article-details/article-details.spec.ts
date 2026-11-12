import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../../environments/environment';
import { Article } from '../article.model';
import { ArticleDetail } from './article-details';

const ARTICLE: Article = {
  id: 3,
  title: 'Mon super article',
  slug: 'mon-super-article',
  excerpt: 'Résumé',
  content: 'Contenu complet',
  author: 'Alex',
  category: 'Tests',
  tags: ['a', 'b'],
  publishedAt: '2026-10-12',
  readingTimeMinutes: 2,
  likes: 7,
  imageUrl: 'https://exemple.be/a.png',
};

describe('ArticleDetail', () => {
  let fixture: ComponentFixture<ArticleDetail>;
  let http: HttpTestingController;

  const url = (id: number | string) => `${environment.apiUrl}/articles/${id}`;
  const text = (): string => fixture.nativeElement.textContent;

  /** Ouvre la page pour cet id. Le service charge aussi la liste : on la résout aussitôt. */
  function open(id: string): void {
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    TestBed.tick();
    http.expectOne({ method: 'GET', url: `${environment.apiUrl}/articles` }).flush([]);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetail],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ArticleDetail);
  });

  it("affiche « Chargement… » tant que l'API n'a pas répondu", () => {
    open('3');

    expect(text()).toContain('Chargement');
    http.expectOne(url(3));
  });

  it("affiche l'article et met à jour le titre de la page", async () => {
    open('3');
    http.expectOne(url(3)).flush(ARTICLE);
    await fixture.whenStable();

    expect(text()).toContain('Mon super article');
    expect(text()).toContain('Contenu complet');
    expect(TestBed.inject(Title).getTitle()).toBe('Mon super article | Xbox blog');
  });

  it('affiche « introuvable » sur une réponse 404', async () => {
    open('999');
    http.expectOne(url(999)).flush('', { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();

    expect(text()).toContain('Article introuvable');
    expect(text()).not.toContain('Impossible de charger');
  });

  it("affiche une erreur distincte quand l'API est indisponible", async () => {
    open('3');
    http.expectOne(url(3)).flush('', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect(text()).toContain("Impossible de charger l'article");
    expect(text()).not.toContain('Article introuvable');
  });

  it("affiche « introuvable » sans requête quand l'id est invalide", async () => {
    open('abc');

    expect(text()).toContain('Article introuvable');
    http.expectNone((request) => request.url.includes('/articles/'));
  });
});
