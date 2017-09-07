import { TestBed, inject } from '@angular/core/testing';

import { VideoBaseReportService } from './video-base-report.service';

describe('VideoBaseReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoBaseReportService]
    });
  });

  it('should ...', inject([VideoBaseReportService], (service: VideoBaseReportService) => {
    expect(service).toBeTruthy();
  }));
});
