import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageAnalyticsUtilComponent } from './landing-page-analytics-util.component';

describe('LandingPageAnalyticsUtilComponent', () => {
  let component: LandingPageAnalyticsUtilComponent;
  let fixture: ComponentFixture<LandingPageAnalyticsUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageAnalyticsUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageAnalyticsUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
