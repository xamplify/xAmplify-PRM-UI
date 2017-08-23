import { NgModule } from '@angular/core';
import { HashLocationStrategy, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareButtonsModule} from 'ngx-sharebuttons';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { ContactService } from './contacts/services/contact.service';

import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { Logger, Options } from 'angular2-logger/core';
import { LoginComponent } from './login/login.component';
import { SocialLoginComponent } from './social/common/social-login/social-login.component';
import { SocialCallbackComponent } from './social/common/social-callback/social-callback.component';

import { ShareVideoComponent } from './videos/share-video/share-video.component';
import { CampaignVideoComponent } from './videos/campaign-video/campaign-video.component';
import { DummyComponent } from './loader/dummy/dummy.component';

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
import { XtremandLogger } from './error-pages/xtremand-logger.service';

import { ActivateAccountComponent } from './signup/activate-account/activate-account.component';
import { LogEmailClickComponent } from './campaigns/log-email-click/log-email-click.component';
import { ServiceUnavailableComponent } from './error-pages/service-unavailable/service-unavailable.component';
import { PageNotFoundComponent } from './error-pages/page-not-found/page-not-found.component';
import { ErrorPagesComponent } from './error-pages/error-pages.component';
// import { CKEditorModule } from 'ng2-ckeditor';
// import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
@NgModule({
    declarations: [AppComponent, LoginComponent, SocialLoginComponent, SocialCallbackComponent,
        ShareVideoComponent, CampaignVideoComponent, DummyComponent, ActivateAccountComponent,
        LogEmailClickComponent, ServiceUnavailableComponent, PageNotFoundComponent
    ],
    imports: [BrowserAnimationsModule, BrowserModule, FormsModule, HttpModule, AppRoutingModule, DashboardModule,
        CoreModule, ReactiveFormsModule, CommonModule, ShareButtonsModule.forRoot(), Ng2DeviceDetectorModule.forRoot()],
    providers: [{
        provide: Http,
        useFactory: httpService,
        deps: [XHRBackend, RequestOptions, SlimLoadingBarService]
    },
        AuthenticationService, UtilService, UserService, LogService, PagerService, ReferenceService, SocialService,
        TwitterService, FacebookService, Logger, Options, XtremandLogger,
        VideoFileService, UploadCloudvideoService, ContactService, EmailTemplateService, CampaignService],
    bootstrap: [AppComponent]

})
export class AppModule { }

export function httpService(backend: XHRBackend, options: RequestOptions, slimLoadingBarService: SlimLoadingBarService) {
    return new HttpService(backend, options, slimLoadingBarService);
}
