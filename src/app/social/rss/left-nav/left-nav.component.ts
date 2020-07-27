import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['../rss/rss.component.css', './left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  @Input('refreshTime') refreshTime: Date;
  constructor(public rssService: RssService, private authenticationService: AuthenticationService,private router:Router) { }
  loggedInUserId: number = this.authenticationService.getUserId();
  isloading = false;
  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getCollections();
  }

  ngOnChanges(changes: SimpleChanges) {
        let currentValue = changes.refreshTime.currentValue;
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

  goToAddCustomFeeds(){
    this.isloading = true;
    this.router.navigate(['/home/rss/add-custom-feed']);
  }

  goToAllCustomFeeds(){
    this.isloading = true;
    this.router.navigate(['/home/rss/manage-custom-feed']);
  }
}
