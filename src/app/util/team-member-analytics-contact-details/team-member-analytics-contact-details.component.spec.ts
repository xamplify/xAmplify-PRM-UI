import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberAnalyticsContactDetailsComponent } from './team-member-analytics-contact-details.component';

describe('TeamMemberAnalyticsContactDetailsComponent', () => {
  let component: TeamMemberAnalyticsContactDetailsComponent;
  let fixture: ComponentFixture<TeamMemberAnalyticsContactDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberAnalyticsContactDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberAnalyticsContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
