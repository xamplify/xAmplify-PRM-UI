import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { TaskActivityService } from '../services/task-activity.service';

declare var swal:any;

@Component({
  selector: 'app-task-activity',
  templateUrl: './task-activity.component.html',
  styleUrls: ['./task-activity.component.css'],
  providers: [SortOption, HttpRequestLoader, TaskActivityService]
})
export class TaskActivityComponent implements OnInit {

  @Input() contactId:number;
  @Input() reloadTab: boolean;
  @Input() isCompanyJourney:boolean = false;
  @Input() selectedUserListId:any;
  @Output() notifyTaskUpdatedStatus = new EventEmitter();
  @Output() notifyDeleteSuccess = new EventEmitter();
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifySubmitFailed = new EventEmitter();

  taskActivities = [];
  isFirstChange:boolean = true;
  ngxLoading:boolean = false;
  taskActivityPagination: Pagination = new Pagination();
  showFilterOption: boolean = false;
  selectedFilterIndex: number = 1;
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  taskSortOption: SortOption = new SortOption();
  showTaskModalPopup:boolean = false;
  taskActivityId: any;
  actionType:string;
  showPreviewTaskModalPopup: boolean = false;

  constructor(public authenticationService: AuthenticationService, public pagerService: PagerService, public sortOption:SortOption, 
    public referenceService:ReferenceService, public taskActivityService: TaskActivityService, public utilService:UtilService) { }

  ngOnInit() {
    this.showAllTaskActivities();
  }

  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.showAllTaskActivities();
    }
  }

  showAllTaskActivities() {
    this.resetTaskActivityPagination();
    this.fetchAllTaskActivities(this.taskActivityPagination);
  }

  fetchAllTaskActivities(taskActivityPagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    taskActivityPagination.isCompanyJourney = this.isCompanyJourney;
    // if (this.isCompanyJourney) {
    //   taskActivityPagination.contactId = this.selectedUserListId;
    // } else {
      taskActivityPagination.contactId = this.contactId;
    // }
    this.taskActivityService.fetchAllTaskActivities(taskActivityPagination).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode === 200;
        if(isSuccess){
          taskActivityPagination.totalRecords = data.totalRecords;
          taskActivityPagination = this.pagerService.getPagedItems(taskActivityPagination, data.list);
        }else{
          this.customResponse = new CustomResponse('ERROR',"Unable to get task activities",true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        let message = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR',message,true);
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  resetTaskActivityPagination() {
    this.taskActivityPagination.maxResults = 12;
    this.taskActivityPagination = new Pagination;
    this.taskActivityPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showFilterOption = false;
  }

  sortBy(text: any) {
    this.sortOption.taskActivityDropDownOption = text;
    this.getAllFilteredTaskActivityResults();
  }

  getAllFilteredTaskActivityResults() {
    this.taskActivityPagination.pageIndex = 1;
    this.taskActivityPagination.searchKey = this.taskSortOption.searchKey;
    this.taskActivityPagination = this.utilService.sortOptionValues(this.sortOption.taskActivityDropDownOption, this.taskActivityPagination);
    this.fetchAllTaskActivities(this.taskActivityPagination);
  }

  taskActivityEventHandler(keyCode: any) {
    if (keyCode === 13) {
      this.searchTaskActivities();
    }
  }

  searchTaskActivities() {
    this.getAllFilteredTaskActivityResults();
  }

  setTaskActivityPage(event: any) {
    this.taskActivityPagination.pageIndex = event.page;
    this.fetchAllTaskActivities(this.taskActivityPagination);
  }

  clearSearch() {
    this.taskSortOption.searchKey='';
    this.getAllFilteredTaskActivityResults();
  }

  viewTask(taskId) {
    this.taskActivityId = taskId;
    this.showPreviewTaskModalPopup = true;
  }

  closeTaskModalPopup() {
    this.showTaskModalPopup = false;
  }

  closePreviewTaskModalPopup() {
    this.showPreviewTaskModalPopup = false;
  }

  editTask(taskId) {
    this.actionType = 'edit';
    this.taskActivityId = taskId;
    this.showTaskModalPopup = true;
  }

  showUpdateSuccessStatus(event:any) {
    this.closeTaskModalPopup();
    this.notifyTaskUpdatedStatus.emit(event);
  }

  deleteTask(id) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.taskActivityService.delete(id).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.showAllTaskActivities();
          this.notifyDeleteSuccess.emit(data.message);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  showDeleteConformationAlert(id) {
    const self = this;
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, the task can not be recovered.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54a7e9',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes'
    }).then(function () {
      self.deleteTask(id);
    }, function (dismiss: any) {
      console.log('you clicked on option' + dismiss);
    })
  }

  openAddTaskModalPopup() {
    this.actionType = 'add';
    this.showTaskModalPopup = true;
  }

  showTaskSubmitSuccessStatus(event) {
    this.showTaskModalPopup = false;
    this.notifySubmitSuccess.emit(event);
  }

}
