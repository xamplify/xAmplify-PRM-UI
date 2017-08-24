import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from 'angular2-logger/core';

import {SocialConnection} from '../../social/models/social-connection';
import { Campaign} from '../../campaigns/models/campaign';
import {CampaignReport} from '../../campaigns/models/campaign-report';

import { DashboardService } from '../dashboard.service';
import { TwitterService } from '../../social/services/twitter.service';
import { SocialService } from '../../social/services/social.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { UtilService } from '../../core/services/util.service';

import { SocialStatusProvider } from '../../social/models/social-status-provider';
import { ContactService } from '../../contacts/services/contact.service';
import { UserService } from '../../core/services/user.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { ReferenceService } from '../../core/services/reference.service';
import { VideoFileService} from '../../videos/services/video-file.service';
import { Pagination } from '../../core/models/pagination';
import { DashboardReport } from '../../core/models/dashboard-report';
declare var Metronic, swal, $, Layout, Login, Demo, Index, QuickSidebar, Tasks: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [DashboardService,Pagination]
})
export class DashboardComponent implements OnInit {

    dashboardStates: any;
    socialeMedia: any;
    dashboardReport: DashboardReport = new DashboardReport();
    
    weeklyTweetsCount: number;
    twitterTotalTweetsCount: number;
    twitterTotalFollowersCount: any;
    socialConnections: SocialConnection[] = new Array<SocialConnection>();

    isDahboardDefaultPage: boolean;
    
    campaigns:Campaign[];
    launchedCampaignsMaster:any[];
    launchedCampaignsChild:any[] = new Array<any>();
    totalCampaignsCount :number;
    campaignReportType: string;
    campaignReportOptions = ['RECENT', 'TRENDING', 'CUSTOM'];

    loggedInUserId: number;
    userCampaignReport: CampaignReport = new CampaignReport();

    constructor( private router: Router, private _dashboardService: DashboardService, private pagination: Pagination,
                private contactService: ContactService, private videoFileService: VideoFileService, private twitterService: TwitterService,
                private socialService: SocialService, private authenticationService: AuthenticationService, private logger: Logger,
                private utilService: UtilService, private userService: UserService, private campaignService: CampaignService,
                private referenceService: ReferenceService) {
    }

    dashboardStats() {
        console.log('dashboardStats() : DashBoardComponent');
        this.dashboardStates = {
            'description': 'dashboard html file details',
            'totalViews': 95924,
            'uploadedVideos': 45334,
            'totalContacts': 64362,
            'followers': 549,
            'leads': 89,
            'shared': 89
        };
    }

    getSocialMediaDetails() {
        this.socialeMedia = {
            'noOfTweets': '12,000',
            'googleImpressions': '200K',
            'facebookMentions': '34,555',
            'linkedIn': '276'
        };
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
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    googleplusSparklineData() {
        $('#sparkline_bar_googleplus').sparkline([28, 25, 24, 26, 24, 22, 26], {
            type: 'bar',
            padding: '5px',
            barWidth: '4',
            height: '20',
            barColor: '#dd4b39',
            barSpacing: '3'
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
    linkdinSparklineData() {
        $('#sparkline_bar_linkdin').sparkline([28, 25, 24, 26, 24, 22, 26], {
            type: 'bar',
            padding: '5px',
            barWidth: '4',
            height: '20',
            barColor: '#007bb6',
            barSpacing: '3'
        });
    }


    showGaugeMeter() {


        $('#googleplus').data('percent', 66);
        $('#googleplus').gaugeMeter();

        $('#facebook').data('percent', 100);
        $('#facebook').gaugeMeter();

        $('#linkdin').data('percent', 100);
        $('#linkdin').gaugeMeter();


        $('#opened').data('percent', 76);
        $('#opened').gaugeMeter();

        $('#clicked').data('percent', 68);
        $('#clicked').gaugeMeter();

        $('#watched').data('percent', 100);
        $('#watched').gaugeMeter();


    }

    // TFFF == TweetsFriendsFollowersFavorites
    getTotalCountOfTFFF(socialConnection: SocialConnection) {
        this.logger.log('getTotalCountOfTFFF() method invoke started.');
        this.twitterService.getTotalCountOfTFFF(socialConnection)
            .subscribe(
            data => {
                this.logger.log(data);
                this.twitterTotalFollowersCount = data['followersCount'];
                this.twitterTotalTweetsCount = data['tweetsCount'];
            },
            error => console.log(error),
            () => console.log('getTotalCountOfTFFF() method invoke started finished.')
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
                        }
                    }
                }
                console.log('getFacebookAccounts() Finished.');
            }
            );

    }
    
