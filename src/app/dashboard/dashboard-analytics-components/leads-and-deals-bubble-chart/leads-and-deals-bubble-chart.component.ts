import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
declare var Highcharts: any;

@Component({
  selector: 'app-leads-and-deals-bubble-chart',
  templateUrl: './leads-and-deals-bubble-chart.component.html',
  styleUrls: ['./leads-and-deals-bubble-chart.component.css']
})
export class LeadsAndDealsBubbleChartComponent implements OnInit {
  loading = false;
  @Input() moduleType:any;
  @Input() applyFilter:boolean;
  names: Array<any>;
  colors =['#d0e4f8','#d1d190','#dbdbdc','#ebb995','#e1efec','#b9acbb', '#c9a8ca','#d9c997','#d2e6f9','#f0cdfc'];
  constructor(public dashboardService:DashboardService,public xtremandLogger:XtremandLogger,public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.getBubbleChartDataByType();
  }

  getBubbleChartDataByType(){
    this.loading = true;
    this.dashboardService.getBubbleChartDataByType(this.moduleType,this.applyFilter).subscribe(
      data=>{
          this.names = data.names;
          this.names.forEach((element, index) => {
            element.color = this.colors[index];
           });
           this.bubbleChart(this.names, data.values);
      },error=>{
        this.xtremandLogger.error(error);
        this.loading = false;
      }
    );
  }

  bubbleChart(names, values) {
    let hoverValue = this.moduleType;
    Highcharts.chart(hoverValue, {
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

            plotOptions: {
                    bubble: {
                            tooltip: {
                                    headerFormat: '<b>{series.name.name}</b><br><br>',
                                    pointFormat: hoverValue+': {series.name.weight}'

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
                    showInLegend: false,
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
                    showInLegend: false,
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
                    showInLegend: false,
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
                     showInLegend: false,
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
                     showInLegend: false,
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
                     showInLegend: false,
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
                     showInLegend: false,
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
                     showInLegend: false,
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
                     showInLegend: false,
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
                     showInLegend: false,
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
    this.loading = false;
}

}
