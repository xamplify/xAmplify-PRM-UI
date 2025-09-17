import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberFilterOptionComponent } from './team-member-filter-option.component';

describe('TeamMemberFilterOptionComponent', () => {
  let component: TeamMemberFilterOptionComponent;
  let fixture: ComponentFixture<TeamMemberFilterOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberFilterOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberFilterOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
