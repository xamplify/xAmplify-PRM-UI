import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialCampaignComponent } from './social-campaign.component';

describe('SocialCampaignComponent', () => {
  let component: SocialCampaignComponent;
  let fixture: ComponentFixture<SocialCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
