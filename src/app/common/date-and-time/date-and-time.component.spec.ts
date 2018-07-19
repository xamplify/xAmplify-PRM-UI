import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAndTimeComponent } from './date-and-time.component';

describe('DateAndTimeComponent', () => {
  let component: DateAndTimeComponent;
  let fixture: ComponentFixture<DateAndTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateAndTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateAndTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
