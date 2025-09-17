import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthSsoConfigurationComponent } from './oauth-sso-configuration.component';

describe('OauthSsoConfigurationComponent', () => {
  let component: OauthSsoConfigurationComponent;
  let fixture: ComponentFixture<OauthSsoConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OauthSsoConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthSsoConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
