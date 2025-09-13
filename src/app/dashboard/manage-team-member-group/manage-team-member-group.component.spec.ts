import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeamMemberGroupComponent } from './manage-team-member-group.component';

describe('ManageTeamMemberGroupComponent', () => {
  let component: ManageTeamMemberGroupComponent;
  let fixture: ComponentFixture<ManageTeamMemberGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTeamMemberGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamMemberGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
