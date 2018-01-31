import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonutChartComponent } from './donut-chart/donut-chart.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [DonutChartComponent ],
  exports : [DonutChartComponent]
})
export class CommonComponentModule { }
