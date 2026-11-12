import { Component, input } from '@angular/core';
import { Article } from '../article.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Badge } from '../../../shared/ui/badge/badge';
import { Tag } from '../../../shared/ui/tag/tag';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.html',
  imports: [DatePipe, RouterLink, Badge, Tag],
})
export class ArticleCard {
  article = input.required<Article>();
}
