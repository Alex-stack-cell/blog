import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_NAME = 'Xbox blog';

/** « Titre | Xbox blog », ou le nom du site seul quand il n'y a pas de titre de page. */
export function formatPageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
}

@Injectable({ providedIn: 'root' })
export class BlogTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.title.setTitle(formatPageTitle(this.buildTitle(snapshot)));
  }
}
