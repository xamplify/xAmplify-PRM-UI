import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivityService } from '../services/activity-service';
import { Pagination } from 'app/core/models/pagination';
import { CustomResponse } from 'app/common/models/custom-response';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { PagerService } from 'app/core/services/pager.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { NoteService } from '../services/note-service';
import { UtilService } from 'app/core/services/util.service';
import { SortOption } from 'app/core/models/sort-option';
import { TaskActivityService } from '../services/task-activity.service';

declare var swal:any;

@Component({
  selector: 'app-activity-stream',
  templateUrl: './activity-stream.component.html',
  styleUrls: ['./activity-stream.component.css'],
  providers: [ActivityService, NoteService, SortOption, TaskActivityService]
})
export class ActivityStreamComponent implements OnInit {

  @Input() contactId:number;
  @Input() reloadTab: boolean;
  @Input() isFromCompanyModule:boolean = false;
  @Input() selectedContactListId:number;
  @Input() contactName:any;
  @Input() contactEmailId;
  @Input() isCompanyJourney:boolean = false;
  @Input() selectedUserListId:any;
  @Output() notifyShowDealForm = new EventEmitter();
  @Output() notifyShowLeadForm = new EventEmitter();
  @Output() notifyNoteUpdateSuccess = new EventEmitter();
  @Output() notifyNoteDeleteSuccess = new EventEmitter();
  @Output() notifyTaskDeleteSuccess = new EventEmitter();
  @Output() notifyTaskUpdateSuccess = new EventEmitter();

  ngxLoading:boolean = false;
  activities = [];
  activityPagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  selectedFilterIndex: number = 1;
  dealId: any;
  showDealForm: boolean = false;
  emailActivityId: any;
  showEmailModalPopup: boolean = false;
  actionType:any;
  noteId: any;
  showNoteModalPopup: boolean = false;
  isFirstChange: boolean = true;
  activitySortOption: SortOption = new SortOption();
  taskActivityId: any;
  showPreviewTaskModalPopup: boolean = false;
  showTaskModalPopup: boolean = false;

  constructor(private activityService:ActivityService, private referenceService: ReferenceService, public pagerService: PagerService,
    private noteService:NoteService,public utilService:UtilService,public sortOption:SortOption, public taskActivityService: TaskActivityService) { }

  ngOnInit() {
    this.showAllActivities();
  }

  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.showAllActivities();
    }
  }

  showAllActivities() {
    this.resetActivityPagination();
    this.fetchAllRecentActivities(this.activityPagination);
  }

  fetchAllRecentActivities(activityPagination:Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    activityPagination.isCompanyJourney = this.isCompanyJourney;
    // if (this.isCompanyJourney) {
    //   activityPagination.contactId = this.selectedUserListId;
    // } else {
      activityPagination.contactId = this.contactId;
    // }
    this.activityService.fetchRecentActivities(activityPagination).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode === 200;
        if(isSuccess){
          activityPagination.totalRecords = data.totalRecords;
          activityPagination = this.pagerService.getPagedItems(activityPagination, data.list);
        }else{
          this.customResponse = new CustomResponse('ERROR',"Unable to fetch activities",true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        let message = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR',message,true);
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  resetActivityPagination() {
    this.activityPagination.maxResults = 12;
    this.activityPagination = new Pagination;
    this.activityPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
  }

  setActivityPage(event: any) {
    this.activityPagination.pageIndex = event.page;
    this.fetchAllRecentActivities(this.activityPagination);
  }

  viewEmail(emailActivityId:any) {
    this.emailActivityId = emailActivityId;
    this.actionType = 'view';
    this.showEmailModalPopup = true;
  }

  viewNote(noteId:any) {
    this.actionType = 'view';
    this.noteId = noteId;
    this.showNoteModalPopup = true;
  }

  showEditNoteTab(noteId:any) {
    this.actionType = 'edit';
    this.noteId = noteId;
    this.showNoteModalPopup = true;
  }

  viewDeal(dealId:any) {
    this.notifyShowDealForm.emit(dealId);
  }

  viewLead(leadId:any) {
    this.notifyShowLeadForm.emit(leadId);
  }

  viewCampaignTimeLine(campaignData:any){
  
	}

  closeModalPopup() {
    this.showEmailModalPopup = false;
  }

  closeNoteModalPopup() {
    this.showNoteModalPopup = false;
  }

  showNoteCutomResponse(event) {
    this.showNoteModalPopup = false;
    this.notifyNoteUpdateSuccess.emit(event);
  }

  showDeleteConformationAlert(noteId) {
    const self = this;
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, the note can not be recovered.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54a7e9',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes'
    }).then(function () {
      self.deleteNote(noteId);
    }, function (dismiss: any) {
      console.log('you clicked on option' + dismiss);
    })
  }

  deleteNote(noteId:any) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.noteService.deleteNote(noteId).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.showAllActivities();
          this.notifyNoteDeleteSuccess.emit(data.message);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  sortBy(text: any) {
    this.sortOption.activityDropDownOption = text;
    this.getAllFilteredActivityResults();
  }

  getAllFilteredActivityResults() {
    this.activityPagination.pageIndex = 1;
    this.activityPagination.searchKey = this.activitySortOption.searchKey;
    this.activityPagination = this.utilService.sortOptionValues(this.sortOption.activityDropDownOption, this.activityPagination);
    this.fetchAllRecentActivities(this.activityPagination);
  }

  searchActivities() {
    this.getAllFilteredActivityResults();
  }

  activityEventHandler(keyCode: any) {
    if (keyCode === 13) {
      this.searchActivities();
    }
  }

  clearSearch() {
    this.activitySortOption.searchKey='';
    this.getAllFilteredActivityResults();
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
    this.notifyTaskUpdateSuccess.emit(event);
  }

  deleteTask(id) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.taskActivityService.delete(id).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.showAllActivities();
          this.notifyTaskDeleteSuccess.emit(data.message);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  showTaskDeleteConformationAlert(id) {
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

}
