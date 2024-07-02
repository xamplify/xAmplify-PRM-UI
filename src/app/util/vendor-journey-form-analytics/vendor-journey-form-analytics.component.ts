import { Component, Input, OnInit } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Pagination } from '../../core/models/pagination';
import { SubmittedFormData } from '../../forms/models/submitted-form-data';
import { ReferenceService } from '../../core/services/reference.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../forms/services/form.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { PagerService } from '../../core/services/pager.service';
import { Properties } from '../../common/models/properties';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
declare var $: any;

@Component({
  selector: 'app-vendor-journey-form-analytics',
  templateUrl: './vendor-journey-form-analytics.component.html',
  styleUrls: ['./vendor-journey-form-analytics.component.css']
})
export class VendorJourneyFormAnalyticsComponent implements OnInit {

  copiedLinkCustomResponse: CustomResponse = new CustomResponse();
  formId: any;
  partnerLandingPageAlias: any;
  loggedInUserId: number = 0;
  partnerId: number = 0;
  alias: string = "";
  campaignAlias: string = "";
  formName = "";
  pagination: Pagination = new Pagination();
  columns: Array<any> = new Array<any>();
  formDataRows: Array<SubmittedFormData> = new Array<SubmittedFormData>();
  statusCode: number = 200;
  selectedSortedOption: any;
  searchKey = "";
  campaignForms = false;
  routerLink = "/home/forms/manage";
  isTotalLeadsData = false;
  isTotalAttendees: boolean;
  @Input() importedObject: any;
  status = true;
  title: string = "";
  isEventCheckIn = false;
  customResponse: CustomResponse = new CustomResponse();
  publicEventAlias = "";
  formAnalyticsDownload = false;
  campaignFormAnalyticsDownload = false;
  campaignPartnerFormAnalyticsDownload: boolean;
  @Input() isVendorJourney: boolean;
  @Input() isMasterLandingPage: boolean;
  analyticsObject:any={};

  constructor(public referenceService: ReferenceService, private route: ActivatedRoute,
      public authenticationService: AuthenticationService, public formService: FormService,
      public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService, public router: Router,
      public logger: XtremandLogger, public callActionSwitch: CallActionSwitch, public properties: Properties,
      private campaignService: CampaignService
  ) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.pagination.userId = this.loggedInUserId;
  }

  ngOnInit() {
      let objectLength = Object.keys(this.importedObject).length;
      if (objectLength > 0) {
          this.alias = this.importedObject['formAlias'];
          //this.partnerLandingPageAlias = this.importedObject['partnerLandingPageAlias'];
          //this.formId = this.importedObject['formId'];
          //this.partnerId = this.importedObject['partnerId'];
          //this.title = this.importedObject['title'];
          
              this.formAnalyticsDownload = true;
          
          this.listSubmittedData(this.pagination);
      }

  }

  
  listSubmittedData(pagination: Pagination) {
    pagination.searchKey = this.searchKey;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.formService.getVendorJourneyFormAnalytics(pagination, this.alias, false).subscribe(
        (response: any) => {
            const data = response.data;
            this.isTotalLeadsData = this.pagination.totalLeads;
            this.isTotalAttendees = this.pagination.totalAttendees;
            this.statusCode = response.statusCode;
            if (response.statusCode == 200) {
                this.title = data.formName;
                this.formDataRows = data.submittedData;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, this.formDataRows);
            } else {
                this.referenceService.goToPageNotFound();
            }
            this.referenceService.loading(this.httpRequestLoader, false);
        },
        (error: any) => { this.logger.errorPage(error); });
}
search() {
    this.pagination.pageIndex = 1;
    this.listSubmittedData(this.pagination);
}

viewLandingPageFormAnalytics(landingPage:any,selectedIndex:number){
  this.analyticsObject['formAlias'] = this.importedObject['formAlias'];
  this.analyticsObject['masterLandingPageId'] = landingPage.partnerMasterLandingPageId;
  
  $.each(this.pagination.pagedItems, function (index:number, row:any) {
      if (selectedIndex != index) {
        row.expanded = false;
      }
    });
    landingPage.expanded = !landingPage.expanded;  
    $('.child-row-list-view').css("background-color", "#fff");          
  if (landingPage.expanded) {
      this.referenceService.isCreated = false;
      this.referenceService.isUpdated = false;
      $('#folder-row-' + selectedIndex).css("background-color", "#f1f5f9");
  } else {
      $('#folder-row-' + selectedIndex).css("background-color", "#fff");
  }
}

}
