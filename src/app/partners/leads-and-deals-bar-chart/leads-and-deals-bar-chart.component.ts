import { Component, OnInit } from '@angular/core';
import {ParterService} from 'app/partners/services/parter.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
declare var Highcharts: any;

@Component({
  selector: 'app-leads-and-deals-bar-chart',
  templateUrl: './leads-and-deals-bar-chart.component.html',
  styleUrls: ['./leads-and-deals-bar-chart.component.css'],
  providers: [Properties]
})
export class LeadsAndDealsBarChartComponent implements OnInit {
  chartLoader = false;
  statusCode=200;
  constructor(public partnerService:ParterService,public xtremandLogger:XtremandLogger,public properties:Properties) { }
  ngOnInit() {
      this.chartLoader = true;
      this.partnerService.getLeadsAndDealsCount().subscribe(
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
            this.chartLoader = false;
            this.statusCode = 500;
            this.xtremandLogger.error(error);
        }
      );
    
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

}