import { Component, OnInit, Input } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { User } from '../../core/models/User';
import { FormsModule, FormControl } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ManageContactsComponent } from '../manage-contacts/manage-contacts.component';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Logger } from "angular2-logger/core";
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';

declare var Metronic : any;
declare var Layout : any;
declare var Demo : any;
declare var Portfolio : any;

declare var $: any;
declare var swal: any;


@Component({
  selector: 'app-edit-contacts',
  templateUrl: './edit-contacts.component.html',
  styleUrls: ['../../../assets/css/button.css',
              '../../../assets/css/numbered-textarea.css'],
              providers:[Pagination]
})
export class EditContactsComponent implements OnInit {
    @Input() contacts: User[];
    @Input() totalRecords:number;

    @Input() contactListId: number;
    @Input() selectedContactListId: number;

    @Input( 'value' ) value: number;
    public clipBoard: boolean = false;
    public saveAddcontactUsers: boolean;
    public saveCopyfromClipboardUsers: boolean;
    public saveCsvFileUsers: boolean;
    public clipboardTextareaText : string;
    pagedItems: any[];
    isAvailable = false;
    public clipboardUsers: Array<User>;
    public csvFileUsers: Array<User>;
    public uploader: FileUploader;
    public clickBoard: boolean = false;
    public users: Array<User>;
    activeUsersCount : number;
    inActiveUsersCount: number;
    allContacts : number;
    invlidContactsCount : number;
    unsubscribedContacts : number;
    public allUsers : number;
    checkingLoadContactsCount : boolean;
    showAllContactData: boolean = false;
    showEditContactData: boolean = true;
    
    activeContactsData : boolean;
    invalidContactData : boolean;
    unsubscribedContactsData : boolean;
    nonActiveContactsData : boolean;
    public currentContactType:string=null;
    public activeContactUsers: Array<ContactList>;
    public invalidContactUsers: Array<ContactList>;
    public unsubscribedContactUsers: Array<ContactList>;
    public nonActiveContactUsers: Array<ContactList>;
    
    constructor( private contactService: ContactService, private manageContact: ManageContactsComponent,
        private authenticationService: AuthenticationService, private logger: Logger,
        private pagerService: PagerService, private pagination: Pagination) {
        this.users = new Array<User>();
        this.clipboardUsers = new Array<User>();
        this.csvFileUsers = new Array<User>();
    }

    checked( event: boolean ) {
        this.logger.info( "check value" + event )
        this.contacts.forEach(( contacts ) => {
            if ( event == true )
                contacts.isChecked = true;
            else
                contacts.isChecked = false;
        })
    }

    
    
    fileChange( input: any ) {
        this.saveCsvFileUsers = true;
        this.saveAddcontactUsers = false;
        this.saveCopyfromClipboardUsers = false;
        this.readFiles( input.files );
        this.logger.info( "coontacts preview" );
        $( "#sample_editable_1" ).hide();
        $( "#file_preview" ).show();
        $( "button#add_contact" ).prop( 'disabled', true );
        $( "button#copyFrom_clipboard" ).prop( 'disabled', true );
    }

    readFile( file: any, reader: any, callback: any ) {
        reader.onload = () => {
            callback( reader.result );
        }

        reader.readAsText( file );
    }

    readFiles( files: any, index = 0 ) {

        let reader = new FileReader();
        reader.readAsText( files[0] );
        this.logger.info( files[0] );
        //var lines = new Array();
        var self = this;
        reader.onload = function( e: any ) {
            var contents = e.target.result;
            var allTextLines = contents.split( /\r\n|\n/ );
            for ( var i = 1; i < allTextLines.length; i++ ) {
                var data = allTextLines[i].split( ',' );
                if ( data[0].trim().length > 0 ) {
                    let user = new User();
                    user.emailId = data[0];
                    user.firstName = data[1];
                    user.lastName = data[2];
                    self.csvFileUsers.push( user );
                    self.contacts.push( user );
                }
            }
            console.log( "AddContacts : readFiles() contacts " + JSON.stringify( self.csvFileUsers ) );
        }
    }

