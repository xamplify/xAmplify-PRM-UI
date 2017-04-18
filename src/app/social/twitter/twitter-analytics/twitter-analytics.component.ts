import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from "angular2-logger/core";

import {TwitterProfile} from '../../models/twitter-profile';
import {KloutScore} from '../../models/klout-score';
import {KloutTopics} from '../../models/klout-topics';
import {Klout} from '../../models/klout';

import {TwitterService} from '../../services/twitter.service';

declare var Metronic, swal, $, Layout, Login, Demo, Index, QuickSidebar, Tasks: any;
@Component({
  selector: 'app-twitter-analytics',
  templateUrl: './twitter-analytics.component.html',
  styleUrls: ['./twitter-analytics.component.css']
})
export class TwitterAnalyticsComponent implements OnInit {
    twitterProfile:TwitterProfile;
    kloutScore: KloutScore;
    kloutTopics: KloutTopics;
    klout: Klout;
    followersGenderPercentage: any;

influence: any = [4.9, 5.1, 6.7, 5.5, 7.6, 3.5, 7.0, 1.6, 7.2, 9.3, 8.6, 9.9];
engagement: any = [3.9, 5.2, 7.7, 2.5, 7.9, 9.2, 1.0, 9.6, 2.2, 9.3, 5.6, 9.3];

weeklyMessagesRecievedCount: number;
weeklyMessagesSentCount: number;
weeklyMessagesCount: number;
weeklyMentionsCount: number;
weeklyFriendsCount: number;
weeklyFollowersCount: number;

followersHistory:any;

    constructor(private router: Router, private twitterService: TwitterService, private logger: Logger) {}
    
    getAnalytics(){
        this.twitterService.getAnalytics()
        .subscribe(
            data => {
                this.twitterProfile = data["twitterProfile"];
                this.followersGenderPercentage = data["followersGenderPercentage"];
            },
            
            error => this.logger.error(error),
            () => this.logger.log("Twitter Analytics finished.")
        );
    }
    
    getKloutData(){
        this.twitterService.getKloutData()
        .subscribe(
            data => {
                this.kloutScore = data["kloutScore"];
                this.kloutTopics = data["kloutTopics"];
                this.klout = data["klout"];
            },
            
            error => this.logger.error(error),
            () => this.logger.log("Twitter Analytics finished.")
        );
    }
    
    getWeeklyReport(){
        this.twitterService.getWeeklyReport()
        .subscribe(
            data => {
                this.weeklyMessagesCount = data["weeklyMessagesCount"];
                this.weeklyMessagesRecievedCount = data["weeklyMessagesRecievedCount"];
                this.weeklyMessagesSentCount = data["weeklyMessagesSentCount"];
                this.weeklyMentionsCount = data["weeklyMentionsCount"];
                this.weeklyFriendsCount = data["weeklyFriendsCount"];
                this.weeklyFollowersCount = data["weeklyFollowersCount"];
                
                $("#sparkline_friends").sparkline(data["weeklyFriends"], {
                    type: 'bar', padding: '0px', barWidth: '4', height: '30', barColor: '#00aced', barSpacing: '3'
                });
                $("#sparkline_followers").sparkline(data["weeklyFollowers"], {
                    type: 'bar', padding: '0px', barWidth: '4', height: '30', barColor: '#00aced', barSpacing: '3'
                });
                $("#sparkline_direct_messages").sparkline(data["weeklyMessages"], {
                    type: 'pie', padding: '0px', barWidth: '4', height: '30', barColor: '#00aced', barSpacing: '3'
                });
                $("#sparkline_mentions").sparkline(data["weeklyMentions"], {
                    type: 'bar', padding: '0px', barWidth: '4', height: '30', barColor: '#00aced', barSpacing: '3'
                });
                $("#sparkline_messages_sent").sparkline(data["weeklyMessagesSent"], {
                    type: 'bar', padding: '0px', barWidth: '4', height: '30', barColor: '#00aced', barSpacing: '3'
                });
                $("#sparkline_messages_recieved").sparkline(data["weeklyMessagesRecieved"], {
                    type: 'bar', padding: '0px', barWidth: '4', height: '30', barColor: '#00aced', barSpacing: '3'
                });
                $("#sparkline_clicks").sparkline([], {
                    type: 'bar', padding: '0px', barWidth: '4', height: '30', barColor: '#00aced', barSpacing: '3'
                });
                $("#sparkline_retweets").sparkline([], {
                    type: 'bar', padding: '0px', barWidth: '4', height: '30', barColor: '#00aced', barSpacing: '3'
                });
            },
            
            error => console.log(error),
            () => console.log("Twitter Weekly Report finished.")
        );
    }
    
    ngOnInit(){
           
           try {
               this.getAnalytics();
               this.getWeeklyReport();
               this.getKloutData();
               
        	   $("#pulse").pulsate({color:"#09f",reach:5,glow:false});
        	     $("#pulse1").pulsate({color:"#09f",reach:5,glow:false});
        	     $(".pulse1").pulsate({glow:true});
        	     $(".pulse2").pulsate({color:"#09f"});
        	     $(".pulse3").pulsate({reach:10});
        	     $(".pulse4").pulsate({speed:2500});
        	     $(".pulse5").pulsate({pause:1000});
        	     $(".pulse6").pulsate({onHover:true});
                 
        	     Metronic.init(); // init metronic core componets
        	     Layout.init(); // init layout
        	     Demo.init(); // init demo features 
        	     QuickSidebar.init(); // init quick sidebar
        	     Index.init();   
        	     Index.initDashboardDaterange();
        	     Index.initJQVMAP(); // init index page's custom scripts
        	     Index.initCalendar(); // init index page's custom scripts
        	     Index.initCharts(); // init index page's custom scripts
        	     Index.initChat();
        	     Index.initMiniCharts();
        	     Tasks.initDashboardWidget();
                 
        	     $(".GaugeMeter").gaugeMeter();
           }
            catch(err){
                  console.log("error");
              }
         
       }       
  
}
