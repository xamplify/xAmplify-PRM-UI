import { Component, Input, OnInit } from '@angular/core';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { PagerService } from 'app/core/services/pager.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

@Component({
  selector: 'app-team-member-wise-asset-details',
  templateUrl: './team-member-wise-asset-details.component.html',
  styleUrls: ['./team-member-wise-asset-details.component.css']
})
export class TeamMemberWiseAssetDetailsComponent implements OnInit {

  @Input() isVendorVersion: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';


  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  scrollClass: any;

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {

  }
  ngOnChanges() {
    this.pagination.pageIndex = 1;
    this.getAssetDetails(this.pagination);
  }

  getAssetDetails(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.setPaginationValuesForTeamMember();
    this.parterService.getAssetDetailsForTeamMember(this.pagination).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
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

  private setPaginationValuesForTeamMember() {
    this.pagination.userId = this.loggedInUserId;
    this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
    this.pagination.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.pagination.vanityUrlFilter = this.vanityUrlFilter;
    this.pagination.vendorCompanyProfileName = this.vendorCompanyProfileName;
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
    pagination.searchKey = this.searchKey;
    this.getAssetDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getAssetDetails(this.pagination);
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAssetDetails(this.pagination);
  }

  downloadAssetDetailsReport() {
    this.setPaginationValuesForTeamMember();
    let teamMemberAnalyticsUrl = this.referenseService.getTeamMemberAnalyticsUrl(this.pagination);
    let urlSuffix = "teamMemberAnalytics/download/team-asset-details-report"
    let url = this.authenticationService.REST_URL + urlSuffix + "?access_token=" + this.authenticationService.access_token + teamMemberAnalyticsUrl;
    this.referenseService.openWindowInNewTab(url);
  }


}
