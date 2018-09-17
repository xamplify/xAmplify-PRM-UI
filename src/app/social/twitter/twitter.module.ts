import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwitterRoutingModule } from './twitter-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { TwitterProfileComponent } from './twitter-profile/twitter-profile.component';
import { TwitterTweetsComponent } from './twitter-tweets/twitter-tweets.component';
import { TwitterFriendsComponent } from './twitter-friends/twitter-friends.component';
import { TwitterFollowersComponent } from './twitter-followers/twitter-followers.component';
import { TwitterAnalyticsComponent } from './twitter-analytics/twitter-analytics.component';
import { TwitterHomeComponent } from './twitter-home/twitter-home.component';
import { TwitterTrendsComponent } from './twitter-trends/twitter-trends.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { NewFansLineChartComponent } from './new-fans-line-chart/new-fans-line-chart.component';
import { PieChartGeoDistributionComponent } from './pie-chart-geo-distribution/pie-chart-geo-distribution.component';
import { TwitterAreaChartComponent } from './twitter-area-chart/twitter-area-chart.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { HeaderComponent } from './header/header.component';
import { TweetComponent } from './tweet/tweet.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, TwitterRoutingModule
  ],
  declarations: [TwitterProfileComponent, TwitterTweetsComponent, TwitterFriendsComponent, TwitterFollowersComponent,
    TwitterAnalyticsComponent, LineChartComponent, NewFansLineChartComponent, PieChartGeoDistributionComponent,
    TwitterAreaChartComponent, TwitterHomeComponent, TwitterTrendsComponent,ProfileCardComponent, HeaderComponent, TweetComponent]
})
export class TwitterModule { }
