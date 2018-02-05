import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { PaginationComponent } from './pagination/pagination.component';
import { WorldmapComponent } from './worldmap/worldmap.component';
import { TrellisChartComponent } from './trellis-chart/trellis-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DonutChartComponent, PaginationComponent, WorldmapComponent, TrellisChartComponent, BarChartComponent],
  exports: [DonutChartComponent, PaginationComponent, WorldmapComponent, TrellisChartComponent, BarChartComponent]
})
export class CommonComponentModule { }
