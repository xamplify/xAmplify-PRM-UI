import { TestBed, inject } from '@angular/core/testing';

import { MarketDevelopemementFundsService } from './market-developemement-funds.service';

describe('MarketDevelopemementFundsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketDevelopemementFundsService]
    });
  });

  it('should be created', inject([MarketDevelopemementFundsService], (service: MarketDevelopemementFundsService) => {
    expect(service).toBeTruthy();
  }));
});
