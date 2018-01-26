import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { SocialConnection } from '../../social/models/social-connection';
import { Campaign } from '../../campaigns/models/campaign';
import { CampaignReport } from '../../campaigns/models/campaign-report';

import { DashboardService } from '../dashboard.service';
import { TwitterService } from '../../social/services/twitter.service';
import { FacebookService } from '../../social/services/facebook.service';
import { SocialService } from '../../social/services/social.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { UtilService } from '../../core/services/util.service';

import { SocialStatusProvider } from '../../social/models/social-status-provider';
import { ContactService } from '../../contacts/services/contact.service';
import { UserService } from '../../core/services/user.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { ReferenceService } from '../../core/services/reference.service';
import { VideoFileService } from '../../videos/services/video-file.service';
import { Pagination } from '../../core/models/pagination';
import { DashboardReport } from '../../core/models/dashboard-report';
import { UserDefaultPage } from '../../core/models/user-default-page';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var Metronic, swal, $, Layout, Login, Demo, Index, QuickSidebar, Highcharts, Tasks: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [DashboardService, Pagination, DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {

    dashboardStates: any;
    socialeMedia: any;
    dashboardReport: DashboardReport = new DashboardReport();
    userDefaultPage: UserDefaultPage = new UserDefaultPage();
    weeklyTweetsCount: number;
    socialConnections: SocialConnection[] = new Array<SocialConnection>();
    totalRecords: number;
    campaigns: Campaign[];
    launchedCampaignsMaster: any[];
    launchedCampaignsChild: any[] = new Array<any>();
    totalCampaignsCount: number;
    campaignReportType: string;
    campaignReportOptions = ['RECENT', 'TRENDING', 'CUSTOM'];
    countryViewsData: any;
    loggedInUserId: number;
    userCampaignReport: CampaignReport = new CampaignReport();
    hasCampaignRole = false;
    hasStatsRole = false;
    hasSocialStatusRole = false;
    categories: any;
    heatMapData: any;
    maxBarChartNumber: number;
    isMaxBarChartNumber = true;
    downloadDataList = [];
    paginationType: string;
    worldMapUserData: any;
    sortDates = [{ 'name': '7 Days', 'value': 7 }, { 'name': '14 Days)', 'value': 14 },
    { 'name': '21 Days)', 'value': 21 }, { 'name': '30 Days)', 'value': 30 }];
    daySort: any;
    constructor(public router: Router, public dashboardService: DashboardService, public pagination: Pagination,
        public contactService: ContactService, public videoFileService: VideoFileService, public twitterService: TwitterService,
        public facebookService: FacebookService, public socialService: SocialService,
        public authenticationService: AuthenticationService, public utilService: UtilService, public userService: UserService,
        public campaignService: CampaignService, public referenceService: ReferenceService,
        public pagerService: PagerService, public xtremandLogger: XtremandLogger, public datePipe: DatePipe) {
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
        this.hasStatsRole = this.referenceService.hasRole(this.referenceService.roles.statsRole);
        this.hasSocialStatusRole = this.referenceService.hasRole(this.referenceService.roles.socialShare);
        this.daySort = this.sortDates[0];
    }

    genderDemographics(userId: number) {
        this.socialService.genderDemographics(userId)
            .subscribe(
            data => {
                this.dashboardReport.genderDemographicsMale = data['M'];
                this.dashboardReport.genderDemographicsFemale = data['F'];
                this.dashboardReport.genderDemographicsTotal =
                    this.dashboardReport.genderDemographicsMale + this.dashboardReport.genderDemographicsFemale;
            },
            error => console.log(error),
            () => { }
            );

    }

    getGenderDemographics(socialConnection: SocialConnection) {
        this.dashboardService.getGenderDemographics(socialConnection)
            .subscribe(
            data => {
                this.xtremandLogger.info(data);
                this.dashboardReport.genderDemographicsMale = data['male'];
                this.dashboardReport.genderDemographicsFemale = data['female'];
            },
            error => console.log(error),
            () => console.log('finished')
            );
    }

    viewsSparklineData(result, dates) {
        const self = this;
        const myvalues = result;
        const offsetValues = dates;
        $('#sparkline_bar').sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222',
            tooltipFormat: '<span >views:{{value}} <br>{{offset:offset}}</span>',
            tooltipValueLookups: { 'offset': offsetValues }
        });
        $(document).ready(function () {
            $('#sparkline_bar').bind('sparklineClick', function (ev) {
                const sparkline = ev.sparklines[0],
                    region = sparkline.getCurrentRegionFields();
                // alert("Clicked on offset=" + offsetValues[region[0].offset] + " having value=" + region[0].value);
                self.sparklineDataWithRouter(region[0].value, offsetValues[region[0].offset], "views");
            });
        });
    }
    sparklineDataWithRouter(value: number, date: any, reportName: string) {
        if (date === undefined || date === null) {
            console.log("date is " + date);
        } else {
            this.referenceService.viewsDate = date;
            this.referenceService.clickedValue = value;
            this.referenceService.reportName = reportName;
            this.router.navigate(['./home/dashboard/reports']);
        }
    }

    minutesSparklineData(result, dates) {
        const self = this;
        const myvalues = result;
        const offsetValues = dates;
        $('#sparkline_bar2').sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222',
            tooltipFormat: '<span >minutes:{{value}} <br>{{offset:offset}}</span>',
            tooltipValueLookups: { 'offset': offsetValues }
        });
        $(document).ready(function () {
            $('#sparkline_bar2').bind('sparklineClick', function (ev) {
                const sparkline = ev.sparklines[0],
                    region = sparkline.getCurrentRegionFields();
                // alert("Clicked on offset=" + offsetValues[region[0].offset] + " having value=" + region[0].value);
                self.sparklineDataWithRouter(region[0].value, offsetValues[region[0].offset], "minutes watched");
            });
        });
    }

    averageSparklineData(result, dates) {
        const myvalues = result;
        console.log(myvalues);
        const offsetValues = dates;
        $('#sparkline_line').sparkline(myvalues, {
            type: 'line',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222',
            // tooltipFormat: '<span >average:{{value}} <br>{{offset:offset}}</span>',
            tooltipValueLookups: { 'offset': offsetValues }
        });
    }

    renderWorldMap() {
        const data = this.countryViewsData;
        const self = this;
        Highcharts.mapChart('world-map', {
            chart: {
                map: 'custom/world'
            },
            exporting: { enabled: false },
            title: {
                text: 'The people who have watched the video',
                style: {
                    color: '#696666',
                    fontWeight: 'normal',
                    fontSize: '14px'
                }
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
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (e) {
                            console.log(e);
                            self.worldMapCampaignDetails(e.point['hc-key'])
                        }
                    }
                }
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
    generatHeatMap(heatMapData) {
        const self = this;
        const data = heatMapData;
        console.log(data);
        Highcharts.chart('dashboard-heat-map', {
            colorAxis: {
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },
            credits: {
                enabled: false
            },
            exporting: { enabled: false },
            tooltip: {
                formatter: function () {
                    return 'campaign name: <b>' + this.point.name + '</b><br> email open count: <b>' + this.point.value + '</b>' + '</b><br>users: <b>' + this.point.totalUsers + '</b><br>launchTime:<b>' + this.point.launchTime + '</b>';
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        // align: 'left',
                        // verticalAlign: 'top',
                        style: {
                            fontWeight: 'normal',
                            fontSize: '13px',
                            color: 'block',
                        }
                        //  formatter: function() {
                        //     return this.point.options.name+"<br> "+this.point.options.value
                        // },
                    },
                    events: {
                        click: function (event) {
                            self.router.navigate(['./home/campaigns/' + event.point.campaignId + '/details']);
                        }
                    }
                }
            },
            series: [{
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                showInLegend: false,
                data: data
            }],
            title: {
                text: ' '
            },
            legend: {
                enabled: false
            }
        });
    }
    generateBarChartForEmailLogs(names, opened, clicked, watched, maxValue: number) {
        const charts = [],
            $containers = $('#trellis td'),
            datasets = [
                {
                    name: 'opened',
                    data: opened
                },
                {
                    name: 'clicked',
                    data: clicked
                },
                {
                    name: 'watched',
                    data: watched
                },
            ];
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
                credits: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        minPointLength: 3
                    },
                    series: {
                        point: {
                            events: {
                                click: function () {
                                    //  alert('campaign: ' + this.category + ', value: ' + this.y);
                                }
                            }
                        }
                    }
                },
                xAxis: {
                    categories: names,
                    labels: {
                        enabled: i === 0
                    }
                },
                exporting: { enabled: false },
                yAxis: {
                    allowDecimals: false,
                    visible: false,
                    title: {
                        text: null
                    },
                    min: 0,
                    max: maxValue
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

    // TFFF == TweetsFriendsFollowersFavorites
    getTotalCountOfTFFF(socialConnection: SocialConnection) {
        this.xtremandLogger.log('getTotalCountOfTFFF() method invoke started.');
        this.twitterService.getTotalCountOfTFFF(socialConnection)
            .subscribe(
            data => {
                this.xtremandLogger.log(data);
                socialConnection.twitterTotalTweetsCount = data['tweetsCount'];
                socialConnection.twitterTotalFollowersCount = data['followersCount'];
                socialConnection.twitterTotalFriendsCount = data['friendsCount'];
            },
            error => console.log(error),
            () => console.log('getTotalCountOfTFFF() method invoke started finished.')
            );
    }

    getPage(socialConnection: SocialConnection, pageId: string) {
        this.facebookService.getPage(socialConnection, pageId)
            .subscribe(
            data => {
                socialConnection.facebookFanCount = data.extraData.fan_count;
            },
            error => console.log(error),
            () => { }
            );
    }
    
    getFriends(socialConnection: SocialConnection) {
        this.facebookService.getFriends(socialConnection)
            .subscribe(
            data => {
                console.log(data);
                // socialConnection.facebookFriendsCount = data.extraData.fan_count;
            },
            error => console.log(error),
            () => { }
            );
    }
    
    getPosts( socialConnection: SocialConnection ) {
        this.facebookService.getPosts( socialConnection )
        .subscribe(
            data => {
                console.log( data );
            },
            error => console.log( error ),
            () => console.log( 'getPosts() Finished.' )
        );
    }

    getWeeklyPosts(socialConnection: SocialConnection) {
        this.facebookService.getWeeklyPosts(socialConnection)
            .subscribe(
            data => {
                const dates = [];
                const values = [];
                for (const i of Object.keys(data)) {
                    dates.push(i);
                    values.push(data[i]);
                }

                $('#sparkline_' + socialConnection.profileId).sparkline(values, {
                    type: 'bar',
                    padding: '5px',
                    barWidth: '4',
                    height: '20',
                    barColor: '#00ACED',
                    barSpacing: '3',
                    negBarColor: '#e02222',
                    tooltipFormat: '<span>Posts:{{value}}<br>{{offset:offset}}</span>',
                    tooltipValueLookups: { 'offset': dates }

                });
            },
            error => console.log(error),
            () => console.log('getWeeklyTweets() method invoke started finished.')
            );
    }

    getWeeklyTweets(socialConnection: SocialConnection) {
        this.twitterService.getWeeklyTweets(socialConnection)
            .subscribe(
            data => {
                const dates = [];
                const values = [];
                for (const i of Object.keys(data)) {
                    dates.push(i);
                    values.push(data[i]);
                }
                $('#sparkline_' + socialConnection.profileId).sparkline(values, {
                    type: 'bar',
                    padding: '5px',
                    barWidth: '4',
                    height: '20',
                    barColor: '#00ACED',
                    barSpacing: '3',
                    negBarColor: '#e02222',
                    tooltipFormat: '<span>Tweets:{{value}}<br>{{offset:offset}}</span>',
                    tooltipValueLookups: { 'offset': dates }
                });
                let count = 0;
                $.each(data, function (index: number, value: number) {
                    count += value;
                });
                this.weeklyTweetsCount = count;
            },
            error => console.log(error),
            () => console.log('getWeeklyTweets() method invoke started finished.')
            );
    }

    listActiveSocialAccounts(userId: number) {
        this.socialService.listAccounts(userId, 'ALL', 'ACTIVE')
        .subscribe(
        data => {
            this.socialConnections = data;
            this.socialService.socialConnections = data;
            this.socialService.setDefaultAvatar(this.socialConnections);
        },
        error => console.log(error),
        () => {
            if (this.socialConnections.length > 0) {
                for (const i in this.socialConnections) {
                    if (this.socialConnections[i].source === 'TWITTER') {
                        this.getTotalCountOfTFFF(this.socialConnections[i]);
                        this.getGenderDemographics(this.socialConnections[i]);
                        this.getWeeklyTweets(this.socialConnections[i]);
                    } else if(this.socialConnections[i].source === 'FACEBOOK') {
                        this.getWeeklyPosts(this.socialConnections[i]);
                        this.getPosts(this.socialConnections[i]);
                        if(this.socialConnections[i].emailId === null){
                            this.getPage(this.socialConnections[i], this.socialConnections[i].profileId);
                        }else{
                            this.getFriends(this.socialConnections[i]);
                        }
                        
                    }
                }
            }
            console.log('getFacebookAccounts() Finished.');
        }
        );

}

    getDefaultPage(userId: number) {
        this.userService.getUserDefaultPage(userId)
            .subscribe(
            data => {
                if (data['_body'].includes('dashboard')) {
                    this.userDefaultPage.isCurrentPageDefaultPage = true;
                    this.referenceService.userDefaultPage = 'DASHBOARD';
                }
            },
            error => console.log(error),
            () => { }
            );
    }

    setDashboardAsDefaultPage(event: any) {
        this.referenceService.userDefaultPage = event ? 'DASHBOARD' : 'WELCOME';
        this.userService.setUserDefaultPage(this.authenticationService.getUserId(), this.referenceService.userDefaultPage)
            .subscribe(
            data => {
                this.userDefaultPage.isCurrentPageDefaultPage = event;
                this.userDefaultPage.responseType = 'SUCCESS';
                this.userDefaultPage.responseMessage = 'Your setting has been saved successfully';
            },
            error => {
                this.userDefaultPage.responseType = 'ERROR';
                this.userDefaultPage.responseMessage = 'an error occurred while processing your request';
            },
            () => { }
            );
    }

    listCampaignInteractionsData(userId: number, reportType: string) {
        this.campaignService.listCampaignInteractionsData(userId, reportType)
            .subscribe(
            data => {
                this.xtremandLogger.info(data);
                this.campaigns = data;
                console.log(data);
                const campaignIdArray = data.map(function (a) { return a[0]; });
                console.log(campaignIdArray);
                console.log(this.campaigns.length);
                this.totalCampaignsCount = this.campaigns.length;
                if (this.totalCampaignsCount >= 1) {
                    this.getCampaignsEamailBarChartReports(campaignIdArray);
                }
            },
            error => { },
            () => this.xtremandLogger.info('Finished listCampaign()')
            );
    }

    createCampaign(campaignType: string) {
        this.referenceService.selectedCampaignType = campaignType;
        this.router.navigate(['/home/campaigns/create']);
    }

    getUserCampaignReport(userId: number) {
        this.campaignService.getUserCampaignReport(userId)
            .subscribe(
            data => {
                this.userCampaignReport = data['userCampaignReport'];
                this.launchedCampaignsMaster = data['listLaunchedCampaingns'];
            },
            error => { },
            () => {
                this.xtremandLogger.info('Finished getUserCampaignReport()');
                if (this.userCampaignReport == null) {
                    this.userCampaignReport = new CampaignReport();
                    this.userCampaignReport.userId = userId;
                    this.userCampaignReport.campaignReportOption = 'RECENT';
                }

                this.setLaunchedCampaignsChild(this.userCampaignReport);
                this.listCampaignInteractionsData(userId, this.userCampaignReport.campaignReportOption);

            }
            );
    }

    setLaunchedCampaignsChild(userCampaignReport: CampaignReport) {
        if (('CUSTOM' === userCampaignReport.campaignReportOption) && (null != userCampaignReport.campaigns)) {
            const campaignsArray: string[] = userCampaignReport.campaigns.split(',');

            for (const i of Object.keys(campaignsArray)) {
                const result = this.launchedCampaignsMaster.filter(function (obj) {
                    return obj.id === parseInt(campaignsArray[i], 10);
                });
                console.log(result);
                this.launchedCampaignsChild.push(result[0]);
            }
            this.launchedCampaignsMaster = this.launchedCampaignsMaster.filter(x => this.launchedCampaignsChild.indexOf(x) < 0);
        }
    }

    validateUserCampaignReport(userCampaignReport: CampaignReport) {
        let isValid = true;
        if ('CUSTOM' === userCampaignReport.campaignReportOption) {
            const campaignIds: string[] = [];

            $('.launchedCampaignsChild > div >h6').each(function () {
                campaignIds.push($(this).attr('id'));
            });
            userCampaignReport.campaigns = campaignIds.toString();
            if (campaignIds.length > 4) {
                this.setCampaignReportResponse('WARNING', 'You can not add more than 4 campaigns.');
                isValid = false;
            }
            if (campaignIds.length === 0) {
                this.setCampaignReportResponse('WARNING', 'Please select campaigns.');
                isValid = false;
            }
        }

        if (isValid) {
            this.saveUserCampaignReport(userCampaignReport);
        } else {
            return false;
        }
    }

    saveUserCampaignReport(userCampaignReport: CampaignReport) {
        if (userCampaignReport.userId == null) {
            userCampaignReport.userId = this.loggedInUserId;
        }
        this.campaignService.saveUserCampaignReport(userCampaignReport)
            .subscribe(
            data => {
                this.userCampaignReport = data;
                this.setCampaignReportResponse('SUCCESS', 'Campaign Report Option saved successfully.');
                this.listCampaignInteractionsData(userCampaignReport.userId, userCampaignReport.campaignReportOption);
            },
            error => {
                this.setCampaignReportResponse('ERROR', 'An Error occurred while saving the details.');
            },
            () => this.xtremandLogger.info('Finished saveUserCampaignReport()')
            );
    }

    setCampaignReportResponse(response: string, responseMessage: string) {
        this.userCampaignReport.response = response;
        this.userCampaignReport.responseMessage = responseMessage;
    }

    onSelectionChangeCampaignReportOption(userCampaignReportOption: string) {
        this.userCampaignReport.campaignReportOption = userCampaignReportOption;
    }


    dashboardReportsCount() {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.dashboardService.loadDashboardReportsCount(this.loggedInUserId)
            .subscribe(
            data => {
                this.dashboardReport.totalViews = data.totalVideoViewsCount;
                this.dashboardReport.totalContacts = data.totalcontactsCount;
                this.dashboardReport.totalUploadedvideos = data.totalVideosCount;
                this.dashboardReport.toalEmailTemplates = data.totalEmailTemplatesCount;
                this.dashboardReport.totalCreatedCampaigns = data.totalCampaignsCount;
                this.dashboardReport.totalSocialAccounts = data.totalSocialConnectionsCount;
            },
            error => console.log(error),
            () => console.log('dashboard reports counts completed')
            );
    }

    getEmailActionCount(userId: number) {
        this.dashboardService.getEmailActionCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalEmailOpenedCount = data['email_opened_count'];
                this.dashboardReport.totalEmailClickedCount = data['email_url_clicked_count'] + data['email_gif_clicked_count'];
                this.listOfAllEmailClickedLogs();
                this.listOfAllEmailOpenLogs();
            },
            error => console.log(error),
            () => console.log('emailOpenedCount completed')
            );
    }

    emailWatchedCount(userId: number) {
        this.dashboardService.loadEmailWatchedCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalEmailWatchedCount = data['watched-users-count'];
                this.listOfAllWatchedLogs();
            },
            error => console.log(error),
            () => console.log('emailWatchedCount completed')
            );
    }

    setPage(page: number) {
        this.pagination.pageIndex = page;
        if (this.paginationType === 'open') {
            this.listOfEmailOpenLogs(13);
        } else if (this.paginationType === 'clicked') {
            this.listOfEmailClickedLogs();
        } else if (this.paginationType === 'watched') {
            this.listOfWatchedLogs();
        }
    }

    listOfEmailOpenLogs(actionId: number) {
        this.paginationType = 'open';
        this.pagination.maxResults = 10;
        this.dashboardService.listEmailOpenLogs(this.loggedInUserId, actionId, this.pagination)
            .subscribe(
            (result: any) => {
                this.dashboardReport.emailLogList = result;
                this.pagination.totalRecords = this.dashboardReport.totalEmailOpenedCount;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.emailLogList);
            },
            error => console.log(error),
            () => { }
            );
    }

    listOfEmailClickedLogs() {
        this.paginationType = 'clicked';
        this.pagination.maxResults = 10;
        this.dashboardService.listEmailClickedLogs(this.loggedInUserId, this.pagination)
            .subscribe(
            result => {
                this.dashboardReport.emailLogList = result;
                this.pagination.totalRecords = this.dashboardReport.totalEmailClickedCount;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.emailLogList);
            },
            error => console.log(error),
            () => { }
            );
    }

    listOfWatchedLogs() {
        this.xtremandLogger.log(this.pagination);
        this.paginationType = 'watched';
        this.pagination.maxResults = 10;
        this.dashboardService.listOfWatchedLogs(this.loggedInUserId, this.pagination)
            .subscribe(
            (data: any) => {
                this.dashboardReport.emailLogList = data;
                this.pagination.totalRecords = this.dashboardReport.totalEmailWatchedCount;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.emailLogList);
            },
            error => console.log(error),
            () => console.log('finished')
            );
    }

    getCountriesTotalViewsData() {
        this.dashboardService.getCountryViewsDetails().
            subscribe(result => {
                this.countryViewsData = result.countrywiseusers;
                console.log(this.countryViewsData);
                this.renderWorldMap();
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            });
    }

    getCampaignsHeatMapData() {
        this.dashboardService.getCampaignsHeatMapDetails().
            subscribe(result => {
                this.xtremandLogger.log(result.heatMapData);
                this.heatMapData = result.heatMapData;
                this.heatMapformatDateTime();
                console.log(this.heatMapData);
                if (result.heatMapData.length > 0) {
                    this.generatHeatMap(this.heatMapData);
                }
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                // this.xtremandLogger.errorPage(error);
            });
    }

    heatMapformatDateTime() {
        if (this.heatMapData.length > 0) {
            for (let i = 0; i < this.heatMapData.length; i++) {
                const fulldate = this.heatMapData[i].launchTime;
                const fulldate2 = fulldate.split(" ");
                const date = fulldate2[0];
                const replactime = fulldate.replace('-', '/');
                const time = this.formatAMPM(replactime);
                const fullTime = date + ' ' + time;
                this.heatMapData[i].launchTime = fullTime;
            }
        }
    }
    formatAMPM(date) {
        const strTime = new Date(date).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
        return strTime;
    }
    getCampaignsEamailBarChartReports(campaignIdArray) {
        this.dashboardService.getCampaignsEmailReports(campaignIdArray).
            subscribe(result => {
                console.log(result);
                this.categories = result.campaignNames;
                console.log(result.emailOpenedCount.concat(result.emailClickedCount, result.watchedCount))
                this.maxBarChartNumber = Math.max.apply(null, result.emailOpenedCount.concat(result.emailClickedCount, result.watchedCount))
                console.log("max number is " + this.maxBarChartNumber);
                if (this.maxBarChartNumber > 0) {
                    this.isMaxBarChartNumber = true;
                    this.generateBarChartForEmailLogs(result.campaignNames, result.emailOpenedCount, result.emailClickedCount, result.watchedCount, this.maxBarChartNumber);
                }
                else {
                    this.isMaxBarChartNumber = false;
                }
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                // this.xtremandLogger.errorPage(error);
            });
    }

    getVideoStatesSparklineChartsInfo(daysCount) {
        this.dashboardService.getVideoStatesInformation(daysCount).
            subscribe(result => {
                console.log(result);
                this.referenceService.viewsSparklineValues = result;
                this.viewsSparklineData(result.views, result.dates);
                this.minutesSparklineData(result.minutesWatched, result.dates);
                this.averageSparklineData(result.averageDuration, result.dates);
                console.log(this.referenceService.viewsSparklineValues);
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                // this.xtremandLogger.errorPage(error);
            });

    }

    selectedSortByValue(event: any) {
        console.log(event);
        this.referenceService.daySortValue = event;
        this.getVideoStatesSparklineChartsInfo(event);
    }

    refreshCampaignBarcharts() {
        this.getUserCampaignReport(this.loggedInUserId);
    }

    refreshHeatMapCharts() {
        this.getCampaignsHeatMapData();
    }

    cancelEmailStateModalPopUp() {
        this.pagination = new Pagination();
        this.pagination.pageIndex = 1;
        this.downloadDataList.length = 0;
        this.dashboardReport.emailLogList.length = 0;
    }

    convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var row = "";

        for (var index in objArray[0]) {
            //Now convert each value to string and comma-separated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    downloadEmailLogs() {
        let logListName: string;
        if (this.paginationType === 'open') {
            logListName = 'Email_Open_Logs.csv';
            this.dashboardReport.downloadEmailLogList = this.dashboardReport.allEmailOpenLogList;
        } else if (this.paginationType === 'clicked') {
            logListName = 'Email_Clicked_Logs.csv';
            this.dashboardReport.downloadEmailLogList = this.dashboardReport.allEmailClickedLogList;
        } else if (this.paginationType === 'watched') {
            logListName = 'Email_Watched_Logs.csv';
            this.dashboardReport.downloadEmailLogList = this.dashboardReport.allEmailWatchedLogList;
        }
        this.downloadDataList.length = 0;
        for (let i = 0; i < this.dashboardReport.downloadEmailLogList.length; i++) {
            let date = new Date(this.dashboardReport.downloadEmailLogList[i].time);
            var object = {
                "EmailId": this.dashboardReport.downloadEmailLogList[i].emailId,
                "First Name": this.dashboardReport.downloadEmailLogList[i].firstName,
                "Last Name": this.dashboardReport.downloadEmailLogList[i].lastName,
                "Date and Time": date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                "Campaign Name": this.dashboardReport.downloadEmailLogList[i].campaignName
            }

            if (this.paginationType != 'open') {
                object["City"] = this.dashboardReport.downloadEmailLogList[i].city;
                object["State"] = this.dashboardReport.downloadEmailLogList[i].state;
                object["Country"] = this.dashboardReport.downloadEmailLogList[i].country;
                object["Platform"] = this.dashboardReport.downloadEmailLogList[i].os;

            }

            this.downloadDataList.push(object);
        }
        var csvData = this.convertToCSV(this.downloadDataList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = logListName;
        a.click();
        return 'success';
    }

    listOfAllEmailOpenLogs() {
        this.pagination.maxResults = this.dashboardReport.totalEmailOpenedCount;
        this.dashboardService.listEmailOpenLogs(this.loggedInUserId, 13, this.pagination)
            .subscribe(
            (result: any) => {
                this.dashboardReport.allEmailOpenLogList = result;
                this.pagination.totalRecords = this.dashboardReport.totalEmailOpenedCount;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.allEmailOpenLogList);
            },
            error => console.log(error),
            () => { }
            );
    }

    listOfAllEmailClickedLogs() {
        this.pagination.maxResults = this.dashboardReport.totalEmailClickedCount;
        this.dashboardService.listEmailClickedLogs(this.loggedInUserId, this.pagination)
            .subscribe(
            result => {
                this.dashboardReport.allEmailClickedLogList = result;
                this.pagination.totalRecords = this.dashboardReport.totalEmailClickedCount;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.allEmailClickedLogList);
            },
            error => console.log(error),
            () => { }
            );
    }

    listOfAllWatchedLogs() {
        this.pagination.maxResults = this.dashboardReport.totalEmailWatchedCount;
        this.dashboardService.listOfWatchedLogs(this.loggedInUserId, this.pagination)
            .subscribe(
            (data: any) => {
                this.dashboardReport.allEmailWatchedLogList = data;
                this.pagination.totalRecords = this.dashboardReport.totalEmailWatchedCount;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.allEmailWatchedLogList);
            },
            error => console.log(error),
            () => console.log('finished')
            );
    }
    worldMapCampaignDetails(countryCode) {
        countryCode = countryCode.toUpperCase();
        this.dashboardService.worldMapCampaignDetails(this.loggedInUserId, countryCode)
            .subscribe(
            (data: any) => {
                console.log(data);
                this.worldMapUserData = data;
                $('#worldMapModal').modal('show');
            },
            error => console.log(error),
            () => console.log('finished')
            );
    }

    ngOnInit() {
        try {
            this.dashboardReportsCount();
            this.loggedInUserId = this.authenticationService.getUserId();
            this.getDefaultPage(this.loggedInUserId);
            this.getUserCampaignReport(this.loggedInUserId);
            this.getEmailActionCount(this.loggedInUserId);
            this.emailWatchedCount(this.loggedInUserId);
            this.getCountriesTotalViewsData();
            this.getCampaignsHeatMapData();
            this.getVideoStatesSparklineChartsInfo(7);

            Metronic.init();
            Layout.init();
            Demo.init();
            QuickSidebar.init();
            Index.init();
            Index.initDashboardDaterange();
            Index.initCharts();
            Index.initChat();
            Tasks.initDashboardWidget();
            this.listActiveSocialAccounts(this.loggedInUserId);
            this.genderDemographics(this.loggedInUserId);
        } catch (err) {
            console.log(err);
        }
    }

    ngOnDestroy() {
        $('#emailClickedModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }
}
