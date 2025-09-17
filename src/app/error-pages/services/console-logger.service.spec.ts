import { TestBed, inject } from '@angular/core/testing';

import { ConsoleLoggerService } from './console-logger.service';

describe('ConsoleLoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsoleLoggerService]
    });
  });

  it('should be created', inject([ConsoleLoggerService], (service: ConsoleLoggerService) => {
    expect(service).toBeTruthy();
  }));
});
