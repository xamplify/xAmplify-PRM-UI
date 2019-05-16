import { TestBed, inject } from '@angular/core/testing';

import { EmailSpamCheckService } from './email-spam-check.service';

describe('EmailSpamCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailSpamCheckService]
    });
  });

  it('should be created', inject([EmailSpamCheckService], (service: EmailSpamCheckService) => {
    expect(service).toBeTruthy();
  }));
});
