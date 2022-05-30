import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
 declare var Highcharts :any;
@Component({
  selector: 'app-horizontal-bat-chart',
  templateUrl: './horizontal-bat-chart.component.html',
  styleUrls: ['./horizontal-bat-chart.component.css'],
  providers: [Properties,HttpRequestLoader]
})
export class HorizontalBatChartComponent implements OnInit {
  loader =false;
  statusCode =200;
  horizontalBarData:any;
  campaign='Campaigns';
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number = 0;
  val: any;
  vanityLogin = false;
  @Input()applyFilter:boolean;

  constructor(public authenticationService: AuthenticationService, public properties: Properties,
     public dashboardService: DashboardService, public xtremandLogger: XtremandLogger,
    public router: Router,public httpRequestLoader: HttpRequestLoader) {
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
         this.val=this.horizontalBarData.redistributedCampaignsCount+this.horizontalBarData.launchedCampaignsCount
         if(this.val === 0){
           this.horizontalBarData.length = 0;
           this.loader =false;
         }
         else{
         this.loader =false;
         this.statusCode =200;
         this.loadHorizontalBarChart(this.horizontalBarData);
         }
      },
      (error) => {
        this.xtremandLogger.error(error);
        this.loader = false;
        this.statusCode = 0;
      }
    );
  }
 loadHorizontalBarChart(horizontalBarData :any){
   this.loader =false;
   this.statusCode=200;
  Highcharts.chart('horizontal-bar-chart-container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Stacked bar chart'
    },
    xAxis: {
        categories: [this.campaign]
    },
    yAxis: {
        min: 0,
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
    // colors: [
    //           "#8877a9",
    //           "#3faba4"
    //         ],
    series: [
      {
        name: 'Redistributed',
        data: [this.horizontalBarData.redistributedCampaignsCount]
      },
      {
      name: 'Launched',
      data: [this.horizontalBarData.launchedCampaignsCount]
    }
   ]
});
 }
}
