import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingHomeItem } from './trending-home-item';

describe('TrendingHomeItem', () => {
  let component: TrendingHomeItem;
  let fixture: ComponentFixture<TrendingHomeItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingHomeItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingHomeItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
