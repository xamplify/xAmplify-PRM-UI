import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {TwitterProfile} from '../../models/twitter-profile';

import {TwitterService} from '../../services/twitter.service';

@Component({
  selector: 'app-twitter-friends',
  templateUrl: './twitter-friends.component.html',
  styleUrls :['./twitter-friends.component.css']

})
export class TwitterFriendsComponent implements OnInit{
    twitterProfiles:any;
    constructor(private router: Router, private twitterService: TwitterService) {}
    
    getFriends(){
        this.twitterService.listTwitterProfiles("friends")
        .subscribe(
            data => this.twitterProfiles = data["twitterProfiles"],
            error => console.log(error),
            () => console.log(this.twitterProfiles)
        );
    }
    
    ngOnInit(){
        try{
             this.getFriends();
        }
        catch(err){
            console.log(err);
        }
    }       

}