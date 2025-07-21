import { Component, OnInit, Input, Renderer } from '@angular/core';
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
import { TracksPlayBook } from '../models/tracks-play-book'
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { DamService } from 'app/dam/services/dam.service';

@Component({
  selector: 'app-tracks-play-book-analytics',
  templateUrl: './tracks-play-book-analytics.component.html',
  styleUrls: ['./tracks-play-book-analytics.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties,DamService]
})
export class TracksPlayBookAnalyticsComponent implements OnInit {

  initLoader = false;
  loggedInUserId: number = 0;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  learningTrackId: number = 0;
  sortOption: SortOption = new SortOption();
  tracksPlayBook: TracksPlayBook = new TracksPlayBook();
  @Input() type: string;
  viewType: string;
  categoryId: number;
  folderViewType: string;
  isFromApprovalModule: boolean = false;
  constructor(private route: ActivatedRoute, private utilService: UtilService,
    private pagerService: PagerService, public authenticationService: AuthenticationService,
    public xtremandLogger: XtremandLogger, public referenceService: ReferenceService,
    private router: Router, public properties: Properties, public tracksPlayBookUtilService: TracksPlayBookUtilService, public renderer: Renderer) {
    this.referenceService.renderer = this.renderer;
    this.loggedInUserId = this.authenticationService.getUserId();
    /****XNFR-170****/
    this.viewType = this.route.snapshot.params["viewType"];
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.folderViewType = this.route.snapshot.params["folderViewType"];
  }


  ngOnInit() {
    this.initLoader = true;
    this.isFromApprovalModule = this.router.url.indexOf(RouterUrlConstants.approval) > -1;
    this.learningTrackId = parseInt(this.route.snapshot.params['id']);
    if (this.learningTrackId < 1) {
      this.goBack();
    }
    // this.pagination.partnerTeamMemberGroupFilter = true;
    let partnerFilter = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.filterPartners);
    if (partnerFilter != null && partnerFilter != undefined && (partnerFilter === false || partnerFilter === 'false')) {
      this.referenceService.setTeamMemberFilterForPagination(this.pagination, 0);
    } else {
      this.referenceService.setTeamMemberFilterForPagination(this.pagination, 1);
    }
    this.getAnalytics(this.pagination);
  }

  getAnalytics(pagination: Pagination) {
    this.initLoader = true;
    pagination.userId = this.loggedInUserId;
    pagination.learningTrackId = this.learningTrackId
    pagination.lmsType = this.type;
    this.referenceService.startLoader(this.httpRequestLoader);
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortOptionForTracks, this.pagination);
    this.tracksPlayBookUtilService.getAnalytics(this.pagination).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.data);
        } else if (response.statusCode == 403) {
          this.referenceService.goToAccessDeniedPage();
        } else {
          this.referenceService.showSweetAlertErrorMessage(response.message);
        }
        this.initLoader = false;
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
    (error: any) => {
      this.referenceService.stopLoader(this.httpRequestLoader);
      this.initLoader = false;
      this.customResponse = new CustomResponse('ERROR', 'Unable to get forms.Please Contact Admin.', true);
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
    this.getAnalytics(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.getAnalytics(this.pagination);
  }

  eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }

  goBack() {
    if ((this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) && !this.isFromApprovalModule) {
      this.referenceService.navigateToManageTracksByViewType(this.folderViewType, this.viewType, this.categoryId, false);
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK] && !this.isFromApprovalModule) {
      this.referenceService.navigateToPlayBooksByViewType(this.folderViewType, this.viewType, this.categoryId, false);
    } else if (this.isFromApprovalModule) {
      this.goBackToManageApproval();
    }
  }

  refreshPage() {
    this.getAnalytics(this.pagination);
  }

  viewAnalytics(company: any) {
    let route = "";
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      let prefixUrl = "home/tracks/partnerAnalytics/"
      if (this.isFromApprovalModule) {
        prefixUrl = "home/tracks/approval/partnerAnalytics/";
      }
      route = prefixUrl + this.learningTrackId + "/" + company.id;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      let prefixUrl = "home/playbook/partnerAnalytics/";
      if (this.isFromApprovalModule) {
        prefixUrl = "home/playbook/approval/partnerAnalytics/"
      }
      route = prefixUrl + this.learningTrackId + "/" + company.id;
    }
    let folderListView = this.folderViewType == "fl";
    this.referenceService.navigateToRouterByViewTypes(route, this.categoryId, this.viewType, this.folderViewType, folderListView);
  }

  getSelectedIndex(index: any) {
    this.pagination.partnerTeamMemberGroupFilter = index == 1;
    this.getAnalytics(this.pagination);
  }

  goBackToManageApproval() {
    let url = RouterUrlConstants['home'] + RouterUrlConstants['manageApproval'];
    this.referenceService.goToRouter(url);
  }
  downloadTrackAndPlaybooksAnalytics() {
    let userId = this.loggedInUserId;
    let learningTrackId = this.learningTrackId;
    let lmsType = this.type;
    let pageableUrl = this.referenceService.getPagebleUrl(this.pagination);
    let url = this.authenticationService.REST_URL + "lms" 
    + "/downloadTrackAnalytics/userId/" + userId 
    + "/learningTrackId/" + learningTrackId
    + "/lmsType/" + lmsType 
    + "?access_token=" + this.authenticationService.access_token + pageableUrl;
    this.referenceService.openWindowInNewTab(url);
  }
  sortPartnerCompanies(text: any) {
    this.sortOption.selectedSortOptionForTracks = text;
    this.getAnalytics(this.pagination);
  }
}
