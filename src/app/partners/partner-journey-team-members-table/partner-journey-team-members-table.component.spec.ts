import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerJourneyTeamMembersTableComponent } from './partner-journey-team-members-table.component';

describe('PartnerJourneyTeamMembersTableComponent', () => {
  let component: PartnerJourneyTeamMembersTableComponent;
  let fixture: ComponentFixture<PartnerJourneyTeamMembersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerJourneyTeamMembersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerJourneyTeamMembersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
