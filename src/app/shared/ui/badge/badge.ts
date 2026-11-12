import { Component } from '@angular/core';

/** Atome : pastille pleine (ex. catégorie). Le positionnement se fait chez l'appelant. */
@Component({
  selector: 'ui-badge',
  template: '<ng-content />',
  host: {
    class:
      'inline-block rounded-full bg-xbox px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white shadow-md',
  },
})
export class Badge {}
