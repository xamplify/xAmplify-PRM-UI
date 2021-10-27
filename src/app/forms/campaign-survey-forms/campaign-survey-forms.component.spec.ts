import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSurveyFormsComponent } from './campaign-survey-forms.component';

describe('CampaignSurveyFormsComponent', () => {
  let component: CampaignSurveyFormsComponent;
  let fixture: ComponentFixture<CampaignSurveyFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSurveyFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSurveyFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
