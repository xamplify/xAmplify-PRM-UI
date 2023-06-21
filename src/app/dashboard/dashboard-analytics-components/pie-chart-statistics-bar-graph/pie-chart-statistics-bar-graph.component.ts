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
  leadsCount :any;
  dealsCount :any;
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
    this.clickAgain();
    
  }
  clickAgain(){
    this.loadStatisticsDealDataWithStageNames()

  }
  leads(index : number){
    this.selectedTemplateTypeIndex = index;
    this.leadAgain();
  }
  leadAgain(){
    this.loadStatisticsLeadsDataWithStageNames();

  }
  loadStatisticsDealDataWithStageNames(){
    this.statusName="Deal Status"
    this.loader = true;
    this.dashboardService.getPieChartDealStatisticsWithStageNames(this.vanityLoginDto).subscribe(
      (response) =>{
        this.pieChartGraphData=response.data;
        var valDeals= this.pieChartGraphData.map(c3=>c3.value)
        let sumDeal = valDeals.reduce(function (a, b) {
          return a + b;
          }, 0); 
          this.dealsCount =sumDeal;
        this.statusCode=200;
        this.sumMethode(this.pieChartGraphData);
      },
      (error) => {
        this.xtremandLogger.error(error);
        this.loader = false;
        this.statusCode = 0;
      });
  }
  /****************Leads*************** */
  loadStatisticsLeadsDataWithStageNames(){
    this.statusName="Lead Status"
    this.loader = true;
    this.dashboardService.getPieChartLeadsStatisticsWithStageNames(this.vanityLoginDto).subscribe(
      (response) =>{
        this.pieChartGraphData=response.data;
        var valLeads= this.pieChartGraphData.map(c3=>c3.value)
    let sumLeads = valLeads.reduce(function (a, b) {
      return a + b;
      }, 0); 
      this.leadsCount =sumLeads;
        this.sumMethode(this.dashboardService);
        this.statusCode =200;
      },
      (error) => {
        this.xtremandLogger.error(error);
        this.loader = false;
        this.statusCode = 0;
      });
  }
  sumMethode(pieChartGraphData:any){
    var val= this.pieChartGraphData.map(c3=>c3.value)
    let sum = val.reduce(function (a, b) {
      return a + b;
      }, 0); 
      if(sum === 0){
        this.pieChartGraphData.length =sum;
        this.loader =false;
        this.show=false;
      }else{
      this.loader =false;
      this.show=true;
      this.pieChartGraphData.length = sum;
      this.loadGraph(this.pieChartGraphData,this.statusName)
      }
  }
   loadGraph(pieChartGraphData:any,statusName:any){
    let self =this;
    Highcharts.chart('leads-deals-bar-graph', {
      chart: {
          type: 'bar',
          backgroundColor   : this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
      },
      tooltip: {
        backgroundColor: 'black', 
        style: {
          color: '#fff' 
        }
      },
      title: {
          text: '',
      },
      subtitle: {
        text: self.statusName,
        style: {
          color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",}
    },
      
      xAxis: {
          categories: this.pieChartGraphData.map(t3=>t3.name),
          labels:{
          style: {
            color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",}
          }
      },
      yAxis: {
        labels:{
        style: {
          color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",}    
        },
        title:{
          style: {
            color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",}  
        }
      },
     
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true,
                    style: {
                      color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",}    
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
