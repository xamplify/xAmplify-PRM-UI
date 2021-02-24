import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsAndDealsBarChartComponent } from './leads-and-deals-bar-chart.component';

describe('LeadsAndDealsBarChartComponent', () => {
  let component: LeadsAndDealsBarChartComponent;
  let fixture: ComponentFixture<LeadsAndDealsBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsAndDealsBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsAndDealsBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
