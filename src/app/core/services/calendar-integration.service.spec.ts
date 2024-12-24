import { TestBed, inject } from '@angular/core/testing';

import { CalendarIntegrationService } from './calendar-integration.service';

describe('CalendarIntegrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarIntegrationService]
    });
  });

  it('should be created', inject([CalendarIntegrationService], (service: CalendarIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
