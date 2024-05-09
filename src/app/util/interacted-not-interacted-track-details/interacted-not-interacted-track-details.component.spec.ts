import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractedNotInteractedTrackDetailsComponent } from './interacted-not-interacted-track-details.component';

describe('InteractedNotInteractedTrackDetailsComponent', () => {
  let component: InteractedNotInteractedTrackDetailsComponent;
  let fixture: ComponentFixture<InteractedNotInteractedTrackDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractedNotInteractedTrackDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractedNotInteractedTrackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
