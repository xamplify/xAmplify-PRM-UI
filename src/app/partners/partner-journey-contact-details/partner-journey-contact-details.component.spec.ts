import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerJourneyContactDetailsComponent } from './partner-journey-contact-details.component';

describe('PartnerJourneyContactDetailsComponent', () => {
  let component: PartnerJourneyContactDetailsComponent;
  let fixture: ComponentFixture<PartnerJourneyContactDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerJourneyContactDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerJourneyContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
