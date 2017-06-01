import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';

declare var Highcharts: any;
@Component( {
    selector: 'app-line-chart',
    template: `<div id="twitter-line-chart" style="min-width:100px; height:350px"></div>`
})
export class LineChartComponent implements OnInit {

    @Input() influence: any;
    @Input() engagement: any;

    public options: Object;
    constructor() { }

    ngOnInit() {
        Highcharts.chart( 'twitter-line-chart', {
            title: {
                text: 'KEY INDICATORS (Know how your conversing with your audience)',
                x: -20 //center
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {

                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '%'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'influence',
                data: this.influence
            }, {
                name: 'engagement',
                data: this.engagement
            }]
        });
     }
}
