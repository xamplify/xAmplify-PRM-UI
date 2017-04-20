import { TestBed, inject } from '@angular/core/testing';

import { EmailTemplateService } from './email-template.service';

describe('EmailTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailTemplateService]
    });
  });

  it('should ...', inject([EmailTemplateService], (service: EmailTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
