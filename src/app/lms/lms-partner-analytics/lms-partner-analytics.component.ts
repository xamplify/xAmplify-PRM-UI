import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ReferenceService } from "app/core/services/reference.service";
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
import {AuthenticationService} from 'app/core/services/authentication.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
@Component({
  selector: 'app-lms-partner-analytics',
  templateUrl: './lms-partner-analytics.component.html',
  styleUrls: ['./lms-partner-analytics.component.css']
})
export class LmsPartnerAnalyticsComponent implements OnInit {

  analyticsRouter: string;
  type:string = TracksPlayBookType[TracksPlayBookType.TRACK];
  viewType: string;
  categoryId: number;
  folderViewType: string;
  isFromApprovalModule: boolean = false;
  constructor(public referenceService: ReferenceService, public router: Router,
    public authenticationService:AuthenticationService,public route:ActivatedRoute) {
  /****XNFR-170****/
  this.viewType = this.route.snapshot.params["viewType"];
  this.categoryId = this.route.snapshot.params["categoryId"];
  this.folderViewType = this.route.snapshot.params["folderViewType"];
  }

  ngOnInit() {
    this.isFromApprovalModule = this.router.url.indexOf(RouterUrlConstants.approval) > -1;
  }

  goToManageTracks(){
    this.referenceService.navigateToManageTracksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

  updateAnalyticsRouter(analyticsRouter: string){
    this.analyticsRouter = analyticsRouter;
  }

  routeToAnalytics() {
    let learningTrackId = parseInt(this.route.snapshot.params['ltId']);
    let prefix = "";
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      prefix = "/home/tracks/analytics/";
      if (this.isFromApprovalModule) {
        prefix = "/home/tracks/approval/analytics/";
      }
      this.analyticsRouter = prefix + learningTrackId;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      prefix = "/home/playbook/analytics/";
      if (this.isFromApprovalModule) {
        prefix = "/home/playbook/approval/analytics/";
      }
      this.analyticsRouter = prefix + learningTrackId;
    }
    this.referenceService.navigateToRouterByViewTypes(this.analyticsRouter, this.categoryId, this.viewType, this.folderViewType, this.folderViewType == "fl");
  }
}