import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignFormAnalyticsComponent } from './campaign-form-analytics.component';

describe('CampaignFormAnalyticsComponent', () => {
  let component: CampaignFormAnalyticsComponent;
  let fixture: ComponentFixture<CampaignFormAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignFormAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
