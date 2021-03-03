import { Component, OnInit } from '@angular/core';
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
import { LmsService } from '../services/lms.service'
import { LearningTrack } from '../models/learningTrack'

declare var $, swal: any;

@Component({
  selector: 'app-lms-analytics',
  templateUrl: './lms-analytics.component.html',
  styleUrls: ['./lms-analytics.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]

})
export class LmsAnalyticsComponent implements OnInit {

  initLoader = false;
  loggedInUserId: number = 0;
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  pagination:Pagination = new Pagination();
  customResponse:CustomResponse = new CustomResponse();
  learningTrackId:number = 0;
  sortOption:SortOption = new SortOption();
  learningTrack:LearningTrack  = new LearningTrack();

  constructor(private route: ActivatedRoute, private utilService: UtilService,
    private pagerService: PagerService, public authenticationService: AuthenticationService,
    public xtremandLogger: XtremandLogger, public referenceService: ReferenceService,
    private router: Router, public properties: Properties, public lmsService: LmsService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }


  ngOnInit() {
    this.initLoader = true;
    this.learningTrackId = parseInt(this.route.snapshot.params['id']);
    if(this.learningTrackId < 1){
      this.goBack();
    }
    this.getAnalytics(this.pagination);
  }

  getAnalytics(pagination:Pagination){
    this.initLoader = true;
    pagination.userId = this.loggedInUserId;
    pagination.learningTrackId = this.learningTrackId
    this.referenceService.startLoader(this.httpRequestLoader);
    this.lmsService.getAnalytics(this.pagination).subscribe(
      (response:any) => {
        if(response.statusCode == 200){
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

  goBack(){
    this.router.navigate(['home/lms/manage']);
  }

  refreshPage(){
    this.getAnalytics(this.pagination);
  }

  viewAnalytics(company:any){
    let route = "home/lms/partnerAnalytics/" + this.learningTrackId + "/" + company.id;
    this.router.navigate([route]);
  }
}
