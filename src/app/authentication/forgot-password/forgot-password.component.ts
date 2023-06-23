import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';

import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
declare var $: any;

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css',
        '../../../assets/css/loader.css'],
    providers: [RegularExpressions, Properties]
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup;
    loading = false;
    mainLoader: boolean;
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
        private xtremandLogger: XtremandLogger, public authenticationService: AuthenticationService, private vanityURLService: VanityURLService) {
        this.validateForgotPasswordForm();
    }

    sendPassword() {
        try {
            this.loading = true;
            this.userService.sendPassword(this.forgotPasswordForm.value.forgotPasswordEmailId)
                .subscribe(
                    data => {
                        this.loading = false;
                        if (data.message !== "") {
                            if (data.message === "An email has been sent. Please login with the credentials") {
                                this.forgotPasswordForm.reset();
                                this.referenceService.userName = '';
                                this.referenceService.userProviderMessage = this.properties.FORGOT_PASSWORD_MAIL_SEND_SUCCESS;
                                this.router.navigate(['./login']);
                            }
                        } else {
                            this.customResponse = new CustomResponse('ERROR', 'Email Id doesn\'t exists', true);
                        }
                    },
                    error => {
                        this.loading = false;
                        //  this.formErrors['forgotPasswordEmailId'] = error.toLowerCase();
                        this.referenceService.userName = '';
                        this.xtremandLogger.error(error);
                        this.customResponse = new CustomResponse('ERROR', error, true);
                    },
                    () => this.xtremandLogger.log("Done")
                );
            return false;
        } catch (error) { this.xtremandLogger.error(error); }
    }

    validateForgotPasswordForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            'forgotPasswordEmailId': [this.referenceService.userName, [Validators.required, Validators.pattern(this.regularExpressions.EMAIL_ID_PATTERN)]]
        });
    }

    ngOnInit() {
        try {
            $('.forget-form').show();
            // this.forgotPasswordForm.reset();
            this.mainLoader = true;
            if(this.vanityURLService.isVanityURLEnabled()){
                this.checkVanityURlDetails();
            }            
            this.authenticationService.navigateToDashboardIfUserExists();
            setTimeout(() => { this.mainLoader = false; }, 900);
        } catch (error) { this.xtremandLogger.error('error' + error); }
    }

    checkVanityURlDetails() {        
        if (this.authenticationService.v_companyName == undefined || this.authenticationService.v_companyLogoImagePath == undefined) {
            this.router.navigate(["/login"]);
        }
    }
}
