import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedistributedCampaignsWordcloudMapComponent } from './redistributed-campaigns-wordcloud-map.component';

describe('RedistributedCampaignsWordcloudMapComponent', () => {
  let component: RedistributedCampaignsWordcloudMapComponent;
  let fixture: ComponentFixture<RedistributedCampaignsWordcloudMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedistributedCampaignsWordcloudMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedistributedCampaignsWordcloudMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
