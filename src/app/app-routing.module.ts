import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthGuardService } from './auth-guard.service';
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
import { FormPreviewComponent } from './forms/preview/form-preview.component';
import { ShowLandingPageComponent } from './landing-pages/show-landing-page/show-landing-page.component';
import { RequestDemoComponent } from './authentication/request-demo/request-demo.component';
import { AccessAccountComponent } from './authentication/access-account/access-account.component';
import { DownloadTemplateComponent } from './campaigns/download-template/download-template.component';
import { PublicPageResponseComponent } from 'app/common/public-page-response/public-page-response.component';
import { SamlsecurityauthComponent } from './authentication/samlsecurityauth/samlsecurityauth.component';
import { VanitySocialLoginComponent } from 'app/social/common/vanity-social-login/vanity-social-login.component';
import { DomainErrorComponent } from './vanity-url/pages/domain-error/domain-error.component';
import { VanityAddContactsComponent } from './contacts/vanity-add-contacts/vanity-add-contacts.component';
import { VanitySynchronizeContactsComponent } from './contacts/vanity-synchronize-contacts/vanity-synchronize-contacts.component';
import { VanitySocialContactsCallbackComponent } from './vanity-social-contacts-callback/vanity-social-contacts-callback.component';
import { LogoutComponent } from 'app/authentication/logout/logout.component';
import {SelectContentModulesComponent} from 'app/core/select-content-modules/select-content-modules.component';
import { UnauthorizedPageComponent } from './error-pages/unauthorized-page/unauthorized-page.component';
import { CustomSkinComponent } from './dashboard/user-profile/custom-skin/custom-skin.component';
import { DevicesInfoComponent } from './azuga/devices-info/devices-info.component';
import { MaintenanceComponent } from './authentication/maintenance/maintenance.component';
import { PreviewLoginComponent } from './common/preview-login/preview-login.component';


