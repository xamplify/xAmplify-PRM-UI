import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogRegularCampaignComponent } from './log-regular-campaign.component';

describe('LogRegularCampaignComponent', () => {
  let component: LogRegularCampaignComponent;
  let fixture: ComponentFixture<LogRegularCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogRegularCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogRegularCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
