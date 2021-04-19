import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayBookAnalyticsComponent } from './play-book-analytics.component';

describe('PlayBookAnalyticsComponent', () => {
  let component: PlayBookAnalyticsComponent;
  let fixture: ComponentFixture<PlayBookAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayBookAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayBookAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
