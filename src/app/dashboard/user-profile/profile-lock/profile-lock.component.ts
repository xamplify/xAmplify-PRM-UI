import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { User } from '../../../core/models/user';
import { Properties } from '../../../common/models/properties';
import { DashboardAnalyticsDto } from 'app/dashboard/models/dashboard-analytics-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

@Component({
    selector: 'app-profile-lock',
    templateUrl: './profile-lock.component.html',
    styleUrls: ['./profile-lock.component.css','../../../../assets/css/default.css', '../../../../assets/css/authentication-page.css'],
    providers: [Properties]
})
export class ProfileLockComponent implements OnInit {

    userProfileImage = 'assets/images/icon-user-default.png';
    userData: User;
    displayName: string;
    password: any;
    error: string;
    loginDisabled = true;
    loading = false;
    socialProviders = [{ "name": "salesforce", "iconName": "salesforce" },
    { "name": "facebook", "iconName": "facebook" },
    { "name": "twitter", "iconName": "twitter" },
    { "name": "google", "iconName": "googleplus" },
    { "name": "linkedin", "iconName": "linkedin" }]
    dashboardAnalyticsDto: DashboardAnalyticsDto = new DashboardAnalyticsDto();
    constructor(public authenticationService: AuthenticationService,private router: Router,
      public properties: Properties, public referenceService: ReferenceService, private vanityURLService:VanityURLService) {
        this.password = '';
    }
    errorHandler(event:any){ event.target.src='assets/images/icon-user-default.png';}
    checkPassword() {
        if (this.password.replace(/\s/g, '').length === 0) {
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
            if (!this.userData.emailId) { this.router.navigate(['./login']); }
            if (!(this.userData.profileImagePath.indexOf(null) > -1)) { this.userProfileImage = this.userData.profileImagePath; }
            this.userData.displayName = this.userData.firstName ? this.userData.firstName : this.userData.emailId;
            console.log(this.displayName);
            this.authenticationService.logout();
        } catch (err) {
            console.log('error' + err);
        }
    }

    lockScreenLogin() {
        this.loading = true;
        console.log('username is :' + this.userData.emailId + ' password is: ' + this.password);
        if(this.password && this.userData.emailId){
        const authorization = 'Basic ' + btoa('my-trusted-client:');
        const body = 'username=' + this.userData.emailId + '&password=' + this.password + '&grant_type=password';
        if(this.authenticationService.companyProfileName !== null && this.authenticationService.companyProfileName !== ""){
            this.dashboardAnalyticsDto =  this.vanityURLService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
        }
        this.authenticationService.login(authorization, body, this.userData.emailId,this.dashboardAnalyticsDto).subscribe(result => {
          if (localStorage.getItem('currentUser')) { this.redirectTo(JSON.parse(localStorage.getItem('currentUser')));
           } else {  this.logError(); }
           },
           err => this.logError(),
           () => console.log('login() Complete'));
           return false;
          } else { this.logError(); }
    }
    backToLogin(){
        this.router.navigate(['./login']);
    }
    redirectTo(user: any) {
      this.loading = false;
      const roles = user.roles;
      if (user.hasCompany || roles.length === 1) {
          this.router.navigate([this.referenceService.homeRouter]);
      } else {
          this.router.navigate(['/home/dashboard/add-company-profile']);
      }
  }
    logError() {
      this.loading = false;
      if (this.password !== '') {
            this.error = 'Password is incorrect';
        } else {
            this.error = "Password shouldn't be empty";
        }
        console.log('error : ' + this.error);
    }

}
