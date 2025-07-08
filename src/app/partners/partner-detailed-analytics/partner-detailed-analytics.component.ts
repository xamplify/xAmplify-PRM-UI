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
  @Input() fromDeactivatedPartnersDiv: boolean = false;
  @Output() notifyCloseDetailedAnalytics = new EventEmitter();

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  partnerJourneyAnalytics: any;
  teamMemberId: any;
  selectedTrackType: any = "";
  selectedAssetType: any = "";
  toDateFilter: any;
  fromDateFilter: any;
  partnerStatus: string;

  constructor(public listLoaderValue: ListLoaderValue, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger) {
      this.loggedInUserId = this.authenticationService.getUserId();
    }

  ngOnInit() {
    /** XNFR-914 ***/
    let isAnalytics =  this.partnerCompanyId > 0 && this.partnerCompanyId != undefined;
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '' && isAnalytics) {
      this.getModulesAccessGivenByVendorForPartners(); //XNFR-914
    } else {
      this.referenseService.assetAccessGivenByVendor = true;
      this.referenseService.trackAccessGivenByVendor = true;
      this.referenseService.playBookAccessGivenByVendor = true;
      this.referenseService.opportunitiesAccessGivenByVendor = true;
      this.referenseService.contactsAccessGivenByVendor = true;
      this.referenseService.campaignAccessGivenByVendor = true;
      this.referenseService.sharedLeadAccessGivenByVendor = true;
      this.referenseService.mdfAccessGivenByVendor = true;
      this.referenseService.showAnalytics = true;
    }
    /** XNFR-914 ***/    
  }  
  closeDetailedAnalytics(){
    /** XNFR-914 ***/
    this.referenseService.assetAccessGivenByVendor = true;
    this.referenseService.trackAccessGivenByVendor = true;
    this.referenseService.playBookAccessGivenByVendor = true;
    this.referenseService.opportunitiesAccessGivenByVendor = true;
    this.referenseService.contactsAccessGivenByVendor = true;
    this.referenseService.campaignAccessGivenByVendor = true;
    this.referenseService.sharedLeadAccessGivenByVendor = true;
    this.referenseService.mdfAccessGivenByVendor = true;
    this.referenseService.showAnalytics = true;
    /** XNFR-914 ***/
    this.notifyCloseDetailedAnalytics.emit();
  }

  interactionTracksDonutSliceSelected(type: any) {
    this.selectedTrackType = type;
    this.selectedAssetType = "";
  }

  interactionTracksDonutSliceUnSelected(type: any) {
    if (this.selectedTrackType == type) {
      this.selectedTrackType = "";
      this.selectedAssetType = "";
    } 
  }

  typeWiseTrackAssetsDonutSliceSelected(type: any) {
    this.selectedAssetType = type;
  }
  
  typeWiseTrackAssetsDonutSliceUnSelected(type: any) {
    if (this.selectedAssetType == type) {
      this.selectedAssetType = "";
    } 
  }

  applyTeamMemberSelection(teamMemberId: any) {
    this.teamMemberId = teamMemberId;
  }

  getDateFilterOptions(event: any) {
    this.fromDateFilter = event.fromDate;
    this.toDateFilter = event.toDate;
  }
  /*** XNFR-914 ***/
    getModulesAccessGivenByVendorForPartners(){
    this.parterService.getModulesAccessGivenByVendorForPartners(this.authenticationService.companyProfileName,this.partnerCompanyId, this.loggedInUserId).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
           this.moduleAccessGivenByVendorForPartner(response.data);
        }
      },
      (_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
      }
    );
  }
  moduleAccessGivenByVendorForPartner(partnerModules: any) {
    for (let module of partnerModules) {
      if (module.moduleId === 2) {
        this.referenseService.campaignAccessGivenByVendor = module.partnerAccessModule;
      } else if (module.moduleId === 3) {
        this.referenseService.contactsAccessGivenByVendor = module.partnerAccessModule;
      } else if (module.moduleId === 5) {
        this.referenseService.assetAccessGivenByVendor = module.partnerAccessModule;
      } else if (module.moduleId === 8) {
        this.referenseService.mdfAccessGivenByVendor = module.partnerAccessModule;
      } else if (module.moduleId === 9) {
        this.referenseService.opportunitiesAccessGivenByVendor = module.partnerAccessModule;
      } else if (module.moduleId === 12) {
        this.referenseService.playBookAccessGivenByVendor = module.partnerAccessModule;
      } else if (module.moduleId === 14) {
        this.referenseService.sharedLeadAccessGivenByVendor = module.partnerAccessModule;
      } else if (module.moduleId === 18) {
        this.referenseService.trackAccessGivenByVendor = module.partnerAccessModule;
      } 
    }
    if (!(this.referenseService.campaignAccessGivenByVendor || this.referenseService.contactsAccessGivenByVendor || this.referenseService.assetAccessGivenByVendor ||
      this.referenseService.mdfAccessGivenByVendor || this.referenseService.opportunitiesAccessGivenByVendor || this.referenseService.playBookAccessGivenByVendor ||
      this.referenseService.sharedLeadAccessGivenByVendor || this.referenseService.trackAccessGivenByVendor)) {
      this.referenseService.showAnalytics = false;
    }
  }
  /*** XNFR-914 ***/

  getPartnerStatus(event: any) {
    this.partnerStatus = event;
  }

}
