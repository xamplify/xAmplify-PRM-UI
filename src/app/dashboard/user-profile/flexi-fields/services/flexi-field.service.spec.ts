import { TestBed, inject } from '@angular/core/testing';

import { FlexiFieldService } from './flexi-field.service';

describe('FlexiFieldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlexiFieldService]
    });
  });

  it('should be created', inject([FlexiFieldService], (service: FlexiFieldService) => {
    expect(service).toBeTruthy();
  }));
});
