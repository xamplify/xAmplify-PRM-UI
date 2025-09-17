import { TestBed, inject } from '@angular/core/testing';

import { LmsService } from './lms.service';

describe('LmsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LmsService]
    });
  });

  it('should be created', inject([LmsService], (service: LmsService) => {
    expect(service).toBeTruthy();
  }));
});
