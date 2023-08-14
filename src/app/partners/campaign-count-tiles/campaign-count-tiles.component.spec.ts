import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignCountTilesComponent } from './campaign-count-tiles.component';

describe('CampaignCountTilesComponent', () => {
  let component: CampaignCountTilesComponent;
  let fixture: ComponentFixture<CampaignCountTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignCountTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignCountTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
