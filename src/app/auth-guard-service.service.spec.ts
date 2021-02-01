import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardServiceService } from './auth-guard-service.service';

describe('AuthGuardServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardServiceService]
    });
  });

  it('should be created', inject([AuthGuardServiceService], (service: AuthGuardServiceService) => {
    expect(service).toBeTruthy();
  }));
});
