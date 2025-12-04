import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninDialog } from './signin-dialog';

describe('SigninDialog', () => {
  let component: SigninDialog;
  let fixture: ComponentFixture<SigninDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
