import { TestBed, inject } from '@angular/core/testing';

import { UrlAuthGuardService } from './url-auth-guard.service';

describe('UrlAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlAuthGuardService]
    });
  });

  it('should be created', inject([UrlAuthGuardService], (service: UrlAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
