import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceCategoriesComponent } from './market-place-categories.component';

describe('MarketPlaceCategoriesComponent', () => {
  let component: MarketPlaceCategoriesComponent;
  let fixture: ComponentFixture<MarketPlaceCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
