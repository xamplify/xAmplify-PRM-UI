import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { PaginationComponent } from './pagination/pagination.component';
import { WorldmapComponent } from './worldmap/worldmap.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { EmbedModalComponent } from './embed-modal/embed-modal.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { LocationComponent } from './location/location.component';
import { PlatformComponent } from './platform/platform.component';
import { ResponseMessageComponent } from './response-message/response-message.component';
import { PreviewVideoComponent } from './preview-video/preview-video.component';
import { ContactsCampaignsMailsComponent } from './contacts-campaigns-mails/contacts-campaigns-mails.component';
import { PieChartComponent } from '../partners/pie-chart/pie-chart.component';
import { ListLoaderComponent } from './loader/list-loader/list-loader.component';
import { PlayVideoLoaderComponent } from './loader/play-video-loader/play-video-loader.component';
import { GridLoaderComponent } from './loader/grid-loader/grid-loader.component';
import { ExportCsvComponent } from './export/export-csv/export-csv.component';
import { LoadingModule } from 'ngx-loading';
import { AnalyticsLoaderComponent } from './loader/analytics-loader/analytics-loader.component';
import { VideoThumbnailComponent } from './video-thumbnail/video-thumbnail.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { TimestampComponent } from './timestamp/timestamp.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { SaveAsComponent } from './save-as/save-as.component';
import { TimestampNewComponent } from './timestamp-new/timestamp.component';
import { EventSendReminderComponent } from './event-send-reminder/event-send-reminder.component';
import { VideoPlayComponent } from './video-play/video-play.component';
import { ImageCropperComponent } from './image-cropper/component/image-cropper.component';
import { EmailSpamCheckComponent } from '../email-template/email-spam-check/email-spam-check.component';
import { AutoResponseLoaderComponent } from './loader/auto-response-loader/auto-response-loader.component';
import { PreviewPopupComponent } from '../forms/preview-popup/preview-popup.component';
import { PreviewLandingPageComponent } from '../landing-pages/preview-landing-page/preview-landing-page.component';

import {FormPreviewComponent} from '../forms/preview/form-preview.component';

import { LandingPageLoaderComponent } from '../landing-page-loader/landing-page-loader.component';
import { DashboardLoaderComponent } from './loader/dashboard-loader/dashboard-loader.component';
import { ModalPopupLoaderComponent } from './loader/modal-popup-loader/modal-popup-loader.component';
import { FormAnalyticsUtilComponent } from '../util/form-analytics-util/form-analytics-util.component';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { PublicPageResponseComponent } from './public-page-response/public-page-response.component';


@NgModule({
    imports: [CommonModule, FormsModule, LoadingModule,MultiSelectAllModule,CheckBoxModule, ButtonModule],
    declarations: [DonutChartComponent, PaginationComponent, WorldmapComponent, PieChartComponent,
        BarChartComponent, EmbedModalComponent, EmbedModalComponent, UserInfoComponent, LocationComponent,
        PlatformComponent, ResponseMessageComponent, PreviewVideoComponent, ContactsCampaignsMailsComponent, ListLoaderComponent,
        PlayVideoLoaderComponent, GridLoaderComponent, ExportCsvComponent, AnalyticsLoaderComponent, VideoThumbnailComponent,
        DetailViewComponent, TimestampComponent, ScrollTopComponent, SaveAsComponent,
        TimestampNewComponent, VideoPlayComponent, EventSendReminderComponent, ImageCropperComponent, EmailSpamCheckComponent, AutoResponseLoaderComponent,PreviewPopupComponent,
        PreviewLandingPageComponent, FormPreviewComponent,LandingPageLoaderComponent, DashboardLoaderComponent, 
        ModalPopupLoaderComponent,FormAnalyticsUtilComponent, PublicPageResponseComponent],


    exports: [DonutChartComponent, PaginationComponent, WorldmapComponent, ContactsCampaignsMailsComponent,
        BarChartComponent, EmbedModalComponent, UserInfoComponent, LocationComponent, PlatformComponent,ImageCropperComponent,
        ResponseMessageComponent, PreviewVideoComponent, PieChartComponent, ListLoaderComponent, GridLoaderComponent, PlayVideoLoaderComponent,
        ExportCsvComponent, LoadingModule, AnalyticsLoaderComponent, VideoThumbnailComponent, DetailViewComponent, TimestampComponent,

        ScrollTopComponent, SaveAsComponent, TimestampNewComponent, VideoPlayComponent, EventSendReminderComponent, EmailSpamCheckComponent,AutoResponseLoaderComponent,PreviewPopupComponent,
        PreviewLandingPageComponent, FormPreviewComponent,LandingPageLoaderComponent,DashboardLoaderComponent,ModalPopupLoaderComponent,FormAnalyticsUtilComponent]

})
export class CommonComponentModule { }
