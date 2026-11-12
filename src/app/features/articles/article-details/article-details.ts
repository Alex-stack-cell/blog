import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { formatPageTitle } from '../../../core/blog-title.strategy';
import { Badge } from '../../../shared/ui/badge/badge';
import { LinkButton } from '../../../shared/ui/link-button/link-button';
import { Page } from '../../../shared/ui/page/page';
import { Tag } from '../../../shared/ui/tag/tag';
import { ArticleService } from '../article.service';

const NOT_FOUND_TITLE = 'Article introuvable';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-details.html',
  imports: [DatePipe, Badge, LinkButton, Page, Tag],
})
export class ArticleDetail {
  /** Paramètre de route `:id` (lié par `withComponentInputBinding`), donc une `string`. */
  readonly id = input.required<string>();

  private readonly detail = inject(ArticleService).detail(this.id);
  private readonly titleService = inject(Title);

  protected readonly isLoading = this.detail.isLoading;

  /** Lire `value()` d'une ressource en erreur lève une exception : on passe par `hasValue()`. */
  protected readonly article = computed(() =>
    this.detail.hasValue() ? this.detail.value() : undefined,
  );

  /** Réponse 404 de l'API, ou id invalide (aucune requête partie). */
  protected readonly notFound = computed(() => {
    if (this.detail.isLoading() || this.article()) {
      return false;
    }
    const error = this.detail.error();
    return error === undefined || (error instanceof HttpErrorResponse && error.status === 404);
  });

  protected readonly failed = computed(
    () => !this.detail.isLoading() && !this.article() && !this.notFound(),
  );

  constructor() {
    effect(() => {
      const title = this.article()?.title ?? (this.notFound() ? NOT_FOUND_TITLE : undefined);
      if (title) {
        this.titleService.setTitle(formatPageTitle(title));
      }
    });
  }
}
