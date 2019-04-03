import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealAnalyticsComponent } from './deal-analytics.component';

describe('DealAnalyticsComponent', () => {
  let component: DealAnalyticsComponent;
  let fixture: ComponentFixture<DealAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
