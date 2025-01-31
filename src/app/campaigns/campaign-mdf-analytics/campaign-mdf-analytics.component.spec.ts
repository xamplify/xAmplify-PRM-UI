import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMdfAnalyticsComponent } from './campaign-mdf-analytics.component';

describe('CampaignMdfAnalyticsComponent', () => {
  let component: CampaignMdfAnalyticsComponent;
  let fixture: ComponentFixture<CampaignMdfAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignMdfAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMdfAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
