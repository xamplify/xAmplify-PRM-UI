import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
declare var Highcharts: any;
@Component({
  selector: 'app-pie-chart-analytics',
  templateUrl: './pie-chart-analytics.component.html',
  styleUrls: ['./pie-chart-analytics.component.css']
})
export class PieChartAnalyticsComponent implements OnInit {
  pieChartData: Array<any> = new Array<any>();
  pieChartStatisticsData:Array<any> =new Array<any>();
 
  loader = false;
  statusCode = 200;
  @Input()applyFilter:boolean;
  funnelChartsAnalyticsData:any;
  name:any;
  constructor(public authenticationService: AuthenticationService, public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger,
    public router: Router) { }

  ngOnInit() {
    this.loadDealPieChart();
  }
  click(){
    this.loadDealPieChart();
  }
  leads(){
    this.loadLeadPieChart();
  }
  loadStatisticsLeadData(){
    this.loader = true;
this.dashboardService.getPieChartStatisticsLeadAnalyticsData(true).subscribe(
  (response) =>{
    this.pieChartStatisticsData=response.data;
    this.loader =false;
  }
)
  }
  
 loadLeadPieChart(){
   this.name="Opportunity Based Lead Stats";
this.loader = true;
this.dashboardService.getPieChartLeadsAnalyticsData(true).subscribe(
  (response)=>{
    this.pieChartData=response.data;
  
  this.loader = false;
  this.loadChart(this.pieChartData);
  this.loadStatisticsLeadData();
},
(error) => {
  this.xtremandLogger.error(error);
  this.loader = false;
  this.statusCode = 0;
}
);
}
loadDealPieChart(){
  this.name="Opportunity Based Deal Stats"; 
  this.loader = true;
  this.dashboardService.getPieChartDealsAnalyticsData(true).subscribe(
    (response)=>{
      this.pieChartData=response.data;
    
    this.loader = false;
    this.loadChart(this.pieChartData);
  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  }
  );
}
  loadChart(pieChartData:any){
    let self=this;
    Highcharts.chart('container', {
      chart: {
          type: 'pie',
          options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
          }
      },
      title: {
          text: ''
      },
      accessibility: {
          point: {
      
          }
      },
      tooltip: {
          pointFormat: '<b>{series.name}</b>:<b></b> ({point.y})'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                  enabled: true,
                  format: '{point.name}'
              }
          }
      },
      series: [{
          type: 'pie',
          name: 'count',
          data: this.pieChartData,
      },],
  });
  }
}
