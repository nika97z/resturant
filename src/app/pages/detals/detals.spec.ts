import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detals } from './detals';

describe('Detals', () => {
  let component: Detals;
  let fixture: ComponentFixture<Detals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detals],
    }).compileComponents();

    fixture = TestBed.createComponent(Detals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
