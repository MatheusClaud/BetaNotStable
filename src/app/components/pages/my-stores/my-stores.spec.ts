import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStores } from './my-stores';

describe('MyStores', () => {
  let component: MyStores;
  let fixture: ComponentFixture<MyStores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyStores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyStores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
