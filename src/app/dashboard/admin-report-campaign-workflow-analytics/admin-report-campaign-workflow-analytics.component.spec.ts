import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportCampaignWorkflowAnalyticsComponent } from './admin-report-campaign-workflow-analytics.component';

describe('AdminReportCampaignWorkflowAnalyticsComponent', () => {
  let component: AdminReportCampaignWorkflowAnalyticsComponent;
  let fixture: ComponentFixture<AdminReportCampaignWorkflowAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReportCampaignWorkflowAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportCampaignWorkflowAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
