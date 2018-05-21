import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCampaignComponent } from './preview-campaign.component';

describe('PreviewCampaignComponent', () => {
  let component: PreviewCampaignComponent;
  let fixture: ComponentFixture<PreviewCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
