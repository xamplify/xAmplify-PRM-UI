import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

import { Trend } from '../../models/trend';

import { TwitterService } from "../../services/twitter.service";
import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import { SocialConnection } from '../../models/social-connection';

declare var $: any;

@Component( {
    selector: "app-twitter-tweets",
    templateUrl: "./twitter-tweets.component.html",
    styleUrls: ['./twitter-tweets.component.css']

})

export class TwitterTweetsComponent implements OnInit {
    tweets: any;
    trends: Array<Trend> = [];
    socialConnection: SocialConnection;

    constructor( private route: ActivatedRoute, private authenticationService: AuthenticationService,
        private twitterService: TwitterService, private socialService: SocialService ) { }

    getTweets( socialConnection: SocialConnection ) {
        this.twitterService.getTweets( socialConnection, 0, 100 )
            .subscribe(
            data => {
                for ( var i in data ) {
                    var splitted = data[i].unmodifiedText.split( " " );
                    var updatedText = "";
                    for ( var j in splitted ) {
                        var eachWord = "";
                        if ( splitted[j].startsWith( "@" ) ) {
                            eachWord = '<a href="https://twitter.com/' + splitted[j].substring( 1 ) + '" target="_blank"><b>' + splitted[j] + '</b></a>';
                        } else if ( splitted[j].startsWith( "#" ) ) {
                            eachWord = '<a href="https://twitter.com/hashtag/' + splitted[j].substring( 1 ) + '" target="_blank"><b>' + splitted[j] + '</b></a>';
                        }
                        else if ( splitted[j].startsWith( "https://t.co" ) || splitted[j].startsWith( "http://t.co" ) ) {
                            eachWord = "";
                        } else {
                            eachWord = splitted[j];
                        }
                        updatedText = updatedText + eachWord + " ";
                    }
                    updatedText = updatedText.trim();
                    data[i].unmodifiedText = updatedText;
                }
                this.tweets = data
            },
            error => console.log( error ),
            () => console.log( this.tweets.length )
            );
    }

    getTrends( socialConnection: SocialConnection ) {
        this.twitterService.getTrends( socialConnection )
            .subscribe(
            data => {
                this.trends = data.trends.splice( 0, 10 );
                for ( var i in this.trends ) {
                    if ( this.trends[i].name.startsWith( "#" ) ) {
                        this.trends[i].name = '<a href="https://twitter.com/hashtag/' + this.trends[i].name.substring( 1 ) + '?src=tren" target="_blank"><b>' + this.trends[i].name + '</b></a>';
                    } else {
                        this.trends[i].name = '<a href="https://twitter.com/search?q=' + this.trends[i].name + '&src=tren" target="_blank"><b>' + this.trends[i].name + '</b></a>'
                    }
                }
            },
            error => console.log( error ),
            () => console.log( "getTrends() finished." )
            );
    }

    populateReplyModalContent( id: number, screenName: string, text: string ) {
        $( "div.modal-body" ).html( "" );
        $( "h4#replyModalLabel" ).html( "Reply to @" + screenName );
        $( "#content-" + id ).clone().prependTo( "div.modal-body" );
        $( "div.modal-body" ).append( "<textarea class='tweet-status' style='margin-top: 1em; min-width: 100%; max-width: 100%; min-height:64px; max-height:64px;'>@" + screenName + " </textarea><input type='hidden' class='tweet-id'>" );
        $( ".tweet-id" ).val( id );
    }

    reply() {
        this.twitterService.reply(this.socialConnection, $( '.tweet-id' ).val(), $( '.tweet-status' ).val() )
            .subscribe(
            data => {
                $( '#replyModal' ).modal( 'hide' );
                alert( 'Replied successfully.' );
                this.getTweets( this.socialConnection );
            },
            error => console.log( error ),
            () => console.log( this.tweets )
            );
    }

    ngOnInit() {
        try {
            const profileId = this.route.snapshot.params['profileId'];
            const userId = this.authenticationService.user.id;
            this.socialConnection = this.socialService.getSocialConnection( profileId, userId );

            this.getTweets( this.socialConnection );
            this.getTrends( this.socialConnection );
        }
        catch ( err ) {
            console.log( err );
        }
    }

}