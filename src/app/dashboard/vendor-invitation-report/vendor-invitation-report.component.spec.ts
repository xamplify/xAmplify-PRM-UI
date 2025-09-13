import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInvitationReportComponent } from './vendor-invitation-report.component';

describe('VendorInvitationReportComponent', () => {
  let component: VendorInvitationReportComponent;
  let fixture: ComponentFixture<VendorInvitationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorInvitationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorInvitationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
