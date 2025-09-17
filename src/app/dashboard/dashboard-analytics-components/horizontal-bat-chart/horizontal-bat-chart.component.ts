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
  redistributedName: string ="Redistributed campaigns";
  throughCampaignName: string ="Through Campaigns";
  tocampaignsName: string = "To Camapaigns";
  

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
          this.loadHorizontalBarChart(this.horizontalBarData)
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
        type: 'bar',
        backgroundColor   : this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: [this.campaign],
        labels:{
          style:{
            color: this.authenticationService.isDarkForCharts ? "#fff" : "#666666",
          }
        }
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
        reversed: true,
        itemStyle:{
          color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",
        },
        itemHoverStyle: {
          color: this.authenticationService.isDarkForCharts ? "#eee" : "#333333",
        }
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
    },
    credits: {
                enabled: false
            },
            colors:[
              "#8877a9",
              "#3faba4",
              "#008fd5"
            ],
    series: 
    [
      {
        showInLegend: this.horizontalBarData.showInLegendRedistributedCampaign,
        name: this.redistributedName,
        data: [this.horizontalBarData.redistributedCampaignsCount]
      },
       {
         showInLegend: this.horizontalBarData.showInLegendThroughCampaign,
         name: this.throughCampaignName,
         data: [this.horizontalBarData.throughCampaignsCount]

      },
       {
      showInLegend: this.horizontalBarData.showInLegendToCampaign,
       name: this.tocampaignsName,
       data: [this.horizontalBarData.toCampaignsCount]
     }
   ]
});
 }
}
