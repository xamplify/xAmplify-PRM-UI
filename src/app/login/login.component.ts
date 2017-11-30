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
            if(localStorage.getItem( 'currentUser' )){
                this.router.navigate( ['/home/dashboard/default'] );
                return false
            }else{
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
                        console.log(currentUser);
                        console.log(currentUser.hasCompany);
                        if(currentUser.hasCompany){
                            this.router.navigate( ['/home/dashboard/default'] );
                        }else{
                            this.router.navigate( ['/home/dashboard/add-company-profile'] );
                        }
                        // if user is coming from any link
                        if (this.authenticationService.redirectUrl) {
                            this.router.navigate([this.authenticationService.redirectUrl]);
                            this.authenticationService.redirectUrl = null;
                        }
                        
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
            if(localStorage.getItem( 'currentUser' )){
                this.router.navigate( ['/home/dashboard/default'] );
                return false;
            }
          //  this.authenticationService.logout();
           /* this.refService.topNavBarUserDetails.displayName = "Loading....";
            this.refService.topNavBarUserDetails.profilePicutrePath = "assets/images/profile-pic.gif";*/
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
        this.signUpForm.reset();
        this.signUpForm.controls.country.setValue(this.refService.countries[0]);
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
        this.signUpForm.controls.country.setValue(this.refService.countries[0]);
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
            'country': [this.refService.countries[0],  Validators.compose([Validators.required,validateCountryName])],
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
