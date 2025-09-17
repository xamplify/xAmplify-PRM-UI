import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalBatChartComponent } from './horizontal-bat-chart.component';

describe('HorizontalBatChartComponent', () => {
  let component: HorizontalBatChartComponent;
  let fixture: ComponentFixture<HorizontalBatChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalBatChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalBatChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
