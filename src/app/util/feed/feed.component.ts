import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
@Input('feed') feed: any;
link: any;
isRssWelcome = false;
  constructor(public router:Router) {
    this.isRssWelcome = this.router.url.includes('/home/rss/welcome');
  }

  addFeed(){
  }

  ngOnInit() {
    this.feed.description = this.feed.description.replace(/<img[^>]*>/g,"");
  }
}
