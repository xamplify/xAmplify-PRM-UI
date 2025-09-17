import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent } from './news-and-announcement-and-instant-navigation-dashboard-analytics.component';

describe('NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent', () => {
  let component: NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent;
  let fixture: ComponentFixture<NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
