import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFansLineChartComponent } from './new-fans-line-chart.component';

describe('NewFansLineChartComponent', () => {
  let component: NewFansLineChartComponent;
  let fixture: ComponentFixture<NewFansLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFansLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFansLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
