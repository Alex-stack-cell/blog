import { Article } from './article.model';

export function filterArticles(
  articles: readonly Article[],
  search: string,
  category: string,
): Article[] {
  const title = search.trim().toLowerCase();

  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(title) &&
      (category === '' || article.category === category),
  );
}