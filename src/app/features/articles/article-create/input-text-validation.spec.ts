import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { trimmedText } from './input-text-validation';

describe('trimmedText', () => {
  const rules = {
    required: 'Obligatoire',
    min: { length: 3, message: 'Trop court' },
    max: { length: 10, message: 'Trop long' },
  };

  /** Crée un formulaire d'un seul champ avec `trimmedText` et renvoie ses types d'erreur. */
  function errorKinds(value: string): string[] {
    const model = signal({ name: value });
    const f = TestBed.runInInjectionContext(() =>
      form(model, (path) => trimmedText(path.name, rules)),
    );
    return f
      .name()
      .errors()
      .map((e) => e.kind);
  }

  it('la valeur entrée est requise', () => {
    expect(errorKinds('')).toEqual(['required']);
  });

  it('une valeur composée uniquement d’espaces est refusée comme vide', () => {
    expect(errorKinds('   ')).toEqual(['required']);
  });

  it('la valeur entrée doit respecter une taille minimum fournie', () => {
    expect(errorKinds('ab')).toEqual(['minLength']);
  });

  it('la valeur entrée doit respecter une taille maximum fournie', () => {
    expect(errorKinds('abcdefghijk')).toEqual(['maxLength']);
  });

  it('les espaces autour ne comptent pas dans la longueur', () => {
    expect(errorKinds('  ab  ')).toEqual(['minLength']);
  });

  it('une valeur valide ne produit aucune erreur', () => {
    expect(errorKinds('abcde')).toEqual([]);
  });
});
