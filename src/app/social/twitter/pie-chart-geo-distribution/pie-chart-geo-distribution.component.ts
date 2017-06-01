import { Component, OnInit } from '@angular/core';

declare var Highcharts: any;
@Component( {
    selector: 'app-pie-chart-geo-distribution',
    styles: [`chart { display: block; height: 100%; width: 50%; }`],
    template: `<div id="twitter-pie-chart-geo-distribution" style="height:400px"></div>`
})

export class PieChartGeoDistributionComponent implements OnInit {
    constructor() {
        this.options = {};
    }
    options: Object;

    ngOnInit() {
        Highcharts.chart( 'twitter-pie-chart-geo-distribution', {

            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: 'Geo Distribution',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white'
                        }
                    },
                    startAngle: -360,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: [
                    ['Chine', 10.38],
                    ['United States', 56.33],
                    ['india', 24.03],
                    ['Australia', 4.77],
                    ['Dubai', 0.91],
                    {
                        name: 'Proprietary or Undetectable',
                        y: 0.2,
                        dataLabels: {
                            enabled: false
                        }
                    }
                ]
            }]
        });
     }

}
