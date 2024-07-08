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
import { DomSanitizer } from '@angular/platform-browser';
import { VanityURL } from 'app/vanity-url/models/vanity.url';


declare var $: any, swal:any;
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
        'agree': '',
        'companyName':''
    };

    validationMessages = {
        'firstName': {
            'required': 'First name is required.',
            'whitespace': 'Empty spaces are not allowed',
        },
        'companyName': {
            'required': 'Company name is required.',
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
    teamMemberAccountCreated = false;
    anotherUserLoggedIn = false;
    vanityURLEnabled = false;
    isNotVanityURL: boolean;
    bgIMage2: string;
    isBgColor: boolean;
    createdUserId:any;
    isStyleOne:boolean = false;
    loginStyleId:number;
    isPartnerSignUpPage = false;
    isTeamMemberSignUpPage = false;
    constructor( private router: Router, public countryNames: CountryNames, public regularExpressions: RegularExpressions, public properties: Properties,
        private formBuilder: FormBuilder, private signUpUser: User, public route: ActivatedRoute,
        private userService: UserService, public referenceService: ReferenceService, private xtremandLogger: XtremandLogger,
         public authenticationService: AuthenticationService, private vanityURLService:VanityURLService, public sanitizer: DomSanitizer ) {
        this.signUpForm = new FormGroup( {
            firstName: new FormControl(),
            lastName: new FormControl(),
            emailId: new FormControl(),
            password: new FormControl(),
            confirmPassword: new FormControl(),
            agree: new FormControl(),
            companyName:new FormControl()
        } );
    }

    ngOnInit() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser != undefined) {
                this.anotherUserLoggedIn = true;
                this.customResponse = new CustomResponse('ERROR', "The user is currently logged in on this browser. To access this page, please log out or use another browser.", true );
            }else{
                this.anotherUserLoggedIn = false;
                this.mainLoader = true;
                this.isActivateAccountPage = this.referenceService.getCurrentRouteUrl().indexOf("axAa")>-1;
                this.isPartnerSignUpPage = this.referenceService.getCurrentRouteUrl().indexOf("pSignUp")>-1;
                this.isTeamMemberSignUpPage = this.referenceService.getCurrentRouteUrl().indexOf("tSignUp")>-1;
                /***XNFR-454*******/
                if(this.isActivateAccountPage){
                    let alias = this.route.snapshot.params['alias']; 
                    this.getUserDatails( alias );
                }else if(this.isTeamMemberSignUpPage || this.isPartnerSignUpPage){
                    this.loadPageStyles();
                }
                /***XNFR-454*******/
            }
        } catch ( error ) { this.mainLoader = false; this.xtremandLogger.error( 'error' + error ); }
    }

    private loadPageStyles() {
        this.companyProfileName = this.route.snapshot.params['companyProfileName'];
        this.findCompanyDetails();
        if (this.vanityURLService.isVanityURLEnabled()) {
            this.getActiveLoginTemplate(this.authenticationService.companyProfileName);
            this.vanityURLService.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {
                this.vanityURLEnabled = result.enableVanityURL;
                this.authenticationService.vendorCompanyId = result.companyId;
                this.authenticationService.v_companyName = result.companyName;
                this.authenticationService.vanityURLink = result.vanityURLink;
                this.authenticationService.companyUrl = result.companyUrl;
                this.authenticationService.loginType = result.loginType;
                this.authenticationService.isstyleTWoBgColor = result.styleTwoBgColor;
                this.isBgColor = result.styleOneBgColor;
                let path = "https://xamplify.io/assets/images/stratapps.jpeg";
                if (result.loginType === "STYLE_ONE") {
                    this.getStyleOneData(result, path);
                } else {
                    this.getStyleTwoData(result, path);
                }
                if (result.companyBgImagePath) {
                    this.bgIMage2 = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
                } else {
                    this.bgIMage2 = 'https://xamplify.io/assets/images/stratapps.jpeg';
                }
                if (!this.vanityURLEnabled) {
                    this.router.navigate(['/vanity-domain-error']);
                    return;
                }
                this.setCompanyLogoPath(result);
                this.authenticationService.v_companyFavIconPath = result.companyFavIconPath;
                this.vanityURLService.setVanityURLTitleAndFavIcon();

            }, error => {
                this.xtremandLogger.error(error);
            });
        } else {
            this.isNotVanityURL = true;
        }
    }

    private setCompanyLogoPath(result: VanityURL) {
        this.authenticationService.v_showCompanyLogo = result.showVendorCompanyLogo;
        this.authenticationService.v_companyLogoImagePath = this.authenticationService.MEDIA_URL + result.companyLogoImagePath;
        if (result.companyBgImagePath && result.backgroundLogoStyle2) {
            this.authenticationService.v_companyBgImagePath2 = this.authenticationService.MEDIA_URL + result.backgroundLogoStyle2;
            this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
        } else if (result.companyBgImagePath) {
            this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
        } else if (result.backgroundLogoStyle2) {
            this.authenticationService.v_companyBgImagePath2 = this.authenticationService.MEDIA_URL + result.backgroundLogoStyle2;
        } else {
            this.authenticationService.v_companyBgImagePath = "assets/images/stratapps.jpeg";
        }
    }

    private getStyleTwoData(result: VanityURL, path: string) {
        this.isStyleOne = false;
        this.authenticationService.loginScreenDirection = result.loginScreenDirection;
        if (result.styleTwoBgColor) {
            document.documentElement.style.setProperty('--login-bg-color', result.backgroundColorStyle2);
        } else {
            if (result.backgroundLogoStyle2 != null && result.backgroundLogoStyle2 != "") {
                document.documentElement.style.setProperty('--login-bg-image', 'url(' + this.authenticationService.MEDIA_URL + result.backgroundLogoStyle2 + ')');
            } else {
                document.documentElement.style.setProperty('--login-bg-image', 'url(' + path + ')');
            }
        }
    }

    private getStyleOneData(result: VanityURL, path: string) {
        this.isStyleOne = true;
        this.authenticationService.loginScreenDirection = result.loginFormDirectionStyleOne;
        if (result.styleOneBgColor) {
            document.documentElement.style.setProperty('--login-bg-color-style1', result.backgroundColorStyle1);
        } else {
            if (result.companyBgImagePath != null && result.companyBgImagePath != "") {
                document.documentElement.style.setProperty('--login-bg-image-style1', 'url(' + this.authenticationService.MEDIA_URL + result.companyBgImagePath + ')');
            } else {
                document.documentElement.style.setProperty('--login-bg-image-style1', 'url(' + path + ')');
            }
        }
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
            }else if(this.isPartnerSignUpPage){
                data['emailId'] = this.signUpUser.emailId;
                data['companyProfileName'] = this.companyProfileName;
                data['companyName'] = this.signUpUser.companyName;
                data['accessedFromVanityDomain'] = this.vanityURLService.isVanityURLEnabled();
                this.signUpAsPartner(data);
            }else{
                data['emailId'] = this.signUpUser.emailId;
                data['companyProfileName'] = this.companyProfileName;
                this.signUpAsTeamMember(data);
            }
        } else {
            this.checkValidationMessages()
        }
    }

     /**XNFR-506****/
    signUpAsPartner(data: {}) {
        this.customResponse = new CustomResponse();
        this.removeErrorClasses();
        this.authenticationService.signUpAsPartner(data).
        subscribe(response=>{
            this.referenceService.teamMemberSignedUpSuccessfullyMessage = this.properties.PARTNERSHIP_ESTABLISHED_SUCCESSFULLY;
            this.router.navigate(['./login']);
            this.loading = false;
        },error=>{
            let message = this.referenceService.showHttpErrorMessage(error);
            if(this.properties.serverErrorMessage!=message){
                if(message.includes("Company name has already been added")){
                    this.removeErrorClasses();
                    this.formErrors.companyName = this.properties.PARTNERSHIP_ALREADY_ESTABLISHED_WITH_COMPANY_NAME;
                    $("#partner-company-name").removeClass('ng-valid');
                    $("#partner-company-name").addClass('ng-invalid');
                  //  this.showConfirmAlertForAddingAsTeamMember(this.properties.PARTNERSHIP_ALREADY_ESTABLISHED_WITH_COMPANY_NAME, data);
                }else if(message.includes("The account already exists")){
                    this.removeErrorClasses();
                    this.skipPasswordAndAddAsPartner(message, data);
                }else{
                    this.formErrors.emailId = message;
                    $("#teamMember-signup-emailId").removeClass('ng-valid');
                    $("#teamMember-signup-emailId").addClass('ng-invalid');
                }
            }else{
                this.customResponse = new CustomResponse('ERROR',message,true);
            }
            this.loading = false;
        });
        
    }

    private removeErrorClasses() {
        $("#teamMember-signup-emailId").removeClass('ng-valid');
        $("#teamMember-signup-emailId").removeClass('ng-invalid');
        $("#partner-company-name").removeClass('ng-valid');
        $("#partner-company-name").removeClass('ng-invalid');
        this.formErrors.companyName = "";
        this.formErrors.emailId = "";
    }

    /****XNFR-506******/
    private skipPasswordAndAddAsPartner(message: string, data: {}) {
        let self = this;
        swal({
            title: 'Are you sure?',
            text: message,
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: "Yes",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function () {
            self.loading = true;
            data['skipPassword'] = true;
            self.signUpAsPartner(data);
            swal.close();
        }, function (_dismiss: any) {
        });
    }

    /****XNFR-506******/
    private showConfirmAlertForAddingAsTeamMember(message: string, data: {}) {
        let self = this;
        swal({
            title: 'Are you sure?',
            text: message,
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: "Yes",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function () {
            self.loading = true;
            self.getTeamMemberSignUpUrl(data);
            swal.close();
        }, function (_dismiss: any) {
        });
    }
    getTeamMemberSignUpUrl(data: {}) {
       this.loading = false;
       this.referenceService.showSweetAlertInfoMessage();
    }



    /**XNFR-454****/
    signUpAsTeamMember(data: {}) {
        this.customResponse = new CustomResponse();
        $("#teamMember-signup-emailId").removeClass('ng-valid');
        $("#teamMember-signup-emailId").removeClass('ng-invalid');
        this.authenticationService.signUpAsTeamMember(data).
        subscribe(response=>{
           this.referenceService.teamMemberSignedUpSuccessfullyMessage = this.properties.TEAM_MEMBER_SIGN_UP_SUCCESS;
           this.router.navigate(['./login']);
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
        if (!this.signUpForm.value.firstName) { this.formErrors.firstName = this.validationMessages.firstName.required; }
        if (!this.signUpForm.value.emailId) { this.formErrors.emailId = this.validationMessages.emailId.required; }
        if (!this.signUpForm.value.password) { this.formErrors.password = this.validationMessages.password.required; }
        if (!this.signUpForm.value.confirmPassword) { this.formErrors.confirmPassword = this.validationMessages.confirmPassword.required; }
        if (!this.signUpForm.value.agree) { this.formErrors.agree = this.validationMessages.agree.required; }
        if (!this.signUpForm.value.companyName) { this.formErrors.companyName = this.validationMessages.companyName.required; }
    }
    buildForm() {
        if(!this.isPartnerSignUpPage){
            this.signUpUser.companyName = "Company";
        }
        this.signUpForm = this.formBuilder.group( {
            'emailId': [this.signUpUser.emailId, [Validators.required, Validators.pattern( this.regularExpressions.EMAIL_ID_PATTERN )]],
            'password': [this.signUpUser.password, [Validators.required, Validators.minLength( 6 ), Validators.maxLength( 20 ), Validators.pattern( this.regularExpressions.PASSWORD_PATTERN )]],
            'confirmPassword': [null, [Validators.required, Validators.pattern( this.regularExpressions.PASSWORD_PATTERN )]],
            'agree': [false, Validators.required],
            'firstName': [this.signUpUser.firstName, Validators.compose([Validators.required, noWhiteSpaceValidatorWithOutLimit])],//Validators.pattern(nameRegEx)
            'lastName': [this.signUpUser.lastName],
            'companyName': [this.signUpUser.companyName, Validators.compose([Validators.required, noWhiteSpaceValidatorWithOutLimit])],//Validators.pattern(nameRegEx)
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
 

    getActiveLoginTemplate(companyProfileName:any){
        this.vanityURLService.getActiveLoginTemplate(companyProfileName)
        .subscribe(
          data => {
            if(data['data']!=undefined){
                this.loginStyleId = data.data.templateId;
                this.authenticationService.lognTemplateId = this.loginStyleId;
                this.createdUserId = data.data.createdBy;
                this.previewTemplate(this.loginStyleId,this.createdUserId);
            }
          })  
    }
    htmlContent:any;
    previewTemplate(id: number,createdBy:number) {
      $(this.htmlContent).empty();
      this.vanityURLService.getLogInTemplateById(id, createdBy).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(response.data.htmlBody);
          } else {
            this.customResponse = new CustomResponse('ERROR', response.message, true)
          }
        }
      )
    }

    private findCompanyDetails() {
        this.authenticationService.findCompanyDetails(this.companyProfileName).subscribe(
            response => {
                if (response.statusCode == 200) {
                    this.mainLoader = false;
                    this.buildForm();
                } else {
                    this.referenceService.goToPageNotFound();
                }
            }, error => {
                this.xtremandLogger.errorPage(error);
            });
    }

    ngAfterViewInit() {
        $( 'body' ).tooltip( { selector: '[data-toggle="tooltip"]' } );
    }
    ngOnDestroy() {
        this.mainLoader = false;
        this.anotherUserLoggedIn = false;
        this.teamMemberAccountCreated = false;
        this.userNotFound = false;
    }

}
