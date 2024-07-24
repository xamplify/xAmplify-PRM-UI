import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { FacebookFansGenderAge } from "../../models/facebook-fans-gender-age";
import { SocialConnection } from '../../models/social-connection';

declare var Highcharts: any;
@Component( {
    selector: 'app-facebook-analytics',
    templateUrl: './facebook-analytics.component.html',
    styleUrls: ['./facebook-analytics.component.css']
})
export class FacebookAnalyticsComponent implements OnInit {

    fanCount: number;
    pageFansGenderAge: any;
    pageFansCountry: any;
    metricsArray = ['page_fans_gender_age', 'page_fans_country'];
    socialConnection: SocialConnection;

    facebookFansGenderAge: FacebookFansGenderAge = new FacebookFansGenderAge();

    constructor( private route: ActivatedRoute, private facebookService: FacebookService,
        private authenticationService: AuthenticationService, private socialService: SocialService ) {
    }
    ngAfterContentInit() {
        this.pageFanAddsVsRemoves();
        this.pageImpressions();
    }
    getPageFanCount( socialConnection: SocialConnection, pageId: string ) {
        this.facebookService.getPageFanCount( socialConnection, pageId )
            .subscribe(
            data => {
                this.fanCount = data.fan_count;
            },
            error => console.log( error ),
            () => {
                if(this.fanCount > 100){
                    for ( var i in this.metricsArray )
                        this.getInsight( this.socialConnection, this.socialConnection.profileId, this.metricsArray[i], 'lifetime' );
                }
            }
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

        Highcharts.chart( 'insight-gender-age', {
            chart: {
                type: 'bar'
            },
            exporting: { enabled: false },
            title: {
                text: 'Gender Demographics'
            },
            colors: ['#007bb6', '#ff2c82'],
            xAxis: {
                categories: this.facebookFansGenderAge.ageRange
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
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

    getInsight( socialConnection: SocialConnection, ownerId: string, metrics: string, period: string ) {
        this.facebookService.getInsight( socialConnection, ownerId, metrics, period )
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

    renderMap() {
        let countryData = this.pageFansCountry.values[this.pageFansCountry.values.length - 1].value;
        var data = [];
        for ( var i in countryData ) {
            var arr = [i.toLowerCase(), parseInt( countryData[i] )];
            data.push( arr );
        }

        // Create the chart
        Highcharts.mapChart( 'insight-fans-country', {
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

    pageFanAddsVsRemoves() {
        Highcharts.chart( 'insight-fan-adds-removes', {
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
                backgroundColor: ( Highcharts.theme && Highcharts.theme.legendBackgroundColor ) || '#FFFFFF'
            },
            series: [{
                name: 'New Fans',
                type: 'column',
                yAxis: 1,
                data: [49, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
                tooltip: {
                    valueSuffix: ''
                }

            }, {
                name: 'Unliked',
                type: 'spline',
                data: [7, 6, 9, 14, 18, 21, 25, 26, 23, 18, 13, 9],
                tooltip: {
                    valueSuffix: ''
                }
            }]
        });
    }

    pageImpressions() {
        Highcharts.chart( 'page-impressions', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Page Impressions'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
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
                data: [49, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54]

            }]
        });
    }
    getSocialConnectionByUserIdAndProfileId( userId: number, profileId: string ) {
      this.socialService.getSocialConnectionByUserIdAndProfileId(userId, profileId)
        .subscribe(
          data => {
            this.socialConnection = data;
            this.getPageFanCount( this.socialConnection, profileId );
          },
          error => console.log( error ),
          () => {}
        );
  }

    setGlobalFontStyle() {
        Highcharts.setOptions({
            chart: {
                style: {
                    fontFamily: 'Open Sans,sans-serif'
                }
            },
            title: {
                style: { "color": "#666", "fontSize": "13px" }
            },
            credits: {
                enabled: false
            },
        });
    }

    ngOnInit() {
        try {
            const profileId = this.route.snapshot.params['profileId'];
            const userId = this.authenticationService.getUserId();
            this.setGlobalFontStyle();
            this.getSocialConnectionByUserIdAndProfileId( userId, profileId );

        } catch ( err ) {
            console.log( err );
        }
    }
}