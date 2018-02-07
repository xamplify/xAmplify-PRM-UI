import {Component, OnInit, Input} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {UserService} from '../../../core/services/user.service';
import {TwitterService} from '../../../social/services/twitter.service';
import {SocialService} from '../../../social/services/social.service';
import {User} from '../../../core/models/user';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {ReferenceService} from '../../../core/services/reference.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import {UtilService} from '../../../core/services/util.service';
import {Roles} from '../../../core/models/roles';
declare var swal, $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

notifications: any;
notificationsCount = 0;
isUserUpdated: boolean;
campaignEmailNotifications: any;
campaignEmailNotificationCount = 0;
campaignVideoWatchedNotifications: any;
campaignVideoWatchedNotificationCount = 0;
    
  constructor(public router: Router, public userService: UserService,
          public twitterService: TwitterService, public utilService: UtilService,
          public socialService: SocialService, public authenticationService: AuthenticationService,
          public refService: ReferenceService, public logger: XtremandLogger) { }
  
  listNotifications(){
      this.twitterService.listNotifications(this.authenticationService.getUserId())
      .subscribe(
      data => {
          this.notifications = data;
          let count = 0;
          for (const i in this.notifications) {
            if (this.notifications[i].read === false) {
              count = count + 1;
            }
          }
          this.notificationsCount = count;
      },
      error => console.log(error),
      () => console.log('Finished')
      );
  }
  
  listCampaignEmailNotifications() {
      this.refService.listCampaignEmailNotifications(this.authenticationService.user.id)
        .subscribe(
        data => {
          console.log(data);
          this.campaignEmailNotifications = data;
          this.campaignEmailNotificationCount = this.getUnReadNotificationCount(
            this.campaignEmailNotifications.map(function(a) {return a.openCount; }));
        },
        error => console.log(error),
        () => console.log('Finished')
        );
    }
  
  listCampaignVideoNotifications() {
      this.refService.listCampaignVideoNotifications(this.authenticationService.user.id)
        .subscribe(
        data => {
          console.log(data);
          this.campaignVideoWatchedNotifications = data;
          this.campaignVideoWatchedNotificationCount = this.getUnReadNotificationCount(
                this.campaignVideoWatchedNotifications.map(function(a) {return a.openCount; }));
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
  
  gotoDetails(campaignId: number, userId: number, emailId: string) {
      this.refService.isFromTopNavBar = true;
      this.refService.topNavBarNotificationDetails.campaignId = campaignId;
      this.refService.topNavBarNotificationDetails.userId = userId;
      this.refService.topNavBarNotificationDetails.emailId = emailId;
      this.router.navigateByUrl('/home/campaigns/' + campaignId + '/details');
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
  
  ngOnInit() {
      this.listNotifications();
      this.listCampaignEmailNotifications();
      this.listCampaignVideoNotifications();
  }

}
