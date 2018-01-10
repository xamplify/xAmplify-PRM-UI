import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { User } from '../../core/models/user';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { SocialContact } from '../models/social-contact';
import { Contacts } from '../models/contacts';
import { ZohoContact } from '../models/zoho-contact';
import { SalesforceContact } from '../models/salesforce-contact';
import { Pagination } from '../../core/models/pagination';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AddContactsOption } from '../models/contact-option';
import { SocialPagerService } from '../services/social-pager.service';
import { ReferenceService } from '../../core/services/reference.service';
declare var Metronic: any;
declare var Layout: any;
declare var Demo: any;
declare var swal: any;
declare var $: any;

@Component( {
    selector: 'app-add-contacts',
    templateUrl: './add-contacts.component.html',
    styleUrls: ['../../../assets/global/plugins/dropzone/css/dropzone.css',
        '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css',
        '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css',
        '../../../assets/css/form.css',
        '../../../assets/css/numbered-textarea.css'],
    providers: [SocialContact, ZohoContact, SalesforceContact, Pagination]
})
export class AddContactsComponent implements OnInit {
    
    settingSocialNetwork: string;
    addContactForm: FormGroup;
    emailRegEx:any = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    isUnLinkSocialNetwork: boolean = false;
    public contactLists: Array<ContactList>;
    contactListObject: ContactList;
    public clipBoard: boolean = false;
    public newUsers: Array<User>;
    addContactuser: User = new User();
    public googleUsers: Array<User>;
    public clipboardUsers: Array<User>;
    public googleContactUser: Array<User>;
    public clipboardTextareaText: string;
    selectedZohoDropDown: string = 'DEFAULT';
    googleCheckboxValue: boolean = false;
    zohoCredentialError = '';
    zohoAuthStorageError = '';
    model: any = {};
    names: string[] = [];
    deleteErrorMessage: boolean;
    Campaign: string;
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
    unlinkGoogleSuccessMessage: boolean = false;
    unlinkSalesforceSuccessMessage: boolean = false;
    unlinkZohoSuccessMessage: boolean = false;
    inValidCsvContacts: boolean;
    duplicateEmailIds: string[] = [];
    public gContactsValue: boolean;
    public zohoContactsValue: boolean;
    public salesforceContactsValue: boolean;
    public contactListNameError = false;
    public invalidPattenMail: boolean;
    public valilClipboardUsers: boolean = false;
    public validEmailPatternSuccess: boolean = true;
    public listViewName: string;
    public uploadvalue = true;
    public contactListName: string;
    public userName: string;
    public password: string;
    public contactType: string;
    public salesforceListViewId: string;
    public salesforceListViewName: string;
    public socialNetwork: string;
    dublicateEmailId: boolean = false;
    isContactsThere: boolean;
    fileTypeError: boolean;
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
    pager: any = {};
    pagedItems: any[];
    checkingForEmail:boolean;
    isPartner: boolean;
    checkingContactTypeName: string;
    selectedContactListIds = [];
    allselectedUsers = [];
    isHeaderCheckBoxChecked:boolean = false;
    totalRecords: number;
    

    AddContactsOption: typeof AddContactsOption = AddContactsOption;
    selectedAddContactsOption: number = 8;

