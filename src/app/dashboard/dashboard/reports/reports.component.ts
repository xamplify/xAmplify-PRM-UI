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

  constructor(public referenceService: ReferenceService) { }
  viewsSparklineData() {
    const myvalues = [2, 6, 12, 13, 12, 13, 7, 14, 13, 11, 11, 12, 17, 11, 11, 12, 15, 10];
    const offsetValues = { 0: '12-dec-2017', 1: '13-dec-18', 2: '14-dec-19', 3: '14-dec-19', 4: '14-dec-19' };
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
    console.log(this.referenceService.viewsOffsetValues);
    console.log(this.referenceService.selectedViewsValues);
    // console.log(this.utilService.barChartInfoObj)
    this.viewsSparklineData();
  }

}
