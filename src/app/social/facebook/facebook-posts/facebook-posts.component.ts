import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { SocialConnection } from '../../models/social-connection';
@Component( {
    selector: 'app-facebook-posts',
    templateUrl: './facebook-posts.component.html',
    styleUrls: ['./facebook-posts.component.css']
})
export class FacebookPostsComponent implements OnInit {
    posts: any;
    socialConnection: SocialConnection;
    constructor( private route: ActivatedRoute, private facebookService: FacebookService,
        private authenticationService: AuthenticationService, private socialService: SocialService ) { }
    getPosts( socialConnection: SocialConnection ) {
        this.facebookService.getPosts( socialConnection )
            .subscribe(
            data => this.posts = data['data'],
            error => console.log( error ),
            () => console.log( 'getPosts() Finished.' )
            );
    }

    ngOnInit() {
        try {
            const profileId = this.route.snapshot.params['profileId'];
            const userId = this.authenticationService.user.id;
            this.socialConnection = this.socialService.getSocialConnection( profileId, userId );

            this.getPosts( this.socialConnection );
        } catch ( err ) {
            console.log( err );
        }
    }
}
