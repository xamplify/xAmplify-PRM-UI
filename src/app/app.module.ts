import { NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { LoadingModule } from 'ngx-loading';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppRoutingModule } from './app-routing.module';
import { ErrorPagesModule } from './error-pages/error-pages.module';
import { AppComponent } from './app.component';
import { SocialLoginComponent } from './social/common/social-login/social-login.component';
import { SocialCallbackComponent } from './social/common/social-callback/social-callback.component';
import { ShareVideoComponent } from './videos/share-video/share-video.component';
import { CampaignVideoComponent } from './videos/campaign-video/campaign-video.component';
import { RssService } from './social/services/rss.service';
import { TwitterService } from './social/services/twitter.service';
import { FacebookService } from './social/services/facebook.service';
import { SocialService } from './social/services/social.service';
import { UserService } from './core/services/user.service';
import { LogService } from './core/services/log.service';
import { HttpService } from './core/services/http.service';
import { UtilService } from './core/services/util.service';
import { VideoFileService } from './videos/services/video-file.service';
import { UploadCloudvideoService } from './videos/services/upload-cloudvideo.service';
import { ReferenceService } from './core/services/reference.service';
import { PagerService } from './core/services/pager.service';
import { EmailTemplateService } from './email-template/services/email-template.service';
import { EmailSpamCheckService } from './email-template/services/email-spam-check.service';
import { CampaignService } from './campaigns/services/campaign.service';
import { AuthenticationService } from './core/services/authentication.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { VideoUtilService } from './videos/services/video-util.service';
import { ContactService } from './contacts/services/contact.service';
import { ParterService } from './partners/services/parter.service';
// logger services

import { LoggerService } from './error-pages/services/logger.service';
import { ConsoleLoggerService } from './error-pages/services/console-logger.service';
import { XtremandLogger } from './error-pages/xtremand-logger.service';

import { LogEmailClickComponent } from './campaigns/log-email-click/log-email-click.component';
import { LogUnsubscribeComponent } from './campaigns/log-unsubscribe/log-unsubscribe.component';
import { LogRegularCampaignComponent } from './campaigns/log-regular-campaign/log-regular-campaign.component';
import { RsvpComponent } from './campaigns/rsvp/rsvp.component';
import { EnvServiceProvider } from './env.service.provider';
import { LogRegularCampaignComponentSMS } from './campaigns/log-regular-campaign-sms/log-regular-campaign-sms.component';
import { CampaignSMSVideoComponent } from './videos/campaign-sms-video/campaign-sms-video.component';
import { LogEventCampaignComponentSMS } from './campaigns/log-event-campaign-sms/log-event-campaign-sms.component';
import { LogSMSClickComponent } from './campaigns/log-sms-click/log-sms-click.component';
//import {FormPreviewComponent} from './forms/preview/form-preview.component';
import { ShowLandingPageComponent } from './landing-pages/show-landing-page/show-landing-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { CommonComponentModule } from 'app/common/common.module';
import { HubSpotService } from './core/services/hubspot.service';
import { DownloadTemplateComponent } from './campaigns/download-template/download-template.component';
import { IntegrationService } from './core/services/integration.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { VanityURLService } from './vanity-url/services/vanity.url.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { VanitySocialLoginComponent } from 'app/social/common/vanity-social-login/vanity-social-login.component';
import { DomainErrorComponent } from './vanity-url/pages/domain-error/domain-error.component';
import { NoCacheHeadersInterceptor } from './core/no-cache-provider';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VanityAddContactsComponent } from './contacts/vanity-add-contacts/vanity-add-contacts.component';
import { VanitySynchronizeContactsComponent } from './contacts/vanity-synchronize-contacts/vanity-synchronize-contacts.component';
import {ClearChunkFile} from 'app/core/clear-chunk-file';
import { ErrorHandler } from '@angular/core';
import { VanitySocialContactsCallbackComponent } from './vanity-social-contacts-callback/vanity-social-contacts-callback.component';
import { LinkedinService } from './social/services/linkedin.service';
import { DatePipe } from '@angular/common';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UploadImageUtilComponent } from './util/upload-image-util/upload-image-util.component';



@NgModule({
    declarations: [AppComponent, SocialLoginComponent, SocialCallbackComponent, ShareVideoComponent,
        CampaignVideoComponent, LogEmailClickComponent, LogUnsubscribeComponent, LogRegularCampaignComponent, RsvpComponent
        , LogRegularCampaignComponentSMS, CampaignSMSVideoComponent, RsvpComponent, LogEventCampaignComponentSMS,
        LogSMSClickComponent, ShowLandingPageComponent, PageNotFoundComponent, DownloadTemplateComponent, VanitySocialLoginComponent, DomainErrorComponent,
        VanityAddContactsComponent, VanitySynchronizeContactsComponent, VanitySocialContactsCallbackComponent, ConfirmationComponent, UploadImageUtilComponent
    ],

    imports: [BrowserAnimationsModule, BrowserModule, FormsModule, HttpModule, HttpClientModule, HttpClientJsonpModule,
        AppRoutingModule, DashboardModule, CoreModule, AuthenticationModule, ReactiveFormsModule, CommonModule, ShareButtonsModule.forRoot(),
        Ng2DeviceDetectorModule.forRoot(), ErrorPagesModule, LoadingModule, CommonComponentModule, NgIdleKeepaliveModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ModalModule.forRoot()],
        entryComponents: [ConfirmationComponent], // Only when using old ViewEngine
    providers: [{
        provide: Http,
        useFactory: httpService,
        deps: [XHRBackend, RequestOptions, SlimLoadingBarService,Router]
    }, { provide: LoggerService, useClass: ConsoleLoggerService },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: NoCacheHeadersInterceptor,
        multi: true
    },
	{provide: ErrorHandler, useClass: ClearChunkFile},
        AuthenticationService, UtilService, UserService, LogService, PagerService, ReferenceService, SocialService, RssService,
        TwitterService, FacebookService, XtremandLogger, VideoUtilService, ParterService,
        VideoFileService, UploadCloudvideoService, ContactService, EmailTemplateService, EmailSpamCheckService, CampaignService, EnvServiceProvider, HubSpotService, Title, IntegrationService,
        VanityURLService,LinkedinService,DatePipe],
    bootstrap: [AppComponent]

})
export class AppModule { }

export function httpService(backend: XHRBackend, options: RequestOptions, slimLoadingBarService: SlimLoadingBarService,router:Router) {
    return new HttpService(backend, options, slimLoadingBarService,router);
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
