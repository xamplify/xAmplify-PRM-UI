import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamlSsoLoginComponent } from './saml-sso-login.component';

describe('SamlSsoLoginComponent', () => {
  let component: SamlSsoLoginComponent;
  let fixture: ComponentFixture<SamlSsoLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamlSsoLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamlSsoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
