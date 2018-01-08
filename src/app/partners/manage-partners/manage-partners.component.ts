import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../../core/models/user';
import { EditUser } from '../../contacts/models/edit-user';
import { CustomeResponse } from '../../contacts/models/response';
import { Pagination } from '../../core/models/pagination';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { SocialContact } from '../../contacts/models/social-contact';

import { ContactService } from '../../contacts/services/contact.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare var $,swal: any;

@Component( {
    selector: 'app-manage-partners',
    templateUrl: './manage-partners.component.html',
    styleUrls: ['./manage-partners.component.css','../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css',
                '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css','../../../assets/css/numbered-textarea.css'],
    providers: [Pagination,SocialPagerService]
} )
export class ManagePartnersComponent implements OnInit {
    loggedInUserId: number;
    validEmailPatternSuccess: boolean = true;
    user: User;
    checkingForEmail:boolean;
    addPartnerUser: User = new User();
    newPartnerUser=[];
    partners: User[];
    partnerId = [];
    partnerListId: number;
    totalRecords: number;
    updatePartnerUser: boolean = false;
    updatedUserDetails = [];
    editUser: EditUser = new EditUser();
    response: CustomeResponse = new CustomeResponse();
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
    isContactsThere: boolean = false;
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
    unlinkGoogleSuccessMessage: boolean = false;
    unlinkSalesforceSuccessMessage: boolean = false;
    unlinkZohoSuccessMessage: boolean = false;
    Campaign: string;
    deleteErrorMessage: boolean;
    emptyPartnerList: boolean = false;
    sortOptions = [
                   { 'name': 'Sort By', 'value': ''},
                   { 'name': 'Email(A-Z)', 'value': 'emailId-ASC'},
                   { 'name': 'Email(Z-A)', 'value': 'emailId-DESC'},
                   { 'name': 'First Name(ASC)', 'value': 'firstName-ASC'},
                   { 'name': 'First Name(DESC)', 'value': 'firstName-DESC'},
                   { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC'},
                   { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC'},
               ];
    public sortOption: any = this.sortOptions[0];
    sortOptionsForPagination = [
                                { 'name': '10', 'value': '10'},
                                { 'name': '25', 'value': '25'},
                                { 'name': '50', 'value': '50'},
                                { 'name': 'ALL', 'value': 'ALL'},
                                ];
    public sortOptionForPagination: any = this.sortOptionsForPagination[0];
    
    public searchKey: string;
    sortcolumn: string = null;
    sortingOrder: string = null;
    selectedDropDown: string;
    selectedContactListIds = [];
    allselectedUsers = [];
    isHeaderCheckBoxChecked:boolean = false;
    
    public uploader: FileUploader = new FileUploader( { allowedMimeType: ["application/csv", "application/vnd.ms-excel", "text/plain", "text/csv"] });

public httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    constructor( public authenticationService: AuthenticationService,
        public socialPagerService: SocialPagerService,
        public referenceService: ReferenceService,
        public contactService: ContactService,
        public pagination: Pagination, public pagerService: PagerService, public xtremandLogger:XtremandLogger ) {
        
        this.user = new User();
        this.referenceService.callBackURLCondition = 'partners';
        this.socialPartners = new SocialContact();
        this.addPartnerUser.country = (this.referenceService.countries[0]);
    }
    
    onChangeAllPartnerUsers( event: Event ) {
        this.sortOptionForPagination = event;
        this.selectedDropDown = this.sortOptionForPagination.value;
            this.pagination.maxResults = (this.selectedDropDown == 'ALL') ? this.pagination.totalRecords : parseInt(this.selectedDropDown);
            this.pagination.pageIndex = 1;
            this.loadPartnerList(this.pagination);
        
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
        
        this.pagination.pageIndex = 1;
        this.pagination.sortcolumn = this.sortcolumn;
        this.pagination.sortingOrder = this.sortingOrder;
        this.loadPartnerList(this.pagination );
        
    }
    
    search(){
        this.pagination.searchKey = this.searchKey;
        this.pagination.pageIndex = 1;
        this.loadPartnerList( this.pagination );
    }

    listPartners( userId: number ) {
        this.contactService.listContactsOfDefaultPartnerList( userId, this.pagination )
            .subscribe(
            ( data: any ) => {
                this.pagination.totalRecords = data.totalRecords;
            },
            error =>
                () => console.log( 'loadPartner() finished' )
            );
    }
    
    defaultPartnerList( userId: number ){
        this.contactService.defaultPartnerList( userId )
        .subscribe(
        ( data: any ) => {
            console.log(data);
            this.partnerListId = data.id;
        },
        error => this.xtremandLogger.error( error ),
            () => {
                console.log( 'loadContacts() finished' );
                this.loadPartnerList(this.pagination);
            }
        );
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
        var EMAIL_ID_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_ID_PATTERN.test( emailId );
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
    
    addPartnerModalOpen(){
        $( "#addPartnerModal" ).show();
        this.addPartnerUser.country = (this.referenceService.countries[0]);
    }
    
    addPartnerModalClose(){
        $('#addPartnerModal').modal('toggle');
        $( "#addPartnerModal .close" ).click()
    }
    
    downloadEmptyCsv(){
        window.location.href = this.authenticationService.MEDIA_URL+"UPLOAD_USER_LIST _EMPTY.csv";
    }
    
    setPage( page: number, ) {
        this.pagination.pageIndex = page;
            this.loadPartnerList( this.pagination );
    }

    addRow() {
            $( "#addPartnerModal .close" ).click()
            this.newPartnerUser.push( this.addPartnerUser );
            
            
           this.selectedAddPartnerOption = 1;
           this.fileTypeError = false;
           this.isContactsThere = false;
            
            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
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
        this.selectedAddPartnerOption = 2;
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        var testArray = [];
        for ( var i = 0; i <= this.newPartnerUser.length - 1; i++ ) {
            testArray.push( this.newPartnerUser[i].emailId.toLowerCase() );
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
                if ( !isDuplicate ) {
                    this.saveValidEmails();
                } else {
                    this.dublicateEmailId = true;
                }
            }
        }
    
    saveValidEmails() {
        this.xtremandLogger.info( "saving #partnerListId " + this.partnerListId + " data => " + JSON.stringify( this.newPartnerUser ) );
        this.contactService.updateContactList( this.partnerListId, this.newPartnerUser )
            .subscribe(
            ( data: any ) => {
                data = data;
                this.xtremandLogger.info( "update partner ListUsers:" + data );
                $( "tr.new_row" ).each( function() {
                    $( this ).remove();
                });
                
                this.setResponseDetails('SUCCESS', 'your Partner has been saved successfully');
                    
                this.newPartnerUser.length = 0;
                this.allselectedUsers.length = 0;
                this.loadPartnerList( this.pagination );
                this.clipBoard = false;
                this.cancelPartners();
            },
            ( error: any ) => {
                let body: string = error['_body'];
                body = body.substring(1, body.length-1);
                if ( body.includes( 'Please Launch or Delete those campaigns first' )) {
                    this.setResponseDetails('ERROR', body);
                    console.log("done")
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "MangePartnerComponent loadPartners() finished" )
            )
        this.dublicateEmailId = false;
    }
    
    cancelPartners(){
       this.socialPartnerUsers.length = 0;
       this.allselectedUsers.length = 0;
       this.selectedContactListIds.length = 0;
       this.pager = [];
       this.pagedItems =[];
        
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -82px;left: 71px;' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -82px;left: 71px;' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -82px;left: 71px;' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
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
        this.referenceService.loading(this.httpRequestLoader, true); 
        this.httpRequestLoader.isHorizontalCss = true;
         this.contactService.loadUsersOfContactList( this.partnerListId, pagination ).subscribe(
            ( data: any ) => {
                this.partners = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                if ( this.partners.length == 0 ) {
                    this.emptyPartnerList = true;
                }
                else {
                    this.emptyPartnerList = false;
                }
                this.referenceService.loading(this.httpRequestLoader, false); 
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.partners );
            },
            error => this.xtremandLogger.error( error ),
            () => this.xtremandLogger.info( "MangePartnerComponent loadPartnerList() finished" )
        )
    }
    
    
    fileChange( input: any ) {
        this.readFiles( input.files );
        this.isContactsThere = false;
    }

    readFile( file: any, reader: any, callback: any ) {
        reader.onload = () => {
            callback( reader.result );
        }
        reader.readAsText( file );
    }

    readFiles( files: any, index = 0 ) {
        if ( files[0].type == "application/vnd.ms-excel" ) {
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
            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px; left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            let reader = new FileReader();
            reader.readAsText( files[0] );
            this.xtremandLogger.info( files[0] );
            var lines = new Array();
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
                        self.newPartnerUser.push( user );
                    }
                }
                console.log( "AddContacts : readFiles() contacts " + JSON.stringify( self.newPartnerUser ) );
            }
        } else {
            this.fileTypeError = true;
            this.uploader.queue.length = 0;
            this.selectedAddPartnerOption = 5;
        }
    }
    
