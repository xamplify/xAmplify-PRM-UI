import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
declare var  $:any;

@Component({
  selector: 'app-feed-update',
  templateUrl: './feed-update.component.html',
  styleUrls: ['../rss/rss.component.css', '../left-nav/left-nav.component.css', '../feed/feed.component.css']
})
export class FeedUpdateComponent implements OnInit {

  constructor(public rssService: RssService, private authenticationService: AuthenticationService) { }
  @Output() selectedFeed = new EventEmitter();
  @Output() navigateUrl = new EventEmitter();
  userId: number;
  feeds: any[] = [];
  loading = false;
  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    this.getHomeFeeds(this.userId);
    this.getCollections();
   }
  getHomeFeeds(userId: number) {
    this.loading = true;
    this.rssService.getHomeFeeds(userId).subscribe(
      result => {
        if(result.statusCode === 8102){
          this.feeds = [];
          let feeds = result.data;
          let self = this;
          $.each(feeds,function(index:number,feed:any){
              self.feeds.push(feed);
          });
        }
        console.log(this.feeds);
      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  getCollections() {
    this.rssService.getCollections(this.userId)
    .subscribe(
      data => {
        this.rssService.collectionsResponse = data;
        if(this.rssService.collectionsResponse.statusCode === 8100){
          this.rssService.collectionsResponse.data.forEach(element => {
            element.isExpand = true;
          });
        }
      },
      error => console.log(error),
      () => console.log("getCollections() completed")
    );
  }

   getFeedsByCollectionAlias(collectionAlias: string){
    this.loading = true;
    this.feeds = [];
    this.rssService.getFeedsByCollectionAlias(collectionAlias).subscribe(
      result => {
        if(result.statusCode === 8102){
          this.feeds = result.data.feeds;
        }
        console.log(this.feeds);
    },
      error => console.log(error),
      () => this.loading = false
    );
  }

  getFeedsBySourceAlias(sourceAlias: string) {
    this.loading = true;
    this.feeds = [];
    this.rssService.getFeedsBySourceAlias(this.userId, sourceAlias).subscribe(
      result => {
        if(result.statusCode === 8102){
          this.feeds = result.data.feeds;
        }
        console.log(this.feeds);
      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  navigateRssHome(){
    this.navigateUrl.emit('/home/rss/discover');
  }

  addFeed(feed) {
      this.selectedFeed.emit(feed);
  }

}
