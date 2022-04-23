import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartStatisticsBarGraphComponent } from './pie-chart-statistics-bar-graph.component';

describe('PieChartStatisticsBarGraphComponent', () => {
  let component: PieChartStatisticsBarGraphComponent;
  let fixture: ComponentFixture<PieChartStatisticsBarGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartStatisticsBarGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartStatisticsBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
