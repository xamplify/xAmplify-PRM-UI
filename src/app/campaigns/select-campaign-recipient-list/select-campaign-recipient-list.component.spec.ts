import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCampaignRecipientListComponent } from './select-campaign-recipient-list.component';

describe('SelectCampaignRecipientListComponent', () => {
  let component: SelectCampaignRecipientListComponent;
  let fixture: ComponentFixture<SelectCampaignRecipientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCampaignRecipientListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCampaignRecipientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
