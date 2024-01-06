import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent } from './partner-journey-team-member-high-level-analytics-table.component';

describe('PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent', () => {
  let component: PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent;
  let fixture: ComponentFixture<PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
