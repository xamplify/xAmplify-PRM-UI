import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCompanyDomainModalPopupComponent } from './partner-company-domain-modal-popup.component';

describe('PartnerCompanyDomainModalPopupComponent', () => {
  let component: PartnerCompanyDomainModalPopupComponent;
  let fixture: ComponentFixture<PartnerCompanyDomainModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerCompanyDomainModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerCompanyDomainModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
