import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerJourneyCompanyInfoComponent } from './partner-journey-company-info.component';

describe('PartnerJourneyCompanyInfoComponent', () => {
  let component: PartnerJourneyCompanyInfoComponent;
  let fixture: ComponentFixture<PartnerJourneyCompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerJourneyCompanyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerJourneyCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
