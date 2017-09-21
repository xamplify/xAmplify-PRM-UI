import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { ContactsByType } from '../models/contacts-by-type';
import { User } from '../../core/models/user';
import { Router, NavigationExtras } from "@angular/router";
import { Response } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Logger } from "angular2-logger/core";
import { SocialContact } from '../models/social-contact';
import { UserListIds } from '../models/user-listIds';
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';

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
    hasContactRole:boolean = false;
    selectedContactListIds = [];
    selectedInvalidContactIds = [];
    paginationAllData = [];
    zohoAuthStorageError = '';
    selectedAllContactUsers = new Array<User>();
    isHeaderCheckBoxChecked:boolean = false;
    public contactLists: Array<ContactList>;
    selectedContactListId: number;
    showAll: boolean;
    showEdit: boolean;
    
    
    
    invalidRemovableContacts = [];
    allselectedUsers = [];
    isInvalidHeaderCheckBoxChecked:boolean = false;
    invalidDeleteSucessMessage: boolean;
    
    public invalidIds: Array<UserListIds>;
    
    contactsByType: ContactsByType = new ContactsByType();
    
    /*
     * Display all the contactLists in manage contacts page by default.
       If 'showListOfContactList' is set to false,display category wise contacts.
    */
    showListOfContactList: boolean = true; 
    
    showAllContactData: boolean = false;
    showManageContactData: boolean = true;
    deleteSucessMessage: boolean;
    deleteErrorMessage: boolean;
    synchronizationSucessMessage: boolean;
    contactListNameError: boolean;
    contactListUsersError: boolean;
    emptyContacts: boolean;
    emptyContactsUsers: boolean;
    hidingContactUsers : boolean;
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
    isvideoThere: boolean;
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
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

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

    constructor(public contactService: ContactService, private authenticationService: AuthenticationService, private router: Router, private logger: Logger,
        private pagerService: PagerService, private pagination: Pagination, private referenceService: ReferenceService, ) {
        this.show = false;
        this.showAll = true;
        this.showEdit = false;
        this.showManageContactData = true;
        this.userListIds = new Array<UserListIds>();
        this.googleSynchronizeButton = false;
        this.socialContact = new SocialContact();
        this.socialContact.socialNetwork = "";
        this.logger.info( "socialContact" + this.socialContact.socialNetwork );
        this.access_token = this.authenticationService.access_token;
        this.logger.info( "successmessageLoad" + this.contactService.successMessage )
        if ( this.contactService.successMessage == true ) {
            this.show = this.contactService.successMessage;
            setTimeout( function() { $( "#showMessage" ).slideUp( 500 ); }, 2000 );
            this.logger.info( "Success Message in manage contact pape" + this.show );
        }
        if ( this.contactService.deleteUserSucessMessage == true ) {
            this.deleteUserSucessMessage = this.contactService.deleteUserSucessMessage;
            setTimeout( function() { $( "#showDeleteUserMessage" ).slideUp( 500 ); }, 2000 );
            this.logger.info( " delete Success Message in manage contact pape" + this.show );
        }
        this.noSaveButtonDisable = true;
        
        this.hasContactRole = this.referenceService.hasRole(this.referenceService.roleName.contactsRole);
        console.log("ContactRole"+this.hasContactRole);
    }
    
    contactListNameLength(title: string) {
        if (title.length > 25) { title = title.substring(0, 25) + '....'; }
        return title;
        }

    loadContactLists( pagination: Pagination ) {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.pagination.maxResults = 12;
        this.contactService.loadContactLists( pagination )
            .subscribe(
            ( data: any ) => {
                this.logger.info( data );
                this.contactLists = data.listOfUserLists;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyContacts = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.contactLists );
                }
                if (this.contactLists.length !== 0) {
                    this.isvideoThere = false;
                 }
                 else {
                     this.isvideoThere = true;
                     this.pagedItems = null ;
                 }
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            error => {
                this.logger.error( error )
            },
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
    }
    
    loadContactListsNames() {
        this.contactService.loadContactListsNames()
            .subscribe(
            ( data: any ) => {
                this.logger.info( data );
                this.contactLists = data.listOfUserLists;
                this.names.length = 0; 
                for(let i=0;i< data.names.length;i++){
                    this.names.push( data.names[i].replace(/\s/g, '') );
                    }
            },
            error => {
                this.logger.error( error )
            },
            () => this.logger.info( "MangeContactsComponent loadContactListsName() finished" )
            )
    }
    
    setPage( page: number, ) {
        this.pagination.pageIndex = page;
        if ( this.currentContactType == null )
            this.loadContactLists( this.pagination );
    }

    deleteContactList( contactListId: number ) {
        this.logger.info( "MangeContacts deleteContactList : " + contactListId );
        this.contactService.deleteContactList( contactListId )
            .subscribe(
            data => {
                console.log( "MangeContacts deleteContactList success : " + data );
                this.contactsCount();
                $( '#contactListDiv_' + contactListId ).remove();
                this.loadContactLists( this.pagination );
                this.deleteSucessMessage = true;
                setTimeout( function() { $( "#showDeleteMessage" ).slideUp( 500 ); }, 2000 );
                if (this.pagination.pagedItems.length === 1) {
                    this.isvideoThere = true;
                    this.pagination.pageIndex  = 1;
                    this.loadContactLists(this.pagination);

              }
            },
            ( error: any ) => {
                if ( error.search( 'contactlist is being used in one or more campaigns. Please delete those campaigns first.' ) != -1 ) {
                    this.Campaign = error;
                    this.deleteErrorMessage = true;
                    setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                }
                console.log( error );
            },
            () => this.logger.info( "deleted completed" )
            );
        this.deleteSucessMessage = false;
        this.deleteErrorMessage = false;
    }

    showAlert( contactListId: number ) {
        this.logger.info( "contactListId in sweetAlert() " + contactListId );
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
            error => this.logger.error( error ),
            () => this.logger.info( "download completed" )
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
        this.contactService.googleLogin()
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
            error => this.logger.error( error ),
            () => this.logger.log( "manageContacts googleContactsSynchronizationAuthentication() finished." )
            );
    }

    syncronizeContactList( contactListId: number, socialNetwork : string ) {
        this.socialContact.socialNetwork = socialNetwork;
        this.logger.info( "contactsSyncronize() socialNetWork" + this.socialContact.socialNetwork );
        this.logger.info( "contactsSyncronize() ContactListId" + contactListId );
        this.contactService.contactListSynchronization( contactListId, this.socialContact )
            .subscribe(
            data => {
                data
                swal.close();
                this.synchronizationSucessMessage = true;
                setTimeout( function() { $( "#showSynchronizeMessage" ).slideUp( 500 ); }, 2000 );
                this.loadContactLists( this.pagination );
                this.contactsCount();
            },
            error => this.logger.error( error ),
            () => this.logger.info( "googleContactsSyncronize() completed" )
            );
        this.synchronizationSucessMessage = false;
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
            this.logger.info( data );
            if(data.authSuccess == true){
                this.syncronizeContactList( contactListId, socialNetwork );
            }
        },
        (error:any)=>{
            var body = error['_body'];
            if ( body != "" ) {
                var response = JSON.parse( body );
                if ( response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!" ) {
                    this.zohoAuthStorageError = 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!';
                     setTimeout(()=> {
                         this.zohoAuthStorageError = '';
                     },5000)
                }
            }
           console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error)
           
       },
        () => this.logger.info( "Add contact component loadContactListsName() finished" )
        )
    }

    salesforceContactsSynchronizationAuthentication( contactListId: number, socialNetwork : string) {
        swal( { title: 'Sychronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        this.logger.info( "socialContacts" + this.socialContact.socialNetwork );
        for ( let i = 0; i < this.contactLists.length; i++ ) {
            if ( this.contactLists[i].id == contactListId ) {
                this.alias = this.contactLists[i].alias;
                this.contactType = this.contactLists[i].contactType;
            }
        }
        this.socialContact.contactType = this.contactType;
        this.socialContact.socialNetwork = socialNetwork;
        this.contactService.salesforceLogin()
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
            error => this.logger.error( error ),
            () => this.logger.log( "addContactComponent salesforceContacts() login finished." )
            );
    }

    editContactList( contactSelectedListId: number ) {
        this.selectedContactListId = contactSelectedListId;
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
        this.navigateToManageContacts();
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
        this.contactListUsersError = false;
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
        this.contactListUsersError = false;
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
        this.logger.info( "SelectedUserIDs:" + this.selectedContactListIds );
        this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
        if ( this.model.contactListName != "" && !this.isValidContactName && this.model.contactListName != " ") {
            if ( this.selectedContactListIds.length != 0 ) {
                if(this.model.contactListName.length != ""){
                    this.contactService.saveContactList( this.model.contactListName, this.allselectedUsers )
                    .subscribe(
                    data => {
                        data = data;
                        this.navigateToManageContacts();
                        this.show = true;
                        this.allselectedUsers.length = 0;
                        setTimeout( function() { $( "#showMessage" ).slideUp( 500 ); }, 2000 );
                    },

                    error => this.logger.info( error ),
                    () => this.logger.info( "allcontactComponent saveSelectedUsers() finished" )
                    )
            } 
            }else {
                this.contactListUsersError = true;
                this.contactListNameError = false;
            }
        }
        else {
            this.contactListUsersError = false;
            this.contactListNameError = true;
            this.logger.error( "AllContactComponent saveSelectedUsers() ContactList Name Error" );
        }
    }

    cancelAllContactsCancel() {
        this.model.contactListName = null;
        this.selectedContactListIds = [];
        this.allselectedUsers.length = 0;
        this.contactListUsersError = false;
        this.contactListNameError = false;
    }

    removeInvalidContactListUsers() {
        var removeUserIds = new Array();
        let invalidUsers = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            this.invalidIds = $( this ).val();
            removeUserIds.push( this.invalidIds );
            this.invalidIds = this.removeUserIds;
        });
        this.logger.info( this.invalidRemovableContacts );
        this.contactService.removeInvalidContactListUsers( this.invalidRemovableContacts )
            .subscribe(
            data => {
                data = data;
                this.logger.log( data );
                console.log( "update Contacts ListUsers:" + data );
                $.each( removeUserIds, function( index: number, value: any ) {
                    $( '#row_' + value ).remove();
                    console.log( index + "value" + value );
                });
                this.invalidDeleteSucessMessage = true;
                setTimeout( function() { $( "#showDeleteMessage" ).slideUp( 500 ); }, 2000 );
                this.listContactsByType( this.contactsByType.selectedCategory );
            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.invalidDeleteSucessMessage = false;
    }

    invalidContactsShowAlert() {
        var removeUserIds = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
        });
        if ( this.invalidRemovableContacts.length != 0 ) {
            this.logger.info( "contactListId in sweetAlert() " );
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
        this.contactService.loadContactsCount()
            .subscribe(
                data => {
                    this.contactsByType.allContactsCount = data.allContactsCount;
                    this.contactsByType.invalidContactsCount = data.invalidContactsCount;
                    this.contactsByType.unsubscribedContactsCount = data.unsubscribedContactsCount;
                    this.contactsByType.activeContactsCount = data.activeContactsCount;
                    this.contactsByType.inactiveContactsCount = data.inactiveContactsCount;
                },
                error => console.log( error ),
                () => console.log( "LoadContactsCount Finished" )
            );
    }
    
    listContactsByType(contactType: string){
        this.contactsByType.isLoading = true;
        this.resetListContacts();
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
                this.logger.log("Contact Ids"+contactIds);
                this.logger.log("Selected Contact Ids"+this.selectedContactListIds);
                if(items.length == this.contactsByType.pagination.totalRecords || items.length == this.contactsByType.pagination.pagedItems.length){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }
                
                var contactIds1 = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items1 = $.grep(this.selectedInvalidContactIds, function(element) {
                    return $.inArray(element, contactIds1 ) !== -1;
                });
                this.logger.log("inavlid contacts page pagination Object Ids"+contactIds1);
                this.logger.log("selected inavalid contacts Ids"+this.selectedInvalidContactIds);
               
                if(items1.length == this.contactsByType.pagination.totalRecords || items1.length == this.contactsByType.pagination.pagedItems.length){
                    this.isInvalidHeaderCheckBoxChecked = true;
                }else{
                    this.isInvalidHeaderCheckBoxChecked = false;
                }
                
            },
            error => console.log( error ),
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
    
    search(searchType: string){
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
        this.searchKey = null;
        this.resetPagination();
        
        this.contactsByType.pagination = new Pagination();
        
        this.sortOptionForPagination = this.sortOptionsForPagination[0];
        this.showListOfContactList = true;
        this.contactsByType.selectedCategory = null;
        this.loadContactLists(this.pagination);
        this.selectedContactListIds = [];
        this.allselectedUsers.length = 0;
        this.selectedInvalidContactIds = [];
        this.invalidRemovableContacts = [];
        this.invalidDeleteSucessMessage = false;
    }

    ngOnInit() {
        try {
            this.loadContactLists( this.pagination );
            this.contactsCount();
            this.loadContactListsNames();
        }
        catch ( error ) {
            this.logger.error( "ERROR : MangeContactsComponent ngOnInit() " + error );
        }
    }

    ngOnDestroy() {
        this.logger.info( 'Deinit - Destroyed Component' )
        this.contactService.successMessage = false;
        this.contactService.deleteUserSucessMessage = false;
    }
}