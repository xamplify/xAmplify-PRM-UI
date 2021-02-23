import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedistributedCampaignsAndLeadsQuarterlyBarChartComponent } from './redistributed-campaigns-and-leads-quarterly-bar-chart.component';

describe('RedistributedCampaignsAndLeadsQuarterlyBarChartComponent', () => {
  let component: RedistributedCampaignsAndLeadsQuarterlyBarChartComponent;
  let fixture: ComponentFixture<RedistributedCampaignsAndLeadsQuarterlyBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedistributedCampaignsAndLeadsQuarterlyBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedistributedCampaignsAndLeadsQuarterlyBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
