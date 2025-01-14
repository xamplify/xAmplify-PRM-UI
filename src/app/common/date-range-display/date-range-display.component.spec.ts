import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeDisplayComponent } from './date-range-display.component';

describe('DateRangeDisplayComponent', () => {
  let component: DateRangeDisplayComponent;
  let fixture: ComponentFixture<DateRangeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
