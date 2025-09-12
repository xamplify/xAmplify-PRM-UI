import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupComponent } from './signup.component';
import { CountryNames } from '../../common/models/country-names';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { Properties } from '../../common/models/properties';
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VanityURLService } from '../../vanity-url/services/vanity.url.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        CountryNames,
        RegularExpressions,
        Properties,
        User,
        { provide: Router, useValue: { url: '/prm-signup' } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: UserService, useValue: {} },
        { provide: ReferenceService, useValue: { showInputPassword: false, showInputConfirmPassword: false, showPassword: () => {} } },
        { provide: XtremandLogger, useValue: { error: () => {}, log: () => {}, errorPage: () => {} } },
        { provide: AuthenticationService, useValue: { companyProfileName: '', getUserId: () => {}, navigateToDashboardIfUserExists: () => {} } },
        { provide: VanityURLService, useValue: { isVanityURLEnabled: () => false } },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable email field for PRM sign up', () => {
    expect(component.signUpForm.get('emailId')?.enabled).toBeTrue();
  });
});

