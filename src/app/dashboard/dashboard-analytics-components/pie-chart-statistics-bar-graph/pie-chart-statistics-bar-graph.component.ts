import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
declare var Highcharts: any;
@Component({
  selector: 'app-pie-chart-statistics-bar-graph',
  templateUrl: './pie-chart-statistics-bar-graph.component.html',
  styleUrls: ['./pie-chart-statistics-bar-graph.component.css']
})
export class PieChartStatisticsBarGraphComponent implements OnInit {
  pieChartGraphData: any=[];

  loader = false;
  statusCode = 200;
  @Input()applyFilter:boolean;
  funnelChartsAnalyticsData:any;
  name:any;
  constructor(public authenticationService: AuthenticationService, public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger,
    public router: Router) { }

  ngOnInit() {
    this.loadStatisticsDealDataWithStageNames();
  }
  loadStatisticsDealDataWithStageNames(){
    this.loader = true;
this.dashboardService.getPieChartDealStatisticsWithStageNames(true).subscribe(
  (response) =>{
    this.pieChartGraphData=response.data;
console.log(this.pieChartGraphData)
    this.loader =false;
    this.loadGraph(this.pieChartGraphData)
  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  }
)
  }
   loadGraph(pieChartGraphData:any){
    Highcharts.chart('container1', {
      chart: {
          type: 'bar'
      },
      title: {
          text: ''
      },
      
      xAxis: {
          categories: this.pieChartGraphData.map(t=>t.name),
          title: {
              text: null
          }
      },
      yAxis: {
          min: 0,
          title: {
             // text: 'Population (millions)',
              align: 'high'
          },
          
      },
     
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
      legend: {
        enabled: false
      },
      credits: {
          enabled: false
      },
      series: [{
          name: 'Count',
          data: this.pieChartGraphData.map(t=>t.value),
      }]
  });
   }
  }
