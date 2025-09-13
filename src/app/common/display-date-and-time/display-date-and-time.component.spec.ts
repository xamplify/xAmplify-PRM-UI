import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDateAndTimeComponent } from './display-date-and-time.component';

describe('DisplayDateAndTimeComponent', () => {
  let component: DisplayDateAndTimeComponent;
  let fixture: ComponentFixture<DisplayDateAndTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayDateAndTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDateAndTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