    updateContactList( contactListId: number, isValid: boolean, isclick: boolean ) {
        if ( this.users[0].emailId != undefined ) {
            this.logger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.users ) );
            this.contactService.updateContactList( this.contactListId, this.users )
                .subscribe(
                (data:any) => {
                    data = data;
                    this.activeUsersCount = data.activecontacts;
                    this.inActiveUsersCount = data.nonactiveUsers;
                    this.allContacts = data.allcontacts;
                    this.allUsers = this.allContacts;
                    this.invlidContactsCount = data.invalidUsers;
                    this.unsubscribedContacts = data.unsubscribedUsers;
                    this.logger.info( "update Contacts ListUsers:" + data );
                    this.manageContact.editContactList( this.contactListId );
                    $( "tr.new_row" ).each( function() {
                        $( this ).remove();
                        $( "button#upload_csv" ).prop( 'disabled', false );
                        $( "button#copyFrom_clipboard" ).prop( 'disabled', false );
                        $( "#saveContactsMessage" ).show();
                        setTimeout(function() { $("#saveContactsMessage").slideUp(500); }, 2000);
                    });
                    this.editContactListLoadAllUsers(this.selectedContactListId,this.pagination);
                    //this.users.length = 0;
                    this.cancelContacts();
                },
                error => this.logger.error( error ),
                () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
                )
        }
    }

    updateCsvContactList( contactListId: number, isValid: boolean, isclick: boolean ) {
        this.logger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.csvFileUsers ) );
        this.contactService.updateContactList( this.contactListId, this.csvFileUsers )
            .subscribe(
            data => {
                data = data;
                this.logger.info( "update Contacts ListUsers:" + data );
                this.manageContact.editContactList( this.contactListId );
                $( "tr.new_row" ).each( function() {
                    $( this ).remove();
                });
                this.users.length = 0;
                $( "#saveContactsMessage2" ).show();
                setTimeout(function() { $("#saveContactsMessage2").slideUp(500); }, 2000);
                $( "button#add_contact" ).prop( 'disabled', false );
                $( "button#copyFrom_clipboard" ).prop( 'disabled', false );
                $( "#uploadCsvUsingFile" ).hide();
                $( "#sample_editable_1" ).show();
                $( "#file_preview" ).hide();
                this.editContactListLoadAllUsers(this.selectedContactListId,this.pagination);
            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
    }

    removeContactListUsers( contactListId: number ) {
        var removeUserIds = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
        });
        this.logger.info( removeUserIds );
        this.contactService.removeContactList( this.contactListId, removeUserIds )
            .subscribe(
            (data:any) => {
                data = data;
                this.activeUsersCount = data.activecontacts;
                this.inActiveUsersCount = data.nonactiveUsers;
                this.allContacts = data.allcontacts;
                this.allUsers = this.allContacts;
                this.invlidContactsCount = data.invalidUsers;
                this.unsubscribedContacts = data.unsubscribedUsers;
                console.log( "update Contacts ListUsers:" + data );
                swal( 'Deleted!', 'Your file has been deleted.', 'success' );
                $.each( removeUserIds, function( index: number, value: any ) {
                    $( '#row_' + value ).remove();
                    console.log( index + "value" + value );
                });
                this.editContactListLoadAllUsers(this.selectedContactListId,this.pagination);

            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
    }

    showAlert( contactListId: number ) {

        var removeUserIds = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
        });
        this.logger.info( "userIdForChecked" + removeUserIds );
        if ( removeUserIds.length != 0 ) {
            this.logger.info( "contactListId in sweetAlert() " + this.contactListId );
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
                self.removeContactListUsers( contactListId );
            })
        }
    }
    addRow() {
        this.users.push( new User() );
        this.saveAddcontactUsers = true;
        this.saveCopyfromClipboardUsers = false;
        this.saveCsvFileUsers = false;
        $( "button#copyFrom_clipboard" ).prop( 'disabled', true );
        $( "button#upload_csv" ).prop( 'disabled', true );
        $( "input[type='file']" ).attr( "disabled", true );
    }
    cancelRow( rowId: number ) {
        if ( rowId !== -1 ) {
            this.users.splice( rowId, 1 );
        }
    }

    removeCsv() {
        $( "button#copyFrom_clipboard" ).prop( 'disabled', false );
        $( "button#add_contact" ).prop( 'disabled', false );
        this.users.length = 0;
        $( "#file_preview" ).hide();
        $( "#sample_editable_1" ).show();
        this.csvFileUsers.length = null;
    }


    copyFromClipboard() {
        this.clipboardTextareaText = "";
        this.clickBoard = true;
        this.saveAddcontactUsers = false;
        this.saveCopyfromClipboardUsers = true;
        this.saveCsvFileUsers = false;
        $( "button#add_contact" ).prop( 'disabled', true );
        $( "button#upload_csv" ).prop( 'disabled', true );
        $( "input[type='file']" ).attr( "disabled", true );
    }


    clipboardShowPreview() {

        var selectedDropDown = $( "select.opts:visible option:selected " ).val();
        var splitValue;
        if ( selectedDropDown == "DEFAULT" ) {
            swal( "Please Select the Delimeter Type" );
            return false;
        }
        if (  this.clipboardTextareaText == undefined ) {
            swal( "value can't be null" );
        }
        else {
            if ( selectedDropDown == "commaSeperated" )
                splitValue = ",";
            else if ( selectedDropDown == "TabSeperated" )
                splitValue = "\t";
        }

        this.logger.info( "selectedDropDown:" + selectedDropDown );
        this.logger.info( splitValue );
        var startTime = new Date();
        $( "#clipBoardValidationMessage" ).html( '' );
        var self = this;
        var allTextLines = this.clipboardTextareaText.split( "\n" );
        this.logger.info( "allTextLines: " + allTextLines );
        this.logger.info( "allTextLines Length: " + allTextLines.length );
        var isValidData: boolean = true;
        for ( var i = 0; i < allTextLines.length; i++ ) {
            var data = allTextLines[i].split( splitValue );
            if ( !this.validateEmailAddress( data[0] ) ) {
                $( "#clipBoardValidationMessage" ).append( "<h4 style='color:#f68a55;'>" + "Email Address is not valid for Row:" + ( i + 1 ) + " -- Entered Email Address: " + data[0] + "</h4>" );
                isValidData = false;
            }
            this.clipboardUsers.length = 0;
            //this.contacts.length = 0;
            this.pagination.pagedItems.length = 0;
        }
        if ( isValidData ) {
            for ( var i = 0; i < allTextLines.length; i++ ) {
                var data = allTextLines[i].split( splitValue );
                let user = new User();

                switch ( data.length ) {
                    case 1:
                        user.emailId = data[0];
                        break;
                    case 2:
                        user.emailId = data[0];
                        user.firstName = data[1];
                        break;
                    case 3:
                        user.emailId = data[0];
                        user.firstName = data[1];
                        user.lastName = data[2];
                        break;
                }
                this.logger.info( user );
                this.clipboardUsers.push( user );
                self.pagination.pagedItems.push( user );
                $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            }
            var endTime = new Date();
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing started at: <b>" + startTime + "</b></h5>" );
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing Finished at: <b>" + endTime + "</b></h5>" );
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Total Number of records Found: <b>" + allTextLines.length + "</b></h5>" );
        } else {
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( "#clipBoardValidationMessage" ).show();
            $( "#file_preview" ).hide();
        }
        this.logger.info( this.clipboardUsers );
    }

    validateEmailAddress( emailId: string ) {
        var EMAIL_ID_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_ID_PATTERN.test( emailId );
    }
    validateName( name: string ) {
        return ( name.trim().length > 0 );
    }

    updateContactListFromClipBoard( contactListId: number, isValid: boolean, isclick: boolean ) {
        this.logger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.clipboardUsers ) );
        this.contactService.updateContactList( this.contactListId, this.clipboardUsers )
            .subscribe(
            data => {
                data = data;
                this.logger.info( "update Contacts ListUsers:" + data );
                this.manageContact.editContactList( this.contactListId );
                $( "tr.new_row" ).each( function() {
                    $( this ).remove();

                });
                this.clickBoard = false;
                $( "#saveContactsMessage1" ).show();
                setTimeout(function() { $("#saveContactsMessage1").slideUp(500); }, 2000);
                $( "button#add_contact" ).prop( 'disabled', false );
                $( "button#upload_csv" ).prop( 'disabled', false );
                this.clipboardUsers.length = 0;
                this.editContactListLoadAllUsers(this.selectedContactListId,this.pagination);

            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )

    }

    saveContacts( contactListId: number ) {
        if ( this.saveAddcontactUsers == true && this.saveCopyfromClipboardUsers == false && this.saveCsvFileUsers == false ) {
            this.updateContactList( this.contactListId, true, true );
        }

        if ( this.saveAddcontactUsers == false && this.saveCsvFileUsers == false && this.saveCopyfromClipboardUsers == true ) {
            this.updateContactListFromClipBoard( this.contactListId, true, true );
        }

        if ( this.saveAddcontactUsers == false && this.saveCopyfromClipboardUsers == false && this.saveCsvFileUsers == true ) {
            this.updateCsvContactList( this.contactListId, true, true );
        }
    }


    cancelContacts() {
        if ( this.saveAddcontactUsers == true && this.saveCopyfromClipboardUsers == false ) {
            $( "button#upload_csv" ).prop( 'disabled', false );
            $( "button#copyFrom_clipboard" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            this.users.length = 0;
        }
        if ( this.saveAddcontactUsers == false && this.saveCopyfromClipboardUsers == true ) {
            this.clickBoard = false;
            $( "button#add_contact" ).prop( 'disabled', false );
            $( "button#upload_csv" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            this.clipboardUsers.length = null;
        }
    }

   /* contactsCount() {
        this.contactService.loadContactsCount()
            .subscribe(
            data => {
                data
                this.activeUsersCount = data.activecontacts;
                this.inActiveUsersCount= data.nonactiveUsers;
                this.allContacts = data.allcontacts;
                this.invlidContactsCount = data.invalidUsers;
                this.unsubscribedContacts = data.unsubscribedUsers;
            },
            error => console.log( error ),
            () => console.log( "LoadEditContactsCount Finished" )
            );
    }*/
    
    editContactListLoadAllUsers( contactSelectedListId: number, pagination: Pagination) {
        this.logger.info( "manageContacts editContactList #contactSelectedListId " + contactSelectedListId );
        this.selectedContactListId = contactSelectedListId;
        //this.singleContactListTotalUsersCount = ("Contacts");
        //details set 
        /*this.activeUsersCount = 0;
        this.inActiveUsersCount= 0;
        this.allContacts = 0;
        this.invlidContactsCount = 0;
        this.unsubscribedContacts = 0;*/
        
        this.contactService.loadUsersOfContactList( contactSelectedListId,pagination ).subscribe(
            (data:any) => {
                this.logger.info( "MangeContactsComponent loadUsersOfContactList() data => " + JSON.stringify( data ) );
                this.contacts = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                this.logger.log(data);
                if ( this.checkingLoadContactsCount == true ) {
                    this.activeUsersCount = data.activecontacts;
                    this.inActiveUsersCount = data.nonactiveUsers;
                    this.allContacts = data.allcontacts;
                    this.allUsers = this.allContacts;
                    this.invlidContactsCount = data.invalidUsers;
                    this.unsubscribedContacts = data.unsubscribedUsers;
                }
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.contacts );
                this.checkingLoadContactsCount=false;
                this.logger.log(this.allUsers);
            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadUsersOfContactList() finished" )
        )

    }

/*    setPage( page: number,) {
        this.pagination.pageIndex = page;
            this.editContactListLoadAllUsers(this.selectedContactListId,this.pagination );
        }*/
    
    
    setPage( page: number,) {
        this.pagination.pageIndex = page;
        if(this.currentContactType==null){
            this.editContactListLoadAllUsers(this.selectedContactListId,this.pagination );
        }else if(this.currentContactType=="active_contacts"){
            this.active_Contacts(this.pagination);
        }else if(this.currentContactType=="invalid_contacts"){
            this.invalid_Contacts(this.pagination);
        }else if(this.currentContactType=="unSubscribed_contacts"){
            this.unSubscribed_Contacts(this.pagination);
        }else if(this.currentContactType=="nonActive_contacts"){
            this.nonActive_Contacts(this.pagination);
        }/*else {
            this.loadContactLists( this.pagination );
        }*/
        
    }
    
    activeContactsDataShowing(){
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.activeContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "active_contacts";
        this.active_Contacts(this.pagination);
        
    }

    invalidContactsDataShowing(){
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.invalidContactData = true;
        this.pagination = new Pagination();
        this.currentContactType = "invalid_contacts";
        this.invalid_Contacts(this.pagination);
        
    }

    unSubscribedContactsDataShowing(){
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.unsubscribedContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "unSubscribed_contacts";
        this.unSubscribed_Contacts(this.pagination);
        
    }

    nonActiveContactsDataShowing(){
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.nonActiveContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "nonActive_contacts";
        this.nonActive_Contacts(this.pagination);
        
    }

    active_Contacts( pagination: Pagination ) {

        this.contactService.loadActiveContactsUsers( this.contactListId,pagination )
            .subscribe(
               (data:any) => {
                this.activeContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.activeContactUsers );
                this.logger.log(data);
            },

            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    invalid_Contacts( pagination: Pagination ) {

        this.contactService.loadInvalidContactsUsers(this.contactListId, pagination )
            .subscribe(
              (data:any) => {
                this.invalidContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.invalidContactUsers );
                this.logger.log(data);
              //  this.userListIds = data.listOfUsers;
                //this.logger.info(this.userListIds);
                
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    unSubscribed_Contacts( pagination: Pagination ) {

        this.contactService.loadUnSubscribedContactsUsers(this.contactListId, pagination )
            .subscribe(
               (data:any) => {
                this.unsubscribedContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.unsubscribedContactUsers );
                this.logger.log(data);
            },

            error => console.log( error ),
            () => console.log( "finished" )
            );
    }


    nonActive_Contacts( pagination: Pagination ) {

        this.contactService.loadNonActiveContactsUsers(this.contactListId,pagination )
            .subscribe(
            (data:any) => {
                this.nonActiveContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.nonActiveContactUsers );
                this.logger.log(data);
            },

            error => console.log( error ),
            () => console.log( "finished" )
            );
    }
    
    ngOnInit() {
        //this.contactsCount();
        this.checkingLoadContactsCount = true;
        this.editContactListLoadAllUsers(this.selectedContactListId,this.pagination);
        
        let self = this;

        this.uploader = new FileUploader( {
            allowedMimeType: ["application/vnd.ms-excel", "text/plain", "text/csv", "application/csv"],
            url: URL + "userlist/" + this.selectedContactListId + "/update?&access_token=" + this.authenticationService.access_token
        });
        this.uploader.onBuildItemForm = function( fileItem: any, form: FormData ) {
            form.append( 'userListId', self.selectedContactListId );
            return { fileItem, form }
        };

        try {
            $( "#saveContactsMessage" ).hide();
            $( "#saveContactsMessage1" ).hide();
            $( "#saveContactsMessage2" ).hide();
            $( "#file_preview" ).hide();
            //caculations
            Metronic.init(); // init metronic core components
            Layout.init(); // init current layout
            Demo.init(); // init demo features
            Portfolio.init();

        }
        catch ( err ) { }
    }
}
