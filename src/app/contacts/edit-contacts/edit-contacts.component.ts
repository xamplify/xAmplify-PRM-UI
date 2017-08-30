import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { User } from '../../core/models/user';
import { FormsModule, FormControl } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ManageContactsComponent } from '../manage-contacts/manage-contacts.component';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Logger } from "angular2-logger/core";
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { UserListIds } from '../models/user-listIds';
import { ReferenceService } from '../../core/services/reference.service';

declare var Metronic: any;
declare var Layout: any;
declare var Demo: any;
declare var Portfolio: any;
declare var $: any;
declare var swal: any;


@Component( {
    selector: 'app-edit-contacts',
    templateUrl: './edit-contacts.component.html',
    styleUrls: ['../../../assets/css/button.css',
        '../../../assets/css/numbered-textarea.css'],
    providers: [Pagination]
})
export class EditContactsComponent implements OnInit {
    @Input() contacts: User[];
    @Input() totalRecords: number;
    @Input() contactListId: number;
    @Input() selectedContactListId: number;
    @Input( 'value' ) value: number;
    editContacts: User;
    @Output() notifyParent: EventEmitter<User>;

    dublicateEmailId: boolean = false;
    noOfContactsDropdown : boolean = true;
    validCsvContacts : boolean;
    inValidCsvContacts : boolean;
    isHeaderCheckBoxChecked:boolean = false;
    isInvalidHeaderCheckBoxChecked:boolean = false;
    public clipBoard: boolean = false;
    public saveAddcontactUsers: boolean;
    public saveCopyfromClipboardUsers: boolean;
    public saveCsvFileUsers: boolean;
    public clipboardTextareaText: string;
    pagedItems: any[];
    checkedUserList = [];
    invalidRemovableContacts = [];
    selectedInvalidContactIds = [];
    selectedContactListIds = [];
    //removeUserIds = new Array()
    fileTypeError: boolean;
    Campaign: string;
    selectedDropDown: string;
    deleteErrorMessage: boolean;
    public clipboardUsers: Array<User>;
    public csvFileUsers: Array<User>;
    public uploader: FileUploader;
    public clickBoard: boolean = false;
    public filePrevew: boolean = false;
    public successMessage: boolean;
    noContactsFound: boolean;
    noContactsFound1: boolean;
    hidingListUsersTable: boolean;
    invalidPatternEmails: string[] = [];

    public users: Array<User>;
    activeUsersCount: number;
    inActiveUsersCount: number;
    allContacts: number;
    invlidContactsCount: number;
    unsubscribedContacts: number;
    public allUsers: number;
    checkingLoadContactsCount: boolean;
    showAllContactData: boolean = false;
    showEditContactData: boolean = true;

    activeContactsData: boolean;
    invalidContactData: boolean;
    unsubscribedContactsData: boolean;
    nonActiveContactsData: boolean;
    public currentContactType: string = "all_contacts";
    public activeContactUsers: Array<ContactList>;
    public invalidContactUsers: Array<ContactList>;
    public unsubscribedContactUsers: Array<ContactList>;
    public nonActiveContactUsers: Array<ContactList>;
    public userListIds: Array<UserListIds>;
    deleteSucessMessage: boolean;
    invalidDeleteSucessMessage: boolean;
    emptyActiveContactsUsers: boolean;
    emptyInvalidContactsUsers: boolean;
    emptyUnsubscribedContactsUsers: boolean;
    emptyNonActiveContactsUsers: boolean;
    contactUsersId: number;
    contactIds = [];
    duplicateEmailIds: string[] = [];
    public searchKey: string;
    sortcolumn: string = null;
    sortingOrder: string = null;
    public isCategoryThere: boolean;
    public searchDisable = true;
    public invalidPattenMail = false;
    showInvalidMaills = false;
    sortContacts = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Email(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
    ];
    public contactsSort: any = this.sortContacts[0];

    constructor( public refService:ReferenceService,private contactService: ContactService, private manageContact: ManageContactsComponent,
        private authenticationService: AuthenticationService, private logger: Logger, private router: Router,
        private pagerService: PagerService, private pagination: Pagination ) {
        this.users = new Array<User>();
        this.clipboardUsers = new Array<User>();
        this.csvFileUsers = new Array<User>();
        this.notifyParent = new EventEmitter<User>();
    }

