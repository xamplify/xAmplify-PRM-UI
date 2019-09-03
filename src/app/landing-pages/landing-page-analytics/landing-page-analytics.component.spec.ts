import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageAnalyticsComponent } from './landing-page-analytics.component';

describe('LandingPageAnalyticsComponent', () => {
  let component: LandingPageAnalyticsComponent;
  let fixture: ComponentFixture<LandingPageAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
