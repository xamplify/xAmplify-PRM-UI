import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
declare var Highcharts: any;
@Component({
  selector: 'app-pie-chart-statistics-bar-graph',
  templateUrl: './pie-chart-statistics-bar-graph.component.html',
  styleUrls: ['./pie-chart-statistics-bar-graph.component.css']
})
export class PieChartStatisticsBarGraphComponent implements OnInit {
  pieChartGraphData: any=[];

  loader = false;
  statusCode = 200;
  @Input()applyFilter:boolean;
  funnelChartsAnalyticsData:any;
  name:any;
  statusName:any;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number = 0;
  vanityLogin = false;
  selectedTemplateTypeIndex =0;
  show:boolean=true;
  constructor(public authenticationService: AuthenticationService, public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger,
    public router: Router) {this.loggedInUserId = this.authenticationService.getUserId();
      this.vanityLoginDto.userId = this.loggedInUserId;
      let companyProfileName = this.authenticationService.companyProfileName;
      if (companyProfileName !== undefined && companyProfileName !== "") {
        this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
        this.vanityLoginDto.vanityUrlFilter = true;
        this.vanityLogin = true;
      } }

  ngOnInit() {
    this.vanityLoginDto.applyFilter = this.applyFilter;
    this.loadStatisticsDealDataWithStageNames();
  }
  click(index :number){
    this.selectedTemplateTypeIndex =index;
    this.loadStatisticsDealDataWithStageNames()
  }
  leads(index : number){
    this.selectedTemplateTypeIndex = index;
    this.loadStatisticsLeadsDataWithStageNames();
  }
  loadStatisticsDealDataWithStageNames(){
    this.statusName="Deal Status"
    this.loader = true;
this.dashboardService.getPieChartDealStatisticsWithStageNames(this.vanityLoginDto).subscribe(
  (response) =>{
    this.pieChartGraphData=response.data;
    this.statusCode=200;
    console.log(this.pieChartGraphData)
    this.loader =false;
    this.loadGraph(this.pieChartGraphData,this.statusName)
  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  
  }
)
  }
  /****************Leads*************** */
  loadStatisticsLeadsDataWithStageNames(){
  
    this.statusName="Lead Status"
    this.loader = true;
this.dashboardService.getPieChartLeadsStatisticsWithStageNames(this.vanityLoginDto).subscribe(
  (response) =>{
    this.pieChartGraphData=response.data;
   console.log(this.pieChartGraphData);
    this.statusCode=200;
console.log(this.pieChartGraphData)
    this.loader =false;
    this.loadGraph(this.pieChartGraphData,this.statusName)

  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  }
)
  }
   loadGraph(pieChartGraphData:any,statusName:any){
    let self =this;
    Highcharts.chart('container1', {
      chart: {
          type: 'bar'
      },
      title: {
          text: ''
      },
      subtitle: {
        text: self.statusName
    },
      
      xAxis: {
          categories: this.pieChartGraphData.map(t3=>t3.name),
          
      },
      yAxis: {
         
          
      },
     
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
      legend: {
        enabled: false
      },
      credits: {
          enabled: false
      },
      series: [{
          name: 'Count',
          data: this.pieChartGraphData.map(c3=>c3.value),
      }]
  });
   }
  }
