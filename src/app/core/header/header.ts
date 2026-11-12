import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../users/user.service';

/** En-tête commun à toutes les pages : lien vers l'accueil et choix de l'utilisateur courant. */
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [RouterLink],
})
export class Header {
  protected readonly userService = inject(UserService);

  protected onUserChange(event: Event): void {
    this.userService.select((event.target as HTMLSelectElement).value);
  }
}
