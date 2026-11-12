import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { LinkButton } from '../../../shared/ui/link-button/link-button';
import { Modal } from '../../../shared/ui/modal/modal';
import { Page } from '../../../shared/ui/page/page';
import { ArticleService } from '../article.service';
import {
  applyWhen,
  form,
  FormField,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { OTHER_CATEGORY, parseTags, todayIso } from './article-fields';
import { Article, ArticleFormModel } from '../article.model';
import { Router } from '@angular/router';
import { toNewArticle } from './to-new-article';
import { trimmedText } from './input-text-validation';
import { UserService } from '../../../core/users/user.service';
import { toFormModel } from './to-form-model';

const INITIAL_MODEL: ArticleFormModel = {
  title: '',
  excerpt: '',
  content: '',
  category: '',
  newCategory: '',
  tags: '',
  imageUrl: '',
};

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.html',
  imports: [Page, LinkButton, Modal, FormField, NgTemplateOutlet],
})
export class ArticleCreate {
  private readonly articleService = inject(ArticleService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  protected readonly id = input<string>();
  private readonly original = this.articleService.detail(() => this.id() ?? '');

  protected categories = this.articleService.categories;

  protected readonly otherCategory = OTHER_CATEGORY;

  protected readonly isEditMode = computed(() => this.id() !== undefined);

  protected readonly isLoading = this.original.isLoading;
  protected readonly notFound = computed(
    () => this.isEditMode() && !this.original.isLoading() && !this.original.hasValue(),
  );

  protected createModel = linkedSignal<ArticleFormModel>(() =>
    this.original.hasValue() ? toFormModel(this.original.value()) : { ...INITIAL_MODEL },
  );

  /** Résultat de la dernière tentative d'enregistrement ; `null` tant qu'il n'y en a pas. */
  protected outcome = signal<'success' | 'error' | null>(null);

  protected feedback = computed(() =>
    this.outcome() === 'error'
      ? {
          title: 'Enregistrement impossible',
          message:
            "Votre article n'a pas été enregistré. Vérifiez que l'API est lancée et réessayez.",
          closeLabel: 'Fermer',
        }
      : {
          title: this.isEditMode() ? 'Article modifié' : 'Article publié',
          message: 'Votre article a bien été enregistré.',
          closeLabel: 'Voir la liste',
        },
  );

  createForm = form(this.createModel, (path) => {
    trimmedText(path.title, {
      required: 'Le titre est obligatoire',
      min: { length: 5, message: 'Le titre doit contenir au moins 5 caractères' },
      max: { length: 120, message: 'Le titre ne doit pas dépasser 120 caractères' },
    });

    trimmedText(path.excerpt, {
      required: 'Le résumé est obligatoire',
      max: { length: 280, message: 'Le résumé ne doit pas dépasser 280 caractères' },
    });

    trimmedText(path.content, {
      required: 'Le contenu est obligatoire',
      min: { length: 50, message: 'Le contenu doit contenir au moins 50 caractères' },
    });

    required(path.category, { message: 'Choisissez une catégorie' });

    // Le nom de la nouvelle catégorie n'est exigé que si « Autre… » est choisi.
    applyWhen(
      path,
      ({ value }) => value().category === OTHER_CATEGORY,
      (other) => {
        trimmedText(other.newCategory, {
          required: 'Saisissez le nom de la catégorie',
          min: { length: 3, message: 'La catégorie doit contenir au moins 3 caractères' },
          max: { length: 40, message: 'La catégorie ne doit pas dépasser 40 caractères' },
        });
      },
    );

    validate(path.tags, ({ value }) =>
      parseTags(value()).length === 0
        ? { kind: 'required', message: 'Renseignez au moins un tag' }
        : undefined,
    );

    // Optionnelle : une chaîne vide est acceptée.
    pattern(path.imageUrl, /^$|^https?:\/\/\S+$/, {
      message: "L'URL de l'image doit commencer par http:// ou https://",
    });
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    void submit(this.createForm, async () => {
      await this.save();
    });
  }

  /** Fermeture de la modale : après un succès on quitte la page, après un échec on reste sur le formulaire. */
  protected onFeedbackClosed(): void {
    const succeeded = this.outcome() === 'success';
    this.outcome.set(null);
    if (succeeded) {
      void this.router.navigate(['/']);
    }
  }

  private async save(): Promise<void> {
    const original = this.original.hasValue() ? this.original.value() : undefined;

    try {
      if (original) {
        await this.update(original);
      } else {
        await this.create();
      }
    } catch {
      // Le formulaire est conservé : l'utilisateur ne perd pas sa saisie.
      this.outcome.set('error');
      return;
    }

    this.outcome.set('success');
  }

  private async create(): Promise<void> {
    const newArticle = toNewArticle(
      this.createModel(),
      this.categories(),
      todayIso(),
      this.userService.currentUser(),
    );
    await this.articleService.add(newArticle);
    this.resetForm();
  }

  /** Garde `id`, `likes`, la date et l'auteur d'origine ; seuls les champs du formulaire changent. */
  private async update(original: Article): Promise<void> {
    const changes = toNewArticle(
      this.createModel(),
      this.categories(),
      original.publishedAt,
      original.author,
    );
    await this.articleService.update({ ...original, ...changes });
  }

  private resetForm(): void {
    this.createForm().reset({ ...INITIAL_MODEL });
  }
}
