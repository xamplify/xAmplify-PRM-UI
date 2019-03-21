import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../core/models/user';
import { EditUser } from '../../contacts/models/edit-user';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ActionsDescription } from '../../common/models/actions-description';
import { CountryNames } from '../../common/models/country-names';
import { Pagination } from '../../core/models/pagination';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { SocialContact } from '../../contacts/models/social-contact';
import { ContactService } from '../../contacts/services/contact.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { EditContactsComponent } from '../../contacts/edit-contacts/edit-contacts.component';
import { ManageContactsComponent } from '../../contacts/manage-contacts/manage-contacts.component';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { TeamMemberService } from '../../team/services/team-member.service';
import { FileUtil } from '../../core/models/file-util';
declare var $, Papa, swal: any;

@Component( {
    selector: 'app-add-partners',
    templateUrl: './add-partners.component.html',
    styleUrls: ['./add-partners.component.css', '../../contacts/add-contacts/add-contacts.component.css', '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css',
        '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css', '../../../assets/css/numbered-textarea.css',
        '../../../assets/css/phone-number-plugin.css'],
    providers: [Pagination, SocialPagerService, EditContactsComponent, ManageContactsComponent, CountryNames,
        Properties, RegularExpressions, PaginationComponent, TeamMemberService, ActionsDescription,FileUtil]
})
export class AddPartnersComponent implements OnInit, OnDestroy {
    loggedInUserId: number;
    validEmailPatternSuccess: boolean = true;
    user: User;
    checkingForEmail: boolean;
    addPartnerUser: User = new User();
    newPartnerUser = [];
    existedEmailIds = [];
    invalidPatternEmails = [];
    validCsvContacts: boolean;
    partners: User[];
    // allPartners: User[];
    partnerId = [];
    partnerListId: number;
    totalRecords: number;
    updatePartnerUser: boolean = false;
    updatedUserDetails = [];
    editUser: EditUser = new EditUser();
    customResponse: CustomResponse = new CustomResponse();
    googleImageNormal: boolean = false;
    googleImageBlur: boolean = false;
    sfImageBlur: boolean = false;
    sfImageNormal: boolean = false;
    zohoImageBlur: boolean = false;
    zohoImageNormal: boolean = false;
    public storeLogin: any;
    public clipboardTextareaText: string;
    public clipBoard: boolean = false;
    duplicateEmailIds: string[] = [];
    dublicateEmailId: boolean = false;
    selectedAddPartnerOption: number = 5;
    fileTypeError: boolean;
    pager: any = {};
    pagedItems: any[];
    public getGoogleConatacts: any;
    public socialPartners: SocialContact;
    public socialPartnerUsers: SocialContact[] = new Array();
    socialPartnersAllChecked: boolean;
    isPartner: boolean = true;
    public socialContactsValue: boolean;
    zohoCredentialError = '';
    selectedZohoDropDown: string = 'DEFAULT';
    public userName: string;
    public password: string;
    public contactType: string;
    zohoAuthStorageError = '';
    public salesforceListViewName: string;
    public salesforceListViewId: string;
    public salesforceListViewsData: Array<any> = [];
    public socialNetwork: string;
    settingSocialNetwork: string;
    isUnLinkSocialNetwork: boolean = false;
    Campaign: string;
    deleteErrorMessage: boolean;
    isLoadingList: boolean = true;
    isEmailExist: boolean = false;
    isCompanyDetails = false;
    allPartnersPagination: Pagination = new Pagination();
    teamMemberPagination: Pagination = new Pagination();
    pageSize: number = 12;
    contactListAssociatedCampaignsList: any;
    editingEmailId = '';
    loading = false;
    partnerAllDetails = [];
    openCampaignModal = false;

    disableOtherFuctionality = false;
    saveAsListName:any;
    saveAsError:any;
    isListLoader = false;
    paginationType = "";

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
    public searchKey: string;
    sortcolumn: string = null;
    sortingOrder: string = null;
    selectedDropDown: string;
    selectedContactListIds = [];
    allselectedUsers = [];
    isHeaderCheckBoxChecked: boolean = false;
    pageNumber: any;
    newUserDetails = [];
    teamMembersList = [];
    orgAdminsList = [];

    public uploader: FileUploader = new FileUploader( { allowedMimeType: ["application/csv", "application/vnd.ms-excel", "text/plain", "text/csv"] });

    public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    constructor(private fileUtil:FileUtil, private router: Router, public authenticationService: AuthenticationService, public editContactComponent: EditContactsComponent,
        public socialPagerService: SocialPagerService, public manageContactComponent: ManageContactsComponent,
        public referenceService: ReferenceService, public countryNames: CountryNames, public paginationComponent: PaginationComponent,
        public contactService: ContactService, public properties: Properties, public actionsDescription: ActionsDescription, public regularExpressions: RegularExpressions,
        public pagination: Pagination, public pagerService: PagerService, public xtremandLogger: XtremandLogger, public teamMemberService: TeamMemberService ) {

        this.user = new User();
        this.referenceService.callBackURLCondition = 'partners';
        this.socialPartners = new SocialContact();
        this.addPartnerUser.country = ( this.countryNames.countries[0] );
        this.pageNumber = this.paginationComponent.numberPerPage[0];
    }

    onChangeAllPartnerUsers( event: Pagination ) {
        this.pagination = event;
        this.loadPartnerList( this.pagination );

    }

    sortByOption( event: any, selectedType: string ) {
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

        this.pagination.pageIndex = 1;
        this.pagination.sortcolumn = this.sortcolumn;
        this.pagination.sortingOrder = this.sortingOrder;
        this.loadPartnerList( this.pagination );

    }

    search() {
        this.pagination.searchKey = this.searchKey;
        this.pagination.pageIndex = 1;
        this.loadPartnerList( this.pagination );
    }

    listPartners( userId: number ) {
        try {
            this.contactService.listContactsOfDefaultPartnerList( userId, this.pagination )
                .subscribe(
                ( data: any ) => {
                    this.pagination.totalRecords = data.totalRecords;
                },
                error =>
                    () => console.log( 'loadPartner() finished' )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "list Partners" );
        }
    }

    defaultPartnerList( userId: number ) {
        try {
            this.contactService.defaultPartnerList( userId )
                .subscribe(
                ( data: any ) => {
                    console.log( data );
                    this.partnerListId = data.id;
                    this.contactService.partnerListName = data.name;
                },
                error => this.xtremandLogger.error( error ),
                () => {
                    console.log( 'loadContacts() finished' );
                    this.loadPartnerList( this.pagination );
                }
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "default PartnerList" );
        }
    }

    checkingEmailPattern( emailId: string ) {
        this.validEmailPatternSuccess = false;
        if ( this.validateEmailAddress( emailId ) ) {
            this.validEmailPatternSuccess = true;
        } else {
            this.validEmailPatternSuccess = false;
        }
    }

