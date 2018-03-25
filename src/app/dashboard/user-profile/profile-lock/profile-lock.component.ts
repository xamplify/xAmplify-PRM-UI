import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { User } from '../../../core/models/user';
import { Properties } from '../../../common/models/properties';

declare var Metronic, Layout, Demo: any;

@Component({
    selector: 'app-profile-lock',
    templateUrl: './profile-lock.component.html',
    styleUrls: ['./profile-lock.component.css'],
    providers: [Properties]
})
export class ProfileLockComponent implements OnInit {

    userProfileImage = 'assets/admin/pages/media/profile/icon-user-default.png';
    userData: User;
    displayName: string;
    password: string;
    error: string;
    loginDisabled = true;
    constructor(private userService: UserService, private authenticationService: AuthenticationService,
        private router: Router, public properties: Properties) {
        this.password = '';
    }
    checkPassword(password: string) {
        if (password.replace(/\s/g, '').length === 0) {
            this.loginDisabled = true;
        } else {
        this.loginDisabled = false;
            this.error = null;
        }
    }
    ngOnInit() {
        try {
            this.userData = this.authenticationService.user;
            if (this.userData.emailId === undefined) { this.router.navigate(['./login']); }
            if (!(this.userData.profileImagePath.indexOf(null) > -1)) {
                this.userProfileImage = this.userData.profileImagePath;
            }
            if (this.userData.firstName !== null) {
                this.userData.displayName = this.userData.firstName;
                this.displayName = this.userData.displayName;
            } else {
                this.userData.displayName = this.userData.emailId;
                this.displayName = this.userData.displayName;
            }
            Metronic.init();
            Layout.init();
            Demo.init();
            console.log(this.displayName);
            this.authenticationService.logout();
        } catch (err) {
            console.log('error' + err);
        }
    }

    lockScreenLogin() {
        console.log('username is :' + this.userData.emailId + ' password is: ' + this.password);
        const authorization = 'Basic ' + btoa('my-trusted-client:');
        const body = 'username=' + this.userData.emailId + '&password=' + this.password + '&grant_type=password';
        this.authenticationService.login(authorization, body, this.userData.emailId).subscribe(result => {
            if (localStorage.getItem('currentUser')) {
                this.router.navigate(['']);
            } else {
                this.logError();
            }
        },
            err => this.logError(),
            () => console.log('login() Complete'));
        return false;
    }
    backToLogin(){
        this.router.navigate(['./login']);
    }
    logError() {
        if (this.password !== '') {
            this.error = 'Password is incorrect';
        } else {
            this.error = "Password should't be empty";
        }
        console.log('error : ' + this.error);
    }
}
