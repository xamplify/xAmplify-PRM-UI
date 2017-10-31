import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UpdateStatusComponent } from './common/update-status/update-status.component';
import { SocialManageComponent } from './common/social-manage/social-manage.component';

import { TwitterTweetsComponent } from './twitter/twitter-tweets/twitter-tweets.component';
import { TwitterFriendsComponent } from './twitter/twitter-friends/twitter-friends.component';
import { TwitterFollowersComponent } from './twitter/twitter-followers/twitter-followers.component';
import { TwitterAnalyticsComponent } from './twitter/twitter-analytics/twitter-analytics.component';
import { TwitterProfileComponent } from './twitter/twitter-profile/twitter-profile.component';

import { FacebookPostsComponent } from './facebook/facebook-posts/facebook-posts.component';
import { FacebookAccountsComponent } from './facebook/facebook-accounts/facebook-accounts.component';
import { FacebookAnalyticsComponent } from './facebook/facebook-analytics/facebook-analytics.component';

const routes: Routes = [
    { path: 'update-status', component: UpdateStatusComponent },
    { path: 'manage/:social', component: SocialManageComponent },

    { path: 'twitter-tweets/:profileId', component: TwitterTweetsComponent },
    { path: 'twitter-friends/:profileId', component: TwitterFriendsComponent },
    { path: 'twitter-followers/:profileId', component: TwitterFollowersComponent },
    { path: 'twitter-analytics/:profileId', component: TwitterAnalyticsComponent },
    { path: 'twitter-user/:profileId1/:profileId2', component: TwitterProfileComponent },

    { path: 'facebook-accounts', component: FacebookAccountsComponent },
    { path: 'facebook-posts/:profileId', component: FacebookPostsComponent },
    { path: 'facebook-analytics/:profileId', component: FacebookAnalyticsComponent },
];


@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class SocialRoutingModule { }