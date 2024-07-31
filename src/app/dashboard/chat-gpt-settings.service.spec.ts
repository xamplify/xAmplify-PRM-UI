import { TestBed, inject } from '@angular/core/testing';

import { ChatGptSettingsService } from './chat-gpt-settings.service';

describe('ChatGptSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatGptSettingsService]
    });
  });

  it('should be created', inject([ChatGptSettingsService], (service: ChatGptSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
