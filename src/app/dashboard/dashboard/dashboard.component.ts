import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from 'angular2-logger/core';

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
    providers: [DashboardService, Pagination]
})
export class DashboardComponent implements OnInit, OnDestroy {

    dashboardStates: any;
    socialeMedia: any;
    dashboardReport: DashboardReport = new DashboardReport();
    userDefaultPage: UserDefaultPage = new UserDefaultPage();
    weeklyTweetsCount: number;

    socialConnections: SocialConnection[] = new Array<SocialConnection>();

    public totalRecords: number;

    campaigns: Campaign[];
    launchedCampaignsMaster: any[];
    launchedCampaignsChild: any[] = new Array<any>();
    totalCampaignsCount: number;
    campaignReportType: string;
    campaignReportOptions = ['RECENT', 'TRENDING', 'CUSTOM'];
    countryViewsData: any;
    loggedInUserId: number;
    userCampaignReport: CampaignReport = new CampaignReport();
    hasCampaignRole:boolean = false;
    hasStatsRole:boolean = false;
    hasSocialStatusRole:boolean = false;
    constructor(public router: Router, public _dashboardService: DashboardService, public pagination: Pagination,
        public contactService: ContactService,
        public videoFileService: VideoFileService, public twitterService: TwitterService, public facebookService: FacebookService,
        public socialService: SocialService, public authenticationService: AuthenticationService, public logger: Logger,
        public utilService: UtilService, public userService: UserService, public campaignService: CampaignService,
        public referenceService: ReferenceService, public pagerService: PagerService, public xtremandLogger: XtremandLogger) {
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roleName.campaignRole);
        this.hasStatsRole = this.referenceService.hasRole(this.referenceService.roleName.statsRole);
        this.hasSocialStatusRole = this.referenceService.hasRole(this.referenceService.roleName.socialShare);
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
        this._dashboardService.getGenderDemographics(socialConnection)
            .subscribe(
            data => {
                this.logger.info(data);
                this.dashboardReport.genderDemographicsMale = data['male'];
                this.dashboardReport.genderDemographicsFemale = data['female'];
            },
            error => console.log(error),
            () => console.log('finished')
            );

    }

    viewsSparklineData() {
        const myvalues = [2, 6, 12, 13, 12, 13, 7, 14, 13, 11, 11, 12, 17, 11, 11, 12, 15, 10];
        $('#sparkline_bar').sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    minutesSparklineData() {
        const myvalues = [2, 11, 12, 13, 12, 13, 10, 14, 13, 11, 11, 12, 11, 11, 10, 12, 11, 10];
        $('#sparkline_bar2').sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    averageSparklineData() {
        const myvalues = [3, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12];
        $('#sparkline_line').sparkline(myvalues, {
            type: 'line',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }


    facebookSparklineData() {
        $('.sparkline_bar_facebook').sparkline([28, 25, 24, 26, 24, 22, 26], {
            type: 'bar',
            padding: '5px',
            barWidth: '4',
            height: '20',
            barColor: '#3b5998',
            barSpacing: '3'
        });
    }

    renderMap() {
        //   const countryData = this.countryWiseVideoViews;
       // const data = [["in", 1], ["us", 2]];
       const data = this.countryViewsData;
        Highcharts.mapChart('world-map', {
            chart: {
                map: 'custom/world'
            },
            title: {
                text: 'The people who have watched the video'
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
    // TFFF == TweetsFriendsFollowersFavorites
    getTotalCountOfTFFF(socialConnection: SocialConnection) {
        this.logger.log('getTotalCountOfTFFF() method invoke started.');
        this.twitterService.getTotalCountOfTFFF(socialConnection)
            .subscribe(
            data => {
                this.logger.log(data);
                socialConnection.twitterTotalFollowersCount = data['followersCount'];
                socialConnection.twitterTotalTweetsCount = data['tweetsCount'];
            },
            error => console.log(error),
            () => console.log('getTotalCountOfTFFF() method invoke started finished.')
            );
    }
    
    getPage( socialConnection: SocialConnection, pageId: string ) {
        this.facebookService.getPage( socialConnection, pageId )
            .subscribe(
            data => {
                socialConnection.facebookFanCount = data.extraData.fan_count;
            },
            error => console.log( error ),
            () => {}
            );
    }

    getWeeklyTweets(socialConnection: SocialConnection) {
        this.twitterService.getWeeklyTweets(socialConnection)
            .subscribe(
            data => {
                $('#sparkline_bar_twitter').sparkline(data, {
                    type: 'bar',
                    padding: '5px',
                    barWidth: '4',
                    height: '20',
                    barColor: '#00ACED',
                    barSpacing: '3'
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

    listSocialAccounts(userId: number) {
        this.socialService.listActiveSocialConnections(userId)
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
                        }else if (this.socialConnections[i].source === 'FACEBOOK' && this.socialConnections[i].emailId === null){
                            this.getPage(this.socialConnections[i], this.socialConnections[i].profileId);
                        }
                    }
                }
                console.log('getFacebookAccounts() Finished.');
            }
            );

    }

    getDefaultPage(userId: number) {
        this.userService.getUserDefaultPage( userId )
        .subscribe(
        data => {
            if(data['_body'].includes('dashboard')){
                this.userDefaultPage.isCurrentPageDefaultPage = true;
                this.referenceService.userDefaultPage = 'DASHBOARD';
            }
        },
        error => console.log( error ),
        () => { }
        );
}

    setDashboardAsDefaultPage(event: any) {
        this.referenceService.userDefaultPage = event ?  'DASHBOARD': 'WELCOME';
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
                this.campaigns = data;
                this.totalCampaignsCount = this.campaigns.length;
            },
            error => { },
            () => this.logger.info("Finished listCampaign()")
            );
    }

    createCampaign(campaignType: string) {
        this.referenceService.selectedCampaignType = campaignType;
        this.router.navigate(["/home/campaigns/create-campaign"]);
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
                this.logger.info("Finished getUserCampaignReport()");
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
        if (('CUSTOM' == userCampaignReport.campaignReportOption) && (null != userCampaignReport.campaigns)) {
            var campaignsArray: string[] = userCampaignReport.campaigns.split(',');

            for (var i in campaignsArray) {
                var result = this.launchedCampaignsMaster.filter(function (obj) {
                    return obj.id == parseInt(campaignsArray[i]);
                });
                console.log(result);
                this.launchedCampaignsChild.push(result[0]);
            }
            this.launchedCampaignsMaster = this.launchedCampaignsMaster.filter(x => this.launchedCampaignsChild.indexOf(x) < 0);
        }
    }

    validateUserCampaignReport(userCampaignReport: CampaignReport) {
        let isValid = true;
        if ('CUSTOM' == userCampaignReport.campaignReportOption) {
            let campaignIds: string[] = [];

            $('.launchedCampaignsChild > div >h6').each(function () {
                campaignIds.push($(this).attr('id'));
            });
            userCampaignReport.campaigns = campaignIds.toString();
            if (campaignIds.length > 4) {
                this.setCampaignReportResponse('WARNING', 'You can not add more than 4 campaigns.');
                isValid = false;
            }
            if (campaignIds.length == 0) {
                this.setCampaignReportResponse('WARNING', 'Please select campaigns.');
                isValid = false;
            }
        }

        if (isValid)
            this.saveUserCampaignReport(userCampaignReport);
        else
            return false;
    }

    saveUserCampaignReport(userCampaignReport: CampaignReport) {
        if (userCampaignReport.userId == null)
            userCampaignReport.userId = this.loggedInUserId;

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
            () => this.logger.info("Finished saveUserCampaignReport()")
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
        this._dashboardService.loadDashboardReportsCount(this.loggedInUserId)
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
            () => console.log("dashboard reports counts completed")
            );
    }

    getEmailActionCount(userId: number) {
        this._dashboardService.getEmailActionCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalEmailOpenedCount = data["email_opened_count"];
                this.dashboardReport.totalEmailClickedCount = data["email_url_clicked_count"] + data["email_gif_clicked_count"];
            },
            error => console.log(error),
            () => console.log("emailOpenedCount completed")
            );
    }

    emailWatchedCount(userId: number) {
        this._dashboardService.loadEmailWatchedCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalEmailWatchedCount = data["watched-users-count"];
            },
            error => console.log(error),
            () => console.log("emailWatchedCount completed")
            );
    }

    setPage(page: number, currentPage: string) {
        this.pagination.pageIndex = page;
        if(currentPage == "emailOpened"){
            this.listOfEmailOpenLogs(13);
        }
        else if(currentPage == "emailClicked"){
            this.listOfEmailClickedLogs();
        }
        else if(currentPage == "emailWatched"){
            this.listOfWatchedLogs();
        }
    }

    listOfEmailOpenLogs(actionId: number){
        this._dashboardService.listEmailOpenLogs(this.loggedInUserId, actionId, this.pagination)
            .subscribe(
            (result:any) => {
                    this.dashboardReport.emailOpenedList = result;
                    this.pagination.totalRecords = this.dashboardReport.totalEmailOpenedCount;
                    this.pagination = this.pagerService.getPagedItems( this.pagination, this.dashboardReport.emailOpenedList );
            },
            error => console.log(error),
            () => { }
            );
    }
    
    listOfEmailClickedLogs(){
        this._dashboardService.listEmailClickedLogs(this.loggedInUserId, this.pagination)
            .subscribe(
            result => {
                    this.dashboardReport.emailClickedList = result;
                    this.pagination.totalRecords = this.dashboardReport.totalEmailClickedCount;
                    this.pagination = this.pagerService.getPagedItems( this.pagination, this.dashboardReport.emailClickedList );
            },
            error => console.log(error),
            () => { }
            );
    }
    
    listOfWatchedLogs() {
        this.logger.log(this.pagination);
        this._dashboardService.listOfWatchedLogs(this.loggedInUserId, this.pagination)
            .subscribe(
            (data: any) => {
                this.dashboardReport.emailWatchedList = data;
                    this.pagination.totalRecords = this.dashboardReport.totalEmailWatchedCount;
                    this.pagination = this.pagerService.getPagedItems( this.pagination, this.dashboardReport.emailWatchedList );
            },
            error => console.log(error),
            () => console.log("finished")
            );
    }
    
    getCountriesTotalViewsData() {
        this._dashboardService.getCountryViewsDetails().
        subscribe(result => {
            this.countryViewsData = result.countrywiseusers;
            this.renderMap();
        },
        (error: any) => {
            this.xtremandLogger.error(error);
            this.xtremandLogger.errorPage(error);
        });
    }
    
    cancelEmailStateModalPopUp(){
      this.pagination = new Pagination();
      this.pagination.pageIndex = 1;
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
            Metronic.init();
            Layout.init();
            Demo.init();
            QuickSidebar.init();
            Index.init();
            Index.initDashboardDaterange();
            Index.initCharts();
            Index.initChat();
            Tasks.initDashboardWidget();

            this.viewsSparklineData();
            this.minutesSparklineData();
            this.averageSparklineData();

            this.facebookSparklineData();
            this.listSocialAccounts(this.loggedInUserId);

            this.genderDemographics(this.loggedInUserId);
        } catch (err) {
            console.log(err);
        }
    }
    ngOnDestroy() {
        $('#emailOpenedModal').modal('hide');
        $('#emailClickedModal').modal('hide');
        $('#emailWatchedModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }
}
