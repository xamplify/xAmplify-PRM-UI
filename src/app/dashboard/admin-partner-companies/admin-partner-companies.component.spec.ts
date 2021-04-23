import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPartnerCompaniesComponent } from './admin-partner-companies.component';

describe('AdminPartnerCompaniesComponent', () => {
  let component: AdminPartnerCompaniesComponent;
  let fixture: ComponentFixture<AdminPartnerCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPartnerCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPartnerCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
