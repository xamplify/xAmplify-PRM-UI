import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../core/models/user';
import { AuthenticationService } from '../../core/services/authentication.service';
import { UtilService } from '../../core/services/util.service';
import { UserService } from '../../core/services/user.service';
import { matchingPasswords, noWhiteSpaceValidator, validateCountryName } from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

declare var Metronic, swal, $, Layout, Login, Demo: any;

@Component( {
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
    providers: [User]
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup;
    passwordSuccess = false;
    error = '';
    emailRegEx: any = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;

    constructor( private router: Router,
        private authenticationService: AuthenticationService, private fb: FormBuilder, private signUpUser: User,
        private userService: UserService, public refService: ReferenceService, private utilService: UtilService, private logger: XtremandLogger ) {
        this.validateForgotPasswordForm();
    }

    formErrors = {
        'forgotPasswordEmailId': ''
    };

    validationMessages = {
        'forgotPasswordEmailId': {
            'required': 'Email is required.',
            'pattern': 'Your email address must be in the format of name@domain.com.'
        }
    };

    sendPassword() {
        this.userService.sendPassword( this.forgotPasswordForm.value.forgotPasswordEmailId )
            .subscribe(
            data => {
                /*console.log( data['_body'] );
                var body = data['_body'];*/
                if ( data.message != "" ) {
                   // var response = JSON.parse( body );
                    if ( data.message == "An email has been sent. Please login with the credentials" ) {
                        this.forgotPasswordForm.reset();
                        this.refService.forgotMessage = 'Password has been sent to your registered Email Id';
                        this.router.navigate(['./login']);
                    }
                } else {
                    this.logger.error( this.refService.errorPrepender + " sendPassword():" + data );
                }
            },
            error => {
                this.formErrors['forgotPasswordEmailId'] = error.toLowerCase();
            },
            () => console.log( "Done" )
            );
        return false;
    }

    validateForgotPasswordForm() {
        this.forgotPasswordForm = this.fb.group( {
            'forgotPasswordEmailId': [null, [Validators.required, Validators.pattern( this.emailRegEx )]]
        });
        this.forgotPasswordForm.valueChanges
            .subscribe( data => this.onEmailValueChanged( data ) );
        this.onEmailValueChanged(); // (re)set validation messages now
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

    ngOnInit() {
        $( '.forget-form' ).show();
        this.forgotPasswordForm.reset();
    }

}
