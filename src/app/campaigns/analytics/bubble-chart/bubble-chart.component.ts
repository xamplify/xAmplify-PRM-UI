import { Component, OnInit } from '@angular/core';
declare var Highcharts: any;

@Component({
        selector: 'app-bubble-chart',
        templateUrl: './bubble-chart.component.html',
        styleUrls: []
})

export class BubbleChartComponent implements OnInit {

        bubbleChart() {
                const dataValue = [15, 33.2, 97];

                Highcharts.chart('container', {

                        chart: {
                                type: 'bubble',
                                plotBorderWidth: 0,
                                zoomType: 'xy'
                        },
                        title: {
                                text: ' '
                        },
                        exporting: { enabled: false},
                        credits: { enabled: false },
                        xAxis: {
                                lineWidth: 0,
                                minorGridLineWidth: 0,
                                lineColor: 'transparent',
                                visible: false
                        },

                        yAxis: {
                                startOnTick: false,
                                endOnTick: false,
                                visible: false,
                                lineWidth: 0,
                                minorGridLineWidth: 0,
                                lineColor: 'transparent'
                        },
                        legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                floating: false,
                                backgroundColor: 'transparent'
                        },
                        plotOptions: {
                                bubble: {
                                        tooltip: {
                                                headerFormat: '<b>{series.name}</b><br>',
                                                pointFormat: 'minutes watched:  {point.z}'

                                        }
                                },
                                series: {
                                        dataLabels: {
                                                enabled: true,
                                                format: '{point.name}'
                                        }
                                }
                        },
                        series: [{
                                name: "chary",
                                data: [
                                        { x: 11, y: 35, z: 98.8 }

                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.7, r: 0.9 },
                                                stops: [
                                                        [0, 'rgba(255,255,255,1)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },

                        {
                                name: "santhosh",
                                data: [dataValue],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.7, r: 0.9 },
                                                stops: [
                                                        [0, 'rgba(255,255,0,0.5)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        {
                                name: "tttttt",
                                data: [
                                        [0.0, 34.0, 70.5],

                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.7, r: 0.9 },
                                                stops: [
                                                        [0, 'rgba(255,255,255,0.5)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        {
                                name: "yyyzz",
                                data: [
                                        [5, 36, 39],

                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                                                stops: [
                                                        [0, 'rgba(255,150,255,0.5)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        {
                                name: "new sreies",
                                data: [
                                        [2, 32.9, 69],

                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                                                stops: [
                                                        [0, 'rgba(255,255,200,0.5)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        {
                                name: "my name",
                                data: [
                                        [2, 30.1, 97],

                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.7, r: 0.9 },
                                                stops: [
                                                        [0, 'rgba(255,155,255,0.5)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        {
                                name: "your name",
                                data: [
                                        [4, 35, 57],

                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.7, r: 0.9 },
                                                stops: [
                                                        [0, 'rgba(255,155,255,0.5)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        {
                                name: "other nmes",
                                data: [
                                        [10, 33, 47],

                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.7, r: 0.9 },
                                                stops: [
                                                        [0, 'rgba(255,200,33,0.5)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        {
                                name: "sathish",
                                data: [
                                        [1, 31.4, 99.5]
                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.7, r: 0.9 },
                                                stops: [
                                                        [0, 'rgba(255,255,255,1)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        {
                                name: " ",
                                showInLegend: true,
                                data: [


                                ],
                                marker: {
                                        fillColor: {
                                                radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                                                stops: [
                                                        [0, 'rgba(255,150,255,0.5)'],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                                                ]
                                        }
                                }
                        },
                        ]

                });
        }

        ngOnInit() {
                this.bubbleChart();
        }

}