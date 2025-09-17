import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberFilterOptionModalPopupComponent } from './team-member-filter-option-modal-popup.component';

describe('TeamMemberFilterOptionModalPopupComponent', () => {
  let component: TeamMemberFilterOptionModalPopupComponent;
  let fixture: ComponentFixture<TeamMemberFilterOptionModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberFilterOptionModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberFilterOptionModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
