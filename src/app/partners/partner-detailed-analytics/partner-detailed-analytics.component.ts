import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListLoaderValue } from 'app/common/models/list-loader-value';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';

@Component({
  selector: 'app-partner-detailed-analytics',
  templateUrl: './partner-detailed-analytics.component.html',
  styleUrls: ['./partner-detailed-analytics.component.css']
})
export class PartnerDetailedAnalyticsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Output() notifyCloseDetailedAnalytics = new EventEmitter();

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  partnerJourneyAnalytics: any;
  teamMemberId: any;
  selectedTrackType: any = "";
  selectedAssetType: any = "";

  constructor(public listLoaderValue: ListLoaderValue, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger) {
      this.loggedInUserId = this.authenticationService.getUserId();
    }

  ngOnInit() {
    alert(this.partnerCompanyId);
  }
  

  closeDetailedAnalytics(){
    this.notifyCloseDetailedAnalytics.emit();
  }

  interactionTracksDonutSliceSelected(type: any) {
    this.selectedTrackType = type;
    alert("Selected "+type);
  }

  interactionTracksDonutSliceUnSelected(type: any) {
    if (this.selectedTrackType == type) {
      this.selectedTrackType = "";
      this.selectedAssetType = "";
      alert("Unselected "+type);
    } 
  }

  typeWiseTrackAssetsDonutSliceSelected(type: any) {
    this.selectedAssetType = type;
    alert("Selected Asset"+type);
  }
  
  typeWiseTrackAssetsDonutSliceUnSelected(type: any) {
    if (this.selectedAssetType == type) {
      this.selectedAssetType = "";
      alert("Unselected "+type);
    } 
  }

  applyTeamMemberSelection(teamMemberId: any) {
    this.teamMemberId = teamMemberId;
  }

}
