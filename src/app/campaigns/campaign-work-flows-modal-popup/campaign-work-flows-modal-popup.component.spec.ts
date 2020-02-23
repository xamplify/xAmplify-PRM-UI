import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignWorkFlowsModalPopupComponent } from './campaign-work-flows-modal-popup.component';

describe('CampaignWorkFlowsModalPopupComponent', () => {
  let component: CampaignWorkFlowsModalPopupComponent;
  let fixture: ComponentFixture<CampaignWorkFlowsModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignWorkFlowsModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignWorkFlowsModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
