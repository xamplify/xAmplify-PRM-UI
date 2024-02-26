import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-confirm-unpublish-tracks-or-playbooks-model-popup',
  templateUrl: './confirm-unpublish-tracks-or-playbooks-model-popup.component.html',
  styleUrls: ['./confirm-unpublish-tracks-or-playbooks-model-popup.component.css']
})
export class ConfirmUnpublishTracksOrPlaybooksModelPopupComponent implements OnInit {

  @Output()
  eventOutput = new EventEmitter();
  @Output()
  cancelEmitter = new EventEmitter();

  @Input()
  selectedTrackOrPlayBookId:number;
  @Input()
  isPublishing:boolean;
  selectedOption : boolean;
  @Input() type:string;
  
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.referenceService.openModalPopup("unpublished-modal");
  }

  modelUnpublishPopup(){
    let eventEmitter = {};
    eventEmitter['selectedTrackOrPlayBookId']=this.selectedTrackOrPlayBookId;
    eventEmitter['isPublishing'] = this.isPublishing;
    this.eventOutput.emit(eventEmitter);
  }

  closePopUp(){
    this.cancelEmitter.emit();
  }
}
