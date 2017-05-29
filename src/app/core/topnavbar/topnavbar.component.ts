import { Component, OnInit,Input  } from '@angular/core';
import { Router ,RouterModule} from '@angular/router';
import { UserService } from '../services/user.service';
import {TwitterService} from "../../social/services/twitter.service";
import { User } from '../models/user';

declare var swal: any;
@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit { 
    @Input('displayName') displayName: string;
    notifications:any;
    notificationsCount: number = 0;
    constructor( private router: Router,private userService:UserService, private twitterService: TwitterService) {
        this.getLoggedInUserDetails();
    }
    
    loggedInUser:User;
    @Input('profilePicutrePath') profilePicutrePath:string;
    
    listTwitterNotifications(){
        setInterval(() => {
            this.twitterService.listNotifications()
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
        this.twitterService.markAllAsRead()
        .subscribe(
            data => {
                this.notificationsCount = 0;
            },
            error => console.log(error),
            () => console.log("Finished")
        );
    }
    
    ngOnInit(){
        this.listTwitterNotifications();
    }
    
    public getLoggedInUserDetails(){
        this.userService.getUserData()
        .subscribe(
            data => {
                var body = data['_body'];
                if(body!=""){
                    var response = JSON.parse(body);
                    this.userService.loggedInUserData = response;
                    console.log(this.userService.loggedInUserData);
                    if(response.firstName!=null){
                        this.displayName = response.firstName;
                    }else{
                        this.displayName = response.emailId;
                    }
                    if(!(response.profileImagePath.indexOf(null)>-1)){
                        this.profilePicutrePath = response.profileImagePath;
                    }else{
                        this.profilePicutrePath =  "assets/admin/pages/media/profile/icon-user-default.png";
                    }
                    console.log(this.profilePicutrePath);
                }else{
                    swal("Please Contact Admin",data,"error");
                }
                
            },
            error => {
                swal(error,"","error");
            },
            () => console.log("Done")
        );
    
    }
}
