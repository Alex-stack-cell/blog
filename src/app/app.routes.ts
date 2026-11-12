import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((module) => module.Home),
    title: 'Accueil',
  },
  {
    path: 'articles',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'articles/new',
    loadComponent: () =>
      import('./features/articles/article-create/article-create').then(
        (module) => module.ArticleCreate,
      ),
    title: 'Créez un nouvel article',
  },
  {
    path: 'articles/:id/edit',
    loadComponent: () =>
      import('./features/articles/article-create/article-create').then(
        (module) => module.ArticleCreate,
      ),
    title: "Modifier l'article",
  },
  {
    path: 'articles/:id',
    loadComponent: () =>
      import('./features/articles/article-details/article-details').then(
        (module) => module.ArticleDetail,
      ),
    title: 'Article',
  },

  {
    path: '**',
    loadComponent: () => import('./features/404/error-404').then((module) => module.Error404),
    title: 'Erreur 404 ',
  },
];
