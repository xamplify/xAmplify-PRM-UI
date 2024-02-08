import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute,Router,NavigationStart, NavigationEnd  } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { User } from '../../core/models/user';
import { RegularExpressions } from '../../common/models/regular-expressions';

import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

import { UserService } from '../../core/services/user.service';
import { matchingPasswords, noWhiteSpaceValidatorWithOutLimit } from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CountryNames } from '../../common/models/country-names';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

declare var $: any;
@Component({
  selector: 'app-access-account',
  templateUrl: './access-account.component.html',
  styleUrls: ['./access-account.component.css','../../../assets/css/default.css', '../../../assets/css/authentication-page.css',
              '../../../assets/css/loader.css'],
  providers: [User, CountryNames, RegularExpressions, Properties]
})
export class AccessAccountComponent implements OnInit {
    isActivateAccountPage = false;
    userId:number = 0;
    signUpForm: FormGroup;
    loading = false;
    isError = false;
    vendorSignup = false;
    invalidVendor = false;
    mainLoader: boolean;
    customResponse: CustomResponse = new CustomResponse();
    userNotFound = false;
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
            'whitespace': 'Empty spaces are not allowed',
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
    companyProfileName="";

    constructor( private router: Router, public countryNames: CountryNames, public regularExpressions: RegularExpressions, public properties: Properties,
        private formBuilder: FormBuilder, private signUpUser: User, public route: ActivatedRoute,
        private userService: UserService, public referenceService: ReferenceService, private xtremandLogger: XtremandLogger, public authenticationService: AuthenticationService, private vanityURLService:VanityURLService ) {
        this.signUpForm = new FormGroup( {
            firstName: new FormControl(),
            lastName: new FormControl(),
            emailId: new FormControl(),
            password: new FormControl(),
            confirmPassword: new FormControl(),
            agree: new FormControl()
        } );
    }
    update() {
        this.customResponse = new CustomResponse();
        if ( this.signUpForm.valid ) {
            this.signUpUser = this.signUpForm.value;
            this.loading = true;
            let data = {};
            data['firstName'] = this.signUpUser.firstName;
            data['lastName'] = this.signUpUser.lastName;
            data['password'] = this.signUpUser.password;
            if(this.isActivateAccountPage){
                data['id'] = this.userId;
                this.accessAccount(data);
            }else{
                data['emailId'] = this.signUpUser.emailId;
                data['companyProfileName'] = this.companyProfileName;
                this.signUpAsTeamMember(data);
            }
        } else {
            this.checkValidationMessages()
        }
    }
    signUpAsTeamMember(data: {}) {
        $("#teamMember-signup-emailId").removeClass('ng-valid');
        $("#teamMember-signup-emailId").removeClass('ng-invalid');
        this.authenticationService.signUpAsTeamMember(data).subscribe(response=>{
            alert("Succes");
        },error=>{
            let message = this.referenceService.showHttpErrorMessage(error);
            if(this.properties.serverErrorMessage!=message){
                this.formErrors.emailId = message;
                $("#teamMember-signup-emailId").removeClass('ng-valid');
                $("#teamMember-signup-emailId").addClass('ng-invalid');
            }else{
                this.customResponse = new CustomResponse('ERROR',message,true);
            }
           
            this.loading = false;
        });
    }

    private accessAccount(data: {}) {
        this.userService.accessAccount(data)
            .subscribe(
                (result: any) => {
                    if (result.statusCode == 200) {
                        this.referenceService.userProviderMessage = this.properties.ACCOUNT_ACTIVATED_WITH_PASSWORD;
                        this.router.navigate(['./login']);
                    } else {
                        this.loading = false;
                        this.customResponse = new CustomResponse('ERROR', result.message, true);
                    }
                },
                (error: string) => {
                    this.loading = false;
                    this.customResponse = new CustomResponse('ERROR', 'Oops!Somethig went wrong.Please try after sometime', true);
                });
    }

    checkPassword() {
        if ( this.signUpForm.value.password.length > 20 ) {
            this.formErrors.password = this.validationMessages.password.maxlength;
        } else if ( this.signUpForm.value.password.includes( " " ) ) {
            this.formErrors.password = "Password shouldn't contain spaces"
        }
    }

