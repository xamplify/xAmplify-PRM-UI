import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { EditContactsComponent } from 'app/contacts/edit-contacts/edit-contacts.component';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { ContactService } from '../../contacts/services/contact.service';
import { Router } from '@angular/router';
import { UserUserListWrapper } from '../../contacts/models/user-userlist-wrapper';
import { User } from '../../core/models/user';
import { ContactList } from '../../contacts/models/contact-list';
import { AuthenticationService } from '../../core/services/authentication.service';


declare var $:any;

@Component({
  selector: 'app-save-as',
  templateUrl: './save-as.component.html',
  styleUrls: ['./save-as.component.css'],
  providers: [CallActionSwitch]
})
export class SaveAsComponent implements OnInit {
  @Input() listName: any;
  @Input() saveAsListName:any;
  @Input() isPartner: boolean;
  @Input() showGDPR:boolean;
  @Output() notifyParentSaveAs: EventEmitter<any>;
  public model: any = {};
  saveAsError = '';
  existingListName:any;
  /********Legal Basis******/
  @Input() gdprInput :any;
  legalBasisOptions :Array<LegalBasisOption>;
  public fields: any;
  public placeHolder: string = 'Select Legal Basis';
  isValidLegalOptions = true;
  gdprStatus = true;
  selectedLegalBasisOptions = [];
  isAssignLeads = false;
  module = '';
  contactListObject: ContactList;
  userUserListWrapper: UserUserListWrapper ;
  loading = false;



  constructor(public referenceService:ReferenceService, public editContactsComponent:EditContactsComponent, public xtremandLogger:XtremandLogger,
		  public callActionSwitch: CallActionSwitch, public contactService: ContactService, private router:Router, public authenticationService : AuthenticationService) {
    this.notifyParentSaveAs = new EventEmitter();
   this.model.isPublic = this.contactService.publicList;

    if ( this.router.url.includes( 'home/contacts' ) ) {
        this.module = 'contacts';
    } else if( this.router.url.includes( 'home/assignleads' ) ){
        this.module = 'leads';
    }else {
      this.module = 'partners';
    }

   }

  saveAsInputChecking() {
      if (this.listName === 'Lead'){
    	  this.saveAsLeadsInputChecking();
      } else {
          try {
              this.saveAsError = "";
              this.isValidLegalOptions = true;
              const names = this.referenceService.namesArray;
              const inputName = this.saveAsListName.toLowerCase().replace(/\s/g, '');
              this.validateLegalBasisOptions();
              if ($.inArray(inputName, names) > -1) {
                  this.saveAsError = 'This list name is already taken.';
              } else {
                  if (this.saveAsListName !== "" && this.saveAsListName.length < 250) {
                      if (this.isValidLegalOptions) {
                          this.editContactsComponent.saveDuplicateContactList(this.saveAsListName, this.selectedLegalBasisOptions, this.model.isPublic);
                          $('#saveAsModal').modal('hide');
                          this.notifyParentSaveAs.emit('success');
                      }

                  }
                  else if (this.saveAsListName === "") { this.saveAsError = 'List Name is Required.'; }
                  else { this.saveAsError = 'You have exceeded 250 characters!'; }
              }
          } catch (error) {
              $('#saveAsModal').modal('hide');
              this.xtremandLogger.error(error, "Add partner Component", "saveAsInputChecking()");
          }
      }
    }

  saveAsLeadsInputChecking() {
      try {
          const name = this.saveAsListName;
          this.validateLegalBasisOptions();
          const inputName = name.toLowerCase().replace(/\s/g, '');
          if (name !== "" && name.length < 250) {
              this.editContactsComponent.validateLegalBasisOptions();
              if (this.isValidLegalOptions) {
                  this.saveDuplicateLeadList(this.saveAsListName, this.selectedLegalBasisOptions, this.model.isPublic);
              }
          }
          else if (name == "") { this.saveAsError = 'List Name is Required.'; }
          else { this.saveAsError = 'You have exceeded 250 characters!'; }
      } catch (error) {
          $('#saveAsModal').modal('hide');
          this.xtremandLogger.error(error, "EditContactsComponent", "saveAsLeadsInputChecking()");
      }
  }
  
