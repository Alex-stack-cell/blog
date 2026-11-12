import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';

let nextModalId = 0;

/** Atome : fenêtre modale. Le parent pilote `open` et réagit à `closed` (bouton, fond, Échap). */
@Component({
  selector: 'ui-modal',
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        (click)="closed.emit()"
      >
        <div
          role="dialog"
          aria-modal="true"
          class="surface w-full max-w-md p-6 shadow-2xl"
          [attr.aria-labelledby]="titleId"
          (click)="$event.stopPropagation()"
        >
          <h2 [id]="titleId" class="display-title text-2xl">{{ title() }}</h2>
          <div class="mt-4 text-gray-300">
            <ng-content />
          </div>
          <div class="mt-6 flex justify-end">
            <button
              #confirm
              type="button"
              class="button-solid"
              (click)="closed.emit()"
              data-testid="closeBtn"
            >
              {{ closeLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class Modal {
  open = input.required<boolean>();
  title = input.required<string>();
  closeLabel = input('OK');
  closed = output<void>();

  protected readonly titleId = `ui-modal-title-${nextModalId++}`;

  private readonly confirm = viewChild<ElementRef<HTMLButtonElement>>('confirm');

  constructor() {
    // Le focus entre dans la modale dès qu'elle s'ouvre.
    effect(() => this.confirm()?.nativeElement.focus());
  }

  protected onEscape(): void {
    if (this.open()) {
      this.closed.emit();
    }
  }
}
