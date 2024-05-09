import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedistributedCampaignsAndLeadsBarChartComponent } from './redistributed-campaigns-and-leads-bar-chart.component';

describe('RedistributedCampaignsAndLeadsBarChartComponent', () => {
  let component: RedistributedCampaignsAndLeadsBarChartComponent;
  let fixture: ComponentFixture<RedistributedCampaignsAndLeadsBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedistributedCampaignsAndLeadsBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedistributedCampaignsAndLeadsBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
