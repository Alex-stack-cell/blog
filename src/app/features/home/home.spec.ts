import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { provideRouter } from '@angular/router';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let component: Home;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it("doit afficher la page d'accueil avec un message de bienvenue", async () => {
    await fixture.whenStable();
    const welcome = fixture.nativeElement.querySelector('[data-testid="welcome"]').textContent;
    expect(welcome).toContain('Bienvenue dans le blog Xbox');
  });
});
