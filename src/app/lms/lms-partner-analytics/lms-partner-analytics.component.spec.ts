import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsPartnerAnalyticsComponent } from './lms-partner-analytics.component';

describe('LmsPartnerAnalyticsComponent', () => {
  let component: LmsPartnerAnalyticsComponent;
  let fixture: ComponentFixture<LmsPartnerAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmsPartnerAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsPartnerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
