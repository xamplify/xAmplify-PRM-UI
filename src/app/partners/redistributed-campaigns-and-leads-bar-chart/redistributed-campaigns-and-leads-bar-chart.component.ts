import { Component, OnInit,Input } from '@angular/core';
import {ParterService} from 'app/partners/services/parter.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import {AuthenticationService} from 'app/core/services/authentication.service';
declare var Highcharts: any;

@Component({
  selector: 'app-redistributed-campaigns-and-leads-bar-chart',
  templateUrl: './redistributed-campaigns-and-leads-bar-chart.component.html',
  styleUrls: ['./redistributed-campaigns-and-leads-bar-chart.component.css'],
  providers: [Properties]
})
export class RedistributedCampaignsAndLeadsBarChartComponent implements OnInit {
chartLoader = false;
statusCode=200;
@Input() chartId:any;
hasLeadsAndDealsAccess = false;
headerText = "";
constructor(public authenticationService:AuthenticationService,public partnerService:ParterService,public xtremandLogger:XtremandLogger,public properties:Properties) { }
  ngOnInit() {
      this.refreshChart();
  }
  refreshChart(){
    this.chartLoader = true;
    this.getModuleDetails();
  }
  getModuleDetails(){
      this.authenticationService.getModuleAccessByLoggedInUserId().subscribe(
        response=>{
            this.hasLeadsAndDealsAccess = response.enableLeads;
            if(this.chartId=='redistributeCampaignsAndLeadsCountBarChart'){
                this.headerText = this.hasLeadsAndDealsAccess ? 'Redistributed Campaigns & Leads':'Redistributed Campaigns';
            }else if(this.chartId=='redistributeCampaignsAndLeadsCountBarChartQuarterly'){
                this.headerText = this.hasLeadsAndDealsAccess ? 'Redistributed Campaigns & Leads For Previous Quarter':'Redistributed Campaigns For Previous Quarter';
            }
        },error=>{
            this.setErrorResponse(error);
        },()=>{
            this.getDataForBarChart();
        }
      );
  }

  getDataForBarChart(){
    this.partnerService.getRedistributedCampaignsAndLeadsCount(this.chartId).subscribe(
        response=>{
            let data = response.data;
            this.statusCode =  response.statusCode;
            if(this.statusCode==200){
                let xAxis = data.xaxis;
                let yAxis1 = data.yaxis1;
                let yAxis2 = data.yaxis2;
                this.renderChart(xAxis,yAxis1,yAxis2);
            }else{
                this.chartLoader = false;
            }
        },error=>{
            this.setErrorResponse(error);
        }
      );
  }

  setErrorResponse(error){
    this.chartLoader = false;
    this.statusCode = 500;
    this.xtremandLogger.error(error);
  }
  renderChart(xAxis:any,yAxis1:any,yAxis2:any){
    let chartId = this.chartId;
    let primayAxisColor = "";
    let secondaryAxisColor = "";
    if(chartId=="redistributeCampaignsAndLeadsCountBarChart"){
        primayAxisColor = Highcharts.getOptions().colors[0];
        secondaryAxisColor = Highcharts.getOptions().colors[1];
    }else{
        primayAxisColor = Highcharts.getOptions().colors[7];
        secondaryAxisColor = Highcharts.getOptions().colors[9];
    }
    let series = [];
    if(this.hasLeadsAndDealsAccess){
        series.push(this.setRedistributedCampaignsSeries(yAxis1,primayAxisColor));
        series.push(this.setLeadsSeries(yAxis2,secondaryAxisColor));
    }else{
        series.push(this.setRedistributedCampaignsSeries(yAxis1,primayAxisColor));
    }
    Highcharts.chart(chartId, {
      credits:{
        enabled:false
      },
      chart: {
          zoomType: 'xy'
      },
      title:{
          text:''
      },
      xAxis: [{
          categories: xAxis,
          crosshair: true
      }],
      yAxis: [{ // Primary yAxis
          labels: {
              format: '{value}',
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          },
          title: {
              text: '',
              style: {
                  color: secondaryAxisColor
              }
          }
      }, 
      { // Secondary yAxis
          title: {
              text: '',
              style: {
                  color: primayAxisColor
              }
          },
          labels: {
              format: '{value}',
              style: {
                  color: primayAxisColor
              }
          },
          opposite: true
      }],
      tooltip: {
          shared: true
      },
      legend: {
          layout: 'vertical',
          align: 'left',
          x: 120,
          verticalAlign: 'top',
          y: 100,
          floating: true,
          backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 
              'rgba(255,255,255,0.25)'
      },
      series: series
  });
    this.chartLoader = false;
  }

  setRedistributedCampaignsSeries(yAxis1:any,primaryAxisColor:any){
      let data:any;
       data = {
        name: 'Redistributed Campaigns',
        type: 'column',
        yAxis: 0,
        data: yAxis1,
        color: primaryAxisColor
      }
      return data;
  }

  setLeadsSeries(yAxis2:any,secondaryAxisColor:any){
    let data:any;
    data = {
        name: 'Leads',
        type: 'spline',
        data: yAxis2,
        color: secondaryAxisColor
      }
      return data;
  }

}
