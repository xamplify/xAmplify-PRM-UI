import { Component, OnInit } from '@angular/core';
 declare var Highcharts :any;
@Component({
  selector: 'app-horizontal-bat-chart',
  templateUrl: './horizontal-bat-chart.component.html',
  styleUrls: ['./horizontal-bat-chart.component.css']
})
export class HorizontalBatChartComponent implements OnInit {
  loader =false;
  statusCode =200;
  horizontalBarData =[];
  name:string;
  count:number;
  empList: Array<{name: string, count: number}> = [];
  constructor() { }
  campaign='Campaigns';
  ngOnInit() {
    this.findHorizontalBarChart();
  }

  findHorizontalBarChart(){
    this.loader =false;
    this.statusCode =200;
    this.empList=[{
      name:'Launched',count:5
    },{
      name :'Redistributed',
      count:2
    }]
    this.horizontalBarData.push(this.empList)
    this.loadHorizontalBarChart(this.horizontalBarData);
  }
 loadHorizontalBarChart(horizontalBarData :any){
   this.loader =false;
   this.statusCode=200;
  Highcharts.chart('horizontal-bar-chart-container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Stacked bar chart'
    },
    xAxis: {
        categories: [this.campaign]
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    credits: {
                enabled: false
            },
    series: [{
      name: 'Lunched',
      data: [5]
  }, {
      name: 'Redistributed',
      data: [2]
    },]
});
 }
}
