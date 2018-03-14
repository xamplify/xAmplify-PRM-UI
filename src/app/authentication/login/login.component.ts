import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { User } from '../../core/models/user';
import { Role } from '../../core/models/role';
import { AuthenticationService } from '../../core/services/authentication.service';
import { matchingPasswords, noWhiteSpaceValidator, validateCountryName } from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare const Metronic, swal, $, Layout, Login, Demo: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
    providers: [User, Properties]
})

export class LoginComponent implements OnInit, OnDestroy {
    model: any = {};
    loading = false;
    customResponse: CustomResponse = new CustomResponse();
    
    socialProviders = [{ "name": "salesforce","iconName":"salesforce"},
                        { "name": "facebook","iconName":"facebook" },
                        { "name": "twitter","iconName":"twitter" },
                        { "name": "google","iconName":"googleplus" },
                        { "name": "linkedin","iconName":"linkedin" }];
    
    roles: Array<Role>;
    constructor(private router: Router, private authenticationService: AuthenticationService, private formBuilder: FormBuilder,
        public referenceService: ReferenceService, private xtremandLogger: XtremandLogger, public properties: Properties) {
       
        if ( this.referenceService.userProviderMessage !== "" ) {
            this.customResponse = new CustomResponse( 'SUCCESS', this.referenceService.userProviderMessage, true );
        }
    }

    public login() {
        if (this.model.username.length === 0 || this.model.password.length === 0) {
            this.setCustomeResponse("ERROR",this.properties.EMPTY_CREDENTIAL_ERROR);
        } else {
            if (localStorage.getItem('currentUser')) {
                this.xtremandLogger.log("User From Local Storage");
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const roles = currentUser.roles;
                const roleNames = roles.map(function (a) { return a.roleName; });
                if (roles.length === 1 || this.isOnlyPartner(roleNames)) {
                    this.xtremandLogger.log("User Or Company Partner");
                    this.router.navigate(['/home/dashboard/myprofile']);
                } else {
                    this.xtremandLogger.log("Going To DashBoard");
                    this.router.navigate(['/home/dashboard/default']);
                }

                return false
            } else {
                this.loading = true;
                const userName = this.model.username.toLowerCase();
                this.referenceService.userName = userName;
                const authorization = 'Basic ' + btoa('my-trusted-client:');
                const body = 'username=' + userName + '&password=' + this.model.password + '&grant_type=password';
                this.authenticationService.login(authorization, body, userName).subscribe(result => {
                    if (localStorage.getItem('currentUser')) {
                        // if user is coming from login
                        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                        this.xtremandLogger.log(currentUser);
                        this.xtremandLogger.log(currentUser.hasCompany);
                        const roles = currentUser.roles;
                        const roleNames = roles.map(function (a) { return a.roleName; });
                        if (currentUser.hasCompany) {
                            this.router.navigate(['/home/dashboard/default']);
                        } else {
                            if (roles.length === 1 || this.isOnlyPartner(roleNames)) {
                                this.router.navigate(['/home/dashboard/myprofile']);
                            } else {
                                this.router.navigate(['/home/dashboard/add-company-profile']);
                            }
                        }

                        // if user is coming from any link
                        if (this.authenticationService.redirectUrl) {
                            this.router.navigate([this.authenticationService.redirectUrl]);
                            this.authenticationService.redirectUrl = null;
                        }

                    } else {
                        this.setCustomeResponse("ERROR",this.properties.BAD_CREDENTIAL_ERROR);
                    }
                },
                    (error: any) => {
                        const body = error['_body'];
                        if (body !== "") {
                            const response = JSON.parse(body);
                            if (response.error_description === "Bad credentials") {
                                this.customResponse = new CustomResponse( 'ERROR', this.properties.BAD_CREDENTIAL_ERROR, true );
                            } else if (response.error_description === "User is disabled") {
                                this.customResponse = new CustomResponse( 'ERROR', this.properties.USER_ACCOUNT_ACTIVATION_ERROR, true );
                            }
                        }
                        this.xtremandLogger.error("error:" + error)

                    });
                return false;
            }
        }
    }

    isOnlyPartner(roleNames) {
        if (roleNames.length === 2 && (roleNames.indexOf('ROLE_USER') > -1 && roleNames.indexOf('ROLE_COMPANY_PARTNER') > -1)) {
            this.xtremandLogger.log("*******************LoggedIn User Is Partner***********************")
            return true;
        } else {
            this.xtremandLogger.log("*******************LoggedIn User Is Not Partner***********************");
            return false;
        }
    }
    eventHandler(keyCode: any) {
        if (keyCode === 13) {
            this.login();
        }
    }
    setCustomeResponse(responseType: string, responseMessage: string) {
        this.customResponse = new CustomResponse( responseType, responseMessage, true );
        this.xtremandLogger.error(responseMessage);
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.referenceService.userProviderMessage = '';
        $('#org-admin-deactivated').hide();
    }

}
