import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignListAndGridViewComponent } from './campaign-list-and-grid-view.component';

describe('CampaignListAndGridViewComponent', () => {
  let component: CampaignListAndGridViewComponent;
  let fixture: ComponentFixture<CampaignListAndGridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignListAndGridViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignListAndGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
