import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartVariablePieComponent } from './chart-variable-pie.component';

describe('ChartVariablePieComponent', () => {
  let component: ChartVariablePieComponent;
  let fixture: ComponentFixture<ChartVariablePieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartVariablePieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartVariablePieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
