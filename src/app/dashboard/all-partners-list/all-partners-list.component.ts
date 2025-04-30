import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PartnerJourneyRequest } from 'app/partners/models/partner-journey-request';

declare var $:any, swal: any;
@Component({
  selector: 'app-all-partners-list',
  templateUrl: './all-partners-list.component.html',
  styleUrls: ['./all-partners-list.component.css'],
  providers: [SortOption]
})
export class AllPartnersListComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() regionName: any = "";
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input() isDetailedAnalytics: boolean;
  @Input() applyFilter: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Input() isTeamMemberAnalytics: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion: boolean = false;
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';
  // @Input() fromDateFilter: string = '';
  // @Input() toDateFilter: string = '';

  @Output() triggerSendEmailPopup = new EventEmitter<any>();
  dateFilterText = "Select Date Filter";
  //filterApplied: boolean = false;
 // public selectedRegionIds = [];
 // public selectedStatusIds = [];
  filterActiveBg: string;
  showFilterDropDown: boolean = false;
  isCollapsed: boolean = true;
  public regionNameFilters: Array<any>;
  public regionInfoFields: any;

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  loading: boolean;
  heading: any = "All Partners Details";
  scrollClass: any;
  showFilterOption: boolean = false;
  public multiSelectPlaceholderForRegion: string = "Select Region";
  public multiSelectPlaceholderForStatus: string = "Select Status";

  statusOptions = [
    { text: 'IncompleteCompanyProfile', value: 'IncompleteCompanyProfile' },
    { text: 'Active', value: 'Active' },
    { text: 'Pending Signup', value: 'Pending Signup' },
    { text: 'Dormant', value: 'Dormant' }
  ];

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
   // this.pagination.pageIndex = 1;
    //this.getAllPartnersDetails(this.pagination);
  }

  ngOnChanges() {
    this.pagination.pageIndex = 1;
    //this.setHeading();
    this.getAllPartnersDetails(this.pagination);
    this.findRegionNames();
    this.setFilterColor();
  }
  setHeading() {
      this.heading = "All Partners Details"
    }

    callParentMethod(item: any) {
      this.triggerSendEmailPopup.emit(item); 
    }
    sortPartnerTeamMembers(text: any) {
      this.sortOption.teamMember = text;
      this.getAllFilteredResults(this.pagination);
    }
    clickFilter() {
      this.showFilterOption = !this.showFilterOption;
      this.customResponse.isVisible = false;
    }
    viewDropDownFilter(){
      this.showFilterOption = true;
      this.showFilterDropDown = false;
    }
  
    closeFilterOption() {
      this.showFilterOption = false;
      this.clearFilter();
  }
  clearFilter() {
    this.pagination.fromDateFilterString = '';
    this.pagination.toDateFilterString = '';
     this.pagination.selectedStatusIds = [];
     this.pagination.selectedRegionIds = [];
    // this.selectedStatusIds = [];
    // this.selectedRegionIds = [];
   // this.regionNameFilters = [];
    this.isCollapsed = true;
    //this.pagination.filterBy = [];
    //this.filterApplied = false;
   // this.showFilterOption = true;
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.getAllPartnersDetails(this.pagination);
}
setFilterColor() {
  let isValidSelectedRegionAndStatus = this.pagination.selectedRegionIds != undefined && this.pagination.selectedRegionIds.length > 0 
  && this.pagination.selectedStatusIds != undefined && this.pagination.selectedStatusIds.length > 0;
  let isValidFromDateFilter = this.pagination.fromDateFilterString != undefined && this.pagination.fromDateFilterString.length > 0;
  let isValidToDateFilter = this.pagination.toDateFilterString != undefined && this.pagination.toDateFilterString.length > 0;
  if (isValidSelectedRegionAndStatus && isValidFromDateFilter && isValidToDateFilter) {
    this.filterActiveBg = 'filterActiveBg';
   // this.filterApplied = true;
  }
  if (isValidSelectedRegionAndStatus) {
    this.filterActiveBg = 'filterActiveBg';
    this.isCollapsed = false;
  }
}
findRegionNames(){
  this.pagination.userId = this.loggedInUserId;  
  this.regionInfoFields = { text: 'region', value: 'region' };
  this.parterService.getAllPartnerRegionNamesFilter(this.pagination).
  subscribe(response => {
    this.regionNameFilters = response.data;
  }, error => {
    this.regionNameFilters = [];
  });
}
validateDateFilter() {
  let isValidFromDateFilter = this.pagination.fromDateFilterString != undefined && this.pagination.fromDateFilterString != "";
  let isEmptyFromDateFilter = this.pagination.fromDateFilterString == undefined || this.pagination.fromDateFilterString == "";
  let isValidToDateFilter = this.pagination.toDateFilterString != undefined && this.pagination.toDateFilterString != "";
  let isEmptyToDateFilter = this.pagination.toDateFilterString == undefined || this.pagination.toDateFilterString == "";
  let isValidRegionAndStatus = this.pagination.selectedRegionIds.length > 0 && this.pagination.selectedStatusIds.length>0;
  if (
    this.pagination.selectedRegionIds.length === 0 &&
    this.pagination.selectedStatusIds.length === 0 &&
    isEmptyFromDateFilter &&
    isEmptyToDateFilter
  ) {
    this.customResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
    return;
  }
  let checkIfToDateIsEmpty = isValidFromDateFilter && isEmptyToDateFilter;
  let checkIfFromDateIsEmpty = isValidToDateFilter && isEmptyFromDateFilter;
  let showToDateError = (isValidRegionAndStatus && checkIfToDateIsEmpty) || (!isValidRegionAndStatus && checkIfToDateIsEmpty)
  let showFromDateError = (isValidRegionAndStatus && checkIfFromDateIsEmpty) || (!isValidRegionAndStatus && checkIfFromDateIsEmpty)
  if (!(this.pagination.selectedRegionIds.length > 0) && (this.pagination.selectedStatusIds.length>0) && (isEmptyFromDateFilter && isEmptyToDateFilter)) {
    this.customResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
  } else if (showToDateError) {
    this.customResponse = new CustomResponse('ERROR', "Please pick To Date", true);
  } else if (showFromDateError) {
    this.customResponse = new CustomResponse('ERROR', "Please pick From Date", true);
  } else if (isValidToDateFilter && isValidFromDateFilter) {
    var toDate = Date.parse(this.pagination.toDateFilterString);
    var fromDate = Date.parse(this.pagination.fromDateFilterString);
    if (fromDate <= toDate) {
      this.applyFilters(this.pagination);
    } else {
      this.customResponse = new CustomResponse('ERROR', "From Date should be less than To Date", true);
    }
  } else {
    this.applyFilters(this.pagination);
  }
 // this.applyFilters(this.pagination);
}
applyFilters(pagination: Pagination) {
  this.filterActiveBg = 'filterActiveBg';
 // this.filterApplied = true;
  this.clickFilter();
  this.referenseService.loading(this.httpRequestLoader, true);
  pagination.pageIndex = 1;
  pagination.searchKey = this.searchKey;
  pagination = this.utilService.sortOptionValues(this.sortOption.teamMember, pagination); 
  this.pagination.userId = this.loggedInUserId;
  this.pagination.regionFilter = this.regionName;  
 // this.pagination.selectedRegionIds = this.selectedRegionIds;
 // this.pagination.selectedStatusIds = this.selectedStatusIds;
  this.parterService.getAllPartners(pagination).subscribe(
    (response: any) => {
      this.referenseService.loading(this.httpRequestLoader, false);
      if (response.statusCode == 200) {
      this.sortOption.totalRecords = response.data.totalRecords;
        this.pagination.totalRecords = response.data.totalRecords;
        if (this.pagination.totalRecords == 0) {
          this.scrollClass = 'noData'
        } else {
          this.scrollClass = 'tableHeightScroll'
        }
        this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
      }
    },
    (_error: any) => {
      this.httpRequestLoader.isServerError = true;
      this.xtremandLogger.error(_error);
    }
  );

}
  

  // getInteractedNotInteractedTrackDetailsForPartnerJourney(pagination: Pagination) {
  //   this.referenseService.loading(this.httpRequestLoader, true);
  //   this.pagination.userId = this.loggedInUserId;
  //   this.pagination.partnerCompanyId = this.partnerCompanyId;
  //   this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
  //   this.pagination.detailedAnalytics = this.isDetailedAnalytics;
  //   this.pagination.trackTypeFilter = this.trackType;
  //   this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
  //   this.pagination.teamMemberId = this.teamMemberId;
  //   this.pagination.fromDateFilterString = this.fromDateFilter;
  //   this.pagination.toDateFilterString = this.toDateFilter;
  //   this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //   this.parterService.getPartnerJourneyTrackDetailsByInteraction(this.pagination).subscribe(
  //     (response: any) => {
  //       this.referenseService.loading(this.httpRequestLoader, false);
  //       if (response.statusCode == 200) {
  //         this.sortOption.totalRecords = response.data.totalRecords;
  //         this.pagination.totalRecords = response.data.totalRecords;
  //         if (pagination.totalRecords == 0) {
  //           this.scrollClass = 'noData'
  //         } else {
  //           this.scrollClass = 'tableHeightScroll'
  //         }
  //         this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
  //       }
  //     },
  //     (_error: any) => {
  //       this.httpRequestLoader.isServerError = true;
  //       this.xtremandLogger.error(_error);
  //     }
  //   );
  // }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.search();
    }
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.teamMember, pagination);
   // let sortColumn = this.pagination.sortcolumn;
   // pagination.sortcolumn = sortColumn;
    this.getAllPartnersDetails(this.pagination);
   // this.getInteractedNotInteractedTrackDetails(this.pagination);
  }

   setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAllPartnersDetails(this.pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop();
  }

  getAllPartnersDetails(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.regionFilter = this.regionName;
    this.parterService.getAllPartners(this.pagination).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
        this.sortOption.totalRecords = response.data.totalRecords;
          this.pagination.totalRecords = response.data.totalRecords;
          if (pagination.totalRecords == 0) {
            this.scrollClass = 'noData'
          } else {
            this.scrollClass = 'tableHeightScroll'
          }
          this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
        }
      },
      (_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
      }
    );
  }
  downloadAllPartnerDetailsReport() {
    let loggedInUserId = this.authenticationService.getUserId();
    this.pagination = this.utilService.sortOptionValues(this.sortOption.teamMember, this.pagination);
    let maxResults = this.pagination.maxResults;
    this.pagination.searchKey = this.searchKey;
    let regionFilter = this.regionName;
    this.pagination.maxResults = this.pagination.totalRecords;
    let pageableUrl = this.referenseService.getPagebleUrl(this.pagination);
    let sortColumn = this.pagination.sortcolumn;
    let selectedRegionIds = this.pagination.selectedRegionIds.join(',');
    let selectedStatusIds = this.pagination.selectedStatusIds.join(',');
    this.pagination.maxResults = maxResults
    window.location.href = this.authenticationService.REST_URL + '/partner/allPartners/downloadCsv?userId='
      + loggedInUserId +"&regionFilter="+regionFilter+"&sortColumn="+sortColumn+"&selectedRegionIds="+selectedRegionIds+"&selectedStatusIds="+selectedStatusIds+"&access_token=" + this.authenticationService.access_token + pageableUrl;
   }
  // getInteractedNotInteractedTrackDetails(pagination: Pagination) {
  //   if (!this.isTeamMemberAnalytics) {
  //     this.getInteractedNotInteractedTrackDetailsForPartnerJourney(this.pagination);
  //   } else {
  //     this.getAllPartnersDetails(this.pagination);
  //   }
  // }

  // downloadInteractedAndNonInteractedTracksReport() {
  //   if (!this.isTeamMemberAnalytics) {
  //     this.downloadInteractedAndNonInteractedTracksReportForPartnerJourney(this.pagination);
  //   } else {
  //     this.downloadInteractedAndNonInteractedTracksReportForTeamMember(this.pagination);
  //   }
  // }

  // downloadInteractedAndNonInteractedTracksReportForPartnerJourney(pagination: Pagination) {
  //   let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
  //   let trackTypeFilterRequestParam = this.trackType != undefined ? this.trackType : "";
  //   let partnerCompanyIdsRequestParam = this.selectedPartnerCompanyIds && this.selectedPartnerCompanyIds.length > 0 ? this.selectedPartnerCompanyIds : [];
  //   let searchKeyRequestParm = this.searchKey != undefined ? this.sortOption.searchKey : "";
  //   let partnerCompanyIdRequestParam = this.partnerCompanyId != undefined && this.partnerCompanyId > 0 ? this.partnerCompanyId : 0;
  //   let partnerTeamMemberGroupFilterRequestParm = this.applyFilter != undefined ? this.applyFilter : false;
  //   let teamMemberIdRequestParam = this.teamMemberId != undefined && this.teamMemberId > 0 ? this.teamMemberId : 0;
  //   let fromDateFilterRequestParam = this.fromDateFilter != undefined ? this.fromDateFilter : "";
  //   let toDateFilterRequestParam = this.toDateFilter != undefined ? this.toDateFilter : "";
  //   let timeZoneRequestParm = "&timeZone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;
  //   let url = this.authenticationService.REST_URL + "partner/journey/download/track-interaction-report?access_token=" + this.authenticationService.access_token
  //     + "&loggedInUserId=" + loggedInUserIdRequestParam + "&trackTypeFilter=" + trackTypeFilterRequestParam
  //     + "&selectedPartnerCompanyIds=" + partnerCompanyIdsRequestParam + "&searchKey=" + searchKeyRequestParm + "&detailedAnalytics=" + this.isDetailedAnalytics + "&partnerCompanyId=" + partnerCompanyIdRequestParam
  //     + "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm + "&teamMemberUserId=" + teamMemberIdRequestParam
  //     + "&fromDateFilterInString=" + fromDateFilterRequestParam + "&toDateFilterInString=" + toDateFilterRequestParam + timeZoneRequestParm;
  //   this.referenseService.openWindowInNewTab(url);
  // }

  // downloadInteractedAndNonInteractedTracksReportForTeamMember(pagination: Pagination) {
  //   this.setPaginationValuesForTeamMember();
  //   let teamMemberAnalyticsUrl = this.referenseService.getTeamMemberAnalyticsUrl(this.pagination);
  //   let isVendorVersionRequestParam = this.isVendorVersion ? "&vendorVersion=" + this.isVendorVersion : "";
  //   let url = this.authenticationService.REST_URL + "teamMemberAnalytics/download/track-interaction-report?access_token=" + this.authenticationService.access_token + teamMemberAnalyticsUrl
  //     + isVendorVersionRequestParam;
  //   this.referenseService.openWindowInNewTab(url);
  // }

  //setPaginationValuesForTeamMember() {
   // this.pagination.userId = this.loggedInUserId;
  // this.pagination.regionFilter = this.regionName;
    //this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
   // this.pagination.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    // if (!this.isVendorVersion) {
    //   this.pagination.vanityUrlFilter = this.vanityUrlFilter;
    //   this.pagination.vendorCompanyProfileName = this.vendorCompanyProfileName;
    // }
    // this.pagination.fromDateFilterString = this.fromDateFilter;
    // this.pagination.toDateFilterString = this.toDateFilter;
    // this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //}
 resendEmailInvitation(emailId: string,status: string) {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "An invitation email will be sent to team member",
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes, send it!'

      }).then(function () {
        self.sendEmail(emailId,status);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
  }

  sendEmail(emailId: string,status:string) {
    this.customResponse = new CustomResponse();
    try {
      this.loading = true;
      let input = {};
      input['userId'] = this.authenticationService.getUserId();
      input['emailId'] = emailId;
      input['status'] = status;
      // this.teamMemberService.resendTeamMemberInvitation(input)
      //   .subscribe(
      //     data => {
      //       if (data.statusCode == 200) {
      //         this.customResponse = new CustomResponse('SUCCESS', "Invitation sent successfully.", true);
      //       } else {
      //         this.customResponse = new CustomResponse('ERROR', "Invitation cannot be sent as the account is already created for team member", true);
      //       }
      //       this.loading = false;
      //     },
      //     error => {
      //       this.loading = false;
      //       this.logger.errorPage(error);
      //     }
      //   );
    } catch (error) {
      this.loading = false;
    }
  }
}
