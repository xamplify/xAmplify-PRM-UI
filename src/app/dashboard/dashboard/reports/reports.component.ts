import { Component, OnInit } from '@angular/core';
declare var $: any;
import { ReferenceService } from '../../../core/services/reference.service';
// import { UtilService } from '../../../core/services/util.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  resultSparkline: any;
  viewsDate:string;
  viewsValue:number;
  constructor(public referenceService: ReferenceService) {
    this.resultSparkline = this.referenceService.viewsSparklineValues;
    console.log(this.resultSparkline);
    this.viewsDate = this.referenceService.viewsDate;
    this.viewsValue = this.referenceService.clickedValue;
    console.log('views date is '+this.viewsDate +'value is '+ this.viewsValue);
   }
  viewsSparklineData() {
    const myvalues = this.resultSparkline.views;
    const offsetValues = this.resultSparkline.dates;
    // const myvalues = this.referenceService.viewsSparklineValues;
    // const offsetValues = this.referenceService.viewsOffsetValues;
    // console.log(myvalues);
    // console.log(offsetValues);
    $('#sparkline_bar_chart1').sparkline(myvalues, {
      type: 'bar',
      width: '200',
      barWidth: 5,
      height: '85',
      barColor: '#35aa47',
      negBarColor: '#e02222',
      tooltipFormat: '<span >views:{{value}} <br>{{offset:offset}}</span>',
      tooltipValueLookups: { 'offset': offsetValues }
    });
    $(document).ready(function () {
      $('#sparkline_bar_chart1').bind('sparklineClick', function (ev) {
        const sparkline = ev.sparklines[0],
          region = sparkline.getCurrentRegionFields();
          alert("Clicked on offset=" + offsetValues[region[0].offset] + " having value=" + region[0].value);
      });
    });
  }
  ngOnInit() {
    console.log(this.referenceService.viewsSparklineValues);
    // console.log(this.utilService.barChartInfoObj)
    this.viewsSparklineData();
  }

}
