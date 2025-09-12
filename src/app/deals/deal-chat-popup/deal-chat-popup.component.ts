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

  
  constructor() { }

  ngOnInit() {     
    
  }
  ngOnDestroy(){
  
  }
  addCommentModalClose()
  {
    
  }

}
