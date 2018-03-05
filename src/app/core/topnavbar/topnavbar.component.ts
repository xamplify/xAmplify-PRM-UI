import {Component, OnInit, Input} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {UserService} from '../services/user.service';
import {SocialService} from '../../social/services/social.service';
import {User} from '../models/user';
import {AuthenticationService} from '../../core/services/authentication.service';
import {ReferenceService} from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import {UtilService} from '../../core/services/util.service';
import {Roles} from '../../core/models/roles';
declare var swal, $: any;
@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit {

  notifications: any;
  totalNotificationsCount: number;
  notificationsCount = 0;
  isUserUpdated: boolean;
  campaignEmailNotifications: any;
  campaignEmailNotificationCount = 0;
  campaignVideoWatchedNotifications: any;
  campaignVideoWatchedNotificationCount = 0;
  roleName: Roles = new Roles();
  isUser = false;
  @Input() model = {'displayName': '', 'profilePicutrePath': 'assets/admin/pages/media/profile/icon-user-default.png'};
  constructor(public router: Router, public userService: UserService, public utilService: UtilService,
              public socialService: SocialService, public authenticationService: AuthenticationService,
              public refService: ReferenceService, public logger: XtremandLogger) {
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
        error => {this.logger.error(this.refService.errorPrepender + ' Constructor():' + error); },
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
    if(roles.length === 1){
        this.isUser = true;
    }
    if(roles.indexOf(this.roleName.companyPartnerRole) > -1){
        this.authenticationService.module.isCompanyPartner = true;
    }
    
  }

  markAsRead(id: number, type: string) {
    this.refService.markNotificationsAsRead(id, type)
      .subscribe(
      data => {
        console.log('updated successfully');
      },
      error => console.log(error),
      () => console.log('Finished')
      );
  }
  getUnReadNotificationCount(array: any) {
    let count = 0;
    for (let i = 0; i < array.length; ++i) {
      if (array[i] === 0) {
        count++;
      }
    }
    return count;
  }
  markItAsRead(index: number, id: string) {
    const liId = id + index;
    $('#' + liId).removeClass('unread-notification');
    $('#' + liId).addClass('read-notification');
    if (id === 'video-notification-' && this.campaignVideoWatchedNotifications > 0) {
      this.campaignVideoWatchedNotificationCount = this.campaignVideoWatchedNotificationCount - 1;
    } else if (id === 'email-notification-' && this.campaignEmailNotificationCount > 0) {
      this.campaignEmailNotificationCount = this.campaignEmailNotificationCount - 1;
    }
  }

  gotoDetails(campaignId: number, userId: number, emailId: string) {
    this.refService.isFromTopNavBar = true;
    this.refService.topNavBarNotificationDetails.campaignId = campaignId;
    this.refService.topNavBarNotificationDetails.userId = userId;
    this.refService.topNavBarNotificationDetails.emailId = emailId;
    this.router.navigateByUrl('/home/campaigns/' + campaignId + '/details');
  }

  unreadNotificationsCount() {
    this.userService.unreadNotificationsCount(this.authenticationService.getUserId())
      .subscribe(
      data => {
        this.notificationsCount = data;
      },
      error => console.log(error),
      () => console.log('Finished')
      );
  }

  ngOnInit() {
    this.unreadNotificationsCount();
  }
  
  logout(){
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }
}