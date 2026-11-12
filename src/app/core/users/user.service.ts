import { inject, Injectable, signal } from '@angular/core';
import { USERS } from './users.token';

/** Utilisateur courant : choisi dans l'en-tête, utilisé comme auteur des articles. */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly users = inject(USERS);

  private readonly selectedUser = signal(this.users[0]);

  readonly currentUser = this.selectedUser.asReadonly();

  select(user: string): void {
    this.selectedUser.set(user);
  }
}
