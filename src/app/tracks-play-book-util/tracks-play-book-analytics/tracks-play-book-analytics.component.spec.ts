import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksPlayBookAnalyticsComponent } from './tracks-play-book-analytics.component';

describe('TracksPlayBookAnalyticsComponent', () => {
  let component: TracksPlayBookAnalyticsComponent;
  let fixture: ComponentFixture<TracksPlayBookAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracksPlayBookAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksPlayBookAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
