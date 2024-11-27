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

declare var swal:any;

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
 
  notePagination: Pagination = new Pagination();
  selectedFilterIndex: number = 1;
  showFilterOption: boolean = false;
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  noteSortOption: SortOption = new SortOption();
  showNoteModalPopup: boolean = false;
  noteId: any;
  ngxLoading:boolean = false;
  actionType: string;
  isFirstChange:boolean = true;

  constructor(public noteService: NoteService, public authenticationService: AuthenticationService,
    public pagerService: PagerService, public sortOption:SortOption, public referenceService:ReferenceService,public utilService:UtilService) {}


  ngOnInit() {
    this.showAllNoteActivities();
  }

  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.showAllNoteActivities();
    }
  }

  showAllNoteActivities() {
    this.resetNoteActivityPagination();
    this.fetchAllNoteActivities(this.notePagination);
  }

  resetNoteActivityPagination() {
    this.notePagination = new Pagination();
    this.notePagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showFilterOption = false;
  }

  fetchAllNoteActivities(notePagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    notePagination.contactId = this.contactId;
    this.noteService.getPaginatedNotes(notePagination).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode === 200;
        if(isSuccess){
          notePagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          notePagination = this.pagerService.getPagedItems(notePagination, data.list);
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
    this.actionType = 'edit';
    this.noteId = note.id;
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
    this.noteService.deleteNote(note.id).subscribe(
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

  viewNote(note:any) {
    this.actionType = 'view';
    this.noteId = note.id;
    this.showNoteModalPopup = true;
  }

  showDeleteConformationAlert(note) {
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
      self.deleteNote(note);
    }, function (dismiss: any) {
      console.log('you clicked on option' + dismiss);
    })
  }

  noteActivityEventHandler(keyCode: any) {
    if (keyCode === 13) {
      this.searchNoteActivities();
    }
  }

}
