import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlevelAnalyticsDetailReportsComponent } from './highlevel-analytics-detail-reports.component';

describe('HighlevelAnalyticsDetailReportsComponent', () => {
  let component: HighlevelAnalyticsDetailReportsComponent;
  let fixture: ComponentFixture<HighlevelAnalyticsDetailReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlevelAnalyticsDetailReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlevelAnalyticsDetailReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
