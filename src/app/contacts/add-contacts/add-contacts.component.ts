import { Component, OnInit, ChangeDetectorRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { User } from '../../core/models/user';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialContact } from '../models/social-contact';
import { ZohoContact } from '../models/zoho-contact';
import { SalesforceContact } from '../models/salesforce-contact';
import { Pagination } from '../../core/models/pagination';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AddContactsOption } from '../models/contact-option';
import { SocialPagerService } from '../services/social-pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { CountryNames } from '../../common/models/country-names';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { FileUtil } from '../../core/models/file-util';
import { HubSpotService } from 'app/core/services/hubspot.service';
import { GdprSetting } from '../../dashboard/models/gdpr-setting';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';
import { UserService } from '../../core/services/user.service';

declare var swal, $, Papa: any;

@Component( {
    selector: 'app-add-contacts',
    templateUrl: './add-contacts.component.html',
    styleUrls: ['../../../assets/global/plugins/dropzone/css/dropzone.css',
        '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css',
        '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css',
        '../../../assets/css/form.css',
        './add-contacts.component.css',
        '../../../assets/css/numbered-textarea.css', '../../../assets/css/phone-number-plugin.css'],
    providers: [FileUtil, SocialContact, ZohoContact, SalesforceContact, Pagination, CountryNames, Properties, RegularExpressions, PaginationComponent]
})
export class AddContactsComponent implements OnInit, OnDestroy {
    settingSocialNetwork: string;
    isUnLinkSocialNetwork: boolean = false;
    public contactLists: Array<ContactList>;
    contactListObject: ContactList;
    public clipBoard: boolean = false;
    public newUsers: Array<User>;
    addContactuser: User = new User();
    public clipboardUsers: Array<User>;
    public clipboardTextareaText: string;
    selectedZohoDropDown: string = 'DEFAULT';
    zohoCredentialError = '';
    model: any = {};
    names: string[] = [];
    invalidPatternEmails: string[] = [];
    isValidContactName: boolean = false;
    validCsvContacts: boolean;
    googleImageBlur: boolean = false;
    googleImageNormal: boolean = false;
    sfImageBlur: boolean = false;
    sfImageNormal: boolean = false;
    zohoImageBlur: boolean = false;
    zohoImageNormal: boolean = false;
    noOptionsClickError: boolean = false;
    duplicateEmailIds: string[] = [];
    public contactListNameError = false;
    public invalidPattenMail: boolean;
    public valilClipboardUsers: boolean = false;
    public validEmailPatternSuccess: boolean = true;
    public uploadvalue = true;
    public contactListName: string;
    public userName: string;
    public password: string;
    public contactType: string;
    public salesforceListViewId: string;
    public salesforceListViewName: string;
    public socialNetwork: string;
    removeCsvName: boolean;
    public socialContact: SocialContact;
    public zohoContact: ZohoContact;
    public getGoogleConatacts: any;
    public getZohoConatacts: any;
    public salesforceContact: SalesforceContact;
    public getSalesforceConatactList: any;
    public storeLogin: any;
    public socialContactUsers: SocialContact[] = new Array();
    public salesforceListViewsData: Array<any> = [];
    public hubSpotContactListsData:Array<any>=[];
    pager: any = {};
    pagedItems: any[];
    checkingForEmail: boolean;
    isPartner: boolean;
    checkingContactTypeName: string;
    selectedContactListIds = [];
    allselectedUsers = [];
    isHeaderCheckBoxChecked: boolean = false;
    customResponse: CustomResponse = new CustomResponse();
    pageSize: number = 12;
    pageNumber: any;
    paginationType = "";
    loading = false;
    isListLoader = false;
    isDuplicateEmailId = false;

    uploadedCsvFileName = "";

    AddContactsOption: typeof AddContactsOption = AddContactsOption;
    selectedAddContactsOption: number = 8;
    disableOtherFuctionality = false;

    public uploader: FileUploader = new FileUploader( { allowedMimeType: ["application/csv", "application/vnd.ms-excel", "text/plain", "text/csv"] });
    contacts: User[];
    private socialContactType: string;
    emailNotValid: boolean;
    isCheckTC = true;
    contactOption: any;


    //MARKETO

    showMarketoForm: boolean;
    marketoAuthError: boolean;
    marketoInstanceClass: string;
    marketoInstanceError: boolean;
    marketoInstance: any;
    marketoSecretIdClass: string;
    marketoSecretIdError: boolean;
    marketoSecretId: any;
    marketoClientId: any;
    marketoClientIdClass: string;
    marketoClentIdError: boolean;
    isMarketoModelFormValid: boolean;
    marketoContactError: boolean;
    marketoContactSuccessMsg: any;
    loadingMarketo: boolean;
    public getMarketoConatacts: any;


    marketoImageBlur: boolean = false;
    marketoImageNormal: boolean = false;

    hubspotImageBlur: boolean = false;
    hubspotImageNormal: boolean = false;
    hubSpotSelectContactListOption:any;
    hubSpotContactListName: string;

    paginatedSelectedIds = [];
    gdprSetting: GdprSetting = new GdprSetting();
    termsAndConditionStatus = true;
    gdprStatus = true;    
    legalBasisOptions :Array<LegalBasisOption>;
    parentInput:any;
    companyId: number = 0;
    isValidLegalOptions = true;
    selectedLegalBasisOptions = [];
    filePreview = false;
    public fields: any;
    public placeHolder: string = 'Select Legal Basis Options';
    constructor( private fileUtil: FileUtil, public socialPagerService: SocialPagerService, public referenceService: ReferenceService, private authenticationService: AuthenticationService,
        public contactService: ContactService, public regularExpressions: RegularExpressions, public paginationComponent: PaginationComponent,
        private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, public properties: Properties,
        private router: Router, public pagination: Pagination, public xtremandLogger: XtremandLogger, public countryNames: CountryNames, private hubSpotService: HubSpotService, public userService: UserService) {
        this.pageNumber = this.paginationComponent.numberPerPage[0];
        this.addContactuser.country = ( this.countryNames.countries[0] );
        let currentUrl = this.router.url;
        if ( currentUrl.includes( 'home/contacts' ) ) {
            this.isPartner = false;
            this.checkingContactTypeName = "Contact"
        } else {
            this.isPartner = true;
            this.checkingContactTypeName = "Partner"
        }

        this.contacts = new Array<User>();
        this.newUsers = new Array<User>();
        this.clipboardUsers = new Array<User>();
        this.socialContact = new SocialContact();
        this.zohoContact = new ZohoContact();
        this.socialContact.socialNetwork = "";
        this.uploader.onAfterAddingFile = ( file ) => {
            file.withCredentials = false;
        };
        this.model.contactListName = '';
        this.userName = '';
        this.password = '';
        this.contactType = '';
        let self = this;
        this.uploader.onBuildItemForm = function( fileItem: any, form: FormData ) {
            this.xtremandLogger.info( "addContacts.component onBuildItemForm" + self.model.contactListName );
            form.append( 'userListName', "" + self.model.contactListName );
            return { fileItem, form }
        };
        this.uploader.onCompleteItem = ( item: any, response: any, status: any, headers: any ) => {
            var responsePath = response;
            this.xtremandLogger.info( "addContacts.component onCompleteItem:" + responsePath );// the url will be in the response
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
        };
        this.parentInput = {};
        const currentUser = JSON.parse(localStorage.getItem( 'currentUser' ));
        let campaginAccessDto = currentUser.campaignAccessDto;
        if(campaginAccessDto!=undefined){
            this.companyId = campaginAccessDto.companyId;
        }
        
    }

    validateContactName( contactName: string ) {
        this.noOptionsClickError = false;
        this.contactListNameError = false;
        let lowerCaseContactName = contactName.toLowerCase().replace( /\s/g, '' );
        var list = this.names;
        this.xtremandLogger.log( list );
        if ( $.inArray( lowerCaseContactName, list ) > -1 ) {
            this.isValidContactName = true;
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( ".ng-valid[required], .ng-valid.required" ).css( "color", "red" );
        } else {
            $( ".ng-valid[required], .ng-valid.required" ).css( "color", "Black" );
            this.isValidContactName = false;
            this.validateLegalBasisOptions();
           // $( "button#sample_editable_1_new" ).prop( 'disabled', false );
        }
    }

    checked( event: boolean ) {
        this.xtremandLogger.info( "selected check value" + event )
        this.newUsers.forEach(( contacts ) => {
            if ( event == true )
                contacts.isChecked = true;
            else
                contacts.isChecked = false;
        })
    }

    changEvent( event: any ) {
        this.uploadvalue = false;
    }

