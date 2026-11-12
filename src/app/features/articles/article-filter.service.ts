import { computed, inject, Injectable, signal } from '@angular/core';
import { ArticleService } from './article.service';
import { filterArticles } from './filter-articles';

/** État et logique du filtre : texte saisi, catégorie choisie, liste filtrée. */
@Injectable({
  providedIn: 'root',
})
export class ArticleFilterService {
  private readonly articleService = inject(ArticleService);

  private readonly searchTerm = signal('');
  private readonly selectedCategory = signal('');

  readonly category = this.selectedCategory.asReadonly();
  readonly search = this.searchTerm.asReadonly();

  readonly filteredArticles = computed(() =>
    filterArticles(this.articleService.articles(), this.searchTerm(), this.selectedCategory()),
  );

  readonly hasActiveFilter = computed(
    () => this.selectedCategory() !== '' || this.searchTerm().trim() !== '',
  );

  setSearch(title: string): void {
    this.searchTerm.set(title);
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
  }
}
