import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailStatsAnalyticsComponent } from './email-stats-analytics.component';

describe('EmailStatsAnalyticsComponent', () => {
  let component: EmailStatsAnalyticsComponent;
  let fixture: ComponentFixture<EmailStatsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailStatsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailStatsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
