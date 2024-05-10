import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberwiseAssetsDetailedReportComponent } from './team-memberwise-assets-detailed-report.component';

describe('TeamMemberwiseAssetsDetailedReportComponent', () => {
  let component: TeamMemberwiseAssetsDetailedReportComponent;
  let fixture: ComponentFixture<TeamMemberwiseAssetsDetailedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberwiseAssetsDetailedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberwiseAssetsDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
