import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsAnalyticsComponent } from './lms-analytics.component';

describe('LmsAnalyticsComponent', () => {
  let component: LmsAnalyticsComponent;
  let fixture: ComponentFixture<LmsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
