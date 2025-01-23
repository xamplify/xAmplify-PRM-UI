import { TestBed, inject } from '@angular/core/testing';

import { SignatureService } from './signature.service';

describe('SignatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignatureService]
    });
  });

  it('should be created', inject([SignatureService], (service: SignatureService) => {
    expect(service).toBeTruthy();
  }));
});
