import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SocialConnection } from 'app/social/models/social-connection';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { TwitterService } from 'app/social/services/twitter.service';
import { FacebookService } from 'app/social/services/facebook.service';
import { SocialService } from 'app/social/services/social.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { DashboardReport } from 'app/core/models/dashboard-report';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';

declare var  $: any;

@Component({
  selector: 'app-social-accounts-analytics',
  templateUrl: './social-accounts-analytics.component.html',
  styleUrls: ['./social-accounts-analytics.component.css'],
  providers: [HttpRequestLoader]
})
export class SocialAccountsAnalyticsComponent implements OnInit {
  socialConnections: SocialConnection[] = new Array<SocialConnection>();
  dashboardReport: DashboardReport = new DashboardReport();
  loggedInUserId: number = 0;
  socialAccountsLoader: HttpRequestLoader = new HttpRequestLoader();
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,public twitterService: TwitterService,
    public facebookService: FacebookService, public socialService: SocialService,public dashboardService:DashboardService) { }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.listActiveSocialAccounts(this.loggedInUserId);
    this.genderDemographics(this.loggedInUserId);

  }
  genderDemographics(userId: number) {
    this.socialService.genderDemographics(userId)
        .subscribe(
            data => {
                this.dashboardReport.genderDemographicsMale = data['M'];
                this.dashboardReport.genderDemographicsFemale = data['F'];
                this.dashboardReport.genderDemographicsTotal =
                this.dashboardReport.genderDemographicsMale + this.dashboardReport.genderDemographicsFemale;
                this.referenceService.loading(this.socialAccountsLoader,false);
              },
            error => this.xtremandLogger.log(error),
            () => { }
        );

}

     // TFFF == TweetsFriendsFollowersFavorites
     getTotalCountOfTFFF(socialConnection: SocialConnection) {
      this.xtremandLogger.log('getTotalCountOfTFFF() method invoke started.');
      this.twitterService.getTotalCountOfTFFF(socialConnection)
          .subscribe(
              data => {
                  this.xtremandLogger.log(data);
                  socialConnection.twitterTotalTweetsCount = data['tweetsCount'];
                  socialConnection.twitterTotalFollowersCount = data['followersCount'];
                  socialConnection.twitterTotalFriendsCount = data['friendsCount'];
              },
              error => this.xtremandLogger.log(error),
              () => this.xtremandLogger.log('getTotalCountOfTFFF() method invoke started finished.')
          );
  }

  getPageFanCount(socialConnection: SocialConnection, pageId: string) {
      this.facebookService.getPageFanCount(socialConnection, pageId)
          .subscribe(
              data => {
                  socialConnection.facebookFanCount = data["fan_count"];
              },
              error => this.xtremandLogger.log(error),
              () => { }
          );
  }

  getFriends(socialConnection: SocialConnection) {
      this.facebookService.getFriends(socialConnection)
          .subscribe(
              data => {
                  this.xtremandLogger.log(data);
                  // socialConnection.facebookFriendsCount = data.extraData.fan_count;
              },
              error => this.xtremandLogger.log(error),
              () => { }
          );
  }

  getPosts(socialConnection: SocialConnection) {
      this.facebookService.getPosts(socialConnection)
          .subscribe(
              data => {
                  this.xtremandLogger.log(data);
              },
              error => this.xtremandLogger.log(error),
              () => this.xtremandLogger.log('getPosts() Finished.')
          );
  }

  getWeeklyPosts(socialConnection: SocialConnection) {
      this.facebookService.getWeeklyPosts(socialConnection)
          .subscribe(
              data => {
                  const dates = [];
                  const values = [];
                  for (const i of Object.keys(data)) {
                      dates.push(i);
                      values.push(data[i]);
                  }

                  $('#sparkline_' + socialConnection.profileId).sparkline(values, {
                      type: 'bar',
                      padding: '5px',
                      barWidth: '4',
                      height: '20',
                      barColor: '#00ACED',
                      barSpacing: '3',
                      negBarColor: '#e02222',
                      tooltipFormat: '<span>Posts:{{value}}<br>{{offset:offset}}</span>',
                      tooltipValueLookups: { 'offset': dates }

                  });

                  var sum = values.reduce((a, b) => a + b, 0);
                  socialConnection.weeklyPostsCount = sum;
              },
              error => this.xtremandLogger.log(error),
              () => this.xtremandLogger.log('getWeeklyTweets() method invoke started finished.')
          );
  }

  getWeeklyTweets(socialConnection: SocialConnection) {
      this.twitterService.getWeeklyTweets(socialConnection)
          .subscribe(
              data => {
                  const dates = [];
                  const values = [];
                  for (const i of Object.keys(data)) {
                      dates.push(i);
                      values.push(data[i]);
                  }
                  $('#sparkline_' + socialConnection.profileId).sparkline(values, {
                      type: 'bar',
                      padding: '5px',
                      barWidth: '4',
                      height: '20',
                      barColor: '#00ACED',
                      barSpacing: '3',
                      negBarColor: '#e02222',
                      tooltipFormat: '<span>Tweets:{{value}}<br>{{offset:offset}}</span>',
                      tooltipValueLookups: { 'offset': dates }
                  });

                  var sum = values.reduce((a, b) => a + b, 0);
                  socialConnection.weeklyPostsCount = sum;
              },
              error => this.xtremandLogger.log(error),
              () => this.xtremandLogger.log('getWeeklyTweets() method invoke started finished.')
          );
  }

  listActiveSocialAccounts(userId: number) {
    this.referenceService.loading(this.socialAccountsLoader,true);
      this.socialService.listAccounts(userId, 'ALL', 'ACTIVE')
          .subscribe(
              data => {
                  this.socialConnections = data;
                  this.socialService.socialConnections = data;
                  this.socialService.setDefaultAvatar(this.socialConnections);
              },
              error => this.xtremandLogger.log(error),
              () => {
                  if (this.socialConnections.length > 0) {
                      for (const i in this.socialConnections) {
                          if (this.socialConnections[i].source === 'TWITTER') {
                              this.getTotalCountOfTFFF(this.socialConnections[i]);
                              this.getGenderDemographics(this.socialConnections[i]);
                              this.getWeeklyTweets(this.socialConnections[i]);
                          } else if (this.socialConnections[i].source === 'FACEBOOK') {
                              this.getWeeklyPosts(this.socialConnections[i]);
                              this.getPosts(this.socialConnections[i]);
                              if (this.socialConnections[i].emailId === null) {
                                  this.getPageFanCount(this.socialConnections[i], this.socialConnections[i].profileId);
                              } else {
                                  this.getFriends(this.socialConnections[i]);
                              }

                          }
                      }
                  }
                  this.xtremandLogger.log('getFacebookAccounts() Finished.');
              }
          );

  }

  getGenderDemographics(socialConnection: SocialConnection) {
    this.dashboardService.getGenderDemographics(socialConnection)
        .subscribe(
            data => {
                this.xtremandLogger.info(data);
                this.dashboardReport.genderDemographicsMale = data['male'];
                this.dashboardReport.genderDemographicsFemale = data['female'];


            },
            error => this.xtremandLogger.log(error),
            () => this.xtremandLogger.log('finished')
        );
}

}
