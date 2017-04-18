import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import {ShareButtonsModule} from "ng2-sharebuttons";
import {ContactService } from './contacts/contact.service';


import { ChartModule } from 'angular2-highcharts';

import {CoreModule} from './core/core.module';
import {DashboardModule} from './dashboard/dashboard.module';

import {AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { Logger } from "angular2-logger/core";
import { LoginComponent } from './login/login.component';

import {TwitterService} from './social/services/twitter.service';
import {FacebookService} from './social/services/facebook.service';
import {SocialService} from './social/services/social.service';
import { UserService } from './core/services/user.service';
import {VideoFileService} from './videos/services/video-file.service';
import {UploadCloudvideoService} from './videos/services/upload-cloudvideo.service';

@NgModule({
    declarations: [AppComponent,LoginComponent],
  imports: [ BrowserModule, FormsModule, HttpModule, AppRoutingModule, DashboardModule, 
             CoreModule, ReactiveFormsModule, CommonModule, ShareButtonsModule.forRoot(),
             ChartModule],
  providers: [ UserService, SocialService, TwitterService, FacebookService, Logger,
               VideoFileService,UploadCloudvideoService,ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
