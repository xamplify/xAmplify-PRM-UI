import { Component, OnInit, Input } from '@angular/core';
import { FacebookService } from '../../services/facebook.service';

@Component( {
    selector: 'app-facebook-comments',
    templateUrl: './facebook-comments.component.html',
    styleUrls: ['./facebook-comments.component.css']
})
export class FacebookCommentsComponent implements OnInit {
    @Input( 'postId' ) postId: string;
    comments: any;
    constructor( private facebookService: FacebookService ) { }
    getComments() {
        this.facebookService.getComments( localStorage.getItem( 'facebook' ), this.postId )
            .subscribe(
            data => this.comments = data["data"],
            error => console.log( error ),
            () => console.log( 'getComments() Finished.' )
            );
    }
    ngOnInit() {
        this.getComments();
    }

}
