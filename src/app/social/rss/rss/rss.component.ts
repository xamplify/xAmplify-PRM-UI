import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomResponse } from '../../../common/models/custom-response';
import { Properties } from '../../../common/models/properties';
declare var swal, $: any;
@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.css'],
  providers: [Properties]
})
export class RssComponent implements OnInit {

  constructor(private rssService: RssService, private authenticationService: AuthenticationService, private router: Router, private referenceService: ReferenceService,public properties:Properties) { }
  userId: number;
  homeFeedsResponse: any;
  loading = false;
  hasError = false;
  @Output() selectedFeed = new EventEmitter();
  customResponse:CustomResponse = new CustomResponse();

  ngOnInit() {
    this.hasError = false;
    this.userId = this.authenticationService.getUserId();
    this.getHomeFeeds(this.userId);
  }
  getHomeFeeds(userId: number) {
    this.hasError = false;
    this.loading = true;
    this.rssService.getHomeFeeds(userId).subscribe(
      data => this.homeFeedsResponse = data,
      error =>{
        this.hasError =  true;
        this.loading = false;
        this.customResponse = new CustomResponse( 'ERROR', this.properties.serverErrorMessage, true );
      } ,
      () => this.loading = false
    );
  }

  createSocialCampaign(feed: any) {
      this.goToUpdateStatusOrCampaign(feed,1);
  }

  updateStatus(feed: any) {
    this.goToUpdateStatusOrCampaign(feed,2);
  }

  goToUpdateStatusOrCampaign(feed:any,type:number){
    this.referenceService.selectedFeed = feed;
    this.loading = true;
    if(1==type){
      this.router.navigate(["/home/campaigns/social"]);
    }else{
      this.router.navigate(["/home/social/update-status"]);
    }
  }
}
