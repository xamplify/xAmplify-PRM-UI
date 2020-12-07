import { TestBed, inject } from '@angular/core/testing';

import { DealsService } from './deals.service';

describe('DealsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DealsService]
    });
  });

  it('should be created', inject([DealsService], (service: DealsService) => {
    expect(service).toBeTruthy();
  }));
});