    searchContactsTitelName() {
        console.log( this.searchKey );
        this.pagination.searchKey = this.searchKey;
        this.pagination.pageIndex = 1;
        if ( this.currentContactType == "all_contacts" || ( this.currentContactType == "all_contacts" && this.searchKey == "" ) ) {
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        } else if ( this.currentContactType == "active_contacts" || ( this.currentContactType == "active_contacts" && this.searchKey == "" ) ) {
            this.active_Contacts( this.pagination );
        } else if ( this.currentContactType == "invalid_contacts" || ( this.currentContactType == "invalid_contacts" && this.searchKey == "" ) ) {
            this.invalid_Contacts( this.pagination );
        } else if ( this.currentContactType == "unSubscribed_contacts" || ( this.currentContactType == "unSubscribed_contacts" && this.searchKey == "" ) ) {
            this.unSubscribed_Contacts( this.pagination );
        } else if ( this.currentContactType == "nonActive_contacts" || ( this.currentContactType == "nonActive_contacts" && this.searchKey == "" ) ) {
            this.nonActive_Contacts( this.pagination );
        }
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
        if ( this.currentContactType == "all_contacts" ) {
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
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

    onChangeAllContactsUsers( event: Event ) {
        this.selectedDropDown = event.target["value"];
        if ( this.currentContactType == "all_contacts" && this.selectedDropDown == "all" ) {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            $('#checkAllExistingContacts').prop("checked",false);
            //this.contactItemsSize = items;
            this.getAllFilteredResults(this.pagination);
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        } else if ( this.currentContactType == "active_contacts" && this.selectedDropDown == "all" ) {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            this.active_Contacts( this.pagination );
        } else if ( this.currentContactType == "invalid_contacts" && this.selectedDropDown == "all" ) {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            this.invalid_Contacts( this.pagination );
        } else if ( this.currentContactType == "unSubscribed_contacts" && this.selectedDropDown == "all" ) {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            this.unSubscribed_Contacts( this.pagination );
        } else if ( this.currentContactType == "nonActive_contacts" && this.selectedDropDown == "all" ) {
            this.pagination.maxResults = this.totalRecords;
            this.pagination.pageIndex = 1;
            this.nonActive_Contacts( this.pagination );
        }

        else if ( this.currentContactType == "all_contacts" && this.selectedDropDown == "page" ) {
            this.pagination.maxResults = 10;
            $('#checkAllExistingContacts').prop("checked",false);
            //this.contactItemsSize = items;
            this.getAllFilteredResults(this.pagination);
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        } else if ( this.currentContactType == "active_contacts" && this.selectedDropDown == "page" ) {
            this.pagination.maxResults = 10;
            this.active_Contacts( this.pagination );
        } else if ( this.currentContactType == "invalid_contacts" && this.selectedDropDown == "page" ) {
            this.pagination.maxResults = 10;
            this.invalid_Contacts( this.pagination );
        } else if ( this.currentContactType == "unSubscribed_contacts" && this.selectedDropDown == "page" ) {
            this.pagination.maxResults = 10;
            this.unSubscribed_Contacts( this.pagination );
        } else if ( this.currentContactType == "nonActive_contacts" && this.selectedDropDown == "page" ) {
            this.pagination.maxResults = 10;
            this.nonActive_Contacts( this.pagination );
        }
    }

    getAllFilteredResults(pagination:Pagination){
        try{
            this.pagination.pageIndex = 1;
            this.pagination.filterBy = 10;
            if(this.selectedDropDown=="all"){
                this.pagination.maxResults = this.pagination.totalRecords;
            }else{
                this.pagination.maxResults = 10;
            }
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }catch(error){
            console.log(error, "Get Filtered Contacts","edit Contact Component")
        }
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
        this.fileTypeError = false;
        this.noContactsFound = false;
        this.readFiles( input.files );
    }

    readFile( file: any, reader: any, callback: any ) {
        reader.onload = () => {
            callback( reader.result );
        }
        reader.readAsText( file );
    }

    readFiles( files: any, index = 0 ) {
        if ( files[0].type == "application/vnd.ms-excel" ) {
            this.fileTypeError = false;
            this.saveCsvFileUsers = true;
            this.saveAddcontactUsers = false;
            this.saveCopyfromClipboardUsers = false;
            this.logger.info( "coontacts preview" );
            $( "#sample_editable_1" ).hide();
            this.filePrevew = true;
            $( "button#add_contact" ).prop( 'disabled', true );
            $( "button#copyFrom_clipboard" ).prop( 'disabled', true );
            $( "button#upload_csv" ).prop( 'disabled', true );
            $( "input[type='file']" ).attr( "disabled", true );
            let reader = new FileReader();
            reader.readAsText( files[0] );
            this.logger.info( files[0] );
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
        } else {
            this.fileTypeError = true;
            this.uploader.queue.length = 0;
        }
    }

    compressArray( original ) {
        var compressed = [];
        var copy = original.slice( 0 );
        for ( var i = 0; i < original.length; i++ ) {
            var myCount = 0;
            for ( var w = 0; w < copy.length; w++ ) {
                if ( original[i] == copy[w] ) {
                    myCount++;
                    delete copy[w];
                }
            } if ( myCount > 0 ) {
                var a: any = new Object();
                a.value = original[i];
                a.count = myCount;
                compressed.push( a );
            }
        }
        return compressed;
    };

    closeShowValidMessage(){
        this.showInvalidMaills = false;
    }
    updateContactList( contactListId: number, isValid: boolean, isclick: boolean ) {
        this.showInvalidMaills = false;
        this.invalidPattenMail = false;
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        console.log(this.users);
        var testArray = [];
        for ( var i = 0; i <= this.users[0].emailId.length - 1; i++ ) {
            testArray.push( this.users[0].emailId );
        }
        for(var j = 0; j <= this.users.length-1; j++ ){
           // testArray[j].includes('@') && testArray[j].includes('.com')&& 
            if(this.validateEmailAddress(this.users[j].emailId) ){
              this.invalidPattenMail = false;
            } else{
                this.invalidPattenMail = true;
                testArray.length = 0;
                break;
            }  
        }
        var newArray = this.compressArray( testArray );
        for ( var w = 0; w < newArray.length; w++ ) {
            if ( newArray[w].count >= 2 ) {
                this.duplicateEmailIds.push( newArray[w].value );
            }
            console.log( newArray[w].value );
            console.log( newArray[w].count );
        }
        this.logger.log( "DUPLICATE EMAILS" + this.duplicateEmailIds );
        var valueArr = this.users.map( function( item ) { return item.emailId });
        var isDuplicate = valueArr.some( function( item, idx ) {
            return valueArr.indexOf( item ) != idx
        });
        console.log( isDuplicate );
        this.logger.info( this.users[0].emailId );
        if(this.invalidPattenMail === true){
            this.showInvalidMaills = true;
            testArray.length  = 0;
        } else if ( !isDuplicate ) {
            this.saveValidEmails();
        } else {
            this.dublicateEmailId = true;
        }
    }

    saveValidEmails() {
        this.logger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.users ) );
        this.contactService.updateContactList( this.contactListId, this.users )
            .subscribe(
            ( data: any ) => {
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
                });
                this.successMessage = true;
                setTimeout( function() { $( "#saveContactsMessage" ).slideUp( 500 ); }, 2000 );
                this.checkingLoadContactsCount = true;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                this.cancelContacts();
            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.successMessage = false;
        this.dublicateEmailId = false;
    }

