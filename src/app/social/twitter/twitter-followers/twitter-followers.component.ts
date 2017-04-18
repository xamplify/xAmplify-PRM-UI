import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {TwitterProfile} from '../../models/twitter-profile';

import {TwitterService} from '../../services/twitter.service';

@Component({
  selector: 'app-twitter-followers',
  templateUrl: './twitter-followers.component.html',
  styleUrls :['./twitter-followers.component.css']

})
export class TwitterFollowersComponent implements OnInit{
    twitterProfiles:any;
    constructor(private router: Router, private twitterService: TwitterService) {}
    
    getFollowers(){
        this.twitterService.listTwitterProfiles("followers")
        .subscribe(
            data => this.twitterProfiles = data["twitterProfiles"],
            error => console.log(error),
            () => console.log(this.twitterProfiles)
        );
    }
    
    ngOnInit(){
        try{
             this.getFollowers();
        }
        catch(err){
            console.log(err);
        }
    }       

}