import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var Highcharts:any;

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() viewsBarData: any;
  @Output() notifyParent: EventEmitter<any>;
  constructor() { 
    this.notifyParent = new EventEmitter<any>();
  }

    monthlyViewsBarCharts(dates, views) {
    const self = this;
    Highcharts.chart('monthly-views-bar-chart', {
      chart: {
        type: 'column'
      },
      title: {
        text: ' '
      },
      credits: false,
      exporting: { enabled: false },
      xAxis: {
        categories: dates
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
