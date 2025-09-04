import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCampaignComponent } from './event-campaign.component';

describe('EventCampaignComponent', () => {
  let component: EventCampaignComponent;
  let fixture: ComponentFixture<EventCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
