import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Search } from './search';
import { ArticleService } from '../article.service';
import { ArticleFilterService } from '../article-filter.service';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

const setSearch = vi.fn();
const search = signal('');
describe('Search', () => {
  let fixture: ComponentFixture<Search>;
  let input: HTMLInputElement;

  /** Saisit un texte dans le champ, comme le ferait l'utilisateur. */
  function type(text: string): void {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    TestBed.tick();
  }

  beforeEach(async () => {
    setSearch.mockReset();
    search.set('');
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [Search],
      providers: [
        provideRouter([]),
        {
          provide: ArticleService,
          useValue: {
            categories: signal<string[]>([]),
          },
        },
        {
          provide: ArticleFilterService,
          useValue: {
            category: signal(''),
            search,
            setSearch,
            setCategory: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  afterEach(() => vi.useRealTimers());

  it("n'envoie la recherche au filtre qu'après 300ms sans frappe", () => {
    type('manette');
    vi.advanceTimersByTime(299);
    expect(setSearch).not.toHaveBeenCalledWith('manette');
  });

  it('envoie la recherche au filtre à 300ms sans frappe', () => {
    type('manette');
    vi.advanceTimersByTime(300);
    expect(setSearch).toHaveBeenCalledWith('manette');
  });

  it('timer réinitialisé après une frappe lorsque les 300ms ne sont pas encore écoulées', () => {
    type('m');
    vi.advanceTimersByTime(100);

    type('ma');
    vi.advanceTimersByTime(100);

    type('man');
    vi.advanceTimersByTime(300);

    expect(setSearch).toHaveBeenCalledWith('man');
    expect(setSearch).not.toHaveBeenCalledWith('m');
    expect(setSearch).not.toHaveBeenCalledWith('ma');
  });

  it('vide le champ quand les filtres sont réinitialisés dans le service', () => {
    // Le service a reçu la recherche (après le debounce)…
    search.set('manette');
    fixture.detectChanges();
    expect(input.value).toBe('manette');

    // … puis ArticleList réinitialise les filtres.
    search.set('');
    fixture.detectChanges();

    expect(input.value).toBe('');
  });
});
