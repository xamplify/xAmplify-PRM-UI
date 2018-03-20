import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TwitterTweetsComponent } from './twitter-tweets/twitter-tweets.component';
import { TwitterFriendsComponent } from './twitter-friends/twitter-friends.component';
import { TwitterFollowersComponent } from './twitter-followers/twitter-followers.component';
import { TwitterAnalyticsComponent } from './twitter-analytics/twitter-analytics.component';
import { TwitterProfileComponent } from './twitter-profile/twitter-profile.component';
import { TwitterHomeComponent } from './twitter-home/twitter-home.component';

const routes: Routes = [
    { path: ':profileId/home', component: TwitterHomeComponent },
    { path: ':profileId/tweets', component: TwitterTweetsComponent },
    { path: ':profileId/friends', component: TwitterFriendsComponent },
    { path: ':profileId/followers', component: TwitterFollowersComponent },
    { path: ':profileId/analytics', component: TwitterAnalyticsComponent },
    { path: 'user/:profileId1/:profileId2', component: TwitterProfileComponent },
];


@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class TwitterRoutingModule { }