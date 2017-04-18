import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartGeoDistributionComponent } from './pie-chart-geo-distribution.component';

describe('PieChartGeoDistributionComponent', () => {
  let component: PieChartGeoDistributionComponent;
  let fixture: ComponentFixture<PieChartGeoDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartGeoDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartGeoDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
