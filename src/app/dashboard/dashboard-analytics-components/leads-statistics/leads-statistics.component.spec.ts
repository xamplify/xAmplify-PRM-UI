import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsStatisticsComponent } from './leads-statistics.component';

describe('LeadsStatisticsComponent', () => {
  let component: LeadsStatisticsComponent;
  let fixture: ComponentFixture<LeadsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
