import { TestBed, inject } from '@angular/core/testing';

import { SuperAdminService } from './super-admin.service';

describe('SuperAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperAdminService]
    });
  });

  it('should be created', inject([SuperAdminService], (service: SuperAdminService) => {
    expect(service).toBeTruthy();
  }));
});
