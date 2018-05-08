import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartnerCampaignsComponent } from './edit-partner-campaigns.component';

describe('EditPartnerCampaignsComponent', () => {
  let component: EditPartnerCampaignsComponent;
  let fixture: ComponentFixture<EditPartnerCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPartnerCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPartnerCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
