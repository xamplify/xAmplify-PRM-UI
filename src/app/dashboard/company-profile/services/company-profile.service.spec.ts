import { TestBed, inject } from '@angular/core/testing';

import { CompanyProfileService } from './company-profile.service';

describe('CompanyProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyProfileService]
    });
  });

  it('should be created', inject([CompanyProfileService], (service: CompanyProfileService) => {
    expect(service).toBeTruthy();
  }));
});
