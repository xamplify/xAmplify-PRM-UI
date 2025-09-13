import { TestBed, inject } from '@angular/core/testing';

import { VideoUtilService } from './video-util.service';

describe('VideoUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoUtilService]
    });
  });

  it('should ...', inject([VideoUtilService], (service: VideoUtilService) => {
    expect(service).toBeTruthy();
  }));
});
