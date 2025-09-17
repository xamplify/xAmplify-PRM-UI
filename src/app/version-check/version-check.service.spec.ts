import { TestBed, inject } from '@angular/core/testing';

import { VersionCheckService } from './version-check.service';

describe('VersionCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VersionCheckService]
    });
  });

  it('should be created', inject([VersionCheckService], (service: VersionCheckService) => {
    expect(service).toBeTruthy();
  }));
});
