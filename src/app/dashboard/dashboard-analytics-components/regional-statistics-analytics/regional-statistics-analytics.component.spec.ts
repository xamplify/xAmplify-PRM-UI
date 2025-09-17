import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalStatisticsAnalyticsComponent } from './regional-statistics-analytics.component';

describe('RegionalStatisticsAnalyticsComponent', () => {
  let component: RegionalStatisticsAnalyticsComponent;
  let fixture: ComponentFixture<RegionalStatisticsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionalStatisticsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalStatisticsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
