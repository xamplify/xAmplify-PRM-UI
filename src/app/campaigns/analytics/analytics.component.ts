import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../models/campaign';
import { CampaignReport } from '../models/campaign-report';

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
    campaignViews: any;
    countryWiseCampaignViews: any;
    
    campaignReport: CampaignReport = new CampaignReport;


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

    listCampaignViews( campaignId: number ) {
        this.campaignService.listCampaignViews( campaignId )
            .subscribe(
            data => {
                this.campaignViews = data.campaignviews;
            },
            error => console.log( error ),
            () => console.log()
            )
    }
    
    getCampaignViewsReportDurationWise( campaignId: number ) {
        this.campaignService.getCampaignViewsReportDurationWise( campaignId )
            .subscribe(
            data => {
                this.campaignReport.thisMonthViewsCount = data.this_month_count;
                this.campaignReport.lifetimeViewsCount = data.lifetime_count;
                this.campaignReport.todayViewsCount = data.today_count;
            },
            error => console.log( error ),
            () => console.log()
            )
}
    
    getEmailSentCount( campaignId: number ) {
        this.campaignService.getEmailSentCount( campaignId )
            .subscribe(
            data => {
                this.campaignReport.emailSentCount = data.emails_sent_count;
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
                text: 'The people who have watched the campaign video'
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
    
    getEmailLogCountByCampaign( campaignId: number ) {
        this.campaignService.getEmailLogCountByCampaign( campaignId )
            .subscribe(
            data => {
                this.campaignReport.emailOpenCount = data["email_opened_count"];
                this.campaignReport.emailClickedCount = data["email_url_clicked_count"];
            },
            error => console.log( error ),
            () => console.log()
            )
    }
    
    getCampaignWatchedUsersCount(campaignId : number){
        this.campaignService.getCampaignWatchedUsersCount( campaignId )
        .subscribe(
        data => {
            this.campaignReport.usersWatchCount = data.campaign_users_watched;
        },
        error => console.log( error ),
        () => console.log()
        )
    }
    
    usersWatchList(campaignId: number){
        this.campaignService.usersWatchList( campaignId )
        .subscribe(
        data => {
            this.campaignReport.usersWatchList = data.data;
            $('#usersWatchListModal').modal();
        },
        error => console.log( error ),
        () => console.log()
        )
    }
    
    emailActionList(campaignId: number, actionId: number, emailActionName: string){
        this.campaignService.emailActionList( campaignId, actionId )
        .subscribe(
        data => {
            this.campaignReport.emailActionList = data.data;
            this.campaignReport.emailActionName = emailActionName;
            $('#emailActionListModal').modal();
        },
        error => console.log( error ),
        () => console.log()
        )
    }

    ngOnInit() {
        const userId = this.authenticationService.getUserId();
        let campaignId = this.route.snapshot.params['campaignId'];

        this.getCampaignById( campaignId );
        this.getCountryWiseCampaignViews(campaignId);
        this.renderMap();

        this.getEmailSentCount( campaignId );
        this.getEmailLogCountByCampaign( campaignId );
        this.getCampaignWatchedUsersCount( campaignId );

        this.getCampaignViewsReportDurationWise( campaignId );
        this.listCampaignViews( campaignId );
    }

}
