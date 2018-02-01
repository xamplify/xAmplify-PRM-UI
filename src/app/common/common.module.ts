import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [DonutChartComponent, PaginationComponent ],
  exports : [DonutChartComponent, PaginationComponent]
})
export class CommonComponentModule { }
