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
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

declare var $:any;

@Component({
  selector: 'app-save-as',
  templateUrl: './save-as.component.html',
  styleUrls: ['./save-as.component.css'],
  providers: [CallActionSwitch,Properties]
})
export class SaveAsComponent implements OnInit {
  @Input() listName: any;
  @Input() saveAsListName:any;
  @Input() isPartner: boolean;
  @Input() showGDPR:boolean;
  @Input() isFormList;
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
  assignLeads : boolean = false;



  constructor(public referenceService:ReferenceService, public editContactsComponent:EditContactsComponent, public xtremandLogger:XtremandLogger,
          public callActionSwitch: CallActionSwitch, public contactService: ContactService, private router:Router, 
          public authenticationService : AuthenticationService,public properties:Properties) {
    this.notifyParentSaveAs = new EventEmitter();
   this.model.isPublic = this.contactService.publicList;

    if ( this.router.url.includes( 'home/contacts' ) ) {
        this.module = 'contacts';
    } else if( this.router.url.includes( 'home/assignleads' ) ){
        this.module = 'leads';
        this.assignLeads = true;
    }else {
      this.module = this.authenticationService.partnerModule.customName;
    }
    

   }

  saveAsInputChecking() {
      if (this.listName === 'Lead'){
    	  this.saveAsLeadsInputChecking();
      } else {
          try {
              if(this.saveAsListName!=undefined){
                this.saveAsListName = this.saveAsListName.trim();
                this.saveAsError = "";
                this.isValidLegalOptions = true;
                const names = this.referenceService.namesArray;
                const inputName = $.trim(this.saveAsListName.toLowerCase().replace(/\s/g, ''));
				const activeMasterPartnerList = $.trim(this.properties.activeMasterPartnerList.toLowerCase().replace(/\s/g, ''));
				const inActiveMasterPartnerList = $.trim(this.properties.inActiveMasterPartnerList.toLowerCase().replace(/\s/g, ''));
                this.validateLegalBasisOptions();
                if ($.inArray(inputName, names) > -1) {
                    this.saveAsError = 'This group name is already taken.';
                }else if(inputName==activeMasterPartnerList || inputName==inActiveMasterPartnerList){
					this.saveAsError = 'This list name cannot be added';
				} else {
                    if (this.saveAsListName !== "" && this.saveAsListName.length < 250) {
                        if (this.isValidLegalOptions) {
                            this.editContactsComponent.saveDuplicateContactList(this.saveAsListName, this.selectedLegalBasisOptions, this.model.isPublic);
                            $('#saveAsModal').modal('hide');
                            this.notifyParentSaveAs.emit('success');
                        }
                    }
                    else if (this.saveAsListName === "") 
                        { 
                            if (this.module === 'Partner') {
                                this.saveAsError = 'Group Name is Required.';
                            } else{
                                this.saveAsError = 'List Name is Required.';

                            }
                }
                    else { this.saveAsError = 'You have exceeded 250 characters!'; }
                }
              }else{
                this.referenceService.showSweetAlertErrorMessage("Invalid Input Name:-"+this.saveAsListName);
              }
          } catch (error) {
              this.referenceService.showSweetAlertErrorMessage("Invalid Input Name:-"+this.saveAsListName);
              this.xtremandLogger.error(error, "Add partner Component", "saveAsInputChecking()");
          }
      }
    }

