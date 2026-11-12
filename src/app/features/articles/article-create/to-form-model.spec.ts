import { Article, ArticleFormModel } from '../article.model';
import { toFormModel } from './to-form-model';

describe('toFormModel', () => {
  const article: Article = {
    id: 1,
    title: 'Gears of War : E-day - Le grand test',
    slug: 'gow-eday',
    excerpt: "Test de l'exclusivitée tant attendue de la XBOX",
    content: 'blablablabla',
    author: 'John Doe',
    publishedAt: '2026-10-13',
    readingTimeMinutes: 5,
    likes: 10,
    category: 'Test',
    tags: ['Test', 'Exclu', 'Unreal Engine 5'],
    imageUrl: '',
  };

  const articleFormModel: ArticleFormModel = {
    title: 'Gears of War : E-day - Le grand test',
    excerpt: "Test de l'exclusivitée tant attendue de la XBOX",
    content: 'blablablabla',
    category: 'Test',
    newCategory: '',
    tags: 'Test, Exclu, Unreal Engine 5',
    imageUrl: '',
  };

  it('Convertit un article en modèle de formulaire', () => {
    expect(toFormModel(article)).toStrictEqual(articleFormModel);
  });
});
