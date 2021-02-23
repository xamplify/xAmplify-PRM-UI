import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerLeadsBarChartComponent } from './partner-leads-bar-chart.component';

describe('PartnerLeadsBarChartComponent', () => {
  let component: PartnerLeadsBarChartComponent;
  let fixture: ComponentFixture<PartnerLeadsBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerLeadsBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerLeadsBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
