import { Component, input } from '@angular/core';

/** Atome : message d'erreur plein contenu (icône, titre, explication). Annoncé par les lecteurs d'écran. */
@Component({
  selector: 'ui-error-message',
  template: `
    <div class="mx-auto max-w-6xl p-6">
      <div
        role="alert"
        class="surface flex flex-col items-center gap-4 border-t-4 border-danger px-6 py-14 text-center"
      >
        <span
          aria-hidden="true"
          class="flex h-14 w-14 items-center justify-center rounded-full bg-danger/15 text-2xl text-danger"
          >⚠</span
        >
        <h2 class="display-title text-2xl">{{ title() }}</h2>
        <p class="max-w-md text-gray-400" data-id="errorMessage">{{ message() }}</p>
      </div>
    </div>
  `,
})
export class ErrorMessage {
  title = input('Connexion perdue');
  message = input('Le serveur est actuellement indisponible. Réessaie dans quelques instants.');
}
