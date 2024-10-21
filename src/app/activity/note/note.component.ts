import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { NoteService } from '../services/note-service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  providers: [SortOption, HttpRequestLoader, NoteService]
})
export class NoteComponent implements OnInit {


  @Input() contactId:number;
  @Input() reloadTab: boolean;
  @Output() notifySuccess = new EventEmitter();
  @Output() notifyDeleteSuccess = new EventEmitter();
 
  loggedInUserId: number;
  notePagination: Pagination = new Pagination();
  selectedFilterIndex: number = 1;
  showFilterOption: boolean = false;
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  noteSortOption: SortOption = new SortOption();
  totalRecords: any;
  showNoteModalPopup: boolean = false;
  note: any;
  ngxLoading:boolean = false;

  constructor(public noteService: NoteService, public authenticationService: AuthenticationService,
    public pagerService: PagerService, public sortOption:SortOption, public referenceService:ReferenceService,public utilService:UtilService) {
      this.loggedInUserId = this.authenticationService.getUserId();
     }


  ngOnInit() {
    this.showAllNoteActivities();
  }

  ngOnChanges() {
    this.showAllNoteActivities();
  }

  showAllNoteActivities() {
    this.resetNoteActivityPagination();
    this.fetchAllNoteActivities(this.notePagination);
  }

  resetNoteActivityPagination() {
    this.notePagination.maxResults = 12;
    this.notePagination = new Pagination;
    this.notePagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showFilterOption = false;
  }

  fetchAllNoteActivities(notePagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    notePagination.contactId = this.contactId;
    notePagination.userId = this.loggedInUserId;
    this.noteService.getPaginatedNotes(notePagination).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode === 200;
        if(isSuccess){
          notePagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          notePagination = this.pagerService.getPagedItems(notePagination, data.list);
          this.totalRecords =  data.totalRecord;
        }else{
          this.customResponse = new CustomResponse('ERROR',"Unable to load note activities",true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        let message = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR',message,true);
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  getAllFilteredNoteActivityResults() {
    this.notePagination.pageIndex = 1;
    this.notePagination.searchKey = this.noteSortOption.searchKey;
    // this.notePagination = this.utilService.sortOptionValues(this.sortOption.emailActivityDropDownOption, this.notePagination);
    this.fetchAllNoteActivities(this.notePagination);
  }

  searchNoteActivities() {
    this.getAllFilteredNoteActivityResults();
  }

  clearSearch() {
    this.noteSortOption.searchKey='';
    this.getAllFilteredNoteActivityResults();
  }

  setnotePage(event: any){
    this.notePagination.pageIndex = event.page;
    this.fetchAllNoteActivities(this.notePagination);
  }

  showEditNoteTab(note:any) {
    this.note = note;
    this.showNoteModalPopup = true;
  }

  closeNoteModalPopup() {
    this.showNoteModalPopup = false;
  }

  showNoteCutomResponse(event) {
    this.showNoteModalPopup = false;
    this.notifySuccess.emit(event);
  }

  deleteNote(note:any) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.noteService.deleteNote(note.id, this.loggedInUserId).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.showAllNoteActivities();
          this.notifyDeleteSuccess.emit(data.message);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

}
