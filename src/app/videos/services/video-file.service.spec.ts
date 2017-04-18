import { TestBed, inject } from '@angular/core/testing';

import { VideoFileService } from './video-file.service';

describe('VideoFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoFileService]
    });
  });

  it('should ...', inject([VideoFileService], (service: VideoFileService) => {
    expect(service).toBeTruthy();
  }));
});
