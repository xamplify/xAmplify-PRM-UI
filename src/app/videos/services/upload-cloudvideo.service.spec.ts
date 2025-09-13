import { TestBed, inject } from '@angular/core/testing';

import { UploadCloudvideoService } from './upload-cloudvideo.service';

describe('UploadCloudvideoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadCloudvideoService]
    });
  });

  it('should ...', inject([UploadCloudvideoService], (service: UploadCloudvideoService) => {
    expect(service).toBeTruthy();
  }));
});
