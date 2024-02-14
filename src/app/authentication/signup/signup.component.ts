import { Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { User } from '../../core/models/user';
import { RegularExpressions } from '../../common/models/regular-expressions';

import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

import { UserService } from '../../core/services/user.service';
import { matchingPasswords } from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CountryNames } from '../../common/models/country-names';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

declare var $: any;

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css',
    '../../../assets/css/loader.css'],
    providers: [User, CountryNames, RegularExpressions, Properties]
})
export class SignupComponent implements OnInit,AfterViewInit, OnDestroy {
    signUpForm: FormGroup;
    loading = false;
    isError = false;
    vendorSignup = false;
    invalidVendor = false;
    mainLoader:boolean;
    customResponse: CustomResponse = new CustomResponse();
    formErrors = {
        'firstName': '',
        'lastName': '',
        'emailId': '',
        'address': '',
        'city': '',
        'country': '',
        'password': '',
        'confirmPassword': '',
        'agree': ''
    };

    validationMessages = {
        'firstName': {
            'required': 'First name is required.',
        },
        'emailId': {
            'required': 'Email is required.',
            'pattern': 'Please enter a valid email address'
        },
        'address': {
            'required': 'Address is required.',
            'whitespace': 'Invalid Address',
            'minlength': 'Address must be at least 4 characters long.',
            'maxlength': 'Address cannot be more than 50 characters long.',
            'pattern': 'Invalid Address'
        },
        'city': {
            'required': 'City is required.',
            'whitespace': 'Invalid City',
            'minlength': 'City must be at least 4 characters long.',
            'maxlength': 'City cannot be more than 50 characters long.',
            'pattern': 'Invalid City'
        },
        'country': {
            'required': 'Country is required.',
            'invalidCountry': 'Country is required.'
        },
        'password': {
            'required': 'Password is required.',
            'minlength': '',
            'maxlength': "Password shouldn't exceed 20 characters",
            'pattern': 'Use 6 or more characters with a mix of letters, numbers & symbols'
        },
        'confirmPassword': {
            'required': 'Confirm Password is required.',
            'pattern': 'Use 6 or more characters with a mix of letters, numbers & symbols'
        },
        'agree': {
            'required': 'You Must Agree to the Terms of Service & Privacy Policy.'
        }
    };

    isNotVanityURL:boolean = false;
    vanityURLEnabled:boolean = false;

    constructor(private router: Router, public countryNames: CountryNames, public regularExpressions: RegularExpressions, public properties: Properties,
        private formBuilder: FormBuilder, private signUpUser: User,public route:ActivatedRoute,
        private userService: UserService, public referenceService: ReferenceService,private xtremandLogger: XtremandLogger,public authenticationService:AuthenticationService, private vanityURLService: VanityURLService) {
          if(this.router.url.includes('/signup/')) {  localStorage.removeItem('currentUser');}
          if(this.router.url.includes('/v-signup')){ this.vendorSignup = true; } else { this.vendorSignup = false;}
          this.signUpForm = new FormGroup({
            firstName: new FormControl(),
            lastName: new FormControl(),
            emailId: new FormControl(),
            password: new FormControl(),
            confirmPassword: new FormControl(),
            agree : new FormControl()
        });
    }
    goToBack(){
      if(this.router.url.includes('/v-signup')) {  this.router.navigate(['/']); } else {  this.router.navigate(['/login']) }
    }
    signUp() {
      if (this.signUpForm.valid) {
        try{
        this.signUpUser = this.signUpForm.value;
        this.signUpUser.emailId = this.signUpUser.emailId.toLowerCase();
        this.loading = true;
        this.signUpUser.vendorSignUp = this.vendorSignup;
        this.signUpUser.companyProfileName = this.authenticationService.companyProfileName;
        this.userService.signUp(this.signUpUser)
            .subscribe(
                data => {
                    this.loading = false;
                    if (data !== undefined) {
                        if (data.statusCode==200) {
                            this.loading = false;
                            this.referenceService.userProviderMessage = data.message;
                            this.router.navigate(['/login']);
                        }else{
                           this.customResponse = new CustomResponse('ERROR',"Sign up is restricted.Please contact admin.",true);
                        }
                    } else {
                        this.loading = false;
                        this.isError = true;
                        this.xtremandLogger.error(this.referenceService.errorPrepender + " signUp():" + data);
                    }
                },
                error => {
                    this.loading = false;
                    if (error === "USERNAME IS ALREADY EXISTING") {
                        this.formErrors['userName'] = error;
                        // this.isLoading = false;
                    } else if (error === "USER IS ALREADY EXISTING WITH THIS EMAIL" || error.includes('User is already existing with this email')) {
                        this.formErrors['emailId'] = 'Email Id already exists';
                        // this.isLoading = false;
                    } else {
                        this.xtremandLogger.errorPage(error);
                    }
                },
                () => this.xtremandLogger.log("Done")
            );
          }catch(error){ this.xtremandLogger.error('error'+error);}
        } else {
          this.checkValidationMessages()
        }
    }

