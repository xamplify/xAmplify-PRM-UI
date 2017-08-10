import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../models/campaign';

import { CampaignService } from '../services/campaign.service';
import { UtilService } from '../../core/services/util.service';
import { AuthenticationService } from '../../core/services/authentication.service';

declare var $, Highcharts: any;
@Component( {
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.css', './timeline.css']
})
export class AnalyticsComponent implements OnInit {
    isTimeLineView: boolean;
    campaign: Campaign;
    numbers: string[] = new Array();
    heatMapData: any;
    selectedRow: any = new Object();
    videoLength: number;
    campaignviews: any;
    countryWiseCampaignViews: any;

    emailOpenCount: number = 0;
    emailClickedCount: number = 0;
    emailSentCount: number = 0;

    constructor( private route: ActivatedRoute, private campaignService: CampaignService, private utilService: UtilService, private authenticationService: AuthenticationService ) {
        this.isTimeLineView = false;
        this.campaign = new Campaign();

    }
    showTimeline() {
        this.isTimeLineView = !this.isTimeLineView;
    }

    getCampaignById( campaignId: number ) {
        var obj = { 'campaignId': campaignId }
        this.campaignService.getCampaignById( obj )
            .subscribe(
            data => {
                this.campaign = data;
            },
            error => console.log( error ),
            () => console.log()
            )
    }

    getHeatMap(item: any) {
        this.heatMapData = "";
        this.numbers = [];
        this.selectedRow = item;
        this.isTimeLineView = !this.isTimeLineView;
        this.campaignService.getHeatMap( item.userId, item.campaignId )
            .subscribe(
            data => {
                this.heatMapData = data;
                for(var i=0; i<=100; i++){
                    this.numbers.push(this.utilService.convertSecondsToHHMMSS(this.heatMapData.videoLength*i/100));
                }
                console.log(this.numbers);
            },
            error => console.log( error ),
            () => console.log()
            )
    }

    getCampaignView( campaignId: number ) {
        this.campaignService.getCampaignView( campaignId )
            .subscribe(
            data => {
                this.campaignviews = data.campaignviews;
            },
            error => console.log( error ),
            () => console.log()
            )
    }
    
    getEmailOpenCount( campaignId: number ) {
        this.campaignService.getEmailOpenCount( campaignId )
            .subscribe(
            data => {
                this.emailOpenCount = data.email_open_count;
            },
            error => console.log( error ),
            () => console.log()
            )
    }
    
    getEmailClickedCount( campaignId: number ){
        this.campaignService.getEmailClickedCount( campaignId )
        .subscribe(
        data => {
            this.emailClickedCount = data.email_gif_clicked_count;
        },
        error => console.log( error ),
        () => console.log()
        )
    }
    
    getEmailSentCount( campaignId: number ){
        this.campaignService.getEmailSentCount( campaignId )
        .subscribe(
        data => {
            this.emailSentCount = data.emails_sent_count;
        },
        error => console.log( error ),
        () => console.log()
        )
    }
    
    getCountryWiseCampaignViews(campaignId: number){
        this.campaignService.getCountryWiseCampaignViews( campaignId )
        .subscribe(
        data => {
            this.countryWiseCampaignViews = data;
            this.renderMap();
        },
        error => console.log( error ),
        () => console.log()
        )
    }
    
    renderMap() {
        let countryData = this.countryWiseCampaignViews;
        var data = [];
        for ( var i in countryData ) {
            var arr = [countryData[i][0].toLowerCase(), countryData[i][1]];
            data.push( arr );
        }

        // Create the chart
        Highcharts.mapChart( 'world-map', {
            chart: {
                map: 'custom/world'
            },
            title: {
                text: 'The people who watch the campaign video'
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
            credits: {
                enabled: false
            },
            series: [{
                data: data,
                name: 'Views',
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

    ngOnInit() {
        const userId = this.authenticationService.getUserId();
        let campaignId = this.route.snapshot.params['campaignId'];

        this.getCampaignById( campaignId );
        this.getCountryWiseCampaignViews(campaignId);
        this.renderMap();

        this.getEmailOpenCount( campaignId );
        this.getEmailClickedCount( campaignId );
        this.getEmailSentCount( campaignId );

        this.getCampaignView( campaignId );
    }

}
