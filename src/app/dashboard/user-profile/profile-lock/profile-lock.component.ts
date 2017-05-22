import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user';
import { AuthenticationService } from '../../../core/services/authentication.service';
declare var Metronic , Layout, Demo: any;

@Component({
  selector: 'app-profile-lock',
  templateUrl: './profile-lock.component.html',
  styleUrls: ['./profile-lock.component.css']
})
export class ProfileLockComponent implements OnInit {

 userProfileImage = 'assets/admin/pages/media/profile/icon-user-default.png';
 userData: User;
 displayName: string;
 password: string;
 error: string;
 constructor(private userService: UserService, private authenticationService:  AuthenticationService, private router: Router)
 {
     this.password = '';
 }
ngOnInit() {
      try {
            this.userData = this.userService.loggedInUserData;
            if (!(this.userData.profileImagePath.indexOf(null)>-1)) {
                this.userProfileImage = this.userData.profileImagePath;
            }
            if (this.userData.firstName !== null) {
            this.userData.displayName = this.userData.firstName;
            this.displayName = this.userData.displayName;
            }else {
            this.userData.displayName = this.userData.emailId;
            this.displayName = this.userData.displayName;
            }
           Metronic.init();
           Layout.init();
           Demo.init();
           console.log(this.displayName);
           this.authenticationService.logout();
      }
      catch (err) {
          console.log('error' + err);
      }
  }

  lockScreenLogin() {
       console.log('username is :' + this.userData.emailId + ' password is: ' + this.password);
        this.authenticationService.login( this.userData.emailId, this.password ).subscribe( result => {
            console.log( 'result: ' + result );
            if ( result === true ) {
                this.router.navigate( [''] );
            } else {
                this.logError();
            }
          },
            err => this.logError(),
            () => console.log( 'login() Complete' ) );
        return false;
 }

logError() {
       if(this.password !== ''){
        this.error = 'Password is incorrect';
       }
       else {
         this.error = "Password should't be empty";
       }
        console.log( 'error : ' + this.error );
       // this.router.navigate( ['/login'] );
    }
}
