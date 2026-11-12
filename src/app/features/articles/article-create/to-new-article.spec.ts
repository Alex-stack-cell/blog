import { ArticleFormModel, NewArticle } from '../article.model';
import { OTHER_CATEGORY } from './article-fields';
import { toNewArticle } from './to-new-article';

describe('toNewArticle', () => {
  const articleFormModel: ArticleFormModel = {
    title: 'Gears of War : E-day - Le grand test',
    excerpt: "Test de l'exclusivitée tant attendue de la XBOX",
    content: 'blablablabla',
    category: 'Test',
    newCategory: '',
    tags: 'Test, Exclu, Unreal Engine 5',
    imageUrl: '',
  };
  const todayDate = '2026-10-13';

  const categories = ['Test', 'Hardware', 'Game Pass'];
  const author = 'John Doe';

  it('créer un nouvel article', () => {
    const newArticle: NewArticle = {
      author: 'John Doe',
      category: 'Test',
      content: 'blablablabla',
      excerpt: "Test de l'exclusivitée tant attendue de la XBOX",
      imageUrl: '',
      publishedAt: todayDate,
      readingTimeMinutes: 1,
      slug: 'gears-of-war-e-day-le-grand-test',
      tags: ['Test', 'Exclu', 'Unreal Engine 5'],
      title: 'Gears of War : E-day - Le grand test',
    };

    expect(toNewArticle(articleFormModel, categories, todayDate, author)).toStrictEqual(newArticle);
  });

  it('utilise la catégorie saisie quand "Autre" est choisi', () => {
    const model = { ...articleFormModel, category: OTHER_CATEGORY, newCategory: ' hardware ' };
    const result = toNewArticle(model, categories, '2026-10-13', author);

    expect(result.category).toBe('Hardware');
  });
});
