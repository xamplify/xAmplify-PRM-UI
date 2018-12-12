import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Trend } from '../../models/trend';
import { TwitterService } from '../../services/twitter.service';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { ReferenceService } from '../../../core/services/reference.service';

import { SocialConnection } from '../../models/social-connection';
import { HttpRequestLoader } from '../../../core/models/http-request-loader';

@Component({
    selector: 'app-twitter-trends',
    templateUrl: './twitter-trends.component.html',
    styleUrls: ['./twitter-trends.component.css']
})
export class TwitterTrendsComponent implements OnInit {
    trends: Array<Trend> = [];
    socialConnection: SocialConnection;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService,
        private twitterService: TwitterService, private socialService: SocialService, private referenceService: ReferenceService) { }
    getTrends(socialConnection: SocialConnection) {
        this.twitterService.getTrends(socialConnection)
            .subscribe(
            data => {
                this.trends = data.trends.splice(0, 10);
                for (let i in this.trends) {
                    if (this.trends[i].name.startsWith('#')) {
                        this.trends[i].name = '<a href="https://twitter.com/hashtag/' + this.trends[i].name.substring(1) + '?src=tren" target="_blank"><b>' + this.trends[i].name + '</b></a>';
                    } else {
                        this.trends[i].name = '<a href="https://twitter.com/search?q=' + this.trends[i].name + '&src=tren" target="_blank"><b>' + this.trends[i].name + '</b></a>'
                    }
                }
            },
            error => console.log(error),
            () => console.log('getTrends() finished.')
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
                this.getTrends(this.socialConnection);
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
