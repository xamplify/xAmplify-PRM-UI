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
                '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css'],
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
    public searchKey: string;
    sortcolumn: string = null;
    sortingOrder: string = null;
    
    public uploader: FileUploader = new FileUploader( { allowedMimeType: ["application/csv", "application/vnd.ms-excel", "text/plain", "text/csv"] });

public httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    constructor( public authenticationService: AuthenticationService,
        public socialPagerService: SocialPagerService,
        public referenceService: ReferenceService,
        public contactService: ContactService,
        public pagination: Pagination, public pagerService: PagerService, public xtremandLogger:XtremandLogger ) {
        
        this.user = new User();
        this.socialPartners = new SocialContact();
        this.addPartnerUser.country = (this.referenceService.countries[0]);
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
           /* this.noOptionsClickError = false;
            this.inValidCsvContacts = false;*/
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
            //this.emailNotValid = false;
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
                //this.manageContact.editContactList( this.contactListId, this.contactListName,this.uploadedUserId);
                $( "tr.new_row" ).each( function() {
                    $( this ).remove();
                });
                
                this.setResponseDetails('SUCCESS', 'your Partner has been saved successfully');
                    
                //this.checkingLoadContactsCount = true;
                this.newPartnerUser.length = 0;
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
        //this.emailNotValid = false;
        this.socialPartnerUsers.length = 0;
        
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
        $( "#Sfile_preview" ).hide();
        $( "#sample_editable_1" ).hide();
        $( "#file_preview" ).hide();
        $( '#copyFromclipTextArea' ).val( '' );
        $( "#Gfile_preview" ).hide();
        $( "#Zfile_preview" ).hide();
        this.newPartnerUser.length = 0;
        this.dublicateEmailId = false;
        this.clipBoard = false;
        this.selectedAddPartnerOption = 5;
    }
    
    loadPartnerList( pagination: Pagination ) {
        this.referenceService.loading(this.httpRequestLoader, true); 
        this.httpRequestLoader.isHorizontalCss = true;
        //pagination.criterias = this.criterias;
        //alert(this.partnerListId);
        //alert(this.partnerListId);
        //contactListId 1593
         this.contactService.loadUsersOfContactList( this.partnerListId, pagination ).subscribe(
            ( data: any ) => {
                this.partners = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                /*if ( this.contacts.length !== 0 ) {
                    this.noContactsFound = false;
                    this.noOfContactsDropdown = true;
                }
                else {
                    this.noContactsFound = true;
                    this.noOfContactsDropdown = false;
                    this.pagedItems = null;
                }*/
                this.referenceService.loading(this.httpRequestLoader, false); 
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.partners );
                
               /* var contactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedContactListIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                if(items.length==pagination.totalRecords || items.length == this.pagination.pagedItems.length){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }
                */
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
            //this.noOptionsClickError = false;
            //this.model.contactListName = outputstring;
            //this.validateContactName( this.model.contactListName );
            //this.removeCsvName = true;
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
            //$( "#file_preview" ).hide();
           // this.model.contactListName = null;
           // this.removeCsvName = false;
            this.uploader.queue.length = 0;
            this.selectedAddPartnerOption = 5;
        }
    }
    
    copyFromClipboard() {
        this.selectedAddPartnerOption = 2;
        this.fileTypeError = false;
       // this.noOptionsClickError = false;
       // this.inValidCsvContacts = false;
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
           // this.clipboardUsers.length = 0;
           // this.contacts.length = 0;
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
                //this.clipboardUsers.push( user );
                self.newPartnerUser.push( user );
               /* $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                $( "#file_preview" ).show();
                this.valilClipboardUsers = true;*/
            }
            var endTime = new Date();
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing started at: <b>" + startTime + "</b></h5>" );
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing Finished at: <b>" + endTime + "</b></h5>" );
            $( "#clipBoardValidationMessage" ).append( "<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Total Number of records Found: <b>" + allTextLines.length + "</b></h5>" );
        } else {
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( "#clipBoardValidationMessage" ).show();
            //$( "#file_preview" ).hide();
        }
        this.xtremandLogger.info( this.newPartnerUser );
    }

    
    deleteUserShowAlert( contactId: number ) {
        //this.contactIds.push( this.contactUsersId )
        this.xtremandLogger.info( "contactListId in sweetAlert() " + contactId);
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
            console.log( "ManagePartner showAlert then()" + myData );
            self.removeContactListUsers1( contactId );
        })
        }
        
    }
    
    removeContactListUsers1( contactId: number ) {
        //this.contactUsersId = contactId;
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
    
    selectGoogleContact( event: boolean ) {
        this.xtremandLogger.info( "check value:" + event )
        var all: any = document.getElementById( "select_all_google_contacts" );
        if ( event == false ) {
            all.checked = false;
            
        }
    }

    selectAllGoogleContacts( event: boolean ) {
        this.xtremandLogger.info( "check value:" + event )
        this.socialPartnerUsers.forEach(( socialPartnerUsers ) => {
            if ( event == true ) {
                socialPartnerUsers.checked = true;
                this.socialPartnersAllChecked = true;
                this.socialContactsValue = true;
            }
            else {
                socialPartnerUsers.checked = false;
                this.socialPartnersAllChecked = false;
                this.socialContactsValue = false;
            }
        })
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
                /*this.contactService.saveSocialContactList( this.socialPartners )
                    .subscribe(
                    data => {
                        data = data;
                        this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                    },
                    ( error: any ) => {
                        this.xtremandLogger.error( error );
                        this.xtremandLogger.errorPage( error );
                    },
                    () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
                    )*/
            } else
                this.xtremandLogger.error( "AddContactComponent saveGoogleContacts() Contacts Null Error" );
    }

    saveGoogleContactSelectedUsers() {
        this.selectedAddPartnerOption = 3;
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
        this.xtremandLogger.info( "SelectedUserIDs:" + selectedUserIds );
        if ( selectedUsers.length != 0 ) {
            this.newPartnerUser = selectedUsers;
            this.saveValidEmails();
            /*this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( selectedUsers ) );
            this.contactService.saveContactList( selectedUsers,'', this.isPartner )
                .subscribe(
                data => {
                    data = data;
                    this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
                )*/
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
                   // $( "#Zfile_preview" ).show();
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
                    // this.zohoImageNormal = true;
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
                /*this.contactService.saveSocialContactList( this.socialPartners )
                    .subscribe(
                    data => {
                        data = data;
                        this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                        $( "#uploadContactsMessage" ).show();
                    },

                    ( error: any ) => {
                        this.xtremandLogger.error( error );
                        this.xtremandLogger.errorPage( error );
                    },
                    () => this.xtremandLogger.info( "addcontactComponent saveZohoContact() finished" )
                    )*/
            } else
                this.xtremandLogger.error( "AddContactComponent saveZohoContacts() Contacts Null Error" );
    }

    saveZohoContactSelectedUsers() {
        var selectedUserIds = new Array();
        let selectedUsers = new Array<User>();
        let self = this;
        $( 'input[name="selectedUserIds"]:checked' ).each( function() {
            var userInformation = $( this ).val().split( ',' );
            let user = new User();
            user.emailId = userInformation[0];
            user.firstName = userInformation[1];
            user.lastName = userInformation[2];
            selectedUsers.push( user );
            
        });
        console.log( selectedUsers );
        this.xtremandLogger.info( "SelectedUserIDs:" + selectedUserIds );
        if ( selectedUsers.length != 0 ) {
            this.newPartnerUser = selectedUsers;
            this.saveValidEmails();
            /*this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( selectedUsers ) );
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            this.contactService.saveContactList( selectedUsers, this.model.contactListName, this.isPartner )
                .subscribe(
                data => {
                    data = data;
                    this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                    $( "#uploadContactsMessage" ).show();
                    if(this.isPartner == false){
                        this.router.navigateByUrl( '/home/contacts/manage' )
                        }else{
                            this.router.navigateByUrl( 'home/partners/manage' )
                        }
                    this.contactService.successMessage = true;
                },

                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.info( "addcontactComponent saveZohoContactUsers() finished" )
                )*/
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
                    //this.sfImageNormal = true;
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
        this.xtremandLogger.info( "SelectedUserIDs:" + selectedUserIds );
        if ( selectedUsers.length != 0 ) {
            this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( selectedUsers ) );
            this.newPartnerUser = selectedUsers;
            this.saveValidEmails();
            /*this.contactService.saveContactList( selectedUsers, this.model.contactListName, this.isPartner )
                .subscribe(
                data => {
                    data = data;
                    this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                    $( "#uploadContactsMessage" ).show();
                    if(this.isPartner == false){
                        this.router.navigateByUrl( '/home/contacts/manage' )
                        }else{
                            this.router.navigateByUrl( 'home/partners/manage' )
                        }
                    this.contactService.successMessage = true;
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.info( "addcontactComponent saveZohoContactUsers() finished" )
                )*/
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
                
                /*this.contactService.saveSocialContactList( this.socialContact )
                    .subscribe(
                    data => {
                        data = data;
                        this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                        $( "#uploadContactsMessage" ).show();
                        if(this.isPartner == false){
                            this.router.navigateByUrl( '/home/contacts/manage' )
                            }else{
                                this.router.navigateByUrl( 'home/partners/manage' )
                            }
                    },
                    ( error: any ) => {
                        this.xtremandLogger.error( error );
                        this.xtremandLogger.errorPage( error );
                    },
                    () => this.xtremandLogger.info( "addcontactComponent saveSalesforceContacts() finished" )
                    )*/
            } else
                this.xtremandLogger.error( "AddContactComponent saveSalesforceContacts() Contacts Null Error" );
    }
    
    saveContacts() {
        if ( this.selectedAddPartnerOption == 2 || this.selectedAddPartnerOption == 1) {
            this.savePartnerUsers();
        }
        
        if ( this.selectedAddPartnerOption == 3 ) {
            if ( this.socialContactsValue == true ) {
                this.saveGoogleContacts();
            } else
                this.saveGoogleContactSelectedUsers();
        }
        
        if ( this.selectedAddPartnerOption == 6 ) {
            if ( this.socialContactsValue == true ) {
                this.saveZohoContacts();
            } else
                this.saveZohoContactSelectedUsers();
        }
        
        if ( this.selectedAddPartnerOption == 7 ) {
            if ( this.socialContactsValue == true ) {
                this.saveSalesforceContacts();
            } else
                this.saveSalesforceContactSelectedUsers();
        }

        /*if ( this.selectedAddContactsOption == 3 ) {
            this.saveClipBoardContactList();
        }

        if ( this.selectedAddContactsOption == 4 ) {
            this.saveCsvContactList();
        }
        if ( this.selectedAddContactsOption == 3 ) {
            if ( this.salesforceContactsValue == true ) {
                this.saveSalesforceContacts();
            } else
                this.saveSalesforceContactSelectedUsers();
        }

        

        if ( this.selectedAddContactsOption == 5 ) {
            if ( this.zohoContactsValue == true ) {
                this.saveZohoContacts();
            } else
                this.saveZohoContactSelectedUsers();
        }

        if ( this.selectedAddContactsOption == 8 ) {
            this.noOptionsClickError = true;
        }*/
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
        this.hideModal();

    }

}
