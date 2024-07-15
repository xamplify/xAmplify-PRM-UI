import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignAnalyticsSettingsComponent } from './campaign-analytics-settings.component';

describe('CampaignAnalyticsSettingsComponent', () => {
  let component: CampaignAnalyticsSettingsComponent;
  let fixture: ComponentFixture<CampaignAnalyticsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignAnalyticsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignAnalyticsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
