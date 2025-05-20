import { TestBed, inject } from '@angular/core/testing';

import { InsightsService } from './insights.service';

describe('InsightsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InsightsService]
    });
  });

  it('should be created', inject([InsightsService], (service: InsightsService) => {
    expect(service).toBeTruthy();
  }));
});
