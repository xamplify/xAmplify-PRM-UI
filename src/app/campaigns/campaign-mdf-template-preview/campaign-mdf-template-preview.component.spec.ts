import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMdfTemplatePreviewComponent } from './campaign-mdf-template-preview.component';

describe('CampaignMdfTemplatePreviewComponent', () => {
  let component: CampaignMdfTemplatePreviewComponent;
  let fixture: ComponentFixture<CampaignMdfTemplatePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignMdfTemplatePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMdfTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
