import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCompanyAndGroupsModalPopupComponent } from './partner-company-and-groups-modal-popup.component';

describe('PartnerCompanyAndGroupsModalPopupComponent', () => {
  let component: PartnerCompanyAndGroupsModalPopupComponent;
  let fixture: ComponentFixture<PartnerCompanyAndGroupsModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerCompanyAndGroupsModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerCompanyAndGroupsModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
