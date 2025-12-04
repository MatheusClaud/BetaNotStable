import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStore } from './create-store';

describe('CreateStore', () => {
  let component: CreateStore;
  let fixture: ComponentFixture<CreateStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
