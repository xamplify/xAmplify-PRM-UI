import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectManageCampaignComponent } from './select-manage-campaign.component';

describe('SelectManageCampaignComponent', () => {
  let component: SelectManageCampaignComponent;
  let fixture: ComponentFixture<SelectManageCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectManageCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectManageCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
