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
      let leads = ['Leads',15654];
      let deals = ['Deals',4064];
      let contacts = ['Contacts',976];
      this.funnelChartData.push(leads);
      this.funnelChartData.push(deals);
      this.funnelChartData.push(contacts);
      this.loader = false;
      this.loadChart();
  }

  loadChart(){
      let self = this;
    Highcharts.chart('container', {
        credits: {
            enabled: false
        },
      chart: {
          type: 'funnel'
      },
      title: {
          text: 'Funnel Chart'
      },
      plotOptions: {
          series: {
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b> ({point.y})',
                  softConnector: true
              },
              center: ['40%', '50%'],
              neckWidth: '30%',
              neckHeight: '25%',
              width: '80%'
          }
      },
      legend: {
          enabled: false
      },
      series: [{
          name: 'Series Name',
          data: self.funnelChartData
      }],
  
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  plotOptions: {
                      series: {
                          dataLabels: {
                              inside: true
                          },
                          center: ['50%', '50%'],
                          width: '100%'
                      }
                  }
              }
          }]
      }
  });
  }

}
