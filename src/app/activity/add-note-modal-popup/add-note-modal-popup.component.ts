import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NoteService } from '../services/note-service';
import { NoteDTO } from '../models/note-dto';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';

declare var $: any, CKEDITOR:any;

@Component({
  selector: 'app-add-note-modal-popup',
  templateUrl: './add-note-modal-popup.component.html',
  styleUrls: ['./add-note-modal-popup.component.css'],
  providers: [NoteService, Properties]
})
export class AddNoteModalPopupComponent implements OnInit {

  @Input() contactId: any;
  @Input() actionType: any;
  @Input() editNote:NoteDTO;
  @Input() noteId:number;
  @Input() isReloadTab:boolean;
  @Output() notifySubmitSuccess= new EventEmitter();
  @Output() notifyClose= new EventEmitter();
  @Output() notifyUpdateSuccess= new EventEmitter();

  note: NoteDTO = new NoteDTO();
  customResponse: CustomResponse = new CustomResponse();
  publicNotes: boolean = false;
  ngxLoading:boolean = false;
  isEdit: boolean = false;
  isPreview: boolean = false;
  title:string = 'Add';
  isValidNote: boolean = false;
  ckeConfig: any;

  constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public noteService: NoteService, public properties:Properties) {}

  ngOnInit() {
    this.ckeConfig = this.properties.ckEditorConfig;
    const isEditMode = this.actionType === 'edit';
    const isViewMode = this.actionType === 'view';
    if (isEditMode || isViewMode) {
      this.isEdit = isEditMode;
      this.isPreview = isViewMode;
      this.isValidNote = isEditMode;
      this.title = isEditMode ? 'Edit':'View';
      this.fetchNoteById();
    }
    this.referenceService.openModalPopup('addNoteModalPopup');
  }
  ngOnDestroy(){
    this.referenceService.closeModalPopup('addNoteModalPopup');
  }
  fetchNoteById() {
    this.ngxLoading = true;
    this.noteService.fetchNoteById(this.noteId).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.note = data.data;
          this.publicNotes = this.note.visibility == 'PUBLIC';
        }
        this.ngxLoading = false;
      }, error => {
        this.customResponse = new CustomResponse('ERROR', "Opp's something went wrong", true);
        this.ngxLoading = false;
      }
    );
  }

  closeNoteModalPopup(){
    // $('#addNoteModalPopup').modal('hide');
    this.referenceService.closeModalPopup('addNoteModalPopup');
    this.notifyClose.emit();
  }

  save() {
    this.ngxLoading = true;
    this.note.associationType = 'CONTACT';
    this.note.contactId = this.contactId;
    this.note.visibility = this.publicNotes ? 'PUBLIC':'PRIVATE';
    this.note.pinned = false;
    this.noteService.saveNote(this.note).subscribe(
      response => {
        let statusCode = response.statusCode;
        if (statusCode == 200) {
          this.closeNoteModalPopup();
          this.notifySubmitSuccess.emit(!this.isReloadTab);
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
    this.note.visibility = this.publicNotes ? 'PUBLIC':'PRIVATE';
    this.noteService.updateNote(this.note).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.closeNoteModalPopup();
          this.notifyUpdateSuccess.emit(!this.isReloadTab);
        } else {
          this.closeNoteModalPopup();
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

  onChangeVisibility(event) {
    this.publicNotes = event;
  }
   
}
