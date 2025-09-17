import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorReportComponent } from './vendor-report.component';

describe('VendorReportComponent', () => {
  let component: VendorReportComponent;
  let fixture: ComponentFixture<VendorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
