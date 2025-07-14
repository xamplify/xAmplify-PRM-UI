import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteTeamMemberModalPopupComponent } from './invite-team-member-modal-popup.component';

describe('InviteTeamMemberModalPopupComponent', () => {
  let component: InviteTeamMemberModalPopupComponent;
  let fixture: ComponentFixture<InviteTeamMemberModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteTeamMemberModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteTeamMemberModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
