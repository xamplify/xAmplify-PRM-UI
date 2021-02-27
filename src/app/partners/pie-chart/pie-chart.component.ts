import { Component, OnInit, Input } from '@angular/core';
import { ParterService } from '../services/parter.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

declare var Highcharts: any;
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent implements OnInit {
  @Input() partnerCompanyId: number;
  constructor(public parterService: ParterService, public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger) { }

  constructPieChart(pieChartData: any){
   Highcharts.chart('pie'+this.partnerCompanyId, {
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
           pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
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
       colors: ['#ffb600', '#ff3879', '#be72d3', '#357ebd'],
       series: [{
           name: 'Count',
           colorByPoint: true,
           data: pieChartData
       }]
   });      
  }
  
  launchedCampaignsCountGroupByCampaignType() {
      var pieChartData;
      this.parterService.launchedCampaignsCountGroupByCampaignType(this.partnerCompanyId, this.authenticationService.user.id).subscribe(
        (data: any) => {
          pieChartData = [{name: 'VIDEO', y: data.VIDEO}, {name: 'REGULAR', y: data.REGULAR},{name: 'SOCIAL', y: data.SOCIAL},{name: 'EVENT', y: data.EVENT}];
        },
        (error: any) => { 
		this.xtremandLogger.error(error);
		
	},
        () => this.constructPieChart(pieChartData)
      );
    }
  
  ngOnInit() {
      this.launchedCampaignsCountGroupByCampaignType();
  }

}