    updateCsvContactList( contactListId: number, isValid: boolean, isclick: boolean ) {
        if ( this.csvFileUsers.length > 0 ) {
            this.logger.info( isValid );
            for(let i = 0; i< this.csvFileUsers.length;i++){
                if(!this.validateEmailAddress(this.csvFileUsers[i].emailId)){
                    this.invalidPatternEmails.push(this.csvFileUsers[i].emailId)
                }
                if(this.validateEmailAddress(this.csvFileUsers[i].emailId)){
                    this.validCsvContacts = true;
                }
                else {
                    this.validCsvContacts = false;
                }
            }
            if(this.validCsvContacts == true) {
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
                        this.successMessage = true;
                        setTimeout( function() { $( "#saveContactsMessage" ).slideUp( 500 ); }, 2000 );
                        $( "button#add_contact" ).prop( 'disabled', false );
                        $( "button#copyFrom_clipboard" ).prop( 'disabled', false );
                        $( "#uploadCsvUsingFile" ).hide();
                        $( "#sample_editable_1" ).show();
                        $( "button#upload_csv" ).prop( 'disabled', false );
                        $( "input[type='file']" ).attr( "disabled", false );
                        this.filePrevew = false;
                        this.checkingLoadContactsCount = true;
                        this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                    },
                    error => this.logger.error( error ),
                    () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
                    )
                this.successMessage = false;
            }else{
                this.inValidCsvContacts = true;
            }
        }
        
        
        /*this.logger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.csvFileUsers ) );
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
                this.successMessage = true;
                setTimeout( function() { $( "#saveContactsMessage" ).slideUp( 500 ); }, 2000 );
                $( "button#add_contact" ).prop( 'disabled', false );
                $( "button#copyFrom_clipboard" ).prop( 'disabled', false );
                $( "#uploadCsvUsingFile" ).hide();
                $( "#sample_editable_1" ).show();
                this.filePrevew = false;
                this.checkingLoadContactsCount = true;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.successMessage = false;*/
    }
    
    checkedUsers(contactListId: number){
        let self = this;
        var removeUserIds = [];
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
            self.checkedUserList.push(id);
        });
        //this.checkedUserList.push(removeUserIds);
        this.logger.log("CheckedUsersListNew" + this.checkedUserList);
    }

    removeContactListUsers( contactListId: number ) {
        let self = this;
      /*  var removeUserIds = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
            self.checkedUserList.push(id);
        });*/
        this.logger.info( this.selectedContactListIds );
        this.contactService.removeContactList( this.contactListId, this.selectedContactListIds )
            .subscribe(
            ( data: any ) => {
                data = data;
                this.activeUsersCount = data.activecontacts;
                this.inActiveUsersCount = data.nonactiveUsers;
                this.allContacts = data.allcontacts;
                this.allUsers = this.allContacts;
                this.invlidContactsCount = data.invalidUsers;
                this.unsubscribedContacts = data.unsubscribedUsers;
                console.log( "update Contacts ListUsers:" + data );
                this.deleteSucessMessage = true;
                setTimeout( function() { $( "#showDeleteMessage" ).slideUp( 500 ); }, 2000 );
                $.each( this.selectedContactListIds, function( index: number, value: any ) {
                    $( '#row_' + value ).remove();
                    console.log( index + "value" + value );
                });
                this.checkingLoadContactsCount = true;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            },
            ( error: any ) => {
                if ( error.includes( 'Please delete those campaigns first.' )) {
                    this.Campaign = error;
                    this.deleteErrorMessage = true;
                    setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                    console.log( this.deleteErrorMessage );
                }
            },
            () => this.logger.info( "deleted completed" )
            );
        this.deleteSucessMessage = false;
        this.deleteErrorMessage = false;
    }

    showAlert( contactListId: number ) {
        /*var removeUserIds = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
        });*/
        this.logger.info( "userIdForChecked" + this.selectedContactListIds );
        if ( this.selectedContactListIds.length != 0 ) {
            this.logger.info( "contactListId in sweetAlert() " + this.contactListId );
            let self = this;
            if( this.totalRecords != 1 || this.totalRecords != this.selectedContactListIds.length ){
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
            if( this.totalRecords == 1 || this.totalRecords == this.selectedContactListIds.length){
                swal( {
                    title: 'Are you sure?',
                    text: "You won't be able to revert this! If you delete all Users, your contact list aslo will delete.",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'

                }).then( function( myData: any ) {
                    console.log( "ManageContacts showAlert then()" + myData );
                    self.deleteContactList( );
                })
                }

        }
    }

    addRow() {
        this.fileTypeError = false;
        this.users.push( new User() );
        this.noContactsFound = false;
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
        this.fileTypeError = false;
        this.inValidCsvContacts = false;
        this.invalidPatternEmails.length = 0;
        $( "button#copyFrom_clipboard" ).prop( 'disabled', false );
        $( "button#add_contact" ).prop( 'disabled', false );
        this.users.length = 0;
        this.filePrevew = false;
        $( "#sample_editable_1" ).show();
        this.csvFileUsers.length = null;
        $( "button#upload_csv" ).prop( 'disabled', false );
        $( "input[type='file']" ).attr( "disabled", false );
    }

    copyFromClipboard() {
        this.fileTypeError = false;
        this.noContactsFound = false;
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
        var selectedDropDown = $( "select.options:visible option:selected " ).val();
        var splitValue;
        if ( this.clipboardTextareaText == undefined ) {
            swal( "value can't be null" );
        }
        if ( selectedDropDown == "DEFAULT" ) {
            swal( "Please Select the Delimeter Type" );
            return false;
        }
        else {
            if ( selectedDropDown == "CommaSeperated" )
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
            this.pagination.pagedItems.length = 0;
        }
        if ( isValidData ) {
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
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
            this.filePrevew = false;
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
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        var testArray = [];
        for ( var i = 0; i <= this.clipboardUsers.length - 1; i++ ) {
            testArray.push( this.clipboardUsers[i].emailId );
        }

        var newArray = this.compressArray( testArray );
        for ( var w = 0; w < newArray.length; w++ ) {
            if ( newArray[w].count >= 2 ) {
                this.duplicateEmailIds.push( newArray[w].value );
            }
            console.log( newArray[w].value );
            console.log( newArray[w].count );
        }
        this.logger.log( "DUPLICATE EMAILS" + this.duplicateEmailIds );
        var valueArr = this.clipboardUsers.map( function( item ) { return item.emailId });
        var isDuplicate = valueArr.some( function( item, idx ) {
            return valueArr.indexOf( item ) != idx
        });
        console.log( isDuplicate );
        if ( !isDuplicate ) {
            this.saveClipboardValidEmails();
        } else {
            this.dublicateEmailId = true;
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
        }
    }

    saveClipboardValidEmails() {
        this.logger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.clipboardUsers ) );
        if(this.clipboardUsers.length !=0 ){
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
                this.successMessage = true;
                setTimeout( function() { $( "#saveContactsMessage" ).slideUp( 500 ); }, 2000 );
                $( "button#add_contact" ).prop( 'disabled', false );
                $( "button#upload_csv" ).prop( 'disabled', false );
                this.clipboardUsers.length = 0;
                this.cancelContacts();
                this.checkingLoadContactsCount = true;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.successMessage = false;
        this.dublicateEmailId = false;
        }
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
            this.dublicateEmailId = false;
            this.users.length = 0;
        }
        if ( this.saveAddcontactUsers == false && this.saveCopyfromClipboardUsers == true ) {
            this.clickBoard = false;
            $( "button#add_contact" ).prop( 'disabled', false );
            $( "button#upload_csv" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            this.clipboardUsers.length = null;
            this.dublicateEmailId = false;
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }
    }
    
    checkAll(ev:any){
        /*if(ev.target.checked){
            console.log("checked");
            $('[name="campaignContact[]"]').prop('checked', true);
            //this.isContactList = true;
            let self = this;
            $('[name="campaignContact[]"]:checked').each(function(){
                var id = $(this).val();
                self.selectedContactListIds.push(parseInt(id));
                $('#row_'+id).addClass('contact-list-selected');
             });
            //this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
        }else{
           console.log("unceck");
            $('[name="campaignContact[]"]').prop('checked', false);
            //this.isContactList = false;
            $('#user_list_tb tr').removeClass("contact-list-selected");
            this.selectedContactListIds = [];
        }
        ev.stopPropagation();*/
        if(ev.target.checked){
            console.log("checked");
            $('[name="campaignContact[]"]').prop('checked', true);
            //this.isContactList = true;
            let self = this;
            $('[name="campaignContact[]"]:checked').each(function(){
                var id = $(this).val();
                self.selectedContactListIds.push(parseInt(id));
                console.log(self.selectedContactListIds);
                $('#campaignContactListTable_'+id).addClass('contact-list-selected');
             });
            this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
            /*if(this.selectedContactListIds.length==0){
                this.isContactList = false;
            }*/
        }else{
            $('[name="campaignContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("contact-list-selected");
            if(this.pagination.maxResults==this.pagination.totalRecords){
               // this.isContactList = false;
                this.selectedContactListIds = [];
            }else{
               // this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
                let currentPageContactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                this.selectedContactListIds = this.refService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
                /*if(this.selectedContactListIds.length==0){
                    this.isContactList = false;
                }*/
            }
            
        }
        ev.stopPropagation();
    }
    
    highlightRow(contactId:number,event:any){
        let isChecked = $('#'+contactId).is(':checked');
        if(isChecked){
            $('#row_'+contactId).addClass('contact-list-selected');
            this.selectedContactListIds.push(contactId);
        }else{
            $('#row_'+contactId).removeClass('contact-list-selected');
            this.selectedContactListIds.splice($.inArray(contactId,this.selectedContactListIds),1);
        }
        //this.contactsUtility();
        if(contactId == this.pagination.pagedItems.length || contactId == 10){
            this.isHeaderCheckBoxChecked = true;
        }else{
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
    }
    /*highlightContactRow(contactId:number,event:any){
        let isChecked = $('#'+contactId).is(':checked');
          if(isChecked){
              //Removing Highlighted Row
              $('#'+contactId).prop( "checked", false );
              $('#row_'+contactId).removeClass('contact-list-selected');
              console.log("Revmoing"+contactId);
              this.selectedContactListIds.splice($.inArray(contactId,this.selectedContactListIds),1);
        }else{
            //Highlighting Row
            $('#'+contactId).prop( "checked", true );
            $('#row_'+contactId).addClass('contact-list-selected');
            console.log("Adding"+contactId);
            this.selectedContactListIds.push(contactId);
        }
         // this.contactsUtility();
          event.stopPropagation();
          console.log(this.selectedContactListIds);
    }
*/
    editContactListLoadAllUsers( contactSelectedListId: number, pagination: Pagination ) {
        this.logger.info( "manageContacts editContactList #contactSelectedListId " + contactSelectedListId );
        this.selectedContactListId = contactSelectedListId;
        this.currentContactType = "all_contacts";
        this.contactService.loadUsersOfContactList( contactSelectedListId, pagination ).subscribe(
            ( data: any ) => {
                this.logger.info( "MangeContactsComponent loadUsersOfContactList() data => " + JSON.stringify( data ) );
                this.contacts = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                this.logger.log( data );
                if ( this.checkingLoadContactsCount == true ) {
                    this.activeUsersCount = data.activecontacts;
                    this.inActiveUsersCount = data.nonactiveUsers;
                    this.allContacts = data.allcontacts;
                    this.allUsers = this.allContacts;
                    this.invlidContactsCount = data.invalidUsers;
                    this.unsubscribedContacts = data.unsubscribedUsers;
                }
                if ( this.contacts.length !== 0 ) {
                    this.noContactsFound = false;
                    this.noOfContactsDropdown = true;
                }
                else {
                    this.noContactsFound = true;
                    this.noOfContactsDropdown = false;
                    this.pagedItems = null;
                }
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.contacts );
                this.checkingLoadContactsCount = false;
                this.logger.log( this.allUsers );
                
                var contactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedContactListIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                this.logger.log("paginationUserIDs"+contactIds);
                this.logger.log("Selected UserIDs"+this.selectedContactListIds);
                /*if(items.length==10){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }*/
                if(items.length==pagination.totalRecords || items.length == 10){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }
                
            },
            error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadUsersOfContactList() finished" )
        )
    }
    
    changEvent( event: any ) {
    }
    setPage( page: number, ) {
        this.pagination.pageIndex = page;
        if ( this.currentContactType == "all_contacts" ) {
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
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

    refresh() {
        this.editContacts = null;
        this.notifyParent.emit( this.editContacts );
    }

    backToEditContacts() {
        this.showAllContactData = false;
        this.showEditContactData = true;
        this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        this.successMessage = false;
        this.deleteSucessMessage = false;
        this.activeContactsData = false;
        this.invalidContactData = false;
        this.unsubscribedContactsData = false;
        this.nonActiveContactsData = false;
        this.invalidDeleteSucessMessage = false;
    }

    activeContactsDataShowing() {
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.activeContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "active_contacts";
        this.active_Contacts( this.pagination );

    }

    invalidContactsDataShowing() {
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.invalidContactData = true;
        this.pagination = new Pagination();
        this.currentContactType = "invalid_contacts";
        this.invalid_Contacts( this.pagination );
    }

    unSubscribedContactsDataShowing() {
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.unsubscribedContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "unSubscribed_contacts";
        this.unSubscribed_Contacts( this.pagination );
    }

    nonActiveContactsDataShowing() {
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.nonActiveContactsData = true;
        this.pagination = new Pagination();
        this.currentContactType = "nonActive_contacts";
        this.nonActive_Contacts( this.pagination );
    }

    active_Contacts( pagination: Pagination ) {
        this.contactService.loadActiveContactsUsers( this.contactListId, pagination )
            .subscribe(
            ( data: any ) => {
                this.activeContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyActiveContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.activeContactUsers );
                    this.logger.log( data );
                }
                if ( this.activeContactUsers.length == 0 ) {
                    this.noContactsFound1 = true;
                    this.hidingListUsersTable = false;
                }
                else {
                    this.noContactsFound1 = false;
                    this.hidingListUsersTable = true;
                    this.pagedItems = null;
                }
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    invalid_Contacts( pagination: Pagination ) {
        this.contactService.loadInvalidContactsUsers( this.contactListId, pagination )
            .subscribe(
            ( data: any ) => {
                this.invalidContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyInvalidContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.invalidContactUsers );
                    this.logger.log( data );
                }
                if ( this.invalidContactUsers.length == 0 ) {
                    this.noContactsFound1 = true;
                    this.hidingListUsersTable = false;
                }
                else {
                    this.noContactsFound1 = false;
                    this.hidingListUsersTable = true;
                    this.pagedItems = null;
                }
                
                var contactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedInvalidContactIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                this.logger.log("CIDSS"+contactIds);
                this.logger.log("IIDDDs"+this.selectedInvalidContactIds);
                if(items.length==10){
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
        this.contactService.loadUnSubscribedContactsUsers( this.contactListId, pagination )
            .subscribe(
            ( data: any ) => {
                this.unsubscribedContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyUnsubscribedContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.unsubscribedContactUsers );
                    this.logger.log( data );
                }
                if ( this.unsubscribedContactUsers.length == 0 ) {
                    this.noContactsFound1 = true;
                    this.hidingListUsersTable = false;
                }
                else {
                    this.noContactsFound1 = false;
                    this.hidingListUsersTable = true;
                    this.pagedItems = null;
                }
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
    }

    nonActive_Contacts( pagination: Pagination ) {
        this.contactService.loadNonActiveContactsUsers( this.contactListId, pagination )
            .subscribe(
            ( data: any ) => {
                this.nonActiveContactUsers = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( data.totalRecords.length == 0 ) {
                    this.emptyNonActiveContactsUsers = true;
                } else {
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.nonActiveContactUsers );
                    this.logger.log( data );
                }
                if ( this.nonActiveContactUsers.length == 0 ) {
                    this.noContactsFound1 = true;
                    this.hidingListUsersTable = false;
                }
                else {
                    this.noContactsFound1 = false;
                    this.hidingListUsersTable = true;
                    this.pagedItems = null;
                }
            },
            error => console.log( error ),
            () => console.log( "finished" )
            );
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

    checkAllInvalidContacts(ev:any){
        if(ev.target.checked){
            console.log("checked");
            $('[name="invalidContact[]"]').prop('checked', true);
            //this.isContactList = true;
            let self = this;
            $('[name="invalidContact[]"]:checked').each(function(){
                var id = $(this).val();
                self.selectedInvalidContactIds.push(parseInt(id));
                $('#row_'+id).addClass('invalid-contacts-selected');
             });
            //this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
        }else{
           console.log("unceck");
            $('[name="invalidContact[]"]').prop('checked', false);
            //this.isContactList = false;
            $('#user_list_tb tr').removeClass("invalid-contacts-selected");
            this.selectedInvalidContactIds = [];
        }
        ev.stopPropagation();
    }
    
    invalidContactsSelectedUserIds(contactId:number,event:any){
        let isChecked = $('#'+contactId).is(':checked');
        if(isChecked){
            $('#row_'+contactId).addClass('invalid-contacts-selected');
            this.selectedInvalidContactIds.push(contactId);
        }else{
            $('#row_'+contactId).removeClass('invalid-contacts-selected');
            this.selectedInvalidContactIds.splice($.inArray(contactId,this.selectedInvalidContactIds),1);
        }
        //this.contactsUtility();
        event.stopPropagation();
    }
    
    removeInvalidContactListUsers() {
       /* var removeUserIds = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
        });*/
        this.logger.info( this.selectedInvalidContactIds );
        this.contactService.removeContactList( this.contactListId, this.selectedInvalidContactIds )
            .subscribe(
            ( data: any ) => {
                data = data;
                console.log( "update invalidContacts ListUsers:" + data );
                this.invalidDeleteSucessMessage = true;
                setTimeout( function() { $( "#showInvalidDeleteMessage" ).slideUp( 500 ); }, 2000 );
                $.each( this.selectedInvalidContactIds, function( index: number, value: any ) {
                    $( '#row_' + value ).remove();
                    console.log( index + "value" + value );
                });
                this.invalid_Contacts( this.pagination );
                this.invlidContactsCount = data.invalidUsers;
            },
            /*error => this.logger.error( error ),
            () => this.logger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.invalidDeleteSucessMessage = false;
    }
*/          ( error: any ) => {
                if ( error.search( 'contactlist is being used in one or more campaigns. Please delete those campaigns first.' ) != -1 ) {
                this.Campaign = error;
                console.log( error );
                this.deleteErrorMessage = true;
                setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                }
                },
                () => this.logger.info( "deleted completed" )
            );
        this.deleteSucessMessage = false;
    }
    invalidContactsShowAlert() {
       /* var removeUserIds = new Array();
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var id = $( this ).val();
            removeUserIds.push( id );
        });*/
        if ( this.selectedInvalidContactIds.length != 0 ) {
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

    removeContactListUsers1( contactId: number ) {
        this.contactUsersId = contactId;
        this.contactIds[0] = this.contactUsersId;
        this.contactService.removeContactList( this.contactListId, this.contactIds )
            .subscribe(
            ( data: any ) => {
                data = data;
                this.activeUsersCount = data.activecontacts;
                this.inActiveUsersCount = data.nonactiveUsers;
                this.allContacts = data.allcontacts;
                this.allUsers = this.allContacts;
                this.invlidContactsCount = data.invalidUsers;
                this.unsubscribedContacts = data.unsubscribedUsers;
                console.log( "update Contacts ListUsers:" + data );
                this.deleteSucessMessage = true;
                setTimeout( function() { $( "#showDeleteMessage" ).slideUp( 500 ); }, 2000 );
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            },
            ( error: any ) => {
                if ( error.includes( 'Please delete those campaigns first.' )) {
                    this.Campaign = error;
                    this.deleteErrorMessage = true;
                    setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                    console.log( this.deleteErrorMessage );
                }
            },
            () => this.logger.info( "deleted completed" )
            );
        this.deleteSucessMessage = false;
        this.deleteErrorMessage = false;
    }

    deleteContactList() {
        this.logger.info( "MangeContacts deleteContactList : " + this.selectedContactListId );
        this.contactService.deleteContactListFromEdit( this.selectedContactListId )
            .subscribe(
            data => {
                console.log( "MangeContacts deleteContactList success : " + data );
                //this.contactsCount();
                $( '#contactListDiv_' + this.selectedContactListId ).remove();
                //this.backToEditContacts()
                this.deleteSucessMessage = true;
                setTimeout( function() { $( "#showDeleteMessage" ).slideUp( 500 ); }, 2000 );
                //this.router.navigateByUrl( '/home/contacts/manageContacts' )
                this.refresh();
                this.contactService.deleteUserSucessMessage = true;
                /*if (this.pagination.pagedItems.length === 1) {
                    this.isvideoThere = true;
                    this.pagination.pageIndex  = 1;
                    this.loadContactLists(this.pagination);
                    

              }*/
            },
            ( error: any ) => {
                if ( error.search( 'contactlist is being used in one or more campaigns. Please delete those campaigns first.' ) != -1 ) {
                    //swal( 'Campaign contact!', error, 'error' );
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
    
    showAlert1( contactId: number ) {
        this.contactIds.push( this.contactUsersId )
        this.logger.info( "contactListId in sweetAlert() " + this.contactIds );
        let self = this;
        if( this.totalRecords != 1){
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
            self.removeContactListUsers1( contactId );
        })
        }
        
        if( this.totalRecords == 1){
            swal( {
                title: 'Are you sure?',
                text: "You won't be able to revert this! If you delete all Users, your contact list aslo will delete.",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'

            }).then( function( myData: any ) {
                console.log( "ManageContacts showAlert then()" + myData );
                self.deleteContactList( );
            })
            }
    }

    ngOnInit() {
        this.checkingLoadContactsCount = true;
        this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
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
            Metronic.init(); // init metronic core components
            Layout.init(); // init current layout
            Demo.init(); // init demo features
            Portfolio.init();

        }
        catch ( err ) { }
    }
}
