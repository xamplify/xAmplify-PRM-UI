import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingCampaignsComponent } from './processing-campaigns.component';

describe('ProcessingCampaignsComponent', () => {
  let component: ProcessingCampaignsComponent;
  let fixture: ComponentFixture<ProcessingCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
