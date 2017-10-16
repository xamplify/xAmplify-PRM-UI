import { TestBed, inject } from '@angular/core/testing';

import { PartnerService } from './partner.service';

describe('ContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartnerService]
    });
  });

  it('should ...', inject([PartnerService], (service: PartnerService) => {
    expect(service).toBeTruthy();
  }));
});
