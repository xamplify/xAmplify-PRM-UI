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

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DonutChartComponent, PaginationComponent, WorldmapComponent,
    BarChartComponent, EmbedModalComponent, EmbedModalComponent, UserInfoComponent, LocationComponent, PlatformComponent, ResponseMessageComponent, PreviewVideoComponent, ContactsCampaignsMailsComponent],
  exports: [DonutChartComponent, PaginationComponent, WorldmapComponent, ContactsCampaignsMailsComponent,
    BarChartComponent, EmbedModalComponent, UserInfoComponent, LocationComponent, PlatformComponent, ResponseMessageComponent, PreviewVideoComponent]
})
export class CommonComponentModule { }
