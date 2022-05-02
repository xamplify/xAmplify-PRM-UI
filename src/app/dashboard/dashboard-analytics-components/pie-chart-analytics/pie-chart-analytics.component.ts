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
  sum:any;
  show:boolean=true;
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
   this.click();
  }
  click(){
    this.clickRepeate();
  }
  clickRepeate(){
    this.selectedTemplateTypeIndex =0;
    this.loadDealPieChart();
    this.loadStatisticsDealData();
    this.show=true;

  }
  leads(){
    this.loadLeadPieChart();
    this.selectedTemplateTypeIndex =1;
    this.loadStatisticsLeadData();
    this.show=true;
    
  }
  
  loadLeadPieChart(){
    this.loader = true;
    this.dashboardService.getPieChartLeadsAnalyticsData(this.vanityLoginDto).subscribe(
      (response)=>{
        this.pieChartData=response.data;
        this.loader=false;
        this.statusCode=200;
        this.sumMethode(this.pieChartData);
    },
    (error) => {
      this.xtremandLogger.error(error);
      this.loader = false;
      this.statusCode = 0;
    }
    );
    }
    loadStatisticsLeadData(){
    this.loader = true;
    let self =this;
     this.dashboardService.getPieChartStatisticsLeadAnalyticsData(this.vanityLoginDto)
     .subscribe(
  (response) =>{
    self.pieChartStatisticsData=response.data;
    self.opportunityName=self.pieChartStatisticsData.map(i=>i[0])
    self.opportunityValue=self.pieChartStatisticsData.map(i=>i[1]) 
    if(this.opportunityValue[2] === null){
      self.pieChartStatisticsData.length = 0
      this.loader =false;
    }else{
      self.pieChartData.length != 0;
    self.pieChartStatisticsData.length != 0
    this.loader =false;
    }
  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  }
);
  }
  
  loadStatisticsDealData(){
  this.loader = true;
  let self =this;
  this.dashboardService.getPieChartStatisticsDealData(this.vanityLoginDto).subscribe(
  (response) =>{
    self.pieChartStatisticsData=response.data;
    this.statusCode=200;
    self.opportunityName=self.pieChartStatisticsData.map(i=>i[0])
    self.opportunityValue=self.pieChartStatisticsData.map(i=>i[1])
    self.pieChartData.length != 0;
    this.loader =false;
  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  }
)
  }



loadDealPieChart(){
  this.loader=true;
    this.dashboardService.getPieChartDealsAnalyticsData(this.vanityLoginDto).subscribe(
         (response: any)=>{
           this.pieChartData=response.data;
           this.loader=false;
          },
          (error: any) => { 
      this.xtremandLogger.error(error);
      
    },
          () =>{this.loadChart(this.pieChartData),
            this.show=true;
            this.sumMethode(this.pieChartData)
          }

        );
      }
  sumMethode(pieChartData: any){
    let val=this.pieChartData.map(map=>map[1])
        this.sum = val.reduce(function (a, b) {
         return a + b;
         }, 0);
         if(this.sum === 0){
           this.pieChartData.length = this.sum;
           this.loader =false;
           this.show=false;
         }
         else{
      this.statusCode=200;
      this.loader = false;
      this.show=true;
      this.pieChartData.length = this.sum;
      this.loadChart(this.pieChartData);
  }
}
  loadChart(pieChartData:any){
    let self=this;
    this.loader =false;
    Highcharts.chart('container', {
      credits: {
        enabled: false,
      },
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
