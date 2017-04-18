import { Component } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';

@Component( {
    selector: 'app-new-fans-line-chart',
    styles: [`chart {display: block; height: 68%; width: 100%; }`],
    template: `<div style="min-width:100px; height:350px"><chart [options]="options"></chart></div>`
})

export class NewFansLineChartComponent {
    constructor() {
        this.options = {

            title: {
                text: 'KEY INDICATORS (Know how your conversing with your audience)',
                x: -20 //center
            },

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
                name: 'New Fans',
                data: [7.0, 6.9, 6.5, 6.5, 7.2, 6.5, 7.2, 6.5, 6.3, 6.5, 6.9, 7.6]
            }, {
                name: 'Unliked',
                data: [2.9, 2.2, 3.7, 3.5, 3.9, 3.2, 3.0, 3.6, 3.2, 3.3, 3.6, 3.3]
            }]
        };
    }
    options: Object;
}
