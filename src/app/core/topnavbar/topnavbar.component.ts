import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { SocialService } from '../../social/services/social.service';
import { User } from '../models/user';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { Roles } from '../../core/models/roles';
import { Properties } from '../../common/models/properties';

declare var swal, $: any;
@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css'],
  providers: [Properties]
})
export class TopnavbarComponent implements OnInit {

  roleName: Roles = new Roles();
  isUser = false;
  @Input() model = { 'displayName': '', 'profilePicutrePath': 'assets/admin/pages/media/profile/icon-user-default.png' };
  constructor(public router: Router, public userService: UserService, public utilService: UtilService,
    public socialService: SocialService, public authenticationService: AuthenticationService,
    public refService: ReferenceService, public logger: XtremandLogger,public properties: Properties) {
    const userName = this.authenticationService.user.emailId;
    if (this.refService.topNavbarUserService === false || this.utilService.topnavBareLoading === false) {
      this.refService.topNavbarUserService = true;
      this.utilService.topnavBareLoading = true;
      this.userService.getUserByUserName(userName).
        subscribe(
        data => {
          console.log(data);
          refService.userDefaultPage = data.userDefaultPage;
          const loggedInUser = data;
          if (loggedInUser.firstName != null) {
            this.model.displayName = loggedInUser.firstName;
            refService.topNavBarUserDetails.displayName = loggedInUser.firstName;
          } else {
            this.model.displayName = loggedInUser.emailId;
            refService.topNavBarUserDetails.displayName = loggedInUser.emailId;
          }
          if (!(loggedInUser.profileImagePath.indexOf(null) > -1)) {
            this.model.profilePicutrePath = loggedInUser.profileImagePath;
            refService.topNavBarUserDetails.profilePicutrePath = loggedInUser.profileImagePath;
          } else {
            this.model.profilePicutrePath = 'assets/admin/pages/media/profile/icon-user-default.png';
            refService.topNavBarUserDetails.profilePicutrePath = 'assets/admin/pages/media/profile/icon-user-default.png';
          }
        },
        error => { this.logger.error(this.refService.errorPrepender + ' Constructor():' + error); },
        () => console.log('Finished')
        );
    }
    const roles = this.authenticationService.getRoles();
    if (roles.indexOf(this.roleName.videRole) > -1 || roles.indexOf(this.roleName.allRole) > -1) {
      this.authenticationService.module.hasVideoRole = true;
    }
    if (roles.indexOf(this.roleName.socialShare) > -1 || roles.indexOf(this.roleName.allRole) > -1) {
      this.authenticationService.module.hasSocialStatusRole = true;
    }
    if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
      this.authenticationService.module.isOrgAdmin = true;
    }
    if (roles.length === 1) {
      this.isUser = true;
    }
    if (roles.indexOf(this.roleName.companyPartnerRole) > -1) {
      this.authenticationService.module.isCompanyPartner = true;
    }

  }

  getUnreadNotificationsCount() {
    this.userService.getUnreadNotificationsCount(this.authenticationService.getUserId())
      .subscribe(
      data => {
        this.userService.unreadNotificationsCount = data;
      },
      error => console.log(error),
      () => console.log('Finished')
      );
  }

  ngOnInit() {
    this.getUnreadNotificationsCount();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}