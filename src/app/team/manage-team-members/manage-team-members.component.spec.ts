import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeamMembersComponent } from './manage-team-members.component';

describe('ManageTeamMembersComponent', () => {
  let component: ManageTeamMembersComponent;
  let fixture: ComponentFixture<ManageTeamMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTeamMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
