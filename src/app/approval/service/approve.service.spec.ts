import { TestBed, inject } from '@angular/core/testing';

import { ApproveService } from './approve.service';

describe('ApproveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApproveService]
    });
  });

  it('should be created', inject([ApproveService], (service: ApproveService) => {
    expect(service).toBeTruthy();
  }));
});
