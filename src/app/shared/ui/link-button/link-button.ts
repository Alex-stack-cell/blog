import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Atome : lien de navigation en forme de bouton (`outline` discret, `solid` pour l'action principale). */
@Component({
  selector: 'ui-link-button',
  imports: [RouterLink],
  template: `
    <a [routerLink]="to()" [class]="classes()">
      <ng-content />
    </a>
  `,
  host: { class: 'inline-block' },
})
export class LinkButton {
  to = input.required<string>();
  variant = input<'outline' | 'solid'>('outline');

  protected classes = computed(() =>
    this.variant() === 'solid' ? 'button-solid' : 'button-outline',
  );
}
