import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCampaignsComponent } from './manage-campaigns.component';

describe('ManageCampaignsComponent', () => {
  let component: ManageCampaignsComponent;
  let fixture: ComponentFixture<ManageCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
