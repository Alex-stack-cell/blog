import { InjectionToken } from '@angular/core';

export const USERS = new InjectionToken<readonly string[]>('USERS', {
  providedIn: 'root',
  factory: () => ['Jean-Michel Joystick', 'Kevin Gamerscore', 'Brigitte Hardware', 'John Doe'],
});
