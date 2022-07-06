import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCampaignDetailsModalPopupComponent } from './edit-campaign-details-modal-popup.component';

describe('EditCampaignDetailsModalPopupComponent', () => {
  let component: EditCampaignDetailsModalPopupComponent;
  let fixture: ComponentFixture<EditCampaignDetailsModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCampaignDetailsModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCampaignDetailsModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
