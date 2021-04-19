import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private route: ActivatedRoute, private utilService: UtilService,
    private pagerService: PagerService, public authenticationService: AuthenticationService,
    public xtremandLogger: XtremandLogger, public referenceService: ReferenceService,
    private router: Router, public properties: Properties, public tracksPlayBookUtilService: TracksPlayBookUtilService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }


  ngOnInit() {
    this.initLoader = true;
    this.learningTrackId = parseInt(this.route.snapshot.params['id']);
    if (this.learningTrackId < 1) {
      this.goBack();
    }
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
    //this.pagination = this.utilService.sortOptionValues(this.formSortOption.formsSortOption, this.pagination);
    this.getAnalytics(this.pagination);
  }

  eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }

  goBack() {
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      this.router.navigate(['home/tracks/manage']);
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      this.router.navigate(['home/playbook/manage']);
    }
  }

  refreshPage() {
    this.getAnalytics(this.pagination);
  }

  viewAnalytics(company: any) {
    let route = "home/tracks/partnerAnalytics/" + this.learningTrackId + "/" + company.id;
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      route = "home/tracks/partnerAnalytics/" + this.learningTrackId + "/" + company.id;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      route = "home/playbook/partnerAnalytics/" + this.learningTrackId + "/" + company.id;
    }
    this.router.navigate([route]);
  }

}
