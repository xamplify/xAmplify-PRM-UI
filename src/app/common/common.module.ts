import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { PaginationComponent } from './pagination/pagination.component';
import { WorldmapComponent } from './worldmap/worldmap.component';
import { TrellisChartComponent } from './trellis-chart/trellis-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { EmbedModalComponent } from './embed-modal/embed-modal.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { LocationComponent } from './location/location.component';
import { PlatformComponent } from './platform/platform.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DonutChartComponent, PaginationComponent, WorldmapComponent,
     TrellisChartComponent, BarChartComponent, EmbedModalComponent, EmbedModalComponent, UserInfoComponent, LocationComponent, PlatformComponent],
  exports: [DonutChartComponent, PaginationComponent, WorldmapComponent, TrellisChartComponent,
     BarChartComponent, EmbedModalComponent, UserInfoComponent, LocationComponent, PlatformComponent]
})
export class CommonComponentModule { }
