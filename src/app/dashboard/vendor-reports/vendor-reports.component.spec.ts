import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorReportsComponent } from './vendor-reports.component';

describe('VendorReportsComponent', () => {
  let component: VendorReportsComponent;
  let fixture: ComponentFixture<VendorReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
