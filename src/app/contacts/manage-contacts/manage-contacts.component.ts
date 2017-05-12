import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { User } from '../../core/models/user';
import { ConfirmOptions, Position } from 'angular2-bootstrap-confirm';
import { Positioning } from 'angular2-bootstrap-confirm/position';
import { Router, NavigationExtras } from "@angular/router";
import { Response } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Logger } from "angular2-logger/core";
import { SocialContact } from '../models/social-contact';
import { UserListIds } from '../models/user-listIds';
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';



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
    //styleUrls: ['../../../assets/css/ribbons.css'],
    providers: [SocialContact, Pagination]
})
export class ManageContactsComponent implements OnInit {
    public show: boolean = false;
    public socialContact: SocialContact;
    public googleSynchronizeButton: boolean;
    allContacts: number;
    invalidContacts: number;
    unsubscribedContacts: number;
    public storeLogin: any;

    activeUsersCount: number;
    inActiveUsersCount: number;
    invlidContactsCount: number;

    public contactLists: Array<ContactList>;
    selectedContactListId: number;
    showAll: boolean;
    showEdit: boolean;
    showAllContactData: boolean = false;
    showManageContactData: boolean = true;
    deleteSucessMessage: boolean;
    invalidDeleteSucessMessage: boolean;

    allContactData: boolean;
    activeContactsData: boolean;
    invalidContactData: boolean;
    unsubscribedContactsData: boolean;
    nonActiveContactsData: boolean;

    contactListNameError: boolean;
    contactListUsersError: boolean;

    public contactListName: string;


    public removeIds: number;
    public invalidIds: Array<UserListIds>;
    public alias: any;
    public contactType: string;
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

    users: User[];
    access_token: string;
    pager: any = {};
    pagedItems: any[];

    public totalRecords: number;
    public zohoImage: string = 'assets/admin/pages/media/works/zoho.png';
    public googleImage: string = 'assets/admin/pages/media/works/gl.jpg';
    public salesforceImage: string = 'assets/admin/pages/media/works/sf.jpg';
    public normalImage: string = 'assets/admin/pages/media/works/img1.jpg';
    public currentContactType: string = null;

    constructor( private contactService: ContactService, private authenticationService: AuthenticationService, private router: Router, private logger: Logger,
        private pagerService: PagerService, private pagination: Pagination ) {
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
    }

