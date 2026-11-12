import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { OTHER_CATEGORY } from './article-fields';
import { ArticleService } from '../article.service';
import { ArticleCreate } from './article-create';
import { Article, ArticleFormModel } from '../article.model';
import { USERS } from '../../../core/users/users.token';
import { UserService } from '../../../core/users/user.service';

const VALID_MODEL: ArticleFormModel = {
  title: 'Manette Xbox : le test',
  excerpt: 'Un résumé court.',
  content: 'x'.repeat(60),
  category: 'Tests',
  newCategory: '',
  tags: 'manette, xbox',
  imageUrl: '',
};

describe('ArticleCreate validation', () => {
  let fixture: ComponentFixture<ArticleCreate>;
  let component: ArticleCreate;
  const add = vi.fn();
  let navigate: MockInstance<Router['navigate']>;

  beforeEach(async () => {
    add.mockReset();
    add.mockResolvedValue({ id: 1 });

    await TestBed.configureTestingModule({
      imports: [ArticleCreate],
      providers: [
        provideRouter([]),
        { provide: USERS, useValue: ['Alice', 'Bob'] },
        {
          provide: ArticleService,
          useValue: {
            categories: signal(['Tests', 'Actualités']),
            add,
            detail: () => ({ hasValue: () => false, isLoading: () => false }),
          },
        },
      ],
    }).compileComponents();

    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ArticleCreate);
    component = fixture.componentInstance;
  });

  afterEach(() => vi.restoreAllMocks());

  function submitForm(): HTMLFormElement {
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    return form;
  }

  it('est invalide quand le formulaire est vide', () => {
    expect(component.createForm().invalid()).toBe(true);
    expect(
      component.createForm
        .title()
        .errors()
        .map((e) => e.kind),
    ).toContain('required');
    expect(component.createForm.excerpt().invalid()).toBe(true);
    expect(component.createForm.content().invalid()).toBe(true);
    expect(component.createForm.category().invalid()).toBe(true);
    expect(component.createForm.tags().invalid()).toBe(true);
  });

  it('rejette un titre trop court ou trop long', () => {
    component['createModel'].update((m) => ({ ...m, title: 'abc' }));
    expect(
      component.createForm
        .title()
        .errors()
        .map((e) => e.kind),
    ).toContain('minLength');

    component['createModel'].update((m) => ({ ...m, title: 'a'.repeat(121) }));
    expect(
      component.createForm
        .title()
        .errors()
        .map((e) => e.kind),
    ).toContain('maxLength');
  });

  it("n'exige pas d'image mais rejette une URL invalide", () => {
    component['createModel'].set({ ...VALID_MODEL, imageUrl: '' });
    expect(component.createForm.imageUrl().invalid()).toBe(false);

    component['createModel'].set({ ...VALID_MODEL, imageUrl: 'pas-une-url' });
    expect(component.createForm.imageUrl().invalid()).toBe(true);

    component['createModel'].set({ ...VALID_MODEL, imageUrl: 'https://exemple.be/a.png' });
    expect(component.createForm.imageUrl().invalid()).toBe(false);
  });

  it('exige au moins un tag non vide', () => {
    component['createModel'].set({ ...VALID_MODEL, tags: ' , ,' });
    expect(component.createForm.tags().invalid()).toBe(true);
  });

  it('est valide avec un modèle correct', () => {
    component['createModel'].set(VALID_MODEL);
    expect(component.createForm().invalid()).toBe(false);
  });

  it("n'enregistre pas et affiche les erreurs quand le formulaire est invalide", async () => {
    await fixture.whenStable();
    submitForm();
    await fixture.whenStable();

    expect(add).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Le titre est obligatoire');
  });

  it('enregistre quand le formulaire est valide', async () => {
    component['createModel'].set(VALID_MODEL);
    await fixture.whenStable();
    submitForm();
    await fixture.whenStable();

    expect(add).toHaveBeenCalledTimes(1);
  });

  it("enregistre l'utilisateur courant comme auteur", async () => {
    TestBed.inject(UserService).select('Bob');
    component['createModel'].set(VALID_MODEL);
    await fixture.whenStable();
    submitForm();
    await fixture.whenStable();

    expect(add).toHaveBeenCalledWith(expect.objectContaining({ author: 'Bob' }));
  });

  it("refuse un titre, un résumé ou un contenu composés uniquement d'espaces", () => {
    component['createModel'].set({
      ...VALID_MODEL,
      title: '        ',
      excerpt: '   ',
      content: ' '.repeat(80),
    });

    expect(component.createForm.title().invalid()).toBe(true);
    expect(component.createForm.excerpt().invalid()).toBe(true);
    expect(component.createForm.content().invalid()).toBe(true);
  });

  it('compte la longueur minimale sans les espaces autour', () => {
    component['createModel'].set({ ...VALID_MODEL, title: 'ab      ' });
    expect(
      component.createForm
        .title()
        .errors()
        .map((e) => e.kind),
    ).toContain('minLength');
  });

  async function submitValid(): Promise<void> {
    component['createModel'].set(VALID_MODEL);
    await fixture.whenStable();
    submitForm();
    await fixture.whenStable();
  }

  const dialog = (): HTMLElement | null => fixture.nativeElement.querySelector('[role="dialog"]');

  it('affiche la modale de confirmation sans rediriger tout de suite', async () => {
    await submitValid();

    expect(dialog()?.textContent).toContain('Article publié');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('redirige vers la liste à la fermeture de la modale de succès', async () => {
    await submitValid();

    dialog()?.querySelector('button')?.click();

    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it("n'affiche aucune modale à l'ouverture de la page", async () => {
    await fixture.whenStable();

    expect(dialog()).toBeNull();
  });

  it("affiche une erreur et conserve la saisie quand l'enregistrement échoue", async () => {
    add.mockRejectedValue(new Error('API indisponible'));

    await submitValid();

    expect(dialog()?.textContent).toContain('Enregistrement impossible');
    expect(component['createModel']().title).toBe(VALID_MODEL.title);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("reste sur le formulaire à la fermeture de la modale d'erreur", async () => {
    add.mockRejectedValue(new Error('API indisponible'));
    await submitValid();

    dialog()?.querySelector('button')?.click();
    await fixture.whenStable();

    expect(dialog()).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("désactive le bouton « Publier » pendant l'enregistrement", async () => {
    let finish: (article: { id: number }) => void = () => undefined;
    add.mockReturnValue(new Promise((resolve) => (finish = resolve)));

    await submitValid();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);

    finish({ id: 1 });
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
    expect(button.disabled).toBe(false);
  });

  it('ne redirige pas quand le formulaire est invalide', async () => {
    await fixture.whenStable();
    submitForm();
    await fixture.whenStable();

    expect(navigate).not.toHaveBeenCalled();
  });

  it('remet le formulaire à zéro après un enregistrement réussi', async () => {
    component['createModel'].set(VALID_MODEL);
    await fixture.whenStable();
    submitForm();
    await fixture.whenStable();

    expect(component['createModel']().title).toBe('');
    expect(component['createModel']().content).toBe('');
    expect(component.createForm().touched()).toBe(false);
  });

  describe('catégorie « Autre… »', () => {
    const other = { ...VALID_MODEL, category: OTHER_CATEGORY };

    async function submitModel(model: typeof other): Promise<void> {
      component['createModel'].set(model);
      await fixture.whenStable();
      submitForm();
      await fixture.whenStable();
    }

    it('exige un nom quand « Autre… » est choisi', () => {
      component['createModel'].set({ ...other, newCategory: '   ' });

      expect(component.createForm.newCategory().invalid()).toBe(true);
      expect(component.createForm().invalid()).toBe(true);
    });

    it("n'exige rien quand une catégorie existante est choisie", () => {
      component['createModel'].set({ ...VALID_MODEL, newCategory: '' });

      expect(component.createForm.newCategory().invalid()).toBe(false);
      expect(component.createForm().invalid()).toBe(false);
    });

    it('affiche le champ seulement quand « Autre… » est choisi', async () => {
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('#newCategory')).toBeNull();

      component['createModel'].set(other);
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('#newCategory')).not.toBeNull();
    });

    it('enregistre la nouvelle catégorie nettoyée, sans fuite du champ de saisie', async () => {
      await submitModel({ ...other, newCategory: '  Guides  ' });

      const payload = add.mock.calls[0][0];
      expect(payload.category).toBe('Guides');
      expect(payload).not.toHaveProperty('newCategory');
    });

    it('réutilise une catégorie existante saisie avec une autre casse', async () => {
      await submitModel({ ...other, newCategory: 'actualités' });

      expect(add.mock.calls[0][0].category).toBe('Actualités');
    });
  });
});

describe('ArticleCreate modification', () => {
  const ORIGINAL: Article = {
    id: 7,
    title: 'Manette Xbox : le test',
    slug: 'manette-xbox-le-test',
    excerpt: 'Un résumé court.',
    content: 'x'.repeat(60),
    author: 'Alice',
    category: 'Tests',
    tags: ['manette', 'xbox'],
    publishedAt: '2026-01-15',
    readingTimeMinutes: 1,
    likes: 42,
    imageUrl: '',
  };

  let fixture: ComponentFixture<ArticleCreate>;
  const add = vi.fn();
  const update = vi.fn();

  /** Ouvre `/articles/7/edit` ; `article` est ce que l'API renvoie (`undefined` : id inconnu). */
  async function openEditPage(article: Article | undefined): Promise<void> {
    add.mockReset();
    update.mockReset();
    update.mockResolvedValue(article);

    await TestBed.configureTestingModule({
      imports: [ArticleCreate],
      providers: [
        provideRouter([]),
        { provide: USERS, useValue: ['Alice', 'Bob'] },
        {
          provide: ArticleService,
          useValue: {
            categories: signal(['Tests', 'Actualités']),
            add,
            update,
            detail: () => ({
              hasValue: () => article !== undefined,
              value: () => article,
              isLoading: () => false,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreate);
    fixture.componentRef.setInput('id', String(ORIGINAL.id));
    await fixture.whenStable();
  }

  const text = (): string => fixture.nativeElement.textContent;

  it("préremplit le formulaire avec l'article", async () => {
    await openEditPage(ORIGINAL);

    const title: HTMLInputElement = fixture.nativeElement.querySelector('#title');
    expect(title.value).toBe(ORIGINAL.title);
    expect(text()).toContain("Modifier l'article");
  });

  it("met à jour l'article en gardant id, likes, date et auteur d'origine", async () => {
    await openEditPage(ORIGINAL);

    fixture.componentInstance['createModel'].update((m) => ({ ...m, title: 'Nouveau titre' }));
    await fixture.whenStable();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(add).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: ORIGINAL.id,
        likes: ORIGINAL.likes,
        publishedAt: ORIGINAL.publishedAt,
        author: ORIGINAL.author,
        title: 'Nouveau titre',
      }),
    );
    expect(text()).toContain('Article modifié');
  });

  it("n'affiche pas de formulaire vide pour un id inconnu", async () => {
    await openEditPage(undefined);

    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(text()).toContain('Article introuvable');
  });
});
