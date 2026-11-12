import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Article, NewArticle } from './article.model';

/** Source de vérité des articles : les données et leur accès. */
@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly httpClient = inject(HttpClient);

  private readonly articleResource = httpResource<Article[]>(
    () => `${environment.apiUrl}/articles`,
    { defaultValue: [] },
  );

  /**
   * Liste en lecture seule. Lire `value()` d'une ressource en erreur lève une exception :
   * on passe par `hasValue()` pour renvoyer une liste vide quand l'API est indisponible.
   */
  readonly articles = computed<Article[]>(() =>
    this.articleResource.hasValue() ? this.articleResource.value() : [],
  );

  readonly isLoading = this.articleResource.isLoading;
  readonly error = this.articleResource.error;

  readonly categories = computed(() => [
    ...new Set(this.articles().map((article) => article.category)),
  ]);

  /**x
   * Ressource du détail d'un article (`GET /articles/:id`).
   * Un id qui n'est pas un entier ne déclenche aucune requête (la ressource reste inactive).
   * À appeler dans un contexte d'injection, par exemple un champ de composant.
   */
  detail(id: () => string): HttpResourceRef<Article | undefined> {
    return httpResource<Article>(() => {
      const value = id();
      return /^\d+$/.test(value) ? `${environment.apiUrl}/articles/${value}` : undefined;
    });
  }

  async add(data: NewArticle): Promise<Article> {
    const created = await firstValueFrom(
      this.httpClient.post<Article>(`${environment.apiUrl}/articles`, { ...data, likes: 0 }),
    );

    this.articleResource.reload();

    return created;
  }

  /**
   * `PUT` remplace tout l'article côté API : on envoie donc l'article complet
   * (avec `id`, `likes` et `publishedAt` d'origine), pas seulement les champs du formulaire.
   */
  async update(article: Article): Promise<Article> {
    const updated = await firstValueFrom(
      this.httpClient.put<Article>(`${environment.apiUrl}/articles/${article.id}`, article),
    );

    this.articleResource.reload();

    return updated;
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete<void>(`${environment.apiUrl}/articles/${id}`));

    this.articleResource.reload();
  }
}
