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
import { RegularExpressions } from '../../common/models/regular-expressions';

declare var Metronic, swal, $, Layout, Login, Demo: any;

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
    providers: [User, RegularExpressions]
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup;
    passwordSuccess = false;
    formErrors = {
        'forgotPasswordEmailId': ''
    };

    validationMessages = {
        'forgotPasswordEmailId': {
            'required': 'Email is required.',
            'pattern': 'Your email address must be in the format of name@domain.com.'
        }
    };

    constructor(private router: Router, public regularExpressions: RegularExpressions,
        private authenticationService: AuthenticationService, private formBuilder: FormBuilder, private user: User,
        private userService: UserService, public referenceService: ReferenceService, private utilService: UtilService, private xtremandLogger: XtremandLogger) {
        this.validateForgotPasswordForm();
    }

    sendPassword() {
        this.userService.sendPassword(this.forgotPasswordForm.value.forgotPasswordEmailId)
            .subscribe(
                data => {
                    /*console.log( data['_body'] );
                    var body = data['_body'];*/
                    if (data.message != "") {
                        // var response = JSON.parse( body );
                        if (data.message == "An email has been sent. Please login with the credentials") {
                            this.forgotPasswordForm.reset();
                            this.referenceService.userProviderMessage = 'forgotPassWord';
                            this.router.navigate(['./login']);
                        }
                    } else {
                        this.xtremandLogger.error(this.referenceService.errorPrepender + " sendPassword():" + data);
                    }
                },
                error => {
                    this.formErrors['forgotPasswordEmailId'] = error.toLowerCase();
                },
                () => this.xtremandLogger.log("Done")
            );
        return false;
    }

    validateForgotPasswordForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            'forgotPasswordEmailId': [null, [Validators.required, Validators.pattern(this.regularExpressions.EMAIL_ID_PATTERN)]]
        });
        this.forgotPasswordForm.valueChanges
            .subscribe(data => this.onEmailValueChanged(data));
        this.onEmailValueChanged(); // (re)set validation messages now
    }

    onEmailValueChanged(data?: any) {
        if (!this.forgotPasswordForm) { return; }
        const form = this.forgotPasswordForm;
        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    ngOnInit() {
        $('.forget-form').show();
        this.forgotPasswordForm.reset();
    }

}
