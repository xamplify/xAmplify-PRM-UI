import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import { Router } from '@angular/router';

import { AuthenticationService } from 'app/core/services/authentication.service';
import { FunnelChartsAnalyticsDto } from 'app/dashboard/models/funnel-charts-analytics-dto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
   funnelChartsAnalyticsData:any;
  constructor(public authenticationService: AuthenticationService, public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger,
    public router: Router) { }


  ngOnInit() {
    //   this.loader = true;
    //   let leads = ['Leads',10000];
    //   let deals = ['Deals',5000];
    //   let contacts = ['Contacts',2000];
    //   this.funnelChartData.push(leads);
    //   this.funnelChartData.push(deals);
    //   this.funnelChartData.push(contacts);
    //   this.loader = false;
    //   this.loadChart();
  
    this.loadFunnelChart();
  }

  loadFunnelChart(){
      this.loader = true;
      this.dashboardService.getFunnelChartsAnalyticsData(this.applyFilter).subscribe(
          data =>{
              this.funnelChartsAnalyticsData=data;
              let leads = ['Leads',this.funnelChartsAnalyticsData.leadsCount];
              let deals = ['Deals',this.funnelChartsAnalyticsData.dealsCounts];
              let contacts = ['Contacts',this.funnelChartsAnalyticsData.contactsCount];
              this.funnelChartData.push(leads);
              this.funnelChartData.push(deals);
              this.funnelChartData.push(contacts);
              this.loader = false;
              this.loadChart();
          },
           error => {
            this.xtremandLogger.error(error);
            this.loader = false;
            this.statusCode = 0;
        }
      );
  }
//   navigateContacts(){
//    this.router.navigate(["/home/contacts/manage"]);
// }
// navigateContacts(){
//     this.router.navigate(["/leads/manage-leads"])
// }
  loadChart(){
      let self = this;
      Highcharts.chart('funnel-chart-container', {
        credits: {
            enabled: false
        },
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
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            if(this.category===2){
                                self.router.navigate(["/home/contacts/manage"]);
                            }
                            else if(this.category===0){
                                self.router.navigate(["/home/leads/manage"]);
                            }
                            else if(this.category===1)
                            {
                                self.router.navigate(["/home/deal/manage"]);

                            }
                        }
                    }
                },
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
            name: 'Unique users',
            data:self.funnelChartData

        }]
    });
   
  }

}
