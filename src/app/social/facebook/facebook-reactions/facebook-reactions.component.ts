import { Component, OnInit, Input } from '@angular/core';
import { FacebookService } from '../../services/facebook.service';

@Component( {
    selector: 'app-facebook-reactions',
    templateUrl: './facebook-reactions.component.html',
    styleUrls: ['./facebook-reactions.component.css']
})
export class FacebookReactionsComponent implements OnInit {
    @Input( 'postId' ) postId: string;
    @Input( 'facebookAccessToken' ) facebookAccessToken: string;
    @Input('totalCount') totalCount: number;
    reactions: any;
    constructor( private facebookService: FacebookService ) { }
    getReactions() {
        this.facebookService.getReactions( this.postId, this.facebookAccessToken )
            .subscribe(
            data => this.reactions = data["data"],
            error => console.log( error ),
            () => console.log( 'getReactions() Finished.' )
            );
    }
    ngOnInit() {
        // this.getReactions();
    }

}