    loadContactLists( pagination: Pagination ) {
        this.contactService.loadContactLists( pagination )
            .subscribe(
            ( data: any ) => {
                this.logger.info( data );
                this.contactLists = data.listOfUserLists;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.contactLists );
            },
            error => {

                this.logger.error( error )

            },
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
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
        }/*else {
        this.loadContactLists( this.pagination );
    }*/

    }

    /*setPagination(page: number){
        this.pager = this.pagerService.getPager(this.totalRecords, page,12);
        console.log(this.contactLists);
        this.pagedItems = this.contactLists.slice(this.pager.startIndex, this.pager.endIndex + 1);
        console.log( this.pagedItems);
    }
    */

    deleteContactList( contactListId: number ) {
        this.logger.info( "MangeContacts deleteContactList : " + contactListId );
        this.contactService.deleteContactList( contactListId )
            .subscribe(
            data => {
                console.log( "MangeContacts deleteContactList success : " + data );
                this.contactsCount();
                $( '#contactListDiv_' + contactListId ).remove();
                //swal( 'Deleted!', 'Your file has been deleted.', 'success' );
                this.loadContactLists( this.pagination );
                this.deleteSucessMessage = true;
                setTimeout( function() { $( "#showDeleteMessage" ).slideUp( 500 ); }, 2000 );
            },
            error => this.logger.error( error ),
            () => this.logger.info( "deleted completed" )
            );
        this.deleteSucessMessage = false;
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

            //this.deleteContactList(contactListId);
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
                swal( "Success!", "Google Sychronization Completed!", "success" );
                this.loadContactLists( this.pagination );
                this.contactsCount();
            },
            error => this.logger.error( error ),
            () => this.logger.info( "googleContactsSyncronize() completed" )
            );

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
                swal( "Success!", "Zoho Sychronization Completed!", "success" );
                this.loadContactLists( this.pagination );
                this.contactsCount();
            },

            error => this.logger.error( error ),
            () => this.logger.info( "zohoContactsSyncronize() completed" )
            );

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
                swal( "Success!", "Salesforce Sychronization Completed!", "success" );
                this.loadContactLists( this.pagination );
                this.contactsCount();
            },

            error => this.logger.error( error ),
            () => this.logger.info( "salesforceContactsSyncronize() completed" )
            );

    }


    downloadFile( data: Response ) {
        //var blob = new Blob([data], { type: 'application/vnd.ms-excel,text/csv'});
        let blob: Blob = data.blob();
        window['saveAs']( blob, 'UserList.csv' );
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
        this.show = false;
        this.deleteSucessMessage = false;
        this.contactListUsersError = false;
        this.contactListNameError = false;

        this.contactListName = null;
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

    all_Contacts( pagination: Pagination ) {
        this.logger.log( pagination );
        this.contactService.loadAllContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.allContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                this.logger.info( this.allContactUsers );
                pagination = this.pagerService.getPagedItems( pagination, this.allContactUsers );
                this.logger.log( data );

            },

            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    allContactsDataShowing() {
        this.showAllContactData = true;
        this.showManageContactData = false;
        this.allContactData = true;
        this.pagination = new Pagination();
        this.currentContactType = "all_contacts";
        this.all_Contacts( this.pagination );

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

        this.contactService.loadActiveContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.activeContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.activeContactUsers );
                this.logger.log( data );
            },

            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    invalid_Contacts( pagination: Pagination ) {
        this.contactService.loadInvalidContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.invalidContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.invalidContactUsers );
                this.logger.log( data );
                this.userListIds = data.listOfUsers;
                this.logger.info( this.userListIds );

            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    unSubscribed_Contacts( pagination: Pagination ) {

        this.contactService.loadUnSubscribedContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.unsubscribedContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.unsubscribedContactUsers );
                this.logger.log( data );
            },

            error => console.log( error ),
            () => console.log( "finished" )
            );
    }


    nonActive_Contacts( pagination: Pagination ) {

        this.contactService.loadNonActiveContacts( pagination )
            .subscribe(
            ( data: any ) => {
                this.nonActiveContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.nonActiveContactUsers );
                this.logger.log( data );
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

    saveSelectedUsers() {
        var selectedUserIds = new Array();
        let selectedUsers = new Array<User>();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var userInformation = $( this ).val().split( ',' );
            let user = new User();
            user.emailId = userInformation[0];
            user.firstName = userInformation[1];
            user.lastName = userInformation[2];
            selectedUsers.push( user );
        });
        console.log( selectedUsers );
        this.logger.info( "SelectedUserIDs:" + selectedUserIds );
        if ( this.contactListName != null ) {
            if ( selectedUsers.length != 0 ) {
                this.contactService.saveContactList( this.contactListName, selectedUsers )
                    .subscribe(
                    data => {
                        data = data;
                        //$( "#uploadContactsMessage" ).show();
                        //this.router.navigateByUrl( '/home/contacts/manageContacts' )
                        this.backToManageContactPage();
                        //this.contactService.successMessage = true;
                        this.show = true;
                        setTimeout( function() { $( "#showMessage" ).slideUp( 500 ); }, 2000 );
                    },

                    error => this.logger.info( error ),
                    () => this.logger.info( "allcontactComponent saveSelectedUsers() finished" )
                    )
            } else {
                this.contactListUsersError = true;
                this.contactListNameError = false;
                // setTimeout(function() { $("#ContactsErrorMessage").slideUp(500);}, 2000);
                // this.logger.log("Please select the users")
            }
        }
        else {
            this.contactListUsersError = false;
            this.contactListNameError = true;
            //setTimeout(function() { $("#NameErrorMessage").slideUp(500);}, 2000);
            this.logger.error( "AllContactComponent saveSelectedUsers() ContactList Name Error" );
        }
    }

    cancelAllContactsCancel() {
        this.contactListName = null;
        this.all_Contacts( this.pagination );
        this.contactListUsersError = false;
        this.contactListNameError = false;
    }

    removeContactListUsers() {
        var removeUserIds = new Array();
        let invalidUsers = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            this.invalidIds = $( this ).val();
            removeUserIds.push( this.invalidIds );
            this.invalidIds = this.removeUserIds;
        });
        this.logger.info( removeUserIds );
        for ( var i = 0; i < this.userListIds.length; i++ ) {
            if ( removeUserIds[i] == this.userListIds[i].id ) {
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
                invalidUsers.push( object );

            }
        }
        this.logger.info( invalidUsers );
        this.contactService.removeInvalidContactListUsers( invalidUsers )
            .subscribe(
            data => {
                data = data;
                this.logger.log( data );
                console.log( "update Contacts ListUsers:" + data );
                //swal( 'Deleted!', 'Your file has been deleted.', 'success' );

                $.each( removeUserIds, function( index: number, value: any ) {
                    $( '#row_' + value ).remove();
                    console.log( index + "value" + value );
                });
                this.invalidDeleteSucessMessage = true;
                setTimeout( function() { $( "#showDeleteMessage" ).slideUp( 500 ); }, 2000 );
                //swal( 'Deleted!', 'Your file has been deleted.', 'success' );
                this.invalid_Contacts( this.pagination );
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
        if ( removeUserIds.length != 0 ) {
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
                self.removeContactListUsers();
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
        // $( "#allContactdata" ).hide();
        this.loadContactLists( this.pagination );
        this.contactsCount();
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
    }
}
