import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
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
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number = 0;
  vanityLogin = false;
  @Input()applyFilter:boolean;
  name:any;
  opportunityName:any=[];
  opportunityValue:any=[]
  selectedTemplateTypeIndex =0;
  showIndex=0;
  constructor(public authenticationService: AuthenticationService, public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger,
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
    this.loadDealPieChart();
  }
  click(index :number ){
    this.selectedTemplateTypeIndex =index
    this.loadDealPieChart();
  }
  leads(index :number){
    this.selectedTemplateTypeIndex =index
    this.loadLeadPieChart();
  }
  
  loadStatisticsDealData(){
  this.loader = true;
  this.dashboardService.getPieChartStatisticsDealData(this.vanityLoginDto).subscribe(
  (response) =>{
    this.pieChartStatisticsData=response.data;
    this.statusCode=200;
    this.opportunityName=this.pieChartStatisticsData.map(i=>i[0])
    this.opportunityValue=this.pieChartStatisticsData.map(i=>i[1])
    this.loader =false;
  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  }
)
  }
  loadStatisticsLeadData(){
    this.loader = true;
this.dashboardService.getPieChartStatisticsLeadAnalyticsData(this.vanityLoginDto).subscribe(
  (response) =>{
    this.pieChartStatisticsData=response.data;
    this.opportunityName=this.pieChartStatisticsData.map(i=>i[0])
    this.opportunityValue=this.pieChartStatisticsData.map(i=>i[1])
    this.loader =false;
  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  }
);
  }
  
 loadLeadPieChart(){
this.loader = true;
this.dashboardService.getPieChartLeadsAnalyticsData(this.vanityLoginDto).subscribe(
  (response)=>{
    this.pieChartData=response.data;
    let val=this.pieChartData.map(map=>map[1])
    let sum = val.reduce(function (a, b) {
     return a + b;
     }, 0);
     if(sum === 0){
       this.pieChartData.length = 0;
       this.loader =false;
       this.showIndex=1;
     }
     else{
  this.statusCode=200;
  this.loader = false;
  this.loadChart(this.pieChartData);
  this.loadStatisticsLeadData();
  this.showIndex=0;
     }

},
(error) => {
  this.xtremandLogger.error(error);
  this.loader = false;
  this.statusCode = 0;
  
}
);
}

loadDealPieChart(){
  this.loader = true;
  this.dashboardService.getPieChartDealsAnalyticsData(this.vanityLoginDto).subscribe(
    (response)=>{
      this.pieChartData=response.data;
     let val=this.pieChartData.map(map=>map[1])
     let sum = val.reduce(function (a, b) {
      return a + b;
      }, 0);
      if(sum === 0){
        this.pieChartData.length = 0;
        this.loader =false;
        this.showIndex=1
      }
      else{
    this.statusCode=200;
    this.loader = false;
    this.loadChart(this.pieChartData);
    this.loadStatisticsDealData();
    this.showIndex =0;
      }
            
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
      colors: [
        "#5C9BD1",
        "#8b76a8",
        " #a49c9e",
        "#3faba4",
        "#1aadce",
        "#492970",
        "#f28f43",
        "#77a1e5",
        "#c42525",
        "#a6c96a",
      ],
      series: [{
          type: 'pie',
          name: 'count',
          data: self.pieChartData,
      },],
  });
  }
}
