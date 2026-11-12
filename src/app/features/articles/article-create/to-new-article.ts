import { ArticleFormModel, NewArticle } from '../article.model';
import { estimateReadingTime, parseTags, resolveCategory, slugify } from './article-fields';

/**
 * Construit l'article à partir des données fournies par l'utilisateur en NewArticle
 * @param articleFormModel: ArticleFormModel
 * @param categories: readonly string[]
 * @param todayDate string
 * @param author string
 * @returns NewArticle
 */
export const toNewArticle = (
  articleFormModel: ArticleFormModel,
  categories: readonly string[],
  todayDate: string,
  author: string,
): NewArticle => {
  const { category, newCategory, ...fields } = articleFormModel;
  const newArticle: NewArticle = {
    ...fields,
    category: resolveCategory(category, newCategory, categories),
    tags: parseTags(fields.tags),
    slug: slugify(fields.title),
    publishedAt: todayDate,
    readingTimeMinutes: estimateReadingTime(fields.content),
    author,
  };

  return newArticle;
};
