import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberAnalyticsAllPartnersDetailsComponent } from './team-member-analytics-all-partners-details.component';

describe('TeamMemberAnalyticsAllPartnersDetailsComponent', () => {
  let component: TeamMemberAnalyticsAllPartnersDetailsComponent;
  let fixture: ComponentFixture<TeamMemberAnalyticsAllPartnersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberAnalyticsAllPartnersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberAnalyticsAllPartnersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
