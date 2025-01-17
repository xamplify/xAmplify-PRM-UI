import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingActivityComponent } from './meeting-activity.component';

describe('MeetingActivityComponent', () => {
  let component: MeetingActivityComponent;
  let fixture: ComponentFixture<MeetingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
