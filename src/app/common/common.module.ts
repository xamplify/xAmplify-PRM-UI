import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { PaginationComponent } from './pagination/pagination.component';
import { WorldmapComponent } from './worldmap/worldmap.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [DonutChartComponent, PaginationComponent, WorldmapComponent ],
  exports : [DonutChartComponent, PaginationComponent, WorldmapComponent]
})
export class CommonComponentModule { }
