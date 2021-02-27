import { Component, OnInit } from '@angular/core';
import {ParterService} from 'app/partners/services/parter.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import {AuthenticationService} from 'app/core/services/authentication.service';
declare var Highcharts,$: any;

@Component({
  selector: 'app-leads-and-deals-bar-chart',
  templateUrl: './leads-and-deals-bar-chart.component.html',
  styleUrls: ['./leads-and-deals-bar-chart.component.css'],
  providers: [Properties]
})
export class LeadsAndDealsBarChartComponent implements OnInit {
  chartLoader = false;
  statusCode=200;
  hasLeadsAndDealsAccess = false;
  filterValue = "";
  constructor(public authenticationService:AuthenticationService,public partnerService:ParterService,public xtremandLogger:XtremandLogger,public properties:Properties) { }
  ngOnInit() {
      this.refreshChart();
  }
  refreshChart(){
    this.chartLoader = true;
    this.filterValue = 'l';
    this.getModuleDetails();
  }
  getModuleDetails(){
    this.authenticationService.getModuleAccessByLoggedInUserId().subscribe(
      response=>{
          this.hasLeadsAndDealsAccess = response.enableLeads;
      },error=>{
          this.setErrorResponse(error);
      },()=>{
          if(this.hasLeadsAndDealsAccess){
            this.getDataForChart();
          }
      }
    );
}

  getDataForChart(){
    this.partnerService.getLeadsAndDealsCount(this.filterValue).subscribe(
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
    Highcharts.chart('partner-leads-and-deals-bar-chart', {

        chart: {
            type: 'column'
        },

        credits:{
            enabled:false
        },
    
        title: {
            text: ''
        },
    
        xAxis: {
            categories: xAxis
        },
    
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' 
            }
        },
    
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
    
        series: [{
            name: 'Leads',
            data: yAxis1,
            stack: 'male',
            color:Highcharts.getOptions().colors[8]
        }, {
            name: 'Deals',
            data: yAxis2,
            stack: 'female',
            color:Highcharts.getOptions().colors[2]
        }]
    });
  this.chartLoader = false;
  }

  filterChartByType(){
    this.filterValue = $('#leadsAndDealsFilterOption option:selected').val();
    this.chartLoader = true;
    this.getDataForChart();
  }

}