    changEvents( event: any ) {
        this.uploadvalue = false;
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
        //files[0].type == "application/vnd.ms-excel" || files[0].type == "text/csv" || files[0].type == "text/x-csv" || 
        if ( this.fileUtil.isCSVFile( files[0] ) ) {
            this.isListLoader = true;
            var outputstring = files[0].name.substring( 0, files[0].name.lastIndexOf( "." ) );
            this.selectedAddContactsOption = 2;
            this.paginationType = "csvContacts";
            this.noOptionsClickError = false;
            this.uploadedCsvFileName = files[0].name;
            if ( !this.model.contactListName ) {
                this.model.contactListName = outputstring;
            }
            this.validateContactName( this.model.contactListName );
            this.validateLegalBasisOptions();
            this.removeCsvName = true;
           // $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            $( "#file_preview" ).show();
            $( "button#cancel_button" ).prop( 'disabled', false );
            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.marketoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.hubspotImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px; left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            let reader = new FileReader();
            reader.readAsText( files[0] );
            this.xtremandLogger.info( files[0] );
            var lines = new Array();
            var self = this;
            reader.onload = function( e: any ) {
                var contents = e.target.result;

                let csvData = reader.result;
                let csvRecordsArray = csvData.split( /\r|\n/ );
                let headersRow = self.fileUtil
                    .getHeaderArray( csvRecordsArray );
                let headers = headersRow[0].split( ',' );
                if ( ( headers.length == 11 ) ) {
                    if ( self.validateHeaders( headers ) ) {
                        var csvResult = Papa.parse( contents );

                        var allTextLines = csvResult.data;
                        for ( var i = 1; i < allTextLines.length; i++ ) {
                            // var data = allTextLines[i].split( ',' );
                            if ( allTextLines[i][4] && allTextLines[i][4].trim().length > 0 ) {
                                let user = new User();
                                user.emailId = allTextLines[i][4].trim();
                                user.firstName = allTextLines[i][0].trim();
                                user.lastName = allTextLines[i][1].trim();
                                user.contactCompany = allTextLines[i][2].trim();
                                user.jobTitle = allTextLines[i][3].trim();
                                user.address = allTextLines[i][5].trim();
                                user.city = allTextLines[i][6].trim();
                                user.state = allTextLines[i][7].trim();
                                user.zipCode = allTextLines[i][8].trim();
                                user.country = allTextLines[i][9].trim();
                                user.mobileNumber = allTextLines[i][10].trim();
                                /*user.description = allTextLines[i][9];*/
                                self.contacts.push( user );
                            }
                        }
                        self.setPage( 1 );
                        self.isListLoader = false;


                    } else {
                        self.customResponse = new CustomResponse( 'ERROR', "Invalid Csv", true );
                        self.isListLoader = false;
                        self.cancelContacts();
                    }
                } else {
                    self.customResponse = new CustomResponse( 'ERROR', "Invalid Csv", true );
                    self.isListLoader = false;
                    self.cancelContacts();
                }

                // console.log( "AddContacts : readFiles() contacts " + JSON.stringify( self.contacts ) );
            }
        } else {
            this.customResponse = new CustomResponse( 'ERROR', this.properties.FILE_TYPE_ERROR, true );
            $( "#file_preview" ).hide();
            this.model.contactListName = null;
            this.removeCsvName = false;
            this.uploader.queue.length = 0;
            this.selectedAddContactsOption = 8;
        }
    }
    validateHeaders( headers ) {
        return ( headers[0].trim() == "FIRSTNAME" && headers[1].trim() == "LASTNAME" && headers[2].trim() == "COMPANY" && headers[3].trim() == "JOBTITLE" && headers[4].trim() == "EMAILID" && headers[5].trim() == "ADDRESS" && headers[6].trim() == "CITY" && headers[7].trim() == "STATE" && headers[8].trim() == "ZIP CODE" && headers[9].trim() == "COUNTRY" && headers[10].trim() == "MOBILE NUMBER" );
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
        this.paginationType = "csvContacts";
        this.xtremandLogger.info( "selectedDropDown:" + selectedDropDown );
        this.xtremandLogger.info( splitValue );
        var startTime = new Date();
        $( "#clipBoardValidationMessage" ).html( '' );
        var self = this;
        var allTextLines = this.clipboardTextareaText.split( "\n" );
        this.xtremandLogger.info( "allTextLines: " + allTextLines );
        this.xtremandLogger.info( "allTextLines Length: " + allTextLines.length );
        var isValidData: boolean = true;
        if ( this.clipboardTextareaText === "" ) {
            $( "#clipBoardValidationMessage" ).append( "<h4 style='color:#f68a55;'>" + "Please enter the valid data." + "</h4>" );
            isValidData = false;
        }

        if ( this.clipboardTextareaText != "" ) {
            for ( var i = 0; i < allTextLines.length; i++ ) {
                var data = allTextLines[i].split( splitValue );
                if ( !this.validateEmailAddress( data[4] ) ) {
                    $( "#clipBoardValidationMessage" ).append( "<h4 style='color:#f68a55;'>" + "Email Address is not valid for Row:" + ( i + 1 ) + " -- Entered Email Address: " + data[4] + "</h4>" );
                    isValidData = false;
                }
                this.clipboardUsers.length = 0;
                this.contacts.length = 0;
            }
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
                        user.firstName = data[0].trim();
                        user.lastName = data[1].trim();
                        user.contactCompany = data[2].trim();
                        user.jobTitle = data[3].trim();
                        user.emailId = data[4].trim();
                        user.address = data[5].trim();
                        user.city = data[6].trim();
                        user.state = data[7].trim();
                        user.zipCode = data[8].trim();
                        user.country = data[9].trim();
                        user.mobileNumber = data[10].trim();
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
                this.selectedAddContactsOption = 1;
                this.xtremandLogger.info( user );
                this.clipboardUsers.push( user );
                self.contacts.push( user );
                this.setPage( 1 );
                $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                $( "#file_preview" ).show();
                this.valilClipboardUsers = true;
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
        this.xtremandLogger.info( this.clipboardUsers );
    }

    validateEmailAddress( emailId: string ) {
        var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
        return EMAIL_ID_PATTERN.test( emailId );
    }
    validateName( name: string ) {
        return ( name.trim().length > 0 );
    }
    validateEmail( emailId: string ) {
        if ( this.validateEmailAddress( emailId ) ) {
            this.checkingForEmail = true;
            this.validEmailPatternSuccess = true;
        }
        else {
            this.checkingForEmail = false;
        }
    }

    checkingEmailPattern( emailId: string ) {
        this.validEmailPatternSuccess = false;
        if ( this.validateEmailAddress( emailId ) ) {
            this.validEmailPatternSuccess = true;
            this.emailNotValid = true;
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
        } else {
            this.validEmailPatternSuccess = false;
            this.emailNotValid = false;
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        }
    }

    checkingRowEails( a: boolean, b: boolean, c: boolean ) {
        this.emailNotValid = false;
        if ( a == true ) {
            this.validEmailPatternSuccess = true;
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
        } else {
            this.validEmailPatternSuccess = false;
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
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
    
    
    askForPermission(contactOption:any) {
        this.contactOption = contactOption;
        if(this.termsAndConditionStatus){
            $('#tcModal').modal('show');
        }else{
            this.saveContactsWithPermission();
        }
        
   }
    
    saveContactsWithPermission(){
        $('#tcModal').modal('hide');
        if(this.contactOption == 'oneAtTime'){
            this.oneAtTimeSaveAfterGotPermition();
        }else if(this.contactOption == 'clipBoard'){
            this.saveClipBoardContactsAfterGotPermition();   
        }else if(this.contactOption == 'csvContacts'){
            this.saveCsvContactsWithPermission()
        }else if(this.contactOption == 'googleContacts'){
            this.saveGoogleContactsWithPermission()
        }else if(this.contactOption == 'googleSelectedContacts'){
            this.saveGoogleSelectedContactsWithPermission();
        }else if(this.contactOption == 'zohoContacts'){
            this.saveZohoContactsWithPermission();
        }else if(this.contactOption == 'zohoSelectedContacts'){
            this.saveZohoSelectedContactsWithPermission();
        }else if(this.contactOption == 'salesForceContacts'){
            this.saveSalesForceContactsWithPermission();
        }else if(this.contactOption == 'salesforceSelectedContacts'){
            this.saveSalesForceSelectedContactsWithPermission();
        }else if(this.contactOption == 'marketoContacts'){
            this.saveMarketoContactsWithPermission();
        }else if(this.contactOption == 'marketoSelectedContacts'){
            this.saveMarketoSelectedContactsWithPermission();
        }else if(this.contactOption == 'hubSpotContacts'){
            this.saveHubSpotContactsWithPermission();
        }else if(this.contactOption == 'hubSpotSelectedContacts'){
            this.saveHubSpotSelectedContactsWithPermission();
        }
    }
   
    navigateToTermsOfUse(){
        window.open("https://www.xamplify.com/terms-conditions/", "_blank");
    }
    
    navigateToPrivacy(){
        window.open("https://www.xamplify.com/privacy-policy/", "_blank");
    }
    
    navigateToGDPR(){
        window.open("https://gdpr-info.eu/", "_blank");
    }
    
    navigateToCCPA(){
        window.open("https://www.caprivacy.org/", "_blank");
    }
    
/*    askForPermission(contactOption:any) {
        let self = this;
        
        swal({
            title: 'Are you Sure?',
            text: "You are acceptin all the T/C from Xamplify!",
            type: 'warning',
            showCancelButton: true,
            //swalConfirmButtonColor: '#54a7e9',
            //swalCancelButtonColor: '#999',
            confirmButtonText: 'Yes, Accept it!',
            input: 'checkbox',
            inputPlaceholder: 'accept all the T/C.',
            allowOutsideClick: false,
            preConfirm: function( result: any ) {
                return new Promise( function() {
                        if (result === 0) {
                              swal.showValidationError( 'you should accept T/C' )
                          }else{
                              swal.close();
                              if(contactOption == 'oneAtTime'){
                                  self.oneAtTimeSaveAfterGotPermition();
                              }else if(contactOption == 'clipBoard'){
                                  self.saveClipBoardContactsAfterGotPermition();   
                              }else if(contactOption == 'csvContacts'){
                                  self.saveCsvContactsWithPermission()
                              }else if(contactOption == 'googleContacts'){
                                  self.saveGoogleContactsWithPermission
                              }else if(contactOption == 'googleSelectedContacts'){
                                  self.saveGoogleSelectedContactsWithPermission();
                              }else if(contactOption == 'zohoContacts'){
                                  self.saveZohoContactsWithPermission();
                              }else if(contactOption == 'zohoSelectedContacts'){
                                  self.saveZohoSelectedContactsWithPermission();
                              }else if(contactOption == 'salesForceContacts'){
                                  self.saveSalesForceContactsWithPermission();
                              }else if(contactOption == 'salesForceSelectedContacts'){
                                  self.saveSalesForceSelectedContactsWithPermission();
                              }else if(contactOption == 'marketoContacts'){
                                  self.saveMarketoContactsWithPermission();
                              }else if(contactOption == 'marketoSelectedContacts'){
                                  self.saveMarketoSelectedContactsWithPermission();
                              }
                          }
                });
            }
          }).then( function( result: any ) {
              console.log( result );
          }, function( dismiss: any ) {
              if ( dismiss === 'cancel' ) {
                  self.cancelContacts();
              }
          });
    }*/
    

    saveContactList() {
        this.duplicateEmailIds = [];
        var testArray = [];
        for ( var i = 0; i <= this.newUsers.length - 1; i++ ) {
            testArray.push( this.newUsers[i].emailId.toLowerCase() );
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
        var valueArr = this.newUsers.map( function( item ) { return item.emailId.toLowerCase() });
        var isDuplicate = valueArr.some( function( item, idx ) {
            return valueArr.indexOf( item ) != idx
        });
        console.log( "emailDuplicate" + isDuplicate );
        this.isDuplicateEmailId = isDuplicate;
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );

        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            this.xtremandLogger.info( this.newUsers[0].emailId.toLowerCase() );
            if ( this.newUsers[0].emailId != undefined ) {
                if ( !isDuplicate ) {
                    this.saveValidEmails();
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                } else {
                    this.customResponse = new CustomResponse( 'ERROR', "please remove duplicate email id(s) " + "'" + this.duplicateEmailIds + "'", true );
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                }
            } else {
                this.xtremandLogger.error( "AddContactComponent saveContactList() ContactListName Error" );
            }

        } else if ( this.validEmailPatternSuccess === false ) {
            this.emailNotValid = true;
            this.contactListNameError = false;
            this.noOptionsClickError = false;
        }
        else {
            if ( this.isValidContactName == false ) {
                this.contactListNameError = true;
            }
            this.xtremandLogger.error( "AddContactComponent saveContactList() ContactListName Error" );
        }
    }

    saveValidEmails() {
        try {
            this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.newUsers ) );
            for ( var i = 0; i < this.newUsers.length; i++ ) {
                this.newUsers[i].emailId = this.convertToLowerCase( this.newUsers[i].emailId );

                if ( this.newUsers[i].country === "Select Country" ) {
                    this.newUsers[i].country = null;
                }

                if ( this.newUsers[i].mobileNumber ) {
                    if ( this.newUsers[i].mobileNumber.length < 6 ) {
                        this.newUsers[i].mobileNumber = "";
                    }
                }
            }
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            
            this.askForPermission('oneAtTime');
            
        } catch ( error ) {
            this.xtremandLogger.error( error, "addcontactComponent", "Save Contacts" );
        }
    }
    
    
    oneAtTimeSaveAfterGotPermition(){
        this.loading = true;
        this.contactService.saveContactList( this.newUsers, this.model.contactListName, this.isPartner )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            this.contactService.successMessage = true;
            this.contactService.saveAsSuccessMessage = "add";
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
        },
        ( error: any ) => {
            this.loading = false;
            if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
            } else {
                this.xtremandLogger.errorPage( error );
            }
            this.xtremandLogger.error( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
        )
    }

    saveClipBoardContactList() {
        this.clipboardShowPreview();
        this.duplicateEmailIds = [];
        var testArray = [];
        for ( var i = 0; i <= this.clipboardUsers.length - 1; i++ ) {
            testArray.push( this.clipboardUsers[i].emailId.toLowerCase() );
        }
        for ( var j = 0; j <= this.clipboardUsers.length - 1; j++ ) {
            if ( this.validateEmailAddress( this.clipboardUsers[j].emailId ) ) {
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
        $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        if ( this.model.contactListName.trim().length == 0 ) {
            $( "#clipBoardValidationMessage > h4" ).empty();
            $( "#clipBoardValidationMessage" ).append( "<h4 style='color:#f68a55;'>Please Enter the Contact List Name</h4>" );
        } else {
            var valueArr = this.clipboardUsers.map( function( item ) { return item.emailId.toLowerCase() });
            var isDuplicate = valueArr.some( function( item, idx ) {
                return valueArr.indexOf( item ) != idx
            });
            console.log( "ERROREMails" + isDuplicate );
            this.isDuplicateEmailId = isDuplicate;

            if ( this.invalidPattenMail === true ) {
                $( "#clipBoardValidationMessage" ).append( "<h4 style='color:#f68a55;'>" + "Email Address is not valid" + "</h4>" );
                testArray.length = 0;
            }
            if ( this.valilClipboardUsers == true ) {
                if ( !isDuplicate ) {
                    this.saveClipboardValidEmails();
                } else {
                    this.customResponse = new CustomResponse( 'ERROR', "please remove duplicate email id(s) " + "'" + this.duplicateEmailIds + "'", true );
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                }
            }
        }
    }

    saveClipboardValidEmails() {
        try {
            for ( var i = 0; i < this.clipboardUsers.length; i++ ) {
                this.clipboardUsers[i].emailId = this.convertToLowerCase( this.clipboardUsers[i].emailId );

                if ( this.clipboardUsers[i].country === "Select Country" ) {
                    this.clipboardUsers[i].country = null;
                }

                /* if ( this.clipboardUsers[i].mobileNumber.length < 6 ) {
                     this.clipboardUsers[i].mobileNumber = "";
                 }*/
            }
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            if ( this.model.contactListName != ' ' ) {
                
                this.askForPermission('clipBoard');
               
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addcontactComponent saveClipboardContact()" )
        }
    }
    
    saveClipBoardContactsAfterGotPermition(){
        this.loading = true;
        this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.clipboardUsers ) );
        this.setLegalBasisOptions(this.clipboardUsers);
        this.contactService.saveContactList( this.clipboardUsers, this.model.contactListName, this.isPartner )
            .subscribe(
            data => {
                data = data;
                this.loading = false;
                this.selectedAddContactsOption = 8;
                this.contactService.saveAsSuccessMessage = "add";
                this.xtremandLogger.info( "update Contacts ListUsers:" + data );
                this.disableOtherFuctionality = false;
                if ( this.isPartner == false ) {
                    this.router.navigateByUrl( '/home/contacts/manage' )
                } else {
                    this.router.navigateByUrl( 'home/partners/manage' )
                }
            },
            ( error: any ) => {
                this.loading = false;
                if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                    this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
                } else {
                    this.xtremandLogger.errorPage( error );
                }
                this.xtremandLogger.error( error );
            },
            () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
            )
    }

    saveCsvContactList() {
        try {
            this.invalidPatternEmails.length = 0;
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
                if ( this.contacts.length > 0 ) {
                    for ( let i = 0; i < this.contacts.length; i++ ) {
                        if ( !this.validateEmailAddress( this.contacts[i].emailId ) ) {
                            this.invalidPatternEmails.push( this.contacts[i].emailId )
                        }
                        if ( this.validateEmailAddress( this.contacts[i].emailId ) ) {
                            this.validCsvContacts = true;
                        }
                        else {
                            this.validCsvContacts = false;
                        }
                    }
                    if ( this.validCsvContacts == true && this.invalidPatternEmails.length == 0 ) {
                        for ( var i = 0; i < this.contacts.length; i++ ) {
                            this.contacts[i].emailId = this.convertToLowerCase( this.contacts[i].emailId );

                            if ( this.contacts[i].country === "Select Country" ) {
                                this.contacts[i].country = null;
                            }

                            var testArray = [];
                            for ( var i = 0; i <= this.contacts.length - 1; i++ ) {
                                testArray.push( this.contacts[i].emailId.toLowerCase() );
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
                            var valueArr = this.contacts.map( function( item ) { return item.emailId.toLowerCase() });
                            var isDuplicate = valueArr.some( function( item, idx ) {
                                return valueArr.indexOf( item ) != idx
                            });
                            console.log( "emailDuplicate" + isDuplicate );
                            this.isDuplicateEmailId = isDuplicate;

                            /*if ( this.contacts[i].mobileNumber.length < 6 ) {
                                this.contacts[i].mobileNumber = "";
                            }*/
                        }
                        if ( !isDuplicate ) {
                            this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.contacts ) );
                            this.contactListObject = new ContactList;
                            this.contactListObject.name = this.model.contactListName;
                            this.contactListObject.isPartnerUserList = this.isPartner;
                            
                            this.askForPermission('csvContacts');
                            
                        } else {
                            this.customResponse = new CustomResponse( 'ERROR', "please remove duplicate email id(s) " + "'" + this.duplicateEmailIds + "'", true );
                        }
                    } else {
                        this.loading = false;
                        this.customResponse = new CustomResponse( 'ERROR', "'" + this.invalidPatternEmails + "'" + " are not valid email id(s) please remove", true );
                    }
                } else
                    this.xtremandLogger.error( "AddContactComponent saveCsvContactList() Contacts Null Error" );
            }
            else {
                if ( this.isValidContactName == false ) {
                    this.contactListNameError = true;
                }
                this.loading = false;
                this.xtremandLogger.error( "AddContactComponent saveCsvContactList() ContactListName Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "addcontactComponent saveCSVContact()" )
        }
    }
    
    saveCsvContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.contacts);
        this.contactService.saveContactList( this.contacts, this.model.contactListName, this.isPartner )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            this.contactService.saveAsSuccessMessage = "add";
            this.uploadedCsvFileName = "";
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
        },
        ( error: any ) => {
            if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
            } else {
                this.xtremandLogger.errorPage( error );
            }
            this.xtremandLogger.error( error );
            this.loading = false;
        },
        () => this.xtremandLogger.info( "addcontactComponent saveCsvContactList() finished" )
        )
    }
    
    validateLegalBasisOptions(){
        this.isValidLegalOptions = true;
        if(this.selectedAddContactsOption>0){
            if(this.gdprStatus && this.selectedLegalBasisOptions.length==0){
                this.isValidLegalOptions = false;
                if(this.isValidContactName){
                    $('#sample_editable_1_new').prop("disabled",true);
                }else{
                    $('#sample_editable_1_new').prop("disabled",false);
                }
               
            }else{
                $('#sample_editable_1_new').prop("disabled",false);
            }
        }else{
            if(this.isValidContactName){
                $('#sample_editable_1_new').prop("disabled",true);
            }else{
                $('#sample_editable_1_new').prop("disabled",false);
            }
        }
    }

    saveContacts() {
        this.validateLegalBasisOptions();
        if(this.isValidLegalOptions){
            this.noOptionsClickError = false;
            if ( this.selectedAddContactsOption == 0 ) {
                this.saveContactList();
            }

            if ( this.selectedAddContactsOption == 1 ) {
                this.saveClipBoardContactList();
            }

            if ( this.selectedAddContactsOption == 2 ) {
                this.saveCsvContactList();
            }
            if ( this.selectedAddContactsOption == 3 ) {
                if ( this.allselectedUsers.length == 0 ) {
                    this.saveSalesforceContacts();
                } else
                    this.saveSalesforceContactSelectedUsers();
            }

            if ( this.selectedAddContactsOption == 4 ) {
                if ( this.allselectedUsers.length == 0 ) {
                    this.saveGoogleContacts();
                } else
                    this.saveGoogleContactSelectedUsers();
            }

            if ( this.selectedAddContactsOption == 5 ) {
                if ( this.allselectedUsers.length == 0 ) {
                    this.saveZohoContacts();
                } else
                    this.saveZohoContactSelectedUsers();
            }
            if ( this.selectedAddContactsOption == 6 ) {
                if ( this.allselectedUsers.length == 0 ) {
                    this.saveMarketoContacts();
                } else
                    this.saveMarketoContactSelectedUsers();
            }

            
            if(this.selectedAddContactsOption == 9){
                if ( this.allselectedUsers.length == 0 ) {
                    this.saveHubSpotContacts();
                } else{
                    this.saveHubSpotContactSelectedUsers();
                }                
            }
            
            if ( this.selectedAddContactsOption == 8 ) {
                this.noOptionsClickError = true;
            }
        }
        
    }

    cancelContacts() {
        this.contactListNameError = false;
        this.noOptionsClickError = false;
        this.isValidContactName = false;
        this.emailNotValid = false;
        this.loading = false;
        this.socialContactUsers.length = 0;
        this.allselectedUsers.length = 0;
        this.selectedContactListIds.length = 0;
        this.disableOtherFuctionality = false;
        this.paginationType = "";
        if ( this.selectedAddContactsOption != 2 ) {
            this.customResponse = new CustomResponse();
        }
        this.pager = [];
        this.pagedItems = [];

        this.uploadedCsvFileName = "";

        this.contactService.successMessage = false;
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.marketoImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.hubspotImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);min-height:85px' );
        $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        $( "button#cancel_button" ).prop( 'disabled', true );
        this.model.contactListName = "";
        $( "#sample_editable_1" ).hide();
        $( "#file_preview" ).hide();
        $( '#copyFromclipTextArea' ).val( '' );
        $( "#Gfile_preview" ).hide();
        this.newUsers.length = 0;
        this.contacts.length = 0;
        this.clipBoard = false;
        this.clipboardUsers.length = 0;
        this.selectedAddContactsOption = 8;
        this.filePreview = false;
        this.selectedLegalBasisOptions = [];
        this.isValidLegalOptions = true;
    }

    /*removeCsv() {
        this.selectedAddContactsOption = 8;
        this.contacts.length = 0;
        this.model.contactListName = "";
        this.isValidContactName = false;
        this.customResponse = new CustomResponse();
        $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        $( "#file_preview" ).hide();
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 100px;' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 100px;' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 100px;' );
    }*/

    addRow( event ) {
        if(this.gdprStatus){
            if(this.legalBasisOptions.length>0){
                let filteredLegalBasisOptions = $.grep(this.legalBasisOptions, function(e){ return  event.legalBasis.indexOf(e.id)>-1 });
                let selectedLegalBasisOptionsArray = filteredLegalBasisOptions.map(function(a) {return a.name;});
                event.legalBasisString = selectedLegalBasisOptionsArray;
            }
            
        }
        this.newUsers.push( event );
        this.selectedAddContactsOption = 0;
        this.noOptionsClickError = false;
        $( "#sample_editable_1" ).show();
        $( "button#cancel_button" ).prop( 'disabled', false );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.marketoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.hubspotImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        this.addContactuser = new User();
        this.emailNotValid = false;
    }

    cancelRow( rowId: number ) {
        if ( rowId !== -1 ) {
            this.newUsers.splice( rowId, 1 );
        }
    }

    copyFromClipboard() {
        this.noOptionsClickError = false;
        this.disableOtherFuctionality = true;
        this.clipboardTextareaText = "";
        $( "button#cancel_button" ).prop( 'disabled', false );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        this.clipBoard = true;
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.marketoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.hubspotImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
         
        
    }

    googleContacts() {
        try {
            if ( this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality ) {
                this.noOptionsClickError = false;
                this.xtremandLogger.info( "addContactComponent googlecontacts() login:" );
                this.socialContact.firstName = '';
                this.socialContact.lastName = '';
                this.socialContact.emailId = '';
                this.socialContact.contactName = '';
                this.socialContact.showLogin = true;
                this.socialContact.jsonData = '';
                this.socialContact.statusCode = 0;
                this.socialContact.contactType = '';
                this.socialContact.alias = '';
                this.socialContact.socialNetwork = "GOOGLE";
                this.contactService.socialProviderName = 'google';
                this.xtremandLogger.info( "socialContacts" + this.socialContact.socialNetwork );
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
                    () => this.xtremandLogger.log( "AddContactsComponent() googleContacts() finished." )
                    );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent() googleContacts()." )
        }
    }

    getGoogleContactsUsers() {
        try {
            swal( {
                text: 'Retrieving contacts from google...! Please Wait...It\'s processing',
                allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
            });
            this.contactService.socialProviderName = 'google';
            this.socialContact.socialNetwork = "GOOGLE";
            var self = this;
            this.contactService.getGoogleContacts( this.socialContact )
                .subscribe(
                data => {
                    this.getGoogleConatacts = data;
                    swal.close();
                    if ( !this.getGoogleConatacts.contacts ) {
                        this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                    } else {
                        for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getGoogleConatacts.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
                                socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                                socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                                this.socialContactUsers.push( socialContact );
                            }
                            this.contactService.socialProviderName = "";
                            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                            $( "button#cancel_button" ).prop( 'disabled', false );
                           // $( "#Gfile_preview" ).show();
                            this.showFilePreview();
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.marketoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.hubspotImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                        }
                    }
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    this.selectedAddContactsOption = 4;
                    this.setPage( 1 );
                    this.socialContact.contacts = this.socialContactUsers;
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent googleContactsUsers()." )
        }
    }

    setPage( page: number ) {
        try {

            this.paginatedSelectedIds = [];

            if ( page < 1 || page > this.pager.totalPages ) {
                return;
            }

            if ( this.paginationType == "csvContacts" ) {
                this.pager = this.socialPagerService.getPager( this.contacts.length, page, this.pageSize );
                this.pagedItems = this.contacts.slice( this.pager.startIndex, this.pager.endIndex + 1 );
            } else {
                this.pager = this.socialPagerService.getPager( this.socialContactUsers.length, page, this.pageSize );
                this.pagedItems = this.socialContactUsers.slice( this.pager.startIndex, this.pager.endIndex + 1 );

                var contactIds1 = this.pagedItems.map( function( a ) { return a.id; });
                var items = $.grep( this.selectedContactListIds, function( element ) {
                    return $.inArray( element, contactIds1 ) !== -1;
                });
                if ( items.length == this.pager.pageSize || items.length == this.socialContactUsers.length || items.length == this.pagedItems.length ) {
                    this.isHeaderCheckBoxChecked = true;
                } else {
                    this.isHeaderCheckBoxChecked = false;
                }

                for ( let i = 0; i < items.length; i++ ) {
                    if ( items ) {
                        this.paginatedSelectedIds.push( items[i] );
                    }
                }
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent setPage()." )
        }

    }

    validateSocialContacts( socialUsers: any ) {
        let users = [];
        for ( let i = 0; i < socialUsers.length; i++ ) {
           if(socialUsers[i].emailId){
            if ( socialUsers[i].emailId !== null && this.validateEmailAddress( socialUsers[i].emailId ) ) {
                let email = socialUsers[i].emailId.toLowerCase();
                socialUsers[i].emailId = email;
                users.push( socialUsers[i] );
            }
           }else{
               if ( socialUsers[i].email !== null && this.validateEmailAddress( socialUsers[i].email ) ) {
                   let email = socialUsers[i].email.toLowerCase();
                   socialUsers[i].emailId = email;
                   users.push( socialUsers[i] );
               }
           }
        }
        return users;
    }

    saveGoogleContacts() {
        try {
            this.socialContact.socialNetwork = "GOOGLE";
            this.socialContact.contactName = this.model.contactListName;
            this.socialContact.isPartnerUserList = this.isPartner;
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            this.socialContact.contactType = "CONTACT";
            this.socialContact.contacts = this.validateSocialContacts( this.socialContactUsers );
            // this.socialContact.contacts = this.socialContactUsers;
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
                if ( this.socialContactUsers.length > 0 ) {
                    
                    this.askForPermission('googleContacts');
                    
                    
                } else
                    this.xtremandLogger.error( "AddContactComponent saveGoogleContacts() Contacts Null Error" );
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveGoogleContacts() ContactListName Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent SaveGoogleContacts()." )
        }
    }
    
    saveGoogleContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.socialContact.contacts);
        this.contactService.saveSocialContactList( this.socialContact )
        .subscribe(
        data => {
            data = data;
            this.selectedAddContactsOption = 8;
            this.loading = false;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
        },
        ( error: any ) => {
            this.loading = false;
            if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
            } else {
                this.xtremandLogger.errorPage( error );
            }
            this.xtremandLogger.error( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
        )
    }
    

    saveGoogleContactSelectedUsers() {
        try {
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            this.xtremandLogger.info( "SelectedUserIDs:" + this.allselectedUsers );
            this.allselectedUsers = this.validateSocialContacts( this.allselectedUsers );
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0 ) {
                this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.allselectedUsers ) );
                this.contactListObject = new ContactList;
                this.contactListObject.name = this.model.contactListName;
                this.contactListObject.isPartnerUserList = this.isPartner;
                
                this.askForPermission('googleSelectedContacts');
                
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveGoogleContactSelectedUsers() ContactListName Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent savingGoogleSelectedUsers()." )
        }
    }
    
    saveGoogleSelectedContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.allselectedUsers);
        this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
            this.contactService.successMessage = true;
        },
        ( error: any ) => {
            this.loading = false;
            if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
            } else {
                this.xtremandLogger.errorPage( error );
            }
            this.xtremandLogger.error( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
        )
    }

    checkAll( ev: any ) {
        if ( this.selectedAddContactsOption != 6 && this.selectedAddContactsOption != 9) {
            if ( ev.target.checked ) {
                console.log( "checked" );
                $( '[name="campaignContact[]"]' ).prop( 'checked', true );
                let self = this;
                $( '[name="campaignContact[]"]:checked' ).each( function() {
                    var id = $( this ).val();
                    self.selectedContactListIds.push( parseInt( id ) );
                    self.paginatedSelectedIds.push( parseInt( id ) );

                    console.log( self.selectedContactListIds );
                    $( '#ContactListTable_' + id ).addClass( 'contact-list-selected' );
                    for ( var i = 0; i < self.pagedItems.length; i++ ) {
                        var object = {
                            "firstName": self.pagedItems[i].firstName,
                            "lastName": self.pagedItems[i].lastName,
                        }
                        
                        if(self.pagedItems[i].email){
                            object['emailId'] = self.pagedItems[i].email;
                        }else{
                            object['emailId'] = self.pagedItems[i].emailId;
                        }
                        
                        console.log( object );
                        self.allselectedUsers.push( object );
                    }
                });
                this.allselectedUsers = this.removeDuplicates( this.allselectedUsers, 'emailId' );
                this.selectedContactListIds = this.referenceService.removeDuplicates( this.selectedContactListIds );
                this.paginatedSelectedIds = this.referenceService.removeDuplicates( this.paginatedSelectedIds );
            } else {
                $( '[name="campaignContact[]"]' ).prop( 'checked', false );
                $( '#user_list_tb tr' ).removeClass( "contact-list-selected" );
                if ( this.pager.maxResults == this.pager.totalItems ) {
                    this.selectedContactListIds = [];
                    this.paginatedSelectedIds = [];
                    this.allselectedUsers.length = 0;
                } else {
                    this.paginatedSelectedIds = [];
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
        else {
            this.checkAllForMarketo( ev );
        }
    }

    highlightRow( contactId: number, email: any, userEmail: any, firstName: any, lastName: any, event: any ) {
        let isChecked = $( '#' + contactId ).is( ':checked' );
        console.log( this.selectedContactListIds )
        if ( isChecked ) {
            $( '#row_' + contactId ).addClass( 'contact-list-selected' );
            this.selectedContactListIds.push( contactId );
            this.paginatedSelectedIds.push( contactId );
            var object = {
                    "firstName": firstName,
                    "lastName": lastName,
                }
            if(userEmail){
                object['emailId'] = userEmail;
            }else{
                object['emailId'] = email;
            }
            
            this.allselectedUsers.push( object );
            console.log( this.allselectedUsers );
        } else {
            $( '#row_' + contactId ).removeClass( 'contact-list-selected' );
            this.selectedContactListIds.splice( $.inArray( contactId, this.selectedContactListIds ), 1 );
            this.paginatedSelectedIds.splice( $.inArray( contactId, this.paginatedSelectedIds ), 1 );
            this.allselectedUsers.splice( $.inArray( contactId, this.allselectedUsers ), 1 );
        }
        if ( this.paginatedSelectedIds.length == this.pagedItems.length ) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
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

    zohoContacts() {
        try {
            this.noOptionsClickError = false;
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
            this.xtremandLogger.error( error, "AddContactsComponent zohoContacts()." )
        }
    }

    hideZohoModal() {
        $( "#zohoShowLoginPopup" ).hide();
    }

    checkingZohoContactsAuthentication() {
        try {
            if ( this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality ) {
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
                                this.customResponse = new CustomResponse( 'ERROR', 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account', true );
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
            this.xtremandLogger.error( error, "AddContactsComponent zohoContactsAuthenticationChecking()." )
        }
    }

    getZohoContacts( contactType: any, username: string, password: string ) {
        try {
            this.socialContact.socialNetwork = "";
            var self = this;
            this.contactService.getZohoContacts( this.userName, this.password, this.contactType )
                .subscribe(
                data => {
                    this.getZohoConatacts = data;
                    this.zohoImageBlur = false;
                    this.zohoImageNormal = true;
                    this.socialContactImage();
                    this.hideZohoModal();
                    if ( this.getZohoConatacts.contacts ) {
                        this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                    } else {
                        for ( var i = 0; i < this.getZohoConatacts.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getZohoConatacts.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getZohoConatacts.contacts[i].emailId.trim();
                                socialContact.firstName = this.getZohoConatacts.contacts[i].firstName;
                                socialContact.lastName = this.getZohoConatacts.contacts[i].lastName;
                                this.socialContactUsers.push( socialContact );
                            }
                            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                            $( "button#cancel_button" ).prop( 'disabled', false );
                           // $( "#Gfile_preview" ).show();
                            this.showFilePreview();
                            $( "#myModal .close" ).click()
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                        }
                    }
                    this.xtremandLogger.info( this.getZohoConatacts );
                    this.selectedAddContactsOption = 5;
                    this.setPage( 1 );
                },
                ( error: any ) => {
                    var body = error['_body'];
                    if ( body != "" ) {
                        var response = JSON.parse( body );
                        if ( response.message == "Username or password is incorrect" ) {
                            this.zohoCredentialError = 'Username or password is incorrect';
                            /*setTimeout(() => {
                                this.zohoCredentialError = '';
                            }, 5000 )*/
                        }
                        if ( response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!" ) {
                            this.zohoCredentialError = 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!';
                            /*setTimeout(() => {
                                this.zohoCredentialError = '';
                            }, 5000 )*/
                        } else {
                        }
                    } else {
                        this.xtremandLogger.errorPage( error );
                    }
                    console.log( "errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error )

                },
                () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getZohoConatacts.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent GettingZohoContacts()." )
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
            this.loading = true;
            this.socialContact.socialNetwork = "ZOHO";
            this.socialContact.contactType = self.contactType;
            this.hideZohoAuthorisedPopup();
            this.loading = true;
            this.contactService.getZohoAutherizedContacts( this.socialContact )
                .subscribe(
                data => {
                    this.getZohoConatacts = data;
                    this.loading = false;
                    this.selectedAddContactsOption = 5;
                    if ( !this.getZohoConatacts.contacts ) {
                        this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                    } else {
                        for ( var i = 0; i < this.getZohoConatacts.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getZohoConatacts.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getZohoConatacts.contacts[i].emailId.trim();
                                socialContact.firstName = this.getZohoConatacts.contacts[i].firstName;
                                socialContact.lastName = this.getZohoConatacts.contacts[i].lastName;
                                this.socialContactUsers.push( socialContact );
                            }
                            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                            //$( "#Gfile_preview" ).show();
                            this.showFilePreview();
                            $( "#myModal .close" ).click()
                            $( "button#cancel_button" ).prop( 'disabled', false );
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                        }
                    }
                    this.xtremandLogger.info( this.getZohoConatacts );
                    this.setPage( 1 );
                },
                ( error: any ) => {
                    this.loading = false;
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getZohoConatacts.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent GettingZohoContacts()." )
        }
    }

    saveZohoContacts() {
        try {
            this.socialContact.socialNetwork = "ZOHO";
            this.socialContact.contactName = this.model.contactListName;
            this.socialContact.isPartnerUserList = this.isPartner;
            this.socialContact.contactType = this.contactType;
            this.socialContact.contacts = this.socialContactUsers;
            this.socialContact.contacts = this.validateSocialContacts( this.socialContactUsers );
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
               
                if ( this.socialContactUsers.length > 0 ) {
                    
                    this.askForPermission('zohoContacts');
                    
                } else
                    this.xtremandLogger.error( "AddContactComponent saveZohoContacts() Contacts Null Error" );
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveZohoContacts() ContactList Name Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent SaveZohoContacts()." )
        }
    }
    
    saveZohoContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.socialContact.contacts);
        this.contactService.saveSocialContactList( this.socialContact )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
        },

        ( error: any ) => {
            this.loading = false;
            if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
            } else {
                this.xtremandLogger.errorPage( error );
            }
            this.xtremandLogger.error( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveZohoContact() finished" )
        )
    }

    saveZohoContactSelectedUsers() {
        try {
            this.xtremandLogger.info( "SelectedUserIDs:" + this.allselectedUsers );
            this.allselectedUsers = this.validateSocialContacts( this.allselectedUsers );
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0 ) {
                this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.allselectedUsers ) );

                this.contactListObject = new ContactList;
                this.contactListObject.name = this.model.contactListName;
                this.contactListObject.isPartnerUserList = this.isPartner;
                
                this.askForPermission('zohoSelectedContacts');
               
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveZohoContactSelectedUsers() ContactList Name Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent SaveSelectedZohoContacts()." )
        }
    }
    
    saveZohoSelectedContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.allselectedUsers);
        this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
            this.contactService.successMessage = true;
        },

        ( error: any ) => {
            this.loading = false;
            if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
            } else {
                this.xtremandLogger.errorPage( error );
            }
            this.xtremandLogger.error( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveZohoContactUsers() finished" )
        )
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
                        } else {
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
            this.xtremandLogger.error( error, "AddContactsComponent SalesforceContactsDropdown()." )
        }
    }

    showModal() {
        $( '#ContactSalesForceModal' ).modal( 'show' );
        /* $( '#salesforceModal' ).appendTo( "body" ).modal( 'show' );
        $( '#salesforceModal' ).modal( 'show' );
        $('#salesforceModal').modal('toggle');
        $("#salesforceModal").modal();*/
    }

    hideModal() {
        $( '#ContactSalesForceModal' ).modal( 'hide' );
        /*$( '#salesforceModal' ).modal( 'hide' );
        $( 'body' ).removeClass( 'modal-open' );
        $( '.modal-backdrop fade in' ).remove();
        $( '#salesforceModal' ).appendTo( "body" ).modal( 'hide' );
        $( '#overlay-modal' ).hide();*/

    }

    salesforceContacts() {
        try {
            if ( this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality ) {
                this.contactType = "";
                this.noOptionsClickError = false;
                this.socialContact.socialNetwork = "salesforce";
                this.xtremandLogger.info( "socialContacts" + this.socialContact.socialNetwork );
                this.contactService.salesforceLogin( this.isPartner )
                    .subscribe(
                    data => {
                        this.storeLogin = data;
                        console.log( data );
                        if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
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
            this.xtremandLogger.error( error, "AddContactsComponent SalesforceContacts()." )
        }
    }
    checkingPopupValues() {
        if ( this.contactType != "" ) {
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
            this.socialContact.firstName = '';
            this.socialContact.lastName = '';
            this.socialContact.emailId = '';
            this.socialContact.contactName = '';
            this.socialContact.showLogin = true;
            this.socialContact.jsonData = '';
            this.socialContact.statusCode = 0;
            this.socialContact.contactType = '';
            this.socialContact.alias = '';
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
                    this.getSalesforceConatactList = data;
                    this.selectedAddContactsOption = 3;
                    if ( !this.getSalesforceConatactList.contacts ) {
                        if ( this.getSalesforceConatactList.jsonData.includes( "API_DISABLED_FOR_ORG" ) ) {
                            this.customResponse = new CustomResponse( 'ERROR', "Salesforce REST API is not enabled, Please change your Salesforce platform settings.", true );
                        } else {
                            this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                        }
                        this.selectedAddContactsOption = 8;
                        this.hideModal();
                    } else {
                        for ( var i = 0; i < this.getSalesforceConatactList.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getSalesforceConatactList.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getSalesforceConatactList.contacts[i].emailId.trim();
                                socialContact.firstName = this.getSalesforceConatactList.contacts[i].firstName;
                                socialContact.lastName = this.getSalesforceConatactList.contacts[i].lastName;
                                this.socialContactUsers.push( socialContact );
                            }
                            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                          //  $( "#Gfile_preview" ).show();
                            this.showFilePreview();
                            $( "button#cancel_button" ).prop( 'disabled', false );
                            this.hideModal();
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.marketoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.hubspotImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                        }
                    }
                    this.xtremandLogger.info( this.getSalesforceConatactList );
                    this.setPage( 1 );
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                },
                () => this.xtremandLogger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getSalesforceConatactList.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent GettingSalesforceContacts()." )
        }
    }

    getSalesforceListViewContacts( contactType: any ) {
        try {
            this.socialContact.firstName = '';
            this.socialContact.lastName = '';
            this.socialContact.emailId = '';
            this.socialContact.contactName = '';
            this.socialContact.showLogin = true;
            this.socialContact.jsonData = '';
            this.socialContact.statusCode = 0;
            this.socialContact.contactType = '';
            this.socialContact.alias = '';
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
                    this.getSalesforceConatactList = data;
                    this.selectedAddContactsOption = 3;
                    if ( !this.getSalesforceConatactList.contacts ) {
                        if ( this.getSalesforceConatactList.jsonData.includes( "API_DISABLED_FOR_ORG" ) ) {
                            this.customResponse = new CustomResponse( 'ERROR', "Salesforce REST API is not enabled, Please change your Salesforce platform settings.", true );
                        } else {
                            this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
                        }
                        this.selectedAddContactsOption = 8;
                        this.hideModal();
                    } else {
                        for ( var i = 0; i < this.getSalesforceConatactList.contacts.length; i++ ) {
                            let socialContact = new SocialContact();
                            let user = new User();
                            socialContact.id = i;
                            if ( this.validateEmailAddress( this.getSalesforceConatactList.contacts[i].emailId ) ) {
                                socialContact.emailId = this.getSalesforceConatactList.contacts[i].emailId.trim();
                                socialContact.firstName = this.getSalesforceConatactList.contacts[i].firstName;
                                socialContact.lastName = this.getSalesforceConatactList.contacts[i].lastName;
                                this.socialContactUsers.push( socialContact );
                            }
                            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                           // $( "#Gfile_preview" ).show();
                            this.showFilePreview();
                            $( "button#cancel_button" ).prop( 'disabled', false );
                            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            this.hideModal();
                            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '.marketoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.hubspotImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                        }
                    }
                    this.xtremandLogger.info( this.getSalesforceConatactList );
                    this.setPage( 1 );
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                },
                () => this.xtremandLogger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getSalesforceConatactList.contacts ) )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent gettingSalesforceListViewContacts()." )
        }
    }

    saveSalesforceContactSelectedUsers() {
        try {
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            this.xtremandLogger.info( "SelectedUserIDs:" + this.allselectedUsers );
            this.allselectedUsers = this.validateSocialContacts( this.allselectedUsers );
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0 ) {
                this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.allselectedUsers ) );
                this.contactListObject = new ContactList;
                this.contactListObject.name = this.model.contactListName;
                this.contactListObject.isPartnerUserList = this.isPartner;
                
                this.askForPermission('salesforceSelectedContacts');
                
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveSalesforceContactSelectedUsers() ContactList Name Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent SaveSalesforceSelectedContacts()." )
        }
    }
    
    saveSalesForceSelectedContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.allselectedUsers);
        this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
        .subscribe(
        data => {
            this.loading = false;
            data = data;
            this.selectedAddContactsOption = 8;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
            this.contactService.successMessage = true;
        },
        ( error: any ) => {
            this.loading = false;
            if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
            } else {
                this.xtremandLogger.errorPage( error );
            }
            this.xtremandLogger.error( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveZohoContactUsers() finished" )
        )
    }

    saveSalesforceContacts() {
        try {
            this.socialContact.socialNetwork = "salesforce";
            this.socialContact.contactName = this.model.contactListName;
            this.socialContact.isPartnerUserList = this.isPartner;
            this.socialContact.contactType = this.contactType;
            this.socialContact.alias = this.salesforceListViewId;
            this.socialContact.contacts = this.socialContactUsers;
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            this.socialContact.contacts = this.validateSocialContacts( this.socialContactUsers );
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
                if ( this.socialContactUsers.length > 0 ) {
                   
                    this.askForPermission('salesForceContacts');
                   
                } else
                    this.xtremandLogger.error( "AddContactComponent saveSalesforceContacts() Contacts Null Error" );
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveSalesforceContacts() ContactList Name Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent SalesforceContacts()." )
        }
    }
    
    saveSalesForceContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.socialContact.contacts);
        this.contactService.saveSocialContactList( this.socialContact )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
            this.contactService.successMessage = true;
        },
        ( error: any ) => {
            this.loading = false;
            if ( error._body.includes( "email addresses in your contact list that aren't formatted properly" ) ) {
                this.customResponse = new CustomResponse( 'ERROR', JSON.parse( error._body ).message, true );
            } else {
                this.xtremandLogger.errorPage( error );
            }
            this.xtremandLogger.error( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveSalesforceContacts() finished" )
        )
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
                    if ( this.storeLogin.MARKETO == true ) {
                        this.marketoImageNormal = true;
                    } else {
                        this.marketoImageBlur = true;
                    }
                    if ( this.storeLogin.HUBSPOT == true ) {
                        this.hubspotImageNormal = true;
                    } else {
                        this.hubspotImageBlur = true;
                    }

                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.log( "AddContactsComponent socialContactImage() finished." )
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "addContactComponent", "social Partners images" );
        }
    }

    loadContactListsNames() {
        try {
            this.contactService.loadContactListsNames()
                .subscribe(
                ( data: any ) => {
                    this.xtremandLogger.info( data );
                    this.contactLists = data.listOfUserLists;
                    for ( let i = 0; i < data.names.length; i++ ) {
                        this.names.push( data.names[i].replace( /\s/g, '' ) );
                    }
                },
                ( error: any ) => {
                    this.xtremandLogger.error( error );
                    this.xtremandLogger.errorPage( error );
                },
                () => this.xtremandLogger.info( "Add contact component loadContactListsName() finished" )
                )
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent gettinAllContactListNames()." )
        }
    }

    unlinkSocailAccount() {
        try {
            let socialNetwork = this.settingSocialNetwork.toUpperCase();
            console.log( "CheckBoXValueUNlink" + this.isUnLinkSocialNetwork );
            this.contactService.unlinkSocailAccount( socialNetwork, this.isUnLinkSocialNetwork )
                .subscribe(
                ( data: any ) => {
                    if ( socialNetwork === 'SALESFORCE' ) {
                        $( "#salesforceContact_buttonNormal" ).hide();
                        $( "#salesforceGear" ).hide();
                        this.sfImageBlur = true;
                        this.socialContactImage();
                    }
                    else if ( socialNetwork === 'GOOGLE' ) {
                        $( "#googleContact_buttonNormal" ).hide();
                        $( "#GoogleGear" ).hide();
                        this.googleImageBlur = true;
                    }
                    else if ( socialNetwork == 'ZOHO' ) {
                        $( "#zohoContact_buttonNormal" ).hide();
                        $( "#zohoGear" ).hide();
                        this.zohoImageBlur = true;
                    }
                    this.customResponse = new CustomResponse( 'SUCCESS', this.properties.SOCIAL_ACCOUNT_REMOVED_SUCCESS, true );
                    $( '#settingSocialNetwork' ).modal( 'hide' );
                },
                ( error: any ) => {
                    if ( error.search( 'Please Launch or Delete those campaigns first' ) != -1 ) {
                        this.customResponse = new CustomResponse( 'ERROR', error, true );
                        $( '#settingSocialNetwork' ).modal( 'hide' );

                        /*setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );*/
                    } else {
                        this.xtremandLogger.errorPage( error );
                    }
                    console.log( error );
                },
                () => {
                    $( '#settingSocialNetwork' ).modal( 'hide' );
                    this.cancelContacts();
                    this.xtremandLogger.info( "deleted completed" );
                }
                );
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent unlinkSocialContacts()." )
        }
    }

    convertToLowerCase( text: string ) {
        return text.toLowerCase();
    }

    settingSocialNetworkOpenModal( socialNetwork: string ) {
        this.settingSocialNetwork = socialNetwork;
        // $( '#settingSocialNetwork' ).appendTo( "body" ).modal( 'show' );
        $( '#settingSocialNetwork' ).modal( 'show' );
    }

    addContactModalOpen() {
        this.contactService.isContactModalPopup = true;
    }

    addContactModalClose() {
        this.contactService.isContactModalPopup = false;
    }

    selectedPageNumber( event ) {
        this.pageNumber.value = event;
        if ( event === 0 ) { event = this.socialContactUsers.length; }
        this.pageSize = event;
        this.setPage( 1 );
    }

    ngOnInit() {
        try {
            this.socialContactImage();
            this.hideModal();
            this.loadContactListsNames();
            if ( this.contactService.socialProviderName == 'google' ) {
                this.getGoogleContactsUsers();
                this.contactService.socialProviderName = "nothing";
            } else if ( this.contactService.socialProviderName == 'salesforce' ) {
                /* $( "#salesforceModal" ).modal();*/
                this.showModal();
                this.contactService.socialProviderName = "nothing";
            }

            this.contactListName = '';
            $( "#Gfile_preview" ).hide();
            $( "#popupForListviews" ).hide();

            $( "#sample_editable_1" ).hide();
            $( "#file_preview" ).hide();
            $( "#google contacts file_preview" ).hide();
            $( "#clipBoardValidationMessage" ).hide();
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( "button#cancel_button" ).prop( 'disabled', true );
            if ( this.socialContactType == "google" ) {
                this.getGoogleContactsUsers();
            }
            /********Check Gdpr Settings******************/
            this.checkTermsAndConditionStatus();
            this.getLegalBasisOptions();
        }
        catch ( error ) {
            this.xtremandLogger.error( "addContacts.component error " + error );
        }

    }
    
    checkTermsAndConditionStatus(){
        if (this.companyId>0){
            this.loading = true;
            this.userService.getGdprSettingByCompanyId(this.companyId)
                .subscribe(
                    response => {
                        if (response.statusCode == 200) {
                            this.gdprSetting = response.data;
                            this.gdprStatus = this.gdprSetting.gdprStatus;
                            this.termsAndConditionStatus = this.gdprSetting.termsAndConditionStatus;
                        } 
                        this.parentInput['termsAndConditionStatus'] = this.termsAndConditionStatus;
                        this.parentInput['gdprStatus'] = this.gdprStatus;
                    },
                    (error: any) => {
                        this.loading = false;
                    },
                    () => this.xtremandLogger.info('Finished getGdprSettings()')
                );
        }
        
    }
    
    getLegalBasisOptions(){
        if (this.companyId>0){
            this.fields = { text: 'name', value: 'id' };
            this.loading = true;
            this.referenceService.getLegalBasisOptions(this.companyId)
            .subscribe(
                data => {
                    this.legalBasisOptions = data.data;
                    console.log(this.legalBasisOptions);
                    this.parentInput['legalBasisOptions'] = this.legalBasisOptions;
                    this.loading = false;
                },
                (error: any) => {
                   this.loading = false;
                },
                () => this.xtremandLogger.info('Finished getLegalBasisOptions()')
            );
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

    downloadEmptyCsv() {
        window.location.href = this.authenticationService.MEDIA_URL + "UPLOAD_USER_LIST _EMPTY.csv";
    }

    ngOnDestroy() {
        this.contactService.successMessage = false;
        this.contactService.socialProviderName = "";
        this.hideModal();
        this.hideZohoModal();
        this.contactService.isContactModalPopup = false;
        swal.close();
        $( '#settingSocialNetwork' ).modal( 'hide' );

        if ( this.selectedAddContactsOption != 8 && this.router.url !== '/login' && !this.isDuplicateEmailId ) {
            this.model.contactListName = "";

            let self = this;

            swal( {
                title: 'Are you sure?',
                text: "You have unsaved data",
                type: 'warning',
                input: 'text',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: "No",
                allowOutsideClick: false,
                preConfirm: function( name: any ) {
                    return new Promise( function() {
                        console.log( 'logic begins' );
                        var inputName = name.toLowerCase().replace( /\s/g, '' );
                        if ( $.inArray( inputName, self.names ) > -1 ) {
                            swal.showValidationError( 'This list name is already taken.' )
                        } else {
                            if ( name != "" && name.length < 250 ) {
                                swal.close();
                                self.isValidContactName = false;
                                self.model.contactListName = name;
                                self.saveContacts();
                            } else {
                                if ( name == "" ) {
                                    swal.showValidationError( 'List Name is Required..' )
                                }
                                else {
                                    swal.showValidationError( "You have exceeded 250 characters!" );
                                }
                            }
                        }
                    });
                }
            }).then( function( name: any ) {
                console.log( name );
            }, function( dismiss: any ) {
                if ( dismiss === 'No' ) {
                    self.selectedAddContactsOption = 8;
                }
            });
        }

    }


    /**
     * 
     * MARKETO
     */


    // Marketo Contacts
    marketoContacts() {
    }
    checkingMarketoContactsAuthentication() {

        try {
            if ( this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality ) {
                this.contactService.checkMarketoCredentials( this.authenticationService.getUserId() )
                    .subscribe(
                    ( data: any ) => {

                        if ( data.statusCode == 8000 ) {
                            this.showMarketoForm = false;

                            this.marketoAuthError = false;
                            this.loading = false;
                            this.retriveMarketoContacts();
                        }
                        else {


                            $( "#marketoShowLoginPopup" ).modal( 'show' );
                            this.marketoAuthError = false;
                            this.loading = false;

                        }
                        this.xtremandLogger.info( data );

                    },
                    ( error: any ) => {
                        var body = error['_body'];
                        if ( body != "" ) {
                            var response = JSON.parse( body );
                            if ( response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!" ) {
                                this.customResponse = new CustomResponse( 'ERROR', 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account', true );
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
            this.xtremandLogger.error( error, "AddContactsComponent zohoContactsAuthenticationChecking()." )
        }
    }
    
    validateMarketoContacts(socialUsers: any)   
    {   
        let users = []; 
        for (let i = 0; i < socialUsers.length; i++)    
        {   
            if (socialUsers[i].email !== null && this.validateEmailAddress(socialUsers[i].email))   
            {   
                let email = socialUsers[i].email.toLowerCase(); 
                socialUsers[i].email = email;   
                users.push(socialUsers[i]); 
            }   
        }   
        return users;   
    }
    
    saveMarketoContacts() {

        try {
           /* this.socialContact.socialNetwork = "MARKETO";
            this.socialContact.contactName = this.model.contactListName;
            this.socialContact.isPartnerUserList = this.isPartner;
            this.socialContact.contactType = "CONTACT";
            // this.socialContact.contacts = this.socialContactUsers;
*/            this.socialContact.contacts = this.validateMarketoContacts( this.socialContactUsers );
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            this.socialContact.listName = this.model.contactListName;
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
                if ( this.socialContactUsers.length > 0 ) {
                    //this.contactService.saveSocialContactList( this.socialContact )
                    
                    this.askForPermission('marketoContacts')
                   
                } else
                    this.xtremandLogger.error( "AddContactComponent saveMarketoContact() Contacts Null Error" );
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveMarketoContact() ContactList Name Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent saveMarketoContact()." )
        }
    }
    
    saveMarketoContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.socialContact.contacts);
        this.contactService.saveMarketoContactList( this.socialContact )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
        },

        ( error: any ) => {
            this.loading = false;
            this.xtremandLogger.error( error );
            this.xtremandLogger.errorPage( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveMarketoContact() finished" )
        )
    }
    
    saveMarketoContactSelectedUsers() {
        try {

            this.allselectedUsers = this.validateSocialContacts( this.allselectedUsers );
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );

            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0 ) {
                console.log( this.allselectedUsers );
               
               this.askForPermission('marketoSelectedContacts');
                
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveMarketoContactSelectedUsers() ContactList Name Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent saveMarketoContactSelectedUsers()." )
        }
    }
    
    saveMarketoSelectedContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.allselectedUsers);
        this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;

            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            if ( this.isPartner == false ) {
                this.router.navigateByUrl( '/home/contacts/manage' )
            } else {
                this.router.navigateByUrl( 'home/partners/manage' )
            }
        },

        ( error: any ) => {
            this.loading = false;
            this.xtremandLogger.error( error );
            this.xtremandLogger.errorPage( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveMarketoContactSelectedUsers() finished" )
        )
    }

    authorisedMarketoContacts() {
    }
    retriveMarketoContacts() {


        $( "#marketoShowLoginPopup" ).modal( 'hide' );
        this.contactService.getMarketoContacts( this.authenticationService.getUserId() ).subscribe( data => {
            this.marketoImageBlur = false;
            this.marketoImageNormal = true;
            this.getMarketoConatacts = data.data;


            // this.getMarketoConatacts = data.data;
            this.loadingMarketo = false;
            this.selectedAddContactsOption = 6;
            if ( this.getMarketoConatacts.length == 0 ) {
                this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
            } else {
                for ( var i = 0; i < this.getMarketoConatacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i; 
                    if ( this.validateEmailAddress( this.getMarketoConatacts[i].email ) ) {
                        socialContact.email = this.getMarketoConatacts[i].email;
                        socialContact.firstName = this.getMarketoConatacts[i].firstName;
                        socialContact.lastName = this.getMarketoConatacts[i].lastName;

                        socialContact.country = this.getMarketoConatacts[i].country;
                        socialContact.city = this.getMarketoConatacts[i].city;
                        socialContact.state = this.getMarketoConatacts[i].state;
                        socialContact.postalCode = this.getMarketoConatacts[i].postalCode;
                        socialContact.address = this.getMarketoConatacts[i].address;
                        socialContact.company = this.getMarketoConatacts[i].company;
                        socialContact.title = this.getMarketoConatacts[i].title;
                        socialContact.mobilePhone = this.getMarketoConatacts[i].mobilePhone;
                        socialContact.mobileNumber = this.getMarketoConatacts[i].mobilePhone;
                        

                        this.socialContactUsers.push( socialContact );
                    }
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                   // $( "#Gfile_preview" ).show();
                    this.showFilePreview();
                    $( "#myModal .close" ).click()
                    $( "button#cancel_button" ).prop( 'disabled', false );
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.hubspotImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                }
                console.log( this.socialContactUsers );
            }
            this.xtremandLogger.info( this.getMarketoConatacts );
            this.setPage( 1 );
        },
            ( error: any ) => {
                this.loading = false;
                this.xtremandLogger.error( error );
                this.xtremandLogger.errorPage( error );
            },
            () => this.xtremandLogger.log( "marketoContacts data :" + JSON.stringify( this.getMarketoConatacts )


            ) );
    }
    hideMarketoAuthorisedPopup() {
        $( "#marketoShowAuthorisedPopup" ).hide();
    }

    getMarketoContacts() {
        this.loadingMarketo = true;
        const obj = {
            userId: this.authenticationService.getUserId(),
            instanceUrl: this.marketoInstance,
            clientId: this.marketoClientId,
            clientSecret: this.marketoSecretId
        }

        this.contactService.saveMarketoCredentials( obj ).subscribe( response => {
            if ( response.statusCode == 8003 ) {
                this.showMarketoForm = false;
                // this.checkMarketoCredentials();
                this.marketoContactError = false;
                this.marketoContactSuccessMsg = response.message;
                this.loadingMarketo = false;
                this.retriveMarketoContacts();
            } else {

                $( "#marketoShowLoginPopup" ).modal( 'show' );
                this.marketoContactError = response.message;
                this.marketoContactSuccessMsg = false;
                this.loadingMarketo = false;
            }
        }, ( error: any ) => {
                this.marketoContactError = error;
                this.loadingMarketo = false;
            }
        )
    }

    validateModelForm( fieldId: any ) {
        var errorClass = "form-group has-error has-feedback";
        var successClass = "form-group has-success has-feedback";

        if ( fieldId == 'client' ) {
            if ( this.marketoClientId.length > 0 ) {
                this.marketoClientIdClass = successClass;
                this.marketoClentIdError = false;
            } else {
                this.marketoClientIdClass = errorClass;
                this.marketoClentIdError = true;
            }
        } else if ( fieldId == 'secret' ) {
            if ( this.marketoSecretId.length > 0 ) {
                this.marketoSecretIdClass = successClass;
                this.marketoSecretIdError = false;
            } else {
                this.marketoSecretIdClass = errorClass;
                this.marketoSecretIdError = true;
            }
        } else if ( fieldId == 'instance' ) {
            if ( this.marketoInstance.length > 0 ) {
                this.marketoInstanceClass = successClass;
                this.marketoInstanceError = false;
            } else {
                this.marketoInstanceClass = errorClass;
                this.marketoInstanceError = false;
            }
        }
        this.toggleMarketoSubmitButtonState();
    }
    toggleMarketoSubmitButtonState() {
        if ( !this.marketoClentIdError && !this.marketoSecretIdError && !this.marketoInstanceError )
            this.isMarketoModelFormValid = true;
        else
            this.isMarketoModelFormValid = false;
    }

    hideMarketoModal() {
        $( "#marketoShowLoginPopup" ).hide();
    }


    highlightMarketoRow( user: any ) {
        let isChecked = $( '#' + user.id ).is( ':checked' );

        if ( isChecked ) {
            $( '#row_' + user.id ).addClass( 'contact-list-selected' );
            this.selectedContactListIds.push( user.id );
            this.paginatedSelectedIds.push( user.id );
            var object = {
                "id": user.id,
                "emailId": user.emailId,
                "email": user.email,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "country": user.country,
                "city": user.city,
                "state": user.state,
                "postalCode": user.postalCode,
                "zipCode": user.postalCode,
                "address": user.address,
                "company": user.company,
                "contactCompany": user.company,
                "title": user.title,
                "mobilePhone": user.mobilePhone,
                "mobileNumber": user.mobilePhone
            }
            this.allselectedUsers.push( object );
            console.log( this.allselectedUsers );
        } else {
            $( '#row_' + user.id ).removeClass( 'contact-list-selected' );
            this.selectedContactListIds.splice( $.inArray( user.id, this.selectedContactListIds ), 1 );
            this.paginatedSelectedIds.splice( $.inArray( user.id, this.paginatedSelectedIds ), 1 );
            this.allselectedUsers.splice( $.inArray( user.id, this.allselectedUsers ), 1 );
        }
        if ( this.paginatedSelectedIds.length == this.pagedItems.length ) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
    }

    checkAllForMarketo( ev: any ) {
        if ( ev.target.checked ) {
            console.log( "checked" );
            $( '[name="campaignContact[]"]' ).prop( 'checked', true );
            let self = this;
            $( '[name="campaignContact[]"]:checked' ).each( function() {
                var id = $( this ).val();
                self.selectedContactListIds.push( parseInt( id ) );
                self.paginatedSelectedIds.push( parseInt( id ) );
                console.log( self.selectedContactListIds );
                $( '#ContactListTable_' + id ).addClass( 'contact-list-selected' );
                for ( var i = 0; i < self.pagedItems.length; i++ ) {
                    var object = {

                        "id": self.pagedItems[i].id,
                        "emailId": self.pagedItems[i].emailId,
                        "email": self.pagedItems[i].email,
                        "firstName": self.pagedItems[i].firstName,
                        "lastName": self.pagedItems[i].lastName,
                        "country": self.pagedItems[i].country,
                        "city": self.pagedItems[i].city,
                        "state": self.pagedItems[i].state,
                        "postalCode": self.pagedItems[i].postalCode,
                        "zipCode": self.pagedItems[i].postalCode,
                        "address": self.pagedItems[i].address,
                        "company": self.pagedItems[i].company,
                        "contactCompany": self.pagedItems[i].company,
                        "title": self.pagedItems[i].title,
                        "mobilePhone": self.pagedItems[i].mobilePhone,
                        "mobileNumber": self.pagedItems[i].mobilePhone
                    }
                    console.log( object );
                    self.allselectedUsers.push( object );
                }
            });
            this.allselectedUsers = this.removeDuplicates( this.allselectedUsers, 'email' );
            this.selectedContactListIds = this.referenceService.removeDuplicates( this.selectedContactListIds );
            this.paginatedSelectedIds = this.referenceService.removeDuplicates( this.paginatedSelectedIds );
        } else {
            $( '[name="campaignContact[]"]' ).prop( 'checked', false );
            $( '#user_list_tb tr' ).removeClass( "contact-list-selected" );
            if ( this.pager.maxResults == this.pager.totalItems ) {
                this.selectedContactListIds = [];
                this.paginatedSelectedIds = [];
                this.allselectedUsers.length = 0;
            } else {
                this.paginatedSelectedIds = [];
                let paginationIdsArray = new Array;
                for ( let j = 0; j < this.pagedItems.length; j++ ) {
                    var paginationEmail = this.pagedItems[j].emailId;
                    this.allselectedUsers.splice( this.allselectedUsers.indexOf( paginationEmail ), 1 );
                }
                let currentPageContactIds = this.pagedItems.map( function( a ) { return a.id; });
                this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays( this.selectedContactListIds, currentPageContactIds );
            }
        }
        console.log( this.allselectedUsers );
        ev.stopPropagation();
    }

    // HubSpot Implementation 

    checkingHubSpotContactsAuthentication(){
       if(this.selectedAddContactsOption == 8){
         this.hubSpotService.configHubSpot().subscribe(data => {
            let response = data;
            if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
                this.xtremandLogger.info("isAuthorize true");
                this.showHubSpotModal();               
            }
            else{
                if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
                    window.location.href = response.data.redirectUrl;
                }                
            }            
        }, (error: any) => {
            this.xtremandLogger.error(error, "Error in HubSpot checkIntegrations()");
        }, () => this.xtremandLogger.log("HubSpot Configuration Checking done"));
       }
    }

    showHubSpotModal() {
        $( '#ContactHubSpotModal' ).modal( 'show' );
    }

    hideHubSpotModal() {
        $( '#ContactHubSpotModal' ).modal( 'hide' );
    }

    onChangeHubSpotDropdown( event: Event ) {
        try {
            this.contactType = event.target["value"];            
            this.socialNetwork = "hubspot";
            this.hubSpotContactListsData = [];
            if ( this.contactType == "DEFAULT" ) {
                $( "button#hubspot_save_button" ).prop( 'disabled', true );
            } else {
                $( "button#hubspot_save_button" ).prop( 'disabled', false );
            }

           
            if ( this.contactType === "lists") {
                $( "button#hubspot_save_button" ).prop( 'disabled', true );
                this.hubSpotService.getHubSpotContactsLists()
                    .subscribe(
                    data => {
                        let response = data.data;
                        if ( response.contacts.length > 0 ) {
                            for ( var i = 0; i < response.contacts.length; i++ ) {
                                this.hubSpotContactListsData.push( response.contacts[i] );
                                this.xtremandLogger.log( response.contacts[i] );
                            }
                        } else {
                            this.customResponse = new CustomResponse( 'ERROR', "No " + this.contactType + " found", true );
                            this.hideHubSpotModal();
                        }
                    },
                    ( error: any ) => {
                        this.xtremandLogger.error( error );
                        this.xtremandLogger.errorPage( error );
                    },
                    () => this.xtremandLogger.log( "onChangeHubSpotDropdown" )
                    );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent onChangeHubSpotDropdown()." )
        }
    }

    onChangeHubSpotListsDropdown( item: any ) {
        if ( event.target["value"] == "DEFAULT" ) {
            $( "button#hubspot_save_button" ).prop( 'disabled', true );
        } else {
            $( "button#hubspot_save_button" ).prop( 'disabled', false );
        }
        this.hubSpotSelectContactListOption = item;
        let selectedOptions = event.target['options'];
        let selectedIndex = selectedOptions.selectedIndex;
        this.hubSpotContactListName = selectedOptions[selectedIndex].text;
    }

    getHubSpotData(){
        $( "button#salesforce_save_button" ).prop( 'disabled', true );
        if(this.contactType === "contacts"){
            this.getHubSpotContacts();
            this.hubSpotContactListName= '';            
        }else if(this.contactType === "lists"){
            this.getHubSpotContactsListsById();
        }
    }

    getHubSpotContacts(){
        this.hubSpotService.getHubSpotContacts().subscribe(data => {
            let response = data.data;
            this.selectedAddContactsOption = 9
            this.frameHubSpotFilePreview(response);
        });
    }

    getHubSpotContactsListsById(){
        this.xtremandLogger.info("hubSpotSelectContactListOption :" +this.hubSpotSelectContactListOption);
        if(this.hubSpotSelectContactListOption !== undefined && this.hubSpotSelectContactListOption !== ''){
            this.hubSpotService.getHubSpotContactsListsById(this.hubSpotSelectContactListOption).subscribe(data =>{
                let response = data.data;
                this.selectedAddContactsOption = 9
                this.frameHubSpotFilePreview(response);
            });
        }       
    }

    frameHubSpotFilePreview(response:any){
        if ( !response.contacts ) {
            this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
        } else {
            this.socialContactUsers = [];
            this.model.contactListName= this.hubSpotContactListName;
            this.validateContactName( this.model.contactListName );
            for ( var i = 0; i < response.contacts.length; i++ ) {
                this.xtremandLogger.log("HubSpot Contact :" + response.contacts[i].firstName );
                let socialContact = new SocialContact();
                socialContact = response.contacts[i];
                socialContact.id = i;
                    if ( this.validateEmailAddress(response.contacts[i].email ) ) {
                        this.socialContactUsers.push( socialContact );
                    }
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    //$( "#Gfile_preview" ).show();
                    this.showFilePreview();
                    $( "button#cancel_button" ).prop( 'disabled', false );
                    this.hideHubSpotModal();
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.marketoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
            }
        }
            this.setPage( 1 );                
            this.selectedAddContactsOption = 9;
            this.socialContact.contacts = this.socialContactUsers;
            console.log("Social Contact Users for HubSpot::" + this.socialContactUsers);                  
    }

    saveHubSpotContacts() {
        try {
           this.socialContact.contacts = this.validateMarketoContacts( this.socialContactUsers );
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
            this.socialContact.listName = this.model.contactListName;
            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
                if ( this.socialContactUsers.length > 0 ) {
                    this.askForPermission('hubSpotContacts')                   
                } else
                    this.xtremandLogger.error( "AddContactComponent saveHubSpotContact() Contacts Null Error" );
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveHubSpotContact() ContactList Name Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent saveHubSpotContact()." )
        }
    }

    saveHubSpotContactSelectedUsers() {
        try {
            this.allselectedUsers = this.validateSocialContacts( this.allselectedUsers );
            this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );

            if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0 ) {         
               this.askForPermission('hubSpotSelectedContacts');                
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error( "AddContactComponent saveHubSpotContactSelectedUsers() ContactList Name Error" );
            }
        } catch ( error ) {
            this.xtremandLogger.error( error, "AddContactsComponent saveHubSpotContactSelectedUsers()." )
        }
    }

    saveHubSpotContactsWithPermission(){
        this.loading = true;
        this.socialContact.type = "hubspot";
        this.socialContact.userId = this.authenticationService.getUserId();
        this.socialContact.externalListId = this.hubSpotSelectContactListOption;
        this.setLegalBasisOptions(this.socialContact.contacts);
        this.hubSpotService.saveHubSpotContacts(this.socialContact)
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "Save Contacts ListUsers:" + data );
            this.router.navigateByUrl( '/home/contacts/manage' );
        },

        ( error: any ) => {
            this.loading = false;
            this.xtremandLogger.error( error );
            this.xtremandLogger.errorPage( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveHubSpotContactsWithPermission() finished" )
        )
    }

    saveHubSpotSelectedContactsWithPermission(){
        this.loading = true;
        this.setLegalBasisOptions(this.allselectedUsers);
        this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
        .subscribe(
        data => {
            data = data;
            this.loading = false;
            this.selectedAddContactsOption = 8;
            this.contactService.saveAsSuccessMessage = "add";
            this.xtremandLogger.info( "update Contacts ListUsers:" + data );
            this.router.navigateByUrl( '/home/contacts/manage')
        },

        ( error: any ) => {
            this.loading = false;
            this.xtremandLogger.error( error );
            this.xtremandLogger.errorPage( error );
        },
        () => this.xtremandLogger.info( "addcontactComponent saveHubSpotSelectedContactsWithPermission() finished" )
        )
    }
    
    showFilePreview(){
        $("#Gfile_preview" ).show();
        this.filePreview = true;
    }
    
    setLegalBasisOptions(input:any){
        if(this.gdprStatus){
            let self = this;
            $.each(input,function(index:number,contact:User){
                contact.legalBasis = self.selectedLegalBasisOptions;
             });
        }
    }
   
    
}
