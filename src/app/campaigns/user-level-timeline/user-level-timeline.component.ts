import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/*****Common Imports**********************/
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { PagerService } from 'app/core/services/pager.service';
import { CampaignService } from 'app/campaigns/services/campaign.service';
@Component({
  selector: 'app-user-level-timeline',
  templateUrl: './user-level-timeline.component.html',
  styleUrls: ['./user-level-timeline.component.css']
})
export class UserLevelTimelineComponent implements OnInit {

  campaignType:string;
  userType:string;
  selectedUserId:number;
  redistributedAccountsBySelectedUserId = [];
  selectedUser = {};
  loading = false;
  constructor(private route: ActivatedRoute,private campaignService:CampaignService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router) {
	}

  ngOnInit() {
    this.userType = this.route.snapshot.params['type'];
    this.selectedUserId = parseInt(this.route.snapshot.params['userId']);
    this.selectedUser['firstName'] = "Virat";
    this.selectedUser['lastName'] = "Kohli";
    this.selectedUser['emailId'] = "vendor.role@gmail.com";
  }

  goBack(){
    this.loading = true;
    this.referenceService.goToRouter("/home/campaigns/user-campaigns/"+this.userType+"/"+this.selectedUserId);
  }

}
