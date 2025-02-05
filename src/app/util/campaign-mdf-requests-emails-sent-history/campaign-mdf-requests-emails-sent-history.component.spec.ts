import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMdfRequestsEmailsSentHistoryComponent } from './campaign-mdf-requests-emails-sent-history.component';

describe('CampaignMdfRequestsEmailsSentHistoryComponent', () => {
  let component: CampaignMdfRequestsEmailsSentHistoryComponent;
  let fixture: ComponentFixture<CampaignMdfRequestsEmailsSentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignMdfRequestsEmailsSentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMdfRequestsEmailsSentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
