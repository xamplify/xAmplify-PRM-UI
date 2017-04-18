import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsReportComponent } from './views-report.component';

describe('ViewsReportComponent', () => {
  let component: ViewsReportComponent;
  let fixture: ComponentFixture<ViewsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
