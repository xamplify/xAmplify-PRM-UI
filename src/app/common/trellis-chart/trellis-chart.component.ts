import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var Highcharts, $: any;

@Component({
    selector: 'app-trellis-chart',
    templateUrl: './trellis-chart.component.html',
    styleUrls: ['./trellis-chart.component.css']
})
export class TrellisChartComponent implements OnInit {
    @Input() trellisBarChartData: any;
    @Output() notifyParent: EventEmitter<any>;
    constructor() {
        this.notifyParent = new EventEmitter<any>();
    }

    trellisBarChart() {
        const maxValue = this.trellisBarChartData.maxValue;
        const self = this;
        let dataSets: any;
        let isColor: boolean
        let namesValues: any;
        if (this.trellisBarChartData.type === 'dashboard') {
            const opened = this.trellisBarChartData.result.emailOpenedCount;
            const clicked = this.trellisBarChartData.result.emailClickedCount;
            const watched = this.trellisBarChartData.result.watchedCount;
            namesValues = this.trellisBarChartData.result.campaignNames;
            isColor = false;
            dataSets = [{ name: 'opened', data: opened }, { name: 'clicked', data: clicked }, { name: 'watched', data: watched }];
        } else {
            const minutesWatched = this.trellisBarChartData.result.video_views_count_data.minutesWatched;
            namesValues = this.trellisBarChartData.result.video_views_count_data.names;
            isColor = true;
            dataSets = [{ name: ' ', data: minutesWatched }];
        }

        const charts = [],
            $containers = $('#trellis td'),
            datasets = dataSets;
        $.each(datasets, function (i, dataset) {
            charts.push(new Highcharts.Chart({
                chart: {
                    renderTo: $containers[i],
                    type: 'bar',
                    marginLeft: i === 0 ? 100 : 10
                },
                title: {
                    text: dataset.name,
                    align: 'left',
                    x: i === 0 ? 90 : 0,
                    style: {
                        color: '#696666',
                        fontWeight: 'normal',
                        fontSize: '13px'
                    }
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        },
                        minPointLength: 3,
                    },
                    series: {
                        colorByPoint: isColor,
                        point: {
                            events: {
                                click: function () {
                                    // alert('campaign: ' + this.category + ', value: ' + this.y);
                                    self.clickedTrellisChart(this.category);
                                }
                            }
                        }
                    }
                },
                colors: ['#7CB5EC', '#c42dd8', '#d82d2d', '#d8d52d', '#2dd838', '#2dd8be', '#3D96AE', '#b5ca92', '#2e37d8', '#c42dd8'],
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: namesValues,
                    labels: {
                        enabled: i === 0
                    },
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: 'transparent',
                    minorTickLength: 0,
                    tickLength: 0
                },
                exporting: { enabled: false },
                yAxis: {
                    allowDecimals: false,
                    visible: false,
                    title: {
                        text: null
                    },
                    min: 0,
                    max: maxValue  // findout maxmum,it is important
                },
                legend: {
                    enabled: false
                },
                labels: {
                    style: {
                        color: 'white',
                        fontSize: '25px'
                    }
                },
                series: [dataset]
            }));
        });
    }

    clickedTrellisChart(category) {
        this.notifyParent.emit(category);
    }
    ngOnInit() {
        console.log(this.trellisBarChartData);
        this.trellisBarChart();
    }

}
