import { TestBed, inject } from '@angular/core/testing';

import { AzugaService } from './azuga.service';

describe('AzugaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AzugaService]
    });
  });

  it('should be created', inject([AzugaService], (service: AzugaService) => {
    expect(service).toBeTruthy();
  }));
});
