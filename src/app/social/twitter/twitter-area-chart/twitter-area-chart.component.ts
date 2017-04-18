import { Component, OnInit } from '@angular/core';
import { ChartModule  } from 'angular2-highcharts';
import {TwitterService} from '../../services/twitter.service';

@Component( {
    selector: 'app-twitter-area-chart',
    styles: [`chart {display: block;height: 68%;width: 100%;}`],
    template: `<div style="min-width:100px; height:350px"><chart [options]="options"></chart></div>`
})

export class TwitterAreaChartComponent implements OnInit {
    constructor( private twitterService: TwitterService ) {
        this.getFollowersHistory();
    }
    getFollowersHistory() {
        this.twitterService.getfollowersHistory()
            .subscribe(
            data => {
                var values: Array<any> = [];
                for ( var i = 0; i < data.length; i++ ) {
                    values.push( [parseInt( data[i][0] ), parseInt( data[i][1] )] );
                }
                this.constructChart( values );
            },
            error => console.log( error ),
            () => console.log( "getFollowersHistory finished." )
            );
    }
    constructChart( data: any ) {
        this.options = {
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
        };
    }
    options: Object;

    ngOnInit() {
    }

}
