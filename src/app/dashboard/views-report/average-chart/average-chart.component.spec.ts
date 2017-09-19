import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvarageChartComponent } from './avarage-chart.component';

describe('AvarageChartComponent', () => {
  let component: AvarageChartComponent;
  let fixture: ComponentFixture<AvarageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvarageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvarageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
