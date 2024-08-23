import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Deal } from 'app/deals/models/deal';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DealsService } from 'app/deals/services/deals.service';
import { Lead } from 'app/leads/models/lead';
import { LeadsService } from 'app/leads/services/leads.service';
import { PipelineStage } from 'app/dashboard/models/pipeline-stage';
declare var swal, $, videojs: any;

@Component({
  selector: 'app-opportunities-chat-modal-popup',
  templateUrl: './opportunities-chat-modal-popup.component.html',
  styleUrls: ['./opportunities-chat-modal-popup.component.css']
})
export class OpportunitiesChatModalPopupComponent implements OnInit {
  //XNFR-426
  ngxloading: boolean = false;
  totalcharsLeft = 250;
  remainingCharsLeft = this.totalcharsLeft;
  isApprovalStatusCommentValid:boolean = false;
  comment:string="";
  isDescriptionValid:boolean=false;
  createdForStages = new Array<PipelineStage>();
  
  @Input()
  deal: Deal;
  @Input()
  lead: Lead;
  @Input()
  isPartnerVersion: boolean;
  @Input()
  isCommentSection: boolean;
  @Input()
  textAreaDisable: boolean;
  @Input()
  loggedInUserId: number;
  @Input()
  leadApprovalStatusType:string;
  @Input()
  isVendorVersion : boolean = false;

  @Output()
  closePopupEmitter = new EventEmitter();
  @Output()
  showCommentsEmitter = new EventEmitter();
  @Output()
  stageUpdateStatusCode = new EventEmitter();

  constructor(public authenticationService: AuthenticationService,public leadsService: LeadsService,
    public dealsService: DealsService, public referenceService: ReferenceService) { }

  ngOnInit() {
    this.findPipelineStagesByPipelineId(this.deal.pipelineId);
    this.referenceService.openModalPopup('changeDealPipelineStageModel');
  }

  showComments(deal: Deal) {
    this.showCommentsEmitter.emit(deal);
    this.isCommentSection = !this.isCommentSection;
    deal.unReadChatCount = 0;
  }

  updateDealStage(deal: Deal) {
    this.ngxloading = true;
    let request: Deal = new Deal();
    request.id = deal.id;
    request.pipelineStageId = deal.pipelineStageId;
    request.userId = this.loggedInUserId;
    request.dealComment = $.trim(this.comment);
    this.dealsService.changeDealStatus(request)
      .subscribe(
        response => {
          this.ngxloading = false;
          if (response.statusCode == 200) {
            this.closePopup();
            this.stageUpdateStatusCode.emit(response.statusCode);
          } else if (response.statusCode == 500) {
            this.ngxloading = false;
            this.closePopup();
            this.stageUpdateStatusCode.emit(response.statusCode);
          }
        });
  }

  getRemainingCharCount(comment: string) {
    this.remainingCharsLeft = this.totalcharsLeft - comment.length;
  }

  closePopup() {
    $('#changeDealPipelineStageModel').modal('hide');
    this.remainingCharsLeft = this.totalcharsLeft;
    this.textAreaDisable = false;
    this.closePopupEmitter.emit();
  }


  validateComment(comment: string){
    this.comment = $.trim(comment);
    this.remainingCharsLeft = this.totalcharsLeft - this.comment.length;
    if(comment==='') {
      this.isApprovalStatusCommentValid = false;
      this.isDescriptionValid = false;
    }
    else if(this.referenceService.validateCkEditorDescription(comment)){
      this.isApprovalStatusCommentValid = true;
      this.isDescriptionValid=false;
    }
    else{
      this.isApprovalStatusCommentValid = false;
      this.isDescriptionValid=true;
    }
  }

  updateLeadApprovalStatus(lead:Lead,comment:string){
    this.ngxloading = true;
    lead.approvalStatusComment = comment;
    lead.userId = this.loggedInUserId;
    lead.leadApprovalStatusType = this.leadApprovalStatusType;

    this.leadsService.updateLeadApprovalStatus(lead).subscribe(response => {
      if(response.statusCode == 200){
        this.ngxloading = false;
        this.leadApprovalStatusType = "";
        this.remainingCharsLeft = this.totalcharsLeft;
        this.closePopup();
      }else{
        // console.log("Unauthorized user"); 
        this.closePopup();
      }
    });
  }

  /*** XNFR-650 ***/
  private findPipelineStagesByPipelineId(createdForPipeLineId: number) {
    this.ngxloading = true;
    this.leadsService.findPipelineStagesByPipelineId(createdForPipeLineId, this.loggedInUserId).subscribe(
      response => {
        this.ngxloading = false;
        let data = response.data;
        this.createdForStages = data.list;
      }, error => {
        this.ngxloading = false;
      });
  }

}
