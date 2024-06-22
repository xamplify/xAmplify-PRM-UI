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

  readonly DEAL_CONSTANTS = DEAL_CONSTANTS;
  @Input() deal: any;
  @Input() lead: any;
  @Output() isCommentSection = new EventEmitter<any>();
  @Input() isVendorVersion = false;
  //XNFR-426
  @Input() editTextArea: boolean;

  campaignName: String;
  dealTitle: String;
  referenceId : String;
  leadName: String;
  createdByEmail: String;
  createdByName: String;
  createdTime: String;
  moduleType: String;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  showLeadInfo = false;
  constructor() { }

  ngOnInit() {     
    if (this.deal != undefined) {
      this.moduleType = "deal";
      this.campaignName = this.deal.campaignName;
      this.dealTitle = this.deal.title;
      this.leadName = null;
      this.createdByEmail = this.deal.createdByEmail;
      this.createdByName = this.deal.createdByName;
      this.createdTime = this.deal.createdTime;
      this.referenceId = this.deal.referenceId
      let leadDetails = this.deal['associatedContact'];
      if(leadDetails!=undefined){
       this.lead = leadDetails;
       this.lead.company = leadDetails.contactCompany;
       this.showLeadInfo = true;
      }
    } else if (this.lead != undefined) {
      this.moduleType = "lead";
      this.campaignName = this.lead.campaignName;
      this.dealTitle = null;
      this.createdByEmail = this.lead.createdByEmail;
      this.createdByName = this.lead.createdByName;
      this.createdTime = this.lead.createdTime;
    }  
    $('#chatModelPopup').modal('show');  
  }

  addCommentModalClose()
  {
    this.isCommentSection.emit(false);
    $('#chatModelPopup').modal('hide');
  }

}
