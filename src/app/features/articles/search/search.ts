import { Component, inject, linkedSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { ArticleService } from '../article.service';
import { ArticleFilterService } from '../article-filter.service';
import { Chip } from '../../../shared/ui/chip/chip';

/** Délai (ms) après la dernière frappe avant de lancer la recherche. */
const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  imports: [FormField, Chip],
})
export class Search {
  private readonly articleService = inject(ArticleService);
  private readonly filterService = inject(ArticleFilterService);

  protected categories = this.articleService.categories;
  protected selectedCategory = this.filterService.category;

  /** Suit le service : se vide tout seul quand les filtres sont réinitialisés ailleurs. */
  protected searchModel = linkedSignal(() => ({ title: this.filterService.search() }));

  protected searchForm = form(this.searchModel);

  constructor() {
    toObservable(this.searchModel)
      .pipe(
        map((model) => model.title),
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((title) => this.filterService.setSearch(title));
  }

  protected onSelectCategory(category: string) {
    this.filterService.setCategory(category);
  }
}
