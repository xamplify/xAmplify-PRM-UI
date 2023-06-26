import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

declare var $:any;
@Component({
  selector: 'app-xamplify-video-player',
  templateUrl: './xamplify-video-player.component.html',
  styleUrls: ['./xamplify-video-player.component.css']
})
export class XamplifyVideoPlayerComponent implements OnInit {

  modalPopupId= "xamplify-video-player-modal-popup";
  videoTitle = "This is Video Title";

  constructor(public referenceService:ReferenceService) { }


  ngOnInit() {
    this.referenceService.openModalPopup(this.modalPopupId);
  }

  close(){
    this.referenceService.closeModalPopup(this.modalPopupId);
  }

}