  saveDuplicateLeadList(name: string, selectedLegalBasisOptions: any, isPublic: boolean) {
      try {
          if (name != "") {
              this.userUserListWrapper = new UserUserListWrapper;
              this.contactListObject = new ContactList;
              this.contactListObject.name = name;
              this.contactListObject.isPartnerUserList = this.isPartner;
              this.contactListObject.contactType = 'ASSIGNED_LEADS_LIST';
              this.contactListObject.publicList = true;
              this.contactListObject.socialNetwork = 'MANUAL';
              if (this.editContactsComponent.selectedContactListIds.length == 0) {
                  let listUsers = [];
                  listUsers = this.editContactsComponent.totalListUsers;
                  $.each(listUsers, function(index, value: User) {
                      value.legalBasis = selectedLegalBasisOptions;
                  });
                  console.log(listUsers);
                  this.userUserListWrapper.users = listUsers;
                  this.userUserListWrapper.userList = this.contactListObject;
                  this.saveAssignedLeadsList(this.userUserListWrapper);
              } else {
                  for (let i = 0; i < this.editContactsComponent.selectedContactListIds.length; i++) {
                      for (let j = 0; j < this.editContactsComponent.totalListUsers.length; j++) {
                          if (this.editContactsComponent.selectedContactListIds[i] == this.editContactsComponent.totalListUsers[j].id) {
                              this.editContactsComponent.totalListUsers[j].legalBasis = selectedLegalBasisOptions;
                              this.editContactsComponent.selectedContactForSave.push(this.editContactsComponent.totalListUsers[j]);
                              break;
                          }
                      }
                  }
                  console.log(this.editContactsComponent.selectedContactForSave);
                  this.userUserListWrapper.users = this.editContactsComponent.selectedContactForSave;
                  this.userUserListWrapper.userList = this.contactListObject;
                  this.saveAssignedLeadsList(this.userUserListWrapper);
              }
          }
          else {
              this.xtremandLogger.error("AllContactComponent saveSelectedUsers() UserNotSelectedContacts");
          }
      } catch (error) {
          this.xtremandLogger.error(error, "editContactComponent", "SaveAsNewList()");
      }
  }

  saveAssignedLeadsList(userUserListWrapper: UserUserListWrapper) {
      this.loading = true;
      this.contactService.saveAssignedLeadsList(this.userUserListWrapper)
          .subscribe(
          data => {
              if (data.access) {
                  data = data;
                  this.loading = false;
                  if (data.statusCode === 401) {
                      this.saveAsError = data.message;
                  } else if (data.statusCode === 402) {
                      this.saveAsError = data.message;
                  } else {
                      $('#saveAsModal').modal('hide');
                      this.saveAsError = '';
                      this.saveAsListName = '';
                      this.saveAsListName = undefined;
                      this.router.navigateByUrl('/home/assignleads/manage')
                      this.contactService.saveAsSuccessMessage = "SUCCESS";
                      this.contactService.isLoadingList = false;
                  }
              } else {
                  this.authenticationService.forceToLogout();
                  localStorage.removeItem('isZohoSynchronization');
              }
          },
          (error: any) => {
              this.loading = false;
              $('#saveAsModal').modal('hide');
              this.xtremandLogger.error(error);
          },
          () => this.xtremandLogger.info("ManageContactsComponent saveAssignedLeadsList() finished")
          )
      }

  updateListType(){
	    try{
	      this.saveAsError = "";
	     // this.isValidLegalOptions = true;
	     const names = this.referenceService.namesArray;
	     const inputName = this.saveAsListName.toLowerCase().replace( /\s/g, '' );
	     //this.validateLegalBasisOptions();
	        if ( inputName!=this.existingListName  && $.inArray( inputName, names ) > -1 ) {
	            this.saveAsError = 'This list name is already taken.';
	        } else {
	            if ( this.saveAsListName !== "" && this.saveAsListName.length < 250 ) {
	                //if(this.isValidLegalOptions){
	                    this.editContactsComponent.updateContactListNameType(this.saveAsListName, this.model.isPublic );
	                    $('#saveAsModal').modal('hide');
	                    this.notifyParentSaveAs.emit('success');
	               // }

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
	  this.existingListName = this.saveAsListName;
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

  changeStatus(event){
      this.model.isPublic = event;

  }


}
