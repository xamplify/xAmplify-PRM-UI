import { TestBed, inject } from '@angular/core/testing';

import { MicrosoftService } from './microsoft.service';

describe('MicrosoftService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MicrosoftService]
    });
  });

  it('should be created', inject([MicrosoftService], (service: MicrosoftService) => {
    expect(service).toBeTruthy();
  }));
});
