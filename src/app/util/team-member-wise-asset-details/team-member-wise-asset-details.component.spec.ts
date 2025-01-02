import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberWiseAssetDetailsComponent } from './team-member-wise-asset-details.component';

describe('TeamMemberWiseAssetDetailsComponent', () => {
  let component: TeamMemberWiseAssetDetailsComponent;
  let fixture: ComponentFixture<TeamMemberWiseAssetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberWiseAssetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberWiseAssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
