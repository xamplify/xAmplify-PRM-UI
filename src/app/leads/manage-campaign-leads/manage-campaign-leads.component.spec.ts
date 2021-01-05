import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCampaignLeadsComponent } from './manage-campaign-leads.component';

describe('ManageCampaignLeadsComponent', () => {
  let component: ManageCampaignLeadsComponent;
  let fixture: ComponentFixture<ManageCampaignLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCampaignLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCampaignLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
