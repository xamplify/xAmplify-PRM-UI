import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountStatisticsComponent } from './count-statistics.component';

describe('CountStatisticsComponent', () => {
  let component: CountStatisticsComponent;
  let fixture: ComponentFixture<CountStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
