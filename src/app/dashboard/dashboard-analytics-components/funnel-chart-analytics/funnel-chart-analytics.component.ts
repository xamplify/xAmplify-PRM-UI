import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var Highcharts: any;

@Component({
  selector: 'app-funnel-chart-analytics',
  templateUrl: './funnel-chart-analytics.component.html',
  styleUrls: ['./funnel-chart-analytics.component.css'],
  providers: [Properties]
})
export class FunnelChartAnalyticsComponent implements OnInit {
  funnelChartData: Array<any> = new Array<any>();
  loader = false;
  statusCode = 200;
  @Input()applyFilter:boolean;
  constructor(public authenticationService: AuthenticationService, public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger) { }


  ngOnInit() {
      this.loader = true;
      let leads = ['Leads',1000];
      let deals = ['Deals',500];
      let contacts = ['Contacts',200];
      this.funnelChartData.push(leads);
      this.funnelChartData.push(deals);
      this.funnelChartData.push(contacts);
      this.loader = false;
      this.loadChart();
  }

  loadChart(){
      let self = this;
      Highcharts.chart('funnel-chart-container', {
        chart: {
            type: 'funnel3d',
            options3d: {
                enabled: true,
                alpha: 10,
                depth: 50,
                viewDistance: 50
            }
        },
        title: {
            text: 'Highcharts Funnel3D Chart'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y})',
                    allowOverlap: true,
                    y: 10
                },
                neckWidth: '30%',
                neckHeight: '25%',
                width: '80%',
                height: '80%'
            }
        },
        series: [{
            data:self.funnelChartData
        }]
    });
   
  }

}
