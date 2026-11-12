import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { LinkButton } from './link-button';

describe('LinkButton', () => {
  let fixture: ComponentFixture<LinkButton>;

  const link = (): HTMLAnchorElement => fixture.nativeElement.querySelector('a');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkButton],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(LinkButton);
    fixture.componentRef.setInput('to', '/articles');
  });

  it('pointe vers la route fournie', async () => {
    await fixture.whenStable();

    expect(link().getAttribute('href')).toBe('/articles');
  });

  it('utilise le style outline par défaut', async () => {
    await fixture.whenStable();

    expect(link().className).toBe('button-outline');
  });

  it('utilise le style solid quand demandé', async () => {
    fixture.componentRef.setInput('variant', 'solid');
    await fixture.whenStable();

    expect(link().className).toBe('button-solid');
  });
});
