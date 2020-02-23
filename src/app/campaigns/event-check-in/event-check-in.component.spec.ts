import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCheckInComponent } from './event-check-in.component';

describe('EventCheckInComponent', () => {
  let component: EventCheckInComponent;
  let fixture: ComponentFixture<EventCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
