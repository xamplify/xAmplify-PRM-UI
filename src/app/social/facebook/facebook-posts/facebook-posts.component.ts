import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';

@Component( {
    selector: 'app-facebook-posts',
    templateUrl: './facebook-posts.component.html',
    styleUrls: ['./facebook-posts.component.css']
})
export class FacebookPostsComponent implements OnInit {
    posts: any;
    profileImage: string;
    constructor( private route: ActivatedRoute, private facebookService: FacebookService, private sanitizer: DomSanitizer ) { }
    getPosts( ownerId: string ) {
        this.facebookService.getPosts( localStorage.getItem( 'facebook' ), ownerId )
            .subscribe(
            data => {
                this.posts = data["data"];
                for(var i in this.posts){
                    if(this.posts[i].type == 'video'){
                        if(this.posts[i].source.indexOf('www.youtube.com/embed/') >= 0 ){
                            this.posts[i].source = this.sanitizer.bypassSecurityTrustResourceUrl(this.posts[i].source);
                        }
                    }
                }
            },
            error => console.log( error ),
            () => console.log( 'getPosts() Finished.' )
            );
    }

    getUserProfileImage( userId: string ) {
        this.facebookService.getUserProfileImage( localStorage.getItem( 'facebook' ), userId )
            .subscribe(
            data => this.profileImage = data,
            error => console.log( error ),
            () => console.log( 'getUserProfileImage() Finished.' )
            );

    }
    ngOnInit() {
        try {
            const ownerId = this.route.snapshot.params['ownerId'];
            this.getUserProfileImage( ownerId );
            this.getPosts( ownerId );
        } catch ( err ) {
            console.log( err );
        }
    }
}
