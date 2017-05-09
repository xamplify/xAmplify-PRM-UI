import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {TwitterProfile} from '../../models/twitter-profile';

import {TwitterService} from '../../services/twitter.service';
import { UtilService } from '../../../core/services/util.service';

@Component({
  selector: 'app-twitter-followers',
  templateUrl: './twitter-followers.component.html',
  styleUrls :['./twitter-followers.component.css']

})
export class TwitterFollowersComponent implements OnInit{
    twitterProfiles:any;
    constructor(private router: Router, private twitterService: TwitterService, private utilService: UtilService) {}
    
    getFollowers(){
        this.twitterService.listTwitterProfiles("followers")
            .subscribe(
            data => {
                this.twitterProfiles = data["twitterProfiles"];
                this.utilService.abbreviateTwitterProfiles( this.twitterProfiles );
            },
            error => console.log( error ),
            () => console.log( this.twitterProfiles )
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