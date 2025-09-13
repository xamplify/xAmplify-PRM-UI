import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoStatisticsAnalyticsComponent } from './video-statistics-analytics.component';

describe('VideoStatisticsAnalyticsComponent', () => {
  let component: VideoStatisticsAnalyticsComponent;
  let fixture: ComponentFixture<VideoStatisticsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoStatisticsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoStatisticsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
