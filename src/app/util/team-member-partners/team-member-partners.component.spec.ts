import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberPartnersComponent } from './team-member-partners.component';

describe('TeamMemberPartnersComponent', () => {
  let component: TeamMemberPartnersComponent;
  let fixture: ComponentFixture<TeamMemberPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
