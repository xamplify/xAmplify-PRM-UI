import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageFormAnalyticsComponent } from './landing-page-form-analytics.component';

describe('LandingPageFormAnalyticsComponent', () => {
  let component: LandingPageFormAnalyticsComponent;
  let fixture: ComponentFixture<LandingPageFormAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageFormAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageFormAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
