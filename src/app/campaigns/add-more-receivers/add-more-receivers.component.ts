import { Component, OnInit,Renderer, OnDestroy } from '@angular/core';
import { Campaign } from '../models/campaign';
import { CampaignService } from '../services/campaign.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ContactList } from '../../contacts/models/contact-list';
import { ReferenceService } from '../../core/services/reference.service';
import { ContactService } from '../../contacts/services/contact.service';
import { Properties } from '../../common/models/properties';
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { UserListPaginationWrapper } from 'app/contacts/models/userlist-pagination-wrapper';

declare var swal, $: any;

@Component({
  selector: 'app-add-more-receivers',
  templateUrl: './add-more-receivers.component.html',
  styleUrls: ['./add-more-receivers.component.css'],
  providers: [Pagination, HttpRequestLoader,Properties]

})
export class AddMoreReceiversComponent implements OnInit,OnDestroy {
   
	loggedInUserId: number = 0;
	vanityLoginDto : VanityLoginDto = new VanityLoginDto();
    listName: any;
    loadingData: boolean;
    title:string="Please Select List(s)";
    contactListLoader:HttpRequestLoader = new HttpRequestLoader();
    contactListDetailLoader:HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    sendingRequest = false;
    sendSuccess = false;
    responseMessage = "";
    responseImage = "";
    responseClass = "success";
    eventRedistributionMessage: string;
    /***************Contact List************************/
    isContactList:boolean = false;
    contactsPagination:Pagination = new Pagination();
    campaignContactLists: Array<ContactList>;
    numberOfContactsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' }
    ]
    contactItemsSize:any = this.numberOfContactsPerPage[0];
    selectedRowClass:string = "";
    selectedContactListIds = [];
    isHeaderCheckBoxChecked:boolean = false;
    emptyContactsMessage:string = "";
    contactSearchInput:string = "";
    contactListTabName:string = "";
    contactListSelectMessage:string = "";
    emptyContactListMessage:string = "No data found";
    showContactType:boolean = false;
    userListDTOObj = [];
    contactsUsersPagination:Pagination = new Pagination();
    selectedContactLists: any;
    id:number;
    previewContactListId : number;
    campaign:Campaign = new Campaign();
    expandedUserList: any;
	showExpandButton = false;
    contactListObject: ContactList;
    userListPaginationWrapper: UserListPaginationWrapper = new UserListPaginationWrapper();
  constructor(private campaignService: CampaignService, private router: Router, private xtremandLogger: XtremandLogger,
          public pagination: Pagination, private pagerService: PagerService,public authenticationService: AuthenticationService,public referenceService:ReferenceService,private contactService:ContactService,public properties:Properties,private renderer:Renderer) {
              this.referenceService.renderer = this.renderer;
              this.loggedInUserId = this.authenticationService.getUserId();
              if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
                  this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
                  this.vanityLoginDto.userId = this.loggedInUserId; 
                  this.vanityLoginDto.vanityUrlFilter = true;
               }
           }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    $('#new-list-modal').modal('hide');
    $('#usersModal').modal('hide');
}
  
  
  resetAllFields(){
      this.customResponse = new CustomResponse();
      this.contactsPagination  = new Pagination();
      this.selectedContactListIds = [];
      this.userListDTOObj = [];
      this.contactsUsersPagination = new Pagination();
      this.id = 0;
      this.previewContactListId = 0;
      this.isHeaderCheckBoxChecked =false;
      this.selectedRowClass = "";
      this.isContactList = false;
      this.campaignContactLists =new Array<ContactList>();
      this.contactListTabName = "";
      this.contactListSelectMessage = "";
      this.emptyContactListMessage = "No data found";
      this.showContactType = false;
      this.campaign = new Campaign();
      this.sendingRequest = false;
      this.sendSuccess = false;
      this.responseMessage = "";
      this.responseImage = "";
      this.responseClass = "";
  }
  showPopup(campaign:Campaign){
      this.resetAllFields();
      let modalId = "#new-list-modal";
      $('.modal .modal-body').css('overflow-y', 'auto');
      $(modalId).modal('show');
      $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
      this.contactsPagination.filterKey = "isPartnerUserList";
      this.contactsPagination.filterValue = false;
      this.contactsPagination.campaignId = campaign.campaignId;
      this.campaign.campaignId = campaign.campaignId;
      this.contactsPagination.addingMoreLists = true;
      if(this.eventRedistributionMessage){
          this.customResponse = new CustomResponse('INFO', this.eventRedistributionMessage, true);
      }
      this.loadCampaignContacts(this.contactsPagination);
      this.filterContacts('ALL');
  }
  
  eventHandler(event, type:string){
      if(event===13 && type==='contact'){ this.searchContactList();}
  }
  searchContactList(){
      this.contactsPagination.pageIndex = 1;
      this.contactsPagination.searchKey = this.contactSearchInput;
      if (this.contactsPagination.searchKey != undefined && this.contactsPagination.searchKey != null 
        && this.contactsPagination.searchKey.trim() != "") {
        this.showExpandButton = true;
    } else {
        this.showExpandButton = false;
    }
      this.loadCampaignContacts(this.contactsPagination);
  }
  
  loadCampaignContacts(contactsPagination:Pagination){
      this.contactListLoader.isHorizontalCss=true;
      this.referenceService.loading(this.contactListLoader, true);
      this.contactsPagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.contactsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
      
      this.campaignService.getContactListToInvite(this.authenticationService.getUserId(),this.contactsPagination).subscribe(
          (response: any) => {
              console.log(response);
              let data = response.data;
              this.campaignContactLists = data.list;
              console.log(this.campaignContactLists);
              contactsPagination.totalRecords = data.totalRecords;
              if(contactsPagination.filterBy!=null){
                  if(contactsPagination.filterBy==0){
                      contactsPagination.maxResults = data.totalRecords;
                  }
              }
              contactsPagination = this.pagerService.getPagedItems(contactsPagination, this.campaignContactLists);
              var contactIds = this.contactsPagination.pagedItems.map(function (a) { return a.id; });
              var items = $.grep(this.selectedContactListIds, function (element) {
                  return $.inArray(element, contactIds) !== -1;
              });
              if (items.length == contactIds.length) {
                  this.isHeaderCheckBoxChecked = true;
              } else {
                  this.isHeaderCheckBoxChecked = false;
              }
			this.referenceService.loading(this.contactListLoader, false);
          },
          (error: any) => {
              this.referenceService.loading(this.contactListLoader, false);
          });
  }
  
  getNumberOfContactItemsPerPage(items:any){
      try{
          $('#checkAllExistingContacts').prop("checked",false);
          this.contactItemsSize = items;
          this.getAllFilteredResults(this.contactsPagination);
      }catch(error){
          console.log(error, "getSelectedContacts","PublishContentComponent");
      }

  }
  getAllFilteredResults(pagination:Pagination){
      try{
          this.contactsPagination.pageIndex = 1;
          this.contactsPagination.filterBy = this.contactItemsSize.value;
          if(this.contactItemsSize.value==0){
              this.contactsPagination.maxResults = this.contactsPagination.totalRecords;
          }else{
              this.contactsPagination.maxResults = this.contactItemsSize.value;
          }
          this.loadCampaignContacts(this.contactsPagination);
      }catch(error){
          console.log(error, "Get Filtered Contacts","Publish Content Component")
      }
  }

  highlightRow(contactList:any,event:any){
      let contactId = contactList.id;
      let isChecked = $('#'+contactId).is(':checked');
      if(isChecked){
          $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
          this.selectedContactListIds.push(contactId);
          this.userListDTOObj.push(contactList);
      }else{
          $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
          this.selectedContactListIds.splice($.inArray(contactId,this.selectedContactListIds),1);
          this.userListDTOObj = this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
      }
      this.contactsUtility();
      event.stopPropagation();
  }
  highlightContactRow(contactList:any,event:any,count:number,isValid:boolean){
    let contactId = contactList.id;
    if(isValid){
          this.emptyContactsMessage = "";
          if(count>0){
              let isChecked = $('#'+contactId).is(':checked');
              if(isChecked){
                  //Removing Highlighted Row
                  $('#'+contactId).prop( "checked", false );
                  $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
                  this.selectedContactListIds.splice($.inArray(contactId,this.selectedContactListIds),1);
                  this.userListDTOObj= this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
                }else{
                //Highlighting Row
                $('#'+contactId).prop( "checked", true );
                $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
                this.selectedContactListIds.push(contactId);
                this.userListDTOObj.push(contactList);
            }
              this.userListDTOObj= this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
              this.contactsUtility();
              event.stopPropagation();
          }else{
              this.emptyContactsMessage = "Contacts are in progress";
          }

      }

  }
  contactsUtility(){
      var trLength = $('#user_list_tb tbody tr').length;
      var selectedRowsLength = $('[name="campaignContact[]"]:checked').length;
      if(selectedRowsLength>0){
          this.isContactList = true;
      }else{
          this.isContactList = false;
      }
      if(trLength!=selectedRowsLength){
          $('#checkAllExistingContacts').prop("checked",false)
      }else if(trLength==selectedRowsLength){
          $('#checkAllExistingContacts').prop("checked",true);
      }
  }

  checkAll(ev:any){
      if(ev.target.checked){
          $('[name="campaignContact[]"]').prop('checked', true);
          this.isContactList = true;
          let self = this;
          $('[name="campaignContact[]"]:checked').each(function(index){
              var id = $(this).val();
              self.selectedContactListIds.push(parseInt(id));
              self.userListDTOObj.push(self.contactsPagination.pagedItems[index]);
              console.log(self.selectedContactListIds);
              $('#campaignContactListTable_'+id).addClass('contact-list-selected');
           });
          this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
          if(this.selectedContactListIds.length==0){ this.isContactList = false; }
          this.userListDTOObj = this.referenceService.removeDuplicates( this.userListDTOObj );
      }else{
          $('[name="campaignContact[]"]').prop('checked', false);
          $('#user_list_tb tr').removeClass("contact-list-selected");
          if(this.contactsPagination.maxResults>30||(this.contactsPagination.maxResults==this.contactsPagination.totalRecords)){
              this.isContactList = false;
              this.selectedContactListIds = [];
          }else{
              this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
              let currentPageContactIds = this.contactsPagination.pagedItems.map(function(a) {return a.id;});
              this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
              this.userListDTOObj =  this.referenceService.removeDuplicatesFromTwoArrays(this.userListDTOObj, this.contactsPagination.pagedItems);
              if(this.selectedContactListIds.length==0){
                  this.isContactList = false;
                  this.userListDTOObj = [];
              }
          }

      }
      ev.stopPropagation();
  }

  setPagePagination(event:any){ 
      this.setPage(event.page, event.type);
      
  }
  setPage(pageIndex:number,module:string){
      if(module=="contacts"){
          this.contactsPagination.pageIndex = pageIndex;
          this.loadCampaignContacts(this.contactsPagination);
      }else if(module=="contactUsers"){
         this.contactsUsersPagination.pageIndex = pageIndex;
          this.loadUsers(this.id,this.contactsUsersPagination,this.listName);
      }

  }
  /*******************************Preview*************************************/
  contactListItems:any[];
    loadUsers(id:number,pagination:Pagination, ListName){
        this.contactListDetailLoader.isHorizontalCss=true;
        this.referenceService.loading(this.contactListDetailLoader, true);
        $('#users-modal-body').html('');
        $('#usersModal').modal({backdrop: 'static', keyboard: false});
       if(id==undefined){
            id=this.previewContactListId;
        }else if(id==0){
        	id = this.previewContactListId ;
        } else{
            this.previewContactListId = id;
        }
        this.listName = ListName;
        this.contactListObject = new ContactList;
		this.userListPaginationWrapper.pagination = pagination;
		this.contactListObject.id = id;
        this.contactListObject.name = this.listName;
        this.contactListObject.isPartnerUserList = false;
		this.userListPaginationWrapper.userList = this.contactListObject;
        
        this.contactService.loadUsersOfContactList(this.userListPaginationWrapper).subscribe(
                (data:any) => {
                    this.contactListItems = data.listOfUsers;
                    pagination.totalRecords = data.totalRecords;
                    this.contactsUsersPagination = this.pagerService.getPagedItems(pagination, this.contactListItems);
                    var html = "";
                    if( pagination.totalRecords>0){
                    html+= '<table  style="margin:0" class="table table-striped table-hover table-bordered" id="sample_editable_1">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th>EMAIL ID</th>'+
                                    '<th>FIRST NAME</th>'+
                                    '<th>LAST NAME</th>'+
                                '</tr>'+
                            '</thead>'+
                             '<tbody>';
                    $.each(this.contactsUsersPagination.pagedItems,function(index,value){
                        var firstName = value.firstName;
                        var lastName = value.lastName;
                        if(firstName==null || firstName=="null"){
                            firstName="";
                        }
                       if(lastName==null || lastName=="null"){
                           lastName = "";
                       }
                        html+= '<tr>';
                        if(value.validEmail){
                            html+= '<td style="color:#51ab35" title="This is a valid email address">'+value.emailId+'</td>';
                        }else{
                            html+= '<td style="color:red;" title="This is an invalid email address">'+value.emailId+'</td>';
                        }
                        
                        html+='<td>'+firstName+'</td>'+
                                    '<td>'+lastName+'</td>'
                                    '</tr>';
                    });
                     html+='</tbody>';
                     html+='</table>';
                     $('#users-modal-body').append(html);
                }else{
                    html += '<td class="alert alert-info" style="padding-left: 261px;padding-right: 261px;">' + this.properties.NO_RESULTS_FOUND + '</td>';
                    $('#users-modal-body').append(html);
                }
                   this.referenceService.loading(this.contactListDetailLoader, false);
                },
                error => {
                    this.referenceService.loading(this.contactListDetailLoader, false);
                    this.referenceService.showServerErrorMessage(this.contactListDetailLoader);
                },
                () => console.log( "loadUsersOfContactList() finished" )
            )
    }

    closeModelPopup(){
        this.contactsUsersPagination = new Pagination();
    }
    showContactsAlert(count:number){
        this.emptyContactsMessage = "";
        if(count==0){
            this.emptyContactsMessage = "No Contacts Found For This Contact List";
        }
    }
  
  send(){
      this.customResponse = new CustomResponse();
      if(this.selectedContactListIds.length>0){
          this.sendingRequest = true;
          this.campaign.userListIds = this.selectedContactListIds;
          this.campaign.userId = this.authenticationService.getUserId();
          this.campaign.scheduleCampaign ='SAVE';
          this.campaign.nurtureCampaign = true;
          this.campaign.channelCampaign = false;
          this.campaignService.sendEventToContactList(this.campaign).subscribe(
              (response: any) => {
                  if (response.access) {
                	  this.contactSearchInput = "";
                      this.sendingRequest = false;
                      this.sendSuccess = true;
                      this.responseMessage = response.message;
                      if (response.statusCode == 200) {
                          this.responseImage = "assets/images/event-success.png";
                          this.responseClass = "event-success";
                      } else {
                          this.responseImage = "assets/images/event-error.ico";
                          this.responseClass = "event-error";
                      }
                  } else {
                      this.authenticationService.forceToLogout();
                  }
              },
                  (error: any) => {
                      this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
                      this.sendingRequest = false;
                  });
          
          
      }else{
          this.customResponse = new CustomResponse( 'ERROR', 'Please select list', true );
      }
  }


closeMoreInvitesPopup(){
	this.contactSearchInput = "";
    $('#new-list-modal').modal('hide');
    this.resetAllFields();
}

viewMatchedContacts(userList: any) {		
    userList.expand = !userList.expand;		
    if (userList.expand) {
        if ((this.expandedUserList != undefined || this.expandedUserList != null)
         && userList != this.expandedUserList) {				
            this.expandedUserList.expand = false;				
        }			
        this.expandedUserList = userList;			
    }
}

filterContacts(filterType:string){
    this.contactsPagination.pageIndex = 1;
    this.contactsPagination.filterBy =filterType;
    this.loadCampaignContacts(this.contactsPagination);
}



}
