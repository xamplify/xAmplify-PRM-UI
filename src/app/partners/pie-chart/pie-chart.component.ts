import { Component, OnInit, Input } from '@angular/core';
import { ParterService } from '../services/parter.service';
declare var Highcharts: any;
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent implements OnInit {
  @Input() customerId: number;
  constructor(public parterService: ParterService) { }

  constructPieChart(pieChartData: any){
      console.log(this.customerId);
   Highcharts.chart('pie'+this.customerId, {
       chart: {
           plotBackgroundColor: null,
           plotBorderWidth: null,
           plotShadow: false,
           type: 'pie'
       },
       title: {
           text: ''
       },
       tooltip: {
           pointFormat: '{series.name}: <b>{point.percentage}%</b>'
       },
       plotOptions: {
           pie: {
               allowPointSelect: true,
               cursor: 'pointer',
               dataLabels: {
                   enabled: false
               },
               showInLegend: false
           }
       },
       exporting: {enabled: false},
       credits: {enabled: false},
       colors: ['#909', '#dc3912', '#dc3912'],
       series: [{
           name: 'Count',
           colorByPoint: true,
           data: pieChartData
       }]
   });      
  }
  
  launchedCampaignsCountGroupByCampaignType() {
      var pieChartData;
      this.parterService.launchedCampaignsCountGroupByCampaignType(this.customerId).subscribe(
        (data: any) => {
          console.log(data.REGULAR);
          console.log(data.VIDEO);
          pieChartData = [{name: 'VIDEO', y: data.VIDEO}, {name: 'REGULAR', y: data.REGULAR},{name: 'SOCIAL', y: data.SOCIAL}];
        },
        (error: any) => { console.log('error got here') },
        () => this.constructPieChart(pieChartData)
      );
    }
  
  ngOnInit() {
      this.launchedCampaignsCountGroupByCampaignType();
  }

}