    validateEmailAddress( emailId: string ) {
        var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
        return EMAIL_ID_PATTERN.test( emailId );
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
            for ( let i = 0; i < this.contactService.allPartners.length; i++ ) {
                if ( lowerCaseEmail == this.contactService.allPartners[i].emailId ) {
                    this.isEmailExist = true;
                    this.existedEmailIds.push(emailId);
                    break;
                } else {
                    this.isEmailExist = false;
                }
            }
        }

    }

    addPartnerModalOpen() {
        this.contactService.isContactModalPopup = true;
        this.updatePartnerUser = false;
        this.addPartnerUser.country = ( this.countryNames.countries[0] );
        this.addPartnerUser.mobileNumber = "+1";
    }

    addPartnerModalClose() {
        $( '#addPartnerModal' ).modal( 'toggle' );
        $( "#addPartnerModal .close" ).click();
        $( '#addPartnerModal' ).modal( 'hide' );
    }

    downloadEmptyCsv() {
        window.location.href = this.authenticationService.MEDIA_URL + "UPLOAD_PARTNER_LIST _EMPTY.csv";
    }

    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.loadPartnerList( this.pagination );
    }

    addRow( event ) {
        //this.addPartnerModalClose();
        this.newPartnerUser.push( event );
        this.selectedAddPartnerOption = 1;
        this.saveContacts();
        this.addPartnerUser = new User();
    }

    cancelRow( rowId: number ) {
        if ( rowId !== -1 ) {
            this.newPartnerUser.splice( rowId, 1 );
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

    savePartnerUsers() {
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        this.existedEmailIds = [];
        this.isEmailExist = false;
        var testArray = [];
        for ( var i = 0; i <= this.newPartnerUser.length - 1; i++ ) {
            testArray.push( this.newPartnerUser[i].emailId.toLowerCase() );
            this.validateEmail(this.newPartnerUser[i].emailId);
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
        var valueArr = this.newPartnerUser.map( function( item ) { return item.emailId.toLowerCase() });
        var isDuplicate = valueArr.some( function( item, idx ) {
            return valueArr.indexOf( item ) != idx
        });
        console.log( "emailDuplicate" + isDuplicate );
        if ( this.newPartnerUser[0].emailId != undefined ) {
            if ( !isDuplicate && !this.isEmailExist ) {
                this.saveValidEmails();
            }else if(this.isEmailExist){
                this.customResponse = new CustomResponse( 'ERROR', "These partner(s) are already added " + this.existedEmailIds, true );
            }else {
                this.dublicateEmailId = true; 
            }
        }
    }

    validateSocialContacts( socialUsers: any ) {
        let users = [];
        for ( let i = 0; i < socialUsers.length; i++ ) {
            if ( socialUsers[i].emailId !== null && this.validateEmailAddress( socialUsers[i].emailId ) ) {
                let email = socialUsers[i].emailId.toLowerCase();
                socialUsers[i].emailId = email;
                users.push( socialUsers[i] );
            }
        }
        return users;
    }

    checkTeamEmails( arr, val ) {
        this.xtremandLogger.log( arr.indexOf( val ) > -1 );
        return arr.indexOf( val ) > -1;
    }

    saveValidEmails() {
        try {
            this.newUserDetails.length = 0;
            this.isCompanyDetails = false;
            for ( let i = 0; i < this.orgAdminsList.length; i++ ) {
                this.teamMembersList.push( this.orgAdminsList[i] );
            }
            this.teamMembersList.push( this.authenticationService.user.emailId );
            let emails = []
            for ( let i = 0; i < this.newPartnerUser.length; i++ ) {
                emails.push( this.newPartnerUser[i].emailId );
            }
            let existedEmails = []
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
            for ( let i = 0; i < this.newPartnerUser.length; i++ ) {

                let userDetails = {
                        "emailId": this.newPartnerUser[i].emailId,
                        "firstName": this.newPartnerUser[i].firstName,
                        "lastName": this.newPartnerUser[i].lastName,
                    }

                this.newUserDetails.push( userDetails );

                if ( this.newPartnerUser[i].mobileNumber ) {
                    if ( this.newPartnerUser[i].mobileNumber.length < 6 ) {
                        this.newPartnerUser[i].mobileNumber = "";
                    }
                }
                if ( this.selectedAddPartnerOption != 3 && this.selectedAddPartnerOption != 6 && this.selectedAddPartnerOption != 7 ) {
                    if ( this.newPartnerUser[i].contactCompany.trim() != '' ) {
                        this.isCompanyDetails = true;
                    } else {
                        this.isCompanyDetails = false;
                    }
                } else {
                    this.isCompanyDetails = true;
                }
                if ( this.newPartnerUser[i].country === "Select Country" ) {
                    this.newPartnerUser[i].country = null;
                }
                if ( !this.validateEmailAddress( this.newPartnerUser[i].emailId ) ) {
                    this.invalidPatternEmails.push( this.newPartnerUser[i].emailId )
                }
                if ( this.validateEmailAddress( this.newPartnerUser[i].emailId ) ) {
                    this.validCsvContacts = true;
                }
                else {
                    this.validCsvContacts = false;
                }
            }
            this.newPartnerUser = this.validateSocialContacts( this.newPartnerUser );
            if ( existedEmails.length === 0 ) {
                if ( this.isCompanyDetails ) {
                    if ( this.validCsvContacts ) {
                        this.loading = true;
                        this.xtremandLogger.info( "saving #partnerListId " + this.partnerListId + " data => " + JSON.stringify( this.newPartnerUser ) );
                        this.contactService.updateContactList( this.partnerListId, this.newPartnerUser )
                            .subscribe(
                            ( data: any ) => {
                                data = data;
                                this.loading = false;
                                this.selectedAddPartnerOption = 5;
                                this.xtremandLogger.info( "update partner ListUsers:" + data );
                                $( "tr.new_row" ).each( function() {
                                    $( this ).remove();
                                });

                                this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_SAVE_SUCCESS, true );

                                this.newPartnerUser.length = 0;
                                this.allselectedUsers.length = 0;
                                this.loadPartnerList( this.pagination );
                                this.clipBoard = false;
                                this.cancelPartners();
                                this.getContactsAssocialteCampaigns();
                                this.disableOtherFuctionality = false;
                            },
                            ( error: any ) => {
                                let body: string = error['_body'];
                                body = body.substring( 1, body.length - 1 );
                                if ( error._body.includes( 'Please launch or delete those campaigns first' ) ) {
                                    this.customResponse = new CustomResponse( 'ERROR', error._body, true );
                                    console.log( "done" )
                                } else if(error._body.includes("email addresses in your contact list that aren't formatted properly")){
                                    this.customResponse = new CustomResponse( 'ERROR', JSON.parse(error._body).message, true );
                                }else{
                                    this.xtremandLogger.errorPage( error );
                                }
                                this.xtremandLogger.error( error );
                                this.loading = false;
                                console.log( error );
                                this.newPartnerUser.length = 0;
                                this.allselectedUsers.length = 0;
                                this.loadPartnerList( this.pagination );
                                this.clipBoard = false;
                                this.cancelPartners();
                            },
                            () => this.xtremandLogger.info( "MangePartnerComponent loadPartners() finished" )
                            )
                        this.dublicateEmailId = false;
                    } else {
                        this.customResponse = new CustomResponse( 'ERROR', "We Found Invalid emailId(s) Please remove " + this.invalidPatternEmails, true );
                        this.invalidPatternEmails = [];
                    }
                } else {
                    this.customResponse = new CustomResponse( 'ERROR', "Company Details is required", true );
                }
            } else {
                this.customResponse = new CustomResponse( 'ERROR', "You are not allowed to add teamMember or orgAdmin as a partner", true );
                if ( this.selectedAddPartnerOption == 1 ) {
                    this.cancelPartners();
                }
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "save Partners" );
        }
    }
    
    closeDuplicateEmailErrorMessage(){
        this.dublicateEmailId = false;
    }

    cancelPartners() {
        this.socialPartnerUsers.length = 0;
        this.allselectedUsers.length = 0;
        this.selectedContactListIds.length = 0;
        this.pager = [];
        this.pagedItems = [];
        this.paginationType = "";
        this.disableOtherFuctionality = false;

        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -82px;left: 100px;' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -82px;left: 100px;' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -82px;left: 100px;' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);min-height:85px' );
        $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        $( "button#cancel_button" ).prop( 'disabled', true );
        $( '#copyFromclipTextArea' ).val( '' );
        $( "#Gfile_preview" ).hide();
        this.newPartnerUser.length = 0;
        this.dublicateEmailId = false;
        this.clipBoard = false;
        this.selectedAddPartnerOption = 5;
    }

    loadPartnerList( pagination: Pagination ) {
        try {
            this.isLoadingList = true;
            this.referenceService.loading( this.httpRequestLoader, true );
            this.httpRequestLoader.isHorizontalCss = true;
            this.contactService.loadUsersOfContactList( this.partnerListId, pagination ).subscribe(
                ( data: any ) => {
                    this.partners = data.listOfUsers;
                    this.totalRecords = data.totalRecords;
                    this.isLoadingList = false;
                    this.referenceService.loading( this.httpRequestLoader, false );
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.partners );

                    var contactIds = this.pagination.pagedItems.map( function( a ) { return a.id; });
                    var items = $.grep( this.editContactComponent.selectedContactListIds, function( element ) {
                        return $.inArray( element, contactIds ) !== -1;
                    });
                    if ( items.length == pagination.totalRecords || items.length == this.pagination.pagedItems.length ) {
                        this.editContactComponent.isHeaderCheckBoxChecked = true;
                    } else {
                        this.editContactComponent.isHeaderCheckBoxChecked = false;
                    }
                    if ( !this.searchKey ) {
                        this.loadAllPartnerInList( pagination.totalRecords );
                    }

                },
                error => this.xtremandLogger.error( error ),
                () => this.xtremandLogger.info( "MangePartnerComponent loadPartnerList() finished" )
            )
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "load Partners" );
        }
    }

    loadAllPartnerInList( totalRecords: number ) {
        try {
            this.allPartnersPagination.maxResults = totalRecords;
            this.contactService.loadUsersOfContactList( this.partnerListId, this.allPartnersPagination ).subscribe(
                ( data: any ) => {
                    this.contactService.allPartners = data.listOfUsers;
                },
                error => this.xtremandLogger.error( error ),
                () => this.xtremandLogger.info( "MangePartnerComponent loadAllPartnerList() finished" )
            )
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "loading all Partners" );
        }
    }


    fileChange( input: any ) {
        this.readFiles( input.files );
    }

    readFile( file: any, reader: any, callback: any ) {
        reader.onload = () => {
            callback( reader.result );
        }
        reader.readAsText( file );
    }

    readFiles( files: any, index = 0 ) {
        if ( files[0].type == "application/vnd.ms-excel" || files[0].type == "text/csv" || files[0].type == "text/x-csv" ) {
            this.isListLoader = true;
            this.paginationType = "csvPartners";
            var outputstring = files[0].name.substring( 0, files[0].name.lastIndexOf( "." ) );
            this.selectedAddPartnerOption = 2;
            this.fileTypeError = false;
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            $( "#file_preview" ).show();
            $( "button#cancel_button" ).prop( 'disabled', true );
            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px; left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            let reader = new FileReader();
            reader.readAsText( files[0] );
            this.xtremandLogger.info( files[0] );
            var lines = new Array();
            var self = this;
            reader.onload = function( e: any ) {
                var contents = e.target.result;
                let csvData = reader.result;
                let csvRecordsArray = csvData.split(/\r\n|\n/);
                let headersRow = self.fileUtil
                .getHeaderArray(csvRecordsArray);
                 let headers = headersRow[0].split(',');
                
                 if((headers.length == 15) ){
                     if(self.validateHeaders(headers)){
                         
                         
                         var csvResult = Papa.parse( contents );

                         var allTextLines = csvResult.data;
                         for ( var i = 1; i < allTextLines.length; i++ ) {
                             if ( allTextLines[i][4] && allTextLines[i][4].trim().length > 0 ) {
                                 let user = new User();
                                 user.emailId = allTextLines[i][4].trim();
                                 user.firstName = allTextLines[i][0].trim();
                                 user.lastName = allTextLines[i][1].trim();
                                 user.contactCompany = allTextLines[i][2].trim();
                                 user.jobTitle = allTextLines[i][3].trim();
                                 user.vertical = allTextLines[i][5].trim();
                                 user.region = allTextLines[i][6].trim();
                                 user.partnerType = allTextLines[i][7].trim();
                                 user.category = allTextLines[i][8].trim();
                                 user.address = allTextLines[i][9].trim();
                                 user.city = allTextLines[i][10].trim();
                                 user.state = allTextLines[i][11].trim();
                                 user.zipCode = allTextLines[i][12].trim();
                                 user.country = allTextLines[i][13].trim();
                                 user.mobileNumber = allTextLines[i][14].trim();
                                 /* user.description = allTextLines[i][9];*/
                                 self.newPartnerUser.push( user );
                             }
                         }
                         self.isListLoader = false;
                         self.setSocialPage(1);
                         
                     }else{
                         self.customResponse = new CustomResponse( 'ERROR', "Invalid Csv", true );
                         self.cancelPartners();
                     }
                 }else{
                     self.customResponse = new CustomResponse( 'ERROR', "Invalid Csv", true );
                     self.cancelPartners();
                 }
                 
                console.log( "ManagePartnerComponent : readFiles() Partners " + JSON.stringify( self.newPartnerUser ) );
            }
        } else {
            this.fileTypeError = true;
            this.uploader.queue.length = 0;
            this.selectedAddPartnerOption = 5;
        }
    }
    
    
    validateHeaders(headers){
            return (headers[0].trim()=="FIRSTNAME" && headers[1].trim()=="LASTNAME" && headers[2].trim()=="COMPANY" && headers[3].trim()=="JOBTITLE" && headers[4].trim()=="EMAILID" && headers[5].trim()=="VERTICAL" && headers[6].trim()=="REGION" && headers[7].trim()=="PARTNETTYPE" && headers[8].trim()=="CATEGORY" && headers[9].trim()=="ADDRESS" && headers[10].trim()=="CITY" && headers[11].trim()=="STATE" && headers[12].trim()=="ZIP" && headers[13].trim()=="COUNTRY" && headers[14].trim()=="MOBILE NUMBER");
      }

    copyFromClipboard() {
        this.fileTypeError = false;
        this.clipboardTextareaText = "";
        this.disableOtherFuctionality = true;
        $( "button#cancel_button" ).prop( 'disabled', false );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        this.clipBoard = true;
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
    }

    clipboardShowPreview() {
        var selectedDropDown = $( "select.opts:visible option:selected " ).val();
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
            this.newPartnerUser.length = 0;
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
                        user.vertical = data[5];
                        break;
                    case 7:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.vertical = data[5];
                        user.region = data[6]
                        break;
                    case 8:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.vertical = data[5];
                        user.region = data[6]
                        user.partnerType = data[7]
                        break;
                    case 9:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.vertical = data[5];
                        user.region = data[6]
                        user.partnerType = data[7]
                        user.category = data[8]
                        break;
                    case 10:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.vertical = data[5];
                        user.region = data[6]
                        user.partnerType = data[7]
                        user.category = data[8]
                        user.address = data[9]
                        break;
                    case 11:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.vertical = data[5];
                        user.region = data[6]
                        user.partnerType = data[7]
                        user.category = data[8]
                        user.address = data[9]
                        user.city = data[10]
                        break;
                    case 12:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.vertical = data[5];
                        user.region = data[6]
                        user.partnerType = data[7]
                        user.category = data[8]
                        user.address = data[9]
                        user.city = data[10]
                        user.state = data[11]
                        break;
                    case 13:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.vertical = data[5];
                        user.region = data[6]
                        user.partnerType = data[7]
                        user.category = data[8]
                        user.address = data[9]
                        user.city = data[10]
                        user.state = data[11]
                        user.zipCode = data[12]
                        break;
                    case 14:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.vertical = data[5];
                        user.region = data[6]
                        user.partnerType = data[7]
                        user.category = data[8]
                        user.address = data[9]
                        user.city = data[10]
                        user.state = data[11]
                        user.zipCode = data[12]
                        user.country = data[13]
                        break;
                    case 15:
                        user.firstName = data[0].trim();
                        user.lastName = data[1].trim();
                        user.contactCompany = data[2].trim();
                        user.jobTitle = data[3].trim();
                        user.emailId = data[4].trim();
                        user.vertical = data[5].trim();
                        user.region = data[6].trim()
                        user.partnerType = data[7].trim()
                        user.category = data[8].trim()
                        user.address = data[9].trim()
                        user.city = data[10].trim()
                        user.state = data[11].trim()
                        user.zipCode = data[12].trim()
                        user.country = data[13].trim()
                        user.mobileNumber = data[14].trim()
                        break;
                    /*case 6:
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
                        user.state = data[7];
                        break;
                    case 9:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.address = data[5];
                        user.city = data[6];
                        user.state = data[7];
                        user.zipCode = data[8];
                        break;
                    case 10:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.address = data[5];
                        user.city = data[6];
                        user.state = data[7];
                        user.zipCode = data[8];
                        user.country = data[9];
                        break;
                    case 11:
                        user.firstName = data[0];
                        user.lastName = data[1];
                        user.contactCompany = data[2];
                        user.jobTitle = data[3];
                        user.emailId = data[4];
                        user.address = data[5];
                        user.city = data[6];
                        user.state = data[7];
                        user.zipCode = data[8];
                        user.country = data[9];
                        user.mobileNumber = data[10];
                        break;*/
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
                self.newPartnerUser.push( user );
            }
            this.selectedAddPartnerOption = 4;
            this.setSocialPage(1);
            var endTime = new Date();
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing started at: <b>" + startTime + "</b></h5>" );
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing Finished at: <b>" + endTime + "</b></h5>" );
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Total Number of records Found: <b>" + allTextLines.length + "</b></h5>" );
        } else {
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( "#clipBoardValidationMessage" ).show();
        }
        this.xtremandLogger.info( this.newPartnerUser );
    }


    deleteUserShowAlert( contactId: number ) {
        this.xtremandLogger.info( "contactListId in sweetAlert() " + contactId );
        let self = this;
        swal( {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it!'

        }).then( function( myData: any ) {
            console.log( "ManagePartner showAlert then()" + myData );
            self.removeContactListUsers1( contactId );
        }, function( dismiss: any ) {
            console.log( "you clicked showAlert cancel" + dismiss );
        });
    }

    removeContactListUsers1( contactId: number ) {
        try {
            this.partnerId[0] = contactId;
            this.contactService.removeContactListUsers( this.partnerListId, this.partnerId )
                .subscribe(
                ( data: any ) => {
                    data = data;
                    console.log( "update Contacts ListUsers:" + data );
                    this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_DELETE_SUCCESS, true );
                    this.loadPartnerList( this.pagination );
                },
                ( error: any ) => {
                    let body: string = error['_body'];
                    body = body.substring( 1, body.length - 1 );
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
            this.xtremandLogger.error( error, "addPartnerComponent", "delete Partner" );
        }
    }

    updatePartnerModalClose() {
        this.addPartnerModalClose();
        this.updatePartnerUser = false;
        this.updatedUserDetails.length = 0;
        this.addPartnerUser = new User();
        this.isEmailExist = false;
    }

    updatePartnerListUser( event ) {
        try {
            this.editUser.pagination = this.pagination;
            if ( event.mobileNumber ) {
                if ( event.mobileNumber.length < 6 ) {
                    event.mobileNumber = "";
                }
            }

            if ( event.country === "Select Country" ) {
                event.country = null;
            }

            this.editUser.user = event;
            // $( "#addPartnerModal .close" ).click()
            this.addPartnerModalClose();
            this.contactService.updateContactListUser( this.partnerListId, this.editUser )
                .subscribe(
                ( data: any ) => {
                    console.log( data );
                    //this.setResponseDetails( 'SUCCESS', 'your Partner has been updated successfully' );
                    this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNERS_UPDATE_SUCCESS, true );
                    this.loadPartnerList( this.pagination );
                },
                error => this.xtremandLogger.error( error ),
                () => this.xtremandLogger.info( "EditPartnerComponent updateContactListUser() finished" )
                )
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "update Partner" );
        }
    }

    editUserDetails( contactDetails: any ) {

        this.updatePartnerUser = true;
        this.partnerAllDetails = contactDetails;
        this.contactService.isContactModalPopup = true;
    }

    socialContactImage() {
        try {
            this.contactService.socialContactImages()
                .subscribe(
                data => {
                    this.storeLogin = data;
                    if ( this.storeLogin.GOOGLE == true ) {
                        this.googleImageNormal = true;
                    } else {
                        this.googleImageBlur = true;
                    }
                    if ( this.storeLogin.SALESFORCE == true ) {
                        this.sfImageNormal = true;
                    } else {
                        this.sfImageBlur = true;
                    }
                    if ( this.storeLogin.ZOHO == true ) {
                        this.zohoImageNormal = true;
                    } else {
                        this.zohoImageBlur = true;
                    }
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.log( "AddContactsComponent socialContactImage() finished." )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "social Partners images" );
        }
    }

    setSocialPage( page: number ) {
        try {
            if ( page < 1 || page > this.pager.totalPages ) {
                return;
            }
            
            if ( this.paginationType == "csvPartners" ) {
                this.pager = this.socialPagerService.getPager( this.newPartnerUser.length, page, this.pageSize );
                this.pagedItems = this.newPartnerUser.slice( this.pager.startIndex, this.pager.endIndex + 1 );
            } else {
                this.pager = this.socialPagerService.getPager( this.socialPartnerUsers.length, page, this.pageSize );
                this.pagedItems = this.socialPartnerUsers.slice( this.pager.startIndex, this.pager.endIndex + 1 );

                var contactIds = this.pagedItems.map( function( a ) { return a.id; });
                var items = $.grep( this.selectedContactListIds, function( element ) {
                    return $.inArray( element, contactIds ) !== -1;
                });
                this.xtremandLogger.log( "partner Ids" + contactIds );
                this.xtremandLogger.log( "Selected partner Ids" + this.selectedContactListIds );
                if ( items.length == this.pager.pageSize || items.length == this.getGoogleConatacts.length || items.length == this.pagedItems.length ) {
                    this.isHeaderCheckBoxChecked = true;
                } else {
                    this.isHeaderCheckBoxChecked = false;
                }
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "setPage" );
        }
    }

    googleContacts() {
        try {
            if ( this.selectedAddPartnerOption == 5 && !this.disableOtherFuctionality ) {
                this.fileTypeError = false;
                this.socialPartners.firstName = '';
                this.socialPartners.lastName = '';
                this.socialPartners.emailId = '';
                this.socialPartners.contactName = '';
                this.socialPartners.showLogin = true;
                this.socialPartners.statusCode = 0;
                this.socialPartners.contactType = '';
                this.socialPartners.alias = '';
                this.socialPartners.socialNetwork = "GOOGLE";
                this.contactService.socialProviderName = 'google';
                this.xtremandLogger.info( "socialContacts" + this.socialPartners.socialNetwork );
                this.contactService.googleLogin( this.isPartner )
                    .subscribe(
                    data => {
                        this.storeLogin = data;
                        console.log( data );
                        if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                            console.log( "AddContactComponent googleContacts() Authentication Success" );
                            this.getGoogleContactsUsers();
                            this.xtremandLogger.info( "called getGoogle contacts method:" );
                        } else {
                            this.referenceService.callBackURLCondition = 'partners';
                            localStorage.setItem( "userAlias", data.userAlias )
                            localStorage.setItem( "isPartner", data.isPartner )
                            console.log( data.redirectUrl );
                            console.log( data.userAlias );
                            window.location.href = "" + data.redirectUrl;
                        }
                    },
                    ( error: any ) => {
                        this.xtremandLogger.error( error );
                        if ( error._body.includes( "JSONObject" ) && error._body.includes( "access_token" ) && error._body.includes( "not found." ) ) {
                            this.xtremandLogger.errorMessage = 'authentication was not successful, you might have changed the password of social account or other reasons, please unlink your account and reconnect it.';
                        }
                        this.xtremandLogger.errorPage( error );
                    },
                    () => this.xtremandLogger.log( "AddContactsComponent googleContacts() finished." )
                    );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "google partners" );
        }
    }

    getGoogleContactsUsers() {
        try {
            swal( {
                text: 'Retrieving partners from google...! Please Wait...It\'s processing',
                allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
            });
            this.contactService.socialProviderName = 'google';
            this.socialPartners.socialNetwork = "GOOGLE";
            var self = this;
            this.contactService.getGoogleContacts( this.socialPartners )
                .subscribe(
                data => {
                    this.getGoogleConatacts = data;
                    swal.close();
                    if ( !this.getGoogleConatacts.contacts ) {
                        this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                        this.selectedAddPartnerOption = 5;
                    } else {
                        for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getGoogleConatacts.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
                                socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                                socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                                this.socialPartnerUsers.push( socialContact );
                            }
                            this.contactService.socialProviderName = "";
                            $( "#Gfile_preview" ).show();
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                        }
                    }
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    this.selectedAddPartnerOption = 3;
                    this.setSocialPage( 1 );
                    this.socialPartners.contacts = this.socialPartnerUsers;
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "getting google Partners" );
        }
    }

    saveGoogleContacts() {
        this.socialPartners.socialNetwork = "GOOGLE";
        this.socialPartners.isPartnerUserList = this.isPartner;
        this.socialPartners.contactType = "CONTACT";
        this.socialPartners.contacts = this.socialPartnerUsers;
        this.selectedAddPartnerOption = 3;
        if ( this.socialPartnerUsers.length > 0 ) {
            this.newPartnerUser = this.socialPartners.contacts;
            this.saveValidEmails();
        } else
            this.xtremandLogger.error( "ManagePartnerComponent saveGoogleContacts() Contacts Null Error" );
    }

    saveGoogleContactSelectedUsers() {
        this.selectedAddPartnerOption = 3;
        if ( this.allselectedUsers.length != 0 ) {
            this.newPartnerUser = this.allselectedUsers;
            this.saveValidEmails();
        }
        else {
            this.xtremandLogger.error( "ManagePartnerComponent saveGoogleContactSelectedUsers() ContactListName Error" );
        }
    }

    zohoContacts() {
        try {
            this.fileTypeError = false;
            let self = this;
            self.selectedZohoDropDown = $( "select.opts:visible option:selected " ).val();
            if ( self.selectedZohoDropDown == "DEFAULT" ) {
                alert( "Please Select the which you like to import from:" );
                return false;
            }
            else {
                if ( self.selectedZohoDropDown == "contact" ) {
                    self.contactType = self.selectedZohoDropDown;
                    self.xtremandLogger.log( self.selectedZohoDropDown );
                }
                else if ( this.selectedZohoDropDown == "lead" ) {
                    self.contactType = self.selectedZohoDropDown;
                    self.xtremandLogger.log( self.selectedZohoDropDown );
                }
                this.xtremandLogger.log( this.userName );
                this.xtremandLogger.log( this.password );
                this.getZohoContacts( self.contactType, this.userName, this.password );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "zoho Partners" );
        }
    }

    hideZohoModal() {
        $( "#zohoShowLoginPopup" ).hide();
    }

    checkingZohoContactsAuthentication() {
        try {
            if ( this.selectedAddPartnerOption == 5 && !this.disableOtherFuctionality ) {
                this.contactService.checkingZohoAuthentication()
                    .subscribe(
                    ( data: any ) => {
                        this.xtremandLogger.info( data );
                        if ( data.showLogin == true ) {
                            $( "#zohoShowLoginPopup" ).show();
                        }
                        if ( data.authSuccess == true ) {
                            $( "#zohoShowAuthorisedPopup" ).show();
                        }
                    },
                    ( error: any ) => {
                        var body = error['_body'];
                        if ( body != "" ) {
                            var response = JSON.parse( body );
                            if ( response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!" ) {
                                this.zohoAuthStorageError = 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!';
                                setTimeout(() => {
                                    this.zohoAuthStorageError = '';
                                }, 5000 )
                            } else {
                                this.xtremandLogger.errorPage( error );
                            }
                        } else {
                            this.xtremandLogger.errorPage( error );
                        }
                        console.log( "errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error )

                    },
                    () => this.xtremandLogger.info( "Add contact component loadContactListsName() finished" )
                    )
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "zoho authentication cheking" );
        }
    }

    getZohoContacts( contactType: any, username: string, password: string ) {
        try {
            this.socialPartners.socialNetwork = "";
            var self = this;
            this.contactService.getZohoContacts( this.userName, this.password, this.contactType )
                .subscribe(
                data => {
                    this.getGoogleConatacts = data;
                    this.zohoImageBlur = false;
                    this.zohoImageNormal = true;
                    this.hideZohoModal();
                    if ( !this.getGoogleConatacts.contacts ) {
                        this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                        this.selectedAddPartnerOption = 5;
                    } else {
                        for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getGoogleConatacts.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
                                socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                                socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                                this.socialPartnerUsers.push( socialContact );
                            }
                            $( "#Gfile_preview" ).show();
                            $( "#myModal .close" ).click()
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                        }
                    }
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    this.selectedAddPartnerOption = 6;
                    this.setSocialPage( 1 );
                },
                ( error: any ) => {
                    var body = error['_body'];
                    if ( body != "" ) {
                        var response = JSON.parse( body );
                        if ( response.message == "Username or password is incorrect" ) {
                            this.zohoCredentialError = 'Username or password is incorrect';
                            setTimeout(() => {
                                this.zohoCredentialError = '';
                            }, 5000 )
                        }
                        if ( response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!" ) {
                            this.zohoCredentialError = 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!';
                            setTimeout(() => {
                                this.zohoCredentialError = '';
                            }, 5000 )
                        } else {
                        }
                    } else {
                        this.xtremandLogger.errorPage( error );
                    }
                    console.log( "errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error )

                },
                () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "getting zoho Partners" );
        }
    }

    hideZohoAuthorisedPopup() {
        $( "#zohoShowAuthorisedPopup" ).hide();
    }
    authorisedZohoContacts() {
        try {
            let self = this;
            self.selectedZohoDropDown = $( "select.opts:visible option:selected " ).val();
            if ( self.selectedZohoDropDown == "DEFAULT" ) {
                alert( "Please Select the which you like to import from:" );
                return false;
            }
            else {
                if ( self.selectedZohoDropDown == "contact" ) {
                    self.contactType = self.selectedZohoDropDown;
                    self.xtremandLogger.log( self.selectedZohoDropDown );
                }
                else if ( this.selectedZohoDropDown == "lead" ) {
                    self.contactType = self.selectedZohoDropDown;
                    self.xtremandLogger.log( self.selectedZohoDropDown );
                }

            }

            this.socialPartners.socialNetwork = "ZOHO";
            this.socialPartners.contactType = self.contactType;
            this.contactService.getZohoAutherizedContacts( this.socialPartners )
                .subscribe(
                data => {
                    this.getGoogleConatacts = data;
                    this.hideZohoAuthorisedPopup();
                    this.selectedAddPartnerOption = 6;
                    if ( !this.getGoogleConatacts.contacts ) {
                        this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                        this.selectedAddPartnerOption = 5;
                    } else {
                        for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getGoogleConatacts.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
                                socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                                socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                                this.socialPartnerUsers.push( socialContact );
                            }
                            $( "#Gfile_preview" ).show();
                            $( "#myModal .close" ).click()
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                        }
                    }
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    this.setSocialPage( 1 );
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "zoho autherized Partners" );
        }
    }

    saveZohoContacts() {
        this.socialPartners.socialNetwork = "ZOHO";
        this.socialPartners.contactType = this.contactType;
        this.socialPartners.contacts = this.socialPartnerUsers;
        if ( this.socialPartnerUsers.length > 0 ) {
            this.newPartnerUser = this.socialPartners.contacts;
            this.saveValidEmails();
        } else
            this.xtremandLogger.error( "AddContactComponent saveZohoContacts() Contacts Null Error" );
    }

    saveZohoContactSelectedUsers() {
        this.newPartnerUser = this.allselectedUsers;
        if ( this.allselectedUsers.length != 0 ) {
            this.newPartnerUser = this.allselectedUsers;
            this.saveValidEmails();
        }
        else {
            this.xtremandLogger.error( "AddContactComponent saveZohoContactSelectedUsers() ContactList Name Error" );
        }
    }

    onChange( item: any ) {
        this.xtremandLogger.log( item );
        if ( this.salesforceListViewName == "DEFAULT" ) {
            $( "button#salesforce_save_button" ).prop( 'disabled', true );
        } else {
            $( "button#salesforce_save_button" ).prop( 'disabled', false );
        }

        this.salesforceListViewId = item;
        for ( var i = 0; i < this.salesforceListViewsData.length; i++ ) {
            this.xtremandLogger.log( this.salesforceListViewsData[i].listViewId );
            if ( item == this.salesforceListViewsData[i].listViewId ) {
                this.salesforceListViewName = this.salesforceListViewsData[i].listViewName;
            }
            this.xtremandLogger.log( "listviewNameDROPDOWN" + this.salesforceListViewName );
        }
    }

    onChangeSalesforceDropdown( event: Event ) {
        try {
            this.contactType = event.target["value"];
            this.socialNetwork = "salesforce";
            this.salesforceListViewsData = [];
            if ( this.contactType == "DEFAULT" ) {
                $( "button#salesforce_save_button" ).prop( 'disabled', true );
            } else {
                $( "button#salesforce_save_button" ).prop( 'disabled', false );
            }

            if ( this.contactType == "contact_listviews" || this.contactType == "lead_listviews" ) {
                $( "button#salesforce_save_button" ).prop( 'disabled', true );
                this.contactService.getSalesforceContacts( this.socialNetwork, this.contactType )
                    .subscribe(
                    data => {
                        if ( data.listViews.length > 0 ) {
                            for ( var i = 0; i < data.listViews.length; i++ ) {
                                this.salesforceListViewsData.push( data.listViews[i] );
                                this.xtremandLogger.log( data.listViews[i] );
                            }
                        }else {
                            this.customResponse = new CustomResponse( 'ERROR', "No " + this.contactType + " found", true );
                            this.hideModal();
                        }
                    },
                    ( error: any ) => {
                        this.xtremandLogger.error( error );
                        this.xtremandLogger.errorPage( error );
                    },
                    () => this.xtremandLogger.log( "onChangeSalesforceDropdown" )
                    );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "salesforce Partners dropdown" );
        }
    }

    showModal() {
        /*$( '#salesforceModal' ).appendTo( "body" ).modal( 'show' );
        $( '#salesforceModal' ).modal( 'show' );
        $('#salesforceModal').modal('toggle');
        $("#salesforceModal").modal();*/
        $('#TestSalesForceModal').modal('show');

    }

    hideModal() {
        $('#TestSalesForceModal').modal('hide');
        /*$( '#salesforceModal' ).modal( 'hide' );
        $( 'body' ).removeClass( 'modal-open' );
        $( '.modal-backdrop fade in' ).remove();
        $( '#overlay-modal' ).hide();
        $( '#salesforceModal' ).appendTo( "body" ).modal( 'hide' );*/

    }

    salesforceContacts() {
        try {
            if ( this.selectedAddPartnerOption == 5 && !this.disableOtherFuctionality ) {
                this.contactType = "";
                this.fileTypeError = false;
                this.socialPartners.socialNetwork = "salesforce";
                this.xtremandLogger.info( "socialContacts" + this.socialPartners.socialNetwork );
                this.contactService.salesforceLogin( this.isPartner )
                    .subscribe(
                    data => {
                        this.storeLogin = data;
                        console.log( data );
                        if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                           // $( '#salesforceModal' ).appendTo( "body" ).modal( 'show' );
                            /*$( '#salesforceModal' ).modal( 'show' );*/
                            this.showModal();
                            console.log( "AddContactComponent salesforce() Authentication Success" );
                            this.checkingPopupValues();
                        } else {
                            localStorage.setItem( "userAlias", data.userAlias )
                            localStorage.setItem( "isPartner", data.isPartner )
                            console.log( data.redirectUrl );
                            console.log( data.userAlias );
                            window.location.href = "" + data.redirectUrl;
                        }
                    },
                    ( error: any ) => {
                        this.xtremandLogger.error( error );
                    },
                    () => this.xtremandLogger.log( "addContactComponent salesforceContacts() login finished." )
                    );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "salesforce Partners" );
        }
    }

    checkingPopupValues() {
        if(this.contactType !=""){
        $( "button#salesforce_save_button" ).prop( 'disabled', true );
        if ( this.contactType == "contact_listviews" || this.contactType == "lead_listviews" ) {
            this.getSalesforceListViewContacts( this.contactType );
        } else {
            this.getSalesforceContacts( this.contactType );
        }
        }
    }

    getSalesforceContacts( contactType: any ) {
        try {
            this.socialPartners.firstName = '';
            this.socialPartners.lastName = '';
            this.socialPartners.emailId = '';
            this.socialPartners.contactName = '';
            this.socialPartners.showLogin = true;
            this.socialPartners.jsonData = '';
            this.socialPartners.statusCode = 0;
            this.socialPartners.contactType = '';
            this.socialPartners.alias = '';
            this.socialNetwork = "salesforce";
            var self = this;
            var selectedDropDown = $( "select.opts:visible option:selected " ).val();
            if ( selectedDropDown == "DEFAULT" ) {
                return false;
            }
            else {
                this.contactType = selectedDropDown;
                this.xtremandLogger.log( "AddContactComponent getSalesforceContacts() selected Dropdown value:" + this.contactType )
            }

            this.contactService.getSalesforceContacts( this.socialNetwork, this.contactType )
                .subscribe(
                data => {
                    this.getGoogleConatacts = data;
                    this.selectedAddPartnerOption = 7;
                    if ( !this.getGoogleConatacts.contacts ) {
                        if(this.getGoogleConatacts.jsonData.includes("API_DISABLED_FOR_ORG")){
                            this.customResponse = new CustomResponse( 'ERROR', "Salesforce REST API is not enabled, Please change your Salesforce platform settings.", true );
                        }else{
                        this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                        }
                        this.selectedAddPartnerOption = 5;
                        this.hideModal();
                       /* $( '#salesforceModal' ).modal( 'hide' );
                        $( 'body' ).removeClass( 'modal-open' );
                        $( '.modal-backdrop fade in' ).remove();
                        $( '#salesforceModal' ).appendTo( "body" ).modal( 'hide' );
                        $( '#overlay-modal' ).hide();*/
                    } else {
                        for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getGoogleConatacts.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
                                socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                                socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                                this.socialPartnerUsers.push( socialContact );
                            }
                            $( "#Gfile_preview" ).show();
                            this.hideModal();
                            /*$( '#salesforceModal' ).modal( 'hide' );
                            $( 'body' ).removeClass( 'modal-open' );
                            $( '.modal-backdrop fade in' ).remove();
                            //$( '#salesforceModal' ).appendTo( "body" ).modal( 'hide' );
                            $( '#overlay-modal' ).hide();*/

                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                        }
                    }
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    this.setSocialPage( 1 );
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                },
                () => this.xtremandLogger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getGoogleConatacts.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "getting salesforce Partners" );
        }
    }

    getSalesforceListViewContacts( contactType: any ) {
        try {
            this.socialPartners.firstName = '';
            this.socialPartners.lastName = '';
            this.socialPartners.emailId = '';
            this.socialPartners.contactName = '';
            this.socialPartners.showLogin = true;
            this.socialPartners.jsonData = '';
            this.socialPartners.statusCode = 0;
            this.socialPartners.contactType = '';
            this.socialPartners.alias = '';
            this.socialNetwork = "salesforce";
            var self = this;
            var selectedDropDown = $( "select.opts:visible option:selected " ).val();
            if ( selectedDropDown == "DEFAULT" ) {
                return false;
            }
            else {
                this.contactType = selectedDropDown;
                this.xtremandLogger.log( "AddContactComponent getSalesforceContacts() selected Dropdown value:" + this.contactType )
            }
            this.contactService.getSalesforceListViewContacts( this.socialNetwork, this.contactType, this.salesforceListViewId, this.salesforceListViewName )
                .subscribe(
                data => {
                    this.getGoogleConatacts = data;
                    this.selectedAddPartnerOption = 7;
                    if ( !this.getGoogleConatacts.contacts ) {
                        if(this.getGoogleConatacts.jsonData.includes("API_DISABLED_FOR_ORG")){
                            this.customResponse = new CustomResponse( 'ERROR', "Salesforce REST API is not enabled, Please change your Salesforce platform settings.", true );
                        }else{
                        this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                        }
                        this.selectedAddPartnerOption = 5;
                        this.hideModal();
                    } else {
                        for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getGoogleConatacts.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
                                socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                                socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                                this.socialPartnerUsers.push( socialContact );
                            }
                            this.hideModal();

                            $( "#Gfile_preview" ).show();
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 100px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                        }
                    }
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    this.setSocialPage( 1 );
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                },
                () => this.xtremandLogger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getGoogleConatacts.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "salesforce listview Partners" );
        }
    }

    saveSalesforceContactSelectedUsers() {
        this.newPartnerUser = this.allselectedUsers;
        if ( this.allselectedUsers.length != 0 ) {
            this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.allselectedUsers ) );
            this.newPartnerUser = this.allselectedUsers;
            this.saveValidEmails();
        }
        else {
            this.xtremandLogger.error( "AddContactComponent saveSalesforceContactSelectedUsers() ContactList Name Error" );
        }
    }

    saveSalesforceContacts() {
        this.socialPartners.socialNetwork = "salesforce";
        this.socialPartners.isPartnerUserList = this.isPartner;
        this.socialPartners.contactType = this.contactType;
        this.socialPartners.alias = this.salesforceListViewId;
        this.socialPartners.contacts = this.socialPartnerUsers;
        if ( this.socialPartnerUsers.length > 0 ) {
            this.newPartnerUser = this.socialPartners.contacts;
            this.saveValidEmails();

        } else
            this.xtremandLogger.error( "AddContactComponent saveSalesforceContacts() Contacts Null Error" );
    }

    saveContacts() {
        if ( this.selectedAddPartnerOption == 2 || this.selectedAddPartnerOption == 1 || this.selectedAddPartnerOption == 4 ) {
            this.savePartnerUsers();
        }

        if ( this.selectedAddPartnerOption == 3 ) {
            if ( this.allselectedUsers.length == 0 ) {
                this.saveGoogleContacts();
            } else
                this.saveGoogleContactSelectedUsers();
        }

        if ( this.selectedAddPartnerOption == 6 ) {
            if ( this.allselectedUsers.length == 0 ) {
                this.saveZohoContacts();
            } else
                this.saveZohoContactSelectedUsers();
        }

        if ( this.selectedAddPartnerOption == 7 ) {
            if ( this.allselectedUsers.length == 0 ) {
                this.saveSalesforceContacts();
            } else
                this.saveSalesforceContactSelectedUsers();
        }
    }

    settingSocialNetworkOpenModal( socialNetwork: string ) {
        this.settingSocialNetwork = socialNetwork;
       $( '#settingSocialNetworkPartner' ).modal( 'show' );
       // $('#settingSocialNetworkPartner').modal('toggle');
       // $('#settingSocialNetworkPartner').modal();
       // $( '#settingSocialNetwork' ).appendTo( "body" ).modal( 'show' );
        $("#settingSocialNetworkPartner").appendTo("body");
    }

    unlinkSocailAccount() {
        try {
            let socialNetwork = this.settingSocialNetwork.toUpperCase();
            console.log( "CheckBoXValueUNlink" + this.isUnLinkSocialNetwork );
            this.contactService.unlinkSocailAccount( socialNetwork, this.isUnLinkSocialNetwork )
                .subscribe(
                ( data: any ) => {
                    if ( socialNetwork == 'SALESFORCE' ) {
                        $( "#salesforceContact_buttonNormal" ).hide();
                        $( "#salesforceGear" ).hide();
                        this.sfImageBlur = true;
                        this.socialContactImage();
                    }
                    else if ( socialNetwork == 'GOOGLE' ) {
                        $( "#googleContact_buttonNormal" ).hide();
                        $( "#GoogleGear" ).hide();
                        this.googleImageBlur = true;
                    }
                    else if ( socialNetwork == 'ZOHO' ) {
                        $( "#zohoContact_buttonNormal" ).hide();
                        $( "#zohoGear" ).hide();
                        this.zohoImageBlur = true;
                    }
                    $( '#settingSocialNetworkPartner' ).modal( 'hide' );
                    this.customResponse = new CustomResponse( 'SUCCESS', this.properties.SOCIAL_ACCOUNT_REMOVED_SUCCESS, true );
                },
                ( error: any ) => {
                    if ( error._body.search( 'Please launch or delete those campaigns first' ) != -1 ) {
                        this.Campaign = error;
                        $( '#settingSocialNetworkPartner' ).modal( 'hide' );
                        this.deleteErrorMessage = true;
                        setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                    } else {
                        this.xtremandLogger.errorPage( error );
                    }
                    console.log( error );
                },
                () => {
                    $( '#settingSocialNetworkPartner' ).modal( 'hide' );
                    this.cancelPartners();
                    this.xtremandLogger.info( "deleted completed" );
                }
                );
            this.deleteErrorMessage = false;
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "unlink social accounts Partners" );
        }
    }

    removeDuplicates( originalArray, prop ) {
        var newArray = [];
        var lookupObject = {};
        for ( var i in originalArray ) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }
        for ( i in lookupObject ) {
            newArray.push( lookupObject[i] );
        }
        return newArray;
    }

    checkAll( ev: any ) {
        if ( ev.target.checked ) {
            console.log( "checked" );
            $( '[name="campaignContact[]"]' ).prop( 'checked', true );
            let self = this;
            $( '[name="campaignContact[]"]:checked' ).each( function() {
                var id = $( this ).val();
                self.selectedContactListIds.push( parseInt( id ) );
                console.log( self.selectedContactListIds );
                $( '#ContactListTable_' + id ).addClass( 'contact-list-selected' );
                for ( var i = 0; i < self.pagedItems.length; i++ ) {
                    var object = {
                        "emailId": self.pagedItems[i].emailId,
                        "firstName": self.pagedItems[i].firstName,
                        "lastName": self.pagedItems[i].lastName,
                    }
                    console.log( object );
                    self.allselectedUsers.push( object );
                }
            });
            this.allselectedUsers = this.removeDuplicates( this.allselectedUsers, 'emailId' );
            this.selectedContactListIds = this.referenceService.removeDuplicates( this.selectedContactListIds );
        } else {
            $( '[name="campaignContact[]"]' ).prop( 'checked', false );
            $( '#user_list_tb tr' ).removeClass( "contact-list-selected" );
            if ( this.pager.maxResults == this.totalRecords ) {
                this.selectedContactListIds = [];
                this.allselectedUsers.length = 0;
            } else {
                let paginationIdsArray = new Array;
                for ( let j = 0; j < this.pagedItems.length; j++ ) {
                    var paginationEmail = this.pagedItems[j].emailId;
                    this.allselectedUsers.splice( this.allselectedUsers.indexOf( paginationEmail ), 1 );
                }
                let currentPageContactIds = this.pagedItems.map( function( a ) { return a.id; });
                this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays( this.selectedContactListIds, currentPageContactIds );
            }
        }
        ev.stopPropagation();
    }

    highlightRow( contactId: number, email: any, firstName: any, lastName: any, event: any ) {
        let isChecked = $( '#' + contactId ).is( ':checked' );
        console.log( this.selectedContactListIds )
        if ( isChecked ) {
            $( '#row_' + contactId ).addClass( 'contact-list-selected' );
            this.selectedContactListIds.push( contactId );
            var object = {
                "emailId": email,
                "firstName": firstName,
                "lastName": lastName,
            }
            this.allselectedUsers.push( object );
            console.log( this.allselectedUsers );
        } else {
            $( '#row_' + contactId ).removeClass( 'contact-list-selected' );
            this.selectedContactListIds.splice( $.inArray( contactId, this.selectedContactListIds ), 1 );
            this.allselectedUsers.splice( $.inArray( contactId, this.allselectedUsers ), 1 );
        }
        if ( this.selectedContactListIds.length == this.pagedItems.length ) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
    }

    downloadFile( data: any ) {
        try {
            let parsedResponse = data.text();
            let blob = new Blob( [parsedResponse], { type: 'text/csv' });
            let url = window.URL.createObjectURL( blob );

            if ( navigator.msSaveOrOpenBlob ) {
                navigator.msSaveBlob( blob, 'Partner_List.csv' );
            } else {
                let a = document.createElement( 'a' );
                a.href = url;
                a.download = this.contactService.partnerListName + '.csv';
                document.body.appendChild( a );
                a.click();
                document.body.removeChild( a );
            }
            window.URL.revokeObjectURL( url );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "download list of Partners" );
        }
    }

    downloadPartnerList() {
        try {
            this.contactService.downloadContactList( this.partnerListId )
                .subscribe(
                data => this.downloadFile( data ),
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.info( "download partner List completed" )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "download Partner list" );
        }
    }

    sendMail( partnerId: number ) {
        try {
            this.loading = true;
            this.contactService.mailSend( partnerId, this.partnerListId )
                .subscribe(
                data => {
                    console.log( data );
                    this.loading = false;
                    if ( data.message == "success" ) {
                        this.customResponse = new CustomResponse( 'SUCCESS', this.properties.EMAIL_SENT_SUCCESS, true );
                    }
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.loading = false;
                },
                () => this.xtremandLogger.log( "Manage Partner component Mail send method successfull" )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "resending Partner email" );
        }
    }

    contactCompanyChecking( contactCompany: string ) {
        if ( contactCompany.trim() != '' ) {
            this.isCompanyDetails = true;
        } else {
            this.isCompanyDetails = false;
        }
    }

    selectedPageNumber( event ) {
        this.pageNumber.value = event;
        if ( event === 0 ) { event = this.socialPartnerUsers.length; }
        this.pageSize = event;
        this.setSocialPage( 1 );
    }

    getContactsAssocialteCampaigns() {
        try {
            this.contactService.contactListAssociatedCampaigns( this.partnerListId )
                .subscribe(
                data => {
                    this.contactListAssociatedCampaignsList = data;
                    if ( this.contactListAssociatedCampaignsList ) {
                        this.openCampaignModal = true;
                    }
                },
                error => console.log( error ),
                () => {
                }
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addPartnerComponent", "getting associated campaigns" );
        }
    }

    listTeamMembers() {
        try {
            this.teamMemberService.listTeamMemberEmailIds( )
                .subscribe(
                data => {
                    console.log( data );
                    for(let i=0;i< data.length; i++){
                        this.teamMembersList.push( data[i] );
                    }
                    
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
                () => this.xtremandLogger.info( "Finished listOrgAdmins()" )
                );
        } catch ( error ) {
            this.xtremandLogger.log( error );
        }

    }

    closeModal( event ) {
        if ( event === "Emails Send Successfully" ) {
            this.customResponse = new CustomResponse( 'SUCCESS', this.properties.PARTNER_SAVE_SUCCESS_AND_MAIL_SENT_SUCCESS, true );
        }
        
        if( event === "users are unSubscribed for emails" ){
            this.customResponse = new CustomResponse( 'ERROR', "The partners are unsubscribed for receiving the campaign emails.", true );
        }
        
        if( event === "user has unSubscribed for emails" ){
            this.customResponse = new CustomResponse( 'ERROR', "The partner has unsubscribed for receiving the campaign emails.", true );
        }
        
        if ( event === "Emails Sending failed" ) {
            this.customResponse = new CustomResponse( 'ERROR', "Failed to send Emails", true );
        }
        this.openCampaignModal = false;
        this.contactListAssociatedCampaignsList.length = 0;
    }
    
   eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }
   
   saveAsChange(){
    try {
      this.saveAsListName = this.editContactComponent.addCopyToField();

      // this.saveAsError = '';
      // $('#saveAsAddPartnerModal').modal('show');
    }catch(error){
       this.xtremandLogger.error( error, "Add Partner component", "saveAsChange()" );
      }
   }
   saveAsInputChecking(){
    try{
     const names = this.referenceService.namesArray;
     const inputName = this.saveAsListName.toLowerCase().replace( /\s/g, '' );
        if ( $.inArray( inputName, names ) > -1 ) {
            this.saveAsError = 'This list name is already taken.';
        } else {
            if ( this.saveAsListName !== "" && this.saveAsListName.length < 250 ) {
              this.editContactComponent.saveDuplicateContactList(this.saveAsListName);
              $('#saveAsAddPartnerModal').modal('hide');
            }
            else if(this.saveAsListName === ""){  this.saveAsError = 'List Name is Required.';  }
            else{ this.saveAsError = 'You have exceeded 250 characters!'; }
          }
        }catch(error){
          this.xtremandLogger.error( error, "Add partner Component", "saveAsInputChecking()" );
        }
    }
    closeSaveAsModal(){
      this.saveAsListName = undefined;
      this.referenceService.namesArray = undefined;
    }

    ngOnInit() {
        try {
            this.socialContactImage();
            this.listTeamMembers();
            this.listOrgAdmin();
            
            $( "#Gfile_preview" ).hide();
            this.socialContactsValue = true;
            this.loggedInUserId = this.authenticationService.getUserId();
            this.defaultPartnerList( this.loggedInUserId );
            if ( this.contactService.socialProviderName == 'google' ) {
                this.getGoogleContactsUsers();
                this.contactService.socialProviderName = "nothing";
            } else if ( this.contactService.socialProviderName == 'salesforce' ) {
               /* $( '#salesforceModal' ).modal( 'show' );
                $('#salesforceModal').modal('toggle');*/
                this.showModal();
                this.contactService.socialProviderName = "nothing";
            }
        }
        catch ( error ) {
            this.xtremandLogger.error( "addPartner.component oninit " + error );
        }
    }

    ngOnDestroy() {
        this.contactService.socialProviderName = "";
        this.referenceService.callBackURLCondition = '';
        this.hideModal();
        this.hideZohoModal();
        this.contactService.isContactModalPopup = false;
        this.updatePartnerUser = false;
        $( '#settingSocialNetworkPartner' ).modal( 'hide' );
        $("body>#settingSocialNetworkPartner").remove();
        $( 'body' ).removeClass( 'modal-backdrop in' );

        if ( this.selectedAddPartnerOption !=5 && this.router.url !=='/' ) {
           let self = this;
            swal( {
                title: 'Are you sure?',
                text: "You have unsaved data",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#54a7e9',
                cancelButtonColor: '#999',
                confirmButtonText: 'Yes, Save it!',
                cancelButtonText: "No"

            }).then( function() {
                self.saveContacts();
            }, function( dismiss ) {
                if ( dismiss === 'No' ) {
                    self.selectedAddPartnerOption = 5;
                }
            })
        }
        if ( this.selectedAddPartnerOption == 5 ){
            swal.close();
        }

    }

}
