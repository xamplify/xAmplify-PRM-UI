import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerJourneyLeadDetailsComponent } from './partner-journey-lead-details.component';

describe('PartnerJourneyLeadDetailsComponent', () => {
  let component: PartnerJourneyLeadDetailsComponent;
  let fixture: ComponentFixture<PartnerJourneyLeadDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerJourneyLeadDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerJourneyLeadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
