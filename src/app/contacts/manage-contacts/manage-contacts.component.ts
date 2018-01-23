import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { Criteria } from '../models/criteria';
import { ContactsByType } from '../models/contacts-by-type';
import { User } from '../../core/models/user';
import { CustomeResponse } from '../models/response';
import { Router, NavigationExtras } from "@angular/router";
import { Response } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SocialContact } from '../models/social-contact';
import { UserListIds } from '../models/user-listIds';
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

declare var swal: any;
declare var $: any;
declare var Metronic: any;
declare var Layout: any;
declare var Demo: any;
declare var Portfolio: any;
declare let jsPDF;

@Component( {
    selector: 'app-manage-contacts',
    templateUrl: './manage-contacts.component.html',
    providers: [SocialContact, Pagination]
})

export class ManageContactsComponent implements OnInit {
    public show: boolean = false;
    public deleteUserSucessMessage: boolean = false;
    public socialContact: SocialContact;
    public googleSynchronizeButton: boolean;
    public storeLogin: any;
    contactsNotSelectedError: boolean = false;
    contactListObject: ContactList;
    criteria = new Criteria();
    criterias = new Array<Criteria>();
    filterValue: any;
    
    hasContactRole:boolean = false;
    loggedInUserId = 0;
    hasAllAccess = false;
    
    selectedContactListIds = [];
    selectedInvalidContactIds = [];
    paginationAllData = [];
    selectedAllContactUsers = new Array<User>();
    isHeaderCheckBoxChecked:boolean = false;
    public contactLists: Array<ContactList>;
    selectedContactListId: number;
    selectedContactListName: string;
    uploadedUserId: number;
    showAll: boolean;
    showEdit: boolean;
    public httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    
    contactCountLoad: boolean = false;
    isSegmentation: boolean = false;
    isSegmentationErrorMessage: boolean;
    
    listContactData: boolean = true;
    response: CustomeResponse = new CustomeResponse();
    invalidRemovableContacts = [];
    allselectedUsers = [];
    isInvalidHeaderCheckBoxChecked:boolean = false;
    invalidDeleteSucessMessage: boolean;
    invalidDeleteErrorMessage: boolean = false;
    
    public invalidIds: Array<UserListIds>;
    isShowDetails = false;
    
    contactsByType: ContactsByType = new ContactsByType();
    downloadDataList = [];
    
    /*
     * Display all the contactLists in manage contacts page by default.
       If 'showListOfContactList' is set to false,display category wise contacts.
    */
    showListOfContactList: boolean = true; 
    
    showAllContactData: boolean = false;
    showManageContactData: boolean = true;
    public contactListName: string;
    public model: any = {};
    public removeIds: number;
    public alias: any;
    public contactType: string;
    selectedDropDown : string;
    public userName: string;
    public password: string;
    public getZohoConatacts: any;
    public zContacts: Set<SocialContact>;
    public userListIds: Array<UserListIds>;
    public searchKey: string;
    sortingName: string = null;
    sortcolumn: string = null;
    sortingOrder: string = null;
    noContactsFound : boolean;
    public isCategoryThere: boolean;
    public searchDisable = true;
    users: User[];
    access_token: string;
    pager: any = {};
    pagedItems: any[];
    Campaign : string;
    names:string[]=[];
    isValidContactName:boolean;
    noSaveButtonDisable : boolean;
    public totalRecords: number;
    public zohoImage: string = 'assets/admin/pages/media/works/zoho.png';
    public googleImage: string = 'assets/admin/pages/media/works/gl.jpg';
    public salesforceImage: string = 'assets/admin/pages/media/works/sf.jpg';
    public normalImage: string = 'assets/admin/pages/media/works/img1.jpg';
    public currentContactType: string = null;
    

    sortOptions = [
        { 'name': 'Sort By', 'value': '', 'for': '' },
        { 'name': 'Name(A-Z)', 'value': 'name-ASC', 'for': 'contactList' },
        { 'name': 'Name(Z-A)', 'value': 'name-DESC', 'for': 'contactList' },
        { 'name': 'Created Time(ASC)', 'value': 'createdTime-ASC', 'for': 'contactList' },
        { 'name': 'Created Time(DESC)', 'value': 'createdTime-DESC', 'for': 'contactList' },
        
        { 'name': 'Email(A-Z)', 'value': 'emailId-ASC', 'for': 'contacts' },
        { 'name': 'Email(Z-A)', 'value': 'emailId-DESC', 'for': 'contacts' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC', 'for': 'contacts' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC', 'for': 'contacts' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC', 'for': 'contacts' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC', 'for': 'contacts' },
    ];
    
    sortOptionsForPagination = [
                                { 'name': '10', 'value': '10'},
                                { 'name': '25', 'value': '25'},
                                { 'name': '50', 'value': '50'},
                                { 'name': 'ALL', 'value': 'ALL'},
                                ];
    sortOptionForPagination = this.sortOptionsForPagination[0];
    public sortOption: any = this.sortOptions[0];
    
