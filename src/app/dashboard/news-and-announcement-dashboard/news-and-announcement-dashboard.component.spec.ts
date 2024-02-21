import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAndAnnouncementDashboardComponent } from './news-and-announcement-dashboard.component';

describe('NewsAndAnnouncementDashboardComponent', () => {
  let component: NewsAndAnnouncementDashboardComponent;
  let fixture: ComponentFixture<NewsAndAnnouncementDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsAndAnnouncementDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsAndAnnouncementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
