import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AuthenticationService} from 'app/core/services/authentication.service';
declare var Highcharts:any;

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() viewsBarData: any;
  @Output() notifyParent: EventEmitter<any>;
  constructor(public authenticationService:AuthenticationService) { 
    this.notifyParent = new EventEmitter<any>();
  }

    monthlyViewsBarCharts(dates, views) {
    const self = this;
    Highcharts.chart('monthly-views-bar-chart', {
      chart: {
        type: 'column',
        backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
      },
      title: {
        text: ' '
      },
      credits: false,
      exporting: { enabled: false },
      xAxis: {
        categories: dates,
        labels:{
          style:{
            color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",
          }
        }
      },

      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: ' '
        },
        visible: false
      },
      legend: {
        enabled: false
      },

      tooltip: {
        formatter: function () {
          return '<b>' + this.x + '</b><br/>' +
            this.series.name + ': ' + this.y;
        },
        backgroundColor: 'black', 
        style: {
          color: '#fff' 
        }
      },

      plotOptions: {
        column: {
          stacking: 'normal'
        },
          series: {
            point: {
                events: {
                    click: function () {
                       self.getTimePeriod(this.category);
                    }
                }
            }
          }
      },
      series: [{
        name: 'views',
        data: views
        // stack: 'male'
      }]
    });
  }
  getTimePeriod(timePeriod){
    console.log(timePeriod);
    this.notifyParent.emit(timePeriod);
  }
  ngOnInit() {
    this.monthlyViewsBarCharts(this.viewsBarData.dates, this.viewsBarData.views)
  }

}