    filterOptions = [
                        { 'name': 'Field Name*', 'value': ''},
                        { 'name': 'First Name', 'value': 'firstName'},
                        { 'name': 'Last Name', 'value': 'lastName'},
                        { 'name': 'Company', 'value': 'company'},
                        { 'name': 'Job Title', 'value': 'jobTitle'},
                        { 'name': 'Email Id', 'value': 'emailId'},
                        { 'name': 'Country', 'value': 'country'},
                        { 'name': 'City', 'value': 'city'},
                        { 'name': 'Mobile Number', 'value': 'mobile Number'},
                        { 'name': 'Notes', 'value': 'notes'},
                        ];
    filterOption = this.filterOptions[0];
    
    filterConditions = [
                     { 'name': 'Condition*', 'value': ''},
                     { 'name': '=', 'value': 'eq'},
                     { 'name': 'like', 'value': 'like'},
                     ];
    filterCondition = this.filterConditions[0];
    
    isPartner: boolean;
    checkingContactTypeName: string;
    isListView = false;

    constructor(public contactService: ContactService, private authenticationService: AuthenticationService, private router: Router,
        private pagerService: PagerService, private pagination: Pagination, private referenceService: ReferenceService, public xtremandLogger:XtremandLogger ) {
       
        let currentUrl = this.router.url;
        if(currentUrl.includes('home/contacts')){
            this.isPartner = false;
            this.checkingContactTypeName = "Contact"
        }else{
            this.isPartner = true;  
            this.checkingContactTypeName = "Partner"
        }
        
        this.show = false;
        this.showAll = true;
        this.showEdit = false;
        this.showManageContactData = true;
        this.userListIds = new Array<UserListIds>();
        this.googleSynchronizeButton = false;
        this.socialContact = new SocialContact();
        this.socialContact.socialNetwork = "";
        this.xtremandLogger.info( "socialContact" + this.socialContact.socialNetwork );
        this.access_token = this.authenticationService.access_token;
        this.xtremandLogger.info( "successmessageLoad" + this.contactService.successMessage )
        if ( this.contactService.successMessage == true ) {
            this.setResponseDetails('SUCCESS', 'your contact List has been created successfully');
            this.xtremandLogger.info( "Success Message in manage contact pape" + this.show );
        }
        if ( this.contactService.deleteUserSucessMessage == true ) {
            this.setResponseDetails('ERROR', 'your contact List has been deleted successfully');
            this.xtremandLogger.info( " delete Success Message in manage contact pape" + this.show );
        }
        this.noSaveButtonDisable = true;
        
        this.hasContactRole = this.referenceService.hasRole(this.referenceService.roles.contactsRole);
        console.log("ContactRole"+this.hasContactRole);
        
        this.hasAllAccess = this.referenceService.hasAllAccess();
        this.loggedInUserId = this.authenticationService.getUserId();

    }
    
    contactListNameLength(title: string) {
        if (title.length > 25) { title = title.substring(0, 25) + '....'; }
        return title;
        }
    
    contactListUploadedNameLength(title: string) {
        if (title.length > 15) { title = title.substring(0, 15) + '....'; }
        return title;
        }

