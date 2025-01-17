import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeetingModalPopupComponent } from './add-meeting-modal-popup.component';

describe('AddMeetingModalPopupComponent', () => {
  let component: AddMeetingModalPopupComponent;
  let fixture: ComponentFixture<AddMeetingModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeetingModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetingModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
