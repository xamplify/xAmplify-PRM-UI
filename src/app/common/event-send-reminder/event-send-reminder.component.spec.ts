import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSendReminderComponent } from './event-send-reminder.component';

describe('EventSendReminderComponent', () => {
  let component: EventSendReminderComponent;
  let fixture: ComponentFixture<EventSendReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSendReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSendReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
