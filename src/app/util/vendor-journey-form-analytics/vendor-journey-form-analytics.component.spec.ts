import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorJourneyFormAnalyticsComponent } from './vendor-journey-form-analytics.component';

describe('VendorJourneyFormAnalyticsComponent', () => {
  let component: VendorJourneyFormAnalyticsComponent;
  let fixture: ComponentFixture<VendorJourneyFormAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorJourneyFormAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorJourneyFormAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
