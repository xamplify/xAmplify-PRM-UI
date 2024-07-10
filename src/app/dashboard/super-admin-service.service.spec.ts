import { TestBed, inject } from '@angular/core/testing';

import { SuperAdminServiceService } from './super-admin-service.service';

describe('SuperAdminServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperAdminServiceService]
    });
  });

  it('should be created', inject([SuperAdminServiceService], (service: SuperAdminServiceService) => {
    expect(service).toBeTruthy();
  }));
});
