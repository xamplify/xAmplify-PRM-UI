import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterAreaChartComponent } from './twitter-area-chart.component';

describe('TwitterAreaChartComponent', () => {
  let component: TwitterAreaChartComponent;
  let fixture: ComponentFixture<TwitterAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
