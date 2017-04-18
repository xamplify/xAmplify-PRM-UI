import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterAnalyticsComponent } from './twitter-analytics.component';

describe('TwitterAnalyticsComponent', () => {
  let component: TwitterAnalyticsComponent;
  let fixture: ComponentFixture<TwitterAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
