import { Component, OnInit } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.css']
})
export class RssComponent implements OnInit {

  constructor(private rssService: RssService, private authenticationService: AuthenticationService) { }
  userId: number;
  homeFeedsResponse: any;
  loading = false;
  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    this.getHomeFeeds(this.userId);
   }
  getHomeFeeds(userId: number) {
    this.loading = true;
    this.rssService.getHomeFeeds(userId).subscribe(
      data => this.homeFeedsResponse = data,
      error => console.log(error),
      () => this.loading = false
    );
  }
}
