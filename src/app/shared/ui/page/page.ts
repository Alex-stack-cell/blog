import { Component } from '@angular/core';

/** Gabarit : fond sombre plein écran partagé par toutes les pages. */
@Component({
  selector: 'ui-page',
  template: '<ng-content />',
  host: { class: 'block min-h-screen bg-canvas text-gray-100' },
})
export class Page {}
