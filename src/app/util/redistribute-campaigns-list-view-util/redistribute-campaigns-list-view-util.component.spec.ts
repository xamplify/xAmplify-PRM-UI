import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedistributeCampaignsListViewUtilComponent } from './redistribute-campaigns-list-view-util.component';

describe('RedistributeCampaignsListViewUtilComponent', () => {
  let component: RedistributeCampaignsListViewUtilComponent;
  let fixture: ComponentFixture<RedistributeCampaignsListViewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedistributeCampaignsListViewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedistributeCampaignsListViewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
