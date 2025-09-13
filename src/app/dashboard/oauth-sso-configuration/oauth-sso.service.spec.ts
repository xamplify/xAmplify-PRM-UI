import { TestBed, inject } from '@angular/core/testing';

import { OauthSsoService } from './oauth-sso.service';

describe('OauthSsoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OauthSsoService]
    });
  });

  it('should be created', inject([OauthSsoService], (service: OauthSsoService) => {
    expect(service).toBeTruthy();
  }));
});