    checkValidationMessages() {
        if ( !this.signUpForm.value.firstName ) { this.formErrors.firstName = this.validationMessages.firstName.required; }
        if ( !this.signUpForm.value.emailId ) { this.formErrors.emailId = this.validationMessages.emailId.required; }
        if ( !this.signUpForm.value.password ) { this.formErrors.password = this.validationMessages.password.required; }
        if ( !this.signUpForm.value.confirmPassword ) { this.formErrors.confirmPassword = this.validationMessages.confirmPassword.required; }
        if ( !this.signUpForm.value.agree ) { this.formErrors.agree = this.validationMessages.agree.required; }
    }
    buildForm() {
        this.signUpForm = this.formBuilder.group( {
            'emailId': [this.signUpUser.emailId, [Validators.required, Validators.pattern( this.regularExpressions.EMAIL_ID_PATTERN )]],
            'password': [this.signUpUser.password, [Validators.required, Validators.minLength( 6 ), Validators.maxLength( 20 ), Validators.pattern( this.regularExpressions.PASSWORD_PATTERN )]],
            'confirmPassword': [null, [Validators.required, Validators.pattern( this.regularExpressions.PASSWORD_PATTERN )]],
            'agree': [false, Validators.required],
            'firstName': [this.signUpUser.firstName, Validators.compose([Validators.required, noWhiteSpaceValidatorWithOutLimit])],//Validators.pattern(nameRegEx)
            'lastName': [this.signUpUser.lastName]
        }, {
                validator: matchingPasswords( 'password', 'confirmPassword' )
            }
        );
        this.signUpForm.valueChanges
            .subscribe( data => this.onValueChanged( data ) );
        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged( data?: any ) {
        if ( !this.signUpForm ) { return; }
        const form = this.signUpForm;
        for ( const field of Object.keys( this.formErrors ) ) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get( field );
            if ( control && control.dirty && !control.valid ) {
                const messages = this.validationMessages[field];
                for ( const key of Object.keys( control.errors ) ) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
    toggleChild() {
        this.isError = !this.isError;
    }
    validEmail( event: any ) {
        this.invalidVendor = false;
    }
    getUserDatails( alias: string ) {
        try {
            this.mainLoader = true;
            this.userService.getUserByAlias( alias ).subscribe(( data ) => {
                this.mainLoader = false;
                if ( data.statusCode == 200 ) {
                    this.userNotFound = false;
                    let user = data.data;
                    this.userId = user.id;
                    this.signUpUser.firstName = user.firstName;
                    this.signUpUser.lastName = user.lastName;
                    this.signUpUser.emailId = user.emailId;
                    this.buildForm();
                } else {
                    this.userNotFound = true;
                    this.mainLoader = false;
                    this.customResponse = new CustomResponse( 'ERROR', data.message, true );
                }

            },
                ( error ) => { this.mainLoader = false; this.xtremandLogger.error( 'error in signup page' + error ); }
            );
        } catch ( error ) {
            this.signUpUser.firstName = '';
            this.signUpUser.lastName = '';
            this.signUpUser.emailId = '';
            this.buildForm(); this.xtremandLogger.error( 'error in signup page' + error );
            this.mainLoader = false;
        }
    }
    ngOnInit() {
        try {
            if(this.vanityURLService.isVanityURLEnabled()){
                this.vanityURLService.checkVanityURLDetails();
            }
            this.mainLoader = true;
            this.isActivateAccountPage = this.referenceService.getCurrentRouteUrl().indexOf("axAa")>-1;
            /***XNFR-454*******/
            if(this.isActivateAccountPage){
                this.authenticationService.navigateToDashboardIfUserExists();
                let alias = this.route.snapshot.params['alias']; 
                this.getUserDatails( alias );
            }else if(this.referenceService.getCurrentRouteUrl().indexOf("tSignUp")>-1){
                this.companyProfileName = this.route.snapshot.params['companyProfileName']; 
                this.authenticationService.findCompanyDetails(this.companyProfileName).subscribe(
                    response=>{
                        if(response.statusCode==200){
                            this.mainLoader = false;
                            this.buildForm();
                        }else{
                            this.referenceService.goToPageNotFound();
                        }
                    },error=>{
                        this.xtremandLogger.errorPage(error);
                    }
                )

            }
            /***XNFR-454*******/
           
        } catch ( error ) { this.mainLoader = false; this.xtremandLogger.error( 'error' + error ); }
    }
    ngAfterViewInit() {
        $( 'body' ).tooltip( { selector: '[data-toggle="tooltip"]' } );
    }
    ngOnDestroy() {
        this.mainLoader = false;
    }

}
