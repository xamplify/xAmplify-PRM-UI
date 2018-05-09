import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {TwitterProfile} from '../../models/twitter-profile';
import {KloutScore} from '../../models/klout-score';
import {DirectMessage} from '../../models/direct-message';

import {TwitterService} from '../../services/twitter.service';
import { UtilService } from '../../../core/services/util.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { SocialService } from '../../services/social.service';

import { SocialConnection } from '../../models/social-connection';
import { ReferenceService } from '../../../core/services/reference.service';

declare var $: any;

@Component({
  selector: 'app-twitter-profile',
  templateUrl: './twitter-profile.component.html',
  styleUrls : ['./twitter-profile.component.css']

})

export class TwitterProfileComponent implements OnInit {
    twitterProfile: any;
    directMessages: Array<DirectMessage>;
    directMessageId: number;
    directMessageText: string;
    kloutScore: KloutScore;
    tweets: any;
    socialConnection: SocialConnection;
    constructor(private router: Router, private route: ActivatedRoute, private twitterService: TwitterService,
            private utilService: UtilService, private authenticationService: AuthenticationService, private socialService: SocialService,
            public referenceService:ReferenceService) {

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

    getConversation(socialConnection: SocialConnection, id: number) {
        this.twitterService.getConversation(socialConnection, id)
        .subscribe(
            data => {
                this.directMessages = data;
            },
            error => console.log(error),
            () => console.log(this.directMessages.length)
        );
    }

    getKloutScore(socialConnection: SocialConnection, id: number) {
        this.twitterService.getKloutScore(socialConnection, id)
        .subscribe(
            data => {
                this.kloutScore = data;
            },
            error => console.log(error),
            () => console.log(id)
        );

    }

    sendDirectMessage(directMessageText: string) {
        this.twitterService.sendDirectMessage(this.twitterProfile.id, directMessageText)
        .subscribe(
            data => {
                this.directMessages.push(data);
                $('#myModal').modal('hide');
            },
            error => console.log(error),
            () => {
                this.directMessageText = '';
            }
        );
    }
    deleteDirectMessage(socialConnection: SocialConnection) {
        $('.DMDeleteMessage').show();
        console.log('messageId: ' + this.directMessageId);
        this.twitterService.deleteDirectMessage(this.directMessageId)
        .subscribe(
            data => {
                $('.DMDeleteMessage').hide('1000');
                $('#' + this.directMessageId).remove();
            },
            error => console.log(error),
            () => console.log(this.twitterProfile.id)
        );
    }
    showDeleteDirectMessageNotice(directMessageId: number) {
        $('.DMDeleteMessage').show('1000');
        this.directMessageId = directMessageId;
    }
    hideDeleteDirectMessageNotice() {
        $('.DMDeleteMessage').hide('1000');
    }
    getTweets(socialConnection: SocialConnection, id: number) {
        this.twitterService.getUserTimeline(socialConnection, id, 100)
        .subscribe(
            data => {
                for (var i in data) {
                    var splitted = data[i].text.split(' ');
                    var updatedText = '';
                    for (var j in splitted) {
                        var eachWord = '';
                        if (splitted[j].startsWith('@')) {
                            eachWord = '<a href="https://twitter.com/' + splitted[j].substring(1) + '" target="_blank"><b>' + splitted[j] + '</b></a>';
                        }else if (splitted[j].startsWith('#')) {
                            eachWord = '<a href="https://twitter.com/hashtag/' + splitted[j].substring(1) + '" target="_blank"><b>' + splitted[j] + '</b></a>';
                        }
                        else if (splitted[j].startsWith('https://t.co') || splitted[j].startsWith('http://t.co')) {
                            eachWord = '';
                        }else {
                            eachWord = splitted[j];
                        }
                        updatedText = updatedText + eachWord + ' ';
                    }
                    updatedText = updatedText.trim();
                    data[i].text = updatedText;
                }
                this.tweets = data;
            },
            error => console.log(error),
            () => console.log(this.tweets.length)
        );

    }

    getSocialConnection(profileId1: string, profileId2: number, source: string) {
    this.socialService.getSocialConnection(profileId1, source)
      .subscribe(
      data => {
        this.socialConnection = data;
      },
      error => console.log(error),
      () => {
        this.getTwitterProfile(this.socialConnection, profileId2);
        this.getTweets(this.socialConnection, profileId2);
        this.getConversation(this.socialConnection, profileId2);
        this.getKloutScore(this.socialConnection, profileId2);
      }
      );
  }

    ngOnInit() {
        const profileId1 = this.route.snapshot.params['profileId1'];
        const profileId2 = this.route.snapshot.params['profileId2'];
        this.getSocialConnection(profileId1, profileId2, 'TWITTER');
    }

}
