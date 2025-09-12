import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
declare var  $:any;

@Component({
  selector: 'app-feed-update',
  templateUrl: './feed-update.component.html',
  styleUrls: ['./feed-update.component.css' ]
})
export class FeedUpdateComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }
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
    
  }

  getCollections() {
   
  }

   getFeedsByCollectionAlias(collectionAlias: string){

  }

  getFeedsBySourceAlias(sourceAlias: string) {
    
  }

  navigateRssHome(){
    this.navigateUrl.emit('/home/rss/discover');
  }

  addFeed(feed) {
      this.selectedFeed.emit(feed);
  }

}
