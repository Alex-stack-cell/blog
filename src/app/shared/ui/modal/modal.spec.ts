import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Modal } from './modal';

describe('Modal', () => {
  let fixture: ComponentFixture<Modal>;
  let onClosed: Mock<() => void>;

  const dialog = (): HTMLElement | null => fixture.nativeElement.querySelector('[role="dialog"]');
  const closeBtn = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('[data-testid="closeBtn"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Modal] }).compileComponents();
    fixture = TestBed.createComponent(Modal);
    fixture.componentRef.setInput('title', 'Article publié');
    onClosed = vi.fn<() => void>();
    fixture.componentInstance.closed.subscribe(onClosed);
  });

  it('ne rend rien quand elle est fermée', async () => {
    fixture.componentRef.setInput('open', false);
    await fixture.whenStable();

    expect(dialog()).toBeNull();
  });

  it('affiche le titre quand elle est ouverte', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    expect(dialog()?.textContent).toContain('Article publié');
  });

  it('émet `closed` au clic sur le bouton', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button').click();

    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it('émet `closed` sur Échap, seulement quand elle est ouverte', async () => {
    fixture.componentRef.setInput('open', false);
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClosed).not.toHaveBeenCalled();

    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it("n'émet pas closed au clic dans la boîte", async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    dialog()!.click();
    expect(onClosed).not.toHaveBeenCalled();
  });

  it('émet closed au clic sur le fond', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    dialog()!.parentElement!.click();
    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it('affiche "OK" sur le bouton par défaut', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    const buttonLabel = closeBtn()!.textContent.trim();

    expect(buttonLabel).toEqual('OK');
  });

  it('affiche le libellé fourni sur le bouton de fermeture', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('closeLabel', 'Fermer la modale');
    await fixture.whenStable();

    const buttonLabel = closeBtn()!.textContent.trim();

    expect(buttonLabel).toEqual('Fermer la modale');
  });

  it("met le focus sur le bouton à l'ouverture", async () => {
    fixture.componentRef.setInput('open', false);
    await fixture.whenStable();

    expect(closeBtn()).toBeNull();

    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    expect(document.activeElement).toBe(closeBtn());
  });
});
