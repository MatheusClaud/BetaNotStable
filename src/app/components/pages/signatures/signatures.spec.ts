import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signatures } from './signatures';

describe('Signatures', () => {
  let component: Signatures;
  let fixture: ComponentFixture<Signatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Signatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
