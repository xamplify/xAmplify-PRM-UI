import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorJourneyAnalyticsComponent } from './vendor-journey-analytics.component';

describe('VendorJourneyAnalyticsComponent', () => {
  let component: VendorJourneyAnalyticsComponent;
  let fixture: ComponentFixture<VendorJourneyAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorJourneyAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorJourneyAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
