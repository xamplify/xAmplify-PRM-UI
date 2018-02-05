import { Component, OnInit, Input, Output } from '@angular/core';
declare var Highcharts, $:any;

@Component({
  selector: 'app-trellis-chart',
  templateUrl: './trellis-chart.component.html',
  styleUrls: ['./trellis-chart.component.css']
})
export class TrellisChartComponent implements OnInit {
 @Input() type: string;
  constructor() { }
     trellisBarChart(minutesWatched: any, names: any) {
        const maxValue = Math.max.apply(null, minutesWatched);
        const self = this;
        const charts = [],
            $containers = $('#trellis td'),
            datasets = [{ name: ' ', data: minutesWatched, }];
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
                        colorByPoint: true,
                        point: {
                            events: {
                                click: function () {
                                    // alert('campaign: ' + this.category + ', value: ' + this.y);
                                    self.clickedTrellisChart();
                                }
                            }
                        }
                    }
                },
                colors: ['#2e37d8','#c42dd8','#d82d2d','#d8d52d','#2dd838','#2dd8be','#3D96AE','#b5ca92','#2e37d8','#c42dd8'],
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: names,
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

  clickedTrellisChart(){

  }  
  ngOnInit() {
    if(this.type==='dashboard'){
     // this.trellisBarChart(minutesWatched: any, names: any);

    }else if(this.type === 'video-based-report'){
     // this.trellisBarChart(minutesWatched, names);

    }
  }

}
