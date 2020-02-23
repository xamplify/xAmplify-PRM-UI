import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { EditContactsComponent } from 'app/contacts/edit-contacts/edit-contacts.component';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';

declare var $:any;

@Component({
  selector: 'app-save-as',
  templateUrl: './save-as.component.html',
  styleUrls: ['./save-as.component.css']
})
export class SaveAsComponent implements OnInit {
  @Input() listName: any;
  @Input() saveAsListName:any;
  @Output() notifyParentSaveAs: EventEmitter<any>;
  saveAsError = '';
  /********Legal Basis******/
  @Input() gdprInput :any;
  legalBasisOptions :Array<LegalBasisOption>;
  public fields: any;
  public placeHolder: string = 'Select Legal Basis Options';
  isValidLegalOptions = true;
  gdprStatus = true;
  selectedLegalBasisOptions = [];

  constructor(public referenceService:ReferenceService, public editContactsComponent:EditContactsComponent, public xtremandLogger:XtremandLogger) {
    this.notifyParentSaveAs = new EventEmitter();
    
   }

  saveAsInputChecking(){
    try{
      this.saveAsError = "";
      this.isValidLegalOptions = true;
     const names = this.referenceService.namesArray;
     const inputName = this.saveAsListName.toLowerCase().replace( /\s/g, '' );
     this.validateLegalBasisOptions();
        if ( $.inArray( inputName, names ) > -1 ) {
            this.saveAsError = 'This list name is already taken.';
        } else {
            if ( this.saveAsListName !== "" && this.saveAsListName.length < 250 ) {
                if(this.isValidLegalOptions){
                    this.editContactsComponent.saveDuplicateContactList(this.saveAsListName,this.selectedLegalBasisOptions);
                    $('#saveAsModal').modal('hide');
                    this.notifyParentSaveAs.emit('success');
                }
              
            }
            else if(this.saveAsListName === ""){  this.saveAsError = 'List Name is Required.';  }
            else{ this.saveAsError = 'You have exceeded 250 characters!'; }
          }
        }catch(error){
          $('#saveAsModal').modal('hide');
          this.xtremandLogger.error( error, "Add partner Component", "saveAsInputChecking()" );
        }
    }
    closeModal(){
      this.notifyParentSaveAs.emit('closedModal');
    }

  ngOnInit() {
      this.fields = { text: 'name', value: 'id' };
      if(this.gdprInput!=undefined){
          this.legalBasisOptions = this.gdprInput.legalBasisOptions;
          this.gdprStatus = this.gdprInput.gdprStatus;
      }
    $('#saveAsModal').modal('show');
  }
  
  validateLegalBasisOptions(){
      if(this.gdprStatus && this.selectedLegalBasisOptions.length==0){
          this.isValidLegalOptions = false;
      }else{
          this.isValidLegalOptions = true;
      }
  }
  

}
