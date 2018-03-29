import { TestBed, inject } from '@angular/core/testing';

import { ParterService } from './parter.service';

describe('ParterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParterService]
    });
  });

  it('should be created', inject([ParterService], (service: ParterService) => {
    expect(service).toBeTruthy();
  }));
});
