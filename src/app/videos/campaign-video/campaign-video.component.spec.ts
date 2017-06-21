import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignVideoComponent } from './campaign-video.component';

describe('PublicVideoComponent', () => {
  let component: CampaignVideoComponent;
  let fixture: ComponentFixture<CampaignVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
