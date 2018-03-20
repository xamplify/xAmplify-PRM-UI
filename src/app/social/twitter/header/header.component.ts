import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TwitterProfile } from '../../models/twitter-profile';
import { KloutScore } from '../../models/klout-score';
import { DirectMessage } from '../../models/direct-message';

import { TwitterService } from '../../services/twitter.service';
import { UtilService } from '../../../core/services/util.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { SocialService } from '../../services/social.service';

import { SocialConnection } from '../../models/social-connection';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  profileId: any;
  twitterProfile: any;
  socialConnection: SocialConnection;

  twitterNavs: any = [
    { name: 'home', count: '...', isCurrent: false },
    { name: 'tweets', count: 0, isCurrent: false },
    { name: 'friends', count: 0, isCurrent: false },
    { name: 'followers', count: 0, isCurrent: false }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private twitterService: TwitterService,
    private utilService: UtilService, private authenticationService: AuthenticationService, private socialService: SocialService) {

  }

  getSocialConnection(profileId: any, source: string) {
    this.socialService.getSocialConnection(profileId, source)
      .subscribe(
      data => {
        this.socialConnection = data;
      },
      error => console.log(error),
      () => {
        this.getTwitterProfile(this.socialConnection, profileId);
      }
      );
  }

  getTwitterProfile(socialConnection: SocialConnection, id: number) {
    this.twitterService.getTwitterProfile(socialConnection, id)
      .subscribe(
      data => {
        this.twitterProfile = data;
        this.twitterNavs[1].count = this.utilService.abbreviateNumber(this.twitterProfile.statusesCount);
        this.twitterNavs[2].count = this.utilService.abbreviateNumber(this.twitterProfile.friendsCount);
        this.twitterNavs[3].count = this.utilService.abbreviateNumber(this.twitterProfile.followersCount);
      },
      error => console.log(error),
      () => console.log(this.twitterProfile)
      );
  }

  ngOnInit() {
    this.profileId = this.route.snapshot.params['profileId'];
    const path = this.route.snapshot.url[1].path;
    const obj = this.twitterNavs.find(function (obj) { return obj.name === path; });
    obj.isCurrent = true;
    this.getSocialConnection(this.profileId, 'TWITTER');
  }

}
