import { TestBed, inject } from '@angular/core/testing';
import { OutlookEmailService } from './outlook-email.service';



describe('InsightsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OutlookEmailService]
    });
  });

  it('should be created', inject([OutlookEmailService], (service: OutlookEmailService) => {
    expect(service).toBeTruthy();
  }));
});
