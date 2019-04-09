import { TestBed, inject } from '@angular/core/testing';

import { DealRegistrationService } from './deal-registration.service';

describe('DealRegistrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DealRegistrationService]
    });
  });

  it('should be created', inject([DealRegistrationService], (service: DealRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
