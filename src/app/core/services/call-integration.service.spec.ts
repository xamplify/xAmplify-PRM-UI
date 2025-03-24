import { TestBed, inject } from '@angular/core/testing';

import { CallIntegrationService } from './call-integration.service';

describe('CallIntegrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallIntegrationService]
    });
  });

  it('should be created', inject([CallIntegrationService], (service: CallIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
