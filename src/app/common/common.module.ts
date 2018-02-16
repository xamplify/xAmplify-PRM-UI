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

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DonutChartComponent, PaginationComponent, WorldmapComponent,
     TrellisChartComponent, BarChartComponent, EmbedModalComponent, EmbedModalComponent, UserInfoComponent],
  exports: [DonutChartComponent, PaginationComponent, WorldmapComponent, TrellisChartComponent,
     BarChartComponent, EmbedModalComponent, UserInfoComponent]
})
export class CommonComponentModule { }
