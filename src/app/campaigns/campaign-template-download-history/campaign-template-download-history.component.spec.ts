import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignTemplateDownloadHistoryComponent } from './campaign-template-download-history.component';

describe('CampaignTemplateDownloadHistoryComponent', () => {
  let component: CampaignTemplateDownloadHistoryComponent;
  let fixture: ComponentFixture<CampaignTemplateDownloadHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignTemplateDownloadHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignTemplateDownloadHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
