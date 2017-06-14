import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Logger } from "angular2-logger/core";

import {DashboardService} from '../dashboard.service';
import {TwitterService} from '../../social/services/twitter.service';
import { SocialService } from '../../social/services/social.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';

import { SocialStatusProvider } from '../../social/models/social-status-provider';

declare var Metronic, swal, $, Layout, Login, Demo, Index, QuickSidebar, Tasks: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

    dashboardStates: any;
    socialeMedia: any;
    genderDemographicsMale: number;
    genderDemographicsFemale: number;
    
    weeklyTweetsCount: number;
    twitterTotalTweetsCount: number;
    twitterTotalFollowersCount: any;
    socialConnections: any[] = new Array<any>();
    constructor(private router: Router, private _dashboardService: DashboardService, private twitterService: TwitterService, 
            private socialService: SocialService, private authenticationService: AuthenticationService, private logger: Logger, private userService: UserService ) {}

    dashboardStats() {
        console.log( "dashboardStats() : DashBoardComponent" );
        this.dashboardStates = {
            "description": "dashboard html file details",
            "totalViews": 95924,
            "uploadedVideos": 45334,
            "totalContacts": 64362,
            "followers": 549,
            "leads": 89,
            "shared": 89
        }
    }

    getSocialMediaDetails() {
        this.socialeMedia = {
            "noOfTweets": "12,000",
            "googleImpressions": "200K",
            "facebookMentions": "34,555",
            "linkedIn": "276"
        }
    }
    getGenderDemographics() {
        this._dashboardService.getGenderDemographics()
            .subscribe(
            data => {
                this.logger.info(data);
                this.genderDemographicsMale = data["male"];
                this.genderDemographicsFemale = data["female"];
            },
            error => console.log(error),
            () => console.log("finished")
            );

    }

    viewsSparklineData() {
        var myvalues = [2, 6, 12, 13, 12, 13, 7, 14, 13, 11, 11, 12, 17, 11, 11, 12, 15, 10];
        $("#sparkline_bar").sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    minutesSparklineData() {
        var myvalues = [2, 11, 12, 13, 12, 13, 10, 14, 13, 11, 11, 12, 11, 11, 10, 12, 11, 10];
        $("#sparkline_bar2").sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    averageSparklineData() {
        var myvalues = [3, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12];
        $("#sparkline_line").sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    googleplusSparklineData() {
        $( "#sparkline_bar_googleplus" ).sparkline( [28, 25, 24, 26, 24, 22, 26], {
            type: 'bar',
            padding: '5px',
            barWidth: '4',
            height: '20',
            barColor: '#dd4b39',
            barSpacing: '3'
        });
    }

    facebookSparklineData() {
        $( ".sparkline_bar_facebook" ).sparkline([28,25,24,26,24,22,26], {
            type: 'bar',
            padding: '5px',
            barWidth: '4',
            height: '20',
            barColor: '#3b5998',
            barSpacing: '3'
        });
    }
    linkdinSparklineData() {
        $( "#sparkline_bar_linkdin" ).sparkline( [28, 25, 24, 26, 24, 22, 26], {
            type: 'bar',
            padding: '5px',
            barWidth: '4',
            height: '20',
            barColor: '#007bb6',
            barSpacing: '3'
        });
    }


    showGaugeMeter() {


        $("#googleplus").data("percent", 66);
        $("#googleplus").gaugeMeter();

        $("#facebook").data("percent", 100);
        $("#facebook").gaugeMeter();

        $("#linkdin").data("percent", 100);
        $("#linkdin").gaugeMeter();


        $("#opened").data("percent", 76);
        $("#opened").gaugeMeter();

        $("#clicked").data("percent", 68);
        $("#clicked").gaugeMeter();

        $("#watched").data("percent", 100);
        $("#watched").gaugeMeter();


    }
    
    // TFFF == TweetsFriendsFollowersFavorites
    getTotalCountOfTFFF(){
        this.logger.log("getTotalCountOfTFFF() method invoke started.");
        this.twitterService.getTotalCountOfTFFF()
        .subscribe(
            data => {
                this.logger.log(data);
                this.twitterTotalFollowersCount = data["followersCount"];
                this.twitterTotalTweetsCount = data["tweetsCount"];
            },
            error => console.log(error),
            () => console.log("getTotalCountOfTFFF() method invoke started finished.")
        );
    }
    
    getWeeklyTweets(){
        this.logger.log("getWeeklyTweets() method invoke started.");
        this.twitterService.getWeeklyTweets()
        .subscribe(
            data => {
                $("#sparkline_bar_twitter").sparkline(data, {
                    type: 'bar',
                    padding: '5px',
                    barWidth: '4',
                    height: '20',
                    barColor: '#00ACED',
                    barSpacing: '3'
                });
                let count = 0;
                $.each( data, function( index:number, value:number ){
                    count += value;
                });
                this.weeklyTweetsCount = count;
            },
            error => console.log(error),
            () => console.log("getWeeklyTweets() method invoke started finished.")
        );
    }
    
    listSocialAccounts() {
        this.socialService.listAccounts(4968, 'all')
            .subscribe(
            data => {
                this.socialConnections = data;
            },
            error => console.log( error ),
            () => console.log( 'getFacebookAccounts() Finished.' )
            );

}
    
    ngOnInit() {
        try {
            console.log("dashboard:"+this.userService.loggedInUserData);

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

            //this.twitterSparklineData();
            this.googleplusSparklineData();
            this.facebookSparklineData();
            this.linkdinSparklineData();


            //this.showGaugeMeter();
            
            this.getTotalCountOfTFFF();
            this.getGenderDemographics();
            this.getWeeklyTweets();
            
            console.log(this.userService.loggedInUserData);
            this.listSocialAccounts();

        } catch (err) {
            console.log(err);
        }
    }
}
