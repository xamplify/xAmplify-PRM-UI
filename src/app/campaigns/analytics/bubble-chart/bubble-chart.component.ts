import { Component, OnInit, Input } from '@angular/core';
import { CampaignService } from '../../../campaigns/services/campaign.service';
declare var Highcharts: any;

@Component({
        selector: 'app-bubble-chart',
        templateUrl: './bubble-chart.component.html',
        styleUrls: []
})

export class BubbleChartComponent implements OnInit {
        @Input() campaignId: number;
        constructor(public campaignService: CampaignService) { }

      getCampaignUserWatchedMinutesCountes(campaignId: number) {
        this.campaignService.getCampaignUserWatchedMinutes(campaignId)
                .subscribe(
                data => {
                console.log(data);
                this.bubbleChart(data.names, data.legend, data.values);
                },
                error => console.log(error),
                () => console.log() )
        }

        bubbleChart(names,legends, values) {
                Highcharts.chart('container', {

                        chart: {
                                type: 'bubble',
                                plotBorderWidth: 0,
                                zoomType: 'xy'
                        },
                        title: {
                                text: ' '
                        },
                        exporting: { enabled: false },
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
                                // layout: 'vertical',
                                // align: 'right',
                                // verticalAlign: 'top',
                                // floating: false,
                                // backgroundColor: 'transparent'
                                enabled:true,
                                layout: 'vertical',
                                backgroundColor: '#FFFFFF',
                                align: 'right',
                                verticalAlign: 'top',
                                x: 30,
                                y: 3,
                                floating: false,
                                shadow: true
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
                                name: names[0],
                                showInLegend: legends[0],
                                data: [ values[0] ],
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
                                name: names[1],
                                showInLegend: legends[1],
                                data: [ values[1] ],
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
                                name: names[2],
                                showInLegend: legends[2],
                                data: [ values[2] ],
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
                               name: names[3],
                                showInLegend: legends[3],
                                data: [ values[3] ],
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
                                name: names[4],
                                showInLegend: legends[4],
                                data: [ values[4] ],
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
                                name: names[5],
                                showInLegend: legends[5],
                                data: [ values[5] ],
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
                                 name: names[6],
                                showInLegend: legends[6],
                                data: [ values[6] ],
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
                                name: names[7],
                                showInLegend: legends[7],
                                data: [ values[7] ],
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
                                 name: names[8],
                                showInLegend: legends[8],
                                data: [ values[8] ],
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
                                name: names[9],
                                showInLegend: legends[9],
                                data: [ values[9] ],
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
                this.getCampaignUserWatchedMinutesCountes(this.campaignId);
        }

}