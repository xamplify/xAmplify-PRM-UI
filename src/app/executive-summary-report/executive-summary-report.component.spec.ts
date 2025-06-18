import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveSummaryReportComponent } from './executive-summary-report.component';

describe('ExecutiveSummaryReportComponent', () => {
  let component: ExecutiveSummaryReportComponent;
  let fixture: ComponentFixture<ExecutiveSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
