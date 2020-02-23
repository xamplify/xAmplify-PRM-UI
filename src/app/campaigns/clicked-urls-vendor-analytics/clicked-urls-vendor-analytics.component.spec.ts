import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickedUrlsVendorAnalyticsComponent } from './clicked-urls-vendor-analytics.component';

describe('ClickedUrlsVendorAnalyticsComponent', () => {
  let component: ClickedUrlsVendorAnalyticsComponent;
  let fixture: ComponentFixture<ClickedUrlsVendorAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickedUrlsVendorAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickedUrlsVendorAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
