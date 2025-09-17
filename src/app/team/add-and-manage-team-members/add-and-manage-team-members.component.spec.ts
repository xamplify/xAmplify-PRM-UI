import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAndManageTeamMembersComponent } from './add-and-manage-team-members.component';

describe('AddAndManageTeamMembersComponent', () => {
  let component: AddAndManageTeamMembersComponent;
  let fixture: ComponentFixture<AddAndManageTeamMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAndManageTeamMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAndManageTeamMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