    copyFromClipboard() {
        this.selectedAddPartnerOption = 2;
        this.fileTypeError = false;
        this.clipboardTextareaText = "";
        this.isContactsThere = false;
        $( "button#cancel_button" ).prop( 'disabled', false );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        this.clipBoard = true;
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
    }
    
    clipboardShowPreview() {
        var selectedDropDown = $( "select.opts:visible option:selected " ).val();
        var splitValue;
        if ( this.clipboardTextareaText == undefined ) {
            swal( "value can't be null" );
        }
        if ( selectedDropDown == "DEFAULT" ) {
            swal( "<span style='font-weight: 100;font-family: Open Sans;font-size: 24px;'>Please Select the Delimeter Type</span>" );
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
                self.newPartnerUser.push( user );
            }
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
        this.xtremandLogger.info( "contactListId in sweetAlert() " + contactId);
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
            console.log( "ManagePartner showAlert then()" + myData );
            self.removeContactListUsers1( contactId );
        })
        //}
        
    }
    
    removeContactListUsers1( contactId: number ) {
        this.partnerId[0] = contactId;
        this.contactService.removeContactListUsers( this.partnerListId, this.partnerId )
            .subscribe(
            ( data: any ) => {
                data = data;
                console.log( "update Contacts ListUsers:" + data );
                this.setResponseDetails('SUCCESS', 'your Partner has been deleted successfully');
                this.loadPartnerList( this.pagination );
            },
            ( error: any ) => {
                let body: string = error['_body'];
                body = body.substring(1, body.length-1);
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
    
    updatePartnerModalClose(){
        $('#addPartnerModal').modal('toggle');
        $( "#addPartnerModal .close" ).click()
        this.updatePartnerUser = false;
        this.updatedUserDetails.length = 0;
        this.addPartnerUser = new User();
    }
    
    updatePartnerListUser(){
        this.editUser.pagination = this.pagination;
        this.editUser.user = this.addPartnerUser;
        $( "#addPartnerModal .close" ).click()
        this.contactService.updateContactListUser( this.partnerListId, this.editUser )
         .subscribe(
            ( data: any ) => {
               console.log(data);
               this.setResponseDetails('SUCCESS', 'your Partner has been updated successfully');
               this.loadPartnerList( this.pagination );
            },
            error => this.xtremandLogger.error( error ),
            () => this.xtremandLogger.info( "EditPartnerComponent updateContactListUser() finished" )
        )
    }
    
    editUserDetails(contactDetails: any){
        this.checkingForEmail = true;
        
        this.updatePartnerUser = true;
        this.addPartnerUser.userId = contactDetails.id;
        this.addPartnerUser.firstName = contactDetails.firstName;
        this.addPartnerUser.lastName = contactDetails.lastName;
        this.addPartnerUser.contactCompany = contactDetails.contactCompany;
        this.addPartnerUser.jobTitle = contactDetails.jobTitle;
        this.addPartnerUser.emailId = contactDetails.emailId;
        this.addPartnerUser.address = contactDetails.address;
        this.addPartnerUser.city = contactDetails.city;
        this.addPartnerUser.country = contactDetails.country;
        if(this.addPartnerUser.country == null){
            this.addPartnerUser.country = (this.referenceService.countries[0]);
        }
        this.addPartnerUser.mobileNumber = contactDetails.mobileNumber;
        this.addPartnerUser.description = contactDetails.description;
        $( "#addPartnerModal" ).show();
        console.log(contactDetails);
        this.updatedUserDetails = contactDetails;
    }
    
    setResponseDetails(responseType: string, responseMessage: string){
        this.response.responseType = responseType;
        this.response.responseMessage = responseMessage;
    }
    
    socialContactImage() {
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
    }
    
    setSocialPage(page: number){
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.socialPagerService.getPager(this.socialPartnerUsers.length, page);
        this.pagedItems = this.socialPartnerUsers.slice(this.pager.startIndex, this.pager.endIndex + 1);
        
        var contactIds = this.pagedItems.map(function(a) {return a.id;});
        var items = $.grep(this.selectedContactListIds, function(element) {
            return $.inArray(element, contactIds ) !== -1;
        });
        this.xtremandLogger.log("partner Ids"+contactIds);
        this.xtremandLogger.log("Selected partner Ids"+this.selectedContactListIds);
        if(items.length == this.pager.pageSize || items.length == this.getGoogleConatacts.length || items.length == this.pagedItems.length){
            this.isHeaderCheckBoxChecked = true;
        }else{
            this.isHeaderCheckBoxChecked = false;
        }
    }
    
    googleContacts() {
        this.fileTypeError = false;
        this.isContactsThere = false;
        this.socialPartners.firstName = '';
        this.socialPartners.lastName = '';
        this.socialPartners.emailId = '';
        this.socialPartners.contactName = '';
        this.socialPartners.showLogin = true;
        this.socialPartners.statusCode = 0;
        this.socialPartners.contactType = '';
        this.socialPartners.alias = '';
        this.socialPartners.socialNetwork = "GOOGLE";
        this.contactService.googleCallBack = true;
        this.xtremandLogger.info( "socialContacts" + this.socialPartners.socialNetwork );
        this.contactService.googleLogin(this.isPartner)
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
                if(error._body.includes("JSONObject") && error._body.includes("access_token") && error._body.includes("not found.")){
                    this.xtremandLogger.errorMessage = 'authentication was not successful.';
                }
                this.xtremandLogger.errorPage( error );
            },
            () => this.xtremandLogger.log( "AddContactsComponent googleContacts() finished." )
            );
    }

    getGoogleContactsUsers() {
        this.contactService.googleCallBack = false;
        this.socialPartners.socialNetwork = "GOOGLE";
        var self = this;
        this.contactService.getGoogleContacts( this.socialPartners )
            .subscribe(
            data => {
                this.getGoogleConatacts = data;
                if ( this.getGoogleConatacts.contacts.length == 0 ) {
                    this.isContactsThere = true;
                }
                for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                    this.socialPartnerUsers.push( socialContact );
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    $( "#Gfile_preview" ).show();
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                }
                this.selectedAddPartnerOption = 3;
                this.setSocialPage(1);
                this.socialPartners.contacts = this.socialPartnerUsers;
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
                this.xtremandLogger.errorPage( error );
            },
            () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
            );
        this.isContactsThere = false;
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
                this.xtremandLogger.error( "AddContactComponent saveGoogleContacts() Contacts Null Error" );
    }

    saveGoogleContactSelectedUsers() {
        this.selectedAddPartnerOption = 3;
        if ( this.allselectedUsers.length != 0 ) {
            this.newPartnerUser = this.allselectedUsers;
            this.saveValidEmails();
        }
        else {
            this.xtremandLogger.error( "AddContactComponent saveGoogleContactSelectedUsers() ContactListName Error" );
        }
    }

    zohoContacts() {
        this.fileTypeError = false;
        this.isContactsThere = false;
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
    }

    hideZohoModal() {
        $( "#zohoShowLoginPopup" ).hide();
    }

    checkingZohoContactsAuthentication() {
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

    getZohoContacts( contactType: any, username: string, password: string ) {
        this.socialPartners.socialNetwork = "";
        var self = this;
        this.contactService.getZohoContacts( this.userName, this.password, this.contactType )
            .subscribe(
            data => {
                this.getGoogleConatacts = data;
                this.zohoImageBlur = false;
                this.zohoImageNormal = true;
                this.socialContactImage();
                this.hideZohoModal();
                if ( this.getGoogleConatacts.contacts.length == 0 ) {
                    this.isContactsThere = true;
                }
                for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                    this.socialPartnerUsers.push( socialContact );
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    $( "#Gfile_preview" ).show();
                    $( "#myModal .close" ).click()
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                }
                this.selectedAddPartnerOption = 6;
                this.setSocialPage(1);
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
        this.isContactsThere = false;
    }

    hideZohoAuthorisedPopup() {
        $( "#zohoShowAuthorisedPopup" ).hide();
    }
    authorisedZohoContacts() {
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
                if ( this.getGoogleConatacts.contacts.length == 0 ) {
                    this.isContactsThere = true;
                }
                for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                    this.socialPartnerUsers.push( socialContact );
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    $( "#Gfile_preview" ).show();
                    $( "#myModal .close" ).click()
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                }
                this.setSocialPage(1);
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
                this.xtremandLogger.errorPage( error );
            },
            () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
            );
        this.isContactsThere = false;
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
                    }
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.log( "onChangeSalesforceDropdown" )
                );
        }
    }

    showModal() {
        $( "#salesforceModal" ).show();
    }

    hideModal() {
        $( '#salesforceModal' ).modal( 'hide' );
        $( 'body' ).removeClass( 'modal-open' );
        $( '.modal-backdrop fade in' ).remove();

    }

    salesforceContacts() {
        this.contactType = "";
        this.isContactsThere = false;
        this.fileTypeError = false;
        this.socialPartners.socialNetwork = "salesforce";
        this.xtremandLogger.info( "socialContacts" + this.socialPartners.socialNetwork );
        this.contactService.salesforceLogin(this.isPartner)
            .subscribe(
            data => {
                this.storeLogin = data;
                console.log( data );
                if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                    $( "#salesforceModal" ).modal();
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

    checkingPopupValues() {
        $( "button#salesforce_save_button" ).prop( 'disabled', true );
        if ( this.contactType == "contact_listviews" || this.contactType == "lead_listviews" ) {
            this.getSalesforceListViewContacts( this.contactType );
        } else {
            this.getSalesforceContacts( this.contactType );
        }
    }

    getSalesforceContacts( contactType: any ) {
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
                if ( this.getGoogleConatacts.contacts.length == 0 ) {
                    this.isContactsThere = true;
                    this.hideModal();
                }
                for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                    this.socialPartnerUsers.push( socialContact );
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    $( "#Gfile_preview" ).show();
                    this.hideModal();
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                }
                this.setSocialPage(1);
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
            },
            () => this.xtremandLogger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getGoogleConatacts.contacts ) )
            );
        this.isContactsThere = false;
    }

    getSalesforceListViewContacts( contactType: any ) {
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
                if ( this.getGoogleConatacts.contacts.length == 0 ) {
                    this.isContactsThere = true;
                    this.hideModal();
                }
                for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                    this.socialPartnerUsers.push( socialContact );
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    $( "#Gfile_preview" ).show();
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    this.hideModal();
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                }
                this.setSocialPage(1);
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
            },
            () => this.xtremandLogger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getGoogleConatacts.contacts ) )
            );
        this.isContactsThere = false;
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
        if ( this.selectedAddPartnerOption == 2 || this.selectedAddPartnerOption == 1) {
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
        $( '#settingSocialNetwork' ).modal();
    }
    
    unlinkSocailAccount() {
        let socialNetwork = this.settingSocialNetwork.toUpperCase();
        console.log( "CheckBoXValueUNlink" + this.isUnLinkSocialNetwork );
        this.contactService.unlinkSocailAccount( socialNetwork, this.isUnLinkSocialNetwork )
            .subscribe(
            ( data: any ) => {
                if ( socialNetwork == 'SALESFORCE' ) {
                    $( "#salesforceContact_buttonNormal" ).hide();
                    $( "#salesforceGear" ).hide();
                    this.sfImageBlur = true;
                    this.unlinkSalesforceSuccessMessage = true;
                    setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                    this.socialContactImage();
                }
                else if ( socialNetwork == 'GOOGLE' ) {
                    $( "#googleContact_buttonNormal" ).hide();
                    $( "#GoogleGear" ).hide();
                    this.googleImageBlur = true;
                    this.unlinkGoogleSuccessMessage = true;
                    setTimeout( function() { $( "#googleSuccessMessage" ).slideUp( 500 ); }, 3000 );
                }
                else if ( socialNetwork == 'ZOHO' ) {
                    $( "#zohoContact_buttonNormal" ).hide();
                    $( "#zohoGear" ).hide();
                    this.zohoImageBlur = true;
                    this.unlinkZohoSuccessMessage = true;
                    setTimeout( function() { $( "#zohoSuccessMessage" ).slideUp( 500 ); }, 3000 );
                }
            },
            ( error: any ) => {
                if ( error.search( 'Please Launch or Delete those campaigns first' ) != -1 ) {
                    this.Campaign = error;
                    $( "#settingsSalesforce .close" ).click()
                    this.deleteErrorMessage = true;
                    setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                } else {
                    this.xtremandLogger.errorPage( error );
                }
                console.log( error );
            },
            () => {
                $( "#settingSocialNetwork .close" ).click();
                this.cancelPartners();
                this.xtremandLogger.info( "deleted completed" );
            }
            );
        this.unlinkSalesforceSuccessMessage = false;
        this.unlinkGoogleSuccessMessage = false;
        this.unlinkZohoSuccessMessage = false;
        this.deleteErrorMessage = false;
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
            this.allselectedUsers = this.removeDuplicates(this.allselectedUsers, 'emailId');
            this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
        }else{
            $('[name="campaignContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("contact-list-selected");
            if(this.pager.maxResults == this.totalRecords){
                this.selectedContactListIds = [];
                this.allselectedUsers.length = 0;
            }else{
                let paginationIdsArray = new Array;
                for(let j=0; j< this.pagedItems.length; j++){
                    var paginationEmail = this.pagedItems[j].emailId; 
                    this.allselectedUsers.splice(this.allselectedUsers.indexOf(paginationEmail), 1);
                }
                let currentPageContactIds = this.pagedItems.map(function(a) {return a.id;});
                this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
            }
        }
        ev.stopPropagation();
    }
    
    highlightRow(contactId:number,email:any,firstName:any,lastName:any,event:any){
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
        if(this.selectedContactListIds.length == this.pagedItems.length ){
            this.isHeaderCheckBoxChecked = true;
        }else{
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
    }
    
    ngOnInit() {
        this.socialContactImage();
        $( "#Gfile_preview" ).hide();
        this.socialContactsValue = true;
        this.loggedInUserId = this.authenticationService.getUserId();
        this.defaultPartnerList( this.loggedInUserId );
        if ( this.contactService.googleCallBack == true ) {
            this.getGoogleContactsUsers();
        } else if ( this.contactService.salesforceContactCallBack == true ) {
            $( "#salesforceModal" ).modal();
            this.contactService.salesforceContactCallBack = false;
        }
    }
    
    ngDestroy() {
        this.contactService.googleCallBack = false;
        this.contactService.salesforceContactCallBack = false;
        this.referenceService.callBackURLCondition = '';
        this.hideModal();

    }

}
