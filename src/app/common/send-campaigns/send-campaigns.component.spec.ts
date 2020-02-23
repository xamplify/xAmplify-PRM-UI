import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCampaignsComponent } from './send-campaigns.component';

describe('SendCampaignsComponent', () => {
  let component: SendCampaignsComponent;
  let fixture: ComponentFixture<SendCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
