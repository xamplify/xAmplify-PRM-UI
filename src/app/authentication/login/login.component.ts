import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../core/models/user';
import { Role } from '../../core/models/role';
import { AuthenticationService } from '../../core/services/authentication.service';
import { matchingPasswords, noWhiteSpaceValidator, validateCountryName } from '../../form-validator';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var Metronic, swal, $, Layout, Login, Demo: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
    providers: [User]
})

export class LoginComponent implements OnInit, OnDestroy {
    model: any = {};
    loading = false;
    error = '';
    roles: Array<Role>;
    constructor(private router: Router, private authenticationService: AuthenticationService, private fb: FormBuilder,
        public refService: ReferenceService, private logger: XtremandLogger) {

    }

    public login() {
        if (this.model.username.length === 0 || this.model.password.length === 0) {
            this.logErrorEmpty()
        } else {
            if (localStorage.getItem('currentUser')) {
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                let roles = currentUser.roles;
                let roleNames = roles.map(function (a) { return a.roleName; });
                if (roles.length == 1 || this.isOnlyPartner(roleNames)) {
                    this.router.navigate(['/home/dashboard/myprofile']);
                } else {
                    this.router.navigate(['/home/dashboard/default']);
                }

                return false
            } else {
                this.loading = true;
                const userName = this.model.username.toLowerCase();
                this.refService.userName = userName;
                const authorization = 'Basic ' + btoa('my-trusted-client:');
                const body = 'username=' + userName + '&password=' + this.model.password + '&grant_type=password';
                this.authenticationService.login(authorization, body, userName).subscribe(result => {
                    if (localStorage.getItem('currentUser')) {
                        // if user is coming from login
                        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                        console.log(currentUser);
                        console.log(currentUser.hasCompany);
                        let roles = currentUser.roles;
                        let roleNames = roles.map(function (a) { return a.roleName; });
                        if(currentUser.hasCompany){
                            this.router.navigate(['/home/dashboard/default']);
                        }else{
                            if(roles.length == 1 || this.isOnlyPartner(roleNames)){
                                this.router.navigate(['/home/dashboard/myprofile']);
                            }else{
                                this.router.navigate(['/home/dashboard/add-company-profile']);
                            }
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
                    (error: any) => {
                        var body = error['_body'];
                        if (body != "") {
                            var response = JSON.parse(body);
                            if (response.error_description == "Bad credentials") {
                                this.error = 'Username or password is incorrect';
                                setTimeout(() => {
                                    this.error = '';
                                }, 5000)
                            } else if (response.error_description == "User is disabled") {
                                this.error = 'Your account is not activated.!';
                                setTimeout(() => {
                                    this.error = '';
                                }, 5000)
                            }
                        }
                        console.log("error:" + error)

                    });
                return false;
            }
        }
    }
    
    isOnlyPartner(roleNames){
        if(roleNames.length==2 && (roleNames.indexOf('ROLE_USER')>-1 && roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1)){
            return true;
        }else{
            return false;
        }
    }
    eventHandler(keyCode: any) {
        if (keyCode === 13) {
            this.login();
        }
    }
    logError() {
        this.error = 'Username or password is incorrect';
        console.log("error : " + this.error);
        setTimeout(() => {
            this.error = '';
        }, 5000)
    }

    logErrorEmpty() {
        this.error = 'Username or password can\'t be empty';
        console.log("error : " + this.error);
        setTimeout(() => {
            this.error = '';
        }, 5000)
    }

    ngOnInit() {
        /*Metronic.init();
        Layout.init();
        Login.init();
        Demo.init();*/
    }

    ngOnDestroy() {
        this.refService.signUpSuccess = '';
        this.refService.forgotMessage = '';
        this.refService.accountDisabled = "";
        $('#org-admin-deactivated').hide();
    }

}
