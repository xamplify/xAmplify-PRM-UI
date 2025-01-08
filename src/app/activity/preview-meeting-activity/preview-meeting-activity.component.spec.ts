import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMeetingActivityComponent } from './preview-meeting-activity.component';

describe('PreviewMeetingActivityComponent', () => {
  let component: PreviewMeetingActivityComponent;
  let fixture: ComponentFixture<PreviewMeetingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewMeetingActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMeetingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
