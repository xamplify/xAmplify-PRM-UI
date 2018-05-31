import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';

import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

import { matchingPasswords, noWhiteSpaceValidator, validateCountryName } from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { AuthenticationService } from '../../core/services/authentication.service';
declare var $: any;

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
    providers: [RegularExpressions, Properties]
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup;
    loading = false;
    customResponse: CustomResponse = new CustomResponse();
    formErrors = {
        'forgotPasswordEmailId': ''
    };

    validationMessages = {
        'forgotPasswordEmailId': {
            'required': 'Email is required.',
            'pattern': 'Your email address must be in the format of name@domain.com.'
        }
    };

    constructor(private router: Router, public regularExpressions: RegularExpressions, public properties: Properties,
        private formBuilder: FormBuilder, private userService: UserService, public referenceService: ReferenceService,
        private xtremandLogger: XtremandLogger,public authenticationService:AuthenticationService) {
        this.validateForgotPasswordForm();
    }

    sendPassword() {
        this.loading =  true;
        this.userService.sendPassword(this.forgotPasswordForm.value.forgotPasswordEmailId)
            .subscribe(
                data => {
                    this.loading = false;
                    if (data.message !== "") {
                        // var response = JSON.parse( body );
                        if (data.message === "An email has been sent. Please login with the credentials") {
                            this.forgotPasswordForm.reset();
                            this.referenceService.userName = '';
                            this.referenceService.userProviderMessage = this.properties.FORGOT_PASSWORD_MAIL_SEND_SUCCESS;
                            this.router.navigate(['./login']);
                        }
                    } else {
                        this.customResponse =  new CustomResponse('ERROR', data.toLowerCase(), true);
                      //  this.xtremandLogger.error(this.referenceService.errorPrepender + " sendPassword():" + data);
                    }
                },
                error => {
                    this.loading = false;
                  //  this.formErrors['forgotPasswordEmailId'] = error.toLowerCase();
                    this.referenceService.userName = '';
                    this.customResponse = new CustomResponse('ERROR', error.toLowerCase(), true);

                },
                () => this.xtremandLogger.log("Done")
            );
        return false;
    }

    validateForgotPasswordForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            'forgotPasswordEmailId': [this.referenceService.userName, [Validators.required, Validators.pattern(this.regularExpressions.EMAIL_ID_PATTERN)]]
        });
    }

    ngOnInit() {
        $('.forget-form').show();
        this.authenticationService.navigateToDashboardIfUserExists();
       // this.forgotPasswordForm.reset();
    }

}
