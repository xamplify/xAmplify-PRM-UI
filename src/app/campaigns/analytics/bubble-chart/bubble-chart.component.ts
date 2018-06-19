import { Component, OnInit, Input } from '@angular/core';
import { CampaignService } from '../../../campaigns/services/campaign.service';
import { ReferenceService } from '../../../core/services/reference.service';
declare var Highcharts: any;

@Component({
        selector: 'app-bubble-chart',
        templateUrl: './bubble-chart.component.html',
        styleUrls: []
})

export class BubbleChartComponent implements OnInit {
        @Input() campaignId: number;
        campaignType: any;
        namesArray = [];
        constructor(public campaignService: CampaignService, public referenceService: ReferenceService) { }

      getCampaignUserWatchedMinutesCountes(campaignId: number, campaignType) {
        console.log(this.campaignType);
        this.campaignService.getCampaignUserWatchedMinutes(campaignId, campaignType)
                .subscribe(
                data => {
                console.log(data);
              //  const names=  [ "PALLAVI",  "pavan","RAFI", "sravan", "santhosh","Manas","k", "HANUMANTHA","asdg", "yeerye" ];
                const colors =['#d0e4f8','#d1d190','#dbdbdc','#ebb995','#e1efec','#b9acbb', '#c9a8ca','#d9c997','#d2e6f9','#f0cdfc'];
                // const valuess = [[ 16, 45,  2.97  ], [ 11, 38,2.54 ],[ 0, 47, 1.65 ],
                //                 [ 5,  38, 0.53],[ 2, 36.7, 0.45 ], [ 5,42, 0.25],
                //                 [ 1,   45, 0.2  ],  [ -5,  42,  0.06 ], [6,4,0.5], [7,8,0.88]];

                this.bubbleChart(data.names, data.legend, data.values);
                for(let i=0; i< data.names.length; i++){
                     ///   if(data.names[i].length > 0){
                        const obj = {'emailId':data.names[i].emailId,
                                     'firstName': data.names[i].firstName,
                                     'lastName':data.names[i].lastName,
                                     'color': colors[i]};
                        console.log(obj);
                        this.namesArray.push(obj);
                    //    } else { }
                }
                console.log(this.namesArray);
                },
                error => console.log(error),
                () => console.log() )
        }

        bubbleChart(names,legends, values) {
                let hoverValue: any;
                if(this.campaignType ==='VIDEO'){ hoverValue = 'Minutes Watched';
                } else {   hoverValue = 'Email Opened';  }
                Highcharts.chart('bubble-chart', {

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
                                          // <b>{series.name.firstName}{series.name.lastName}</b><br>
                                                headerFormat: '{series.name.emailId}<br>',
                                                pointFormat: hoverValue+':  {point.z}'

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
        }
      getCampaignById(campaignId: number) {
        const obj = { 'campaignId': campaignId }
        this.campaignService.getCampaignById(obj)
        .subscribe(
         data => {
          console.log(data);
          const campaignType = data.campaignType.toLocaleString();
          if(campaignType.includes('VIDEO')){
                this.campaignType = 'VIDEO';
                } else if (campaignType.includes('SOCIAL')) {
                this.campaignType = 'SOCIAL';
                } else {
                this.campaignType = 'REGULAR';
                }

          this.getCampaignUserWatchedMinutesCountes(this.campaignId, this.campaignType);

          }
          );
       }
        ngOnInit() {
                console.log(this.campaignType);
                // this.getCampaignUserWatchedMinutesCountes(this.campaignId);
                this.getCampaignById(this.campaignId)
        }

}
