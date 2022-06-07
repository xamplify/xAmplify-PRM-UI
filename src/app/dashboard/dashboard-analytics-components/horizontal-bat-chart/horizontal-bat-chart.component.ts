import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
 declare var Highcharts :any;
@Component({
  selector: 'app-horizontal-bat-chart',
  templateUrl: './horizontal-bat-chart.component.html',
  styleUrls: ['./horizontal-bat-chart.component.css'],
  providers: [Properties]
})
export class HorizontalBatChartComponent implements OnInit {
  loader =false;
  statusCode =200;
  horizontalBarData:any;
  campaign='Campaigns';
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number = 0;
  totalCount: number = 0;
  vanityLogin = false;
  @Input()applyFilter:boolean;

  constructor(public authenticationService: AuthenticationService, public properties: Properties,
     public dashboardService: DashboardService, public xtremandLogger: XtremandLogger,
    public router: Router) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.vanityLoginDto.userId = this.loggedInUserId;
      let companyProfileName = this.authenticationService.companyProfileName;
      if (companyProfileName !== undefined && companyProfileName !== "") {
        this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
        this.vanityLoginDto.vanityUrlFilter = true;
        this.vanityLogin = true;
      }
    }
 
  ngOnInit() {
    this.vanityLoginDto.applyFilter = this.applyFilter;
    this.findHorizontalBarChart();
  }

  findHorizontalBarChart(){
    this.loader =true;
    this.dashboardService.findLaunchedAndRedistributedCampiagnsForBarChart(this.vanityLoginDto)
    .subscribe(
      (response) =>{
         this.horizontalBarData =response.data;
         this.totalCount=this.horizontalBarData.totalCampaignsCount;
         if(this.totalCount>0){
          this.loadHorizontalBarChart(this.horizontalBarData);
         }
         this.statusCode = 200;
         this.loader = false;
      },
      (error) => {
        this.xtremandLogger.error(error);
        this.loader = false;
        this.statusCode = 500;
      }
    );
  }
 loadHorizontalBarChart(horizontalBarData :any){
  Highcharts.chart('horizontal-bar-chart-container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: [this.campaign]
    },
    yAxis: {
        labels: {
        enabled: false
        },
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
            colors:[
              "#8877a9",
              "#3faba4",
              "#008fd5"
            ],
    series: [
      {
        name: 'Redistributed Campaigns',
        data: [this.horizontalBarData.redistributedCampaignsCount]
      },
      {
        name: 'Through Campaigns',
        data: [this.horizontalBarData.throughCampaignsCount]

      },
      {
      name: 'To Campaigns',
      data: [this.horizontalBarData.toCampaignsCount]
    }
   ]
});
 }
}
