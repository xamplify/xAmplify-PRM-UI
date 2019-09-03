import { TestBed, inject } from '@angular/core/testing';

import { LandingPageService } from './landing-page.service';

describe('LandingPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingPageService]
    });
  });

  it('should be created', inject([LandingPageService], (service: LandingPageService) => {
    expect(service).toBeTruthy();
  }));
});
