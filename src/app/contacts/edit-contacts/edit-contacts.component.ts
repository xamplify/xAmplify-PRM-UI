import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { Criteria } from '../models/criteria';
import { EditUser } from '../models/edit-user';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
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
import { CountryNames } from '../../common/models/country-names';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { TeamMemberService } from '../../team/services/team-member.service';
//import { AddPartnersComponent } from '../../partners/add-partners/add-partners.component';

declare var Metronic, Promise, Layout, Demo, swal, Portfolio, $, Papa: any;

@Component( {
    selector: 'app-edit-contacts',
    templateUrl: './edit-contacts.component.html',
    styleUrls: ['../../../assets/css/button.css',
        '../../../assets/css/numbered-textarea.css',
        './edit-contacts.component.css', '../../../assets/css/phone-number-plugin.css'],
    providers: [Pagination, HttpRequestLoader, CountryNames, Properties, RegularExpressions, TeamMemberService]
})
export class EditContactsComponent implements OnInit, OnDestroy {
    @Input() contacts: User[];
    @Input() totalRecords: number;
    @Input() contactListId: number;
    @Input() contactListName: string;
    @Input() selectedContactListId: number;
    @Input() uploadedUserId: number;
    @Input() isDefaultPartnerList: boolean;
    @Input( 'value' ) value: number;
    editContacts: User;
    @Output() notifyParent: EventEmitter<User>;

    criteria = new Criteria();
    editUser: EditUser = new EditUser();
    criterias = new Array<Criteria>();
    isSegmentation: boolean = false;
    isSegmentationErrorMessage: boolean;

    totalListUsers = [];
    updatedUserDetails = [];

    contactListObject: ContactList;
    selectedContactListName: string;
    public validEmailPatternSuccess: boolean = true;
    emailNotValid: boolean;
    checkingForEmail: boolean;
    addContactuser: User = new User();
    updateContactUser: boolean = false;

    public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    AddContactsOption: typeof AddContactsOption = AddContactsOption;
    selectedAddContactsOption: number = 8;
    invalidDeleteSuccessMessage: boolean = false;
    editListContacts: boolean = true;

    uploadCsvUsingFile: boolean = false;
    contactsByType: ContactsByType = new ContactsByType();
    gettingAllUserspagination: Pagination = new Pagination();
    showSelectedCategoryUsers: boolean = true;
    isShowUsers: boolean = true;
    public users: Array<User>;
    customResponse: CustomResponse = new CustomResponse();
    names: string[] = [];

    selectedContactForSave = [];
    addPartnerSave: boolean = false;

    dublicateEmailId: boolean = false;
    noOfContactsDropdown: boolean = true;
    validCsvContacts: boolean;
    inValidCsvContacts: boolean;
    isHeaderCheckBoxChecked: boolean = false;
    isInvalidHeaderCheckBoxChecked: boolean = false;
    public clipboardTextareaText: string;
    pagedItems: any[];
    checkedUserList = [];
    selectedInvalidContactIds = [];
    selectedContactListIds = [];
    selectedCampaignIds = [];
    fileTypeError: boolean;
    selectedDropDown: string;
    public uploader: FileUploader;
    public clickBoard: boolean = false;
    public filePrevew: boolean = false;
    noContactsFound: boolean;
    invalidPatternEmails: string[] = [];

    public allUsers: number;
    checkingLoadContactsCount: boolean;
    showAllContactData: boolean = false;
    showEditContactData: boolean = true;

    hasContactRole: boolean = false;
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
    public invalidPattenMail = false;
    showInvalidMaills = false;
    downloadDataList = [];
    isEmailExist: boolean = false;
    sortOptions = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Email(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
        { 'name': 'Company Name(ASC)', 'value': 'contactCompany-ASC' },
        { 'name': 'Company Name(DESC)', 'value': 'contactCompany-DESC' },
    ];

    public sortOption: any = this.sortOptions[0];
    isUpdateUser: boolean;
    isPartner: boolean;
    isCompanyDetails = false;
    checkingContactTypeName: string;
    newUsersEmails = [];
    teamMemberPagination: Pagination = new Pagination();
    teamMembersList = [];
    orgAdminsList = [];
    editingEmailId = '';
    loading = false;
    contactAllDetails = [];
    openCampaignModal = false;
    logListName = "";

    filterOptions = [
        { 'name': '', 'value': 'Field Name*' },
        { 'name': 'firstName', 'value': 'First Name' },
        { 'name': 'lastName', 'value': 'Last Name' },
        { 'name': 'Company', 'value': 'Company' },
        { 'name': 'JobTitle', 'value': 'Job Title' },
        { 'name': 'Email Id', 'value': 'Email Id' },
        { 'name': 'country', 'value': 'Country' },
        { 'name': 'city', 'value': 'City' },
        { 'name': 'mobileNumber', 'value': 'Mobile Number' },
        { 'name': 'notes', 'value': 'Notes' },
    ];
    filterOption = this.filterOptions[0];

    filterConditions = [
        { 'name': '', 'value': 'Condition*' },
        { 'name': 'eq', 'value': '=' },
        { 'name': 'like', 'value': 'like' },
    ];
    filterCondition = this.filterConditions[0];

    constructor( public refService: ReferenceService, public contactService: ContactService, private manageContact: ManageContactsComponent,
        public authenticationService: AuthenticationService, private router: Router, public countryNames: CountryNames,
        public regularExpressions: RegularExpressions,
        private pagerService: PagerService, public pagination: Pagination, public xtremandLogger: XtremandLogger, public properties: Properties,
        public teamMemberService: TeamMemberService ) {

        this.addContactuser.country = ( this.countryNames.countries[0] );

        let currentUrl = this.router.url;
        if ( currentUrl.includes( 'home/contacts' ) ) {
            this.isPartner = false;
            this.checkingContactTypeName = "Contact"
        } else {
            this.isPartner = true;
            this.checkingContactTypeName = "Partner"
        }

        this.users = new Array<User>();
        this.notifyParent = new EventEmitter<User>();
        this.hasContactRole = this.refService.hasRole( this.refService.roles.contactsRole );

        this.hasAllAccess = this.refService.hasAllAccess();
        this.loggedInUserId = this.authenticationService.getUserId();
    }

