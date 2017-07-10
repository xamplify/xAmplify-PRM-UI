import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user';
import { AuthenticationService } from '../../../core/services/authentication.service';
declare var Metronic: any;
declare var Layout: any;
declare var Demo: any;
declare var Profile: any;

@Component({
  selector: 'app-profile-help',
  templateUrl: './profile-help.component.html',
  styleUrls: ['../../../../assets/css/bootstrap-fileinput.css', '../../../../assets/css/profile.css'],
  providers : [User]
})
export class ProfileHelpComponent implements OnInit {
  userData: User;
  userProfileImage = 'assets/admin/pages/media/profile/icon-user-default.png';
  parentModel = { 'displayName': '', 'profilePicutrePath': 'assets/admin/pages/media/profile/icon-user-default.png' };
  constructor(private authenticationService: AuthenticationService) {
     this.userData = this.authenticationService.userProfile;
      if (this.userData.firstName !== null ) {
        this.parentModel.displayName =  this.userData.firstName;
     }else {
        this.parentModel.displayName =  this.userData.emailId;
     }
     if ( !( this.userData.profileImagePath.indexOf( null ) > -1 ) ) {
        this.userProfileImage = this.userData.profileImagePath;
         this.parentModel.profilePicutrePath = this.userData.profileImagePath;
      }
  }

  ngOnInit() {
      try {
          Metronic.init();
          Layout.init();
          Demo.init();
    //      Profile.init();
          if ( this.userData.firstName != null ) {
              this.userData.displayName = this.userData.firstName;
          } else {
              this.userData.displayName = this.userData.emailId;
          }
     }catch (err) { console.log(err); }
 }
}