    checkPassword(){
        if(this.signUpForm.value.password.length > 20){
            this.formErrors.password = this.validationMessages.password.maxlength;
        }else if( this.signUpForm.value.password.includes(" ") ){
            this.formErrors.password = "Password shouldn't contain spaces"
        }
    }

    checkValidationMessages(){
      if(!this.signUpForm.value.firstName) {this.formErrors.firstName = this.validationMessages.firstName.required; }
      if(!this.signUpForm.value.emailId) {this.formErrors.emailId = this.validationMessages.emailId.required; }
      if(!this.signUpForm.value.password) { this.formErrors.password = this.validationMessages.password.required; }
      if(!this.signUpForm.value.confirmPassword) { this.formErrors.confirmPassword =this.validationMessages.confirmPassword.required; }
      if(!this.signUpForm.value.agree) { this.formErrors.agree = this.validationMessages.agree.required; }
    }
    buildForm() {
        this.signUpForm = this.formBuilder.group({
            'emailId': [this.signUpUser.emailId, [Validators.required, Validators.pattern(this.regularExpressions.EMAIL_ID_PATTERN)]],
            'password': [this.signUpUser.password, [Validators.required, Validators.minLength(6),Validators.maxLength(20), Validators.pattern(this.regularExpressions.PASSWORD_PATTERN)]],
            'confirmPassword': [null, [Validators.required, Validators.pattern(this.regularExpressions.PASSWORD_PATTERN)]],
            'agree': [false, Validators.required],
            'firstName': [this.signUpUser.firstName, Validators.required],
            'lastName': [this.signUpUser.lastName]
            // 'fullName': [this.signUpUser.fullName, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],//Validators.pattern(nameRegEx)
            // 'address': [this.signUpUser.address, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50),])],//Validators.pattern(nameRegEx)
            // 'city': [this.signUpUser.city, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50), Validators.pattern(this.regularExpressions.CITY_PATTERN)])],
            // 'country': [this.countryNames.countries[0], Validators.compose([Validators.required, validateCountryName])],
        }, {
                validator: matchingPasswords('password', 'confirmPassword')
            }
        );
        this.signUpForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.signUpForm) { return; }
        const form = this.signUpForm;
        this.xtremandLogger.log(form.controls);
        for (const field of Object.keys(this.formErrors)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key of Object.keys(control.errors)) {
                    this.xtremandLogger.log(this.formErrors[field]);
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
    toggleChild() {
        this.isError = !this.isError;
    }
    validEmail(event:any){
      this.invalidVendor = false;
    }
    getUserDatails(alias:string){
      try{
       this.userService.getSingUpUserDatails(alias).subscribe((data)=>{
       this.signUpUser.firstName = data.firstName;
       this.signUpUser.lastName = data.lastName;
       this.signUpUser.emailId = data.emailId;
       this.buildForm();
     },
    (error)=>{   this.mainLoader = false;this.xtremandLogger.error('error in signup page'+error);}
    );
    }catch(error){
      this.signUpUser.firstName = '';
      this.signUpUser.lastName = '';
      this.signUpUser.emailId = '';
      this.buildForm(); this.xtremandLogger.error('error in signup page'+error);
      this.mainLoader = false;
     }
  }
    ngOnInit() {
      try{
         this.customResponse = new CustomResponse();
        this.mainLoader = true;
        if(this.vanityURLService.isVanityURLEnabled()){
            this.vanityURLService.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {
              this.vanityURLEnabled = true;
              this.authenticationService.v_companyName = result.companyName;
              this.authenticationService.vanityURLink = result.vanityURLink;
              this.authenticationService.v_showCompanyLogo = result.showVendorCompanyLogo;
              this.authenticationService.v_companyLogoImagePath = this.authenticationService.MEDIA_URL + result.companyLogoImagePath;           
                  if(result.companyBgImagePath){
                    this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;           
                  }else{
                    this.authenticationService.v_companyBgImagePath = "assets/images/stratapps.jpeg";
                  }
            }, error => {
              console.log(error);
            });
          }else{
            this.isNotVanityURL = true;
          }
        this.authenticationService.navigateToDashboardIfUserExists();
        setTimeout(()=>{  this.mainLoader = false;},900);
        if(this.router.url.includes('/signup/')){
            let alias = this.route.snapshot.params['alias'];
            this.getUserDatails(alias);
        }
        else {
          this.buildForm();
          this.mainLoader = false;
        }
      }catch(error){  this.mainLoader = false;this.xtremandLogger.error('error'+error); }
    }
    ngAfterViewInit(){
      $('body').tooltip({ selector: '[data-toggle="tooltip"]' });
    }
    ngOnDestroy(){
      this.invalidVendor = false;
      this.mainLoader = false;
    }

}
