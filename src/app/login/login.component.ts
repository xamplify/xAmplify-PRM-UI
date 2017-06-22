import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { User } from '../core/models/user';

import { AuthenticationService } from '../core/services/authentication.service';
import { UtilService } from '../core/services/util.service';
import { UserService } from '../core/services/user.service';
import {matchingPasswords} from '../form-validator';
import { ReferenceService } from '../core/services/reference.service';

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

    constructor( private router: Router,
        private authenticationService: AuthenticationService, private fb: FormBuilder, private signUpUser: User, 
        private userService: UserService, private refService :ReferenceService, private utilService: UtilService ) {
      
    	this.signUpForm = new FormGroup({
            fullName: new FormControl(),
            emailId: new FormControl(),
            address: new FormControl(),
            city: new FormControl(),
            country: new FormControl(),
            password: new FormControl(),
            confirmPassword: new FormControl(),
            agree: new FormControl()
        });
        this.forgotPasswordForm = new FormGroup({
            forgotPasswordEmailId: new FormControl()
        });
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
        this.loading = true;
        this.refService.userName = this.model.username;
        
        var authorization = 'Basic ' + btoa( 'my-trusted-client:');
        var body = 'username=' + this.model.username + '&password=' + this.model.password + '&grant_type=password';
        
        this.authenticationService.login(authorization, body, this.model.username).subscribe( result => {
            if ( localStorage.getItem( 'currentUser' ) ) {
                this.initializeTwitterNotification();
                //if user is coming from login
             //   this.getLoggedInUserDetails();
                this.router.navigate( [''] );
                //if user is coming from any link

            } else {
                this.logError();
            }
        },
            err => this.logError(),
            () => console.log( 'login() Complete' ) );
        return false;
    }
    logError() {
        this.error = 'Username or password is incorrect';
        console.log( "error : " + this.error );
        //this.loading = false;
        this.router.navigate( ['/login'] );
    }

  /*  public getLoggedInUserDetails() {
        this.userService.getUserData()
            .subscribe(
            data => {
                var body = data['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    this.userService.loggedInUserData = response;
                } else {
                    swal( "Please Contact Admin", data, "error" );
                }

            },
            error => {
                swal( error, "", "error" );
            },
            () => console.log( "Done" )
            );
    }*/
    ngOnInit() {
        try {
            console.log( "ngOnInit(): LoginComponent" );
            this.authenticationService.logout();
          //  this.getLoggedInUserDetails();
            Metronic.init();
            Layout.init();
            Login.init();
            Demo.init();
            console.log( "ngOnInit() :LoginComponent completed" );
          
        }
        catch ( error ) {
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
    }

    showLogin() {
        console.log( "showLogin clicked" );
        $( '.login-form' ).show();
        $( '.forget-form' ).hide();
        $( '.register-form' ).hide();
        this.signUpForm.reset();
    }

    logout() {
        // reset login status
        this.authenticationService.logout();
    }

    /******************************Sign Up****************************************/


    signUp() {
      //  swal( { title: 'Submiting User Details', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        this.signUpUser = this.signUpForm.value;
        this.userService.signUp( this.signUpUser )
            .subscribe(
            data => {
                console.log( data['_body'] );
                var body = data['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    if ( response.message == "USER CREATED SUCCESSFULLY" ) {
                        this.signUpForm.reset();
                        this.showLogin();
                        this.userActive = true;
        //                swal.close();
                    }
                } else {
                    swal( "Please Contact Admin", "", "error" );
                }

            },
            error => {
                if ( error == "USERNAME IS ALREADY EXISTING" ) {
                    this.formErrors['userName'] = error;
                    swal.close();
                } else if ( error == "USER IS ALREADY EXISTING WITH THIS EMAIL" ) {
                	
                    this.formErrors['emailId'] = 'Email Id already exists';
                    swal.close();
                }
                else{
                	  swal( "Please Contact Admin", "", "error" );
                }
            },
            () => console.log( "Done" )
            );
        return false;

    }

    buildForm() {
    	var emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        var passwordRegex = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})';
        this.signUpForm = this.fb.group( {
            'fullName': [this.signUpUser.fullName, [
                Validators.required,
                Validators.minLength( 4 ),
                Validators.maxLength( 24 )
            ]
            ],
            'emailId': [this.signUpUser.emailId, [Validators.required, Validators.pattern( emailRegex )]],
            'address': [this.signUpUser.address, Validators.required],
            'city': [this.signUpUser.city, Validators.required],
            'country': [this.signUpUser.country, Validators.required],
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
        var emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        this.forgotPasswordForm = this.fb.group( {
            'forgotPasswordEmailId': [null, [Validators.required, Validators.pattern( emailRegex )]]
        });

        this.forgotPasswordForm.valueChanges
            .subscribe( data => this.onEmailValueChanged( data ) );

        this.onEmailValueChanged(); // (re)set validation messages now
    }


    onValueChanged( data?: any ) {
        if ( !this.signUpForm ) { return; }
        const form = this.signUpForm;

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
            'minlength': 'Name must be at least 4 characters long.',
            'maxlength': 'Name cannot be more than 24 characters long.'
        },
        'emailId': {
            'required': 'Email is required.',
            'pattern': 'Invalid Pattern.'
        },
        'address': {
            'required': 'Address is required.'
        },
        'city': {
            'required': 'City is required.'
        },
        'country': {
            'required': 'Country is required.'
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
                        this.showLogin();
                        this.passwordSuccess = true;
                       // swal.close();
                    }
                } else {
                    swal( "Please Contact Admin", "", "error" );
                }

            },
            error => {
                this.formErrors['forgotPasswordEmailId'] = error.toLowerCase();
                swal.close();
            },
            () => console.log( "Done" )
            );
        return false;

    }
}
