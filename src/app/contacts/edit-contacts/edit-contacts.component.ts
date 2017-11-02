import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { Criteria } from '../models/criteria';
import { CustomeResponse } from '../models/response';
import { AddContactsOption } from '../models/contact-option';
import { User } from '../../core/models/user';
import { FormsModule, FormControl } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ManageContactsComponent } from '../manage-contacts/manage-contacts.component';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { UserListIds } from '../models/user-listIds';
import { ReferenceService } from '../../core/services/reference.service';
import { ContactsByType } from '../models/contacts-by-type';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';

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
        '../../../assets/css/numbered-textarea.css',
        './edit-contacts.component.css'],
    providers: [Pagination,HttpRequestLoader]
})
export class EditContactsComponent implements OnInit {
    @Input() contacts: User[];
    @Input() totalRecords: number;
    @Input() contactListId: number;
    @Input() contactListName: string;
    @Input() selectedContactListId: number;
    @Input() uploadedUserId: number;
    @Input( 'value' ) value: number;
    editContacts: User;
    @Output() notifyParent: EventEmitter<User>;
    
    criteria = new Criteria();
    criterias = new Array<Criteria>();
    filterValue: any;
    
    contactListObject: ContactList;
    selectedContactListName: string;
    public validEmailPatternSuccess: boolean = true;
    emailNotValid: boolean;
    checkingForEmail: boolean;
    addContactuser: User = new User();
    
    public httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    AddContactsOption: typeof AddContactsOption = AddContactsOption;
    selectedAddContactsOption: number = 8;
    invalidDeleteSuccessMessage: boolean = false;
    invalidDeleteErrorMessage: boolean = false;
    editListContacts: boolean = true;
    
    uploadCsvUsingFile: boolean = false;
    contactsByType: ContactsByType = new ContactsByType();
    showSelectedCategoryUsers: boolean = true;
    isShowUsers: boolean = true;
    public users: Array<User>;
    response: CustomeResponse = new CustomeResponse();
    
    
    countries = ["Country","Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan",
                 
                 "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegowina","Botswana","Bouvet Island","Brazil",
                 
                 "British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic",
                 
                 "Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo, the Democratic Republic of the","Cook Islands","Costa Rica","Cote d'Ivoire",
                 
                 "Croatia (Hrvatska)","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia",
                 
                 "Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana",
                 
                 "Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Heard and Mc Donald Islands","Holy See (Vatican City State)",
                 
                 "Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran (Islamic Republic of)","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
                 
                 "Kiribati","Korea, Democratic People's Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya",
                 
                 "Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia, The Former Yugoslav Republic of","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania",
                 
                 "Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
                 
                 "Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea",
                 
                 "Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russian Federation","Rwanda","Saint Kitts and Nevis","Saint LUCIA","Saint Vincent and the Grenadines",
                 
                 "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Seychelles","Sierra Leone","Singapore","Slovakia (Slovak Republic)","Slovenia","Solomon Islands","Somalia","South Africa",
               
                 "South Georgia and the South Sandwich Islands","Spain","Sri Lanka","St. Helena","St. Pierre and Miquelon","Sudan","Suriname","Svalbard and Jan Mayen Islands","Swaziland","Sweden","Switzerland",
                 
                 "Syrian Arab Republic","Taiwan, Province of China","Tajikistan","Tanzania, United Republic of","Thailand","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands",
                 
                 "Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","Virgin Islands (British)",
                 
                 "Virgin Islands (U.S.)","Wallis and Futuna Islands","Western Sahara","Yemen","Zambia","Zimbabwe"];
    
    lessButton: boolean = false;
    
    dublicateEmailId: boolean = false;
    noOfContactsDropdown : boolean = true;
    validCsvContacts : boolean;
    inValidCsvContacts : boolean;
    isHeaderCheckBoxChecked:boolean = false;
    isInvalidHeaderCheckBoxChecked:boolean = false;
    public clipBoard: boolean = false;
    public clipboardTextareaText: string;
    pagedItems: any[];
    checkedUserList = [];
    selectedInvalidContactIds = [];
    selectedContactListIds = [];
    fileTypeError: boolean;
    selectedDropDown: string;
    public uploader: FileUploader;
    public clickBoard: boolean = false;
    public filePrevew: boolean = false;
    noContactsFound: boolean;
    noContactsFound1: boolean;
    hidingListUsersTable: boolean;
    invalidPatternEmails: string[] = [];

