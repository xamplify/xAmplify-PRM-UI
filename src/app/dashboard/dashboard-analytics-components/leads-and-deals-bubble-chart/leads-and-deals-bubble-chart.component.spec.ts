import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsAndDealsBubbleChartComponent } from './leads-and-deals-bubble-chart.component';

describe('LeadsAndDealsBubbleChartComponent', () => {
  let component: LeadsAndDealsBubbleChartComponent;
  let fixture: ComponentFixture<LeadsAndDealsBubbleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsAndDealsBubbleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsAndDealsBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
