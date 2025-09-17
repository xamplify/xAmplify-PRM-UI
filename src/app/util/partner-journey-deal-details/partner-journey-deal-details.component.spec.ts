import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerJourneyDealDetailsComponent } from './partner-journey-deal-details.component';

describe('PartnerJourneyDealDetailsComponent', () => {
  let component: PartnerJourneyDealDetailsComponent;
  let fixture: ComponentFixture<PartnerJourneyDealDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerJourneyDealDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerJourneyDealDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