    onChangeAllContactUsers( event: Pagination ) {
        try {
            this.pagination = event;
            if ( this.currentContactType == "all_contacts" ) {
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            } else {
                this.contactsByType.pagination = event;
                this.listOfSelectedContactListByType( this.contactsByType.selectedCategory );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "allPaginationDropdown" );
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
        this.customResponse.responseType = null;
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
        try {
            if ( files[0].type == "application/vnd.ms-excel" || files[0].type == "text/csv" || files[0].type == "text/x-csv" ) {
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
                    var csvResult = Papa.parse( contents );
                    var allTextLines = csvResult.data;
                    for ( var i = 1; i < allTextLines.length; i++ ) {
                        if ( allTextLines[i][4].trim().length > 0 ) {
                            let user = new User();
                            user.emailId = allTextLines[i][4];
                            user.firstName = allTextLines[i][0];
                            user.lastName = allTextLines[i][1];
                            user.contactCompany = allTextLines[i][2];
                            user.jobTitle = allTextLines[i][3];
                            user.address = allTextLines[i][5];
                            user.city = allTextLines[i][6];
                            user.country = allTextLines[i][7];
                            user.mobileNumber = allTextLines[i][8];
                            /*user.description = allTextLines[i][9];*/
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
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "readingCsvFile()" );
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

    closeShowValidMessage() {
        this.showInvalidMaills = false;
    }

    updateContactList( contactListId: number ) {
        this.showInvalidMaills = false;
        this.invalidPattenMail = false;
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        console.log( this.users );
        var testArray = [];
        for ( var i = 0; i <= this.users[0].emailId.length - 1; i++ ) {
            testArray.push( this.users[0].emailId.toLowerCase() );
        }
        for ( var j = 0; j <= this.users.length - 1; j++ ) {
            if ( this.validateEmailAddress( this.users[j].emailId ) ) {
                this.invalidPattenMail = false;
            } else {
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
        if ( this.invalidPattenMail === true ) {
            this.showInvalidMaills = true;
            testArray.length = 0;
        } else if ( !isDuplicate ) {
            this.saveValidEmails();
        } else {
            this.dublicateEmailId = true;
        }
    }

    checkTeamEmails( arr, val ) {
        this.xtremandLogger.log( arr.indexOf( val ) > -1 );
        return arr.indexOf( val ) > -1;
    }

    saveValidEmails() {
        try {
            this.isCompanyDetails = false;
            this.newUsersEmails.length = 0;
            let existedEmails = [];

            for ( let i = 0; i < this.users.length; i++ ) {
                this.newUsersEmails.push( this.users[i].emailId );

                if ( this.users[i].country === "Select Country" ) {
                    this.users[i].country = null;
                }

                if ( this.users[i].mobileNumber.length < 6 ) {
                    this.users[i].mobileNumber = "";
                }
            }

            if ( this.isPartner ) {
                for ( let i = 0; i < this.users.length; i++ ) {
                    if ( this.users[i].contactCompany.trim() != '' ) {
                        this.isCompanyDetails = true;
                    } else {
                        this.isCompanyDetails = false;
                    }
                    if ( this.users[i].country === "Select Country" ) {
                        this.users[i].country = null;
                    }
                }

                for ( let i = 0; i < this.orgAdminsList.length; i++ ) {
                    this.teamMembersList.push( this.orgAdminsList[i] );
                }
                this.teamMembersList.push( this.authenticationService.user );

                let emails = []
                for ( let i = 0; i < this.users.length; i++ ) {
                    emails.push( this.users[i].emailId );
                }

                if ( emails.length > this.teamMembersList.length ) {
                    for ( let i = 0; i < emails.length; i++ ) {
                        let isEmail = this.checkTeamEmails( emails, this.teamMembersList[i] );
                        if ( isEmail ) { existedEmails.push( this.teamMembersList[i] ) }
                    }

                } else {
                    for ( let i = 0; i < this.teamMembersList.length; i++ ) {
                        let isEmail = this.checkTeamEmails( this.teamMembersList, emails[i] );
                        if ( isEmail ) { existedEmails.push( emails[i] ) }
                    }
                }
                console.log( existedEmails );


            } else {
                this.isCompanyDetails = true;
            }
            if ( existedEmails.length === 0 ) {
                if ( this.isCompanyDetails ) {
                    this.loading = true;
                    this.xtremandLogger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.users ) );
                    this.contactService.updateContactList( this.contactListId, this.users )
                        .subscribe(
                        ( data: any ) => {
                            data = data;
                            this.loading = false;
                            this.allUsers = this.contactsByType.allContactsCount;
                            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                            this.manageContact.editContactList( this.contactListId, this.contactListName, this.uploadedUserId, this.isDefaultPartnerList );
                            $( "tr.new_row" ).each( function() {
                                $( this ).remove();
                            });
                            if ( !this.isPartner ) {
                                this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACT_SAVE_SUCCESS, true );
                            } else {
                                this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_SAVE_SUCCESS, true );
                            }
                            this.checkingLoadContactsCount = true;
                            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                            this.cancelContacts();
                            this.getContactsAssocialteCampaigns();
                        },
                        ( error: any ) => {
                            this.loading = false;
                            let body: string = error['_body'];
                            body = body.substring( 1, body.length - 1 );
                            if ( error._body.includes( 'Please launch or delete those campaigns first' ) ) {
                                this.customResponse = new CustomResponse( 'ERROR', error._body, true );
                            } else {
                                this.xtremandLogger.errorPage( error );
                            }
                            console.log( error );
                        },
                        () => this.xtremandLogger.info( "MangeContactsComponent loadContactLists() finished" )
                        )
                    this.dublicateEmailId = false;
                } else {
                    this.customResponse = new CustomResponse( 'ERROR', "Company Details is required", true );
                }
            } else {
                this.customResponse = new CustomResponse( 'ERROR', "You are not allowed to add teamMember or orgAdmin as a partner", true );
                this.cancelContacts();
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "savingOneAtTime user()" );
        }
    }

    updateCsvContactList( contactListId: number ) {
        try {
            this.newUsersEmails.length = 0;
            let existedEmails = [];
            if ( this.users.length > 0 ) {
                for ( let i = 0; i < this.users.length; i++ ) {
                    if ( !this.validateEmailAddress( this.users[i].emailId ) ) {
                        this.invalidPatternEmails.push( this.users[i].emailId )
                    }
                    if ( this.validateEmailAddress( this.users[i].emailId ) ) {
                        this.validCsvContacts = true;
                    }
                    else {
                        this.validCsvContacts = false;
                    }

                    if ( this.users[i].country === "Select Country" ) {
                        this.users[i].country = null;
                    }

                    /*if ( this.users[i].mobileNumber.length < 6 ) {
                        this.users[i].mobileNumber = "";
                    }*/

                    this.newUsersEmails.push( this.users[i].emailId );
                }
                if ( this.validCsvContacts == true && this.invalidPatternEmails.length == 0 ) {
                    $( "#sample_editable_1" ).show();
                    this.isCompanyDetails = false;
                    if ( this.isPartner ) {
                        for ( let i = 0; i < this.users.length; i++ ) {
                            if ( this.users[i].contactCompany.trim() != '' ) {
                                this.isCompanyDetails = true;
                            } else {
                                this.isCompanyDetails = false;
                            }
                            if ( this.users[i].country === "Select Country" ) {
                                this.users[i].country = null;
                            }
                        }

                        for ( let i = 0; i < this.orgAdminsList.length; i++ ) {
                            this.teamMembersList.push( this.orgAdminsList[i] );
                        }
                        this.teamMembersList.push( this.authenticationService.user );

                        let emails = []
                        for ( let i = 0; i < this.users.length; i++ ) {
                            emails.push( this.users[i].emailId );
                        }

                        if ( emails.length > this.teamMembersList.length ) {
                            for ( let i = 0; i < emails.length; i++ ) {
                                let isEmail = this.checkTeamEmails( emails, this.teamMembersList[i] );
                                if ( isEmail ) { existedEmails.push( this.teamMembersList[i] ) }
                            }

                        } else {
                            for ( let i = 0; i < this.teamMembersList.length; i++ ) {
                                let isEmail = this.checkTeamEmails( this.teamMembersList, emails[i] );
                                if ( isEmail ) { existedEmails.push( emails[i] ) }
                            }
                        }
                        console.log( existedEmails );

                    } else {
                        this.isCompanyDetails = true;
                    }

                    if ( existedEmails.length === 0 ) {
                        if ( this.isCompanyDetails ) {
                            this.loading = true;
                            this.xtremandLogger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.users ) );
                            this.contactService.updateContactList( this.contactListId, this.users )
                                .subscribe(
                                data => {
                                    data = data;
                                    this.loading = false;
                                    this.selectedAddContactsOption = 8;
                                    this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                                    this.manageContact.editContactList( this.contactListId, this.contactListName, this.uploadedUserId, this.isDefaultPartnerList );
                                    $( "tr.new_row" ).each( function() {
                                        $( this ).remove();
                                    });

                                    if ( !this.isPartner ) {
                                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACT_SAVE_SUCCESS, true );
                                    } else {
                                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_SAVE_SUCCESS, true );
                                    }

                                    this.users = [];
                                    this.selectedAddContactsOption = 8;
                                    this.uploadCsvUsingFile = false;
                                    this.uploader.queue.length = 0;
                                    this.filePrevew = false;
                                    this.isShowUsers = true;
                                    this.removeCsv();
                                    this.checkingLoadContactsCount = true;
                                    this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                                    this.getContactsAssocialteCampaigns();
                                },
                                ( error: any ) => {
                                    this.loading = false;
                                    let body: string = error['_body'];
                                    body = body.substring( 1, body.length - 1 );
                                    if ( error._body.includes( 'Please launch or delete those campaigns first' ) ) {
                                        this.customResponse = new CustomResponse( 'ERROR', error._body, true );

                                    } else {
                                        this.xtremandLogger.errorPage( error );
                                    }
                                    console.log( error );
                                },
                                () => this.xtremandLogger.info( "MangeContactsComponent loadContactLists() finished" )
                                )
                        } else {
                            this.customResponse = new CustomResponse( 'ERROR', "Company Details is required", true );
                        }

                    } else {
                        this.customResponse = new CustomResponse( 'ERROR', "You are not allowed add teamMember or orgAdmin as a partner", true );
                    }

                } else {
                    this.inValidCsvContacts = true;
                }
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "UpdatingListFromCSV()" );
        }
    }

    removeContactListUsers( contactListId: number ) {
        try {
            let self = this;
            this.xtremandLogger.info( this.selectedContactListIds );
            this.contactService.removeContactListUsers( this.contactListId, this.selectedContactListIds )
                .subscribe(
                ( data: any ) => {
                    data = data;
                    this.allUsers = this.contactsByType.allContactsCount;
                    console.log( "update Contacts ListUsers:" + data );
                    if ( !this.isPartner ) {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACTS_DELETE_SUCCESS, true );
                    } else {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_DELETE_SUCCESS, true );
                    }
                    $.each( this.selectedContactListIds, function( index: number, value: any ) {
                        $( '#row_' + value ).remove();
                        console.log( index + "value" + value );
                    });
                    this.checkingLoadContactsCount = true;
                    this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                    this.selectedContactListIds.length = 0;
                },
                ( error: any ) => {
                    //let body: string = error['_body'];
                    //body = body.substring(1, body.length-1);
                    if ( error._body.includes( 'Please launch or delete those campaigns first' ) ) {
                        this.customResponse = new CustomResponse( 'ERROR', error._body, true );
                    } else {
                        this.xtremandLogger.errorPage( error );
                    }
                    console.log( error );
                },
                () => this.xtremandLogger.info( "deleted completed" )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "deleting user()" );
        }
    }

    showAlert( contactListId: number ) {
        this.xtremandLogger.info( "userIdForChecked" + this.selectedContactListIds );
        if ( this.selectedContactListIds.length != 0 ) {
            this.xtremandLogger.info( "contactListId in sweetAlert() " + this.contactListId );
            let self = this;
            if ( this.totalRecords != 1 || this.totalRecords != this.selectedContactListIds.length ) {
                swal( {
                    title: 'Are you sure?',
                    text: "You won't be able to undo this action!",
                    type: 'warning',
                    showCancelButton: true,
                    swalConfirmButtonColor: '#54a7e9',
                    swalCancelButtonColor: '#999',
                    confirmButtonText: 'Yes, delete it!'

                }).then( function( myData: any ) {
                    console.log( "ManageContacts showAlert then()" + myData );
                    self.removeContactListUsers( contactListId );
                }, function( dismiss: any ) {
                    console.log( 'you clicked on option' + dismiss );
                });
            }
            if ( ( this.totalRecords == 1 && this.isDefaultPartnerList == false ) || ( this.totalRecords == this.selectedContactListIds.length && this.isDefaultPartnerList == false ) ) {
                swal( {
                    title: 'Are you sure?',
                    text: "Deleting all the " + this.checkingContactTypeName + "s" + " in this list will also cause the list to be deleted. You won't be able to undo this action.",
                    type: 'warning',
                    showCancelButton: true,
                    swalConfirmButtonColor: '#54a7e9',
                    swalCancelButtonColor: '#999',
                    confirmButtonText: 'Yes, delete it!'
                }).then( function( myData: any ) {
                    console.log( "ManageContacts showAlert then()" + myData );
                    self.deleteContactList();
                }, function( dismiss: any ) {
                    console.log( 'you clicked on option' + dismiss );
                });
            }
        }
    }

    addRow( event ) {
        if ( event !== 'close' ) {
            if ( this.emailNotValid == true ) {
                // $( "#addContactModal .close" ).click()
                //this.addContactModalClose();
                this.users.push( event );
            }
            this.selectedAddContactsOption = 0;
            this.users.push( event );
            //this.fileTypeError = false;
            //this.noContactsFound = false;
            this.saveContacts( this.contactListId );
            this.addContactuser = new User();
        }
        else {
            this.contactService.isContactModalPopup = false;
        }
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
        this.selectedAddContactsOption = 8;
    }

    clipboardShowPreview() {
        var selectedDropDown = $( "select.options:visible option:selected " ).val();
        var splitValue;
        if ( this.clipboardTextareaText == undefined ) {
            swal( "value can't be null" );
        }
        if ( selectedDropDown == "DEFAULT" ) {
            swal( "<span style='font-weight: 100;font-family: Open Sans;font-size: 16px;'>Please Select the Delimiter Type</span>" );
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
                    /*case 10:
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
                        break;*/
                }
                this.xtremandLogger.info( user );
                this.users.push( user );
                self.pagination.pagedItems.push( user );
                $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            }
            this.selectedAddContactsOption = 1;
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
        var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
        return EMAIL_ID_PATTERN.test( emailId );
    }
    validateName( name: string ) {
        return ( name.trim().length > 0 );
    }

    updateContactListFromClipBoard( contactListId: number ) {
        try {
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
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "updatingListFromClipboard()" );
        }
    }

    saveClipboardValidEmails() {
        try {
            this.newUsersEmails.length = 0;
            let existedEmails = [];
            for ( let i = 0; i < this.users.length; i++ ) {
                this.newUsersEmails.push( this.users[i].emailId );

                if ( this.users[i].country === "Select Country" ) {
                    this.users[i].country = null;
                }

                /*if ( this.users[i].mobileNumber.length < 6 ) {
                    this.users[i].mobileNumber = "";
                }*/
            }
            this.xtremandLogger.info( "update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify( this.users ) );
            if ( this.users.length != 0 ) {
                this.isCompanyDetails = false;
                if ( this.isPartner ) {
                    for ( let i = 0; i < this.users.length; i++ ) {
                        if ( this.users[i].contactCompany.trim() != '' ) {
                            this.isCompanyDetails = true;
                        } else {
                            this.isCompanyDetails = false;
                        }
                        if ( this.users[i].country === "Select Country" ) {
                            this.users[i].country = null;
                        }
                        /*if ( this.users[i].mobileNumber.length < 6 ) {
                            this.users[i].mobileNumber = "";
                        }*/
                    }

                    for ( let i = 0; i < this.orgAdminsList.length; i++ ) {
                        this.teamMembersList.push( this.orgAdminsList[i] );
                    }
                    this.teamMembersList.push( this.authenticationService.user );
                    let emails = []
                    for ( let i = 0; i < this.users.length; i++ ) {
                        emails.push( this.users[i].emailId );
                    }

                    if ( emails.length > this.teamMembersList.length ) {
                        for ( let i = 0; i < emails.length; i++ ) {
                            let isEmail = this.checkTeamEmails( emails, this.teamMembersList[i] );
                            if ( isEmail ) { existedEmails.push( this.teamMembersList[i] ) }
                        }

                    } else {
                        for ( let i = 0; i < this.teamMembersList.length; i++ ) {
                            let isEmail = this.checkTeamEmails( this.teamMembersList, emails[i] );
                            if ( isEmail ) { existedEmails.push( emails[i] ) }
                        }
                    }
                    console.log( existedEmails );

                } else {
                    this.isCompanyDetails = true;
                }
                if ( existedEmails.length === 0 ) {
                    if ( this.isCompanyDetails ) {
                        this.loading = true;
                        this.contactService.updateContactList( this.contactListId, this.users )
                            .subscribe(
                            data => {
                                data = data;
                                this.loading = false;
                                this.selectedAddContactsOption = 8;
                                this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                                this.manageContact.editContactList( this.contactListId, this.contactListName, this.uploadedUserId, this.isDefaultPartnerList );
                                $( "tr.new_row" ).each( function() {
                                    $( this ).remove();

                                });
                                this.clickBoard = false;

                                if ( !this.isPartner ) {
                                    this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACT_SAVE_SUCCESS, true );
                                } else {
                                    this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_SAVE_SUCCESS, true );
                                }

                                $( "button#add_contact" ).prop( 'disabled', false );
                                $( "button#upload_csv" ).prop( 'disabled', false );
                                this.users.length = 0;
                                this.cancelContacts();
                                this.checkingLoadContactsCount = true;
                                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                                this.getContactsAssocialteCampaigns();
                            },
                            ( error: any ) => {
                                this.loading = false;
                                let body: string = error['_body'];
                                body = body.substring( 1, body.length - 1 );
                                if ( error._body.includes( 'Please launch or delete those campaigns first' ) ) {
                                    this.customResponse = new CustomResponse( 'ERROR', error._body, true );
                                } else {
                                    this.xtremandLogger.errorPage( error );
                                }
                                console.log( error );
                            },
                            () => this.xtremandLogger.info( "MangeContactsComponent loadContactLists() finished" )
                            )
                    } else {
                        this.customResponse = new CustomResponse( 'ERROR', "Company Details is required", true );
                    }
                } else {
                    this.customResponse = new CustomResponse( 'ERROR', "You are not allowed to add teamMember or orgAdmin as a partner", true );
                }
                this.dublicateEmailId = false;
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "savingListFromClipboard()" );
        }
    }

    saveContacts( contactListId: number ) {
        if ( this.selectedAddContactsOption == 0 ) {
            this.updateContactList( this.contactListId );
        }

        if ( this.selectedAddContactsOption == 1 ) {
            this.updateContactListFromClipBoard( this.contactListId );
        }

        if ( this.selectedAddContactsOption == 2 ) {
            this.updateCsvContactList( this.contactListId );
        }
    }

    cancelContacts() {
        if ( this.selectedAddContactsOption == 1 ) {
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }
        this.selectedAddContactsOption = 8;
        this.users = [];
        this.dublicateEmailId = false;
    }

    checkAll( ev: any ) {
        try {
            if ( ev.target.checked ) {
                console.log( "checked" );
                $( '[name="campaignContact[]"]' ).prop( 'checked', true );
                let self = this;
                $( '[name="campaignContact[]"]:checked' ).each( function() {
                    var id = $( this ).val();
                    self.selectedContactListIds.push( parseInt( id ) );
                    console.log( self.selectedContactListIds );
                    $( '#campaignContactListTable_' + id ).addClass( 'contact-list-selected' );
                });
                this.selectedContactListIds = this.refService.removeDuplicates( this.selectedContactListIds );
            } else {
                $( '[name="campaignContact[]"]' ).prop( 'checked', false );
                $( '#user_list_tb tr' ).removeClass( "contact-list-selected" );
                if ( this.pagination.maxResults == this.pagination.totalRecords ) {
                    this.selectedContactListIds = [];
                } else {
                    let currentPageContactIds = this.pagination.pagedItems.map( function( a ) { return a.id; });
                    this.selectedContactListIds = this.refService.removeDuplicatesFromTwoArrays( this.selectedContactListIds, currentPageContactIds );
                }
            }
            ev.stopPropagation();
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "checkingAllContacts()" );
        }
    }

    highlightRow( contactId: number, event: any ) {
        try {
            let isChecked = $( '#' + contactId ).is( ':checked' );
            if ( isChecked ) {
                $( '#row_' + contactId ).addClass( 'contact-list-selected' );
                this.selectedContactListIds.push( contactId );
            } else {
                $( '#row_' + contactId ).removeClass( 'contact-list-selected' );
                this.selectedContactListIds.splice( $.inArray( contactId, this.selectedContactListIds ), 1 );
            }
            if ( this.selectedContactListIds.length == this.pagination.pagedItems.length ) {
                this.isHeaderCheckBoxChecked = true;
            } else {
                this.isHeaderCheckBoxChecked = false;
            }
            event.stopPropagation();
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "checkingSelectedUser()" );
        }
    }

    editContactListLoadAllUsers( contactSelectedListId: number, pagination: Pagination ) {
        try {
            this.refService.loading( this.httpRequestLoader, true );
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
                    //this.contactService.allPartners = data.listOfUsers;
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
                    // this.refService.loading( this.httpRequestLoader, false );
                    this.refService.loading( this.httpRequestLoader, false );
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.contacts );
                    this.checkingLoadContactsCount = false;
                    this.xtremandLogger.log( this.allUsers );


                    this.loadAllContactListUsers( this.selectedContactListId, this.totalRecords );


                    var contactIds = this.pagination.pagedItems.map( function( a ) { return a.id; });
                    var items = $.grep( this.selectedContactListIds, function( element ) {
                        return $.inArray( element, contactIds ) !== -1;
                    });
                    this.xtremandLogger.log( "paginationUserIDs" + contactIds );
                    this.xtremandLogger.log( "Selected UserIDs" + this.selectedContactListIds );
                    if ( items.length == pagination.totalRecords || items.length == this.pagination.pagedItems.length ) {
                        this.isHeaderCheckBoxChecked = true;
                    } else {
                        this.isHeaderCheckBoxChecked = false;
                    }

                },
                error => this.xtremandLogger.error( error ),
                () => this.xtremandLogger.info( "MangeContactsComponent loadUsersOfContactList() finished" )
            )
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "loadingAllUsersInList()" );
        }
    }

    setPage( event: any ) {
        if ( event.type == 'contacts' ) {
            this.pagination.pageIndex = event.page;
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        }
        else {
            this.contactsByType.pagination.pageIndex = event.page;
            this.listOfSelectedContactListByType( event.type );
        }
    }

    refresh() {
        this.editContacts = null;
        this.notifyParent.emit( this.editContacts );
    }

    backToEditContacts() {
        this.setPage( 1 );
        this.searchKey = null;
        this.pagination.searchKey = this.searchKey;
        this.pagination.maxResults = 10;
        this.invalidDeleteSuccessMessage = false;
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
        this.contactsByType.selectedCategory = null;
    }

    checkAllInvalidContacts( ev: any ) {
        try {
            if ( ev.target.checked ) {
                console.log( "checked" );
                $( '[name="invalidContact[]"]' ).prop( 'checked', true );
                //this.isContactList = true;
                let self = this;
                $( '[name="invalidContact[]"]:checked' ).each( function() {
                    var id = $( this ).val();
                    self.selectedInvalidContactIds.push( parseInt( id ) );
                    $( '#row_' + id ).addClass( 'invalid-contacts-selected' );
                });
                this.selectedInvalidContactIds = this.refService.removeDuplicates( this.selectedInvalidContactIds );
            } else {
                console.log( "unceck" );
                $( '[name="invalidContact[]"]' ).prop( 'checked', false );
                $( '#user_list_tb tr' ).removeClass( "invalid-contacts-selected" );
                if ( this.pagination.maxResults == this.contactsByType.pagination.totalRecords ) {
                    this.selectedInvalidContactIds = [];
                } else {
                    let currentPageContactIds = this.contactsByType.pagination.pagedItems.map( function( a ) { return a.id; });
                    this.selectedInvalidContactIds = this.refService.removeDuplicatesFromTwoArrays( this.selectedInvalidContactIds, currentPageContactIds );
                }
            }
            ev.stopPropagation();
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "checkingAllInvalidUsers()" );
        }
    }

    invalidContactsSelectedUserIds( contactId: number, event: any ) {
        try {
            let isChecked = $( '#' + contactId ).is( ':checked' );
            if ( isChecked ) {
                $( '#row_' + contactId ).addClass( 'invalid-contacts-selected' );
                this.selectedInvalidContactIds.push( contactId );
            } else {
                $( '#row_' + contactId ).removeClass( 'invalid-contacts-selected' );
                this.selectedInvalidContactIds.splice( $.inArray( contactId, this.selectedInvalidContactIds ), 1 );
            }
            if ( this.selectedInvalidContactIds.length == this.contactsByType.pagination.pagedItems.length ) {
                this.isInvalidHeaderCheckBoxChecked = true;
            } else {
                this.isInvalidHeaderCheckBoxChecked = false;
            }
            event.stopPropagation();
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "checkingSelectedInvalidUsers()" );
        }
    }

    removeInvalidContactListUsers() {
        try {
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
                    //this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACTS_DELETE_SUCCESS, true );
                    this.listOfSelectedContactListByType( this.contactsByType.selectedCategory );
                    this.contactsByType.invalidContactsCount = data.invalidUsers;
                    this.selectedInvalidContactIds.length = 0;
                },
                ( error: any ) => {
                    //let body: string = error['_body'];
                    // body = body.substring(1, body.length-1);
                    if ( error._body.includes( 'Please launch or delete those campaigns first' ) ) {
                        this.customResponse = new CustomResponse( 'ERROR', error._body, true );
                    }
                },
                () => this.xtremandLogger.info( "deleted completed" )
                );
            this.invalidDeleteSuccessMessage = false;
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "remmoveInvalidUsers()" );
        }
    }
    invalidContactsShowAlert() {
        if ( this.selectedInvalidContactIds.length != 0 ) {
            this.xtremandLogger.info( "contactListId in sweetAlert() " );
            let self = this;
            swal( {
                title: 'Are you sure?',
                text: "You won't be able to undo this action!",
                type: 'warning',
                showCancelButton: true,
                swalConfirmButtonColor: '#54a7e9',
                swalCancelButtonColor: '#999',
                confirmButtonText: 'Yes, delete it!'

            }).then( function( myData: any ) {
                console.log( "ManageContacts showAlert then()" + myData );
                self.removeInvalidContactListUsers();
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        }
    }

    removeContactListUsers1( contactId: number ) {
        try {
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
                    if ( !this.isPartner ) {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACTS_DELETE_SUCCESS, true );
                    } else {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_DELETE_SUCCESS, true );
                    }
                    this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                },
                ( error: any ) => {
                    // let body: string = error['_body'];
                    //body = body.substring(1, body.length-1);
                    if ( error._body.includes( 'Please launch or delete those campaigns first' ) ) {
                        this.customResponse = new CustomResponse( 'ERROR', error._body, true );
                    } else {
                        this.xtremandLogger.errorPage( error );
                    }
                    console.log( error );
                },
                () => this.xtremandLogger.info( "deleted completed" )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "removeUsers()" );
        }
    }

    deleteContactList() {
        try {
            this.xtremandLogger.info( "MangeContacts deleteContactList : " + this.selectedContactListId );
            this.contactService.deleteContactList( this.selectedContactListId )
                .subscribe(
                data => {
                    console.log( "MangeContacts deleteContactList success : " + data );
                    $( '#contactListDiv_' + this.selectedContactListId ).remove();
                    this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true );
                    this.refresh();
                    this.contactService.deleteUserSucessMessage = true;
                },
                ( error: any ) => {
                    //let body: string = error['_body'];
                    //body = body.substring(1, body.length-1);
                    if ( error._body.includes( 'Please launch or delete those campaigns first' ) ) {
                        this.customResponse = new CustomResponse( 'ERROR', error._body, true );
                    } else {
                        this.xtremandLogger.errorPage( error );
                    }
                    console.log( error );
                },
                () => this.xtremandLogger.info( "deleted completed" )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "deletingContactList()" );
        }
    }

    deleteUserShowAlert( contactId: number ) {
        this.contactIds.push( this.contactUsersId )
        this.xtremandLogger.info( "contactListId in sweetAlert() " + this.contactIds );
        let self = this;
        if ( this.totalRecords != 1 ) {
            swal( {
                title: 'Are you sure?',
                text: "You won't be able to undo this action!",
                type: 'warning',
                showCancelButton: true,
                swalConfirmButtonColor: '#54a7e9',
                swalCancelButtonColor: '#999',
                confirmButtonText: 'Yes, delete it!'

            }).then( function( myData: any ) {
                console.log( "ManageContacts showAlert then()" + myData );
                self.removeContactListUsers1( contactId );
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        }

        if ( this.totalRecords === 1 && !( this.isDefaultPartnerList ) ) {
            swal( {
                title: 'Are you sure?',
                text: "Deleting all the " + this.checkingContactTypeName + "s" + " in this list will also cause the list to be deleted. You won't be able to undo this action. ",
                type: 'warning',
                showCancelButton: true,
                swalConfirmButtonColor: '#54a7e9',
                swalCancelButtonColor: '#999',
                confirmButtonText: 'Yes, delete it!'

            }).then( function( myData: any ) {
                console.log( "ManageContacts showAlert then()" + myData );
                self.deleteContactList();
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        }
        if ( this.totalRecords === 1 && this.isDefaultPartnerList ) {
            swal( {
                title: 'Are you sure?',
                text: "You won't be able to undo this action!",
                type: 'warning',
                showCancelButton: true,
                swalConfirmButtonColor: '#54a7e9',
                swalCancelButtonColor: '#999',
                confirmButtonText: 'Yes, delete it!'

            }).then( function( myData: any ) {
                console.log( "ManageContacts showAlert then()" + myData );
                self.removeContactListUsers1( contactId );
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        }

    }

    showingContactDetails( contactType: string ) {
        this.resetResponse();
        this.contactsByType.pagination = new Pagination();
        this.contactsByType.selectedCategory = null;
        this.listOfAllSelectedContactListByType( contactType );
        this.listOfSelectedContactListByType( contactType );
    }

    listOfSelectedContactListByType( contactType: string ) {
        try {
            this.currentContactType = '';
            this.showAllContactData = true;
            this.showEditContactData = false;
            this.contactsByType.isLoading = true;
            this.resetListContacts();
            this.resetResponse();
            if ( this.editListContacts == true ) {
                this.searchKey = null;
                this.editListContacts = false;
            }
            this.refService.loading( this.httpRequestLoader, true );
            this.httpRequestLoader.isHorizontalCss = true;
            this.contactsByType.pagination.criterias = this.criterias;
            this.contactService.listOfSelectedContactListByType( this.selectedContactListId, contactType, this.contactsByType.pagination )
                .subscribe(
                data => {
                    this.contactsByType.selectedCategory = contactType;
                    this.contactsByType.contacts = data.listOfUsers;
                    this.contactsByType.pagination.totalRecords = data.totalRecords;
                    this.contactsByType.pagination = this.pagerService.getPagedItems( this.contactsByType.pagination, this.contactsByType.contacts );

                    if ( this.contactsByType.selectedCategory == 'invalid' ) {
                        this.userListIds = data.listOfUsers;
                    }

                    var contactIds = this.pagination.pagedItems.map( function( a ) { return a.id; });
                    var items1 = $.grep( this.selectedInvalidContactIds, function( element ) {
                        return $.inArray( element, contactIds ) !== -1;
                    });
                    this.xtremandLogger.log( "inavlid contacts page pagination Object Ids" + contactIds );
                    this.xtremandLogger.log( "selected inavalid contacts Ids" + this.selectedInvalidContactIds );

                    if ( items1.length == this.contactsByType.pagination.totalRecords || items1.length == this.contactsByType.pagination.pagedItems.length ) {
                        this.isInvalidHeaderCheckBoxChecked = true;
                    } else {
                        this.isInvalidHeaderCheckBoxChecked = false;
                    }
                    this.refService.loading( this.httpRequestLoader, false );

                },
                error => console.log( error ),
                () => {
                    this.contactsByType.isLoading = false;
                }
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "loadingDetailsOfContactList()" );
        }
    }

    resetListContacts() {
        this.sortOption = this.sortOptions[0];
        this.showSelectedCategoryUsers = false;
        this.contactsByType.contacts = [];
    }

    sortByOption( event: any, selectedType: string ) {
        try {
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

            if ( this.currentContactType == "all_contacts" ) {
                this.pagination.pageIndex = 1;
                this.pagination.sortcolumn = this.sortcolumn;
                this.pagination.sortingOrder = this.sortingOrder;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            } else {
                this.contactsByType.pagination.pageIndex = 1;
                this.contactsByType.pagination.sortcolumn = this.sortcolumn;
                this.contactsByType.pagination.sortingOrder = this.sortingOrder;
                this.listOfSelectedContactListByType( this.contactsByType.selectedCategory );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "sorting()" );
        }
    }

    search( searchType: string ) {
        try {
            if ( this.currentContactType == "all_contacts" ) {
                this.pagination.searchKey = this.searchKey;
                this.pagination.pageIndex = 1;
                this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            } else {
                this.contactsByType.pagination.searchKey = this.searchKey;
                this.contactsByType.pagination.pageIndex = 1;
                this.listOfSelectedContactListByType( this.contactsByType.selectedCategory );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "searching()" );
        }
    }

    addContactsOption( addContactsOption: number ) {
        this.resetResponse();
        this.selectedAddContactsOption = addContactsOption;
        if ( addContactsOption === 0 ) {
            // this.addRow();
            console.log( addContactsOption )
        } else if ( addContactsOption === 1 ) {
            this.copyFromClipboard();
        }
    }

    resetResponse() {
        this.customResponse.responseType = null;
        this.customResponse.responseMessage = null;
        this.customResponse.isVisible = false;
    }

    addContactModalOpen() {
        this.addContactuser = new User();
        this.isUpdateUser = false;
        this.contactAllDetails = [];
        this.contactService.isContactModalPopup = true;
    }

    addContactModalClose() {
        $( '#addContactModal' ).modal( 'toggle' );
        $( "#addContactModal .close" ).click()
    }
    validateEmail( emailId: string ) {
        const lowerCaseEmail = emailId.toLowerCase();
        if ( this.validateEmailAddress( emailId ) ) {
            this.checkingForEmail = true;
            this.validEmailPatternSuccess = true;
        }
        else {
            this.checkingForEmail = false;
        }
        if ( lowerCaseEmail != this.editingEmailId ) {
            for ( let i = 0; i < this.contacts.length; i++ ) {
                if ( lowerCaseEmail == this.contacts[i].emailId ) {
                    this.isEmailExist = true;
                    break;
                } else {
                    this.isEmailExist = false;
                }
            }
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

    saveAs() {
        try {
            this.loadContactListsNames();
            let self = this;
            if ( this.contactListName == undefined ) {
                this.contactListName = this.contactService.partnerListName;
            }
            if ( this.isDefaultPartnerList == true && this.contactListName.includes( '_copy' ) ) {
                this.contactListName + '_copy'
            }
            swal( {
                title: this.checkingContactTypeName + ' List Name',
                input: 'text',
                inputValue: this.contactListName + '_copy',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                allowOutsideClick: false,
                preConfirm: function( name: any ) {
                    return new Promise( function() {
                        console.log( 'logic begins' );
                        var inputName = name.toLowerCase().replace( /\s/g, '' );
                        if ( $.inArray( inputName, self.names ) > -1 ) {
                            swal.showValidationError( 'This list name is already taken.' )
                        } else {
                            if ( name != "" ) {
                                swal.close();
                                self.saveDuplicateContactList( name );
                            } else {
                                swal.showValidationError( 'List Name is Required..' )
                            }
                        }
                    });
                }
            }).then( function( name: any ) {
                console.log( name );
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "SaveAsNewListSweetAlert()" );
        }
    }

    saveDuplicateContactList( name: string ) {
        try {
            if ( name != "" ) {
                this.contactListObject = new ContactList;
                this.contactListObject.name = name;
                this.contactListObject.isPartnerUserList = this.isPartner;
                if ( this.selectedContactListIds.length == 0 ) {
                    let listUsers = [];
                    if ( this.isPartner == true && this.addPartnerSave == true ) {
                        listUsers = this.contactService.allPartners;
                    } else {
                        listUsers = this.totalListUsers;
                    }
                    this.contactService.saveContactList( listUsers, name, this.isPartner )
                        .subscribe(
                        data => {
                            data = data;
                            if ( this.isPartner == false ) {
                                this.router.navigateByUrl( '/home/contacts/manage' )
                            } else {
                                this.router.navigateByUrl( 'home/partners/manage' )
                            }
                            this.contactService.saveAsSuccessMessage = "SUCCESS";
                        },

                        ( error: any ) => {
                            this.xtremandLogger.error( error );
                            this.xtremandLogger.errorPage( error );
                        },
                        () => this.xtremandLogger.info( "allcontactComponent saveSelectedUsers() finished" )
                        )
                } else {

                    if ( this.addPartnerSave == true ) {
                        for ( let i = 0; i < this.selectedContactListIds.length; i++ ) {
                            for ( let j = 0; j < this.contactService.allPartners.length; j++ ) {
                                if ( this.selectedContactListIds[i] == this.contactService.allPartners[j].id ) {
                                    this.selectedContactForSave.push( this.contactService.allPartners[j] );
                                    break;
                                }
                            }
                        }
                    } else {
                        for ( let i = 0; i < this.selectedContactListIds.length; i++ ) {
                            for ( let j = 0; j < this.totalListUsers.length; j++ ) {
                                if ( this.selectedContactListIds[i] == this.totalListUsers[j].id ) {
                                    this.selectedContactForSave.push( this.totalListUsers[j] );
                                    break;
                                }
                            }
                        }
                    }

                    console.log( this.selectedContactForSave );
                    this.contactService.saveContactList( this.selectedContactForSave, name, this.isPartner )
                        .subscribe(
                        data => {
                            data = data;
                            if ( this.isPartner == false ) {
                                this.router.navigateByUrl( '/home/contacts/manage' )
                            } else {
                                this.router.navigateByUrl( 'home/partners/manage' )
                            }
                            this.contactService.saveAsSuccessMessage = "SUCCESS";
                        },

                        ( error: any ) => {
                            this.xtremandLogger.error( error );
                            this.xtremandLogger.errorPage( error );
                        },
                        () => this.xtremandLogger.info( "allcontactComponent saveSelectedUsers() finished" )
                        )
                }
            }
            else {
                this.xtremandLogger.error( "AllContactComponent saveSelectedUsers() UserNotSelectedContacts" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "SaveAsNewList()" );
        }
    }

    toggle( i: number ) {
        const className = $( '#more_' + i ).attr( 'class' );
        if ( className === 'hidden' ) {
            $( '#more_' + i ).removeClass( 'hidden' );
            $( '#more_' + i ).addClass( 'show-more' );
            $( "#more_less_button_" + i ).attr( 'value', 'less' );
        } else {
            $( '#more_' + i ).removeClass( 'show-more' );
            $( '#more_' + i ).addClass( 'hidden' );
            $( "#more_less_button_" + i ).attr( 'value', 'more' );
        }
    }

    modelForSeg() {
        this.addNewRow();
        this.criteria.property = this.filterOptions[0].value;
        this.criteria.operation = this.filterConditions[0].value;
    }

    removeSegmentation() {
        this.isSegmentation = false;
        this.criterias.length = 0;
        this.checkingLoadContactsCount = true;
        this.selectedAddContactsOption = 8;
        if ( this.currentContactType == "all_contacts" ) {
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
        } else {
            this.listOfSelectedContactListByType( this.contactsByType.selectedCategory );
        }
    }

    addNewRow() {
        let criteria = new Criteria();
        this.criterias.push( criteria );
    }

    cancelSegmentation() {
        this.criterias.length = 0;
        this.isSegmentationErrorMessage = false;
    }

    contactFilter() {
        try {
            for ( let i = 0; i < this.criterias.length; i++ ) {
                if ( this.criterias[i].operation == "=" ) {
                    this.criterias[i].operation = "eq";
                }
                if ( this.criterias[i].property == "First Name" ) {
                    this.criterias[i].property = "firstName";
                }
                else if ( this.criterias[i].property == "Last Name" ) {
                    this.criterias[i].property = "lastName";
                }
                else if ( this.criterias[i].property == "Company" ) {
                    this.criterias[i].property = "contactCompany";
                }
                else if ( this.criterias[i].property == "Job Title" ) {
                    this.criterias[i].property = "jobTitle";
                }
                else if ( this.criterias[i].property == "Email Id" ) {
                    this.criterias[i].property = "emailId";
                }
                else if ( this.criterias[i].property == "Country" ) {
                    this.criterias[i].property = "country";
                }
                else if ( this.criterias[i].property == "City" ) {
                    this.criterias[i].property = "city";
                }
                else if ( this.criterias[i].property == "Mobile Number" ) {
                    this.criterias[i].property = "mobileNumber";
                }
                else if ( this.criterias[i].property == "Notes" ) {
                    this.criterias[i].property = "description";
                }
                console.log( this.criterias[i].operation );
                console.log( this.criterias[i].property );
                console.log( this.criterias[i].value1 );

                if ( this.criterias[i].property == "Field Name*" || this.criterias[i].operation == "Condition*" || ( this.criterias[i].value1 == undefined || this.criterias[i].value1 == "" ) ) {
                    this.isSegmentationErrorMessage = true;
                } else {
                    this.isSegmentationErrorMessage = false;
                }

            }
            console.log( this.criterias );
            if ( !this.isSegmentationErrorMessage ) {
                if ( this.currentContactType == "all_contacts" ) {
                    this.checkingLoadContactsCount = true;
                    this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                } else {
                    this.listOfSelectedContactListByType( this.contactsByType.selectedCategory );
                }
                this.isSegmentation = true;

                $( '#filterModal' ).modal( 'toggle' );
                $( "#filterModal .close" ).click();
                $( '#filterModal' ).modal( 'hide' );

                this.isSegmentationErrorMessage = false;
                this.selectedAddContactsOption = 9;
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "ContactFilter()" );
        }
    }

    cancelSegmentationRow( rowId: number ) {
        if ( rowId !== -1 ) {
            this.criterias.splice( rowId, 1 );
        }
    }

    loadAllContactListUsers( contactSelectedListId: number, totalRecords: number ) {
        try {
            this.selectedContactListId = contactSelectedListId;
            this.gettingAllUserspagination.maxResults = totalRecords;
            this.gettingAllUserspagination.pageIndex = 1;
            this.contactService.loadUsersOfContactList( contactSelectedListId, this.gettingAllUserspagination )
                .subscribe(
                ( data: any ) => {
                    console.log( data.listOfUsers );
                    this.totalListUsers = data.listOfUsers;
                },
                error => this.xtremandLogger.error( error ),
                () => this.xtremandLogger.info( "MangeContactsComponent loadUsersOfContactList() finished" )
                )
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "loadingAllUsersOfContactList()" );
        }
    }

    editUserDetails( contactDetails ) {
        this.updateContactUser = true;
        this.isUpdateUser = true;
        this.contactAllDetails = contactDetails;
        this.contactService.isContactModalPopup = true;

    }

    updateContactModalClose() {
        this.addContactModalClose();
        this.updateContactUser = false;
        this.updatedUserDetails.length = 0;
        this.isEmailExist = false;
    }

    updateContactListUser( event ) {
        try {
            this.editUser.pagination = this.pagination;
            if ( event.mobileNumber ) {
                if ( event.mobileNumber.length < 6 ) {
                    event.mobileNumber = "";
                }
            }
            this.editUser.user = event;
            this.addContactModalClose();
            this.contactService.updateContactListUser( this.selectedContactListId, this.editUser )
                .subscribe(
                ( data: any ) => {
                    console.log( data );
                    if ( !this.isPartner ) {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACTS_UPDATE_SUCCESS, true );
                    } else {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_UPDATE_SUCCESS, true );
                    }
                    this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
                },
                error => this.xtremandLogger.error( error ),
                () => this.xtremandLogger.info( "EditContactsComponent updateContactListUser() finished" )
                )
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "updatingUser()" );
        }
    }

    updateContactListNameAlert() {
        try {
            let self = this;
            swal( {
                //title: this.checkingContactTypeName + ' List Name',
                title: "<span style='font-weight: 100;font-family: Open Sans;font-size: 24px;'>Update List Name</span>",
                input: 'text',
                inputValue: this.selectedContactListName,
                showCancelButton: true,
                padding: 20,
                confirmButtonText: 'Update',
                //showLoaderOnConfirm: true,
                allowOutsideClick: false,
                customClass: "sweet-alert",
                preConfirm: function( name: any ) {
                    return new Promise( function() {
                        var inputName = name.toLowerCase().replace( /\s/g, '' );
                        if ( $.inArray( inputName, self.names ) > -1 ) {
                            swal.showValidationError( 'This list name is already taken.' )
                        } else {
                            swal.close();
                            self.updateContactListName( name );
                        }
                    });
                }
            }).then( function( name: any ) {
                self.updateContactListName( name );
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "listNameUpdateAlert()" );
        }
    }

    updateContactListName( newContactListName: string ) {
        try {
            var object = {
                "id": this.selectedContactListId,
                "name": newContactListName
            }
            this.addContactModalClose();
            this.contactService.updateContactListName( object )
                .subscribe(
                ( data: any ) => {
                    console.log( data );
                    this.selectedContactListName = newContactListName;
                    if ( this.isPartner ) {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNER_LIST_NAME_UPDATE_SUCCESS, true );
                    } else {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACT_LIST_NAME_UPDATE_SUCCESS, true );
                    }
                },
                error => this.xtremandLogger.error( error ),
                () => this.xtremandLogger.info( "EditContactsComponent updateContactListName() finished" )
                )
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "listNameUpdating()" );
        }
    }

    loadContactListsNames() {
        try {
            this.contactService.loadContactListsNames()
                .subscribe(
                ( data: any ) => {
                    this.xtremandLogger.info( data );
                    this.names.length = 0;
                    for ( let i = 0; i < data.names.length; i++ ) {
                        this.names.push( data.names[i].replace( /\s/g, '' ) );
                    }
                    console.log( this.names );
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.info( "editContactComponent loadContactListsName() finished" )
                )
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "loadingAllContactListNames()" );
        }
    }

    downloadFile( data: any ) {
        let parsedResponse = data.text();
        let blob = new Blob( [parsedResponse], { type: 'text/csv' });
        let url = window.URL.createObjectURL( blob );

        if ( navigator.msSaveOrOpenBlob ) {
            navigator.msSaveBlob( blob, 'Contact_List.csv' );
        } else {
            let a = document.createElement( 'a' );
            a.href = url;
            a.download = 'Contact_List.csv';
            document.body.appendChild( a );
            a.click();
            document.body.removeChild( a );
        }
        window.URL.revokeObjectURL( url );
    }

    downloadList() {
        try {
            this.contactService.downloadContactList( this.contactListId )
                .subscribe(
                data => {
                    this.downloadFile( data );
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.info( "download completed" )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "downloading list()" );
        }
    }

    downloadContactTypeList() {
        if ( this.contactsByType.selectedCategory === 'active' ) {
            this.logListName = this.selectedContactListName + '_list_Active_' + this.checkingContactTypeName + 's.csv';
        } else if ( this.contactsByType.selectedCategory === 'non-active' ) {
            this.logListName = this.selectedContactListName + '_list_Inactive_' + this.checkingContactTypeName + 's.csv';
        } else if ( this.contactsByType.selectedCategory === 'invalid' ) {
            this.logListName = this.selectedContactListName + '_list_Invalid_' + this.checkingContactTypeName + 's.csv';
        } else if ( this.contactsByType.selectedCategory === 'unsubscribe' ) {
            this.logListName = this.selectedContactListName + '_list_Unsubscribe_' + this.checkingContactTypeName + 's.csv';
        }
        this.downloadDataList.length = 0;
        for ( let i = 0; i < this.contactsByType.listOfAllContacts.length; i++ ) {

            var object = {
                "First Name": this.contactsByType.listOfAllContacts[i].firstName,
                "Last Name": this.contactsByType.listOfAllContacts[i].lastName,
                "Company": this.contactsByType.listOfAllContacts[i].contactCompany,
                "Job Title": this.contactsByType.listOfAllContacts[i].jobTitle,
                "Email Id": this.contactsByType.listOfAllContacts[i].emailId,
                "Address": this.contactsByType.listOfAllContacts[i].address,
                "City": this.contactsByType.listOfAllContacts[i].city,
                "Country": this.contactsByType.listOfAllContacts[i].country,
                "Mobile Number": this.contactsByType.listOfAllContacts[i].mobileNumber,
                //"Notes": this.contactsByType.listOfAllContacts[i].description
            }

            this.downloadDataList.push( object );
        }
        this.refService.isDownloadCsvFile = true;
    }

    listOfAllSelectedContactListByType( contactType: string ) {
        try {
            this.currentContactType = '';
            this.resetListContacts();
            this.resetResponse();
            this.contactsByType.contactPagination.maxResults = this.contactsByType.allContactsCount;
            this.contactService.listOfSelectedContactListByType( this.selectedContactListId, contactType, this.contactsByType.contactPagination )
                .subscribe(
                data => {
                    this.contactsByType.selectedCategory = contactType;
                    this.contactsByType.listOfAllContacts = data.listOfUsers;
                    this.contactsByType.contactPagination.totalRecords = data.totalRecords;
                    this.contactsByType.contactPagination = this.pagerService.getPagedItems( this.contactsByType.contactPagination, this.contactsByType.contacts );
                },
                error => console.log( error ),
                () => {
                    this.contactsByType.isLoading = false;
                }
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "loadingAllDetailsOfContactList()" );
        }
    }

    contactCompanyChecking( contactCompany: string ) {
        if ( contactCompany.trim() != '' ) {
            this.isCompanyDetails = true;
        } else {
            this.isCompanyDetails = false;
        }
    }

    getContactsAssocialteCampaigns() {
        try {
            this.contactService.contactListAssociatedCampaigns( this.selectedContactListId )
                .subscribe(
                data => {
                    this.contactsByType.contactListAssociatedCampaigns = data;
                    if ( this.contactsByType.contactListAssociatedCampaigns ) {
                        this.openCampaignModal = true;
                    }
                },
                error => console.log( error ),
                () => {
                    this.contactsByType.isLoading = false;
                }
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "gettingAssociatedCampaignList()" );
        }
    }

    listTeamMembers() {
        try {
            this.teamMemberPagination.maxResults = 100000000;
            try {
                this.teamMemberService.list( this.teamMemberPagination, this.authenticationService.getUserId() )
                    .subscribe(
                    data => {
                        console.log( data );
                        if ( data.teamMembers.length != 0 ) {
                            for ( let i = 0; i < data.teamMembers.length; i++ ) {
                                this.teamMembersList.push( data.teamMembers[i].emailId );
                            }
                        }
                        this.teamMemberPagination = this.pagerService.getPagedItems( this.teamMemberPagination, this.teamMembersList );
                    },
                    error => {
                        this.xtremandLogger.errorPage( error );
                    },
                    () => this.xtremandLogger.info( "Finished listTeamMembers()" )
                    );
            } catch ( error ) {
                this.xtremandLogger.log( error );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "gettingAllTeammemberList()" );
        }

    }

    listOrgAdmin() {
        try {
            this.contactService.listOrgAdmins()
                .subscribe(
                data => {
                    console.log( data );
                    this.orgAdminsList = data;
                },
                error => {
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.info( "Finished listTeamMembers()" )
                );
        } catch ( error ) {
            this.xtremandLogger.log( error );
        }

    }

    closeModal( event ) {
        if ( event == "Emails Send Successfully" ) {
            if ( this.isPartner ) {
                this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNER_SAVE_SUCCESS_AND_MAIL_SENT_SUCCESS, true );
            } else {
                this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACT_SAVE_SUCCESS_AND_MAIL_SENT_SUCCESS, true );
            }
        }
        this.openCampaignModal = false;
        this.contactsByType.contactListAssociatedCampaigns.length = 0;
    }


    ngOnInit() {
        try {
            this.loadContactListsNames();
            this.listTeamMembers();
            this.listOrgAdmin();
            this.selectedContactListName = this.contactListName;
            this.checkingLoadContactsCount = true;
            this.editContactListLoadAllUsers( this.selectedContactListId, this.pagination );
            let self = this;
            this.uploader = new FileUploader( {
                allowedMimeType: ["application/vnd.ms-excel", "text/plain", "text/csv", "application/csv"],
                url: URL + "userlist/" + this.selectedContactListId + "/update?&access_token=" + this.authenticationService.access_token
            });
            this.uploader.onBuildItemForm = function( fileItem: any, form: FormData ) {
                form.append( 'userListId', this.selectedContactListId );
                return { fileItem, form }
            };

            Metronic.init(); // init metronic core components
            Layout.init(); // init current layout
            Demo.init(); // init demo features
            Portfolio.init();

        }
        catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "ngOnInit()" );
        }
    }

    ngOnDestroy() {
        try{
        swal.close();
        $( '#filterModal' ).modal( 'hide' );
        
        if ( this.selectedAddContactsOption !=8 ) {
            let self = this;
             swal( {
                 title: 'Are you sure?',
                 text: "You have unsaved data",
                 type: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#54a7e9',
                 cancelButtonColor: '#999',
                 confirmButtonText: 'Yes, Save it!'

             }).then( function() {
                 self.saveContacts( self.contactListId );
             }, function( dismiss ) {
                 if ( dismiss === 'cancel' ) {
                     self.selectedAddContactsOption = 8;
                 }
             })
         }
        }catch ( error ) {
            this.xtremandLogger.error( error, "editContactComponent", "ngOnDestroy()" );
        }
    }
}
