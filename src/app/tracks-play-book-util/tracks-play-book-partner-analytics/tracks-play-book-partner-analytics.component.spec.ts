import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksPlayBookPartnerAnalyticsComponent } from './tracks-play-book-partner-analytics.component';

describe('TracksPlayBookPartnerAnalyticsComponent', () => {
  let component: TracksPlayBookPartnerAnalyticsComponent;
  let fixture: ComponentFixture<TracksPlayBookPartnerAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracksPlayBookPartnerAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksPlayBookPartnerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
