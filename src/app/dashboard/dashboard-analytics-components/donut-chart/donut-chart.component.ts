import { Component, OnInit } from '@angular/core';
declare var Highcharts: any;
@Component({
  selector: 'app-donut-charts',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {
  loader = false;
  statusCode = 200;
  donutData:Array<any>=[]
  constructor() { }

  ngOnInit() {
    this.findDonutChart();
  }

  findDonutChart(){
    this.loader =false;
    this.statusCode =200;
    this.donutData =[['Active', 237],
    ['InActive', 807]]
    this.loadDonutChart(this.donutData);
  }
loadDonutChart(donutData :any){
  this.loader =false;
  this.statusCode =200;

  Highcharts.chart('donut-chart-container', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: false,
            alpha: 45
        }
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45
        }
    },credits: {
                enabled: false
            },
    series: [{
        name: 'Count',
        data: this.donutData
    }]
});
}
}
