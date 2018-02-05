import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrellisChartComponent } from './trellis-chart.component';

describe('TrellisChartComponent', () => {
  let component: TrellisChartComponent;
  let fixture: ComponentFixture<TrellisChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrellisChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrellisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
