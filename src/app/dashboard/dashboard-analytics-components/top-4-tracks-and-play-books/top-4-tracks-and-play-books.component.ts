import { Component, OnInit,Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import {TracksPlayBookUtilService} from 'app/tracks-play-book-util/services/tracks-play-book-util.service';
import { TracksPlayBookType } from 'app/tracks-play-book-util/models/tracks-play-book-type.enum';
import { TracksPlayBook } from 'app/tracks-play-book-util/models/tracks-play-book';
import { LearningTrack } from 'app/lms/models/learningTrack';
import { CustomResponse } from 'app/common/models/custom-response';

declare var $:any, swal:any;
@Component({
  selector: 'app-top-4-tracks-and-play-books',
  templateUrl: './top-4-tracks-and-play-books.component.html',
  styleUrls: ['./top-4-tracks-and-play-books.component.css'],
  providers: [Properties,TracksPlayBookUtilService]
})
export class Top4TracksAndPlayBooksComponent implements OnInit {

  pagination:Pagination = new Pagination();
  headerTitle = "";
  subHeaderTitle = "";
  addButtonText = "";
  loader = false;
  @Input()isPartnerView = false;
  @Input() tracks = false;
  @Input() hideRowClass = false;
  loggedInUserId:number = 0;
  contents:Array<any> = new Array<any>();
  customResponse:CustomResponse = new CustomResponse();
  constructor(public referenceService: ReferenceService,  public tracksPlayBookUtilService:TracksPlayBookUtilService, public authenticationService: AuthenticationService,public xtremandLogger:XtremandLogger,public pagerService:PagerService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.pagination.userId = this.loggedInUserId;
    this.pagination.maxResults =4;
   }

  ngOnInit() {
    this.loader = true;
    if(this.tracks){
      this.headerTitle = this.isPartnerView ? 'Shared Tracks':'Tracks';
      this.subHeaderTitle = this.isPartnerView ? 'Click here to access shared tracks' : 'Click here to manage tracks'
      this.addButtonText = "Add Tracks";
    }else{
      this.headerTitle = this.isPartnerView ? 'Shared Play Books':'Play Books';
      this.subHeaderTitle = this.isPartnerView ? 'Click here to access shared play books' : 'Click here to manage play books'
      this.addButtonText = "Add Play Books";
    }
    this.listLearningTracks(this.pagination);
  }

  

  
  listLearningTracks(pagination: Pagination) {
    this.loader = true;
    if(this.tracks){
      pagination.lmsType = TracksPlayBookType[TracksPlayBookType.TRACK];
    }else{
      pagination.lmsType = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];
    }
    /**********Vanity Url Filter**************** */
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.pagination.vanityUrlFilter = true;
    }
    this.tracksPlayBookUtilService.list(pagination, this.isPartnerView).subscribe(
      (response: any) => {
        const data = response.data;
        if (response.statusCode == 200) {
          pagination.totalRecords = data.totalRecords;
          this.contents = data.data;
          $.each(this.contents, function (_index:number, learningTrack:any) {
            learningTrack.createdDateString = new Date(learningTrack.createdTime);
          });
          pagination = this.pagerService.getPagedItems(pagination, this.contents);
        }
        this.loader = false;
      },
      (error: any) => {
        this.loader = false;
      });
  }

  refresh(){
    this.listLearningTracks(this.pagination);
  }

  openSettingsPopup(){
    this.referenceService.showSweetAlertInfoMessage();
  }

  goToAnalytics(track:any){
    let router = "";
    if(this.isPartnerView){
      if(this.tracks){
        router = "/home/tracks/tb/" + track.createdByCompanyId + "/" + track.slug;
      }else{
        router = "/home/playbook/pb/" + track.createdByCompanyId + "/" + track.slug;
      }
    }else{
      if(this.tracks){
        router = "/home/tracks/analytics/" + track.id;
      }else{
        router = "/home/playbook/analytics/" + track.id;
      }
    }
    this.referenceService.goToRouter(router);
  }

  goToManage(){
    let router = "";
    if(this.isPartnerView){
      if(this.tracks){
        router = "home/tracks/shared";
      }else{
        router = "home/playbook/shared";
      }
    }else{
      if(this.tracks){
        router = "home/tracks/manage";
      }else{
        router = "home/playbook/manage";
      }
    }
    this.referenceService.goToRouter(router);
  }

  goToCreate(){
    let router = this.tracks ? '/home/tracks/add':'/home/playbook/add';
    this.referenceService.goToRouter(router);
  }

  edit(id: number) {
    if (this.tracks) {
      this.referenceService.goToRouter("/home/tracks/edit/" + id);
    } else {
      this.referenceService.goToRouter("/home/playbook/edit/" + id);
    }
  }

  confirmDelete(id: number) {
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes, delete it!'

      }).then(function () {
        self.delete(id);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.xtremandLogger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
    }
  }

  delete(id: number) {
    let tracksPlayBook: TracksPlayBook = new TracksPlayBook();
    tracksPlayBook.id = id;
    tracksPlayBook.userId = this.loggedInUserId;
    if(this.tracks){
      tracksPlayBook.type =  TracksPlayBookType[TracksPlayBookType.TRACK];
    }else{
      tracksPlayBook.type =  TracksPlayBookType[TracksPlayBookType.PLAYBOOK];
    }
    this.customResponse = new CustomResponse();
    this.loader = true;
    this.tracksPlayBookUtilService.deleteById(tracksPlayBook).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          if(this.tracks){
            this.referenceService.showInfo("Track Deleted Successfully", "");
          }else{
            this.referenceService.showInfo("Play Book Deleted Successfully", "");
          }
          if (this.tracks) {
            this.customResponse = new CustomResponse('SUCCESS', "Track Deleted Successfully", true);
          } else {
            this.customResponse = new CustomResponse('SUCCESS', "Play Book Deleted Successfully", true);
          }
          this.pagination.pageIndex = 1;
          this.listLearningTracks(this.pagination);
        } else {
          swal("Please Contact Admin!", response.message, "error");
        }
        this.loader = false;
      },
      (error: string) => {
        this.xtremandLogger.errorPage(error);
        this.loader = false;
      });
  }

  confirmChangePublish(id: number, isPublish: boolean) {
    let text = "";
    if (isPublish) {
      text = "You want to publish.";
    } else {
      text = "You want to unpublish.";
    }
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: text,
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes'

      }).then(function () {
        self.changePublish(id, isPublish);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.xtremandLogger.error(this.referenceService.errorPrepender + " ChangePublish():" + error);
      this.loader = false;
    }
  }

  changePublish(learningTrackId: number, isPublish: boolean) {
    this.loader = true;
    this.tracksPlayBookUtilService.changePublish(learningTrackId, isPublish).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.listLearningTracks(this.pagination);
        } else if(response.statusCode == 401) {
          this.referenceService.showSweetAlertErrorMessage(response.message);
        }
        this.loader = false;
      },
      (error: string) => {
        this.xtremandLogger.errorPage(error);
        this.loader = false;
      })
  }

  view(tracksPlayBook: TracksPlayBook) {
    let route = "";
    if (this.tracks) {
      route = "/home/tracks/tb/" + tracksPlayBook.createdByCompanyId + "/" + tracksPlayBook.slug;
    } else {
      route = "/home/playbook/pb/" + tracksPlayBook.createdByCompanyId + "/" + tracksPlayBook.slug;
    }
    this.referenceService.goToRouter(route);
  }


  

}
