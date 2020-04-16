import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsListViewUtilComponent } from './campaigns-list-view-util.component';

describe('CampaignsListViewUtilComponent', () => {
  let component: CampaignsListViewUtilComponent;
  let fixture: ComponentFixture<CampaignsListViewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsListViewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsListViewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
