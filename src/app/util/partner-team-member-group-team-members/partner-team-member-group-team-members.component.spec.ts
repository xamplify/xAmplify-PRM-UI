import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerTeamMemberGroupTeamMembersComponent } from './partner-team-member-group-team-members.component';

describe('PartnerTeamMemberGroupTeamMembersComponent', () => {
  let component: PartnerTeamMemberGroupTeamMembersComponent;
  let fixture: ComponentFixture<PartnerTeamMemberGroupTeamMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerTeamMemberGroupTeamMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerTeamMemberGroupTeamMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
