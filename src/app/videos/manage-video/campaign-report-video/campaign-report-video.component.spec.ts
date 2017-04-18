import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignReportVideoComponent } from './campaign-report-video.component';

describe('CampaignReportVideoComponent', () => {
  let component: CampaignReportVideoComponent;
  let fixture: ComponentFixture<CampaignReportVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignReportVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignReportVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
