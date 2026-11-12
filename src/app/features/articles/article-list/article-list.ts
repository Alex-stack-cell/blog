import { Component, inject } from '@angular/core';
import { ArticleService } from '../article.service';
import { ArticleFilterService } from '../article-filter.service';
import { ArticleCard } from '../article-card/article-card';
import { ErrorMessage } from '../../../shared/ui/error-message/error-message';
import { Loading } from '../../../shared/ui/loading/loading';

/** Résultats du filtre : compteur, états (erreur, chargement, vide) et grille de cartes. */
@Component({
  templateUrl: './article-list.html',
  selector: 'app-article-list',
  imports: [ArticleCard, ErrorMessage, Loading],
})
export class ArticleList {
  private readonly articleService = inject(ArticleService);
  private readonly filterService = inject(ArticleFilterService);

  protected readonly error = this.articleService.error;
  protected readonly isLoading = this.articleService.isLoading;
  protected readonly filteredArticles = this.filterService.filteredArticles;
  protected readonly hasActiveFilter = this.filterService.hasActiveFilter;

  protected reset(): void {
    this.filterService.resetFilters();
  }
}
