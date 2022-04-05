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
  loader = false;
  statusCode = 200;
  @Input()applyFilter:boolean;
  funnelChartsAnalyticsData:any;
  constructor(public authenticationService: AuthenticationService, public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger,
    public router: Router) { }

  ngOnInit() {
    this.loadPieChart();
  }
 loadPieChart(){
 let wonLeads=['won Leads',20]
 let lostLeads=['last Leads',10]
 let convertedLeads=['convertedLeads',10]
 this.pieChartData.push(wonLeads)
 this.pieChartData.push(lostLeads)
 this.pieChartData.push(convertedLeads)
 this.loadChart();
}
  loadChart(){
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
          text: 'Browser market shares at a specific website, 2014'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
          name: 'Browser share',
          data: self.pieChartData
      }]
  });
  }
}
