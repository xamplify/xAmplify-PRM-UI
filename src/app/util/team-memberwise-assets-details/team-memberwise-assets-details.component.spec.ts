import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberwiseAssetsDetailsComponent } from './team-memberwise-assets-details.component';

describe('TeamMemberwiseAssetsDetailsComponent', () => {
  let component: TeamMemberwiseAssetsDetailsComponent;
  let fixture: ComponentFixture<TeamMemberwiseAssetsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberwiseAssetsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberwiseAssetsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
