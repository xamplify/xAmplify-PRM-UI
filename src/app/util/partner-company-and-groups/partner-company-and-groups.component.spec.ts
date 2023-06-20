import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCompanyAndGroupsComponent } from './partner-company-and-groups.component';

describe('PartnerCompanyAndGroupsComponent', () => {
  let component: PartnerCompanyAndGroupsComponent;
  let fixture: ComponentFixture<PartnerCompanyAndGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerCompanyAndGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerCompanyAndGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