    loadContactLists( pagination: Pagination ) {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.pagination.maxResults = 12;
        this.pagination.filterKey = 'isPartnerUserList';
        this.pagination.filterValue = this.isPartner;
        this.contactService.loadContactLists( pagination )
            .subscribe(
            ( data: any ) => {
                this.xtremandLogger.info( data );
                this.contactLists = data.listOfUserLists;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.setResponseDetails('INFO', 'No Contact Lists found. Please add the contact lists.')
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.contactLists );
                }
                if (this.contactLists.length == 0) {
                    this.setResponseDetails('INFO', 'No Data lists found');
                    this.pagedItems = null ;
                 }
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info( "MangeContactsComponent loadContactLists() finished" )
            )
    }
    
    loadContactListsNames() {
        this.contactService.loadContactListsNames()
            .subscribe(
            ( data: any ) => {
                this.xtremandLogger.info( data );
                this.contactLists = data.listOfUserLists;
                this.names.length = 0; 
                for(let i=0;i< data.names.length;i++){
                    this.names.push( data.names[i].replace(/\s/g, '') );
                    }
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info( "MangeContactsComponent loadContactListsName() finished" )
            )
    }
    
    setPage( page: number, ) {
        this.pagination.pageIndex = page;
        if ( this.currentContactType == null )
            this.loadContactLists( this.pagination );
    }

    deleteContactList( contactListId: number ) {
        this.xtremandLogger.info( "MangeContacts deleteContactList : " + contactListId );
        this.contactService.deleteContactList( contactListId )
            .subscribe(
            data => {
                console.log( "MangeContacts deleteContactList success : " + data );
                this.contactsCount();
                $( '#contactListDiv_' + contactListId ).remove();
                this.loadContactLists( this.pagination );
                this.setResponseDetails('SUCCESS', 'your contact List has been deleted successfully');
                if (this.pagination.pagedItems.length === 1) {
                    this.pagination.pageIndex  = 1;
                    this.loadContactLists(this.pagination);

              }
            },
            ( error: any ) => {
               // let body: string = error['_body'];
               // body = body.substring(1, body.length-1);
                if ( error.includes( 'Please Launch or Delete those campaigns first' )) {
                    this.setResponseDetails('ERROR', error);
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "deleted completed" )
            );
    }

    showAlert( contactListId: number ) {
        this.xtremandLogger.info( "contactListId in sweetAlert() " + contactListId );
        let self = this;
        swal( {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'

        }).then( function( myData: any ) {
            console.log( "ManageContacts showAlert then()" + myData );
            self.deleteContactList( contactListId );
        })
    }

    downloadContactList( contactListId: number ) {
        this.contactService.downloadContactList( contactListId )
            .subscribe(
            data => this.downloadFile( data ),
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info( "download completed" )
            );
    }
    
    downloadFile(data: any) {
        let parsedResponse = data.text();
        let blob = new Blob([parsedResponse], { type: 'text/csv' });
        let url = window.URL.createObjectURL(blob);

        if(navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, 'UserList.csv');
        } else {
            let a = document.createElement('a');
            a.href = url;
            a.download = 'UserList.csv';
            document.body.appendChild(a);
            a.click();        
            document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(url);
    }
    
    synchronizeContactList(contactListId: number, socialNetwork : string){
        if(socialNetwork == 'GOOGLE'){
            this.googleContactsSynchronizationAuthentication( contactListId , socialNetwork);
        }
        else if(socialNetwork == 'SALESFORCE' ){
            this.salesforceContactsSynchronizationAuthentication( contactListId , socialNetwork);
        }
        else if(socialNetwork == 'ZOHO' ){
            this.zohoContactsSynchronizationAuthentication( contactListId , socialNetwork);
        }
    }
    
    
    googleContactsSynchronizationAuthentication( contactListId: number, socialNetwork : string) {
        swal( { title: 'Sychronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        for ( let i = 0; i < this.contactLists.length; i++ ) {
            if ( this.contactLists[i].id == contactListId ) {
                this.contactType = this.contactLists[i].contactType;
            }
        }
        this.socialContact.contactType = this.contactType;
        this.socialContact.socialNetwork = socialNetwork;
        this.contactService.googleLogin(this.isPartner)
            .subscribe(
            data => {
                this.storeLogin = data;
                console.log( data );
                if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                    console.log( "AddContactComponent googleContacts() Authentication Success" );
                    this.syncronizeContactList( contactListId, socialNetwork);
                } else {
                    localStorage.setItem( "userAlias", data.userAlias )
                    console.log( data.redirectUrl );
                    console.log( data.userAlias );
                    window.location.href = "" + data.redirectUrl;
                }
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                if(error._body.includes("JSONObject") && error._body.includes("access_token") && error._body.includes("not found.")){
                    this.xtremandLogger.errorMessage = 'authentication was not successful, you might have changed the password of social account or other reasons, please unlink your account and reconnect it.';
                }
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.log( "manageContacts googleContactsSynchronizationAuthentication() finished." )
            );
    }

    syncronizeContactList( contactListId: number, socialNetwork : string ) {
        this.socialContact.socialNetwork = socialNetwork;
        this.xtremandLogger.info( "contactsSyncronize() socialNetWork" + this.socialContact.socialNetwork );
        this.xtremandLogger.info( "contactsSyncronize() ContactListId" + contactListId );
        this.contactService.contactListSynchronization( contactListId, this.socialContact )
            .subscribe(
            data => {
                data
                swal.close();
                this.setResponseDetails('SUCCESS', 'Your Contact List has been sychronized successfully');
                this.loadContactLists( this.pagination );
                this.contactsCount();
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info( "googleContactsSyncronize() completed" )
            );
    }

    zohoContactsSynchronizationAuthentication( contactListId: number, socialNetwork : string ) {
        swal( { title: 'Sychronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        for ( let i = 0; i < this.contactLists.length; i++ ) {
            if ( this.contactLists[i].id == contactListId ) {
                this.contactType = this.contactLists[i].contactType;
            }
        }
        this.socialContact.socialNetwork = "ZOHO";
        this.socialContact.contactType = this.contactType;
        this.contactService.checkingZohoAuthentication()
        .subscribe(
        ( data: any ) => {
            this.xtremandLogger.info( data );
            if(data.authSuccess == true){
                this.syncronizeContactList( contactListId, socialNetwork );
            }
        },
        (error:any)=>{
            var body = error['_body'];
            if ( body != "" ) {
                var response = JSON.parse( body );
                if ( response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!" ) {
                    this.setResponseDetails('INFO', 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!')
                }else{
                    this.xtremandLogger.errorPage(error);
                }
            }else{
                this.xtremandLogger.errorPage(error);
            }
           console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error)
           
       },
        () => this.xtremandLogger.info( "Add contact component loadContactListsName() finished" )
        )
    }

    salesforceContactsSynchronizationAuthentication( contactListId: number, socialNetwork : string) {
        swal( { title: 'Sychronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        this.xtremandLogger.info( "socialContacts" + this.socialContact.socialNetwork );
        for ( let i = 0; i < this.contactLists.length; i++ ) {
            if ( this.contactLists[i].id == contactListId ) {
                this.alias = this.contactLists[i].alias;
                this.contactType = this.contactLists[i].contactType;
            }
        }
        this.socialContact.contactType = this.contactType;
        this.socialContact.socialNetwork = socialNetwork;
        this.contactService.salesforceLogin(this.isPartner)
            .subscribe(
            data => {
                this.storeLogin = data;
                console.log( data );
                if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                    console.log( "AddContactComponent salesforce() Authentication Success" );
                    this.syncronizeContactList( contactListId, socialNetwork );

                } else {
                    localStorage.setItem( "userAlias", data.userAlias )
                    console.log( data.redirectUrl );
                    console.log( data.userAlias );
                    window.location.href = "" + data.redirectUrl;
                }
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.log( "addContactComponent salesforceContacts() login finished." )
            );
    }

    editContactList( contactSelectedListId: number, contactListName: string,uploadUserId: number ) {
        this.uploadedUserId = uploadUserId;
        this.selectedContactListId = contactSelectedListId;
        this.selectedContactListName = contactListName;
        this.showAll = false;
        this.showEdit = true;
        this.show = false;
        $( "#pagination" ).hide();
    }

    backToManageContactPage() {}

    backToEditContactPage() {
        this.showAll = false;
        this.showEdit = true;
    }
    
    update(user:User) {
        this.contactCountLoad = true;
        this.navigateToManageContacts();
        this.contactsCount();
        this.showAll = true;
        this.showEdit = false;
        $( "#pagination" ).show();
    }
    
    onChangeAllContactUsers( event: Event ) {
        this.sortOption = event;
        this.selectedDropDown = this.sortOption.value;
        this.contactsByType.pagination.maxResults = (this.selectedDropDown == 'ALL') ? this.contactsByType.pagination.totalRecords : parseInt(this.selectedDropDown);
        this.contactsByType.pagination.pageIndex = 1;
        this.listContactsByType(this.contactsByType.selectedCategory);
    }
    
    
    validateContactName(contactName:string){
        if(contactName.replace(/\s\s+/g, '').length == 0){ 
            this.noSaveButtonDisable = true;
        }else{
            this.noSaveButtonDisable = false;
        }
        
        let lowerCaseContactName = contactName.toLowerCase().replace(/\s/g, '');
        var list = this.names;
        console.log(list);
        if($.inArray(lowerCaseContactName, list) > -1){
            this.isValidContactName = true;  
            $(".ng-valid[required], .ng-valid.required").css("color", "red");
        }else{
            $(".ng-valid[required], .ng-valid.required").css("color", "Black");
            this.isValidContactName = false;
        }
    }


    removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject = {}; 
        for(var i in originalArray) { 
            lookupObject[originalArray[i][prop]] = originalArray[i]; 
            } 
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
            }
        return newArray;
        }
    
    checkAllInvalidContacts(ev:any){
        if(ev.target.checked){
            console.log("checked");
            $('[name="invalidContact[]"]').prop('checked', true);
            let self = this;
            $('[name="invalidContact[]"]:checked').each(function(){
                var id = $(this).val();
                self.selectedInvalidContactIds.push(parseInt(id));
                console.log(self.selectedInvalidContactIds);
                $('#campaignContactListTable_'+id).addClass('invalid-contacts-selected');
             });
            for ( var i = 0; i < this.contactsByType.pagination.pagedItems.length; i++ ) {
                var object = {
                    "id": this.contactsByType.pagination.pagedItems[i].id,
                    "userName": null,
                    "emailId": this.contactsByType.pagination.pagedItems[i].emailId,
                    "firstName": this.contactsByType.pagination.pagedItems[i].firstName,
                    "lastName": this.contactsByType.pagination.pagedItems[i].lastName,
                    "mobileNumber": null,
                    "interests": null,
                    "occupation": null,
                    "description": null,
                    "websiteUrl": null,
                    "profileImagePath": null,
                    "userListIds": this.contactsByType.pagination.pagedItems[i].userListIds
                }
                this.invalidRemovableContacts.push( object );
                console.log( object );
        }
            this.invalidRemovableContacts = this.removeDuplicates(this.invalidRemovableContacts, 'id');
            this.selectedInvalidContactIds = this.referenceService.removeDuplicates(this.selectedInvalidContactIds);
        }else{
            $('[name="invalidContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("invalid-contacts-selected");
            if(this.contactsByType.pagination.maxResults == this.contactsByType.pagination.totalRecords){
                this.selectedInvalidContactIds = [];
                this.invalidRemovableContacts = [];
            }else{
              let paginationIdsArray = new Array;
                for(let j=0; j< this.contactsByType.pagination.pagedItems.length; j++){
                    var paginationIds = this.contactsByType.pagination.pagedItems[j].id; 
                    this.invalidRemovableContacts.splice(this.invalidRemovableContacts.indexOf(paginationIds), 1);
                }
               console.log('removed objects form else part');
               console.log(this.invalidRemovableContacts);
               let currentPageContactIds = this.contactsByType.pagination.pagedItems.map(function(a) {return a.id;});
                this.selectedInvalidContactIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedInvalidContactIds, currentPageContactIds);
            }
            console.log(this.invalidRemovableContacts);
        }
        ev.stopPropagation();
    }
    
    invalidContactsSelectedUserIds(contactId:number,event:any){
        let isChecked = $('#'+contactId).is(':checked');
        console.log(this.invalidRemovableContacts)
        if(isChecked){
            $('#row_'+contactId).addClass('invalid-contacts-selected');
            this.selectedInvalidContactIds.push(contactId);
            for ( var i = 0; i < this.userListIds.length; i++ ) {
                if ( contactId == this.userListIds[i].id ) {
                    var object = {
                        "id": this.userListIds[i].id,
                        "userName": null,
                        "emailId": this.userListIds[i].emailId,
                        "firstName": this.userListIds[i].firstName,
                        "lastName": this.userListIds[i].lastName,
                        "mobileNumber": null,
                        "interests": null,
                        "occupation": null,
                        "description": null,
                        "websiteUrl": null,
                        "profileImagePath": null,
                        "userListIds": this.userListIds[i].userListIds
                    }
                    console.log( object );
                    this.invalidRemovableContacts.push( object );

                }
            }
        }else{
            $('#row_'+contactId).removeClass('invalid-contacts-selected');
            this.selectedInvalidContactIds.splice($.inArray(contactId,this.selectedInvalidContactIds),1);
            this.invalidRemovableContacts.splice($.inArray(contactId,this.invalidRemovableContacts),1);
        }
        if(this.selectedInvalidContactIds.length == this.contactsByType.pagination.pagedItems.length ){
            this.isInvalidHeaderCheckBoxChecked = true;
        }else{
            this.isInvalidHeaderCheckBoxChecked = false;
        }
    }
    
    checkAll(ev:any){
        this.contactsNotSelectedError = false;
        if(ev.target.checked){
            console.log("checked");
            $('[name="campaignContact[]"]').prop('checked', true);
            let self = this;
            $('[name="campaignContact[]"]:checked').each(function(){
                var id = $(this).val();
                self.selectedContactListIds.push(parseInt(id));
                console.log(self.selectedContactListIds);
                $('#ContactListTable_'+id).addClass('contact-list-selected');
                for ( var i = 0; i < self.contactsByType.pagination.pagedItems.length; i++ ) {
                    var object = {
                        "emailId": self.contactsByType.pagination.pagedItems[i].emailId,
                        "firstName": self.contactsByType.pagination.pagedItems[i].firstName,
                        "lastName": self.contactsByType.pagination.pagedItems[i].lastName,
                    }
                    console.log( object );
                    self.allselectedUsers.push( object );
                }
             });
            this.allselectedUsers = this.removeDuplicates(this.allselectedUsers, 'emailId');
            this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
        }else{
            $('[name="campaignContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("contact-list-selected");
            if(this.contactsByType.pagination.maxResults == this.contactsByType.pagination.totalRecords){
                this.selectedContactListIds = [];
                this.allselectedUsers.length = 0;
            }else{
                let paginationIdsArray = new Array;
                for(let j=0; j< this.contactsByType.pagination.pagedItems.length; j++){
                    var paginationEmail = this.contactsByType.pagination.pagedItems[j].emailId; 
                    this.allselectedUsers.splice(this.allselectedUsers.indexOf(paginationEmail), 1);
                }
                let currentPageContactIds = this.contactsByType.pagination.pagedItems.map(function(a) {return a.id;});
                this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
            }
        }
        ev.stopPropagation();
    }
    
    highlightRow(contactId:number,email:any,firstName:any,lastName:any,event:any){
        this.contactsNotSelectedError = false;
        let isChecked = $('#'+contactId).is(':checked');
        console.log(this.selectedContactListIds)
        if(isChecked){
            $('#row_'+contactId).addClass('contact-list-selected');
            this.selectedContactListIds.push(contactId);
                    var object = {
                            "emailId": email,
                            "firstName": firstName,
                            "lastName": lastName,
                        }
                    this.allselectedUsers.push( object );
                    console.log( this.allselectedUsers );
        }else{
            $('#row_'+contactId).removeClass('contact-list-selected');
            this.selectedContactListIds.splice($.inArray(contactId,this.selectedContactListIds),1);
            this.allselectedUsers.splice($.inArray(contactId,this.allselectedUsers),1);
        }
        if(this.selectedContactListIds.length == this.contactsByType.pagination.pagedItems.length ){
            this.isHeaderCheckBoxChecked = true;
        }else{
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
    }
    
    saveSelectedUsers() {
        var selectedUserIds = new Array();
        let selectedUsers = new Array<User>();
        this.xtremandLogger.info( "SelectedUserIDs:" + this.selectedContactListIds );
        this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
        this.contactListObject = new ContactList;
        this.contactListObject.name = this.model.contactListName;
        this.contactListObject.isPartnerUserList = this.isPartner;
        if ( this.model.contactListName != "" && !this.isValidContactName && this.model.contactListName != " ") {
            if ( this.selectedContactListIds.length != 0 ) {
                if(this.model.contactListName.length != ""){
                    this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
                    .subscribe(
                    data => {
                        data = data;
                        this.contactCountLoad = true;
                        this.navigateToManageContacts();
                        this.allselectedUsers.length = 0;
                        this.setResponseDetails('SUCCESS', 'your contact List created successfully');
                    },

                    (error: any) => {
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info( "allcontactComponent saveSelectedUsers() finished" )
                    )
             } 
            }else{
            this.contactsNotSelectedError = true;
            }
        }
        else {
            this.xtremandLogger.error( "AllContactComponent saveSelectedUsers() UserNotSelectedContacts" );
        }
    }

    cancelAllContactsCancel() {
        this.model.contactListName = "";
        this.selectedContactListIds = [];
        this.allselectedUsers.length = 0;
        this.isHeaderCheckBoxChecked = false;
        this.contactsNotSelectedError = false;
    }

    removeInvalidContactListUsers() {
        var removeUserIds = new Array();
        let invalidUsers = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            this.invalidIds = $( this ).val();
            removeUserIds.push( this.invalidIds );
            this.invalidIds = this.removeUserIds;
        });
        this.xtremandLogger.info( this.invalidRemovableContacts );
        this.contactService.removeInvalidContactListUsers( this.invalidRemovableContacts )
            .subscribe(
            data => {
                data = data;
                this.xtremandLogger.log( data );
                console.log( "update Contacts ListUsers:" + data );
                $.each( removeUserIds, function( index: number, value: any ) {
                    $( '#row_' + value ).remove();
                    console.log( index + "value" + value );
                });
                this.invalidDeleteSucessMessage = true;
                this.contactCountLoad = true;
                setTimeout( function() { $( "#showDeleteMessage" ).slideUp( 500 ); }, 2000 );
                this.listContactsByType( this.contactsByType.selectedCategory );
            },
            ( error: any ) => {
                //let body: string = error['_body'];
                //body = body.substring(1, body.length-1);
                if ( error.includes( 'Please Launch or Delete those campaigns first' )) {
                    this.setResponseDetails('ERROR', error);
                    this.invalidDeleteErrorMessage = true;
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.invalidDeleteSucessMessage = false;
        this.invalidDeleteErrorMessage = false;
    }

    invalidContactsShowAlert() {
        var removeUserIds = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
        });
        if ( this.invalidRemovableContacts.length != 0 ) {
            this.xtremandLogger.info( "contactListId in sweetAlert() " );
            let self = this;
            swal( {
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'

            }).then( function( myData: any ) {
                console.log( "ManageContacts showAlert then()" + myData );
                self.removeInvalidContactListUsers();
            })
        }
    }

    contactsCount() {
        this.contactService.loadContactsCount(this.isPartner)
            .subscribe(
                data => {
                    this.contactsByType.allContactsCount = data.allContactsCount;
                    this.contactsByType.invalidContactsCount = data.invalidContactsCount;
                    this.contactsByType.unsubscribedContactsCount = data.unsubscribedContactsCount;
                    this.contactsByType.activeContactsCount = data.activeContactsCount;
                    this.contactsByType.inactiveContactsCount = data.inactiveContactsCount;
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.xtremandLogger.errorPage(error);
                },
                () => console.log( "LoadContactsCount Finished" )
            );
    }
    
    listContactsByType(contactType: string){
        this.listAllContactsByType(contactType);
        this.contactsByType.isLoading = true;
        this.response.responseType = null;
        this.response.responseMessage = null;
        this.resetListContacts();
        if(this.listContactData == true){
            this.searchKey = null;
            this.listContactData = false;
        }
        this.referenceService.loading(this.httpRequestLoader, true); 
        this.httpRequestLoader.isHorizontalCss = true;
        this.contactsByType.pagination.filterKey = 'isPartnerUserList';
        this.contactsByType.pagination.filterValue = this.isPartner;
        this.contactsByType.pagination.criterias = this.criterias;
        
        this.contactService.listContactsByType(contactType, this.contactsByType.pagination)
        .subscribe(
            data => {
                this.contactsByType.selectedCategory = contactType;
                this.contactsByType.contacts = data.listOfUsers;
                this.contactsByType.pagination.totalRecords = data.totalRecords;
                this.contactsByType.pagination = this.pagerService.getPagedItems( this.contactsByType.pagination, this.contactsByType.contacts );
           
                if(this.contactsByType.selectedCategory == 'invalid'){
                    this.userListIds = data.listOfUsers;
                }
                
                var contactIds = this.contactsByType.pagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedContactListIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                this.xtremandLogger.log("Contact Ids"+contactIds);
                this.xtremandLogger.log("Selected Contact Ids"+this.selectedContactListIds);
                if(items.length == this.contactsByType.pagination.totalRecords || items.length == this.contactsByType.pagination.pagedItems.length){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }
                
                var contactIds1 = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items1 = $.grep(this.selectedInvalidContactIds, function(element) {
                    return $.inArray(element, contactIds1 ) !== -1;
                });
                this.xtremandLogger.log("inavlid contacts page pagination Object Ids"+contactIds1);
                this.xtremandLogger.log("selected inavalid contacts Ids"+this.selectedInvalidContactIds);
               
                if(items1.length == this.contactsByType.pagination.totalRecords || items1.length == this.contactsByType.pagination.pagedItems.length){
                    this.isInvalidHeaderCheckBoxChecked = true;
                }else{
                    this.isInvalidHeaderCheckBoxChecked = false;
                }
                this.referenceService.loading(this.httpRequestLoader, false); 
                
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            },
            () => {
                this.contactsByType.isLoading = false;
                }
        );
    }
    
    setPageForListContactsByType(pageNumber: number, contactType: string){
        this.contactsByType.pagination.pageIndex = pageNumber;
        this.listContactsByType(contactType);
    }
    
    resetListContacts(){
        this.sortOption = this.sortOptions[0];
        this.showListOfContactList = false;
        this.contactsByType.contacts = [];
        if(this.showListOfContactList){
            
        }
    }
    
    sortByOption( event: any, selectedType: string){
        this.sortOption = event;
        const sortedValue = this.sortOption.value;
        if ( sortedValue !== '' ) {
            const options: string[] = sortedValue.split( '-' );
            this.sortcolumn = options[0];
            this.sortingOrder = options[1];
        } else {
            this.sortcolumn = null;
            this.sortingOrder = null;
        }
        
        if(selectedType == 'contactList'){
            this.pagination.pageIndex = 1;
            this.pagination.sortcolumn = this.sortcolumn;
            this.pagination.sortingOrder = this.sortingOrder;
            this.loadContactLists( this.pagination );
        }else{
            this.contactsByType.pagination.pageIndex = 1;
            this.contactsByType.pagination.sortcolumn = this.sortcolumn;
            this.contactsByType.pagination.sortingOrder = this.sortingOrder;
            this.listContactsByType( this.contactsByType.selectedCategory );
        }            
    }
    
    searchKeyValue(searchType: string) {
        if(searchType == 'contactList'){
        this.pagination.searchKey = this.searchKey;
        }else{
            this.contactsByType.pagination.searchKey = this.searchKey;
        } 
    }
    
    search(searchType: string){
        this.resetResponse();
        if(searchType == 'contactList'){
            this.pagination.searchKey = this.searchKey;
            this.pagination.pageIndex = 1;
            this.loadContactLists( this.pagination );
        }else{
            this.contactsByType.pagination.searchKey = this.searchKey;
            this.contactsByType.pagination.pageIndex = 1;
            this.listContactsByType( this.contactsByType.selectedCategory );
        } 
    }
    
    resetPagination(){
        this.pagination.searchKey = this.searchKey;
        this.pagination.pageIndex = 1;
    }
    
    navigateToManageContacts(){
        this.contactsNotSelectedError = false;
        this.model.contactListName = "";
        this.searchKey = null;
        this.response.responseType = null;
        this.resetPagination();
        this.listContactData = true;
        
        this.isSegmentation = false;
        this.criterias.length = 0;
        
        this.contactsByType.pagination = new Pagination();
        
        this.sortOptionForPagination = this.sortOptionsForPagination[0];
        this.showListOfContactList = true;
        this.contactsByType.selectedCategory = null;
        this.selectedContactListIds = [];
        this.allselectedUsers.length = 0;
        this.selectedInvalidContactIds = [];
        this.invalidRemovableContacts = [];
        this.invalidDeleteSucessMessage = false;
        if(this.contactCountLoad == true){
            this.loadContactLists(this.pagination);
            this.contactsCount();
        }
        this.contactCountLoad = false;
    }
    
    setResponseDetails(responseType: string, responseMessage: string){
        this.response.responseType = responseType;
        this.response.responseMessage = responseMessage;
    }
    
    resetResponse(){
        this.response.responseType = null;
        this.response.responseMessage = null;
    }
    
    toggle(i: number){
        const className = $('#more_'+i).attr('class');
        if(className === 'hidden'){
            $('#more_'+i).removeClass('hidden');
            $('#more_'+i).addClass('show-more');
            $("#more_less_button_"+i).attr('value', 'less');
        }else{
            $('#more_'+i).removeClass('show-more');
            $('#more_'+i).addClass('hidden');
            $("#more_less_button_"+i).attr('value', 'more');
        }
    }
    
    contactFilter(){
        for(let i=0;i< this.criterias.length;i++){
            if(this.criterias[i].operation == "="){
                this.criterias[i].operation = "eq";
            }
            if(this.criterias[i].property == "First Name"){
                this.criterias[i].property = "firstName";
            }
            else if(this.criterias[i].property == "Last Name"){
                this.criterias[i].property = "lastName";
            }
            else if(this.criterias[i].property == "Company"){
                this.criterias[i].property = "contactCompany";
            }
            else if(this.criterias[i].property == "Job Title"){
                this.criterias[i].property = "jobTitle";
            }
            else if(this.criterias[i].property == "Email Id"){
                this.criterias[i].property = "emailId";
            }
            else if(this.criterias[i].property == "Country"){
                this.criterias[i].property = "country";
            }else if(this.criterias[i].property == "City"){
                this.criterias[i].property = "city";
            }
            else if(this.criterias[i].property == "Mobile Number"){
                this.criterias[i].property = "mobileNumber";
            }
            else if(this.criterias[i].property == "Notes"){
                this.criterias[i].property = "description";
            }
            console.log(this.criterias[i].operation);
            console.log(this.criterias[i].property);
            console.log(this.criterias[i].value1);
            
            if(this.criterias[i].property == "Field Name*" || this.criterias[i].operation == "Condition*" || (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")){
                this.isSegmentationErrorMessage = true;
            }else{
                this.isSegmentationErrorMessage = false; 
            }
        }
        if(!this.isSegmentationErrorMessage){
        this.listContactsByType(this.contactsByType.selectedCategory);
        console.log( this.criterias );
        this.isSegmentation = true;
        $( "#filterModal .close" ).click()
        }
    }

    modelForSeg(){
        this.criteria.property = this.filterOptions[0].value;
        this.criteria.operation = this.filterConditions[0].value;
        this.addNewRow();
    }
    
    removeSegmentation(){
        this.isSegmentation = false;
        this.criterias.length = 0;
        this.listContactsByType(this.contactsByType.selectedCategory);
    }
    
    cancelSegmentation(){
        this.criterias.length = 0;
        this.isSegmentationErrorMessage = false;
    }
    
    addNewRow(){
        let criteria = new Criteria();
        this.criterias.push( criteria );
    }
    
    cancelRow( rowId: number ) {
        if ( rowId !== -1 ) {
            this.criterias.splice( rowId, 1 );
        }
    }
    
    convertToCSV( objArray ) {
        var array = typeof objArray != 'object' ? JSON.parse( objArray ) : objArray;
        var str = '';
        var row = "";
        for ( var index in objArray[0] ) {
            row += index + ',';
        }
        row = row.slice( 0, -1 );
        str += row + '\r\n';
        for ( var i = 0; i < array.length; i++ ) {
            var line = '';
            for ( var index in array[i] ) {
                if ( line != '' ) line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    downloadContactTypeList() {
        let logListName: string;
        if ( this.contactsByType.selectedCategory === 'all' ) {
            logListName = 'All_Users_List.csv';
        }
        else if ( this.contactsByType.selectedCategory === 'active' ) {
            logListName = 'Active_Users_List.csv';
        } else if ( this.contactsByType.selectedCategory === 'non-active' ) {
            logListName = 'InActive_Users_List.csv';
        } else if ( this.contactsByType.selectedCategory === 'invalid' ) {
            logListName = 'Invalid_Users_List.csv';
        } else if ( this.contactsByType.selectedCategory === 'unsubscribe' ) {
            logListName = 'Unsubscribed_Users_List.csv';
        }
        this.downloadDataList.length = 0;
        for ( let i = 0; i < this.contactsByType.listOfAllContacts.length; i++ ) {
            var object = {
                "EmailId": this.contactsByType.listOfAllContacts[i].emailId,
                "First Name": this.contactsByType.listOfAllContacts[i].firstName,
                "Last Name": this.contactsByType.listOfAllContacts[i].lastName,
                "Company": this.contactsByType.listOfAllContacts[i].contactCompany,
                "Address": this.contactsByType.listOfAllContacts[i].address,
                "City": this.contactsByType.listOfAllContacts[i].city,
                "Country": this.contactsByType.listOfAllContacts[i].country,
                "JobTitle": this.contactsByType.listOfAllContacts[i].jobTitle,
                "MobileNumber": this.contactsByType.listOfAllContacts[i].mobileNumber,
                "Notes": this.contactsByType.listOfAllContacts[i].description
            }

            this.downloadDataList.push( object );
        }
        var csvData = this.convertToCSV( this.downloadDataList );
        var a = document.createElement( "a" );
        a.setAttribute( 'style', 'display:none;' );
        document.body.appendChild( a );
        var blob = new Blob( [csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL( blob );
        a.href = url;
        a.download = logListName;
        a.click();
        return 'success';
    }

    listAllContactsByType( contactType: string ) {
        this.response.responseType = null;
        this.response.responseMessage = null;
        this.resetListContacts();
        this.contactsByType.contactPagination.maxResults = this.contactsByType.allContactsCount;
        this.contactService.listContactsByType( contactType, this.contactsByType.contactPagination )
            .subscribe(
            data => {
                this.contactsByType.selectedCategory = contactType;
                this.contactsByType.listOfAllContacts = data.listOfUsers;
                this.contactsByType.contactPagination.totalRecords = data.totalRecords;
                this.contactsByType.contactPagination = this.pagerService.getPagedItems( this.contactsByType.contactPagination, this.contactsByType.contacts );
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
                this.xtremandLogger.errorPage( error );
            },
            () => {
                this.contactsByType.isLoading = false;
            }
            );
    }
    
    ngOnInit() {
        try {
            this.isListView = this.referenceService.isListView;
            this.loadContactLists( this.pagination );
            this.contactsCount();
            this.loadContactListsNames();
        }
        catch ( error ) {
            this.xtremandLogger.error( "ERROR : MangeContactsComponent ngOnInit() " + error );
        }
    }
    
    ngOnDestroy() {
        this.xtremandLogger.info( 'Deinit - Destroyed Component' )
        this.contactService.successMessage = false;
        this.contactService.deleteUserSucessMessage = false;
    }
}