  saveAsLeadsInputChecking() {
      try {
          if(this.saveAsListName!=undefined){
            this.saveAsListName = this.saveAsListName.trim();
            const name = this.saveAsListName;
            this.validateLegalBasisOptions();
            const inputName = $.trim(name.toLowerCase().replace(/\s/g, ''));
            const activeMasterPartnerList = $.trim(this.properties.activeMasterPartnerList.toLowerCase().replace(/\s/g, ''));
            const inActiveMasterPartnerList = $.trim(this.properties.inActiveMasterPartnerList.toLowerCase().replace(/\s/g, ''));
            if(inputName==activeMasterPartnerList || inputName==inActiveMasterPartnerList){
                this.saveAsError = 'This list name cannot be added';
            }else  if (name !== "" && name.length < 250) {
                this.editContactsComponent.validateLegalBasisOptions();
                if (this.isValidLegalOptions) {
                    this.saveDuplicateLeadList(this.saveAsListName, this.selectedLegalBasisOptions, this.model.isPublic);
                }
            }
            else if (name == "") { this.saveAsError = 'List Name is Required.'; }
            else { this.saveAsError = 'You have exceeded 250 characters!'; }
          }else{
            this.referenceService.showSweetAlertErrorMessage("Invalid Input Name:-"+this.saveAsListName);
          }
          
      } catch (error) {
         this.referenceService.showSweetAlertErrorMessage("Invalid Input Name:-"+this.saveAsListName);
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
              this.contactListObject.contactType = 'CONTACT';
              this.contactListObject.publicList = true;
              this.contactListObject.socialNetwork = 'MANUAL';
              this.contactListObject.alias = null;
              this.contactListObject.synchronisedList= false;
              
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
            	  for (let i = 0; i < this.editContactsComponent.selectedContactForSave.length; i++) {
                      this.editContactsComponent.selectedContactForSave[i].legalBasis = selectedLegalBasisOptions;
                  }
                  const map = {};
                  const newArray = [];
                  this.editContactsComponent.selectedContactForSave.forEach(el => {
                     if(!map[JSON.stringify(el)]){
                        map[JSON.stringify(el)] = true;
                        newArray.push(el);
                  }
               });
               this.editContactsComponent.selectedContactForSave = newArray;
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
                  this.loading = false;
                  if (data.statusCode === 401) {
                      this.saveAsError = data.message;
                      //this.editContactsComponent.selectedContactForSave = [];
                  } else if (data.statusCode === 402) {
                      this.saveAsError = data.message;
                      //this.editContactsComponent.selectedContactForSave = [];
                  } else {
                      $('#saveAsModal').modal('hide');
                      this.saveAsError = '';
                      this.saveAsListName = '';
                      this.saveAsListName = undefined;
                      this.editContactsComponent.selectedContactForSave = [];
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
            if(this.saveAsListName!=undefined){
                this.saveAsError = "";
                const names = this.referenceService.namesArray;
                const inputName = $.trim(this.saveAsListName.toLowerCase().replace( /\s/g, '' ));
                const activeMasterPartnerList = $.trim(this.properties.activeMasterPartnerList.toLowerCase().replace(/\s/g, ''));
				const inActiveMasterPartnerList = $.trim(this.properties.inActiveMasterPartnerList.toLowerCase().replace(/\s/g, ''));
                   if ( inputName!= $.trim(this.existingListName.toLowerCase().replace( /\s/g, '' )) && $.inArray( inputName, names ) > -1 ) {
                       this.saveAsError = 'This list name is already taken.';
                   }else if(inputName==activeMasterPartnerList ||inputName==inActiveMasterPartnerList ){
                        this.saveAsError = 'This list name cannot be added';
                   }
                    else {
                       if ( this.saveAsListName !== "" && this.saveAsListName.length < 250 ) {
                            this.updateContactListNameType(this.saveAsListName, this.model.isPublic );
                       }
                       else if(this.saveAsListName === ""){  
                           this.saveAsError = 'List Name is Required.'; 
                         }
                       else{
                            this.saveAsError = 'You have exceeded 250 characters!'; 
                        }
                     }
            }else{
                this.referenceService.showSweetAlertErrorMessage("Invalid Input Name:-"+this.saveAsListName);
            }
	     
	        }catch(error){
                this.referenceService.showSweetAlertErrorMessage("Invalid Input Name:-"+this.saveAsListName);
	          this.xtremandLogger.error( error, "Add partner Component", "saveAsInputChecking()" );
	        }
	    }
  
  updateContactListNameType(newContactListName: string, isPublic: boolean) {
      try {
          var object = {
              "id": this.editContactsComponent.selectedContactListId,
              "name": newContactListName,
              "publicList": isPublic,
              "isPartnerUserList": this.isPartner,
              "assignedLeadsList": this.assignLeads
          }
          this.editContactsComponent.addContactModalClose();
          this.contactService.updateContactListName(object)
              .subscribe(
              (data: any) => {
                  if (data.statusCode == 200) {
                      console.log(data);
                      this.editContactsComponent.selectedContactListName = newContactListName;
                      $('#saveAsModal').modal('hide');
                      if (this.assignLeads) {
                          this.editContactsComponent.customResponse = new CustomResponse('SUCCESS', this.editContactsComponent.properties.LEAD_LIST_NAME_UPDATE_SUCCESS, true);
                      } else if (this.isPartner) {
                          let message = "Your "+this.authenticationService.partnerModule.customName+" list name has been updated successfully";
                          this.editContactsComponent.customResponse = new CustomResponse('SUCCESS', message, true);
                      } else {
                          this.editContactsComponent.customResponse = new CustomResponse('SUCCESS', this.editContactsComponent.properties.CONTACT_LIST_NAME_UPDATE_SUCCESS, true);
                      }
                      this.notifyParentSaveAs.emit('success');
                  } else if (data.statusCode == 1001) {
                      this.saveAsError = 'This list name is already taken.';

                  }
              },
              error => this.xtremandLogger.error(error),
              () => this.xtremandLogger.info("EditContactsComponent updateContactListName() finished")
              )
      } catch (error) {
          this.xtremandLogger.error(error, "editContactComponent", "listNameUpdating()");
      }
  }
  
    closeModal(){
      this.notifyParentSaveAs.emit('closedModal');
    }

  ngOnInit() {
    if(this.listName=="Partner"){
        this.listName = this.authenticationService.partnerModule.customName;
    }
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

    changeStatus(event) {
        this.contactService.publicList = event;
        this.model.isPublic = this.contactService.publicList;

    }


}
