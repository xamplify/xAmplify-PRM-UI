import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { VideosModule } from './videos/videos.module';
import { ContactsModule } from './contacts/contacts.module';
import { PartnersModule } from './partners/partners.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { UpgradeModule } from './upgrade/upgrade.module';
import { TeamMemberModule } from './team/team-member.module';
import { AppCustomPreloader } from './app-routing-loader';

import { HomeComponent } from './core/home/home.component';
import { ShareVideoComponent } from './videos/share-video/share-video.component';
import { CampaignVideoComponent } from './videos/campaign-video/campaign-video.component';
import { SocialLoginComponent } from './social/common/social-login/social-login.component';
import { SocialCallbackComponent } from './social/common/social-callback/social-callback.component';
import { ProfileLockComponent } from './dashboard/user-profile/profile-lock/profile-lock.component';
import { LogEmailClickComponent } from './campaigns/log-email-click/log-email-click.component';
import { LogUnsubscribeComponent } from './campaigns/log-unsubscribe/log-unsubscribe.component';
import { ServiceUnavailableComponent } from './error-pages/service-unavailable/service-unavailable.component';
import { PageNotFoundComponent } from './error-pages/page-not-found/page-not-found.component';
import { ErrorPagesComponent } from './error-pages/error-pages/error-pages.component';
import { AccessDeniedComponent } from './error-pages/access-denied/access-denied.component';
import { LogRegularCampaignComponent } from './campaigns/log-regular-campaign/log-regular-campaign.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { CompanyPageComponent } from './dashboard/company-profile/company-page/company-page.component';
import { VendorSignupComponent } from './authentication/vendor-signup/vendor-signup.component';
import { IntroComponent } from './authentication/intro/intro.component';
import { TermsConditonComponent } from 'app/authentication/terms-conditon/terms-conditon.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'v-signup', component:VendorSignupComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'register/verifyemail/user', component: VerifyEmailComponent },
    { path: '', component: IntroComponent},
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
            { path: 'emailtemplates', loadChildren: 'app/email-template/email-template.module#EmailTemplateModule' },
            { path: 'videos', loadChildren: 'app/videos/videos.module#VideosModule',  data: { preload: true } },
            { path: 'social', loadChildren: 'app/social/social.module#SocialModule' },
            { path: 'twitter', loadChildren: 'app/social/twitter/twitter.module#TwitterModule' },
            { path: 'contacts', loadChildren: 'app/contacts/contacts.module#ContactsModule',  data: { preload: true } },
            { path: 'partners', loadChildren: 'app/partners/partners.module#PartnersModule',  data: { preload: true } },
            { path: 'campaigns', loadChildren: 'app/campaigns/campaigns.module#CampaignsModule',  data: { preload: false } },
            { path: 'upgrade', loadChildren: 'app/upgrade/upgrade.module#UpgradeModule' },
            { path: 'team', loadChildren: 'app/team/team-member.module#TeamMemberModule' },
            { path: 'error/:errorStatusId', component: ErrorPagesComponent }
        ]
    },
    { path: 'terms-conditions', component: TermsConditonComponent },
    { path: 'privacy-policy', component: TermsConditonComponent },
    { path: 'userlock', component: ProfileLockComponent },
    { path: 'logout', component: LoginComponent },
    { path: ':social/login', component: SocialLoginComponent },
    { path: ':social/callback', component: SocialCallbackComponent },
    { path: 'embed/:alias', component: ShareVideoComponent },
    { path: 'showCampaignVideo/:alias', component: CampaignVideoComponent },
    { path: 'showCampaignEmail/:alias', component: LogRegularCampaignComponent },
    { path: 'company-page/:alias', component: CompanyPageComponent },
    { path: 'partner-page/:alias', component: CompanyPageComponent },
    { path: 'loge/:alias', component: LogEmailClickComponent },
    { path: 'log/unsubscribe-user', component: LogUnsubscribeComponent },
    { path: 'su', component: ServiceUnavailableComponent },
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
