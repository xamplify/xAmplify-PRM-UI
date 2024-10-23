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
  @Input() editNote:NoteDTO;
  @Input() isReloadTab:boolean;
  @Output() notifySuccess= new EventEmitter();
  @Output() notifyClose= new EventEmitter();

  isCkeditorLoaded: boolean;
  note: NoteDTO = new NoteDTO();
  loggedInUserId: number;
  customResponse: CustomResponse = new CustomResponse();
  publicNotes: boolean = false;
  ngxLoading:boolean = false;
  isEdit: boolean = false;
  isPreview: boolean = false;
  title:string = 'Add';
  isValidNote: boolean = false;

  constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public noteService: NoteService, public callActionSwitch: CallActionSwitch) {
   }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.callActionSwitch.size = 'normal';
    this.referenceService.openModalPopup('addNoteModalPopup');
    if (this.actionType == 'edit') {
      this.isEdit = true;
      this.title = 'Edit';
      this.note = this.editNote;
      this.publicNotes = this.editNote.visibility == 'PUBLIC';
    } else if (this.actionType == 'view') {
      this.isPreview = true;
      this.title = 'View';
      this.note = this.editNote;
      this.publicNotes = this.editNote.visibility == 'PUBLIC';
    }
  }

  closeNoteModalPopup(){
    $('#addNoteModalPopup').modal('hide');
    this.notifyClose.emit();
  }

  save() {
    this.ngxLoading = true;
    this.note.associationType = 'CONTACT';
    this.note.contactId = this.selectedContact.id;
    this.note.loggedInUserId = this.loggedInUserId;
    if (this.publicNotes) {
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
          this.notifySuccess.emit(!this.isReloadTab);
        } else {
          this.closeNoteModalPopup();
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    );
   }

   publicVsPrivateNoteStatusChange(event: any) {
    this.note.publicNotes = event;
   }

   updateNote() {
    this.ngxLoading = true;
    if (this.publicNotes) {
      this.note.visibility = 'PUBLIC';
    } else {
      this.note.visibility = 'PRIVATE';
    }
    this.note.loggedInUserId = this.loggedInUserId;
    this.noteService.updateNote(this.note).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.closeNoteModalPopup();
          this.notifySuccess.emit(!this.isReloadTab);
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
   }

   validateNote() {
    if (this.note.title != undefined && this.note.content != undefined 
      && this.note.title.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.note.content.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
      this.isValidNote = true;
    } else {
      this.isValidNote = false;
    }
  }
   
}
