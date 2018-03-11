import { Component, OnInit, Input } from '@angular/core';
import { CallAction } from '../../models/call-action';
import { VideoUtilService } from '../../services/video-util.service';

@Component({
  selector: 'app-call-action',
  templateUrl: './call-action.component.html',
  styleUrls: ['./call-action.component.css','../../../../assets/css/video-css/call-action.css'],
  providers: [CallAction]
})
export class CallActionComponent implements OnInit {
  // @Input() selectedVideo: any
  // @Input() fullScreenMode: boolean;
  
  constructor(public videoUtilService: VideoUtilService, public callAction: CallAction) { }

//   setCallActionValues(){
//     this.callAction.isFistNameChecked = this.selectedVideo.name; // need  the value from server
//     this.callAction.isSkipChecked = this.selectedVideo.skip; // need to get the value from server
  
//   }
//   checkCallToActionAvailable() {
//     if (this.selectedVideo.startOfVideo === true && this.selectedVideo.callACtion === true) {
//         this.callAction.overLayValue = 'StartOftheVideo';
//         this.callAction.videoOverlaySubmit = 'PLAY';
//     } else if (this.selectedVideo.endOfVideo === true && this.selectedVideo.callACtion === true) {
//         this.callAction.overLayValue = 'EndOftheVideo';
//         this.callAction.videoOverlaySubmit = 'SUBMIT';
//     } else {
//         this.callAction.overLayValue = 'removeCallAction';
//     }
// }
// checkingCallToActionValues() {
//   if (this.callAction.isFistNameChecked === true && this.videoUtilService.validateEmail(this.callAction.email_id)
//       && this.callAction.firstName.length !== 0 && this.callAction.lastName.length !== 0) {
//       this.callAction.isOverlay = false;
//       console.log(this.callAction.email_id + 'mail ' + this.callAction.firstName + ' and last name ' + this.callAction.lastName);
//   } else if (this.callAction.isFistNameChecked === false && this.videoUtilService.validateEmail(this.callAction.email_id)) {
//       this.callAction.isOverlay = false;
//   } else { this.callAction.isOverlay = true; }
// }
  ngOnInit() {
    // this.setCallActionValues();
    // this.checkCallToActionAvailable();
  }

}
