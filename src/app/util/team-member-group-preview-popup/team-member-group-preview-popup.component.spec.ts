import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberGroupPreviewPopupComponent } from './team-member-group-preview-popup.component';

describe('TeamMemberGroupPreviewPopupComponent', () => {
  let component: TeamMemberGroupPreviewPopupComponent;
  let fixture: ComponentFixture<TeamMemberGroupPreviewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberGroupPreviewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberGroupPreviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
