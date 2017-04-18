import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import {TwitterProfile} from "../../models/twitter-profile";
import {KloutScore} from "../../models/klout-score";
import {DirectMessage} from "../../models/direct-message";

import {TwitterService} from "../../services/twitter.service";

declare var $: any;

@Component({
  selector: "app-twitter-profile",
  templateUrl: "./twitter-profile.component.html",
  styleUrls :['./twitter-profile.component.css']

})

export class TwitterProfileComponent implements OnInit{
    twitterProfile:TwitterProfile;
    directMessages: Array<DirectMessage>;
    directMessageId: number;
    kloutScore: KloutScore;
    tweets:any;
    constructor(private router: Router, private route: ActivatedRoute, private twitterService: TwitterService) {
        
    }
    
    getTwitterProfile(id: number){
        this.twitterService.getTwitterProfile(id)
        .subscribe(
            data => this.twitterProfile = data,
            error => console.log(error),
            () => console.log(this.twitterProfile)
        );
    }
    
    getConversation(id: number){
        this.twitterService.getConversation(id)
        .subscribe(
            data => {
                this.directMessages = data;
            },
            error => console.log(error),
            () => console.log(this.directMessages[0].sender.id)
        );
    }
    
    getKloutScore(id: number){
        this.twitterService.getKloutScore(id)
        .subscribe(
            data => {
                this.kloutScore = data;
            },
            error => console.log(error),
            () => console.log(id)
        );
    
    }
    
    sendDirectMessage(text:string){
        this.twitterService.sendDirectMessage(this.twitterProfile.id, text)
        .subscribe(
            data => {
                this.directMessages.push(data);
                $('#myModal').modal('hide');
            },
            error => console.log(error),
            () => console.log(this.twitterProfile.id)
        );
    }
    deleteDirectMessage(){
        $('.DMDeleteMessage').show();
        console.log("messageId: "+this.directMessageId);
        this.twitterService.deleteDirectMessage(this.directMessageId)
        .subscribe(
            data => {
                $('.DMDeleteMessage').hide('1000');
                $('#'+this.directMessageId).remove();
            },
            error => console.log(error),
            () => console.log(this.twitterProfile.id)
        );
    }
    showDeleteDirectMessageNotice(directMessageId:number){
        $('.DMDeleteMessage').show('1000');
        this.directMessageId = directMessageId;
    }
    hideDeleteDirectMessageNotice(){
        $('.DMDeleteMessage').hide('1000');
    }
    getTweets(id:number){
        this.twitterService.getTweets(id,100)
        .subscribe(
            data => {
                for (var i in data){
                    var splitted = data[i].text.split(" ");
                    var updatedText = "";
                    for(var j in splitted){
                        var eachWord = "";
                        if(splitted[j].startsWith("@")){
                            eachWord = '<a href="https://twitter.com/'+splitted[j].substring(1)+'" target="_blank"><b>'+splitted[j]+'</b></a>';
                        }else if(splitted[j].startsWith("#")){
                            eachWord = '<a href="https://twitter.com/hashtag/'+splitted[j].substring(1)+'" target="_blank"><b>'+splitted[j]+'</b></a>';
                        }
                        else if(splitted[j].startsWith("https://t.co") || splitted[j].startsWith("http://t.co")){
                            eachWord = "";
                        }else{
                            eachWord = splitted[j];
                        }
                        updatedText = updatedText + eachWord + " ";
                    }
                    updatedText = updatedText.trim();
                    data[i].text = updatedText;
                }
                this.tweets = data
            },
            error => console.log(error),
            () => console.log(this.tweets.length)
        );
    
    }

    ngOnInit(){
        let id = +this.route.snapshot.params['id'];
        this.getTwitterProfile(id);
        this.getTweets(id);
        this.getConversation(id);
        this.getKloutScore(id);
    }       

}