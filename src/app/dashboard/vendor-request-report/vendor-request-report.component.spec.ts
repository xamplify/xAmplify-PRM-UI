import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRequestReportComponent } from './vendor-request-report.component';

describe('VendorRequestReportComponent', () => {
  let component: VendorRequestReportComponent;
  let fixture: ComponentFixture<VendorRequestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRequestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
