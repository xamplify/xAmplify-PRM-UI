import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedCampaignAnalyticsComponent } from './detailed-campaign-analytics.component';

describe('DetailedCampaignAnalyticsComponent', () => {
  let component: DetailedCampaignAnalyticsComponent;
  let fixture: ComponentFixture<DetailedCampaignAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedCampaignAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedCampaignAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
