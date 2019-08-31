import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLandingPageFormsComponent } from './campaign-landing-page-forms.component';

describe('CampaignLandingPageFormsComponent', () => {
  let component: CampaignLandingPageFormsComponent;
  let fixture: ComponentFixture<CampaignLandingPageFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignLandingPageFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignLandingPageFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
