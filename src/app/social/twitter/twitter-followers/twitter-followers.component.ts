import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {TwitterProfile} from '../../models/twitter-profile';

import {TwitterService} from '../../services/twitter.service';
import {UtilService} from '../../../core/services/util.service';
import {SocialService} from '../../services/social.service';
import {AuthenticationService} from '../../../core/services/authentication.service';

import {SocialConnection} from '../../models/social-connection';

@Component({
  selector: 'app-twitter-followers',
  templateUrl: './twitter-followers.component.html',
  styleUrls: ['./twitter-followers.component.css']

})
export class TwitterFollowersComponent implements OnInit {
  twitterProfiles: any;
  socialConnection: SocialConnection;
  constructor(private route: ActivatedRoute, private twitterService: TwitterService, private utilService: UtilService,
    private authenticationService: AuthenticationService, private socialService: SocialService) {}

  getFollowers(socialConnection: SocialConnection) {
    this.twitterService.listTwitterProfiles(socialConnection, 'followers')
      .subscribe(
      data => {
        this.twitterProfiles = data['twitterProfiles'];
        this.utilService.abbreviateTwitterProfiles(this.twitterProfiles);
      },
      error => console.log(error),
      () => console.log(this.twitterProfiles)
      );
  }

  getSocialConnection(profileId: string, source: string) {
    this.socialService.getSocialConnection(profileId, source)
      .subscribe(
      data => {
        this.socialConnection = data;
      },
      error => console.log(error),
      () => {
        this.getFollowers(this.socialConnection);
      }
      );
  }

  ngOnInit() {
    try {
      const profileId = this.route.snapshot.params['profileId'];
      this.getSocialConnection(profileId, 'TWITTER');
    } catch (err) {
      console.log(err);
    }
  }

}