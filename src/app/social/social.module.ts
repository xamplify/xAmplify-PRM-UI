import { NgModule } from '@angular/core';
import {FormsModule, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular2-highcharts';
import { TwitterProfileComponent } from './twitter/twitter-profile/twitter-profile.component';
import { TwitterTweetsComponent } from './twitter/twitter-tweets/twitter-tweets.component';
import { TwitterFriendsComponent } from './twitter/twitter-friends/twitter-friends.component';
import { TwitterFollowersComponent } from './twitter/twitter-followers/twitter-followers.component';
import { TwitterAnalyticsComponent } from './twitter/twitter-analytics/twitter-analytics.component';

import{SocialRoutingModule} from './social-routing.module';
import {SharedModule} from '../shared/shared.module';
import {SocialService} from './services/social.service';
import {TwitterService} from './services/twitter.service';
import {FacebookService} from './services/facebook.service';
import { LineChartComponent } from './twitter/line-chart/line-chart.component';
import { NewFansLineChartComponent } from './twitter/new-fans-line-chart/new-fans-line-chart.component';
import { PieChartGeoDistributionComponent } from './twitter/pie-chart-geo-distribution/pie-chart-geo-distribution.component';
import { TwitterAreaChartComponent } from './twitter/twitter-area-chart/twitter-area-chart.component';
import { FacebookAccountsComponent } from './facebook/facebook-accounts/facebook-accounts.component';
import { FacebookPostsComponent } from './facebook/facebook-posts/facebook-posts.component';
import { UpdateStatusComponent } from './common/update-status/update-status.component';

@NgModule({
  imports: [ CommonModule, SharedModule, SocialRoutingModule, ChartModule, FormsModule],
  declarations: [TwitterProfileComponent, TwitterTweetsComponent, TwitterFriendsComponent, TwitterFollowersComponent, 
                 TwitterAnalyticsComponent, LineChartComponent, NewFansLineChartComponent, PieChartGeoDistributionComponent,
                 TwitterAreaChartComponent, FacebookAccountsComponent, FacebookPostsComponent, UpdateStatusComponent],
  providers: [TwitterService, FacebookService, SocialService]
})
export class SocialModule { }
