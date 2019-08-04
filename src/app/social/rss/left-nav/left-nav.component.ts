import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['../rss/rss.component.css', './left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  @Input('refresh') refresh: boolean;
  constructor(public rssService: RssService, private authenticationService: AuthenticationService) { }
  loggedInUserId: number = this.authenticationService.getUserId();
  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getCollections();
  }

  ngOnChanges(changes: SimpleChanges) {

        let currentValue = changes.refresh.currentValue;
        if(currentValue)
          this.getCollections();
  }

  getCollections() {
    this.rssService.getCollections(this.loggedInUserId)
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
}
