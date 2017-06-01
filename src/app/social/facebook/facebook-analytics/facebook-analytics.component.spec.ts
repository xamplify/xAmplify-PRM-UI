import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookAnalyticsComponent } from './facebook-analytics.component';

describe('FacebookAnalyticsComponent', () => {
  let component: FacebookAnalyticsComponent;
  let fixture: ComponentFixture<FacebookAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
