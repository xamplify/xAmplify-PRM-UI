import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedistributedCampaignsComponent } from './redistributed-campaigns.component';

describe('RedistributedCampaignsComponent', () => {
  let component: RedistributedCampaignsComponent;
  let fixture: ComponentFixture<RedistributedCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedistributedCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedistributedCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
