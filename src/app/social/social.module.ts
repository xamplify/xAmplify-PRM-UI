import { NgModule } from '@angular/core';
import {FormsModule, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TwitterProfileComponent } from './twitter/twitter-profile/twitter-profile.component';
import { TwitterTweetsComponent } from './twitter/twitter-tweets/twitter-tweets.component';
import { TwitterFriendsComponent } from './twitter/twitter-friends/twitter-friends.component';
import { TwitterFollowersComponent } from './twitter/twitter-followers/twitter-followers.component';
import { TwitterAnalyticsComponent } from './twitter/twitter-analytics/twitter-analytics.component';

import{SocialRoutingModule} from './social-routing.module';
import {SharedModule} from '../shared/shared.module';

import { UtilService } from './../core/services/util.service';
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

import { FacebookAnalyticsComponent } from './facebook/facebook-analytics/facebook-analytics.component';
import { FacebookInsightGenderAgeComponent } from './facebook/facebook-insight-gender-age/facebook-insight-gender-age.component';
import { FacebookInsightFansCountryComponent } from './facebook/facebook-insight-fans-country/facebook-insight-fans-country.component';

@NgModule({
  imports: [ CommonModule, SharedModule, SocialRoutingModule, FormsModule],
  declarations: [TwitterProfileComponent, TwitterTweetsComponent, TwitterFriendsComponent, TwitterFollowersComponent, 
                 TwitterAnalyticsComponent, LineChartComponent, NewFansLineChartComponent, PieChartGeoDistributionComponent,
                 TwitterAreaChartComponent, FacebookAccountsComponent, FacebookPostsComponent, UpdateStatusComponent, FacebookAnalyticsComponent, 
                 FacebookInsightGenderAgeComponent, FacebookInsightFansCountryComponent],
  providers: [TwitterService, FacebookService, SocialService, UtilService]
})
export class SocialModule { }