export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'home/contacts/google-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/contacts/zoho-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/contacts/salesforce-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/assignleads/google-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/assignleads/zoho-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/assignleads/salesforce-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/partners/google-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/partners/zoho-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/partners/salesforce-callback', component: VanitySocialContactsCallbackComponent },
    { path: 'home/dashboard/hubspot-callback', component: VanitySocialContactsCallbackComponent },
	{ path: 'home/dashboard/isalesforce-callback', component: VanitySocialContactsCallbackComponent },
	{ path: 'home/dashboard/microsoft-callback', component: VanitySocialContactsCallbackComponent },
    
	{ path: 'logout', component: LogoutComponent },
	{ path: 'expired', component: LogoutComponent },
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
			{ path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule', data: { preload: true } },
			{ path: 'emailtemplates', loadChildren: 'app/email-template/email-template.module#EmailTemplateModule', data: { preload: true } },
			{ path: 'content', loadChildren: 'app/videos/videos.module#VideosModule', data: { preload: true } },
			{ path: 'social', loadChildren: 'app/social/social.module#SocialModule', data: { preload: true } },
			{ path: 'twitter', loadChildren: 'app/social/twitter/twitter.module#TwitterModule', data: { preload: true } },
			{ path: 'rss', loadChildren: 'app/social/rss/rss.module#RssModule', data: { preload: true } },
			{ path: 'contacts', loadChildren: 'app/contacts/contacts.module#ContactsModule', data: { preload: true } },
			{ path: 'assignleads', loadChildren: 'app/contacts/contacts.module#ContactsModule', data: { preload: true } },
			{ path: 'sharedleads', loadChildren: 'app/contacts/contacts.module#ContactsModule', data: { preload: true } },
			{ path: 'partners', loadChildren: 'app/partners/partners.module#PartnersModule', data: { preload: true } },
			{ path: 'campaigns', loadChildren: 'app/campaigns/campaigns.module#CampaignsModule', data: { preload: true } },
			{ path: 'upgrade', loadChildren: 'app/upgrade/upgrade.module#UpgradeModule', data: { preload: true } },
			{ path: 'team', loadChildren: 'app/team/team-member.module#TeamMemberModule', data: { preload: true } },
			{ path: 'deals', loadChildren: 'app/deal-registration/deal-registration.module#DealRegistrationModule', data: { preload: true } },
			{ path: 'forms', loadChildren: 'app/forms/forms.module#FormsModule', data: { preload: true } },
			{ path: 'pages', loadChildren: 'app/landing-pages/landing-pages.module#LandingPagesModule', data: { preload: true } },
			{ path: 'design', loadChildren: 'app/design/design.module#DesignModule', data: { preload: true } },
			{ path: 'mdf', loadChildren: 'app/mdf/mdf.module#MdfModule', data: { preload: true } },
			{ path: 'dam', loadChildren: 'app/dam/dam.module#DamModule', data: { preload: true } },
			{ path: 'leads', loadChildren: 'app/leads/leads.module#LeadsModule',  data: { preload: true } },
			{ path: 'deal', loadChildren: 'app/deals/deals.module#DealsModule', data: { preload: true } },
			{ path: 'company', loadChildren: 'app/company/company.module#CompanyModule', data: { preload: true } },
			{ path: 'tracks', loadChildren: 'app/lms/lms.module#LmsModule',  data: { preload: true } },
			{ path: 'playbook', loadChildren: 'app/play-book/play-book.module#PlayBookModule',  data: { preload: true } },
			{ path: 'select-modules', component: SelectContentModulesComponent, data: { preload: true }},
			/*******XNFR-83*******/
			{ path: 'agency', loadChildren: 'app/agency/agency.module#AgencyModule',  data: { preload: true } },
			/*******XNFR-83*******/
			{ path: 'azuga', loadChildren: 'app/azuga/azuga.module#AzugaModule',  data: { preload: true } },
			{ path: 'help', loadChildren: 'app/guides/guides.module#GuidesModule',  data: { preload: true } },
			{ path: 'error/:errorStatusId', component: ErrorPagesComponent, data: { preload: true } }
		]
	},
	{ path: 'terms-conditions', component: TermsConditonComponent },
	{ path: 'privacy-policy', component: TermsConditonComponent },
	{ path: 'userlock', component: ProfileLockComponent },
	{ path: 'logout', component: LoginComponent },
	{ path: ':social/login', component: SocialLoginComponent },
	{ path: ':social/callback', component: SocialCallbackComponent },
	{ path: 'v/:socialProvider/:vud', component: VanitySocialLoginComponent },
	{ path: 'v/:socialProvider/:userId/:vud', component: VanitySocialLoginComponent },	
	{ path: 'v/:socialProvider/:vanityUserId/:vanityUserAlias/:currentModule/:redirectURL', component: VanityAddContactsComponent },
	{ path: 'syn/:socialProvider/:vanityUserId/:vanityUserAlias/:currentModule', component: VanitySynchronizeContactsComponent },
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
	{ path: 'f/:alias', component: FormPreviewComponent },
	{ path: 'l/:alias/:seoName', component: ShowLandingPageComponent },
	{ path: 'pl/:alias/:seoName', component: ShowLandingPageComponent },
	{ path: 'l/:alias', component: ShowLandingPageComponent },
	{ path: 'pl/:alias', component: ShowLandingPageComponent },
	{ path: 'vjpl/:alias', component: ShowLandingPageComponent },
	{ path: 'showCampaignLandingPage/:alias', component: ShowLandingPageComponent },
	{ path: 'scp/:alias', component: ShowLandingPageComponent },
	{ path: 'clpl/:alias', component: ShowLandingPageComponent },
	{ path: 'requestdemo', component: RequestDemoComponent },
	{ path: 'axAa/:alias', component: AccessAccountComponent },
	{ path: 'tSignUp/:companyProfileName', component: AccessAccountComponent },
	{ path: 'download/:type', component: DownloadTemplateComponent },
	{ path: 'samlsecurity/:alias', component: SamlsecurityauthComponent },
	{ path: 'au/:alias/:moduleToRedirect', component: SamlsecurityauthComponent },
	{ path: 'vanity-domain-error', component: DomainErrorComponent },
	{ path: 'maintenance', component: MaintenanceComponent },
	/*** XNFR-416 *****/
	{ path: 'login/preview', component: PreviewLoginComponent},
	/*** XNFR-416 *****/
	{ path: '404', component: PageNotFoundComponent },
	{ path: '401', component: UnauthorizedPageComponent },
	{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: AppCustomPreloader })
	],
	exports: [RouterModule],
	providers: [AppCustomPreloader]
})
export class AppRoutingModule { }
