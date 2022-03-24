import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelChartAnalyticsComponent } from './funnel-chart-analytics.component';

describe('FunnelChartAnalyticsComponent', () => {
  let component: FunnelChartAnalyticsComponent;
  let fixture: ComponentFixture<FunnelChartAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnelChartAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnelChartAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
