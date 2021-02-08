import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCampaignDealsComponent } from './manage-campaign-deals.component';

describe('ManageCampaignDealsComponent', () => {
  let component: ManageCampaignDealsComponent;
  let fixture: ComponentFixture<ManageCampaignDealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCampaignDealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCampaignDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
