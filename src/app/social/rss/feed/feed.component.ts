import { Component, OnInit, Input } from '@angular/core';
import { SocialService } from '../../services/social.service';
declare var $: any;
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
@Input('feed') feed: any;
link: any;
  constructor(public socialService: SocialService) {
  }

  addFeed(){
    this.socialService.selectedFeed = this.feed;
  }

  ngOnInit() {
    this.feed.description = this.feed.description.replace(/<img[^>]*>/g,"");
  }
}
