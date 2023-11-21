import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareCampaignsComponent } from './share-campaigns.component';

describe('ShareCampaignsComponent', () => {
  let component: ShareCampaignsComponent;
  let fixture: ComponentFixture<ShareCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
