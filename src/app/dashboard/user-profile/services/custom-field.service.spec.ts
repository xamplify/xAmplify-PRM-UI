import { TestBed, inject } from '@angular/core/testing';

import { CustomFieldService } from './custom-field.service';

describe('CustomFieldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomFieldService]
    });
  });

  it('should be created', inject([CustomFieldService], (service: CustomFieldService) => {
    expect(service).toBeTruthy();
  }));
});
