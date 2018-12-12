import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Trend } from '../../models/trend';
import { TwitterService } from '../../services/twitter.service';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { ReferenceService } from '../../../core/services/reference.service';

import { SocialConnection } from '../../models/social-connection';
import { HttpRequestLoader } from '../../../core/models/http-request-loader';

declare var $: any;

@Component({
    selector: 'app-twitter-tweets',
    templateUrl: './twitter-tweets.component.html',
    styleUrls: ['./twitter-tweets.component.css']
})

export class TwitterTweetsComponent implements OnInit {
    tweets: any;
    trends: Array<Trend> = [];
    socialConnection: SocialConnection;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

    constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService,
        private twitterService: TwitterService, private socialService: SocialService, public referenceService: ReferenceService) { }

    getTweets(socialConnection: SocialConnection) {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.twitterService.getUserTimeline(socialConnection, 0, 100)
            .subscribe(
            data => {
                for (const i of Object.keys(data)) {
                    const splitted = data[i].unmodifiedText.split(' ');
                    let updatedText = '';
                    for (const j of Object.keys(splitted)) {
                        let eachWord = '';
                        if (splitted[j].startsWith('@')) {
                            eachWord = '<a href="https://twitter.com/' + splitted[j].substring(1) + '" target="_blank"><b>' + splitted[j] + '</b></a>';
                        } else if (splitted[j].startsWith('#')) {
                            eachWord = '<a href="https://twitter.com/hashtag/' + splitted[j].substring(1) + '" target="_blank"><b>' + splitted[j] + '</b></a>';
                        }
                        else if (splitted[j].startsWith('https://t.co') || splitted[j].startsWith('http://t.co')) {
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
                console.log(error);
                this.referenceService.loading(this.httpRequestLoader, false);
                this.referenceService.showServerError(this.httpRequestLoader);
            },
            () => this.referenceService.loading(this.httpRequestLoader, false)
            );
    }

    populateReplyModalContent(id: number, screenName: string, text: string) {
        $('div.modal-body').html('');
        $('h4#replyModalLabel').html('Reply to @' + screenName);
        $('#content-' + id).clone().prependTo('div.modal-body');
        $('div.modal-body').append('<textarea class=\'tweet-status\' style=\'margin-top: 1em; min-width: 100%; max-width: 100%; min-height:64px; max-height:64px;\'>@' + screenName + ' </textarea><input type=\'hidden\' class=\'tweet-id\'>');
        $('.tweet-id').val(id);
    }

    reply() {
        this.twitterService.reply(this.socialConnection, $('.tweet-id').val(), $('.tweet-status').val())
            .subscribe(
            data => {
                $('#replyModal').modal('hide');
                alert('Replied successfully.');
                this.getTweets(this.socialConnection);
            },
            error => console.log(error),
            () => console.log(this.tweets)
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
                this.getTweets(this.socialConnection);
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
