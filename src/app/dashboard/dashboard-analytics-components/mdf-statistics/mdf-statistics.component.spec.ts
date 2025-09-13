import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdfStatisticsComponent } from './mdf-statistics.component';

describe('MdfStatisticsComponent', () => {
  let component: MdfStatisticsComponent;
  let fixture: ComponentFixture<MdfStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdfStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdfStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
