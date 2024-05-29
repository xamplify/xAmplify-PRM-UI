import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberAnalyticsCompanyDetailsComponent } from './team-member-analytics-company-details.component';

describe('TeamMemberAnalyticsCompanyDetailsComponent', () => {
  let component: TeamMemberAnalyticsCompanyDetailsComponent;
  let fixture: ComponentFixture<TeamMemberAnalyticsCompanyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberAnalyticsCompanyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberAnalyticsCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
