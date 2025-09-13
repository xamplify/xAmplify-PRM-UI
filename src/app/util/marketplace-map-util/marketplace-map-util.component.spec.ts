import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceMapUtilComponent } from './marketplace-map-util.component';

describe('MarketplaceMapUtilComponent', () => {
  let component: MarketplaceMapUtilComponent;
  let fixture: ComponentFixture<MarketplaceMapUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceMapUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceMapUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
