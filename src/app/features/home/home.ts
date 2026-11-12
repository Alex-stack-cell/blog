import { Component } from '@angular/core';
import { Page } from '../../shared/ui/page/page';
import { LinkButton } from '../../shared/ui/link-button/link-button';
import { Search } from '../articles/search/search';
import { ArticleList } from '../articles/article-list/article-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [Page, LinkButton, Search, ArticleList],
})
export class Home {}
