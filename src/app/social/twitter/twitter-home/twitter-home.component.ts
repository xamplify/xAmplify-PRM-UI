import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocialConnection } from '../../models/social-connection';
import { HttpRequestLoader } from '../../../core/models/http-request-loader';

import { TwitterService } from '../../services/twitter.service';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { UtilService } from '../../../core/services/util.service';

@Component({
  selector: 'app-twitter-home',
  templateUrl: './twitter-home.component.html',
  styleUrls: ['./twitter-home.component.css']
})
export class TwitterHomeComponent implements OnInit {
    tweets: any;
    socialConnection: SocialConnection;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    twitterProfile: any;
    profileId: any;

  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService, private twitterService: TwitterService, 
  private socialService: SocialService, private referenceService: ReferenceService, private utilService: UtilService) { }

  getHomeTimeline(socialConnection: SocialConnection) {
        this.referenceService.loading( this.httpRequestLoader, true );
        this.twitterService.getHomeTimeline( socialConnection, 0, 100 )
            .subscribe(
            data => {
                for ( const i of Object.keys(data) ) {
                    const splitted = data[i].unmodifiedText.split( ' ' );
                    let updatedText = '';
                    for ( const j of Object.keys(splitted) ) {
                        let eachWord = '';
                        if ( splitted[j].startsWith( '@' ) ) {
                            eachWord = '<a href="https://twitter.com/' + splitted[j].substring( 1 ) + '" target="_blank"><b>' + splitted[j] + '</b></a>';
                        } else if ( splitted[j].startsWith( '#' ) ) {
                            eachWord = '<a href="https://twitter.com/hashtag/' + splitted[j].substring( 1 ) + '" target="_blank"><b>' + splitted[j] + '</b></a>';
                        }
                        else if ( splitted[j].startsWith( 'https://t.co' ) || splitted[j].startsWith( 'http://t.co' ) ) {
                            eachWord = '';
                        } else {
                            eachWord = splitted[j];
                        }
                        updatedText = updatedText + eachWord + ' ';
                    }
                    updatedText = updatedText.trim();
                    data[i].unmodifiedText = updatedText;
                }
                this.tweets = data;
            },
            error => {
                console.log( error );
                this.referenceService.loading( this.httpRequestLoader, false );
                this.referenceService.showServerError( this.httpRequestLoader );
            },
            () => this.referenceService.loading( this.httpRequestLoader, false )
            );
  }

    getSocialConnection( profileId: string, source: string ) {
      this.socialService.getSocialConnection(profileId, source)
        .subscribe(
          data => {
              this.socialConnection = data;
          },
          error => console.log( error ),
          () => {
              this.getHomeTimeline( this.socialConnection );
              this.getTwitterProfile( this.socialConnection, this.profileId);
          }
        );
  }

      getTwitterProfile(socialConnection: SocialConnection, id: number) {
        this.twitterService.getTwitterProfile(socialConnection, id)
            .subscribe(
            data => {
                this.twitterProfile = data;
                this.twitterProfile.statusesCount = this.utilService.abbreviateNumber(this.twitterProfile.statusesCount);
                this.twitterProfile.friendsCount = this.utilService.abbreviateNumber(this.twitterProfile.friendsCount);
                this.twitterProfile.followersCount = this.utilService.abbreviateNumber(this.twitterProfile.followersCount);
            },
            error => console.log( error ),
            () => console.log( this.twitterProfile )
        );
    }

  ngOnInit() {
    try {
      this.profileId = this.route.snapshot.params['profileId'];
      this.getSocialConnection(this.profileId, 'TWITTER');
    } catch (err) {
      console.log(err);
    }

  }

}
