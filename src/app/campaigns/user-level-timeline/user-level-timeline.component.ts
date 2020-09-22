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
  styleUrls: ['./user-level-timeline.component.css','../analytics/timeline.css','../analytics/analytics.component.css']
})
export class UserLevelTimelineComponent implements OnInit {

  campaignType:string = "";
  userType:string;
  campaignId:number;
  selectedUserId:number;
  redistributedAccountsBySelectedUserId = [];
  selectedUser = {};
  loading = false;
  dataLoader = false;
  userLevelCampaignAnalyticsDTO = {};
  emailLogs:Array<any> = new Array<any>();
  campaignDetails = {};
  constructor(private route: ActivatedRoute,private campaignService:CampaignService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router) {
	}

  ngOnInit() {
    this.loading = true;
    this.dataLoader = true;
    this.userType = this.route.snapshot.params['type'];
    this.selectedUserId = parseInt(this.route.snapshot.params['userId']);
    this.campaignId = parseInt(this.route.snapshot.params['campaignId']);
    this.selectedUser['firstName'] = "Virat";
    this.selectedUser['lastName'] = "Kohli";
    this.selectedUser['emailId'] = "vendor.role@gmail.com";
    this.getUserLevelTimeLineSeriesData();

  }

  getUserLevelTimeLineSeriesData(){
    this.loading = true;
    this.dataLoader = true;
    this.campaignService.getUserLevelTimeLineSeriesData(this.campaignId,this.selectedUserId,this.userType).subscribe((result: any) => {
     let timeLineData = result.data['userLevelCampaignTimeLineData'];
     this.userLevelCampaignAnalyticsDTO = timeLineData;
     this.emailLogs = timeLineData['emailLogs'];
     this.campaignDetails = timeLineData['campaignDetais'];
     let launchTimeInUtcString = this.campaignDetails['launchTimeInUTCString'];
     if(launchTimeInUtcString!=""){
      this.campaignDetails['displayTime'] = new Date(launchTimeInUtcString);
     }else{
      this.campaignDetails['displayTime'] = "-";
     }
     
     this.campaignType = this.campaignDetails['campaignType'];
     this.loading = false;
     this.dataLoader = false;
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  goBack(){
    this.loading = true;
    this.referenceService.goToRouter("/home/campaigns/user-campaigns/"+this.userType+"/"+this.selectedUserId);
  }

}
