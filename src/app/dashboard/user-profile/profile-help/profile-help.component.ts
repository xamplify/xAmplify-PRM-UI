import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';

@Component({
  selector: 'app-profile-help',
  templateUrl: './profile-help.component.html',
  styleUrls: ['../../../../assets/css/bootstrap-fileinput.css', '../../../../assets/css/profile.css'],
  providers: [User]
})
export class ProfileHelpComponent implements OnInit {
  userData: User;
  userProfileImage = 'assets/images/icon-user-default.png';
  parentModel = { 'displayName': '', 'profilePicutrePath': 'assets/images/icon-user-default.png' };
  constructor(public authenticationService: AuthenticationService, public router: Router, public referenceService: ReferenceService) {
    this.userData = this.authenticationService.userProfile;
    if (this.isEmpty(this.userData.roles) || !this.userData.profileImagePath) {
      this.router.navigateByUrl(this.referenceService.homeRouter);
    } else {
      this.parentModel.displayName = this.userData.firstName ? this.userData.firstName: this.userData.emailId;
      if (!(this.userData.profileImagePath.indexOf(null) > -1)) {
        this.userProfileImage = this.userData.profileImagePath;
        this.parentModel.profilePicutrePath = this.userData.profileImagePath;
      }
    }
  }
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  ngOnInit() {
    try {
      this.userData.displayName = this.userData.firstName ? this.userData.firstName : this.userData.emailId;
    } catch (err) { console.log(err); }
  }
}
