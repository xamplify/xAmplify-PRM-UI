import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorActivityAnalyticsComponent } from './vendor-activity-analytics.component';

describe('VendorActivityAnalyticsComponent', () => {
  let component: VendorActivityAnalyticsComponent;
  let fixture: ComponentFixture<VendorActivityAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorActivityAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorActivityAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
