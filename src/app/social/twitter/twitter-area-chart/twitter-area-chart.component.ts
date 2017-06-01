import { Component, OnInit } from '@angular/core';
import { ChartModule  } from 'angular2-highcharts';
import {TwitterService} from '../../services/twitter.service';

declare var Highcharts: any;
@Component( {
    selector: 'app-twitter-area-chart',
    template: `<div id="twitter-area-chart"></div>`
})

export class TwitterAreaChartComponent implements OnInit {
    constructor( private twitterService: TwitterService ) {
    }
    getFollowersHistory() {
        this.twitterService.getfollowersHistory()
            .subscribe(
            data => {
                var values: Array<any> = [
[Date.UTC(2013,5,2),0.7695],
[Date.UTC(2013,5,3),0.7648],
[Date.UTC(2013,5,4),0.7645],
[Date.UTC(2013,5,5),0.7638],
[Date.UTC(2013,5,6),0.7549],
[Date.UTC(2013,5,7),0.7562],
[Date.UTC(2013,5,9),0.7574],
[Date.UTC(2013,5,10),0.7543],
[Date.UTC(2013,5,11),0.7510]];
                /*for ( var i = 0; i < data.length; i++ ) {
                    values.push( [parseInt( data[i][0] ), parseInt( data[i][1] )] );
                }*/
                this.constructChart( values );
            },
            error => console.log( error ),
            () => console.log( "getFollowersHistory finished." )
            );
    }
    constructChart( data: any ) {

        Highcharts.chart( 'twitter-area-chart', {
            chart: { type: 'area', zoomType: 'x' },
            title: { text: 'Followers Demographics' },
            subtitle: { text: 'click and drag in plot area to zoom in' },
            xAxis: {
                type: 'datetime',
                allowDecimals: false,
            },
            yAxis: {
                title: {
                    text: 'Followers Count'
                }
            },
            tooltip: {
                pointFormat: '{series.name} produced <b>{point.y:,.0f}</b>'
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'Followers',
                data: data
            }]
        });
     
    }
    ngOnInit() {
        this.getFollowersHistory();
    }

}
