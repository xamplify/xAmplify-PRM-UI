import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartReportComponent } from './chart-report.component';

describe('ChartReportComponent', () => {
  let component: ChartReportComponent;
  let fixture: ComponentFixture<ChartReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
