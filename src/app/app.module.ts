import { NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ShareButtonsModule } from 'ngx-sharebuttons';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';

import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppRoutingModule } from './app-routing.module';
import { ErrorPagesModule } from './error-pages/error-pages.module';

import { AppComponent } from './app.component';
// import { Logger, Options } from 'angular2-logger/core';
import { SocialLoginComponent } from './social/common/social-login/social-login.component';
import { SocialCallbackComponent } from './social/common/social-callback/social-callback.component';
import { ShareVideoComponent } from './videos/share-video/share-video.component';
import { CampaignVideoComponent } from './videos/campaign-video/campaign-video.component';

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


@NgModule({
    declarations: [AppComponent, SocialLoginComponent, SocialCallbackComponent, ShareVideoComponent,
        CampaignVideoComponent, LogEmailClickComponent, LogUnsubscribeComponent, LogRegularCampaignComponent, RsvpComponent
    ],
    imports: [BrowserAnimationsModule, BrowserModule, FormsModule, HttpModule, HttpClientModule, HttpClientJsonpModule,
        AppRoutingModule, DashboardModule, CoreModule, AuthenticationModule, ReactiveFormsModule, CommonModule, ShareButtonsModule.forRoot(),
        Ng2DeviceDetectorModule.forRoot(), ErrorPagesModule],
    providers: [{
        provide: Http,
        useFactory: httpService,
        deps: [XHRBackend, RequestOptions, SlimLoadingBarService]
    }, { provide: LoggerService, useClass: ConsoleLoggerService },
        AuthenticationService, UtilService, UserService, LogService, PagerService, ReferenceService, SocialService,
        TwitterService, FacebookService, XtremandLogger, VideoUtilService,ParterService,
        VideoFileService, UploadCloudvideoService, ContactService, EmailTemplateService, CampaignService],
    bootstrap: [AppComponent]

})
export class AppModule { }

export function httpService(backend: XHRBackend, options: RequestOptions, slimLoadingBarService: SlimLoadingBarService) {
    return new HttpService(backend, options, slimLoadingBarService);
}