    public allUsers: number;
    checkingLoadContactsCount: boolean;
    showAllContactData: boolean = false;
    showEditContactData: boolean = true;

    hasContactRole:boolean = false;
    loggedInUserId = 0;
    hasAllAccess = false;
    
    public currentContactType: string = "all_contacts";
    public userListIds: Array<UserListIds>;
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
    sortOptions = [
                   { 'name': 'Sort By', 'value': ''},
                   { 'name': 'Email(A-Z)', 'value': 'emailId-ASC'},
                   { 'name': 'Email(Z-A)', 'value': 'emailId-DESC'},
                   { 'name': 'First Name(ASC)', 'value': 'firstName-ASC'},
                   { 'name': 'First Name(DESC)', 'value': 'firstName-DESC'},
                   { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC'},
                   { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC'},
               ];
               
               sortOptionsForPagination = [
                                           { 'name': '10', 'value': '10'},
                                           { 'name': '25', 'value': '25'},
                                           { 'name': '50', 'value': '50'},
                                           { 'name': 'ALL', 'value': 'ALL'},
                                           ];
               sortOptionForPagination = this.sortOptionsForPagination[0];
               public sortOption: any = this.sortOptions[0];
               
               isPartner: boolean;
               checkingContactTypeName: string;
               
               filterOptions = [
                                { 'name': '', 'value': 'Field Name'},
                                { 'name': 'firstName', 'value': 'First Name'},
                                { 'name': 'lastName', 'value': 'Last Name'},
                                { 'name': 'Company', 'value': 'Company'},
                                { 'name': 'JobTitle', 'value': 'Job Title'},
                                { 'name': 'country', 'value': 'Country'},
                                ];
            filterOption = this.filterOptions[0];
            
            filterConditions = [
                             { 'name': '', 'value': 'Condition'},
                             { 'name': 'eq', 'value': '='},
                             { 'name': 'lt', 'value': '<'},
                             { 'name': 'gt', 'value': '>'},
                             { 'name': 'like', 'value': 'like'},
                             ];
            filterCondition = this.filterConditions[0];

    constructor( public refService:ReferenceService,private contactService: ContactService, private manageContact: ManageContactsComponent,
        private authenticationService: AuthenticationService, private router: Router,
        private pagerService: PagerService, public pagination: Pagination, public xtremandLogger:XtremandLogger  ) {
        
        this.addContactuser.country = (this.countries[0]);
        
        let currentUrl = this.router.url;
        if(currentUrl.includes('home/contacts')){
            this.isPartner = false;
            this.checkingContactTypeName = "Contact"
        }else{
            this.isPartner = true;  
            this.checkingContactTypeName = "Partner"
        }
        
        this.users = new Array<User>();
        this.notifyParent = new EventEmitter<User>();
        this.hasContactRole = this.refService.hasRole(this.refService.roles.contactsRole);
        
        this.hasAllAccess = this.refService.hasAllAccess();
        this.loggedInUserId = this.authenticationService.getUserId();
    }

    onChangeAllContactUsers( event: Event ) {
        this.sortOption = event;
        this.selectedDropDown = this.sortOption.value;
        if(this.currentContactType == "all_contacts"){
            this.pagination.maxResults = (this.selectedDropDown == 'ALL') ? this.pagination.totalRecords : parseInt(this.selectedDropDown);
            this.pagination.pageIndex = 1;
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }else{
            this.contactsByType.pagination.maxResults = (this.selectedDropDown == 'ALL') ? this.contactsByType.pagination.totalRecords : parseInt(this.selectedDropDown);
            this.contactsByType.pagination.pageIndex = 1;
            this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
        }
    }

    checked( event: boolean ) {
        this.xtremandLogger.info( "check value" + event )
        this.contacts.forEach(( contacts ) => {
            if ( event == true )
                contacts.isChecked = true;
            else
                contacts.isChecked = false;
        })
    }

    fileChange( input: any ) {
        this.uploadCsvUsingFile = true;
        this.response.responseType = null;
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
            this.selectedAddContactsOption = 2;
            this.isShowUsers = false;
            this.fileTypeError = false;
            this.xtremandLogger.info( "coontacts preview" );
            $( "#sample_editable_1" ).hide();
            this.filePrevew = true;
            let reader = new FileReader();
            reader.readAsText( files[0] );
            this.xtremandLogger.info( files[0] );
            var self = this;
            reader.onload = function( e: any ) {
                var contents = e.target.result;
                var allTextLines = contents.split( /\r\n|\n/ );
                for ( var i = 1; i < allTextLines.length; i++ ) {
                    var data = allTextLines[i].split( ',' );
                    if ( data[0].trim().length > 0 ) {
                        let user = new User();
                        user.emailId = data[4];
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.address = data[5];
                        user.city = data[6];
                        user.country = data[7];
                        user.mobileNumber = data[8];
                        user.description = data[9];
                        self.users.push( user );
                        self.contacts.push( user );
                    }
                }
                console.log( "AddContacts : readFiles() contacts " + JSON.stringify( self.users ) );
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
    updateContactList( contactListId: number) {
        this.showInvalidMaills = false;
        this.invalidPattenMail = false;
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        console.log(this.users);
        var testArray = [];
        for ( var i = 0; i <= this.users[0].emailId.length - 1; i++ ) {
            testArray.push( this.users[0].emailId.toLowerCase() );
        }
        for(var j = 0; j <= this.users.length-1; j++ ){
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
        this.xtremandLogger.log( "DUPLICATE EMAILS" + this.duplicateEmailIds );
        var valueArr = this.users.map( function( item ) { return item.emailId.toLowerCase() });
        var isDuplicate = valueArr.some( function( item, idx ) {
            return valueArr.indexOf( item ) != idx
        });
        console.log( isDuplicate );
        this.xtremandLogger.info( this.users[0].emailId );
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
        this.xtremandLogger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.users ) );
        this.contactService.updateContactList( this.contactListId, this.users )
            .subscribe(
            ( data: any ) => {
                data = data;
                this.allUsers = this.contactsByType.allContactsCount;
                this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                this.manageContact.editContactList( this.contactListId, this.contactListName,this.uploadedUserId);
                $( "tr.new_row" ).each( function() {
                    $( this ).remove();
                });
                
                this.setResponseDetails('SUCCESS', 'your contacts has been saved successfully');
                    
                this.checkingLoadContactsCount = true;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                this.cancelContacts();
            },
            ( error: any ) => {
                let body: string = error['_body'];
                body = body.substring(1, body.length-1);
                if ( body.includes( 'Please delete those campaigns first.' )) {
                    this.setResponseDetails('ERROR', body);
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.dublicateEmailId = false;
    }

    updateCsvContactList( contactListId: number) {
        if ( this.users.length > 0 ) {
            for(let i = 0; i< this.users.length;i++){
                if(!this.validateEmailAddress(this.users[i].emailId)){
                    this.invalidPatternEmails.push(this.users[i].emailId)
                }
                if(this.validateEmailAddress(this.users[i].emailId)){
                    this.validCsvContacts = true;
                }
                else {
                    this.validCsvContacts = false;
                }
            }
            if(this.validCsvContacts == true) {
                $( "#sample_editable_1" ).show();
                this.xtremandLogger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.users ) );
                this.contactService.updateContactList( this.contactListId, this.users )
                    .subscribe(
                    data => {
                        data = data;
                        this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                        this.manageContact.editContactList( this.contactListId, this.contactListName,this.uploadedUserId );
                        $( "tr.new_row" ).each( function() {
                            $( this ).remove();
                        });
                        
                        this.setResponseDetails('SUCCESS', 'your contacts has been saved successfully');
                        
                        this.users = [];
                        this.uploadCsvUsingFile = false;
                        this.uploader.queue.length = 0;
                        this.filePrevew = false;
                        this.isShowUsers = true;
                        this.removeCsv();
                        this.checkingLoadContactsCount = true;
                        this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                    },
                    ( error: any ) => {
                        let body: string = error['_body'];
                        body = body.substring(1, body.length-1);
                        if ( body.includes( 'Please delete those campaigns first.' )) {
                            this.setResponseDetails('ERROR', body);
                        }else{
                            this.xtremandLogger.errorPage(error);
                        }
                        console.log( error );
                    },
                    () => this.xtremandLogger.info( "MangeContactsComponent loadContactLists() finished" )
                    )
            }else{
                this.inValidCsvContacts = true;
            }
        }
    }
    
    setResponseDetails(responseType: string, responseMessage: string){
        this.response.responseType = responseType;
        this.response.responseMessage = responseMessage;
    }
    
    removeContactListUsers( contactListId: number ) {
        let self = this;
        this.xtremandLogger.info( this.selectedContactListIds );
        this.contactService.removeContactListUsers( this.contactListId, this.selectedContactListIds )
            .subscribe(
            ( data: any ) => {
                data = data;
                this.allUsers = this.contactsByType.allContactsCount;
                console.log( "update Contacts ListUsers:" + data );
                
                this.setResponseDetails('SUCCESS', 'your contacts has been deleted successfully');
                
                $.each( this.selectedContactListIds, function( index: number, value: any ) {
                    $( '#row_' + value ).remove();
                    console.log( index + "value" + value );
                });
                this.checkingLoadContactsCount = true;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                this.selectedContactListIds.length = 0;
            },
            ( error: any ) => {
                let body: string = error['_body'];
                body = body.substring(1, body.length-1);
                if ( body.includes( 'Please delete those campaigns first.' )) {
                    this.setResponseDetails('ERROR', body);
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "deleted completed" )
            );
    }

    showAlert( contactListId: number ) {
        this.xtremandLogger.info( "userIdForChecked" + this.selectedContactListIds );
        if ( this.selectedContactListIds.length != 0 ) {
            this.xtremandLogger.info( "contactListId in sweetAlert() " + this.contactListId );
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
                    text: "If you delete all Users, your contact list aslo will delete and You won't be able to revert this!",
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
        if(this.emailNotValid == true ){
            $( "#addContactModal .close" ).click()
            this.users.push( this.addContactuser );
           }
        this.fileTypeError = false;
        this.noContactsFound = false;
        this.addContactuser = new User();
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
        this.selectedAddContactsOption = 8;
        this.users = [];
        this.filePrevew = false;
        this.isShowUsers = true;
        $( "#sample_editable_1" ).show();
    }

    copyFromClipboard() {
        this.fileTypeError = false;
        this.noContactsFound = false;
        this.clipboardTextareaText = "";
        this.clickBoard = true;
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
        this.xtremandLogger.info( "selectedDropDown:" + selectedDropDown );
        this.xtremandLogger.info( splitValue );
        var startTime = new Date();
        $( "#clipBoardValidationMessage" ).html( '' );
        var self = this;
        var allTextLines = this.clipboardTextareaText.split( "\n" );
        this.xtremandLogger.info( "allTextLines: " + allTextLines );
        this.xtremandLogger.info( "allTextLines Length: " + allTextLines.length );
        var isValidData: boolean = true;
        for ( var i = 0; i < allTextLines.length; i++ ) {
            var data = allTextLines[i].split( splitValue );
            if ( !this.validateEmailAddress( data[4] ) ) {
                $( "#clipBoardValidationMessage" ).append( "<h4 style='color:#f68a55;'>" + "Email Address is not valid for Row:" + ( i + 1 ) + " -- Entered Email Address: " + data[4] + "</h4>" );
                isValidData = false;
            }
            this.users.length = 0;
            this.pagination.pagedItems.length = 0;
        }
        if ( isValidData ) {
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            for ( var i = 0; i < allTextLines.length; i++ ) {
                var data = allTextLines[i].split( splitValue );
                let user = new User();
                switch ( data.length ) {
                case 1:
                    user.firstName = data[0];
                    break;
                case 2:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    break;
                case 3:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    user.contactCompany = data[2];
                    break;
                case 4:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    user.contactCompany = data[2];
                    user.jobTitle = data[3];
                    break;
                case 5:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    user.contactCompany = data[2];
                    user.jobTitle = data[3];
                    user.emailId = data[4];
                    break;
                case 6:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    user.contactCompany = data[2];
                    user.jobTitle = data[3];
                    user.emailId = data[4];
                    user.address = data[5];
                    break;
                case 7:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    user.contactCompany = data[2];
                    user.jobTitle = data[3];
                    user.emailId = data[4];
                    user.address = data[5];
                    user.city = data[6];
                    break;
                case 8:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    user.contactCompany = data[2];
                    user.jobTitle = data[3];
                    user.emailId = data[4];
                    user.address = data[5];
                    user.city = data[6];
                    user.country = data[7];
                    break;
                case 9:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    user.contactCompany = data[2];
                    user.jobTitle = data[3];
                    user.emailId = data[4];
                    user.address = data[5];
                    user.city = data[6];
                    user.country = data[7];
                    user.mobileNumber = data[8];
                    break;
                case 10:
                    user.firstName = data[0];
                    user.lastName = data[1];
                    user.contactCompany = data[2];
                    user.jobTitle = data[3];
                    user.emailId = data[4];
                    user.address = data[5];
                    user.city = data[6];
                    user.country = data[7];
                    user.mobileNumber = data[8];
                    user.description = data[9];
                    break;
                }
                this.xtremandLogger.info( user );
                this.users.push( user );
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
        this.xtremandLogger.info( this.users );
    }

    validateEmailAddress( emailId: string ) {
        var EMAIL_ID_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_ID_PATTERN.test( emailId );
    }
    validateName( name: string ) {
        return ( name.trim().length > 0 );
    }

    updateContactListFromClipBoard( contactListId: number) {
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        var testArray = [];
        for ( var i = 0; i <= this.users.length - 1; i++ ) {
            testArray.push( this.users[i].emailId );
        }

        var newArray = this.compressArray( testArray );
        for ( var w = 0; w < newArray.length; w++ ) {
            if ( newArray[w].count >= 2 ) {
                this.duplicateEmailIds.push( newArray[w].value );
            }
            console.log( newArray[w].value );
            console.log( newArray[w].count );
        }
        this.xtremandLogger.log( "DUPLICATE EMAILS" + this.duplicateEmailIds );
        var valueArr = this.users.map( function( item ) { return item.emailId });
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
        this.xtremandLogger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.users ) );
        if(this.users.length !=0 ){
        this.contactService.updateContactList( this.contactListId, this.users )
            .subscribe(
            data => {
                data = data;
                this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                this.manageContact.editContactList( this.contactListId, this.contactListName,this.uploadedUserId);
                $( "tr.new_row" ).each( function() {
                    $( this ).remove();

                });
                this.clickBoard = false;
                
                this.setResponseDetails('SUCCESS', 'your contacts has been saved successfully');
                
                $( "button#add_contact" ).prop( 'disabled', false );
                $( "button#upload_csv" ).prop( 'disabled', false );
                this.users.length = 0;
                this.cancelContacts();
                this.checkingLoadContactsCount = true;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            },
            ( error: any ) => {
                let body: string = error['_body'];
                body = body.substring(1, body.length-1);
                if ( body.includes( 'Please delete those campaigns first.' )) {
                    this.setResponseDetails('ERROR', body);
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "MangeContactsComponent loadContactLists() finished" )
            )
        this.dublicateEmailId = false;
        }
    }

    saveContacts( contactListId: number ) {
        if ( this.selectedAddContactsOption == 0 ) {
            this.updateContactList( this.contactListId);
        }

        if ( this.selectedAddContactsOption == 1 ) {
            this.updateContactListFromClipBoard( this.contactListId );
        }

        if ( this.selectedAddContactsOption == 2 ) {
            this.updateCsvContactList( this.contactListId);
        }
    }

    cancelContacts() {
        if(this.selectedAddContactsOption == 1){
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }
        this.selectedAddContactsOption = 8;
        this.users = [];
        this.dublicateEmailId = false;
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
                $('#campaignContactListTable_'+id).addClass('contact-list-selected');
             });
            this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
        }else{
            $('[name="campaignContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("contact-list-selected");
            if(this.pagination.maxResults==this.pagination.totalRecords){
                this.selectedContactListIds = [];
            }else{
                let currentPageContactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                this.selectedContactListIds = this.refService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
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
        if(this.selectedContactListIds.length == this.pagination.pagedItems.length ){
            this.isHeaderCheckBoxChecked = true;
        }else{
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
    }
   
    editContactListLoadAllUsers( contactSelectedListId: number, pagination: Pagination ) {
        this.refService.loading(this.httpRequestLoader, true); 
        this.httpRequestLoader.isHorizontalCss = true;
        this.showSelectedCategoryUsers = false;
        this.xtremandLogger.info( "manageContacts editContactList #contactSelectedListId " + contactSelectedListId );
        this.selectedContactListId = contactSelectedListId;
        this.currentContactType = "all_contacts";
        pagination.criterias = this.criterias;
         this.contactService.loadUsersOfContactList( contactSelectedListId, pagination ).subscribe(
            ( data: any ) => {
                this.xtremandLogger.info( "MangeContactsComponent loadUsersOfContactList() data => " + JSON.stringify( data ) );
                this.contacts = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                this.xtremandLogger.log( data );
                if ( this.checkingLoadContactsCount == true ) {
                    this.contactsByType.allContactsCount = data.allcontacts;
                    this.contactsByType.invalidContactsCount = data.invalidUsers;
                    this.contactsByType.unsubscribedContactsCount = data.unsubscribedUsers;
                    this.contactsByType.activeContactsCount = data.activecontacts;
                    this.contactsByType.inactiveContactsCount = data.nonactiveUsers;
                    this.allUsers = this.contactsByType.allContactsCount;
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
                this.refService.loading(this.httpRequestLoader, false); 
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.contacts );
                this.checkingLoadContactsCount = false;
                this.xtremandLogger.log( this.allUsers );
                
                var contactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedContactListIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                this.xtremandLogger.log("paginationUserIDs"+contactIds);
                this.xtremandLogger.log("Selected UserIDs"+this.selectedContactListIds);
                if(items.length==pagination.totalRecords || items.length == this.pagination.pagedItems.length){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }
                
            },
            error => this.xtremandLogger.error( error ),
            () => this.xtremandLogger.info( "MangeContactsComponent loadUsersOfContactList() finished" )
        )
    }
    
    setPage( page: number, ) {
        this.pagination.pageIndex = page;
        if ( this.currentContactType == "all_contacts" ) {
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }
    }

    refresh() {
        this.editContacts = null;
        this.notifyParent.emit( this.editContacts );
    }

    backToEditContacts() {
        this.setPage(1);
        this.searchKey = null;
        this.pagination.searchKey = this.searchKey;
        this.pagination.maxResults = 10;
        this.invalidDeleteSuccessMessage = false;
        this.invalidDeleteErrorMessage = false;
        this.editListContacts = true;
        this.showAllContactData = false;
        this.showEditContactData = true;
        this.selectedInvalidContactIds = [];
        this.selectedContactListIds = [];
        this.uploadCsvUsingFile = false;
        this.showSelectedCategoryUsers = true;
        this.checkingLoadContactsCount = true;
        this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        this.resetResponse();
        this.contactsByType.pagination = new Pagination();
        this.sortOptionForPagination = this.sortOptionsForPagination[0];
        this.contactsByType.selectedCategory = null;
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
            this.selectedInvalidContactIds = this.refService.removeDuplicates(this.selectedInvalidContactIds);
        }else{
           console.log("unceck");
            $('[name="invalidContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("invalid-contacts-selected");
            if(this.pagination.maxResults==this.contactsByType.pagination.totalRecords){
                this.selectedInvalidContactIds = [];
            }else{
                let currentPageContactIds = this.contactsByType.pagination.pagedItems.map(function(a) {return a.id;});
                this.selectedInvalidContactIds = this.refService.removeDuplicatesFromTwoArrays(this.selectedInvalidContactIds, currentPageContactIds);
            }
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
        if(this.selectedInvalidContactIds.length == this.contactsByType.pagination.pagedItems.length ){
            this.isInvalidHeaderCheckBoxChecked = true;
        }else{
            this.isInvalidHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
    }
    
    removeInvalidContactListUsers() {
        this.xtremandLogger.info( this.selectedInvalidContactIds );
        this.contactService.removeContactListUsers( this.contactListId, this.selectedInvalidContactIds )
            .subscribe(
            ( data: any ) => {
                data = data;
                console.log( "update invalidContacts ListUsers:" + data );
                $.each( this.selectedInvalidContactIds, function( index: number, value: any ) {
                    $( '#row_' + value ).remove();
                    console.log( index + "value" + value );
                });
                //this.setResponseDetails('SUCCESS', 'your contacts has been deleted successfully');
                this.invalidDeleteSuccessMessage = true;
                this.listOfSelectedContactListByType(this.contactsByType.selectedCategory );
                this.contactsByType.invalidContactsCount = data.invalidUsers;
                this.selectedInvalidContactIds.length = 0;
            },
              ( error: any ) => {
                  let body: string = error['_body'];
                  body = body.substring(1, body.length-1);
                  if ( body.includes( 'Please delete those campaigns first.' )) {
                      this.response.responseMessage = body;
                      this.invalidDeleteErrorMessage = true;
                }
                },
                () => this.xtremandLogger.info( "deleted completed" )
            );
        this.invalidDeleteSuccessMessage = false;
        this.invalidDeleteErrorMessage = false;
    }
    invalidContactsShowAlert() {
        if ( this.selectedInvalidContactIds.length != 0 ) {
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

    removeContactListUsers1( contactId: number ) {
        this.contactUsersId = contactId;
        this.contactIds[0] = this.contactUsersId;
        this.contactService.removeContactListUsers( this.contactListId, this.contactIds )
            .subscribe(
            ( data: any ) => {
                data = data;
                this.contactsByType.allContactsCount = data.allcontacts;
                this.contactsByType.invalidContactsCount = data.invalidUsers;
                this.contactsByType.unsubscribedContactsCount = data.unsubscribedUsers;
                this.contactsByType.activeContactsCount = data.activecontacts;
                this.contactsByType.inactiveContactsCount = data.nonactiveUsers;
                this.allUsers = this.contactsByType.allContactsCount;
                console.log( "update Contacts ListUsers:" + data );
                this.setResponseDetails('SUCCESS', 'your contacts has been deleted successfully');
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            },
            ( error: any ) => {
                let body: string = error['_body'];
                body = body.substring(1, body.length-1);
                if ( body.includes( 'Please delete those campaigns first.' )) {
                    this.setResponseDetails('ERROR', body);
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "deleted completed" )
            );
    }

    deleteContactList() {
        this.xtremandLogger.info( "MangeContacts deleteContactList : " + this.selectedContactListId );
        this.contactService.deleteContactList( this.selectedContactListId )
            .subscribe(
            data => {
                console.log( "MangeContacts deleteContactList success : " + data );
                $( '#contactListDiv_' + this.selectedContactListId ).remove();
                this.setResponseDetails('SUCCESS', 'your contacts has been deleted successfully');
                this.refresh();
                this.contactService.deleteUserSucessMessage = true;
            },
            ( error: any ) => {
                let body: string = error['_body'];
                body = body.substring(1, body.length-1);
                if ( body.includes( 'Please delete those campaigns first.' )) {
                    this.setResponseDetails('ERROR', body);
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "deleted completed" )
            );
    }
    
    deleteUserShowAlert( contactId: number ) {
        this.contactIds.push( this.contactUsersId )
        this.xtremandLogger.info( "contactListId in sweetAlert() " + this.contactIds );
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
                text: "If you delete all Users, your contact list aslo will delete and You won't be able to revert this!",
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
    showingContactDetails(contactType: string){
        this.resetResponse();
        this.contactsByType.pagination = new Pagination();
        this.sortOptionForPagination = this.sortOptionsForPagination[0];
        this.contactsByType.selectedCategory = null;
        this.listOfSelectedContactListByType(contactType);
    }
    listOfSelectedContactListByType(contactType: string){
        this.currentContactType = '';
        this.showAllContactData = true;
        this.showEditContactData = false;
        this.contactsByType.isLoading = true;
        this.resetListContacts();
        this.resetResponse();
        if(this.editListContacts == true){
            this.searchKey = null;
            this.editListContacts = false;
        }
        this.refService.loading(this.httpRequestLoader, true); 
        this.httpRequestLoader.isHorizontalCss = true;
        this.contactService.listOfSelectedContactListByType(this.selectedContactListId,contactType, this.contactsByType.pagination)
        .subscribe(
            data => {
                this.contactsByType.selectedCategory = contactType;
                this.contactsByType.contacts = data.listOfUsers;
                this.contactsByType.pagination.totalRecords = data.totalRecords;
                this.contactsByType.pagination = this.pagerService.getPagedItems( this.contactsByType.pagination, this.contactsByType.contacts );
           
               /* if(this.contactsByType.pagination.totalRecords == 0){
                this.setResponseDetails('ERROR', 'No contacts found');
                }*/
                if(this.contactsByType.selectedCategory == 'invalid'){
                    this.userListIds = data.listOfUsers;
                }
                
                var contactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items1 = $.grep(this.selectedInvalidContactIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                this.xtremandLogger.log("inavlid contacts page pagination Object Ids"+contactIds);
                this.xtremandLogger.log("selected inavalid contacts Ids"+this.selectedInvalidContactIds);
               
                if(items1.length == this.contactsByType.pagination.totalRecords || items1.length == this.contactsByType.pagination.pagedItems.length){
                    this.isInvalidHeaderCheckBoxChecked = true;
                }else{
                    this.isInvalidHeaderCheckBoxChecked = false;
                }
                this.refService.loading(this.httpRequestLoader, false); 
                
            },
            error => console.log( error ),
            () => {
                this.contactsByType.isLoading = false;
                }
        );
    }
    
    setPageForListContactsByType(pageNumber: number, contactType: string){
        this.contactsByType.pagination.pageIndex = pageNumber;
        this.listOfSelectedContactListByType(contactType);
    }
    
    resetListContacts(){
        this.sortOption = this.sortOptions[0];
        this.showSelectedCategoryUsers = false;
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
        
        if(this.currentContactType == "all_contacts"){
            this.pagination.pageIndex = 1;
            this.pagination.sortcolumn = this.sortcolumn;
            this.pagination.sortingOrder = this.sortingOrder;
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }else{
            this.contactsByType.pagination.pageIndex = 1;
            this.contactsByType.pagination.sortcolumn = this.sortcolumn;
            this.contactsByType.pagination.sortingOrder = this.sortingOrder;
            this.listOfSelectedContactListByType( this.contactsByType.selectedCategory );
        }            
    }
    
    search(searchType: string){
        if(this.currentContactType == "all_contacts"){
            this.pagination.searchKey = this.searchKey;
            this.pagination.pageIndex = 1;
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }else{
            this.contactsByType.pagination.searchKey = this.searchKey;
            this.contactsByType.pagination.pageIndex = 1;
            this.listOfSelectedContactListByType( this.contactsByType.selectedCategory );
        } 
    }
    
    addContactsOption(addContactsOption: number ){
        this.resetResponse();
        this.selectedAddContactsOption = addContactsOption;
        if(addContactsOption == 0)
            this.addRow();
        else if(addContactsOption == 1)
            this.copyFromClipboard();
    }
    
   resetResponse(){
       this.response.responseType = null;
       this.response.responseMessage = null;
   }
   
   addContactModalOpen(){
       $( "#addContactModal" ).show();
       this.addContactuser.country = (this.countries[0]);
   }
   
   addContactModalClose(){
       $('#addContactModal').modal('toggle');
       $( "#addContactModal .close" ).click()
   }
   validateEmail(emailId: string){
       if(this.validateEmailAddress( emailId )){
           this.checkingForEmail = true;
           this.validEmailPatternSuccess = true;
       }
       else{
           this.checkingForEmail = false;
       }
   }
   checkingEmailPattern( emailId: string ) {
       this.validEmailPatternSuccess = false;
       if ( this.validateEmailAddress( emailId ) ) {
           this.validEmailPatternSuccess = true;
           this.emailNotValid = true;
       } else {
           this.validEmailPatternSuccess = false;
           this.emailNotValid = false;
       }
   }
     
   saveAs(){
       let self = this;
       swal({
           title: this.checkingContactTypeName + ' List Name',
           input: 'text',
           inputValue: this.contactListName + '_copy',
           showCancelButton: true,
           confirmButtonText: 'Submit',
           showLoaderOnConfirm: true,
           /*preConfirm: function (email) {
             return new Promise(function (resolve, reject) {
               setTimeout(function() {
                 if (email === 'taken@example.com') {
                   reject('This email is already taken.')
                 } else {
                   resolve()
                 }
               }, 2000)
             })
           },*/
           allowOutsideClick: false
         }).then( function( name: any ) {
             
             self.saveDuplicateContactList(name);
         })
   }
   
   saveDuplicateContactList(name: string) {
       if ( name != "") {
           this.contactListObject = new ContactList;
           this.contactListObject.name = name;
           this.contactListObject.isPartnerUserList = this.isPartner;
           this.contactService.saveContactList( this.contacts, name, this.isPartner )
               .subscribe(
                   data => {
                       data = data;
                       if(this.isPartner == false){
                           this.router.navigateByUrl( '/home/contacts/manage' )
                           }else{
                               this.router.navigateByUrl( 'home/partners/manage' )
                           }
                       this.setResponseDetails('SUCCESS', 'your contact List created successfully');
                   },

                   (error: any) => {
                       this.xtremandLogger.error(error);
                       this.xtremandLogger.errorPage(error);
                   },
                   () => this.xtremandLogger.info( "allcontactComponent saveSelectedUsers() finished" )
                   )
       }
       else {
           this.xtremandLogger.error( "AllContactComponent saveSelectedUsers() UserNotSelectedContacts" );
       }
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
   modelForSeg(){
       this.addNewRow();
   }
   addNewRow(){
       let criteria = new Criteria();
       this.criterias.push( criteria );
   }
   
   contactFilter(){
       console.log("filterValue "+ this.filterValue);
       console.log("filterOption "+  this.filterOption.name);
       console.log("filterCondition "+this.filterCondition.name);
       
       this.criteria.property = this.filterOption.name;
       this.criteria.value1 = this.filterValue;
       this.criteria.operation = this.filterCondition.name;
       
       this.criterias.push(this.criteria);
       console.log( this.criteria );
       this.editContactListLoadAllUsers( this.selectedContactListId,this.pagination );
       this.criterias.length = 0;
       $( "#filterModal .close" ).click()

   }
   
    ngOnInit() {
        this.selectedContactListName = this.contactListName;
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
