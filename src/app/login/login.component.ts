import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { User } from '../core/models/user';

import { AuthenticationService } from '../core/services/authentication.service';
import { UtilService } from '../core/services/util.service';
import { UserService } from '../core/services/user.service';
import {matchingPasswords,noWhiteSpaceValidator,validateCountryName} from '../form-validator';
import { ReferenceService } from '../core/services/reference.service';
import { XtremandLogger } from '../error-pages/xtremand-logger.service';
declare var Metronic, swal, $, Layout, Login, Demo: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../assets/css/default.css'],
  providers: [User]
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
    signUpForm: FormGroup;
    forgotPasswordForm: FormGroup;
    submitted = false;
    active = true;
    userActive = false;
    passwordSuccess = false;
    isLoading:boolean = false;
    emailRegEx:any = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    countries = ["---Please Select Country---","Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan",
                 
                 "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegowina","Botswana","Bouvet Island","Brazil",
                 
                 "British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic",
                 
                 "Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo, the Democratic Republic of the","Cook Islands","Costa Rica","Cote d'Ivoire",
                 
                 "Croatia (Hrvatska)","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia",
                 
                 "Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana",
                 
                 "Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Heard and Mc Donald Islands","Holy See (Vatican City State)",
                 
                 "Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran (Islamic Republic of)","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
                 
                 "Kiribati","Korea, Democratic People's Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya",
                 
                 "Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia, The Former Yugoslav Republic of","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania",
                 
                 "Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
                 
                 "Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea",
                 
                 "Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russian Federation","Rwanda","Saint Kitts and Nevis","Saint LUCIA","Saint Vincent and the Grenadines",
                 
                 "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Seychelles","Sierra Leone","Singapore","Slovakia (Slovak Republic)","Slovenia","Solomon Islands","Somalia","South Africa",
               
                 "South Georgia and the South Sandwich Islands","Spain","Sri Lanka","St. Helena","St. Pierre and Miquelon","Sudan","Suriname","Svalbard and Jan Mayen Islands","Swaziland","Sweden","Switzerland",
                 
                 "Syrian Arab Republic","Taiwan, Province of China","Tajikistan","Tanzania, United Republic of","Thailand","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands",
                 
                 "Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","Virgin Islands (British)",
                 
                 "Virgin Islands (U.S.)","Wallis and Futuna Islands","Western Sahara","Yemen","Zambia","Zimbabwe"];
                 
    constructor( private router: Router,
        private authenticationService: AuthenticationService, private fb: FormBuilder, private signUpUser: User, 
        private userService: UserService, private refService :ReferenceService, private utilService: UtilService,private logger:XtremandLogger ) {
        this.buildForm();
        this.validateForgotPasswordForm();
    }

    public initializeTwitterNotification() {/*
    this.twitterService.initializeNotification()
        .subscribe(
        data => {console.log(data)},
        error => console.log(error),
        () => console.log("finished")
        );
*/}
    public login() {
       if(this.model.username.length === 0 || this.model.password.length === 0) {
         this.logErrorEmpty()
        } else {
        this.loading = true;
        const userName = this.model.username.toLowerCase();
        this.refService.userName = userName;
        const authorization = 'Basic ' + btoa( 'my-trusted-client:');
        const body = 'username=' + userName + '&password=' + this.model.password + '&grant_type=password';
        this.authenticationService.login(authorization, body, userName).subscribe( result => {
            if ( localStorage.getItem( 'currentUser' ) ) {
                this.initializeTwitterNotification();
                // if user is coming from login
             //   this.getLoggedInUserDetails();
                let currentUser = JSON.parse(localStorage.getItem( 'currentUser' ));
                if(currentUser.hasCompany){
                    this.router.navigate( ['/home/dashboard/default'] );
                }else{
                    this.router.navigate( ['/home/dashboard/add-company-profile'] );
                }
                
                // if user is coming from any link

            } else {
                this.logError();
            }
        },
            //err => this.logError(),
           // () => console.log( 'login() Complete' ),
            
            
        
        (error:any)=>{
        	 var body = error['_body'];
        	 if ( body != "" ) {
                 var response = JSON.parse( body );
                 if ( response.error_description == "Bad credentials" ) {
                	 this.error = 'Username or password is incorrect';
                	  setTimeout(()=> {
                          this.error = '';
                      },5000)
                 }else if(response.error_description == "User is disabled" ){
                	 this.error = 'Your account is not activated.!';
                     setTimeout(()=> {
                         this.error = '';
                     },5000)
                 }
        	 }
            console.log("error:" + error)
            
        });
        return false;
      }
    }
    logError() {
        this.error = 'Username or password is incorrect';
        console.log("error : " + this.error);
        // this.router.navigate(['/login']);
        setTimeout(()=> {
            this.error = '';
        },5000)
    }
    logErrorEmpty() {
        this.error = 'Username or password can\'t be empty';
        console.log("error : " + this.error);
        setTimeout(()=> {
            this.error = '';
        },5000)
    }
    ngOnInit() {
        try {
            console.log( "ngOnInit(): LoginComponent" );
            this.authenticationService.logout();
            this.refService.topNavBarUserDetails.displayName = "Loading....";
            this.refService.topNavBarUserDetails.profilePicutrePath = "assets/images/profile-pic.gif";
            Metronic.init();
            Layout.init();
            Login.init();
            Demo.init();
            console.log( "ngOnInit() :LoginComponent completed" );
        } catch ( error ) {
            console.log( error );
        }
    }

    showRegisterForm() {
        console.log( "showRegisterForm clicked" );
        $( '.login-form' ).hide();
        $( '.register-form' ).show();
    }

    showForgotPassword() {
        console.log( "showForgotPassword clicked" );
        $( '.login-form' ).hide();
        $( '.forget-form' ).show();
        this.forgotPasswordForm.reset();
    }

    showLogin() {
        console.log( "showLogin clicked" );
        $( '.login-form' ).show();
        $( '.forget-form' ).hide();
        $( '.register-form' ).hide();
      
    }

    goToLogin(){
        this.showLogin();
        this.signUpForm.reset();
        this.signUpForm.controls.country.setValue(this.countries[0]);
        $('#user-created').show();
        setTimeout( function() { $( "#user-created" ).hide( 500 );this.userActive = false; }, 5000 );
        this.isLoading = false;
    }
    
    logout() {
        // reset login status
        this.authenticationService.logout();
    }

    /******************************Sign Up****************************************/


    signUp() {
        this.isLoading = true;
        this.signUpUser = this.signUpForm.value;
        this.signUpUser.emailId = this.signUpUser.emailId.toLowerCase();
        this.userService.signUp( this.signUpUser )
            .subscribe(
            data => {
                console.log( data['_body'] );
                var body = data['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    if ( response.message == "USER CREATED SUCCESSFULLY" ) {
                        this.userActive = true;
                        this.goToLogin();
                    }
                } else {
                    this.logger.error(this.refService.errorPrepender+" signUp():"+data);
                }

            },
            error => {
                if ( error == "USERNAME IS ALREADY EXISTING" ) {
                    this.formErrors['userName'] = error;
                    this.isLoading = false;
                } else if ( error == "USER IS ALREADY EXISTING WITH THIS EMAIL" ) {
                    this.formErrors['emailId'] = 'Email Id already exists';
                    this.isLoading = false;
                } else{
                    this.logger.errorPage(error);
                }
            },
            () => console.log( "Done" )
            );
        return false;

    }

    buildForm() {
        var passwordRegex = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})';// 
        var addressRegex =  /^[a-zA-Z0-9-\/] ?([a-zA-Z0-9-\/]|[a-zA-Z0-9-\/] )*[a-zA-Z0-9-\/]$/;
       // var cityRegEx = /^[a-zA-z] ?([a-zA-z]|[a-zA-z] )*[a-zA-z]$/;
        var cityRegEx = /[a-zA-Z]+[a-zA-Z ]+/;
        //var nameRegEx = /[a-zA-Z0-9]+[a-zA-Z0-9 ]+/;
        this.signUpForm = this.fb.group( {
            'fullName': [this.signUpUser.fullName, Validators.compose([Validators.required,noWhiteSpaceValidator,Validators.maxLength( 50 )])],//Validators.pattern(nameRegEx)
            'emailId': [this.signUpUser.emailId, [Validators.required, Validators.pattern( this.emailRegEx )]],
            'address': [this.signUpUser.address,  Validators.compose([Validators.required,noWhiteSpaceValidator,Validators.maxLength( 50 ),])],//Validators.pattern(nameRegEx)
            'city': [this.signUpUser.city, Validators.compose([Validators.required,noWhiteSpaceValidator,Validators.maxLength( 50 ),Validators.pattern(cityRegEx)])],
            'country': [this.countries[0],  Validators.compose([Validators.required,validateCountryName])],
            'password': [this.signUpUser.password, [Validators.required, Validators.minLength( 6 ), Validators.pattern( passwordRegex )]],
            'confirmPassword': [null, [Validators.required, Validators.pattern( passwordRegex )]],
            'agree': [false, Validators.required],
        }, {
                validator: matchingPasswords( 'password', 'confirmPassword' )
            }
        );

        this.signUpForm.valueChanges
            .subscribe( data => this.onValueChanged( data ) );

        this.onValueChanged(); // (re)set validation messages now
    }

    validateForgotPasswordForm() {
        this.forgotPasswordForm = this.fb.group( {
            'forgotPasswordEmailId': [null, [Validators.required, Validators.pattern( this.emailRegEx )]]
        });

        this.forgotPasswordForm.valueChanges
            .subscribe( data => this.onEmailValueChanged( data ) );

        this.onEmailValueChanged(); // (re)set validation messages now
    }

    onValueChanged( data?: any ) {
        if ( !this.signUpForm ) { return; }
        const form = this.signUpForm;
        console.log(form.controls);
        for ( const field in this.formErrors ) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get( field );
            if ( control && control.dirty && !control.valid ) {
                const messages = this.validationMessages[field];
                for ( const key in control.errors ) {
                    console.log( this.formErrors[field]);
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onEmailValueChanged( data?: any ) {
        if ( !this.forgotPasswordForm ) { return; }
        const form = this.forgotPasswordForm;

        for ( const field in this.formErrors ) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get( field );

            if ( control && control.dirty && !control.valid ) {
                const messages = this.validationMessages[field];
                for ( const key in control.errors ) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    formErrors = {
        'fullName': '',
        'emailId': '',
        'address': '',
        'city': '',
        'country': '',
        'password': '',
        'confirmPassword': '',
        'agree': '',
        'forgotPasswordEmailId': ''
    };

    validationMessages = {
        'fullName': {
            'required': 'Name is required.',
            'whitespace':'Invalid Data',
            'minlength': 'Name must be at least 4 characters long.',
            'maxlength': 'Name cannot be more than 50 characters long.',
            'pattern':'Invalid Name'
        },
        'emailId': {
            'required': 'Email is required.',
            'pattern': 'Invalid Pattern.'
        },
        'address': {
            'required': 'Address is required.',
            'whitespace':'Invalid Data',
            'minlength': 'Address must be at least 4 characters long.',
            'maxlength': 'Address cannot be more than 50 characters long.',
            'pattern':'Invalid Address'
        },
        'city': {
            'required': 'City is required.',
            'whitespace':'Invalid Data',
            'minlength': 'City must be at least 4 characters long.',
            'maxlength': 'City cannot be more than 50 characters long.',
            'pattern':'Invalid City'
        },
        'country': {
            'required': 'Country is required.',
            'invalidCountry':'Country is required.'
        },
        'password': {
            'required': 'Password is required.',
            'minlength': 'Minimum 6 Characters',
            'pattern': 'Password should contain One Upper case letter, one lower case letter, one symbol and one Number'
        },
        'confirmPassword': {
            'required': 'Confirm Password is required.',
            'pattern': 'Password should contain One Upper case letter, one lower case letter, one symbol and one Number'
        },
        'agree': {
            'required': 'You Must Agree.'
        },
        'forgotPasswordEmailId': {
            'required': 'Email is required.',
            'pattern': 'Invalid Pattern.'
        }
    };

    /********************Forgot Password******************/
    sendPassword() {
       // swal( { title: 'Sending Password', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        this.userService.sendPassword( this.forgotPasswordForm.value.forgotPasswordEmailId )
            .subscribe(
            data => {
                console.log( data['_body'] );
                var body = data['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    if ( response.message == "An email has been sent. Please login with the credentials" ) {
                        this.forgotPasswordForm.reset();
                        this.passwordSuccess = true;
                        this.showLogin();
                        $('#password-success').show();
                        setTimeout( function() { $( "#password-success" ).hide(500);}, 5000 );
                    }
                } else {
                    this.logger.error(this.refService.errorPrepender+" sendPassword():"+data);
                }

            },
            error => {
                this.formErrors['forgotPasswordEmailId'] = error.toLowerCase();
            },
            () => console.log( "Done" )
            );
        return false;

    }
}
