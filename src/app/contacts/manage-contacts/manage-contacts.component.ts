import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
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
    allContacts: number;
    invalidContacts: number;
    unsubscribedContacts: number;
    public storeLogin: any;
    activeUsersCount: number;
    inActiveUsersCount: number;
    invlidContactsCount: number;
    selectedContactListIds = [];
    selectedInvalidContactIds = [];
    invalidRemovableContacts = [];
    paginationAllData = [];
    selectedAllContactUsers = new Array<User>();
    isHeaderCheckBoxChecked:boolean = false;
    isInvalidHeaderCheckBoxChecked:boolean = false;
    public contactLists: Array<ContactList>;
    selectedContactListId: number;
    showAll: boolean;
    showEdit: boolean;
    allselectedUsers = [];
   // allselectedUsers: User[];
    showAllContactData: boolean = false;
    showManageContactData: boolean = true;
    deleteSucessMessage: boolean;
    deleteErrorMessage: boolean;
    invalidDeleteSucessMessage: boolean;
    synchronizationSucessMessage: boolean;
    allContactData: boolean;
    activeContactsData: boolean;
    invalidContactData: boolean;
    unsubscribedContactsData: boolean;
    nonActiveContactsData: boolean;
    contactListNameError: boolean;
    contactListUsersError: boolean;
    emptyContacts: boolean;
    emptyContactsUsers: boolean;
    hidingContactUsers : boolean;
    public contactListName: string;
    public model: any = {};
    public removeIds: number;
    public invalidIds: Array<UserListIds>;
    public alias: any;
    public contactType: string;
    selectedDropDown : string;
    public userName: string;
    public password: string;
    public getZohoConatacts: any;
    public zContacts: Set<SocialContact>;
    public allContactUsers: Array<ContactList>;
    public activeContactUsers: Array<ContactList>;
    public invalidContactUsers: Array<ContactList>;
    public unsubscribedContactUsers: Array<ContactList>;
    public nonActiveContactUsers: Array<ContactList>;
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
    //downloadUrl = this.authenticationService.REST_URL + "admin/"

    sortContacts = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
        { 'name': 'Created Time(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Time(DESC)', 'value': 'createdTime-DESC' },
    ];
    public contactsSort: any = this.sortContacts[0];

    sortContactUsers = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Email(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
    ];
    public contactsUsersSort: any = this.sortContactUsers[0];

    constructor(public contactService: ContactService, private authenticationService: AuthenticationService, private router: Router, private logger: Logger,
        private pagerService: PagerService, private pagination: Pagination, private referenceService: ReferenceService, ) {
        this.show = false;
        this.showAll = true;
        this.showEdit = false;
        this.showManageContactData = true;
        this.allContactUsers = new Array<ContactList>();
        this.activeContactUsers = new Array<ContactList>();
        this.invalidContactUsers = new Array<ContactList>();
        this.unsubscribedContactUsers = new Array<ContactList>();
        this.nonActiveContactUsers = new Array<ContactList>();
        this.userListIds = new Array<UserListIds>();
        this.activeUsersCount = 0;
        this.inActiveUsersCount = 0;
        this.invlidContactsCount = 0;
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
    }

    /*searchDisableValue() {
        console.log( this.searchKey );
        if ( this.searchKey !== null || this.searchKey.length !== 0 ) {
            this.searchDisable = false;
        }
        if ( this.searchKey.length == 0 || this.searchKey == '' ) {
            this.searchDisable = true;
        }
    }*/
    
    searchContactTitelName() {
            console.log( this.searchKey );
            this.pagination.searchKey = this.searchKey;
            this.pagination.pageIndex = 1;
            if ( this.currentContactType == null || (this.currentContactType == null && this.searchKey == "")) {
                this.loadContactLists( this.pagination );
            }
            else if ( this.currentContactType == "all_contacts" || (this.currentContactType == "all_contacts" && this.searchKey == "" )) {
                this.all_Contacts( this.pagination );
            } else if ( this.currentContactType == "active_contacts" || (this.currentContactType == "active_contacts" && this.searchKey == "")) {
                this.active_Contacts( this.pagination );
            } else if (this.currentContactType == "invalid_contacts" || (this.currentContactType == "invalid_contacts" && this.searchKey == "" )) {
                this.invalid_Contacts( this.pagination );
            } else if ( this.currentContactType == "unSubscribed_contacts" || (this.currentContactType == "unSubscribed_contacts" && this.searchKey == "")) {
                this.unSubscribed_Contacts( this.pagination );
            } else if ( this.currentContactType == "nonActive_contacts" || (this.currentContactType == "nonActive_contacts" && this.searchKey == "")) {
                this.nonActive_Contacts( this.pagination );
            }
       
       /* if( this.currentContactType=="null") {
            this.loadContactLists( this.pagination );
        }
        else if ( this.currentContactType == "all_contacts" ) {
            this.all_Contacts( this.pagination );
        } else if ( this.currentContactType == "active_contacts" ) {
            this.active_Contacts( this.pagination );
        } else if ( this.currentContactType == "invalid_contacts" ) {
            this.invalid_Contacts( this.pagination );
        } else if ( this.currentContactType == "unSubscribed_contacts" ) {
            this.unSubscribed_Contacts( this.pagination );
        } else if ( this.currentContactType == "nonActive_contacts" ) {
            this.nonActive_Contacts( this.pagination );
        }*/
    }
    
    contactListNameLength(title: string) {
        if (title.length > 25) { title = title.substring(0, 25) + '....'; }
        return title;
        }

    selectedSortByValue( event: any ) {
        this.contactsSort = event;
        const sortedValue = this.contactsSort.value;
        if ( sortedValue !== '' ) {
            const options: string[] = sortedValue.split( '-' );
            this.sortcolumn = options[0];
            this.sortingOrder = options[1];
        } else {
            this.sortcolumn = null;
            this.sortingOrder = null;
        }
        this.pagination.pageIndex = 1;
        this.pagination.sortcolumn = this.sortcolumn;
        this.pagination.sortingOrder = this.sortingOrder;
        this.loadContactLists( this.pagination );
    }

    userSelectedSortByValue( event: any ) {
        this.contactsUsersSort = event;
        const sortedValue = this.contactsUsersSort.value;
        if ( sortedValue !== '' ) {
            const options: string[] = sortedValue.split( '-' );
            this.sortcolumn = options[0];
            this.sortingOrder = options[1];
        } else {
            this.sortcolumn = null;
            this.sortingOrder = null;
        }
        this.pagination.pageIndex = 1;
        this.pagination.sortcolumn = this.sortcolumn;
        this.pagination.sortingOrder = this.sortingOrder;
        if ( this.currentContactType == null ) {
            this.loadContactLists( this.pagination );
        }
        else if ( this.currentContactType == "all_contacts" ) {
            this.all_Contacts( this.pagination );
        } else if ( this.currentContactType == "active_contacts" ) {
            this.active_Contacts( this.pagination );
        } else if ( this.currentContactType == "invalid_contacts" ) {
            this.invalid_Contacts( this.pagination );
        } else if ( this.currentContactType == "unSubscribed_contacts" ) {
            this.unSubscribed_Contacts( this.pagination );
        } else if ( this.currentContactType == "nonActive_contacts" ) {
            this.nonActive_Contacts( this.pagination );
        }
    }

    loadContactLists( pagination: Pagination ) {
        //this.pagination.isLoading = true;
        this.referenceService.loading(this.httpRequestLoader, true);
        this.pagination.maxResults = 12;
        this.contactService.loadContactLists( pagination )
            .subscribe(
            ( data: any ) => {
                this.logger.info( data );
                //this.pagination.isLoading = false;
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
                /*for ( let i = 0; i < data.listOfUserLists.length; i++ ) {
                  this.names.push(data.listOfUserLists[i].name.toLowerCase().trim());
                }*/
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
                this.names.push(data.names);
                  this.logger.log(this.names);
            },
            error => {
                this.logger.error( error )
            },
            () => this.logger.info( "MangeContactsComponent loadContactListsName() finished" )
            )
    }
    
    setPage( page: number, ) {
        this.pagination.pageIndex = page;
        if ( this.currentContactType == null ) {
            this.loadContactLists( this.pagination );
        }
        else if ( this.currentContactType == "all_contacts" ) {
            this.all_Contacts( this.pagination );
        } else if ( this.currentContactType == "active_contacts" ) {
            this.active_Contacts( this.pagination );
        } else if ( this.currentContactType == "invalid_contacts" ) {
            this.invalid_Contacts( this.pagination );
        } else if ( this.currentContactType == "unSubscribed_contacts" ) {
            this.unSubscribed_Contacts( this.pagination );
        } else if ( this.currentContactType == "nonActive_contacts" ) {
            this.nonActive_Contacts( this.pagination );
        }
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

   // http://aravindu.com/xtremand-rest/admin/userlist/{{contactList.id}}/download?access_token={{access_token}}"
    downloadContactList( contactListId: number ) {
        this.contactService.downloadContactList( contactListId )
            .subscribe(
            data => this.downloadFile( data ),
            error => this.logger.error( error ),
            () => this.logger.info( "download completed" )
            );
    }
/*
    downloadFile(data: any){
        var blob = new Blob([data], { type: 'text/csv' });
        var url= window.URL.createObjectURL(blob);
        window.open(url);
    }*/
    
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
   /*downloadFile( data ) {
    let blob: Blob = data.blob();
    window['saveAs']( blob, 'UserList.csv' );
}*/
    googleContactsSynchronizationAuthentication( contactListId: number ) {
        swal( { title: 'Sychronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        this.contactService.googleLogin()
            .subscribe(
            data => {
                this.storeLogin = data;
                console.log( data );
                if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                    console.log( "AddContactComponent googleContacts() Authentication Success" );
                    this.googleContactsSyncronize( contactListId );
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

    googleContactsSyncronize( contactListId: number ) {
        this.socialContact.socialNetwork = "GOOGLE";
        this.logger.info( "googleContactsSyncronize() socialNetWork" + this.socialContact.socialNetwork );
        this.logger.info( "googleContactsSyncronize() ContactListId" + contactListId );
        this.contactService.googleContactsSynchronize( contactListId, this.socialContact )
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

    zohoContactsSynchronizationAuthentication( contactListId: number ) {
        this.socialContact.socialNetwork = "ZOHO";
        $( "#myModal .close" ).click()
        swal( { title: 'Sychronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        for ( let i = 0; i < this.contactLists.length; i++ ) {
            if ( this.contactLists[i].id == contactListId ) {
                this.contactType = this.contactLists[i].contactType;
            }
        }
        this.contactService.getZohoContacts( this.userName, this.password, this.contactType )
            .subscribe(
            data => {
                this.getZohoConatacts = data;
                this.zContacts = new Set<SocialContact>();
                this.zohoContactsSyncronize( contactListId )
            },
            error => this.logger.error( error ),
            () => this.logger.log( "zohocontact data :" + JSON.stringify( this.getZohoConatacts.contacts ) )
            );
    }

    zohoContactsSyncronize( contactListId: number ) {
        this.socialContact.socialNetwork = "ZOHO";
        for ( let i = 0; i < this.contactLists.length; i++ ) {
            if ( this.contactLists[i].id == contactListId ) {
                this.contactType = this.contactLists[i].contactType;
            }
        }
        this.socialContact.contactType = this.contactType;
        this.socialContact.contacts = this.getZohoConatacts.contacts;
        this.logger.info( "zohoSyncronize() contactType:" + this.contactType );
        this.logger.info( "zohoSyncronize() socialNetWork:" + this.socialContact.socialNetwork );
        this.logger.info( "zohoContactsSyncronize() ContactListId:" + contactListId );
        this.logger.info( "zohoSyncronize() userName:" + this.userName );
        this.logger.info( "zohoContactsSyncronize() passward:" + this.password );
        this.contactService.zohoContactsSynchronize( contactListId, this.socialContact )
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
            () => this.logger.info( "zohoContactsSyncronize() completed" )
            );
        this.synchronizationSucessMessage = false;
    }

    salesforceContactsSynchronizationAuthentication( contactListId: number ) {
        this.socialContact.socialNetwork = "salesforce";
        swal( { title: 'Sychronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        this.logger.info( "socialContacts" + this.socialContact.socialNetwork );
        this.contactService.salesforceLogin()
            .subscribe(
            data => {
                this.storeLogin = data;
                console.log( data );
                if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                    console.log( "AddContactComponent salesforce() Authentication Success" );
                    this.salesforceContactsSyncronize( contactListId );

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

    salesforceContactsSyncronize( contactListId: number ) {
        this.socialContact.socialNetwork = "SALESFORCE";
        for ( let i = 0; i < this.contactLists.length; i++ ) {
            if ( this.contactLists[i].id == contactListId ) {
                this.alias = this.contactLists[i].alias;
                this.contactType = this.contactLists[i].contactType;
            }
        }
        this.logger.info( "alias Value:" + this.alias );
        this.logger.info( "contactType Value:" + this.contactType );
        this.socialContact.alias = this.alias;
        this.socialContact.contactType = this.contactType;
        this.logger.info( "salesforceContactsSyncronize() socialNetWork" + this.socialContact.socialNetwork );
        this.logger.info( "salesforceContactsSyncronize() ContactListId" + contactListId );
        this.contactService.salesforceContactsSynchronize( contactListId, this.socialContact )
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
            () => this.logger.info( "salesforceContactsSyncronize() completed" )
            );
        this.synchronizationSucessMessage = false;
    }


    editContactList( contactSelectedListId: number ) {
        this.selectedContactListId = contactSelectedListId;
        this.showAll = false;
        this.showEdit = true;
        this.show = false;
        $( "#pagination" ).hide();
    }

    backToManageContactPage() {
        this.invalidDeleteSucessMessage = false;
        this.loadContactListsNames();
        this.allselectedUsers.length = 0;
        $('[name="campaignContact[]"]').prop('checked', false);
        //this.isContactList = false;
        $('#user_list_tb tr').removeClass("contact-list-selected");
        $('[name="invalidContact[]"]').prop('checked', false);
        $('#user_list_tb tr').removeClass("invalid-contacts-selected");
        this.selectedInvalidContactIds = [];
        //$('#row_'+contactId).removeClass('contact-list-selected');
        this.invalidRemovableContacts.length = 0;
        this.selectedContactListIds = [];
        this.emptyContactsUsers = false;
        this.show = false;
        this.deleteSucessMessage = false;
        this.deleteErrorMessage = false;
        this.contactListUsersError = false;
        this.contactListNameError = false;
        this.synchronizationSucessMessage = false;
        this.model.contactListName = null;
        this.showAll = true;
        this.showEdit = false;
        $( "#showMessage" ).hide();
        this.showAllContactData = false;
        this.showManageContactData = true;
        this.pagination = new Pagination();
        this.currentContactType = null;
        this.loadContactLists( this.pagination );
        $( "#pagination" ).show();
        this.contactsCount();
        this.activeUsersCount = 0;
        this.inActiveUsersCount = 0;
        this.allContactData = false;
        this.activeContactsData = false;
        this.invalidContactData = false;
        this.unsubscribedContactsData = false;
        this.nonActiveContactsData = false;
    }

    backToEditContactPage() {
        this.showAll = false;
        this.showEdit = true;
    }
    
    update(user:User) {
        //this.showAll = true;
       // this.showEdit = false; 
        this.backToManageContactPage();
    }
    
    onChangeAllContactUsers( event: Event ) {
        this.selectedDropDown = event.target["value"];
        if ( this.currentContactType == "all_contacts" && this.selectedDropDown == "all" ) {
            try{
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
                $('#checkAllExistingContacts').prop("checked",false);
                //this.selectedDropDown = "all";
                //this.getAllFilteredResults(this.pagination);
            }catch(error){
                console.log(error, "getSelectedContacts","ManageContactComponent");
            }
            this.all_Contacts( this.pagination );
        } else if ( this.currentContactType == "active_contacts" && this.selectedDropDown == "all") {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            this.active_Contacts( this.pagination );
        } else if ( this.currentContactType == "invalid_contacts" && this.selectedDropDown == "all") {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            this.invalid_Contacts( this.pagination );
        } else if ( this.currentContactType == "unSubscribed_contacts" && this.selectedDropDown == "all" ) {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            this.unSubscribed_Contacts( this.pagination );
        } else if ( this.currentContactType == "nonActive_contacts" && this.selectedDropDown == "all") {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            this.nonActive_Contacts( this.pagination );
        }
        
        else if( this.currentContactType == "all_contacts" && this.selectedDropDown == "page" ) {
            try{
                this.pagination.maxResults = 10;
                this.pagination.pageIndex = 1;
                    $('#checkAllExistingContacts').prop("checked",true);
                    //this.selectedDropDown = "all";
                    //this.getAllFilteredResults(this.pagination);
                }catch(error){
                    console.log(error, "getSelectedContacts","ManageContactComponent");
                }
            this.all_Contacts( this.pagination );
        } else if ( this.currentContactType == "active_contacts" && this.selectedDropDown == "page") {
            this.pagination.maxResults = 10;
            this.active_Contacts( this.pagination );
        } else if ( this.currentContactType == "invalid_contacts" && this.selectedDropDown == "page") {
            this.pagination.maxResults = 10;
            this.invalid_Contacts( this.pagination );
        } else if ( this.currentContactType == "unSubscribed_contacts" && this.selectedDropDown == "page" ) {
            this.pagination.maxResults = 10;
            this.unSubscribed_Contacts( this.pagination );
        } else if ( this.currentContactType == "nonActive_contacts" && this.selectedDropDown == "page") {
            this.pagination.maxResults = 10;
            this.nonActive_Contacts( this.pagination );
        }
    }
    
    all_Contacts( pagination: Pagination ) {
        //this.pagination.maxResults = 12;
        this.loadContactListsNames();
        this.logger.log( pagination );
        this.contactService.loadAllContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.allContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    this.logger.info( this.allContactUsers );
                    pagination = this.pagerService.getPagedItems( pagination, this.allContactUsers );
                    this.logger.log( data );
                }
                if (this.allContactUsers.length == 0) {
                    this.emptyContactsUsers = true;
                    this.hidingContactUsers = false;
                 }
                 else {
                     this.emptyContactsUsers = false;
                     this.hidingContactUsers = true;
                     this.pagedItems = null ;
                 }
                
                var contactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedContactListIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                this.logger.log("Contact Ids"+contactIds);
                this.logger.log("Selected Contact Ids"+this.selectedContactListIds);
                /*if(items.length==10){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }*/
                if(items.length==pagination.totalRecords || items.length == this.pagination.pagedItems.length){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }
    
/*    all_ContactsUsersTotalRecords( pagination: Pagination ) {
        this.pagination.maxResults = this.pagination.totalRecords;
        this.contactService.loadAllContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.tempAllContactUsers = data.listOfUsers;
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }*/
    
    validateContactName(contactName:string){
        if(contactName.replace(/\s\s+/g, '').length == 0){ 
            this.noSaveButtonDisable = true;
        }else{
            this.noSaveButtonDisable = false;
        }
        
        let lowerCaseContactName = contactName.toLowerCase().trim();
        var list = this.names[0];
        console.log(list);
        if($.inArray(lowerCaseContactName, list) > -1){
            this.isValidContactName = true;  
            $(".ng-valid[required], .ng-valid.required").css("color", "red");
        }else{
            $(".ng-valid[required], .ng-valid.required").css("color", "Black");
            this.isValidContactName = false;
        }
    }

    allContactsDataShowing() {
        this.showAllContactData = true;
        this.showManageContactData = false;
        this.noSaveButtonDisable = true;
        this.allContactData = true;
        this.pagination = new Pagination();
        this.currentContactType = "all_contacts";
        this.all_Contacts( this.pagination );
        //this.all_ContactsUsersTotalRecords( this.pagination );
    }

    activeContactsDataShowing() {
        this.showAllContactData = true;
        this.showManageContactData = false;
        this.activeContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "active_contacts";
        this.active_Contacts( this.pagination );
    }

    invalidContactsDataShowing() {
        this.showAllContactData = true;
        this.showManageContactData = false;
        this.invalidContactData = true;
        this.pagination = new Pagination();
        this.currentContactType = "invalid_contacts";
        this.invalid_Contacts( this.pagination );
    }

    unSubscribedContactsDataShowing() {
        this.showAllContactData = true;
        this.showManageContactData = false;
        this.unsubscribedContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "unSubscribed_contacts";
        this.unSubscribed_Contacts( this.pagination );
    }

    nonActiveContactsDataShowing() {
        this.showAllContactData = true;
        this.showManageContactData = false;
        this.nonActiveContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "nonActive_contacts";
        this.nonActive_Contacts( this.pagination );
    }

    active_Contacts( pagination: Pagination ) {
        //this.pagination.maxResults = 12;
        this.contactService.loadActiveContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.activeContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.activeContactUsers );
                    this.logger.log( data );
                }
                
                if (this.activeContactUsers.length == 0) {
                    this.emptyContactsUsers = true;
                    this.hidingContactUsers = false;
                 }
                 else {
                     this.emptyContactsUsers = false;
                    // $( "#hidingOfContactUsers" ).hide();
                     this.hidingContactUsers = true;
                     this.pagedItems = null ;
                 }
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    invalid_Contacts( pagination: Pagination ) {
       // this.pagination.maxResults = 12;
        this.contactService.loadInvalidContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.invalidContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.invalidContactUsers );
                    this.logger.log( data );
                    this.userListIds = data.listOfUsers;
                    this.logger.info( this.userListIds );
                }
                
                if (this.invalidContactUsers.length == 0) {
                    this.emptyContactsUsers = true;
                    this.hidingContactUsers = false;
                 }
                 else {
                     this.emptyContactsUsers = false;
                     this.hidingContactUsers = true;
                     this.pagedItems = null ;
                 }
                
                var contactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedInvalidContactIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                this.logger.log("inavlid contacts page pagination Object Ids"+contactIds);
                this.logger.log("selected inavalid contacts Ids"+this.selectedInvalidContactIds);
                /*for(let i=0; i< this.invalidRemovableContacts.length; i++){
                    var removePageIds =this.invalidRemovableContacts[i].id;
                    for(let j=0; j< this.pagination.pagedItems.length; j++){
                        var paginationIds =this.pagination.pagedItems[i].id;
                        if(removePageIds == paginationIds){
                        this.invalidRemovableContacts.splice(i,1);
                        this.selectedInvalidContactIds.splice(i,1);
                        console.log(this.invalidRemovableContacts);
                    }
                    }
                }*/
                if(items.length==pagination.totalRecords || items.length == this.pagination.pagedItems.length){
                    this.isInvalidHeaderCheckBoxChecked = true;
                }else{
                    this.isInvalidHeaderCheckBoxChecked = false;
                }
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    unSubscribed_Contacts( pagination: Pagination ) {
        //this.pagination.maxResults = 12;
        this.contactService.loadUnSubscribedContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.unsubscribedContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.unsubscribedContactUsers );
                    this.logger.log( data );
                }
                if (this.unsubscribedContactUsers.length == 0) {
                    this.emptyContactsUsers = true;
                    this.hidingContactUsers = false;
                 }
                 else {
                     this.emptyContactsUsers = false;
                     this.hidingContactUsers = true;
                     this.pagedItems = null ;
                 }
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    nonActive_Contacts( pagination: Pagination ) {
        //this.pagination.maxResults = 12;
        this.contactService.loadNonActiveContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.nonActiveContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.nonActiveContactUsers );
                    this.logger.log( data );
                }
                if (this.nonActiveContactUsers.length == 0) {
                    this.emptyContactsUsers = true;
                    this.hidingContactUsers = false;
                 }
                 else {
                     this.emptyContactsUsers = false;
                     this.hidingContactUsers = true;
                     this.pagedItems = null ;
                 }
            },

            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    checked( event: boolean ) {
        this.logger.info( "check value" + event )
        this.allContactUsers.forEach(( allContacts ) => {
            if ( event == true )
                allContacts.isChecked = true;
            else {
                allContacts.isChecked = false;
            }
        })
    }

    invalidContactsChecked( event: boolean ) {
        this.logger.info( "check value" + event )
        this.invalidContactUsers.forEach(( invalidContacts ) => {
            if ( event == true )
                invalidContacts.isChecked = true;
            else {
                invalidContacts.isChecked = false;
            }
        })
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
            for ( var i = 0; i < this.pagination.pagedItems.length; i++ ) {
                var object = {
                    "id": this.pagination.pagedItems[i].id,
                    "userName": null,
                    "emailId": this.pagination.pagedItems[i].emailId,
                    "firstName": this.pagination.pagedItems[i].firstName,
                    "lastName": this.pagination.pagedItems[i].lastName,
                    "mobileNumber": null,
                    "interests": null,
                    "occupation": null,
                    "description": null,
                    "websiteUrl": null,
                    "profileImagePath": null,
                    "userListIds": this.pagination.pagedItems[i].userListIds
                }
              // if(this.selectedInvalidContactIds != this.invalidRemovableContacts[i].id)
                this.invalidRemovableContacts.push( object );
                console.log( object );
        }
            this.invalidRemovableContacts = this.removeDuplicates(this.invalidRemovableContacts, 'id');
            this.selectedInvalidContactIds = this.referenceService.removeDuplicates(this.selectedInvalidContactIds);
        }else{
            $('[name="invalidContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("invalid-contacts-selected");
            if(this.pagination.maxResults==this.pagination.totalRecords){
                this.selectedInvalidContactIds = [];
                this.invalidRemovableContacts = [];
            }else{
              let paginationIdsArray = new Array;
                for(let j=0; j< this.pagination.pagedItems.length; j++){
                    var paginationIds = this.pagination.pagedItems[j].id; 
                    this.invalidRemovableContacts.splice(this.invalidRemovableContacts.indexOf(paginationIds), 1);
                }
               console.log('removed objects form else part');
               console.log(this.invalidRemovableContacts);
               let currentPageContactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
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
        if(this.selectedInvalidContactIds.length == this.pagination.pagedItems.length ){
            this.isInvalidHeaderCheckBoxChecked = true;
        }else{
            this.isInvalidHeaderCheckBoxChecked = false;
        }
    }
    
    checkAll(ev:any){
        if(ev.target.checked){
            console.log("checked");
            $('[name="campaignContact[]"]').prop('checked', true);
            let self = this;
            $('[name="campaignContact[]"]:checked').each(function(){
                var id = $(this).val();
                self.selectedContactListIds.push(parseInt(id));
                console.log(self.selectedContactListIds);
                $('#ContactListTable_'+id).addClass('contact-list-selected');
                for ( var i = 0; i < self.pagination.pagedItems.length; i++ ) {
                    var object = {
                        "emailId": self.pagination.pagedItems[i].emailId,
                        "firstName": self.pagination.pagedItems[i].firstName,
                        "lastName": self.pagination.pagedItems[i].lastName,
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
            if(this.pagination.maxResults==this.pagination.totalRecords){
                this.selectedContactListIds = [];
                this.allselectedUsers.length = 0;
            }else{
                let paginationIdsArray = new Array;
                for(let j=0; j< this.pagination.pagedItems.length; j++){
                    var paginationEmail = this.pagination.pagedItems[j].emailId; 
                    this.allselectedUsers.splice(this.allselectedUsers.indexOf(paginationEmail), 1);
                }
                let currentPageContactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
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
        if(this.selectedContactListIds.length == this.pagination.pagedItems.length ){
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
                        this.backToManageContactPage();
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
        this.all_Contacts( this.pagination );
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
                this.invalid_Contacts( this.pagination );
            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.invalidDeleteSucessMessage = false;
    }

    invalidContactsShowAlert() {
        //alert("invalidRemovableContacts="+this.invalidRemovableContacts.length);
        //alert("selectedInvalidContactIds="+this.selectedInvalidContactIds.length);
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
                this.activeUsersCount = data.activecontacts;
                this.inActiveUsersCount = data.nonactiveUsers;
                this.allContacts = data.allcontacts;
                this.invlidContactsCount = data.invalidUsers;
                this.unsubscribedContacts = data.unsubscribedUsers;
            },
            error => console.log( error ),
            () => console.log( "LoadContactsCount Finished" )
            );
    }

    convert() {
        var item = {
            "Email": "naresh@gmail.com",
            "FirstName": "Naresh",
            "Lastname": "Kotha"
        };
        var doc = new jsPDF();
        var col = ["Email", "FirstName", "LastName"];
        var rows = [];
        for ( var key in item ) {
            var temp = [key, item[key]];
            rows.push( temp );
        }
        doc.autoTable( col, rows );
        doc.save( 'Contacts.pdf' );
    }

    ngOnInit() {
        this.loadContactLists( this.pagination );
        this.contactsCount();
        this.loadContactListsNames();
        try {
            //Metronic.init();
            // Layout.init();
            //Demo.init();
            //Portfolio.init();
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
