import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../core/models/user';

import { AuthenticationService } from '../../core/services/authentication.service';
import { matchingPasswords, noWhiteSpaceValidator, validateCountryName } from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var Metronic, swal, $, Layout, Login, Demo: any;

@Component( {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../assets/css/default.css'],
    providers: [User]
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor( private router: Router, private authenticationService: AuthenticationService, private fb: FormBuilder,
        private refService: ReferenceService, private logger: XtremandLogger ) {

    }

    public login() {
        if ( this.model.username.length === 0 || this.model.password.length === 0 ) {
            this.logErrorEmpty()
        } else {
            if ( localStorage.getItem( 'currentUser' ) ) {
                this.router.navigate( ['/home/dashboard/default'] );
                return false
            } else {
                this.loading = true;
                const userName = this.model.username.toLowerCase();
                this.refService.userName = userName;
                const authorization = 'Basic ' + btoa( 'my-trusted-client:' );
                const body = 'username=' + userName + '&password=' + this.model.password + '&grant_type=password';
                this.authenticationService.login( authorization, body, userName ).subscribe( result => {
                    if ( localStorage.getItem( 'currentUser' ) ) {
                        this.initializeTwitterNotification();
                        // if user is coming from login
                        //   this.getLoggedInUserDetails();
                        let currentUser = JSON.parse( localStorage.getItem( 'currentUser' ) );
                        console.log( currentUser );
                        console.log( currentUser.hasCompany );
                        if ( currentUser.hasCompany ) {
                            this.router.navigate( ['/home/dashboard/default'] );
                        } else {
                            this.router.navigate( ['/home/dashboard/add-company-profile'] );
                        }
                        // if user is coming from any link
                        if ( this.authenticationService.redirectUrl ) {
                            this.router.navigate( [this.authenticationService.redirectUrl] );
                            this.authenticationService.redirectUrl = null;
                        }

                    } else {
                        this.logError();
                    }
                },
                    ( error: any ) => {
                        var body = error['_body'];
                        if ( body != "" ) {
                            var response = JSON.parse( body );
                            if ( response.error_description == "Bad credentials" ) {
                                this.error = 'Username or password is incorrect';
                                setTimeout(() => {
                                    this.error = '';
                                }, 5000 )
                            } else if ( response.error_description == "User is disabled" ) {
                                this.error = 'Your account is not activated.!';
                                setTimeout(() => {
                                    this.error = '';
                                }, 5000 )
                            }
                        }
                        console.log( "error:" + error )

                    });
                return false;
            }
        }
    }

    logError() {
        this.error = 'Username or password is incorrect';
        console.log( "error : " + this.error );
        // this.router.navigate(['/login']);
        setTimeout(() => {
            this.error = '';
        }, 5000 )
    }

    logErrorEmpty() {
        this.error = 'Username or password can\'t be empty';
        console.log( "error : " + this.error );
        setTimeout(() => {
            this.error = '';
        }, 5000 )
    }

    public initializeTwitterNotification() {/*
       this.twitterService.initializeNotification()
           .subscribe(
           data => {console.log(data)},
           error => console.log(error),
           () => console.log("finished")
           );
   */}

    ngOnInit() {
        /*Metronic.init();
        Layout.init();
        Login.init();
        Demo.init();*/
    }

}
