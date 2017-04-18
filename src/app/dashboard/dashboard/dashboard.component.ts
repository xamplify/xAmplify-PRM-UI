import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Logger } from "angular2-logger/core";

import {DashboardService} from '../dashboard.service';
import {TwitterService} from '../../social/twitter/twitter.service';


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

    constructor(private router: Router, private _dashboardService: DashboardService, private twitterService: TwitterService, private logger: Logger ) {}

    dashboardStats() {
        console.log("dashboardStats() : DashBoardComponent");
        this._dashboardService.getDashboardStats()
            .subscribe(
            data => this.dashboardStates = data['DashboardStats'],
            error => console.log(error),
            () => console.log("finished")
            );
    }

    getSocialMediaDetails() {

        this._dashboardService.getSocialMediaValues()
            .subscribe(
            data => this.socialeMedia = data['SocialMediaValues'],
            error => console.log(error),
            () => console.log("finished")
            );
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
        this._dashboardService.getSparklineData()
            .subscribe(
            data => {
                $("#sparkline_bar").sparkline(data['sparklineBar'], {
                    type: 'bar',
                    width: '100',
                    barWidth: 5,
                    height: '55',
                    barColor: '#35aa47',
                    negBarColor: '#e02222'
                });
            },
            error => console.log(error),
            () => console.log("finished")
            );
    }

    minutesSparklineData() {
        this._dashboardService.getSparklineData()
            .subscribe(
            data => {
                $("#sparkline_bar2").sparkline(data['sparklineBar2'], {
                    type: 'bar',
                    width: '100',
                    barWidth: 5,
                    height: '55',
                    barColor: '#ffb848',
                    negBarColor: '#e02222'
                });
            },
            error => console.log(error),
            () => console.log("finished")
            );
    }



    averageSparklineData() {
        this._dashboardService.getSparklineData()
            .subscribe(
            data => {
                $("#sparkline_line").sparkline(data['sparklineLine'], {
                    type: 'line',
                    width: '100',
                    height: '55',
                    lineColor: '#ffb848'
                });
            },
            error => console.log(error),
            () => console.log("finished")
            );
    }

    googleplusSparklineData() {
        this._dashboardService.getGoolgPlusSparklinecharts()
            .subscribe(
            data => {
                $("#sparkline_bar_googleplus").sparkline(data['googleplus'], {
                    type: 'bar',
                    padding: '5px',
                    barWidth: '4',
                    height: '20',
                    barColor: '#dd4b39',
                    barSpacing: '3'
                });
            },
            error => console.log(error),
            () => console.log("finished")
            );
    }

    facebookSparklineData() {
        this._dashboardService.getFacebookSparklinecharts()
            .subscribe(
            data => {
                $("#sparkline_bar_facebook").sparkline(data['fbcharts'], {
                    type: 'bar',
                    padding: '5px',
                    barWidth: '4',
                    height: '20',
                    barColor: '#3b5998',
                    barSpacing: '3'
                });
            },
            error => console.log(error),
            () => console.log("finished")
            );
    }
    linkdinSparklineData() {
        this._dashboardService.getLinkdinSparklinecharts()
            .subscribe(
            data => {
                $("#sparkline_bar_linkdin").sparkline(data['linkdincharts'], {
                    type: 'bar',
                    padding: '5px',
                    barWidth: '4',
                    height: '20',
                    barColor: '#007bb6',
                    barSpacing: '3'
                });
            },
            error => console.log(error),
            () => console.log("finished")
            );
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
    
    ngOnInit() {
        try {
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


            this.showGaugeMeter();
            
            this.getTotalCountOfTFFF();
            this.getGenderDemographics();
            this.getWeeklyTweets();

        } catch (err) {
            console.log(err);
        }
    }
}
