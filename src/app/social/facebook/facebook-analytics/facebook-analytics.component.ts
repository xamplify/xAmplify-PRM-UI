import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';

import {FacebookFansGenderAge} from "../../models/facebook-fans-gender-age";

declare var Highcharts: any;
@Component( {
    selector: 'app-facebook-analytics',
    templateUrl: './facebook-analytics.component.html',
    styleUrls: ['./facebook-analytics.component.css']
})
export class FacebookAnalyticsComponent implements OnInit {

    page: any;
    fanCount: number;
    pageFansGenderAge: any;
    pageFansCountry: any;
    metricsArray = ['page_fans_gender_age', 'page_fans_country'];

    facebookFansGenderAge: FacebookFansGenderAge = new FacebookFansGenderAge();
    
    constructor( private route: ActivatedRoute, private facebookService: FacebookService ) {
    }
    ngAfterContentInit(){
        this.pageFanAddsVsRemoves();
        this.pageImpressions();
    }
    getPage( pageId: string ) {
        this.facebookService.getPage( localStorage.getItem( 'facebook' ), pageId )
            .subscribe(
            data => {
                this.page = data;
                this.fanCount = data.extraData.fan_count;
            },
            error => console.log( error ),
            () => console.log( this.page )
            );
    }

    calculateGenderRatio() {
        let rawData = this.pageFansGenderAge.values[this.pageFansGenderAge.values.length - 1].value;
        this.facebookFansGenderAge.maleFollowersData = [];
        this.facebookFansGenderAge.femaleFollowersData = [];
        for ( var i in this.facebookFansGenderAge.ageRange ) {
            let male = 0;
            let female = 0;
            for ( var j in rawData ) {
                if ( j.indexOf( this.facebookFansGenderAge.ageRange[i] ) >= 0 ) {
                    if ( j.toUpperCase().indexOf( 'M' ) >= 0 )
                        male = rawData[j];
                    else
                        female = rawData[j];
                }
            }
            this.facebookFansGenderAge.maleFollowersData.push( male );
            this.facebookFansGenderAge.femaleFollowersData.push( female );
        }

        for ( var i in this.facebookFansGenderAge.maleFollowersData )
            this.facebookFansGenderAge.maleFollowers += this.facebookFansGenderAge.maleFollowersData[i];
        for ( var i in this.facebookFansGenderAge.femaleFollowersData )
            this.facebookFansGenderAge.femaleFollowers += this.facebookFansGenderAge.femaleFollowersData[i];
        this.facebookFansGenderAge.totalFollowers = this.facebookFansGenderAge.maleFollowers + this.facebookFansGenderAge.femaleFollowers;

        Highcharts.chart('insight-gender-age', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'People who have liked your page'
        },
        colors: ['#007bb6', '#ff2c82'],
        xAxis: {
            categories: this.facebookFansGenderAge.ageRange
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Gender Demographics'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Male',
            data: this.facebookFansGenderAge.maleFollowersData
        }, {
            name: 'Female',
            data: this.facebookFansGenderAge.femaleFollowersData
        }]
    });
    }

    getInsight( ownerId: string, metrics: string, period: string ) {
        console.log( metrics );
        this.facebookService.getInsight( localStorage.getItem( 'facebook' ), ownerId, metrics, period )
            .subscribe(
            data => {
                switch ( metrics ) {
                    case 'page_fans_gender_age':
                        this.pageFansGenderAge = data;
                        this.calculateGenderRatio();
                        break;
                    case 'page_fans_country':
                        this.pageFansCountry = data;
                        this.renderMap();
                        break;
                    default:
                        break;
                }
                console.log( metrics + this.pageFansGenderAge );
            },
            error => console.log( error ),
            () => console.log( 'getInsight() Finished.' )        
            );
    }
    
    renderMap(){
        let countryData = this.pageFansCountry.values[this.pageFansCountry.values.length - 1].value;
        var data = [];
        for(var i in countryData){
            var arr = [i.toLowerCase(), parseInt(countryData[i])];
            data.push(arr);
        }

        // Create the chart
        Highcharts.mapChart('insight-fans-country', {
            chart: {
                map: 'custom/world'
            },
            title: {
                text: 'The people who like your Page'
            },
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            colorAxis: {
                min: 0
            },

            series: [{
                data: data,
                name: 'Fans',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                }
            }]
        });

    }
    
    pageFanAddsVsRemoves(){
        Highcharts.chart('insight-fan-adds-removes', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Page Insight New Fans Vs Unliked'
            },
            xAxis: [{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'New Fans',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Unliked',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'New Fans',
                type: 'column',
                yAxis: 1,
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                tooltip: {
                    valueSuffix: ''
                }

            }, {
                name: 'Unliked',
                type: 'spline',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                tooltip: {
                    valueSuffix: ''
                }
            }]
        });
    }
    
    pageImpressions(){
        Highcharts.chart('page-impressions', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Page Impressions'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Impression'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Value',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

            }]
        });
    }

    ngOnInit() {
        try {
            const ownerId = this.route.snapshot.params['ownerId'];
            this.getPage( ownerId );
            for ( var i in this.metricsArray )
                this.getInsight( ownerId, this.metricsArray[i], 'lifetime' );
        } catch ( err ) {
            console.log( err );
        }
    }
}