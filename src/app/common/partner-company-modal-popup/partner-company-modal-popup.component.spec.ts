import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCompanyModalPopupComponent } from './partner-company-modal-popup.component';

describe('PartnerCompanyModalPopupComponent', () => {
  let component: PartnerCompanyModalPopupComponent;
  let fixture: ComponentFixture<PartnerCompanyModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerCompanyModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerCompanyModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
