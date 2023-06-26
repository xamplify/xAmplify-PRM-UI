import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
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
  selectedVideo:any;
  fullScreenMode =false;
  @Output() xamplifyVideoPlayerEmitter = new EventEmitter();

  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService) { }


  ngOnInit() {
    this.referenceService.openModalPopup(this.modalPopupId);
  }

  close(){
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.callEmitter();
  }

  callEmitter(){
    this.xamplifyVideoPlayerEmitter.emit();
  }

}
