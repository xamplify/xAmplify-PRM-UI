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
    
  
    this.loadFunnelChart();
  }

  loadFunnelChart(){
      this.loader = true;
      this.dashboardService.getFunnelChartsAnalyticsData(this.applyFilter).subscribe(
          data =>{
              this.funnelChartsAnalyticsData=data.data;
              let contacts = ['Recipients',this.funnelChartsAnalyticsData.contactsCount];
              let leads = ['Leads',this.funnelChartsAnalyticsData.leadsCount];
              let deals = ['Deals',this.funnelChartsAnalyticsData.dealsCounts];
              this.funnelChartData.push(contacts);
              this.funnelChartData.push(leads);
              this.funnelChartData.push(deals);
              
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
            text: ''
        },
        plotOptions: {
            colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
        '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            if(this.category===0){
                                self.router.navigate(["/home/contacts/manage"]);
                            }
                            else if(this.category===1){
                                self.router.navigate(["/home/leads/manage"]);
                            }
                            else if(this.category===2)
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
            name: 'Count',
            data:self.funnelChartData

        }]
    });
   
  }

}
