import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedistributedCampaignDetailsComponent } from './redistributed-campaign-details.component';

describe('RedistributedCampaignDetailsComponent', () => {
  let component: RedistributedCampaignDetailsComponent;
  let fixture: ComponentFixture<RedistributedCampaignDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedistributedCampaignDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedistributedCampaignDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
