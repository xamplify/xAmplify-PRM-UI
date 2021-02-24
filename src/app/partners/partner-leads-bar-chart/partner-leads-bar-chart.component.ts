import { Component, OnInit } from '@angular/core';
import {ParterService} from 'app/partners/services/parter.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
declare var Highcharts: any;

@Component({
  selector: 'app-partner-leads-bar-chart',
  templateUrl: './partner-leads-bar-chart.component.html',
  styleUrls: ['./partner-leads-bar-chart.component.css'],
  providers: [Properties]
})
export class PartnerLeadsBarChartComponent implements OnInit {
  chartLoader = false;
  statusCode=200;
  constructor(public partnerService:ParterService,public xtremandLogger:XtremandLogger,public properties:Properties) { }
  ngOnInit() {
      this.chartLoader = true;
      this.partnerService.getRedistributedCampaignsAndLeadsCount("redistributeCampaignsAndLeadsCountBarChart").subscribe(
        response=>{
            let data = response.data;
            this.statusCode =  response.statusCode;
            if(this.statusCode==200){
                let xAxis = data.xaxis;
                let yAxis1 = data.yaxis1;
                let yAxis2 = data.yaxis2;
                this.renderChart();
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

  renderChart(){
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
            categories: ['p1', 'p2', 'p3', 'p4', 'p5']
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
            data: [5, 3, 4, 7, 2],
            stack: 'male',
            color:Highcharts.getOptions().colors[8]
        }, {
            name: 'Deals',
            data: [3, 4, 4, 2, 5],
            stack: 'female',
            color:Highcharts.getOptions().colors[2]
        }]
    });
    
    
  this.chartLoader = false;
  }

}
