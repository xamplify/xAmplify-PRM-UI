import { Component, OnInit,Input  } from '@angular/core';
import { Router ,RouterModule} from '@angular/router';
import { UserService } from '../services/user.service';
import {TwitterService} from "../../social/services/twitter.service";
import {SocialService} from "../../social/services/social.service";
import { User } from '../models/user';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Logger } from "angular2-logger/core";
declare var swal: any;
@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit { 
   
    notifications:any;
    notificationsCount: number = 0;
    isUserUpdated:boolean;
    campaignEmailNotificationCount:number=0;
    campaignEmailNotifications:any;
    @Input() model={ 'displayName': '', 'profilePicutrePath': 'assets/admin/pages/media/profile/icon-user-default.png' };
    constructor( public router: Router,public userService:UserService, public twitterService: TwitterService,
            public socialService: SocialService,public authenticationService:AuthenticationService,public refService:ReferenceService,public logger:Logger) {
            const userName = this.authenticationService.user.emailId;
            this.userService.getUserByUserName(userName).
            subscribe(
                    data => {
                       console.log(data);
                       refService.userDefaultPage = data.userDefaultPage;
                        var loggedInUser = data;
                       if(loggedInUser.firstName!=null){
                           this.model.displayName = loggedInUser.firstName;
                           refService.topNavBarUserDetails.displayName = loggedInUser.firstName;
                       }else{
                           this.model.displayName = loggedInUser.emailId;
                           refService.topNavBarUserDetails.displayName = loggedInUser.emailId;
                       }
                       if(!(loggedInUser.profileImagePath.indexOf(null)>-1)){
                           this.model.profilePicutrePath = loggedInUser.profileImagePath;
                           refService.topNavBarUserDetails.profilePicutrePath = loggedInUser.profileImagePath;
                       }else{
                           this.model.profilePicutrePath =  "assets/admin/pages/media/profile/icon-user-default.png";
                           refService.topNavBarUserDetails.profilePicutrePath = "assets/admin/pages/media/profile/icon-user-default.png";
                       }
                    },
                    error => {this.logger.error(this.refService.errorPrepender+" Constructor():"+error)},
                    () => console.log("Finished")
                );
    }
   
    
    listTwitterNotifications(){
        setInterval(() => {
            this.twitterService.listNotifications(null)
            .subscribe(
                data => {
                    this.notifications = data;
                    var count = 0;
                    for(var i in this.notifications){
                        if(this.notifications[i].read == false){
                            count = count + 1;                            
                        }
                    }
                    this.notificationsCount =count;
                },
                error => console.log(error),
                () => console.log("Finished")
            );
        
            
            console.log("getting notifications: "+new Date());
        }, 3600000);
    }
    
    markAllAsRead(){
        this.twitterService.markAllAsRead(null)
        .subscribe(
            data => {
                this.notificationsCount = 0;
            },
            error => console.log(error),
            () => console.log("Finished")
        );
    }
    
    listCampaignEmailNotifications(){
        this.refService.listCampaignEmailNotifications(this.authenticationService.user.id)
        .subscribe(
            data => {
                console.log(data);
                this.campaignEmailNotificationCount = data.length;
                this.campaignEmailNotifications = data;
            },
            error => console.log(error),
            () => console.log("Finished")
        );
    }
    
    ngOnInit(){
        //this.listTwitterNotifications();
        this.listCampaignEmailNotifications();
    }
    
}
