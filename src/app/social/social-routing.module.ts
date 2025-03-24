import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UpdateStatusComponent } from '../util/update-status/update-status.component';
import { SocialManageComponent } from './common/social-manage/social-manage.component';

import { FacebookPostsComponent } from './facebook/facebook-posts/facebook-posts.component';
import { FacebookAccountsComponent } from './facebook/facebook-accounts/facebook-accounts.component';
import { FacebookAnalyticsComponent } from './facebook/facebook-analytics/facebook-analytics.component';

const routes: Routes = [
    { path: 'update-status', component: UpdateStatusComponent },
    { path: 'manage/:social', component: SocialManageComponent },

    { path: 'facebook-accounts', component: FacebookAccountsComponent },
    { path: 'facebook-posts/:profileId', component: FacebookPostsComponent },
    { path: 'facebook-analytics/:profileId', component: FacebookAnalyticsComponent },
];


@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class SocialRoutingModule { }