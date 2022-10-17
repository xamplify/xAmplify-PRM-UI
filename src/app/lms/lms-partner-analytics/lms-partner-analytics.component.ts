import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ReferenceService } from "app/core/services/reference.service";
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
import {AuthenticationService} from 'app/core/services/authentication.service';
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
  constructor(public referenceService: ReferenceService, public router: Router,
    public authenticationService:AuthenticationService,public route:ActivatedRoute) {
  /****XNFR-170****/
  this.viewType = this.route.snapshot.params["viewType"];
  this.categoryId = this.route.snapshot.params["categoryId"];
  this.folderViewType = this.route.snapshot.params["folderViewType"];
  }

  ngOnInit() {
  }

  goToManageTracks(){
    this.referenceService.navigateToManageTracksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

  updateAnalyticsRouter(analyticsRouter: string){
    this.analyticsRouter = analyticsRouter;
  }

  routeToAnalytics(){
    let learningTrackId = parseInt(this.route.snapshot.params['ltId']);
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      this.analyticsRouter = "/home/tracks/analytics/" + learningTrackId;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      this.analyticsRouter = "/home/playbook/analytics/" + learningTrackId;
    }
    this.referenceService.navigateToRouterByViewTypes(this.analyticsRouter,this.categoryId,this.viewType,this.folderViewType,this.folderViewType=="fl");
  }
}