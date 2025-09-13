import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMembersUtilComponent } from './team-members-util.component';

describe('TeamMembersUtilComponent', () => {
  let component: TeamMembersUtilComponent;
  let fixture: ComponentFixture<TeamMembersUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMembersUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMembersUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
