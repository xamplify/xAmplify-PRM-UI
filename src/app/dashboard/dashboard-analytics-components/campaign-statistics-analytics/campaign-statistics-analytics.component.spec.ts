import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignStatisticsAnalyticsComponent } from './campaign-statistics-analytics.component';

describe('CampaignStatisticsAnalyticsComponent', () => {
  let component: CampaignStatisticsAnalyticsComponent;
  let fixture: ComponentFixture<CampaignStatisticsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignStatisticsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignStatisticsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
