import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { TwitterProfile } from "../../models/twitter-profile";

import { TwitterService } from "../../services/twitter.service";
import { UtilService } from "../../../core/services/util.service";
import { SocialService } from "../../services/social.service";
import { AuthenticationService } from "../../../core/services/authentication.service";
import { ReferenceService } from "../../../core/services/reference.service";

import { SocialConnection } from "../../models/social-connection";

@Component({
  selector: "app-twitter-friends",
  templateUrl: "./twitter-friends.component.html",
  styleUrls: ["./twitter-friends.component.css"]
})
export class TwitterFriendsComponent implements OnInit {
  twitterProfiles: any;
  socialConnection: SocialConnection;

  constructor(
    private route: ActivatedRoute,
    private twitterService: TwitterService,
    private utilService: UtilService,
    private authenticationService: AuthenticationService,
    private socialService: SocialService, public referenceService: ReferenceService
  ) { }

  getFriends(socialConnection: SocialConnection) {
    this.twitterService
      .listTwitterProfiles(socialConnection, "friends")
      .subscribe(
      data => {
        this.twitterProfiles = data["twitterProfiles"];
        this.utilService.abbreviateTwitterProfiles(this.twitterProfiles);
      },
      error => console.log(error),
      () => console.log(this.twitterProfiles)
      );
  }

  getSocialConnectionByUserIdAndProfileId(userId: number, profileId: any) {
    this.socialService.getSocialConnectionByUserIdAndProfileId(userId, profileId)
      .subscribe(
      data => {
        this.socialConnection = data;
      },
      error => console.log(error),
      () => {
        this.getFriends(this.socialConnection);
      }
      );
  }

  ngOnInit() {
    try {
      const userId = this.authenticationService.getUserId();
      const profileId = this.route.snapshot.params['profileId'];
      this.getSocialConnectionByUserIdAndProfileId(userId, profileId);
    } catch (err) {
      console.log(err);
    }
  }
}
