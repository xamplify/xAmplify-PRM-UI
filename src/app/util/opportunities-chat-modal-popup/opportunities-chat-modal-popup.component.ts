import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Deal } from 'app/deals/models/deal';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DealsService } from 'app/deals/services/deals.service';
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

  @Input()
  deal: Deal;
  @Input()
  isPartnerVersion: boolean;
  @Input()
  isCommentSection: boolean;
  @Input()
  textAreaDisable: boolean;
  @Input()
  loggedInUserId: number;

  @Output()
  closePopupEmitter = new EventEmitter();
  @Output()
  showCommentsEmitter = new EventEmitter();
  @Output()
  stageUpdateStatusCode = new EventEmitter();

  constructor(public authenticationService: AuthenticationService,
    public dealsService: DealsService, public referenceService: ReferenceService) { }

  ngOnInit() {
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
    request.dealComment = $.trim(deal.dealComment);
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
}
