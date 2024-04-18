import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { PartnerJourneyRequest } from '../../partners/models/partner-journey-request';
import { TeamMemberAnalyticsRequest } from 'app/team/models/team-member-analytics-request';

@Component({
  selector: 'app-partner-journey-count-tiles',
  templateUrl: './partner-journey-count-tiles.component.html',
  styleUrls: ['./partner-journey-count-tiles.component.css']
})
export class PartnerJourneyCountTilesComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input()  isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Input() applyFilter: boolean;
  @Input() isTeamMemberAnalytics: boolean;
  @Input() selectedVendorCompanyIds: any[] = [];
	@Input() selectedTeamMemberIds: any[] = [];

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  partnerJourneyAnalytics: any;

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public utilService: UtilService, public xtremandLogger: XtremandLogger) {
      this.loggedInUserId = this.authenticationService.getUserId(); 
  }

  ngOnInit() {    
  }

  ngOnChanges() {
    if (!this.isTeamMemberAnalytics) {
      this.getCounts();
    } else {
      this.getTeamMemberCounts();
    }
  }

  getCounts() {
    this.referenseService.loading(this.httpRequestLoader, true);
    let partnerJourneyRequest = new PartnerJourneyRequest();
    partnerJourneyRequest.loggedInUserId = this.loggedInUserId;
    partnerJourneyRequest.partnerCompanyId = this.partnerCompanyId;
    partnerJourneyRequest.teamMemberUserId = this.teamMemberId;
    partnerJourneyRequest.detailedAnalytics = this.isDetailedAnalytics;
    partnerJourneyRequest.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    partnerJourneyRequest.partnerTeamMemberGroupFilter = this.applyFilter;
    this.parterService.getPartnerJourneyCounts(partnerJourneyRequest).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.partnerJourneyAnalytics = response.data;	
        }        	
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

  getTeamMemberCounts() {
    this.referenseService.loading(this.httpRequestLoader, true);
    let teamMemberAnalyticsRequest = new TeamMemberAnalyticsRequest();
    teamMemberAnalyticsRequest.loggedInUserId = this.loggedInUserId;
    teamMemberAnalyticsRequest.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    teamMemberAnalyticsRequest.selectedTeamMemberIds = this.selectedTeamMemberIds;
    this.parterService.getTeamMemberAnalyticsCounts(teamMemberAnalyticsRequest).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.partnerJourneyAnalytics = response.data;
        }
      },
      (_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
      }
    );
  }
}