    totalContactsCount(userId: number) {
        this.contactService.loadContactsCountInDashboard(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalContacts = data.allcontacts;
            },
            error => console.log( error ),
            () => console.log( "LoadContactsCount Finished" )
            );
    }
    
    /*uploadedVideosCount() {
        this.videoFileService.loadVideosCount()
            .subscribe(
            data => {
                this.totalUploadedvideos = data;
            },
            error => console.log( error ),
            () => console.log( "LoadContactsCount Finished" )
            );
    }*/
    
    uploadedVideosCount(userId: number) {
        try {
           this.videoFileService.loadVideosCount(userId)
             .subscribe((result: any) => {
                 this.dashboardReport.totalUploadedvideos = result.videos_count;
             },
             (error: string) => {
               this.logger.error( ' Loading Videos():' + error);
             },
             () => console.log('load videos completed:' ),
             );
         } catch (error) {
             this.logger.error('erro in load videos :' + error);
         }
     }

    
    getEmailActionCount(userId: number) {
        this._dashboardService.getEmailActionCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalEmailOpened = data["email_opened_count"];
                this.dashboardReport.totalEmailClicked = data["email_url_clicked_count"];
            },
            error => console.log( error ),
            () => console.log( "emailOpenedCount completed" )
            );
    }
    
    emailWatchedCount(userId: number) {
        this._dashboardService.loadEmailWatchedCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalEmailWatched = data.email_watched_count;
            },
            error => console.log( error ),
            () => console.log( "emailWatchedCount completed" )
            );
    }
    
    totalViewsCount(userId: number) {
        this._dashboardService.loadTotalViewsCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalViews = data.videos_views_count;
            },
            error => console.log( error ),
            () => console.log( "emailWatchedCount completed" )
            );
    }
    
    totalFollowersCount(userId: number) {
        this._dashboardService.loadTotalFollowersCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalFollowers = data.email_watched_count;
            },
            error => console.log( error ),
            () => console.log( "emailWatchedCount completed" )
            );
    }
    
    totalLeadsCount(userId: number) {
        this._dashboardService.loadTotalLeadsCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalLeads = data.email_watched_count;
            },
            error => console.log( error ),
            () => console.log( "emailWatchedCount completed" )
            );
    }
    
    totalSharedCount(userId: number) {
        this._dashboardService.loadTotalSharedCount(userId)
            .subscribe(
            data => {
                this.dashboardReport.totalShared = data.email_watched_count;
            },
            error => console.log( error ),
            () => console.log( "emailWatchedCount completed" )
            );
    }
    
    getDefaultPage( userId: number ) {
        this.userService.getUserDefaultPage( userId )
            .subscribe(
            data => {
                this.isDahboardDefaultPage = data['_body'].includes( 'dashboard' );
            },
            error => console.log( error ),
            () => { }
            );
    }
    
    setDashboardAsDefaultPage(event: any) {
        let defaultPage;
        if(event)
            defaultPage = 'dashboard';
        else
            defaultPage = 'welcome';
        this.userService.setUserDefaultPage(this.loggedInUserId, defaultPage)
        .subscribe(
                data => {
                    this.isDahboardDefaultPage = event;
                    this.referenceService.userDefaultPage = defaultPage.toUpperCase();
                },
                error => console.log( error ),
                () => {}
        );
    }
    
    listCampaignInteractionsData(userId: number, reportType: string){
        this.campaignService.listCampaignInteractionsData(userId, reportType)
        .subscribe(
            data => {
                this.campaigns = data;
                this.totalCampaignsCount = this.campaigns.length;
            },
            error => {},
            () => this.logger.info("Finished listCampaign()")
        );
    }
    
    createCampaign(campaignType: string){
        this.referenceService.selectedCampaignType = campaignType;
        this.router.navigate(["/home/campaigns/create-campaign"]);
    }
    
    getUserCampaignReport(userId: number){
        this.campaignService.getUserCampaignReport(userId)
        .subscribe(
            data => {
                this.userCampaignReport = data['userCampaignReport'];
                this.launchedCampaignsMaster = data['listLaunchedCampaingns'];
            },
            error => {},
            () => {
                this.logger.info("Finished getUserCampaignReport()");
                if(this.userCampaignReport == null){
                    this.userCampaignReport = new CampaignReport();
                    this.userCampaignReport.userId = userId;
                    this.userCampaignReport.campaignReportOption = 'RECENT';
                }
                
                this.setLaunchedCampaignsChild(this.userCampaignReport);                    
                this.listCampaignInteractionsData(userId, this.userCampaignReport.campaignReportOption);

            }
        );
    }
    
    setLaunchedCampaignsChild( userCampaignReport: CampaignReport ) {
        if ( ( 'CUSTOM' == userCampaignReport.campaignReportOption ) && ( null != userCampaignReport.campaigns ) ) {
            var campaignsArray: string[] = userCampaignReport.campaigns.split( ',' );

            for ( var i in campaignsArray ) {
                var result = this.launchedCampaignsMaster.filter( function( obj ) {
                    return obj.id == parseInt( campaignsArray[i] );
                });
                console.log( result );
                this.launchedCampaignsChild.push( result[0] );
            }
            this.launchedCampaignsMaster = this.launchedCampaignsMaster.filter( x => this.launchedCampaignsChild.indexOf( x ) < 0 );
        }
    }
    
    validateUserCampaignReport(userCampaignReport: CampaignReport){
        let isValid = true;
        if('CUSTOM' == userCampaignReport.campaignReportOption){
            let campaignIds: string[] = [];
            
            $('.launchedCampaignsChild > div >h6').each(function(){
                campaignIds.push($(this).attr('id')); 
            });
            userCampaignReport.campaigns = campaignIds.toString();
            if(campaignIds.length > 4){
                this.setCampaignReportResponse('WARNING', 'You can not add more than 4 campaigns.');
                isValid = false;
            }
            if(campaignIds.length == 0){
                this.setCampaignReportResponse('WARNING', 'Please select campaigns.');
                isValid = false;
            }
        }
        
        if(isValid)
            this.saveUserCampaignReport(userCampaignReport);
        else
            return false;
    }
    
    saveUserCampaignReport(userCampaignReport: CampaignReport){
        if(userCampaignReport.userId == null)
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
    
    setCampaignReportResponse(response: string, responseMessage: string){
        this.userCampaignReport.response = response;
        this.userCampaignReport.responseMessage = responseMessage;
    }
    
    onSelectionChangeCampaignReportOption(userCampaignReportOption: string){
        this.userCampaignReport.campaignReportOption = userCampaignReportOption;
    }
    
    ngOnInit() {
        try {
            this.loggedInUserId = this.authenticationService.getUserId();
            
            this.getDefaultPage(this.loggedInUserId);
            this.getUserCampaignReport(this.loggedInUserId);
            
            this.totalViewsCount(this.loggedInUserId);
            this.totalFollowersCount(this.loggedInUserId)
            this.uploadedVideosCount(this.loggedInUserId);
            this.totalContactsCount(this.loggedInUserId);
            
            this.getEmailActionCount(this.loggedInUserId);
            this.emailWatchedCount(this.loggedInUserId);
            
            Metronic.init();
            Layout.init();
            Demo.init();
            QuickSidebar.init();
            Index.init();
            Index.initDashboardDaterange();
            Index.initJQVMAP();
            Index.initCalendar();
            Index.initCharts();
            Index.initChat();
            // Index.initMiniCharts();
            Tasks.initDashboardWidget();

            this.dashboardStats();
            this.viewsSparklineData();
            this.minutesSparklineData();
            this.averageSparklineData();
            this.getSocialMediaDetails();

            // this.twitterSparklineData();
            this.googleplusSparklineData();
            this.facebookSparklineData();
            this.linkdinSparklineData();
            // this.showGaugeMeter();
            this.listSocialAccounts(this.loggedInUserId);

        } catch (err) {
            console.log(err);
        }
    }
}
