import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.css']
})
export class RssComponent implements OnInit {

  constructor(private rssService: RssService, private authenticationService: AuthenticationService, private router: Router, private referenceService: ReferenceService) { }
  userId: number;
  homeFeedsResponse: any;
  loading = false;
  @Output() selectedFeed = new EventEmitter();
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

  createSocialCampaign(feed: any) {
    this.referenceService.selectedFeed = feed;
    this.router.navigate(["/home/campaigns/social"]);
  }

  updateStatus(feed: any) {
    this.referenceService.selectedFeed = feed;
    this.router.navigate(["/home/social/update-status"]);
  }
}
