import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { PartnerJourneyRequest } from '../../partners/models/partner-journey-request';
import { TeamMemberAnalyticsRequest } from 'app/team/models/team-member-analytics-request';
import { Properties } from 'app/common/models/properties';

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
  @Input() isVendorVersion : boolean = false;
  @Input() vanityUrlFilter : boolean = false;
  @Input() vendorCompanyProfileName : string = '';
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';
  shareLeadText: string = 'Share Leads';

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  partnerJourneyAnalytics: any;
  partnerModuleName: string;
  infoName: string;

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public utilService: UtilService, public xtremandLogger: XtremandLogger,public properties: Properties) {
      this.loggedInUserId = this.authenticationService.getUserId(); 
  }

  ngOnInit() {    
    this.getInfoname();
  }

  private getInfoname() {
    const customName = this.authenticationService.partnerModule.customName;
    const isCustomNameDefined = customName != null && customName.length > 0;

    this.partnerModuleName = isCustomNameDefined ? customName : " Partner";

    if (!this.isDetailedAnalytics) {
      this.infoName = ` All ${this.partnerModuleName}s`;
    } else {
      this.infoName = ` the ${this.partnerModuleName}`;
    }
  }

  ngOnChanges() {
    if (!this.isTeamMemberAnalytics) {
      this.getCounts();
    } else {
      if(!this.isVendorVersion){
        this.shareLeadText = 'Shared Leads';
      }else{
        this.shareLeadText = 'Share Leads';
      }
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
    partnerJourneyRequest.fromDateFilterInString = this.fromDateFilter
    partnerJourneyRequest.toDateFilterInString = this.toDateFilter;
    partnerJourneyRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
    if(!this.isVendorVersion){
      teamMemberAnalyticsRequest.vanityUrlFilter = this.vanityUrlFilter;
      teamMemberAnalyticsRequest.vendorCompanyProfileName = this.vendorCompanyProfileName;
    }
    teamMemberAnalyticsRequest.fromDateFilterInString = this.fromDateFilter
    teamMemberAnalyticsRequest.toDateFilterInString = this.toDateFilter;
    teamMemberAnalyticsRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.parterService.getTeamMemberAnalyticsCounts(teamMemberAnalyticsRequest,this.isVendorVersion).subscribe(
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
