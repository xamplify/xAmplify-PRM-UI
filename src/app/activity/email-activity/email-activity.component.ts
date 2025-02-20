import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailActivityService } from '../services/email-activity-service';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { SortOption } from 'app/core/models/sort-option';
import { ReferenceService } from 'app/core/services/reference.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { UtilService } from 'app/core/services/util.service';

@Component({
  selector: 'app-email-activity',
  templateUrl: './email-activity.component.html',
  styleUrls: ['./email-activity.component.css'],
  providers: [SortOption, HttpRequestLoader]
})
export class EmailActivityComponent implements OnInit {

  @Input() contactId:number;
  @Input() reloadTab: boolean;
  @Input() contactEmailId:any;
  @Input() contactName:any;
  @Input() isCompanyJourney:boolean = false;
  @Input() selectedUserListId:any;
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifySubmitFailed = new EventEmitter();

  emailActivities = [];
  emailActivityId: number = 0;
  actionType: string = 'add';
  showEmailModalPopup: boolean = false;
  ngxLoading:boolean = false;
  emailActivityPagination: Pagination = new Pagination();
  showFilterOption: boolean = false;
  selectedFilterIndex: number = 1;
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  emailSortOption: SortOption = new SortOption();
  isFirstChange:boolean = true;
  showAddEmailModalPopup: boolean = false;

  constructor(public emailActivityService: EmailActivityService, public authenticationService: AuthenticationService,
    public pagerService: PagerService, public sortOption:SortOption, public referenceService:ReferenceService,public utilService:UtilService) {}

  ngOnInit() {
    this.showAllEmailActivities();
  }

  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.showAllEmailActivities();
    }
  }

  showAllEmailActivities() {
    this.resetEmailActivityPagination();
    this.fetchAllEmailActivities(this.emailActivityPagination);
  }

  fetchAllEmailActivities(emailActivityPagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    emailActivityPagination.contactId = this.contactId;
    emailActivityPagination.isCompanyJourney = this.isCompanyJourney;
    // if (this.isCompanyJourney) {
    //   emailActivityPagination.contactId = this.selectedUserListId;
    // } else {
      emailActivityPagination.contactId = this.contactId;
    // }
    this.emailActivityService.fetchAllEmailActivities(emailActivityPagination).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode === 200;
        if(isSuccess){
          emailActivityPagination.totalRecords = data.totalRecords;
          emailActivityPagination = this.pagerService.getPagedItems(emailActivityPagination, data.list);
        }else{
          this.customResponse = new CustomResponse('ERROR',"Unable to get email activities",true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        let message = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR',message,true);
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  viewEmail(emailActivityId:any) {
    this.emailActivityId = emailActivityId;
    this.actionType = 'view';
    this.showEmailModalPopup = true;
  }

  closeModalPopup() {
    this.showEmailModalPopup = false;
  }

  setEmailActivityPage(event: any) {
    this.emailActivityPagination.pageIndex = event.page;
    this.fetchAllEmailActivities(this.emailActivityPagination);
  }

  resetEmailActivityPagination() {
    this.emailActivityPagination.maxResults = 12;
    this.emailActivityPagination = new Pagination;
    this.emailActivityPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showFilterOption = false;
  }

  clearSearch() {
    this.emailSortOption.searchKey='';
    this.getAllFilteredEmailActivityResults();
  }

  getAllFilteredEmailActivityResults() {
    this.emailActivityPagination.pageIndex = 1;
    this.emailActivityPagination.searchKey = this.emailSortOption.searchKey;
    this.emailActivityPagination = this.utilService.sortOptionValues(this.sortOption.emailActivityDropDownOption, this.emailActivityPagination);
    this.fetchAllEmailActivities(this.emailActivityPagination);
  }

  searchEmailActivities() {
    this.getAllFilteredEmailActivityResults();
  }

  emailActivityEventHandler(keyCode: any) {
    if (keyCode === 13) {
      this.searchEmailActivities();
    }
  }

  sortBy(text: any) {
    this.sortOption.emailActivityDropDownOption = text;
    this.getAllFilteredEmailActivityResults();
  }

  openEmailModalPopup() {
    this.actionType = 'add';
    this.showAddEmailModalPopup = true;
  }

  closeEmailModalPopup() {
    this.showAddEmailModalPopup = false;
  }

  showEmailSubmitSuccessStatus(event) {
    this.showAddEmailModalPopup = false;
    this.notifySubmitSuccess.emit(event);
  }

  showEmailSubmitFailedStatus(event) {
    this.showAddEmailModalPopup = false;
    this.notifySubmitFailed.emit(event);
  }

}
