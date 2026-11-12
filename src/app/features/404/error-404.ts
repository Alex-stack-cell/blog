import { Component } from '@angular/core';
import { Page } from '../../shared/ui/page/page';
import { LinkButton } from '../../shared/ui/link-button/link-button';

@Component({
  selector: 'app-error-404',
  templateUrl: './error-404.html',
  imports: [Page, LinkButton],
})
export class Error404 {}
