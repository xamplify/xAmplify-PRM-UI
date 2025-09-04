import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignWorkFlowsUtilComponent } from './campaign-work-flows-util.component';

describe('CampaignWorkFlowsUtilComponent', () => {
  let component: CampaignWorkFlowsUtilComponent;
  let fixture: ComponentFixture<CampaignWorkFlowsUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignWorkFlowsUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignWorkFlowsUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
