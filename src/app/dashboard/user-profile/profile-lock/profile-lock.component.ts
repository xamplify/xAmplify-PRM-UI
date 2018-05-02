import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { User } from '../../../core/models/user';
import { Properties } from '../../../common/models/properties';

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
    loading = false;
    constructor(private userService: UserService, public authenticationService: AuthenticationService,
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
    eventHandler(keyCode: any) {  if (keyCode === 13) {  this.lockScreenLogin();  }  }
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
            console.log(this.displayName);
            this.authenticationService.logout();
        } catch (err) {
            console.log('error' + err);
        }
    }

    lockScreenLogin() {
        this.loading = true;
        console.log('username is :' + this.userData.emailId + ' password is: ' + this.password);
        const authorization = 'Basic ' + btoa('my-trusted-client:');
        const body = 'username=' + this.userData.emailId + '&password=' + this.password + '&grant_type=password';
        this.authenticationService.login(authorization, body, this.userData.emailId).subscribe(result => {
          if (localStorage.getItem('currentUser')) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.redirectTo(currentUser);
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
    redirectTo(user: any) {
      this.loading = false;
      const roles = user.roles;
      if (user.hasCompany || roles.length === 1) {
          this.router.navigate(['/home/dashboard/default']);
      } else {
          this.router.navigate(['/home/dashboard/add-company-profile']);
      }
  }
    logError() {
      this.loading = false;
      if (this.password !== '') {
            this.error = 'Password is incorrect';
        } else {
            this.error = "Password should't be empty";
        }
        console.log('error : ' + this.error);
    }
}
