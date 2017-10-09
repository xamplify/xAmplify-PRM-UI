import { TestBed, inject } from '@angular/core/testing';

import { SocialPagerService } from './social-pager.service';

describe('SocialPagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialPagerService]
    });
  });

  it('should be created', inject([SocialPagerService], (service: SocialPagerService) => {
    expect(service).toBeTruthy();
  }));
});
