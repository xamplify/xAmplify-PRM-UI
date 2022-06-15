import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartAnalyticsComponent } from './pie-chart-analytics.component';

describe('PieChartAnalyticsComponent', () => {
  let component: PieChartAnalyticsComponent;
  let fixture: ComponentFixture<PieChartAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
