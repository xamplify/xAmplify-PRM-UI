import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMdfSearchComponent } from './campaign-mdf-search.component';

describe('CampaignMdfSearchComponent', () => {
  let component: CampaignMdfSearchComponent;
  let fixture: ComponentFixture<CampaignMdfSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignMdfSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMdfSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
