import { TestBed, inject } from '@angular/core/testing';

import { TracksPlayBookUtilService } from './tracks-play-book-util.service';

describe('TracksPlayBookUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TracksPlayBookUtilService]
    });
  });

  it('should be created', inject([TracksPlayBookUtilService], (service: TracksPlayBookUtilService) => {
    expect(service).toBeTruthy();
  }));
});
