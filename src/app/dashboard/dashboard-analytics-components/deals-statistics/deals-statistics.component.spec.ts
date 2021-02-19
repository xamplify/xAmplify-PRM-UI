import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsStatisticsComponent } from './deals-statistics.component';

describe('DealsStatisticsComponent', () => {
  let component: DealsStatisticsComponent;
  let fixture: ComponentFixture<DealsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
