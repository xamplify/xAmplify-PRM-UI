import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';

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
// import { IntroComponent } from './authentication/intro/intro.component';
import { TermsConditonComponent } from 'app/authentication/terms-conditon/terms-conditon.component';
import { RsvpComponent } from './campaigns/rsvp/rsvp.component';
import { LogRegularCampaignComponentSMS } from './campaigns/log-regular-campaign-sms/log-regular-campaign-sms.component';
import { CampaignSMSVideoComponent } from './videos/campaign-sms-video/campaign-sms-video.component';
import { LogEventCampaignComponentSMS } from './campaigns/log-event-campaign-sms/log-event-campaign-sms.component';
import { LogSMSClickComponent } from './campaigns/log-sms-click/log-sms-click.component';
import {FormPreviewComponent} from './forms/preview/form-preview.component';
import { ShowLandingPageComponent } from './landing-pages/show-landing-page/show-landing-page.component';
import { RequestDemoComponent } from './authentication/request-demo/request-demo.component';
import { AccessAccountComponent } from './authentication/access-account/access-account.component';
import { DownloadTemplateComponent } from './campaigns/download-template/download-template.component';
import { PublicPageResponseComponent } from 'app/common/public-page-response/public-page-response.component';
import { SamlsecurityauthComponent } from './authentication/samlsecurityauth/samlsecurityauth.component';
import { VanitySocialLoginComponent } from 'app/social/common/vanity-social-login/vanity-social-login.component';
import { DomainErrorComponent } from './vanity-url/pages/domain-error/domain-error.component';
import { ExpiredAccessTokenLoginComponent } from 'app/contacts/expired-access-token-login/expired-access-token-login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },    
    { path: 'signup', component: SignupComponent },
    { path: 'signup/:alias', component: SignupComponent },
    { path: 'v-signup', component: SignupComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'register/verifyemail/user', component: VerifyEmailComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', redirectTo: 'home/dashboard', pathMatch: 'full' },
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
            { path: 'emailtemplates', loadChildren: 'app/email-template/email-template.module#EmailTemplateModule' },
            { path: 'content', loadChildren: 'app/videos/videos.module#VideosModule', data: { preload: false } },
            { path: 'social', loadChildren: 'app/social/social.module#SocialModule' },
            { path: 'twitter', loadChildren: 'app/social/twitter/twitter.module#TwitterModule' },
            { path: 'rss', loadChildren: 'app/social/rss/rss.module#RssModule' },
            { path: 'contacts', loadChildren: 'app/contacts/contacts.module#ContactsModule', data: { preload: false } },
            { path: 'partners', loadChildren: 'app/partners/partners.module#PartnersModule', data: { preload: false } },
            { path: 'campaigns', loadChildren: 'app/campaigns/campaigns.module#CampaignsModule', data: { preload: false } },
            { path: 'upgrade', loadChildren: 'app/upgrade/upgrade.module#UpgradeModule' },
            { path: 'team', loadChildren: 'app/team/team-member.module#TeamMemberModule' },
            { path: 'deals', loadChildren: 'app/deal-registration/deal-registration.module#DealRegistrationModule' },
            { path: 'forms', loadChildren: 'app/forms/forms.module#FormsModule',  data: { preload: true } },
            { path: 'pages', loadChildren: 'app/landing-pages/landing-pages.module#LandingPagesModule',  data: { preload: true } },
            { path: 'design', loadChildren: 'app/design/design.module#DesignModule',  data: { preload: true } },
 			{ path: 'mdf', loadChildren: 'app/mdf/mdf.module#MdfModule',  data: { preload: false } },
            { path: 'error/:errorStatusId', component: ErrorPagesComponent }
        ]
    },
    { path: 'terms-conditions', component: TermsConditonComponent },
    { path: 'privacy-policy', component: TermsConditonComponent },
    { path: 'userlock', component: ProfileLockComponent },
    { path: 'logout', component: LoginComponent },
    { path: ':social/login', component: SocialLoginComponent },
    { path: ':social/callback', component: SocialCallbackComponent },
    { path: 'v/:socialProvider/:userId/:vud', component: VanitySocialLoginComponent },
    { path: 'e/:socialProvider/:userId/:vud/:accessToken', component: ExpiredAccessTokenLoginComponent },
    { path: 'share/:alias', component: ShareVideoComponent },
    { path: 'embed/:alias', component: ShareVideoComponent },
    { path: 'showCampaignVideo/:alias', component: CampaignVideoComponent },
    { path: 'showCampaignEmail/:alias', component: LogRegularCampaignComponent },
    { path: 'company-page/:alias', component: CompanyPageComponent },
    { path: 'partner-page/:alias', component: CompanyPageComponent },
    { path: 'loge/:alias', component: LogEmailClickComponent },
    { path: 'log/unsubscribe-user', component: LogUnsubscribeComponent },
    { path: 'su', component: ServiceUnavailableComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: 'rsvp/:alias', component: RsvpComponent },
    { path: 'rsvp-response', component: PublicPageResponseComponent },
    { path: 'smsShowCampaign/:alias', component: LogRegularCampaignComponentSMS },
    { path: 'smsCampaignVideo/:alias', component: CampaignSMSVideoComponent },
    { path: 'showEventCampaignSMS/:alias', component: LogEventCampaignComponentSMS },
    { path: 'logs/:alias', component: LogSMSClickComponent },
    {path: 'f/:alias', component:FormPreviewComponent},
    {path: 'l/:alias/:seoName', component:ShowLandingPageComponent},
    {path: 'pl/:alias/:seoName', component:ShowLandingPageComponent},
    {path: 'l/:alias', component:ShowLandingPageComponent},
    {path: 'pl/:alias', component:ShowLandingPageComponent},
    {path: 'showCampaignLandingPage/:alias', component:ShowLandingPageComponent},
    {path: 'scp/:alias', component:ShowLandingPageComponent},
    {path: 'clpl/:alias', component:ShowLandingPageComponent},
    { path: 'requestdemo', component: RequestDemoComponent },
    { path: 'axAa/:alias', component: AccessAccountComponent },
    { path: 'download/:type', component: DownloadTemplateComponent },
    {path: 'samlsecurity/:alias', component:SamlsecurityauthComponent},
    {path: 'au/:alias', component:SamlsecurityauthComponent},    
    {path:'vanity-domain-error', component:DomainErrorComponent},  
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: AppCustomPreloader })
    ],
    exports: [RouterModule],
    providers: [AppCustomPreloader]
})
export class AppRoutingModule { }
