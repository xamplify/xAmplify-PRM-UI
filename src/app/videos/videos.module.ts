import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SharedModule} from '../shared/shared.module';

import {VideosRoutingModule} from './videos-routing.module';
import { ManageVideoComponent } from './manage-video/manage-video.component';
import { PlayStreamerComponent } from './play-streamer/play-streamer.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { UserVideoComponent } from './user-video/user-video.component';
import { EditVideoComponent } from './manage-video/edit-video/edit-video.component';
import { PlayVideoComponent } from './manage-video/play-video/play-video.component';
import { CampaignReportVideoComponent } from './manage-video/campaign-report-video/campaign-report-video.component';
import { ShareVideoComponent } from './share-video/share-video.component';


@NgModule({
  imports: [  CommonModule,SharedModule,VideosRoutingModule,FormsModule,ReactiveFormsModule ],
  declarations: [ManageVideoComponent, PlayStreamerComponent, UploadVideoComponent, UserVideoComponent,
                 EditVideoComponent, PlayVideoComponent, CampaignReportVideoComponent, ShareVideoComponent]
})
export class VideosModule { }
