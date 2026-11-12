import { Component } from '@angular/core';

/** Atome : étiquette discrète (ex. #manette). */
@Component({
  selector: 'ui-tag',
  template: '<ng-content />',
  host: {
    class:
      'inline-block rounded-md border border-xbox/60 bg-xbox/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-xbox-bright',
  },
})
export class Tag {}
