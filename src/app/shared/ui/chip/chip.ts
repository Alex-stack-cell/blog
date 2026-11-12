import { Component, computed, input } from '@angular/core';

const BASE =
  'cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xbox-bright';
const IDLE = `${BASE} border-white/15 bg-surface text-gray-300 hover:border-xbox hover:text-xbox-bright`;
const ACTIVE = `${BASE} border-xbox bg-xbox text-white shadow-md`;

/** Atome : bouton-filtre à deux états (actif / inactif). */
@Component({
  selector: 'button[uiChip]',
  template: '<ng-content />',
  host: {
    type: 'button',
    '[class]': 'classes()',
    '[attr.aria-pressed]': 'active()',
  },
})
export class Chip {
  active = input(false);

  protected classes = computed(() => (this.active() ? ACTIVE : IDLE));
}