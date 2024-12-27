import { TestBed, inject } from '@angular/core/testing';

import { MeetingActivityService } from './meeting-activity.service';

describe('MeetingActivityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetingActivityService]
    });
  });

  it('should be created', inject([MeetingActivityService], (service: MeetingActivityService) => {
    expect(service).toBeTruthy();
  }));
});
