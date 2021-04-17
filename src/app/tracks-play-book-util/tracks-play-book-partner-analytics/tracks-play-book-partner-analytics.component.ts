import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { TracksPlayBookUtilService } from '../services/tracks-play-book-util.service';
import { TracksPlayBookType } from '../models/tracks-play-book-type.enum'

declare var $, swal: any;

@Component({
  selector: 'app-tracks-play-book-partner-analytics',
  templateUrl: './tracks-play-book-partner-analytics.component.html',
  styleUrls: ['./tracks-play-book-partner-analytics.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
})
export class TracksPlayBookPartnerAnalyticsComponent implements OnInit {

  initLoader = false;
  loggedInUserId: number = 0;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  learningTrackId: number = 0;
  sortOption: SortOption = new SortOption();
  partnerCompanyId: number = 0;
  analyticsPagination: Pagination = new Pagination();
  partners: any;
  analyticsRouter: string = "";
  detailedAnalyticsPagination: Pagination = new Pagination();
  detailedAnalyticsSortOption: SortOption = new SortOption();
  detailedAnalyticsLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedPartnerId: number = 0;
  @Input() type: string;
  @Output() notifyAnalyticsRouter: EventEmitter<any>;

  constructor(private route: ActivatedRoute, private utilService: UtilService,
    private pagerService: PagerService, public authenticationService: AuthenticationService,
    public xtremandLogger: XtremandLogger, public referenceService: ReferenceService,
    private router: Router, public properties: Properties, public tracksPlayBookUtilService: TracksPlayBookUtilService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.notifyAnalyticsRouter = new EventEmitter<any>();
  }

  ngOnInit() {
    this.initLoader = true;
    this.learningTrackId = parseInt(this.route.snapshot.params['ltId']);
    this.partnerCompanyId = parseInt(this.route.snapshot.params['id']);
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      this.analyticsRouter = "/home/tracks/analytics/" + this.learningTrackId;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      this.analyticsRouter = "/home/playbook/analytics/" + this.learningTrackId;
    }
    this.notifyAnalyticsRouter.emit(this.analyticsRouter);
    if (this.learningTrackId < 1 || this.partnerCompanyId < 1) {
      this.goBack();
    }
    this.getPartnerAnalytics(this.pagination);
  }

  getPartnerAnalytics(pagination: Pagination) {
    this.initLoader = true;
    pagination.userId = this.loggedInUserId;
    pagination.learningTrackId = this.learningTrackId;
    pagination.partnerCompanyId = this.partnerCompanyId;
    pagination.lmsType = this.type;
    this.referenceService.startLoader(this.httpRequestLoader);
    this.tracksPlayBookUtilService.getPartnerAnalytics(pagination).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.data);
          // pagination.pagedItems.forEach((value) => {
          //   value['expanded'] = false;
          // });
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.initLoader = false;
        }
      });
    (error: any) => {
      this.referenceService.stopLoader(this.httpRequestLoader);
      this.initLoader = false;
      this.customResponse = new CustomResponse('ERROR', 'Unable to get data.Please Contact Admin.', true);
    }
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.formsSortOption = text;
    this.getAllFilteredResults(this.pagination);
  }


  /*************************Search********************** */
  search() {
    this.getAllFilteredResults(this.pagination);
  }

  paginationDropdown(items: any) {
    this.sortOption.itemsSize = items;
    this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getPartnerAnalytics(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    //this.pagination = this.utilService.sortOptionValues(this.formSortOption.formsSortOption, this.pagination);
    this.getPartnerAnalytics(this.pagination);
  }

  eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }

  getPartnerDetailedAnalytics(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.learningTrackId = this.learningTrackId;
    pagination.partnerCompanyId = this.partnerCompanyId;
    pagination.partnerId = this.selectedPartnerId;
    pagination.lmsType = this.type;
    this.referenceService.startLoader(this.detailedAnalyticsLoader);
    this.tracksPlayBookUtilService.getPartnerDetailedAnalytics(pagination).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          this.detailedAnalyticsSortOption.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.data);
          this.referenceService.stopLoader(this.detailedAnalyticsLoader);
        }
      });
    (error: any) => {
      this.referenceService.stopLoader(this.detailedAnalyticsLoader);
      this.customResponse = new CustomResponse('ERROR', 'Unable to get data.Please Contact Admin.', true);
    }
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  // detailedAnalyticsSortBy(text: any) {
  //   this.sortOption.formsSortOption = text;
  //   this.getAllDetailedAnalyticsFilteredResults(this.detailedAnalyticsPagination);
  // }


  /*************************Search********************** */
  detailedAnalyticsSearch() {
    this.getAllDetailedAnalyticsFilteredResults(this.detailedAnalyticsPagination);
  }

  // paginationDetailedAnalyticsDropdown(items: any) {
  //   this.sortOption.itemsSize = items;
  //   this.getAllDetailedAnalyticsFilteredResults(this.detailedAnalyticsPagination);
  // }

  /************Page************** */
  setDetailedAnalyticsPage(event: any) {
    this.detailedAnalyticsPagination.pageIndex = event.page;
    this.getPartnerDetailedAnalytics(this.detailedAnalyticsPagination);
  }

  getAllDetailedAnalyticsFilteredResults(pagination: Pagination) {
    this.detailedAnalyticsPagination.pageIndex = 1;
    this.detailedAnalyticsPagination.searchKey = this.detailedAnalyticsSortOption.searchKey;
    //this.pagination = this.utilService.sortOptionValues(this.formSortOption.formsSortOption, this.pagination);
    this.getPartnerDetailedAnalytics(this.detailedAnalyticsPagination);
  }

  detailedAnalyticsEventHandler(keyCode: any) { if (keyCode === 13) { this.detailedAnalyticsSearch(); } }

  goBack() {
    let route = "home/tracks/";
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      route = "home/tracks/";
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      route = "home/playbook/";
    }
    if (this.learningTrackId != undefined && this.learningTrackId > 0) {
      route = route + "analytics/" + this.learningTrackId;
    } else if (this.learningTrackId == undefined || this.learningTrackId < 1) {
      route = route + "manage";
    }
    this.router.navigate([route]);
  }

  refreshPage() {
    this.getPartnerAnalytics(this.pagination);
  }

  viewAnalytics(partner: any, selectedIndex: number) {
    // console.log(partner.expand)
    // this.analyticsPagination = new Pagination();
    // $.each(this.pagination.pagedItems, function (index, row) {
    //   if (selectedIndex != index) {
    //     row.expanded = false;
    //   }
    // });
    // partner.expanded = !partner.expanded;
    // if (partner.expanded) {
    //   this.listDetailedAnalytics(this.analyticsPagination);
    // }
    this.selectedPartnerId = partner.id;
    this.getPartnerDetailedAnalytics(this.detailedAnalyticsPagination);
    $('#analytics-list').modal('show');

  }

}
