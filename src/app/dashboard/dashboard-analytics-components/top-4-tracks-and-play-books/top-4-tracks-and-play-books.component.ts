import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import {TracksPlayBookUtilService} from 'app/tracks-play-book-util/services/tracks-play-book-util.service';
import { TracksPlayBookType } from 'app/tracks-play-book-util/models/tracks-play-book-type.enum';
import { TracksPlayBook } from 'app/tracks-play-book-util/models/tracks-play-book';
import { CustomResponse } from 'app/common/models/custom-response';
import { FontAwesomeClassName } from 'app/common/models/font-awesome-class-name';
declare var $:any, swal:any;
@Component({
  selector: 'app-top-4-tracks-and-play-books',
  templateUrl: './top-4-tracks-and-play-books.component.html',
  styleUrls: ['./top-4-tracks-and-play-books.component.css'],
  providers: [Properties,TracksPlayBookUtilService]
})
export class Top4TracksAndPlayBooksComponent implements OnInit,OnDestroy {
  

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
  titleHeader = "";

  selectedOption=false;
  selectedTrackOrPlayBookId:number;
  isPublishing:boolean;
  isOptionClicked = false;
  type = "";

  trackOrPlaybookTitle: string = "";
  trackOrPlaybookCreatedById: number;
  trackOrPlaybookCreatedByFullName: string = "";
  callCommentsComponent: boolean = false;
  entityId: number;
  createdByAnyApprovalManagerOrApprover: boolean = false;
  fontAwesomeClassName: FontAwesomeClassName = new FontAwesomeClassName();
  approvalStatus = {
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CREATED: 'CREATED',
    UPDATED: 'UPDATED'
  };
  videoId: number;
  moduleType: string = "";
  @Input() isDashboardView: boolean;
  @Input() isDraggingEnabled: boolean;

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
      this.titleHeader = "Tracks";
      this.type = "track";
      this.moduleType = TracksPlayBookType[TracksPlayBookType.TRACK];
    }else{
      this.headerTitle = this.isPartnerView ? 'Shared Playbooks':'Playbooks';
      this.subHeaderTitle = this.isPartnerView ? 'Click here to access shared playbooks' : 'Click here to manage playbooks'
      this.addButtonText = "Add Playbooks";
      this.titleHeader = "Playbooks";
      this.type = "playbook";
      this.moduleType = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];
    }
    this.listLearningTracks(this.pagination);
  }

  ngOnDestroy(): void {
    swal.close();
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

  confirmDelete(trackOrPlayBook: any) {
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
        self.delete(trackOrPlayBook);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.xtremandLogger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
    }
  }

  delete(trackOrPlayBook: any) {
    let tracksPlayBook: TracksPlayBook = new TracksPlayBook();
    tracksPlayBook.id = trackOrPlayBook.id;
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
          this.customResponse = new CustomResponse('SUCCESS', trackOrPlayBook.title+" Deleted Successfully", true);
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

  confirmChangePublish(id: number, isPublish: boolean,learningTrack : any) {
    this.selectedTrackOrPlayBookId=id;
    this.isPublishing=isPublish;
      if(isPublish && !learningTrack.hasDamContent){
        swal({
          title: 'Add assets to publish.',
          type: 'warning',
          swalConfirmButtonColor: '#54a7e9',
          confirmButtonText: 'Ok'
        }).then(function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
        });
      } else {
        let text = "";
        if (isPublish) {
          text = "You want to publish.";
        } else {
          text = "You want to unpublish.";
        }
        try {
        let self = this;
        if(isPublish==true){
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
        }
        else{
          this.isOptionClicked = true;

        }
        } catch (error) {
          this.xtremandLogger.error(this.referenceService.errorPrepender + " ChangePublish():" + error);
          this.loader = false;
        }
    }
  }

  toCallChangePublishFromUnpublishPopup(event:any){
    let id =event['selectedTrackOrPlayBookId'];
    let isPublishing = event['isPublishing'];
    this.changePublish(id,isPublishing);
  }
  
  resetUnPublishOptionInputValues(){
    this.isOptionClicked = false;
    this.selectedTrackOrPlayBookId = 0;
    this.isPublishing = false;
    this.closePopUp();
  }


  closePopUp(){
    $('#unpublished-modal').modal('hide');
    $('input[name="rdaction"]').prop('checked', false);
    this.selectedOption = false;
  }

  changePublish(learningTrackId: number, isPublish: boolean) {
    this.loader = true;
    this.customResponse = new CustomResponse();
    this.tracksPlayBookUtilService.changePublish(learningTrackId, isPublish).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          /****XBI-2589***/
          let trackOrPlayBook =  this.tracks ? "Track":"Playbook";
          let message = isPublish ? trackOrPlayBook+" Published Successsfully":trackOrPlayBook+" Unpublished Successfully";
          this.customResponse = new CustomResponse('SUCCESS',message,true);
          this.listLearningTracks(this.pagination);
        } else if(response.statusCode == 401) {
          this.referenceService.showSweetAlertErrorMessage(response.message);
          this.loader = false;
        }
      },
      (error: string) => {
        this.xtremandLogger.errorPage(error);
        this.loader = false;
      })
      this.resetUnPublishOptionInputValues();
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

  getApprovalStatusText(status: string): string {
    switch (status) {
      case this.approvalStatus.APPROVED:
        return 'Approved';
      case this.approvalStatus.REJECTED:
        return 'Rejected';
      case this.approvalStatus.CREATED:
        return 'Pending Approval';
      case this.approvalStatus.UPDATED:
        return 'Updated';
      default:
        return status;
    }
  }

  showCommentsAndHistoryModalPopup(trackOrPlaybook: any) {
    this.callCommentsComponent = true;
    this.trackOrPlaybookTitle = trackOrPlaybook.title;
    this.trackOrPlaybookCreatedById = trackOrPlaybook.createdById;
    this.trackOrPlaybookCreatedByFullName = trackOrPlaybook.createdByName;
    this.entityId = trackOrPlaybook.id;
    this.createdByAnyApprovalManagerOrApprover = trackOrPlaybook.createdByAnyApprovalManagerOrApprover;
    this.videoId = trackOrPlaybook.videoId;
  }

  closeCommentsAndHistoryModalPopup() {
    this.callCommentsComponent = false;
  }

  closeCommentsAndHistoryModalPopupAndRefreshList() {
    this.refresh();
    this.callCommentsComponent = false;
  }

  isApprovalRequiredForType(): boolean {
    if (this.moduleType == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      return this.authenticationService && this.authenticationService.approvalRequiredForTracks
        ? this.authenticationService.approvalRequiredForTracks
        : false;
    } else if (this.moduleType == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      return this.authenticationService && this.authenticationService.approvalRequiredForPlaybooks
        ? this.authenticationService.approvalRequiredForPlaybooks
        : false;
    }
  }
  /*** XNFR-897 ***/
  setTooltipMessage(learningTrack): string {
    if (!learningTrack.createdByAnyApprovalManagerOrApprover && learningTrack.approvalStatus !== 'APPROVED') {
      return 'Requires approval for publishing.';
    } else if (this.referenceService.isAccessToView(learningTrack.expireDate)) {
      return `${this.tracks ? "Track" : "Playbook"} cannot be published as the end date has expired.`;
    } else {
      return 'Publish';
    }
  }
  updateTooltip(event: any, learningTrack: any) {
    const tooltipMessage = this.setTooltipMessage(learningTrack);
    const element = $(event.target).closest('a');
    element.attr('data-original-title', tooltipMessage).tooltip('fixTitle').tooltip('show');
  }  

}
