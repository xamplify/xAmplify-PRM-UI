import { Component, OnInit,Input  } from '@angular/core';
import { Router ,RouterModule} from '@angular/router';
import { UserService } from '../services/user.service';
import {TwitterService} from "../../social/services/twitter.service";
import {SocialService} from "../../social/services/social.service";
import { User } from '../models/user';
import { AuthenticationService } from '../../core/services/authentication.service';
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
    @Input() model={ 'displayName': '', 'profilePicutrePath': 'assets/admin/pages/media/profile/icon-user-default.png' };
    constructor( private router: Router,private userService:UserService, private twitterService: TwitterService,
            private socialService: SocialService,private authenticationService:AuthenticationService) {
        const loggedInUser = this.authenticationService.user;
        console.log(loggedInUser);
        if(!this.isEmpty(loggedInUser)) {
            // Object is empty (Would return true in this example)
            if(loggedInUser.firstName!=null){
                this.model.displayName = loggedInUser.firstName;
            }else{
                this.model.displayName = loggedInUser.emailId;
            }
            if(!(loggedInUser.profileImagePath.indexOf(null)>-1)){
                this.model.profilePicutrePath = loggedInUser.profileImagePath;
            }else{
                this.model.profilePicutrePath =  "assets/admin/pages/media/profile/icon-user-default.png";
            }
        }
    }
    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
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
    
    ngOnInit(){
        //this.listTwitterNotifications();
    }
    
}
