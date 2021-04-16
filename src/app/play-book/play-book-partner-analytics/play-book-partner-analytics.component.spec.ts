import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayBookPartnerAnalyticsComponent } from './play-book-partner-analytics.component';

describe('PlayBookPartnerAnalyticsComponent', () => {
  let component: PlayBookPartnerAnalyticsComponent;
  let fixture: ComponentFixture<PlayBookPartnerAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayBookPartnerAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayBookPartnerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
