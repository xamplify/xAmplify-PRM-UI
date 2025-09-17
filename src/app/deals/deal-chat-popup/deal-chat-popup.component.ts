import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { DEAL_CONSTANTS } from 'app/constants/deal.constants';

declare var swal, $, videojs: any;

@Component({
  selector: 'app-deal-chat-popup',
  templateUrl: './deal-chat-popup.component.html',
  styleUrls: ['./deal-chat-popup.component.css'],
  providers: [ HttpRequestLoader],
})
export class DealChatPopupComponent implements OnInit {

  /** Campaign name associated with the deal */
  @Input() campaignName: string;
  /** Deal title */
  @Input() dealTitle: string;
  /** Deal reference identifier */
  @Input() referenceId: string;
  /** Flag to show vendor specific information */
  @Input() isVendorVersion: boolean;
  /** Details of the user who created the deal */
  @Input() createdByName: string;
  @Input() createdByEmail: string;
  @Input() createdTime: any;
  @Input() accountSubType: string;
  @Input() partnerType: string;
  /** Lead related information */
  @Input() lead: any;
  @Input() showLeadInfo: boolean;
  @Input() detailsTitle: string;
  /** Deal object */
  @Input() deal: any;
  /** enable/disable text area editing */
  @Input() editTextArea: boolean;
  /** module type for chat component */
  @Input() moduleType: string;
  @Input() partnerStatus: string;

  /** expose deal constants to the template */
  DEAL_CONSTANTS = DEAL_CONSTANTS;

  @Output() modalClose = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() { }

  addCommentModalClose() {
    this.modalClose.emit();
  }

}
