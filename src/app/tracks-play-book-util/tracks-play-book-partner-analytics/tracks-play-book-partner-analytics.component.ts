import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
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
import { TracksPlayBookType } from '../models/tracks-play-book-type.enum';
import { FormPreviewWithSubmittedAnswersComponent } from '../form-preview-with-submitted-answers/form-preview-with-submitted-answers.component';
import { Form } from 'app/forms/models/form';
import { TracksPlayBook } from '../models/tracks-play-book';
import { FormService } from '../../forms/services/form.service';
import { ColumnInfo } from '../../forms/models/column-info';
import { FormOption } from '../../forms/models/form-option';

declare var $, swal: any;

@Component({
  selector: 'app-tracks-play-book-partner-analytics',
  templateUrl: './tracks-play-book-partner-analytics.component.html',
  styleUrls: ['./tracks-play-book-partner-analytics.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties, FormService]
})
export class TracksPlayBookPartnerAnalyticsComponent implements OnInit, OnDestroy {

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
  @ViewChild('formPreviewWithSubmittedAnswersComponent') formPreviewWithSubmittedAnswersComponent: FormPreviewWithSubmittedAnswersComponent;
  formInput: Form;
  selectedPartnerFormAnswers : Map<number, any> = new Map<number, any>();
  quizId: number;
  formBackgroundImage = "";
  pageBackgroundColor = "";
  formError = false;
  viewType: string;
  categoryId: number;
  folderViewType: string;
  constructor(private route: ActivatedRoute, private utilService: UtilService,
    private pagerService: PagerService, public authenticationService: AuthenticationService,
    public xtremandLogger: XtremandLogger, public referenceService: ReferenceService,private formService: FormService,
    private router: Router, public properties: Properties, public tracksPlayBookUtilService: TracksPlayBookUtilService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.notifyAnalyticsRouter = new EventEmitter<any>();
    /****XNFR-170****/
    this.viewType = this.route.snapshot.params["viewType"];
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.folderViewType = this.route.snapshot.params["folderViewType"];
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

  ngOnDestroy() {
    $('#analytics-list').modal('hide');
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
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.initLoader = false;
        } else {
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.initLoader = false;
          this.referenceService.showSweetAlertErrorMessage(response.message);
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
        } else {
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.referenceService.showSweetAlertErrorMessage(response.message);
        }
      });
    (error: any) => {
      this.referenceService.stopLoader(this.detailedAnalyticsLoader);
      this.customResponse = new CustomResponse('ERROR', 'Unable to get data.Please Contact Admin.', true);
    }
  }

  /********************Pagaination&Search Code*****************/



  /*************************Search********************** */
  detailedAnalyticsSearch() {
    this.getAllDetailedAnalyticsFilteredResults(this.detailedAnalyticsPagination);
  }


  /************Page************** */
  setDetailedAnalyticsPage(event: any) {
    this.detailedAnalyticsPagination.pageIndex = event.page;
    this.getPartnerDetailedAnalytics(this.detailedAnalyticsPagination);
  }

  getAllDetailedAnalyticsFilteredResults(pagination: Pagination) {
    this.detailedAnalyticsPagination.pageIndex = 1;
    this.detailedAnalyticsPagination.searchKey = this.detailedAnalyticsSortOption.searchKey;
    this.getPartnerDetailedAnalytics(this.detailedAnalyticsPagination);
  }

  detailedAnalyticsEventHandler(keyCode: any) { if (keyCode === 13) { this.detailedAnalyticsSearch(); } }

  goBack() {
    let urlSuffix = "";
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      urlSuffix = "tracks";
      this.referenceService.navigateToManageTracksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      urlSuffix = "playbook";
      this.referenceService.navigateToPlayBooksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
    }
    if (this.learningTrackId != undefined && this.learningTrackId > 0) {
      let url = "/home/"+urlSuffix+"/analytics/" + this.learningTrackId;
      this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderViewType=='fl');
    } else if (this.learningTrackId == undefined || this.learningTrackId < 1) {
      if(urlSuffix=="tracks"){
        this.referenceService.navigateToManageTracksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
      }else if(urlSuffix=="playbook"){
        this.referenceService.navigateToPlayBooksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
      }
    }
  }

  refreshPage() {
    this.getPartnerAnalytics(this.pagination);
  }

  viewAnalytics(partner: any, selectedIndex: number) {
    this.selectedPartnerId = partner.id;
    this.getPartnerDetailedAnalytics(this.detailedAnalyticsPagination);
    $('#analytics-list').modal('show');

  }

  showFormAnalytics(partner: any){
    let formAnalytics: TracksPlayBook = new TracksPlayBook();
    formAnalytics.userId = this.loggedInUserId;
    formAnalytics.partnershipId = partner.id;
    formAnalytics.quizId = partner.quizId;
    formAnalytics.id = partner.learningTrackId;
    this.getPartnerFormAnalytics(formAnalytics);
  }

  showFormAnalyticsFromPopup(detailedAnalytics: any){
    this.detailedAnalyticsLoader.isLoading = true;
    let formAnalytics: TracksPlayBook = new TracksPlayBook();
    formAnalytics.userId = this.loggedInUserId;
    formAnalytics.partnershipId = this.selectedPartnerId;
    formAnalytics.quizId = detailedAnalytics.quizId;
    formAnalytics.id = detailedAnalytics.learningTrackId;
    this.getPartnerFormAnalytics(formAnalytics);
  }

  getPartnerFormAnalytics(formAnalytics: any) {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.tracksPlayBookUtilService.getPartnerFormAnalytics(formAnalytics).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          const data = response.data;
          this.selectedPartnerFormAnswers = data;
          this.referenceService.stopLoader(this.httpRequestLoader);
          if(this.formInput == undefined || this.formInput.id != formAnalytics.quizId) {
            this.previewForm(formAnalytics.quizId);
          } else {
            this.detailedAnalyticsLoader.isLoading = false;
            this.formPreviewWithSubmittedAnswersComponent.showFormWithAnswers(this.selectedPartnerFormAnswers, formAnalytics.quizId, this.formInput, this.formBackgroundImage, this.pageBackgroundColor);
          }
        } else {
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.referenceService.showSweetAlertErrorMessage(response.message);
        }
      });
    (error: any) => {
      this.detailedAnalyticsLoader.isLoading = false;
      this.referenceService.stopLoader(this.httpRequestLoader);
      this.customResponse = new CustomResponse('ERROR', 'Unable to get data.Please Contact Admin.', true);
    }
  } 

  previewForm(id: number) {
    this.customResponse = new CustomResponse();
    this.referenceService.startLoader(this.httpRequestLoader);
    let formInput:Form = new Form();
    formInput.id = id;
    formInput.userId = this.authenticationService.getUserId();
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      formInput.vendorCompanyProfileName = companyProfileName;
      formInput.vanityUrlFilter = true;
    }
    this.formService.getById(formInput)
        .subscribe(
            (data: any) => {
                if (data.statusCode === 200) {
                    this.formInput = data.data;
                    if(this.formInput.showBackgroundImage){
                        this.formBackgroundImage = this.formInput.backgroundImage;
                        this.pageBackgroundColor = "";
                    }else{
                        this.pageBackgroundColor = this.formInput.pageBackgroundColor;
                        this.formBackgroundImage = "";
                    }
                    $.each(this.formInput.formLabelDTOs, function (index: number, value: ColumnInfo) {
                        if (value.labelType == 'quiz_radio') {
                            value.choices = value.radioButtonChoices;
                        } else if (value.labelType == 'quiz_checkbox') {
                            value.choices = value.checkBoxChoices;
                        }
                        if((value.labelType == 'quiz_radio') || (value.labelType == 'quiz_checkbox')){
                            let correctValues = "";
                            $.each(value.choices, function (index: number, value: FormOption) {
                                if(value.correct){
                                    if(correctValues.length > 0){
                                        correctValues = correctValues + "," + value.name
                                    } else {
                                        correctValues = value.name  
                                    }
                                }
                            });
                            value.correctValues = correctValues; 
                        }
                    });
                    this.formError = false;
                    this.formPreviewWithSubmittedAnswersComponent.showFormWithAnswers(this.selectedPartnerFormAnswers, id, this.formInput, this.formBackgroundImage, this.pageBackgroundColor);
                } else {
                    this.formError = true;
                    this.customResponse = new CustomResponse('ERROR', 'Unable to load the data.Please Contact Admin', true);
                }
                this.detailedAnalyticsLoader.isLoading = false;
                this.referenceService.stopLoader(this.httpRequestLoader);
              },
            (error: string) => {
              this.detailedAnalyticsLoader.isLoading = false;
              this.referenceService.stopLoader(this.httpRequestLoader);
              this.customResponse = new CustomResponse('ERROR', 'Unable to load the data.Please Contact Admin', true);
            }
        );
}
  
}
