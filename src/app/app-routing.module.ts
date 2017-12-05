import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './core/home/home.component';
import { VideosModule } from './videos/videos.module';
import { ContactsModule } from './contacts/contacts.module';
import { PartnersModule } from './partners/partners.module'; 
import { EmailTemplateModule } from './email-template/email-template.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { UpgradeModule } from './upgrade/upgrade.module';
import { TeamMemberModule } from './team/team-member.module';
import { AppCustomPreloader } from './app-routing-loader';

import { ShareVideoComponent } from './videos/share-video/share-video.component';
import { CampaignVideoComponent } from './videos/campaign-video/campaign-video.component';
import { SocialLoginComponent } from './social/common/social-login/social-login.component';
import { SocialCallbackComponent } from './social/common/social-callback/social-callback.component';

import { ProfileLockComponent } from './dashboard/user-profile/profile-lock/profile-lock.component';
import { ActivateAccountComponent } from './signup/activate-account/activate-account.component';
import { LogEmailClickComponent } from './campaigns/log-email-click/log-email-click.component';
import { LogUnsubscribeComponent } from './campaigns/log-unsubscribe/log-unsubscribe.component';
import { ServiceUnavailableComponent } from './error-pages/service-unavailable/service-unavailable.component';
import { PageNotFoundComponent } from './error-pages/page-not-found/page-not-found.component';
import { ErrorPagesComponent } from './error-pages/error-pages.component';
import { AccessDeniedComponent } from './error-pages/access-denied/access-denied.component';
import { LogRegularCampaignComponent } from './campaigns/log-regular-campaign/log-regular-campaign.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'home/dashboard/default', pathMatch: 'full', canActivate: [AuthGuard] },
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
            { path: 'emailtemplates', loadChildren: 'app/email-template/email-template.module#EmailTemplateModule' },
            { path: 'videos', loadChildren: 'app/videos/videos.module#VideosModule',  data: { preload: true } },
            { path: 'social', loadChildren: 'app/social/social.module#SocialModule' },
            { path: 'contacts', loadChildren: 'app/contacts/contacts.module#ContactsModule',  data: { preload: true } },
            { path: 'partners', loadChildren: 'app/partners/partners.module#PartnersModule',  data: { preload: true } },
            { path: 'campaigns', loadChildren: 'app/campaigns/campaigns.module#CampaignsModule',  data: { preload: false } },
            { path: 'upgrade', loadChildren: 'app/upgrade/upgrade.module#UpgradeModule' },
            { path: 'team', loadChildren: 'app/team/team-member.module#TeamMemberModule' },
            { path: 'error/:errorStatusId', component: ErrorPagesComponent }
        ]
    },
    { path: 'userlock', component: ProfileLockComponent },
    { path: 'logout', component: LoginComponent },
    { path: ':social/login', component: SocialLoginComponent },
    { path: ':social/callback', component: SocialCallbackComponent },
    { path: 'embed/:alias', component: ShareVideoComponent },
    { path: 'showCampaignVideo/:alias', component: CampaignVideoComponent },
    { path: 'user/showCampaignEmail', component: LogRegularCampaignComponent },
    { path: 'register/verifyemail/user', component: ActivateAccountComponent },
    { path: 'loge/:alias', component: LogEmailClickComponent },
    { path: 'log/unsubscribe-user', component: LogUnsubscribeComponent },
    { path: 'serviceunavailable', component: ServiceUnavailableComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: '**', component: PageNotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: AppCustomPreloader })
            ],
    exports: [RouterModule],
    providers : [AppCustomPreloader]
})
export class AppRoutingModule { }
