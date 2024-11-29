import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';

@Component({
  selector: 'app-redistributed-campaign-details',
  templateUrl: './redistributed-campaign-details.component.html',
  styleUrls: ['./redistributed-campaign-details.component.css'],
  providers: [SortOption]
})
export class RedistributedCampaignDetailsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() applyFilter: boolean;
  @Input() teamMemberId: any;
  @Input() campaignTypeFilter: any = "";
  @Input() isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input() isTeamMemberAnalytics: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion: boolean = false;
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  colClass: any;
  scrollClass: any;
  headerText: string = 'Redistributed Campaign Details';

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.pagination.pageIndex = 1;
    if (this.isDetailedAnalytics) {
      this.colClass = "col-sm-12 col-md-12 col-lg-12 ml15m";
      this.scrollClass = "";
    } else {
      this.colClass = "col-xs-12 col-sm-6 col-md-8 col-lg-8 ml15m responsiveMargins"
      this.scrollClass = "tableHeightScroll";
    }
    if (this.isVendorVersion) {
      this.headerText = 'Launched Campaign Details';
    } else {
      this.headerText = ' Redistributed Campaign Details';
    }
    this.getRedistributedCampaignDetails(this.pagination);
  }

  getRedistributedCampaignDetailsForPartnerJourney(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.maxResults = 6;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.campaignTypeFilter = this.campaignTypeFilter;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.teamMemberId = this.teamMemberId;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.parterService.getRedistributedCampaignDetails(this.pagination).subscribe(
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
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
    this.getRedistributedCampaignDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getRedistributedCampaignDetails(this.pagination);
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getRedistributedCampaignDetails(this.pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop();
  }

  getRedistributedCampaignDetails(pagination: Pagination) {
    if (!this.isTeamMemberAnalytics) {
      this.getRedistributedCampaignDetailsForPartnerJourney(this.pagination);
    } else {
      this.getRedistributedCampaignDetailsForTeamMember(this.pagination);
    }
  }


  getRedistributedCampaignDetailsForTeamMember(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.maxResults = 6;
    this.pagination.campaignTypeFilter = this.campaignTypeFilter;
    this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
    this.pagination.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    if (!this.isVendorVersion) {
      pagination.vanityUrlFilter = this.vanityUrlFilter;
      pagination.vendorCompanyProfileName = this.vendorCompanyProfileName;
    }
    this.parterService.getRedistributedCampaignDetailsForTeamMember(this.pagination, this.isVendorVersion).subscribe(
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

  downloadRedistributeCampaignDetailsReport() {
    let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
    let partnerCompanyIdsRequestParam = this.selectedPartnerCompanyIds && this.selectedPartnerCompanyIds.length > 0 ? this.selectedPartnerCompanyIds : [];
    let searchKeyRequestParm = this.searchKey != undefined ? this.sortOption.searchKey : "";
    let campaignTypeFilterRequestParm = this.campaignTypeFilter != undefined ? this.campaignTypeFilter : "";
    let partnerCompanyIdRequestParam = this.partnerCompanyId != undefined && this.partnerCompanyId > 0 ? this.partnerCompanyId : 0;
    let partnerTeamMemberGroupFilterRequestParm = this.applyFilter != undefined ? this.applyFilter : false;
    let teamMemberIdRequestParam = this.teamMemberId != undefined && this.teamMemberId > 0 ? this.teamMemberId : 0;
    let url = this.authenticationService.REST_URL + "partner/journey/download/redistributed-campaign-details-report?access_token=" + this.authenticationService.access_token
      + "&loggedInUserId=" + loggedInUserIdRequestParam + "&selectedPartnerCompanyIds=" + partnerCompanyIdsRequestParam + "&searchKey=" + searchKeyRequestParm
      + "&campaignTypeFilter=" + campaignTypeFilterRequestParm + "&detailedAnalytics=" + this.isDetailedAnalytics + "&partnerCompanyId=" + partnerCompanyIdRequestParam
      + "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm + "&teamMemberUserId=" + teamMemberIdRequestParam;
    this.referenseService.openWindowInNewTab(url);
  }

}
