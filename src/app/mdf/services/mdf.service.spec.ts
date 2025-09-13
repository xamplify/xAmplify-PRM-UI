import { TestBed, inject } from '@angular/core/testing';

import { MdfService } from './mdf.service';

describe('MdfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MdfService]
    });
  });

  it('should be created', inject([MdfService], (service: MdfService) => {
    expect(service).toBeTruthy();
  }));
});
