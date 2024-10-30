import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceUtilComponent } from './marketplace-util.component';

describe('MarketplaceUtilComponent', () => {
  let component: MarketplaceUtilComponent;
  let fixture: ComponentFixture<MarketplaceUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
