import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CommonComponentModule } from '../common/common.module';
import { VideosRoutingModule } from './videos-routing.module';

import { ManageVideoComponent } from './manage-video/manage-video.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { EditVideoComponent } from './manage-video/edit-video/edit-video.component';
import { PlayVideoComponent } from './manage-video/play-video/play-video.component';
import { VideoBasedReportsComponent } from './manage-video/video-based-reports/video-based-reports.component';
import { VideoBaseReportService } from './services/video-base-report.service';
import { ChartReportComponent } from './manage-video/video-based-reports/chart-report/chart-report.component';
import { ContentManagementModule } from 'app/content-management/content-management.module';

@NgModule({
  imports: [SharedModule, VideosRoutingModule, CommonComponentModule, ContentManagementModule],
  declarations: [ManageVideoComponent, UploadVideoComponent,
    EditVideoComponent, PlayVideoComponent, VideoBasedReportsComponent, ChartReportComponent],
  providers: [VideoBaseReportService]

})
export class VideosModule { }
