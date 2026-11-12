export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number | null;
  likes: number;
  imageUrl: string;
}

export type NewArticle = Omit<Article, 'id' | 'likes'>;

export type ArticleFormModel = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  newCategory: string;
  tags: string;
  imageUrl: string;
};