    public uploader: FileUploader = new FileUploader( { allowedMimeType: ["application/csv", "application/vnd.ms-excel", "text/plain", "text/csv"] });
    contacts: User[];
    private socialContactType: string;
    emailNotValid: boolean;
    constructor( public socialPagerService: SocialPagerService, public referenceService: ReferenceService, private authenticationService: AuthenticationService, private contactService: ContactService,
        private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute,
        private router: Router, public pagination: Pagination, public xtremandLogger: XtremandLogger ) {
        
        this.addContactuser.country = (this.referenceService.countries[0]);
        let currentUrl = this.router.url;
        if(currentUrl.includes('home/contacts')){
            this.isPartner = false;
            this.checkingContactTypeName = "Contact"
        }else{
            this.isPartner = true;  
            this.checkingContactTypeName = "Partner"
        }
        
        this.contacts = new Array<User>();
        this.newUsers = new Array<User>();
        this.googleUsers = new Array<User>();
        this.clipboardUsers = new Array<User>();
        this.googleContactUser = new Array<User>();
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
            $( "#uploadContactsMessage" ).show();
            if(this.isPartner == false){
                this.router.navigateByUrl( '/home/contacts/manage' )
                }else{
                    this.router.navigateByUrl( 'home/partners/manage' )
                }
        };
    }

    validateContactName( contactName: string ) {
        this.noOptionsClickError = false;
        this.contactListNameError = false;
        let lowerCaseContactName = contactName.toLowerCase().replace( /\s/g, '' );
        var list = this.names;
        console.log( list );
        if ( $.inArray( lowerCaseContactName, list ) > -1 ) {
            this.isValidContactName = true;
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( ".ng-valid[required], .ng-valid.required" ).css( "color", "red" );
        } else {
            $( ".ng-valid[required], .ng-valid.required" ).css( "color", "Black" );
            this.isValidContactName = false;
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
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
            this.selectedAddContactsOption = 2;
            this.fileTypeError = false;
            this.noOptionsClickError = false;
            this.model.contactListName = outputstring;
            this.validateContactName( this.model.contactListName );
            this.removeCsvName = true;
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
                        self.contacts.push( user );
                    }
                }
                console.log( "AddContacts : readFiles() contacts " + JSON.stringify( self.contacts ) );
            }
        } else {
            this.fileTypeError = true;
            $( "#file_preview" ).hide();
            this.model.contactListName = null;
            this.removeCsvName = false;
            this.uploader.queue.length = 0;
            this.selectedAddContactsOption = 8;
        }
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
            this.clipboardUsers.length = 0;
            this.contacts.length = 0;
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
                this.clipboardUsers.push( user );
                self.contacts.push( user );
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
        var EMAIL_ID_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_ID_PATTERN.test( emailId );
    }
    validateName( name: string ) {
        return ( name.trim().length > 0 );
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

    saveContactList() {
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
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
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );

        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            this.xtremandLogger.info( this.newUsers[0].emailId.toLowerCase() );
            if ( this.newUsers[0].emailId != undefined ) {
                if ( !isDuplicate ) {
                    this.saveValidEmails();
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                } else {
                    this.dublicateEmailId = true;
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
        this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.newUsers ) );
        for ( var i = 0; i < this.newUsers.length; i++ ) {
            this.newUsers[i].emailId = this.convertToLowerCase( this.newUsers[i].emailId );
        }
        this.contactListObject = new ContactList;
        this.contactListObject.name = this.model.contactListName;
        this.contactListObject.isPartnerUserList = this.isPartner;
        this.contactService.saveContactList(this.newUsers, this.model.contactListName, this.isPartner)
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
            () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
            )
        this.dublicateEmailId = false;
    }

    saveClipBoardContactList() {
        this.clipboardShowPreview();
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
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

            if ( this.invalidPattenMail === true ) {
                $( "#clipBoardValidationMessage" ).append( "<h4 style='color:#f68a55;'>" + "Email Address is not valid" + "</h4>" );
                testArray.length = 0;
            }
            if ( this.valilClipboardUsers == true ) {
                if ( !isDuplicate ) {
                    this.saveClipboardValidEmails();
                } else {
                    this.dublicateEmailId = true;
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                }
            }
        }
    }

    saveClipboardValidEmails() {
        for ( var i = 0; i < this.clipboardUsers.length; i++ ) {
            this.clipboardUsers[i].emailId = this.convertToLowerCase( this.clipboardUsers[i].emailId );
        }
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        this.contactListObject = new ContactList;
        this.contactListObject.name = this.model.contactListName;
        this.contactListObject.isPartnerUserList = this.isPartner;
        if ( this.model.contactListName != ' ' ) {
            this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.clipboardUsers ) );
            this.contactService.saveContactList( this.clipboardUsers, this.model.contactListName, this.isPartner )
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
                () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
                )
            this.dublicateEmailId = false;
        }
    }

    saveCsvContactList() {
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
                if ( this.validCsvContacts == true ) {
                    for ( var i = 0; i < this.contacts.length; i++ ) {
                        this.contacts[i].emailId = this.convertToLowerCase( this.contacts[i].emailId );
                    }
                    this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.contacts ) );
                    this.contactListObject = new ContactList;
                    this.contactListObject.name = this.model.contactListName;
                    this.contactListObject.isPartnerUserList = this.isPartner;
                    this.contactService.saveContactList(this.contacts,this.model.contactListName, this.isPartner )
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
                        () => this.xtremandLogger.info( "addcontactComponent saveCsvContactList() finished" )
                        )
                } else {
                    this.inValidCsvContacts = true;
                }
            } else
                this.xtremandLogger.error( "AddContactComponent saveCsvContactList() Contacts Null Error" );
        }
        else {
            if ( this.isValidContactName == false ) {
                this.contactListNameError = true;
            }
            this.xtremandLogger.error( "AddContactComponent saveCsvContactList() ContactListName Error" );
        }
    }

    saveContacts() {
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

        if ( this.selectedAddContactsOption == 8 ) {
            this.noOptionsClickError = true;
        }
    }

    cancelContacts() {
        this.contactListNameError = false;
        this.noOptionsClickError = false;
        this.isValidContactName = false;
        this.emailNotValid = false;
        this.socialContactUsers.length = 0;
        this.allselectedUsers.length = 0;
        this.selectedContactListIds.length = 0;
        this.pager = [];
        this.pagedItems =[];
        
        this.contactService.successMessage = false;
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
        this.model.contactListName = "";
        $( "#sample_editable_1" ).hide();
        $( "#file_preview" ).hide();
        $( '#copyFromclipTextArea' ).val( '' );
        $( "#Gfile_preview" ).hide();
        this.newUsers.length = 0;
        this.dublicateEmailId = false;
        this.clipBoard = false;
        this.clipboardUsers.length = 0;
        this.selectedAddContactsOption = 8;
    }

    removeCsv() {
        this.selectedAddContactsOption = 8;
        this.fileTypeError = false;
        this.inValidCsvContacts = false;
        this.contacts.length = 0;
        this.model.contactListName = "";
        this.isValidContactName = false;
        $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        $( "#file_preview" ).hide();
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
    }
    
    addRow() {
       if(this.emailNotValid == true ){
        $( "#addContactModal .close" ).click()
        this.newUsers.push( this.addContactuser );
       }
        this.selectedAddContactsOption = 0;
        this.fileTypeError = false;
        this.noOptionsClickError = false;
        this.inValidCsvContacts = false;
        this.isContactsThere = false;
        $( "#sample_editable_1" ).show();
        $( "button#cancel_button" ).prop( 'disabled', false );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
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
        this.selectedAddContactsOption = 1;
        this.fileTypeError = false;
        this.noOptionsClickError = false;
        this.inValidCsvContacts = false;
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

    googleContacts() {
        this.fileTypeError = false;
        this.inValidCsvContacts = false;
        this.isContactsThere = false;
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
        this.contactService.googleCallBack = true;
        this.xtremandLogger.info( "socialContacts" + this.socialContact.socialNetwork );
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
                    this.xtremandLogger.errorMessage = 'authentication was not successful, you might have changed the password of social account or other reasons, please unlink your account and reconnect it.';
                }
                this.xtremandLogger.errorPage( error );
            },
            () => this.xtremandLogger.log( "AddContactsComponent googleContacts() finished." )
            );
    }

    getGoogleContactsUsers() {
        this.contactService.googleCallBack = false;
        this.socialContact.socialNetwork = "GOOGLE";
        var self = this;
        this.contactService.getGoogleContacts( this.socialContact )
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
                    this.socialContactUsers.push( socialContact );
                    this.xtremandLogger.info( this.getGoogleConatacts );
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "button#cancel_button" ).prop( 'disabled', false );
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
                this.selectedAddContactsOption = 4;
                this.setPage(1);
                this.socialContact.contacts = this.socialContactUsers;
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
                this.xtremandLogger.errorPage( error );
            },
            () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
            );
        this.isContactsThere = false;
    }
    
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        
        this.pager = this.socialPagerService.getPager(this.socialContactUsers.length, page);
        this.pagedItems = this.socialContactUsers.slice(this.pager.startIndex, this.pager.endIndex + 1);
        
        var contactIds1 = this.pagedItems.map(function(a) {return a.id;});
        var items = $.grep(this.selectedContactListIds, function(element) {
            return $.inArray(element, contactIds1 ) !== -1;
        });
        if(items.length == this.pager.pageSize || items.length == this.socialContactUsers.length || items.length == this.pagedItems.length){
            this.isHeaderCheckBoxChecked = true;
        }else{
            this.isHeaderCheckBoxChecked = false;
        }
        
    }
    
    saveGoogleContacts() {
        this.socialContact.socialNetwork = "GOOGLE";
        this.socialContact.contactName = this.model.contactListName;
        this.socialContact.isPartnerUserList = this.isPartner;
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        this.socialContact.contactType = "CONTACT";
        this.socialContact.contacts = this.socialContactUsers;
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            if ( this.socialContactUsers.length > 0 ) {
                this.contactService.saveSocialContactList( this.socialContact )
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
                    () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
                    )
            } else
                this.xtremandLogger.error( "AddContactComponent saveGoogleContacts() Contacts Null Error" );
        }
        else {
            this.contactListNameError = true;
            this.xtremandLogger.error( "AddContactComponent saveGoogleContacts() ContactListName Error" );
        }
    }

    saveGoogleContactSelectedUsers() {
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        this.xtremandLogger.info( "SelectedUserIDs:" + this.allselectedUsers );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0 ) {
            this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.allselectedUsers ) );
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
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
                () => this.xtremandLogger.info( "addcontactComponent saveacontact() finished" )
                )
        }
        else {
            this.contactListNameError = true;
            this.xtremandLogger.error( "AddContactComponent saveGoogleContactSelectedUsers() ContactListName Error" );
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
            if(this.pager.maxResults == this.pager.totalItems){
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

    zohoContacts() {
        this.fileTypeError = false;
        this.inValidCsvContacts = false;
        this.isContactsThere = false;
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
                if ( this.getZohoConatacts.contacts.length == 0 ) {
                    this.isContactsThere = true;
                }
                for ( var i = 0; i < this.getZohoConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getZohoConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getZohoConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getZohoConatacts.contacts[i].lastName;
                    this.socialContactUsers.push( socialContact );
                    this.xtremandLogger.info( this.getZohoConatacts );
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "button#cancel_button" ).prop( 'disabled', false );
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
                this.selectedAddContactsOption = 5;
                this.setPage(1);
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
            () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getZohoConatacts.contacts ) )
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

        this.socialContact.socialNetwork = "ZOHO";
        this.socialContact.contactType = self.contactType;
        this.contactService.getZohoAutherizedContacts( this.socialContact )
            .subscribe(
            data => {
                this.getZohoConatacts = data;
                this.hideZohoAuthorisedPopup();
                this.selectedAddContactsOption = 5;
                if ( this.getZohoConatacts.contacts.length == 0 ) {
                    this.isContactsThere = true;
                }
                for ( var i = 0; i < this.getZohoConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getZohoConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getZohoConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getZohoConatacts.contacts[i].lastName;
                    this.socialContactUsers.push( socialContact );
                    this.xtremandLogger.info( this.getZohoConatacts );
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "#Gfile_preview" ).show();
                    $( "#myModal .close" ).click()
                    $( "button#cancel_button" ).prop( 'disabled', false );
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -85px;left: 73px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                }
                this.setPage(1);
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
                this.xtremandLogger.errorPage( error );
            },
            () => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getZohoConatacts.contacts ) )
            );
        this.isContactsThere = false;
    }

    saveZohoContacts() {
        this.socialContact.socialNetwork = "ZOHO";
        this.socialContact.contactName = this.model.contactListName;
        this.socialContact.isPartnerUserList = this.isPartner;
        this.socialContact.contactType = this.contactType;
        this.socialContact.contacts = this.socialContactUsers;
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            if ( this.socialContactUsers.length > 0 ) {
                this.contactService.saveSocialContactList( this.socialContact )
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
                    () => this.xtremandLogger.info( "addcontactComponent saveZohoContact() finished" )
                    )
            } else
                this.xtremandLogger.error( "AddContactComponent saveZohoContacts() Contacts Null Error" );
        }
        else {
            this.contactListNameError = true;
            this.xtremandLogger.error( "AddContactComponent saveZohoContacts() ContactList Name Error" );
        }
    }

    saveZohoContactSelectedUsers() {
        this.xtremandLogger.info( "SelectedUserIDs:" + this.allselectedUsers );
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0 ) {
            this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.allselectedUsers ) );
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
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
                )
        }
        else {
            this.contactListNameError = true;
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
        this.noOptionsClickError = false;
        this.fileTypeError = false;
        this.inValidCsvContacts = false;
        this.socialContact.socialNetwork = "salesforce";
        this.xtremandLogger.info( "socialContacts" + this.socialContact.socialNetwork );
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
                if ( this.getSalesforceConatactList.contacts.length == 0 ) {
                    this.isContactsThere = true;
                    this.hideModal();
                }
                for ( var i = 0; i < this.getSalesforceConatactList.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getSalesforceConatactList.contacts[i].emailId;
                    socialContact.firstName = this.getSalesforceConatactList.contacts[i].firstName;
                    socialContact.lastName = this.getSalesforceConatactList.contacts[i].lastName;
                    this.socialContactUsers.push( socialContact );
                    this.xtremandLogger.info( this.getSalesforceConatactList );
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "#Gfile_preview" ).show();
                    $( "button#cancel_button" ).prop( 'disabled', false );
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
                this.setPage(1);
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
            },
            () => this.xtremandLogger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getSalesforceConatactList.contacts ) )
            );
        this.isContactsThere = false;
    }

    getSalesforceListViewContacts( contactType: any ) {
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
                if ( this.getSalesforceConatactList.contacts.length == 0 ) {
                    this.isContactsThere = true;
                    this.hideModal();
                }
                for ( var i = 0; i < this.getSalesforceConatactList.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getSalesforceConatactList.contacts[i].emailId;
                    socialContact.firstName = this.getSalesforceConatactList.contacts[i].firstName;
                    socialContact.lastName = this.getSalesforceConatactList.contacts[i].lastName;
                    this.socialContactUsers.push( socialContact );
                    this.xtremandLogger.info( this.getSalesforceConatactList );
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "#Gfile_preview" ).show();
                    $( "button#cancel_button" ).prop( 'disabled', false );
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
                this.setPage(1);
            },
            ( error: any ) => {
                this.xtremandLogger.error( error );
            },
            () => this.xtremandLogger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getSalesforceConatactList.contacts ) )
            );
        this.isContactsThere = false;
    }

    saveSalesforceContactSelectedUsers() {
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        this.xtremandLogger.info( "SelectedUserIDs:" + this.allselectedUsers );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0 ) {
            this.xtremandLogger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.allselectedUsers ) );
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            this.contactService.saveContactList( this.allselectedUsers, this.model.contactListName, this.isPartner )
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
                )
        }
        else {
            this.contactListNameError = true;
            this.xtremandLogger.error( "AddContactComponent saveSalesforceContactSelectedUsers() ContactList Name Error" );
        }
    }

    saveSalesforceContacts() {
        this.socialContact.socialNetwork = "salesforce";
        this.socialContact.contactName = this.model.contactListName;
        this.socialContact.isPartnerUserList = this.isPartner;
        this.socialContact.contactType = this.contactType;
        this.socialContact.alias = this.salesforceListViewId;
        this.socialContact.contacts = this.socialContactUsers;
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            if ( this.socialContactUsers.length > 0 ) {
                this.contactService.saveSocialContactList( this.socialContact )
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
                    )
            } else
                this.xtremandLogger.error( "AddContactComponent saveSalesforceContacts() Contacts Null Error" );
        }
        else {
            this.contactListNameError = true;
            this.xtremandLogger.error( "AddContactComponent saveSalesforceContacts() ContactList Name Error" );
        }
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

    loadContactListsNames() {
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
                this.cancelContacts();
                this.xtremandLogger.info( "deleted completed" );
            }
            );
        this.unlinkSalesforceSuccessMessage = false;
        this.unlinkGoogleSuccessMessage = false;
        this.unlinkZohoSuccessMessage = false;
        this.deleteErrorMessage = false;
    }

    convertToLowerCase( text: string ) {
        return text.toLowerCase();
    }

    settingSocialNetworkOpenModal( socialNetwork: string ) {
        this.settingSocialNetwork = socialNetwork;
        $( '#settingSocialNetwork' ).modal();
    }
    
    addContactModalOpen(){
        $( "#addContactModal" ).show();
        this.addContactuser.country = (this.referenceService.countries[0]);
    }
    
    addContactModalClose(){
        $('#addContactModal').modal('toggle');
        $( "#addContactModal .close" ).click()
    }

    ngOnInit() {
        this.socialContactImage();
        this.hideModal();
        this.gContactsValue = true;
        this.loadContactListsNames();
        if ( this.contactService.googleCallBack == true ) {
            this.getGoogleContactsUsers();
        } else if ( this.contactService.salesforceContactCallBack == true ) {
            $( "#salesforceModal" ).modal();
            this.contactService.salesforceContactCallBack = false;
        }

        this.contactListName = '';
        $( "#Gfile_preview" ).hide();
        $( "#popupForListviews" ).hide();
        this.gContactsValue = true;
        this.zohoContactsValue = true;
        this.salesforceContactsValue = true;
        try {
            //Metronic.init(); 
            //Layout.init(); 
            //Demo.init(); 
            $( "#uploadContactsMessage" ).hide();
            $( "#sample_editable_1" ).hide();
            $( "#file_preview" ).hide();
            $( "#google contacts file_preview" ).hide();
            $( "#clipBoardValidationMessage" ).hide();
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( "button#cancel_button" ).prop( 'disabled', true );
            if ( this.socialContactType == "google" ) {
                this.getGoogleContactsUsers();
            }
        }
        catch ( err ) {
            this.xtremandLogger.error( "addContacts.component error " + err );
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
    
    downloadEmptyCsv(){
        window.location.href = this.authenticationService.MEDIA_URL+"UPLOAD_USER_LIST _EMPTY.csv";
    }

    ngDestroy() {
        this.contactService.successMessage = false;
        this.contactService.googleCallBack = false;
        this.contactService.salesforceContactCallBack = false;
        this.hideModal();

    }
}
