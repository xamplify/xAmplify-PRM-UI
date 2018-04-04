import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurtureCampaignComponent } from './nurture-campaign.component';

describe('NurtureCampaignComponent', () => {
  let component: NurtureCampaignComponent;
  let fixture: ComponentFixture<NurtureCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurtureCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurtureCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
