import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwitterProfileComponent } from './twitter/twitter-profile/twitter-profile.component';
import { TwitterTweetsComponent } from './twitter/twitter-tweets/twitter-tweets.component';
import { TwitterFriendsComponent } from './twitter/twitter-friends/twitter-friends.component';
import { TwitterFollowersComponent } from './twitter/twitter-followers/twitter-followers.component';
import { TwitterAnalyticsComponent } from './twitter/twitter-analytics/twitter-analytics.component';

import{SocialRoutingModule} from './social-routing.module';

import {SocialService} from './social.service';
import {TwitterService} from './twitter/twitter.service';
import {FacebookService} from './facebook/facebook.service';

@NgModule({
  imports: [ CommonModule, SocialRoutingModule ],
  declarations: [TwitterProfileComponent, TwitterTweetsComponent, TwitterFriendsComponent, TwitterFollowersComponent, TwitterAnalyticsComponent],
  providers: [TwitterService, FacebookService, SocialService]
})
export class SocialModule { }
