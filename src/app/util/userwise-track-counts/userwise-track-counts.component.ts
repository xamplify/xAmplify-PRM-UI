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
import { Properties } from '../../common/models/properties';

@Component({
  selector: 'app-userwise-track-counts',
  templateUrl: './userwise-track-counts.component.html',
  styleUrls: ['./userwise-track-counts.component.css'],
  providers: [SortOption, Properties]
})
export class UserwiseTrackCountsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() type: any;
  @Input() applyFilter: boolean;
  @Input() isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input() isTeamMemberAnalytics: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion: boolean = false;
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  scrollClass: any;

  isOnlyPartner: boolean = true;
  isOrgAdminVersion: boolean = false;


  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption, private properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  tooltipText: string;
  teamMemberTooltip: string;
  partnerTeamMemberText: string;
  vendorTeamMemberText: string;
  isPartnerTeamMember: boolean = true;

  ngOnInit() {
    this.tooltipText = this.type.toLowerCase() === 'track' ? this.properties.publishedTrackCountText : this.properties.publishedPlaybookCountText;
    this.teamMemberTooltip = this.type.toLowerCase() === 'track' ? this.properties.vendorTeamMemberTrackText : this.properties.venodrTeamMemberPlaybookText;
    this.partnerTeamMemberText = this.type.toLowerCase() === 'track' ? this.properties.vendorTeamMemberTrackText : this.properties.venodrTeamMemberPlaybookText;
    this.vendorTeamMemberText = this.type.toLowerCase() === 'track' ? this.properties.partnerTeamMemberTrackText : this.properties.partnerTeamMemberPlaybookText;
  }

  getIconStyle(){
    return this.type.toLowerCase() === 'track' 
    ? { 'padding-left': '120px', 'margin-top': '-27px', 'float': 'left' } 
    : { 'padding-left': '150px' ,'margin-top': '-27px','float': 'left' };
  }
  
  ngOnChanges() {
    this.pagination.pageIndex = 1;
    this.getUserWiseTrackCounts(this.pagination);
  }

  getUserWiseTrackCountsForPartnerJourney(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.lmsType = this.type;
    this.pagination.maxResults = 8;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.teamMemberId = this.teamMemberId;
    this.parterService.getUserWiseTrackCounts(this.pagination).subscribe(
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
    this.getUserWiseTrackCounts(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getUserWiseTrackCounts(this.pagination);
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getUserWiseTrackCounts(this.pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop();
  }

  getUserWiseTrackCounts(pagination: Pagination) {
    if (!this.isTeamMemberAnalytics) {
      this.getUserWiseTrackCountsForPartnerJourney(this.pagination);
    } else {
      this.getUserWiseTrackCountsForTeamMember(this.pagination);
    }
  }

  getUserWiseTrackCountsForTeamMember(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.lmsType = this.type;
    this.pagination.maxResults = 8;
    this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
    this.pagination.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    if (!this.isVendorVersion) {
      pagination.vanityUrlFilter = this.vanityUrlFilter;
      pagination.vendorCompanyProfileName = this.vendorCompanyProfileName;
    }
    this.parterService.getUserWiseTrackCountsForTeamMember(this.pagination, this.isVendorVersion).subscribe(
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

  downloadUserWiseTrackCountsReport() {
    let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
    let partnerCompanyIdsRequestParam = this.selectedPartnerCompanyIds && this.selectedPartnerCompanyIds.length > 0 ? this.selectedPartnerCompanyIds : [];
    let searchKeyRequestParm = this.searchKey != undefined ? this.sortOption.searchKey : "";
    let partnerCompanyIdRequestParam = this.partnerCompanyId != undefined && this.partnerCompanyId > 0 ? this.partnerCompanyId : 0;
    let partnerTeamMemberGroupFilterRequestParm = this.applyFilter != undefined ? this.applyFilter : false;
    let teamMemberIdRequestParam = this.teamMemberId != undefined && this.teamMemberId > 0 ? this.teamMemberId : 0;
    let urlSuffix = "partner/journey/download/track-counts-report"
    if (this.type === 'PLAYBOOK') {
      urlSuffix = "partner/journey/download/playbook-counts-report"
    }
    let url = this.authenticationService.REST_URL + urlSuffix + "?access_token=" + this.authenticationService.access_token
      + "&loggedInUserId=" + loggedInUserIdRequestParam + "&selectedPartnerCompanyIds=" + partnerCompanyIdsRequestParam + "&searchKey=" + searchKeyRequestParm
      + "&detailedAnalytics=" + this.isDetailedAnalytics + "&partnerCompanyId=" + partnerCompanyIdRequestParam
      + "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm + "&teamMemberUserId=" + teamMemberIdRequestParam;
    this.referenseService.openWindowInNewTab(url);
  }

}
