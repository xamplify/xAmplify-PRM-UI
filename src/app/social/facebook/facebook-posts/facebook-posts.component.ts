import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';

import { SocialConnection } from '../../models/social-connection';
import { HttpRequestLoader } from '../../../core/models/http-request-loader';

@Component( {
    selector: 'app-facebook-posts',
    templateUrl: './facebook-posts.component.html',
    styleUrls: ['./facebook-posts.component.css']
})
export class FacebookPostsComponent implements OnInit {
    posts: any;
    socialConnection: SocialConnection;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

    constructor( private route: ActivatedRoute, private facebookService: FacebookService,
        private authenticationService: AuthenticationService, private socialService: SocialService, private referenceService: ReferenceService ) { }

    getPosts( socialConnection: SocialConnection ) {
        this.referenceService.loading( this.httpRequestLoader, true );
        this.facebookService.getPosts( socialConnection )
            .subscribe(
            data => {
                this.posts = data['data'];
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            error => {
                console.log( error );
                this.referenceService.showServerError( this.httpRequestLoader );
            },
            () => console.log( 'getPosts() Finished.' )
            );
    }

    ngOnInit() {
        try {
            const profileId = this.route.snapshot.params['profileId'];
            const userId = this.authenticationService.getUserId();
            this.socialConnection = this.socialService.getSocialConnection( profileId, userId );

            this.getPosts( this.socialConnection );
        } catch ( err ) {
            console.log( err );
        }
    }
}
