import { Article, ArticleFormModel } from '../article.model';

export function toFormModel(article: Article): ArticleFormModel {
  return {
    category: article.category,
    newCategory: '',
    content: article.content,
    excerpt: article.excerpt,
    imageUrl: article.imageUrl,
    tags: article.tags.join(', '),
    title: article.title,
  };
}
