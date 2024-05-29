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

@Component({
  selector: 'app-tracks-play-book-analytics',
  templateUrl: './tracks-play-book-analytics.component.html',
  styleUrls: ['./tracks-play-book-analytics.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
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
  isLocalHost = false;
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
    this.isLocalHost = this.authenticationService.isLocalHost();
  }


  ngOnInit() {
    this.initLoader = true;
    this.learningTrackId = parseInt(this.route.snapshot.params['id']);
    if (this.learningTrackId < 1) {
      this.goBack();
    }
    this.pagination.partnerTeamMemberGroupFilter = true;
    this.getAnalytics(this.pagination);
  }

  getAnalytics(pagination: Pagination) {
    this.initLoader = true;
    pagination.userId = this.loggedInUserId;
    pagination.learningTrackId = this.learningTrackId
    pagination.lmsType = this.type;
    this.referenceService.startLoader(this.httpRequestLoader);
    this.tracksPlayBookUtilService.getAnalytics(this.pagination).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.data);
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.initLoader = false;
        } else{
          this.referenceService.showSweetAlertErrorMessage(response.message);
          this.referenceService.stopLoader(this.httpRequestLoader);
        }
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
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      this.referenceService.navigateToManageTracksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      this.referenceService.navigateToPlayBooksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
    }
  }

  refreshPage() {
    this.getAnalytics(this.pagination);
  }

  viewAnalytics(company: any) {
    let route = "";
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      route = "home/tracks/partnerAnalytics/" + this.learningTrackId + "/" + company.id;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      route = "home/playbook/partnerAnalytics/" + this.learningTrackId + "/" + company.id;
    }
    let folderListView = this.folderViewType=="fl";
    this.referenceService.navigateToRouterByViewTypes(route,this.categoryId,this.viewType,this.folderViewType,folderListView);
  }

  getSelectedIndex(index: any) {
    this.pagination.partnerTeamMemberGroupFilter = index == 1;
    this.getAnalytics(this.pagination);
  }

}
