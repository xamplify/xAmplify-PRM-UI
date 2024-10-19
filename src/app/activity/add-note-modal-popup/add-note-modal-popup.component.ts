import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NoteService } from '../services/note-service';
import { NoteDTO } from '../models/note-dto';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { CustomResponse } from 'app/common/models/custom-response';

declare var $: any;

@Component({
  selector: 'app-add-note-modal-popup',
  templateUrl: './add-note-modal-popup.component.html',
  styleUrls: ['./add-note-modal-popup.component.css'],
  providers: [NoteService, CallActionSwitch]
})
export class AddNoteModalPopupComponent implements OnInit {

  @Input() selectedContact: any;
  @Input() actionType: any;
  @Output() notifySuccess= new EventEmitter();
  @Output() notifyClose= new EventEmitter();

  isCkeditorLoaded: boolean;
  note: NoteDTO = new NoteDTO();
  loggedInUserId: number;
  customResponse: CustomResponse = new CustomResponse();

  constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public noteService: NoteService, public callActionSwitch: CallActionSwitch) {
   }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.note.loggedInUserId = this.loggedInUserId;
    this.callActionSwitch.size = 'normal';
    this.note.publicNotes = false;
    this.referenceService.openModalPopup('addNoteModalPopup');
  }

  closeNoteModalPopup(){
    $('#addNoteModalPopup').modal('hide');
    this.notifyClose.emit();
  }

  save() {
    this.note.associationType = 'CONTACT';
    this.note.contactId = this.selectedContact.id;
    if (this.note.publicNotes) {
      this.note.visibility = 'PUBLIC';
    } else {
      this.note.visibility = 'PRIVATE';
    }
    this.note.pinned = false;
    this.noteService.saveOrUpdateNote(this.note, true).subscribe(
      response => {
        let statusCode = response.statusCode;
        let data = response.data;
        if (statusCode == 200) {
          this.closeNoteModalPopup();
          this.notifySuccess.emit();
        } else {
          this.closeNoteModalPopup();
        }
      }
    );
   }

   publicVsPrivateNoteStatusChange(event: any) {
    this.note.publicNotes = event;
   }
   
}
