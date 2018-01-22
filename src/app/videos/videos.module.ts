import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { VideosRoutingModule } from './videos-routing.module';
import { ManageVideoComponent } from './manage-video/manage-video.component';
import { PlayStreamerComponent } from './play-streamer/play-streamer.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { UserVideoComponent } from './user-video/user-video.component';
import { EditVideoComponent } from './manage-video/edit-video/edit-video.component';
import { PlayVideoComponent } from './manage-video/play-video/play-video.component';
import { VideoBasedReportsComponent } from './manage-video/video-based-reports/video-based-reports.component';
import { VideoBaseReportService } from './services/video-base-report.service';
import { ChartReportComponent } from './manage-video/video-based-reports/chart-report/chart-report.component';

@NgModule({
  imports: [SharedModule, VideosRoutingModule],
  declarations: [ManageVideoComponent, PlayStreamerComponent, UploadVideoComponent, UserVideoComponent,
    EditVideoComponent, PlayVideoComponent, VideoBasedReportsComponent, ChartReportComponent],
  providers: [VideoBaseReportService]

})
export class VideosModule { }
