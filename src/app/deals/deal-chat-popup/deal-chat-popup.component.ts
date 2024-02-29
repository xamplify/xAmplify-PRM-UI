import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var swal, $, videojs: any;

@Component({
  selector: 'app-deal-chat-popup',
  templateUrl: './deal-chat-popup.component.html',
  styleUrls: ['./deal-chat-popup.component.css'],
  providers: [ HttpRequestLoader],
})
export class DealChatPopupComponent implements OnInit {

  @Input() deal: any;
  @Input() lead: any;
  @Output() isCommentSection = new EventEmitter<any>();
  //XNFR-426
  @Input() editTextArea: boolean;

  campaignName: String;
  dealTitle: String;
  leadName: String;
  createdByEmail: String;
  createdByName: String;
  createdTime: String;
  moduleType: String;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

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
    } else if (this.lead != undefined) {
      this.moduleType = "lead";
      this.campaignName = this.lead.campaignName;
      this.dealTitle = null;
      //this.leadName = this.lead.title;
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
