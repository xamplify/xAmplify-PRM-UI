import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergePartnerCompaniesComponent } from './merge-partner-companies.component';

describe('MergePartnerCompaniesComponent', () => {
  let component: MergePartnerCompaniesComponent;
  let fixture: ComponentFixture<MergePartnerCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergePartnerCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergePartnerCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
