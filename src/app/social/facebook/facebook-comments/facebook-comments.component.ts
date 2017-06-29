import { Component, OnInit, Input } from '@angular/core';
import { FacebookService } from '../../services/facebook.service';

@Component( {
    selector: 'app-facebook-comments',
    templateUrl: './facebook-comments.component.html',
    styleUrls: ['./facebook-comments.component.css']
})
export class FacebookCommentsComponent implements OnInit {
    @Input( 'postId' ) postId: string;
    @Input( 'facebookAccessToken' ) facebookAccessToken: string;
    @Input( 'totalCount' ) totalCount: number;

    comments: any;
    constructor( private facebookService: FacebookService ) { }
    getComments() {
        this.facebookService.getComments( this.postId, this.facebookAccessToken )
            .subscribe(
            data => this.comments = data["data"],
            error => console.log( error ),
            () => console.log( 'getComments() Finished.' )
            );
    }
    ngOnInit() {
        // this.getComments();
    }

}
