import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { User } from '../../core/models/user';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { Logger } from "angular2-logger/core";
import { SocialContact } from '../models/social-contact';
import { Contacts } from '../models/contacts';
import { ZohoContact } from '../models/zoho-contact';
import { SalesforceContact } from '../models/salesforce-contact';
import { Pagination } from '../../core/models/pagination';

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
    settingSocialNetwork : string;
    isUnLinkSocialNetwork : boolean = false;
    public contactLists: Array<ContactList>;
    public clipBoard: boolean = false;
    public newUsers: Array<User>;
    public googleUsers: Array<User>;
    public clipboardUsers: Array<User>;
    public googleContactUser: Array<User>;
    public clipboardTextareaText: string;
    selectedZohoDropDown : string = 'DEFAULT';
    googleCheckboxValue: boolean = false;
    salesforceCheckboxValue: boolean = false;
    zohoCheckboxValue: boolean = false;
    zohoCredentialError = '';
    zohoAuthStorageError = '';
    model: any = {};
    names: string[] = [];
    deleteErrorMessage: boolean;
    Campaign : string;
    invalidPatternEmails: string[] = [];
    isValidContactName: boolean;
    validCsvContacts: boolean;
    googleImageBlur: boolean = false;
    googleImageNormal: boolean = false;
    sfImageBlur: boolean = false;
    sfImageNormal: boolean = false;
    zohoImageBlur: boolean = false;
    zohoImageNormal: boolean = false;
    noOptionsClickError: boolean = false;
    unlinkGoogleSuccessMessage : boolean = false;
    unlinkSalesforceSuccessMessage : boolean = false;
    unlinkZohoSuccessMessage : boolean = false;
    inValidCsvContacts: boolean;
    duplicateEmailIds: string[] = [];
    public gContactsValue: boolean;
    public zohoContactsValue: boolean;
    public salesforceContactsValue: boolean;
    public saveAddCotactsUsers = false;
    public saveClipBoardUsers = false;
    public saveCsvUsers = false;
    public saveGoogleContactUsers = false;
    public saveZohoContactUsers = false;
    public saveSalesforceContactUsers = false;
    public zohoImage: string;
    public googleImage: string;
    public salesforceImage: string;
    public contactListNameError = false;
    public invalidPattenMail: boolean;
    public valilClipboardUsers: boolean = false;
    public validEmailPatternSuccess: boolean = false;
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
    public gContacts: SocialContact[] = new Array();
    public zContacts: SocialContact[] = new Array();
    public salesforceContactUsers: SocialContact[] = new Array();
    public salesforceContactslist: SocialContact[] = new Array();
    public salesforceListViewsData: Array<any> = [];
    public uploader: FileUploader = new FileUploader( { allowedMimeType: ["application/csv", "application/vnd.ms-excel", "text/plain", "text/csv"] });
    contacts: User[];
    private socialContactType: string;
    emailNotValid = false;
    constructor( private authenticationService: AuthenticationService, private contactService: ContactService,
        private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute,
        private router: Router, private logger: Logger, private pagination: Pagination ) {
        this.contacts = new Array<User>();
        this.newUsers = new Array<User>();
        this.googleUsers = new Array<User>();
        this.clipboardUsers = new Array<User>();
        this.googleContactUser = new Array<User>();
        this.socialContact = new SocialContact();
        this.zohoContact = new ZohoContact();
        this.socialContact.socialNetwork = "GOOGLE";
        this.uploader.onAfterAddingFile = ( file ) => {
            file.withCredentials = false;
        };
        this.model.contactListName = '';
        this.userName = '';
        this.password = '';
        this.contactType = '';
        let self = this;
        this.uploader.onBuildItemForm = function( fileItem: any, form: FormData ) {
            this.logger.info( "addContacts.component onBuildItemForm" + self.model.contactListName );
            form.append( 'userListName', "" + self.model.contactListName );
            return { fileItem, form }
        };
        this.uploader.onCompleteItem = ( item: any, response: any, status: any, headers: any ) => {
            var responsePath = response;
            this.logger.info( "addContacts.component onCompleteItem:" + responsePath );// the url will be in the response
            $( "#uploadContactsMessage" ).show();
            router.navigateByUrl( '/home/contacts/manageContacts' )
        };
    }

    validateContactName( contactName: string ) {
        this.noOptionsClickError = false;
        this.contactListNameError = false;
        let lowerCaseContactName = contactName.toLowerCase().replace(/\s/g, '');
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
        this.logger.info( "selected check value" + event )
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
            this.fileTypeError = false;
            this.noOptionsClickError = false;
            this.model.contactListName = outputstring;
            this.validateContactName( this.model.contactListName );
            this.removeCsvName = true;
            $( "#file_preview" ).show();
            $( "button#uploadCSV" ).prop( 'disabled', true );
            $( "input[type='file']" ).attr( "disabled", true );
            this.saveCsvUsers = true;
            this.saveAddCotactsUsers = false;
            this.saveGoogleContactUsers = false;
            this.saveZohoContactUsers = false;
            this.saveClipBoardUsers = false;
            this.saveSalesforceContactUsers = false;
            this.logger.info( "coontacts preview" );
            //$( "#file_preview" ).show();
            $( "button#addContacts" ).prop( 'disabled', true );
            $( "button#copyFromClipBoard" ).prop( 'disabled', true );
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            $( "button#cancel_button" ).prop( 'disabled', true );
            $( "button#googleContact_button" ).prop( 'disabled', true );
            $( "button#salesforceContact_button" ).prop( 'disabled', true );
            $( "button#zohoContact_button" ).prop( 'disabled', true );
            $( "button#microsoftContact_button" ).prop( 'disabled', true );
            $( "button#googleContact_buttonNormal" ).prop( 'disabled', true );
            $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', true );
            $( "button#zohoContact_buttonNormal" ).prop( 'disabled', true );
            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );

            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px; left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
            let reader = new FileReader();
            reader.readAsText( files[0] );
            this.logger.info( files[0] );
            var lines = new Array();
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
                        self.contacts.push( user );
                    }
                }
                console.log( "AddContacts : readFiles() contacts " + JSON.stringify( self.contacts ) );
            }
        } else {
            this.fileTypeError = true;
            $( "#file_preview" ).hide();
            $( "button#copyFromClipBoard" ).prop( 'disabled', false );
            $( "button#addContacts" ).prop( 'disabled', false );
            $( "button#googleContact_button" ).prop( 'disabled', false );
            $( "button#salesforceContact_button" ).prop( 'disabled', false );
            $( "button#zohoContact_button" ).prop( 'disabled', false );
            $( "button#microsoftContact_button" ).prop( 'disabled', false );
            $( "button#uploadCSV" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            $( "button#googleContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#zohoContact_buttonNormal" ).prop( 'disabled', false );
            this.model.contactListName = null;
            this.removeCsvName = false;
            this.uploader.queue.length = 0;
        }
    }

    clipboardShowPreview() {
        var selectedDropDown = $( "select.opts:visible option:selected " ).val();
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
            this.contacts.length = 0;
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
        this.logger.info( this.clipboardUsers );
    }

    validateEmailAddress( emailId: string ) {
        var EMAIL_ID_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_ID_PATTERN.test( emailId );
    }
    validateName( name: string ) {
        return ( name.trim().length > 0 );
    }

    checkingEmailPattern( emailId: string ) {
        this.validEmailPatternSuccess = false;
        if ( this.validateEmailAddress( emailId ) ) {
            this.validEmailPatternSuccess = true;
            this.emailNotValid = false;
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
        } else {
            this.validEmailPatternSuccess = false;
            
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

    saveContactList( isValid: boolean ) {
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        var testArray = [];
        for ( var i = 0; i <= this.newUsers.length - 1; i++ ) {
            testArray.push( this.newUsers[i].emailId );
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
        var valueArr = this.newUsers.map( function( item ) { return item.emailId });
        var isDuplicate = valueArr.some( function( item, idx ) {
            return valueArr.indexOf( item ) != idx
        });
        console.log( "emailDuplicate" + isDuplicate );
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.validEmailPatternSuccess == true ) {
            this.logger.info( this.newUsers[0].emailId.toLowerCase() );
            if ( this.newUsers[0].emailId != undefined ) {
                if ( !isDuplicate ) {
                    this.saveValidEmails();
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                } else {
                    this.dublicateEmailId = true;
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                }
            } else {
                this.logger.error( "AddContactComponent saveContactList() ContactListName Error" ); }
            
        } else if(this.validEmailPatternSuccess === false){
            this.emailNotValid = true;
            this.contactListNameError = false;
            this.noOptionsClickError = false;
        }
        else {
            if(this.isValidContactName == false){
            this.contactListNameError = true;
            }
            this.logger.error( "AddContactComponent saveContactList() ContactListName Error" );
           }
         }

    saveValidEmails() {
        this.logger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.newUsers ) );
        for(var i=0; i< this.newUsers.length;i++){
            this.newUsers[i].emailId = this.convertToLowerCase(this.newUsers[i].emailId);
        }
        this.contactService.saveContactList( this.model.contactListName, this.newUsers )
            .subscribe(
            data => {
                data = data;
                this.logger.info( "update Contacts ListUsers:" + data );
                $( "#uploadContactsMessage" ).show();
                this.router.navigateByUrl( '/home/contacts/manageContacts' )
                this.contactService.successMessage = true;
            },

            error => this.logger.info( error ),
            () => this.logger.info( "addcontactComponent saveacontact() finished" )
            )
        this.dublicateEmailId = false;
    }

    saveClipBoardContactList( isclick: boolean ) {
        this.clipboardShowPreview();
        this.duplicateEmailIds = [];
        this.dublicateEmailId = false;
        var testArray = [];
        for ( var i = 0; i <= this.clipboardUsers.length - 1; i++ ) {
            testArray.push( this.clipboardUsers[i].emailId );
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
        this.logger.log( "DUPLICATE EMAILS" + this.duplicateEmailIds );
        $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        if ( this.model.contactListName.trim().length == 0 ) {
            $( "#clipBoardValidationMessage > h4" ).empty();
            $( "#clipBoardValidationMessage" ).append( "<h4 style='color:#f68a55;'>Please Enter the Contact List Name</h4>" );
        } else {
            var valueArr = this.clipboardUsers.map( function( item ) { return item.emailId });
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
            /*if ( !isDuplicate ) {
                this.saveClipboardValidEmails();
            } else {
                this.dublicateEmailId = true;
                $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            }*/
        }
    }

    saveClipboardValidEmails() {
        for(var i=0; i< this.clipboardUsers.length;i++){
            this.clipboardUsers[i].emailId = this.convertToLowerCase(this.clipboardUsers[i].emailId);
        }
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        if ( this.model.contactListName != ' ' ) {
            this.logger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.clipboardUsers ) );
            this.contactService.saveContactList( this.model.contactListName, this.clipboardUsers )
                .subscribe(
                data => {
                    data = data;
                    this.logger.info( "update Contacts ListUsers:" + data );
                    $( "#uploadContactsMessage" ).show();
                    this.router.navigateByUrl( '/home/contacts/manageContacts' )
                },

                error => this.logger.error( error ),
                () => this.logger.info( "addcontactComponent saveacontact() finished" )
                )
            this.dublicateEmailId = false;
        }
    }

    saveCsvContactList( isValid: boolean ) {
        this.invalidPatternEmails.length = 0;
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            if ( this.contacts.length > 0 ) {
                this.logger.info( isValid );
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
                    for(var i=0; i< this.contacts.length;i++){
                        this.contacts[i].emailId = this.convertToLowerCase(this.contacts[i].emailId);
                    }
                    this.logger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( this.contacts ) );
                    this.contactService.saveContactList( this.model.contactListName, this.contacts )
                        .subscribe(
                        data => {
                            data = data;
                            this.logger.info( "update Contacts ListUsers:" + data );
                            $( "#uploadContactsMessage" ).show();
                            this.router.navigateByUrl( '/home/contacts/manageContacts' )
                        },

                        error => this.logger.error( error ),
                        () => this.logger.info( "addcontactComponent saveCsvContactList() finished" )
                        )
                } else {
                    this.inValidCsvContacts = true;
                }
            } else
                this.logger.error( "AddContactComponent saveCsvContactList() Contacts Null Error" );
        }
        else {
            this.contactListNameError = true;
            this.logger.error( "AddContactComponent saveCsvContactList() ContactListName Error" );
        }
    }

    saveContacts() {
        this.noOptionsClickError = false;
        if ( this.saveAddCotactsUsers == true && this.saveClipBoardUsers == false && this.saveCsvUsers == false && this.saveGoogleContactUsers == false && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == false ) {
            this.saveContactList( true );
        } else if ( this.saveAddCotactsUsers == false && this.saveCsvUsers == false && this.saveClipBoardUsers == true && this.saveGoogleContactUsers == false && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == false ) {
            this.saveClipBoardContactList( true );
        } else if ( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == false && this.saveGoogleContactUsers == false && this.saveCsvUsers == true && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == false ) {
            this.saveCsvContactList( true );
        } else if ( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == false && this.saveCsvUsers == false && this.saveGoogleContactUsers == true && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == false ) {
            if ( this.gContactsValue == true ) {
                this.saveGoogleContacts( true );
            } else
                this.saveGoogleContactSelectedUsers( true );
        } else if ( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == false && this.saveCsvUsers == false && this.saveGoogleContactUsers == false && this.saveZohoContactUsers == true && this.saveSalesforceContactUsers == false ) {
            if ( this.zohoContactsValue == true ) {
                this.saveZohoContacts( true );
            } else
                this.saveZohoContactSelectedUsers( true );
        } else if ( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == false && this.saveCsvUsers == false && this.saveGoogleContactUsers == false && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == true ) {
            if ( this.salesforceContactsValue == true ) {
                this.saveSalesforceContacts( true );
            } else
                this.saveSalesforceContactSelectedUsers( true );
        } else if( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == false && this.saveCsvUsers == false && this.saveGoogleContactUsers == false &&
                this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == false ){  
             this.noOptionsClickError = true;
        }
        else {
           // this.noOptionsClickError = true;
        }
    }

    cancelContacts() {
        this.contactListNameError = false;
        this.noOptionsClickError = false;
        this.isValidContactName = false
        this.emailNotValid = false;
        this.gContacts.length = 0;
        this.zContacts.length = 0;
        this.salesforceContactUsers.length = 0;
        if ( this.saveAddCotactsUsers == true && this.saveClipBoardUsers == false && this.saveGoogleContactUsers == false && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == false ) {
            $( "#sample_editable_1" ).hide();
            $( "button#uploadCSV" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            $( "button#copyFromClipBoard" ).prop( 'disabled', false );
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( "button#cancel_button" ).prop( 'disabled', true );
            $( "button#googleContact_button" ).prop( 'disabled', false );
            $( "button#salesforceContact_button" ).prop( 'disabled', false );
            $( "button#zohoContact_button" ).prop( 'disabled', false );
            $( "button#microsoftContact_button" ).prop( 'disabled', false );
            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
            $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -86px;left: 78px;' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            this.newUsers.length = 0;
            //this.model.contactListName = null;
            this.model.contactListName = "";
            this.dublicateEmailId = false;
            this.contactListNameError = false;
            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( "button#googleContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#zohoContact_buttonNormal" ).prop( 'disabled', false );
        }
        if ( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == true && this.saveGoogleContactUsers == false && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == false ) {
            this.clipBoard = false;
            $( "button#uploadCSV" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            $( "button#addContacts" ).prop( 'disabled', false );
            $( "button#sample_editable_1_new" ).prop( 'disabled', true );
            $( "button#cancel_button" ).prop( 'disabled', true );
            $( "button#googleContact_button" ).prop( 'disabled', false );
            $( "button#salesforceContact_button" ).prop( 'disabled', false );
            $( "button#zohoContact_button" ).prop( 'disabled', false );
            $( "button#microsoftContact_button" ).prop( 'disabled', false );
            //this.model.contactListName = null;
            this.dublicateEmailId = false;
            this.clipboardUsers.length = 0;
            $( "#file_preview" ).hide();
            this.model.contactListName = "";
            $( '#copyFromclipTextArea' ).val( '' );
            this.contactListNameError = false;
            $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( "button#googleContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#zohoContact_buttonNormal" ).prop( 'disabled', false );
        }
        if ( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == false && this.saveGoogleContactUsers == true && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == false ) {
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            $( "#Gfile_preview" ).hide();
            $( "button#addContacts" ).prop( 'disabled', false );
            $( "button#uploadCSV" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            $( "button#copyFromClipBoard" ).prop( 'disabled', false );
            $( "button#cancel_button" ).prop( 'disabled', false );
            $( "button#googleContact_button" ).prop( 'disabled', false );
            $( "button#salesforceContact_button" ).prop( 'disabled', false );
            $( "button#zohoContact_button" ).prop( 'disabled', false );
            $( "button#microsoftContact_button" ).prop( 'disabled', false );
            $( "button#googleContact_button" ).prop( 'disabled', false );
            // this.model.contactListName = null;
            this.contactListNameError = false;
            this.model.contactListName = "";
            $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );

            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            $( "button#googleContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#zohoContact_buttonNormal" ).prop( 'disabled', false );
        }
        if ( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == false && this.saveGoogleContactUsers == false && this.saveZohoContactUsers == true && this.saveSalesforceContactUsers == false ) {
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            $( "#Zfile_preview" ).hide();
            $( "button#addContacts" ).prop( 'disabled', false );
            $( "button#uploadCSV" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            $( "button#copyFromClipBoard" ).prop( 'disabled', false );
            $( "button#cancel_button" ).prop( 'disabled', false );
            $( "button#googleContact_button" ).prop( 'disabled', false );
            $( "button#salesforceContact_button" ).prop( 'disabled', false );
            $( "button#zohoContact_button" ).prop( 'disabled', false );
            $( "button#microsoftContact_button" ).prop( 'disabled', false );
            $( "button#zohoContact_button" ).prop( 'disabled', false );
            $( "button#googleContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#zohoContact_buttonNormal" ).prop( 'disabled', false );
            //this.model.contactListName = null;
            this.contactListNameError = false;
            this.model.contactListName = "";
            $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );

            $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
        }
        if ( this.saveAddCotactsUsers == false && this.saveClipBoardUsers == false && this.saveGoogleContactUsers == false && this.saveZohoContactUsers == false && this.saveSalesforceContactUsers == true ) {
            $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            $( "#Sfile_preview" ).hide();
            $( "button#addContacts" ).prop( 'disabled', false );
            $( "button#uploadCSV" ).prop( 'disabled', false );
            $( "input[type='file']" ).attr( "disabled", false );
            $( "button#copyFromClipBoard" ).prop( 'disabled', false );
            $( "button#cancel_button" ).prop( 'disabled', false );
            $( "button#googleContact_button" ).prop( 'disabled', false );
            $( "button#salesforceContact_button" ).prop( 'disabled', false );
            $( "button#zohoContact_button" ).prop( 'disabled', false );
            $( "button#microsoftContact_button" ).prop( 'disabled', false );
            $( "button#salesforceContact_button" ).prop( 'disabled', false );
            $( "button#googleContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', false );
            $( "button#zohoContact_buttonNormal" ).prop( 'disabled', false );
            //this.model.contactListName = null;
            this.contactListNameError = false;
            this.model.contactListName = "";
            $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
            $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
            $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
            $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
            $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
        }
    }

    removeCsv() {
        this.fileTypeError = false;
        this.inValidCsvContacts = false;
        this.contacts.length = 0;
        this.model.contactListName = "";
        this.isValidContactName = false;
        // this.removeCsvName = false;
        $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        $( "#file_preview" ).hide();
        $( "button#copyFromClipBoard" ).prop( 'disabled', false );
        $( "button#addContacts" ).prop( 'disabled', false );
        $( "button#googleContact_button" ).prop( 'disabled', false );
        $( "button#salesforceContact_button" ).prop( 'disabled', false );
        $( "button#zohoContact_button" ).prop( 'disabled', false );
        $( "button#microsoftContact_button" ).prop( 'disabled', false );
        $( "button#uploadCSV" ).prop( 'disabled', false );
        $( "input[type='file']" ).attr( "disabled", false );
        $( "button#googleContact_buttonNormal" ).prop( 'disabled', false );
        $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', false );
        $( "button#zohoContact_buttonNormal" ).prop( 'disabled', false );
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 78px;' );
    }

    addRow() {
        //this.removeCsv();
        this.fileTypeError = false;
        this.noOptionsClickError = false;
        this.inValidCsvContacts = false;
        this.isContactsThere = false;
        this.saveAddCotactsUsers = true;
        this.saveClipBoardUsers = false;
        this.saveCsvUsers = false;
        this.saveGoogleContactUsers = false;
        this.saveZohoContactUsers = false;
        this.saveSalesforceContactUsers = false
        $( "#sample_editable_1" ).show();
        this.newUsers.push( new User() );
        $( "button#copyFromClipBoard" ).prop( 'disabled', true );
        $( "button#uploadCSV" ).prop( 'disabled', true );
        $( "button#sample_editable_1_new" ).prop( 'disabled', false );
        $( "input[type='file']" ).attr( "disabled", true );
        $( "button#cancel_button" ).prop( 'disabled', false );
        $( "button#googleContact_button" ).prop( 'disabled', true );
        $( "button#salesforceContact_button" ).prop( 'disabled', true );
        $( "button#zohoContact_button" ).prop( 'disabled', true );
        $( "button#googleContact_buttonNormal" ).prop( 'disabled', true );
        $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', true );
        $( "button#zohoContact_buttonNormal" ).prop( 'disabled', true );
        $( "button#microsoftContact_button" ).prop( 'disabled', true );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
    }

    cancelRow( rowId: number ) {
        if ( rowId !== -1 ) {
            this.newUsers.splice( rowId, 1 );
        }
    }

    copyFromClipboard() {
        //this.removeCsv();
        this.fileTypeError = false;
        this.noOptionsClickError = false;
        this.inValidCsvContacts = false;
        this.clipboardTextareaText = "";
        this.isContactsThere = false;
        this.saveAddCotactsUsers = false;
        this.saveClipBoardUsers = true;
        this.saveCsvUsers = false;
        this.saveGoogleContactUsers = false;
        this.saveZohoContactUsers = false;
        this.saveSalesforceContactUsers = false;
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( "button#addContacts" ).prop( 'disabled', true );
        $( "button#uploadCSV" ).prop( 'disabled', true );
        $( "input[type='file']" ).attr( "disabled", true );
        $( "button#cancel_button" ).prop( 'disabled', false );
        $( "button#googleContact_button" ).prop( 'disabled', true );
        $( "button#salesforceContact_button" ).prop( 'disabled', true );
        $( "button#zohoContact_button" ).prop( 'disabled', true );
        $( "button#microsoftContact_button" ).prop( 'disabled', true );
        $( "button#googleContact_buttonNormal" ).prop( 'disabled', true );
        $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', true );
        $( "button#zohoContact_buttonNormal" ).prop( 'disabled', true );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
        this.clipBoard = true;
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
        $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
    }

    googleContacts() {
        //this.removeCsv();
        this.fileTypeError = false;
        this.inValidCsvContacts = false;
        this.isContactsThere = false;
        this.noOptionsClickError = false;
        this.logger.info( "addContactComponent googlecontacts() login:" );
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
        this.logger.info( "socialContacts" + this.socialContact.socialNetwork );
        this.contactService.googleLogin()
            .subscribe(
            data => {
                this.storeLogin = data;
                console.log( data );
                if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                    console.log( "AddContactComponent googleContacts() Authentication Success" );
                    this.getGoogleContactsUsers();
                    this.logger.info( "called getGoogle contacts method:" );
                } else {
                    localStorage.setItem( "userAlias", data.userAlias )
                    console.log( data.redirectUrl );
                    console.log( data.userAlias );
                    window.location.href = "" + data.redirectUrl;
                }
            },
            error => this.logger.error( error ),
            () => this.logger.log( "AddContactsComponent googleContacts() finished." )
            );
    }

    getGoogleContactsUsers() {
        this.saveAddCotactsUsers = false;
        this.saveClipBoardUsers = false;
        this.saveCsvUsers = false;
        this.saveGoogleContactUsers = true;
        this.saveZohoContactUsers = false;
        this.saveSalesforceContactUsers = false;
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
                    this.gContacts.push( socialContact );
                    this.logger.info( this.getGoogleConatacts );
                    //this.googleImageNormal = true;
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "#Gfile_preview" ).show();
                    $( "button#addContacts" ).prop( 'disabled', true );
                    $( "button#uploadCSV" ).prop( 'disabled', true );
                    $( "input[type='file']" ).attr( "disabled", true );
                    $( "button#copyFromClipBoard" ).prop( 'disabled', true );
                    $( "button#cancel_button" ).prop( 'disabled', false );
                    $( "button#salesforceContact_button" ).prop( 'disabled', true );
                    $( "button#zohoContact_button" ).prop( 'disabled', true );
                    $( "button#googleContact_button" ).prop( 'disabled', true );
                    $( "button#microsoftContact_button" ).prop( 'disabled', true );
                    $( "button#googleContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#zohoContact_buttonNormal" ).prop( 'disabled', true );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                }
                this.socialContact.contacts = this.gContacts;
            },
            error => this.logger.error( error ),
            () => this.logger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
            );
        this.isContactsThere = false;
    }

    saveGoogleContacts( isValid: boolean ) {
        this.socialContact.socialNetwork = "GOOGLE";
        this.socialContact.contactName = this.model.contactListName;
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        this.socialContact.contactType = "CONTACT";
        this.socialContact.contacts = this.gContacts;
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            if ( this.gContacts.length > 0 ) {
                this.logger.info( isValid );
                this.contactService.saveSocialContactList( this.socialContact )
                    .subscribe(
                    data => {
                        data = data;
                        this.logger.info( "update Contacts ListUsers:" + data );
                        $( "#uploadContactsMessage" ).show();
                        this.router.navigateByUrl( '/home/contacts/manageContacts' )
                    },
                    error => this.logger.error( error ),
                    () => this.logger.info( "addcontactComponent saveacontact() finished" )
                    )
            } else
                this.logger.error( "AddContactComponent saveGoogleContacts() Contacts Null Error" );
        }
        else {
            this.contactListNameError = true;
            this.logger.error( "AddContactComponent saveGoogleContacts() ContactListName Error" );
        }
    }

    saveGoogleContactSelectedUsers( isValid: boolean ) {
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
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        this.logger.info( "SelectedUserIDs:" + selectedUserIds );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && selectedUsers.length != 0) {
            this.logger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( selectedUsers ) );
            this.contactService.saveContactList( this.model.contactListName, selectedUsers )
                .subscribe(
                data => {
                    data = data;
                    this.logger.info( "update Contacts ListUsers:" + data );
                    $( "#uploadContactsMessage" ).show();
                    this.router.navigateByUrl( '/home/contacts/manageContacts' )
                    this.contactService.successMessage = true;
                },
                error => this.logger.info( error ),
                () => this.logger.info( "addcontactComponent saveacontact() finished" )
                )
        }
        else {
            this.contactListNameError = true;
            this.logger.error( "AddContactComponent saveGoogleContactSelectedUsers() ContactListName Error" );
        }
    }

    selectAllGoogleContacts( event: boolean ) {
        this.logger.info( "check value:" + event )
        this.gContacts.forEach(( gContacts ) => {
            if ( event == true ) {
                gContacts.checked = true;
                this.gContactsValue = true;
            }
            else {
                gContacts.checked = false;
                this.gContactsValue = false;
            }
        })
    }

    selectAllZohoContacts( event: boolean ) {
        this.logger.info( "check value:" + event )
        this.zContacts.forEach(( zContacts ) => {
            if ( event == true ) {
                zContacts.checked = true;
                this.zohoContactsValue = true;
            }
            else {
                zContacts.checked = false;
                this.zohoContactsValue = false;
            }
        })
    }

    selectAllSalesforceContacts( event: boolean ) {
        this.logger.info( "check value:" + event )
        this.salesforceContactUsers.forEach(( salesforceContactUsers ) => {
            if ( event == true ) {
                salesforceContactUsers.checked = true;
                this.salesforceContactsValue = true;
            }
            else {
                salesforceContactUsers.checked = false;
                this.salesforceContactsValue = false;
            }
        })
    }

    selectGoogleContact( event: boolean ) {
        this.logger.info( "check value:" + event )
        var all: any = document.getElementById( "select_all_google_contacts" );
        if ( event == false ) {
            all.checked = false;
            this.salesforceContactsValue = false;
        }
    }

    selectZohoContact( event: boolean ) {
        this.logger.info( "check value:" + event )
        var all: any = document.getElementById( "select_all_google_contacts" );
        if ( event == false ) {
            all.checked = false;
            this.zohoContactsValue = false;
        }
    }

    selectSalesforceContact( event: boolean ) {
        this.logger.info( "check value:" + event )
        var all: any = document.getElementById( "select_all_google_contacts" );
        if ( event == false ) {
            all.checked = false;
            this.salesforceContactsValue = false;
        }
    }

    zohoContacts() {
        //this.removeCsv();
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
                self.logger.log( self.selectedZohoDropDown );
            }
            else if ( this.selectedZohoDropDown == "lead" ) {
                self.contactType = self.selectedZohoDropDown;
                self.logger.log( self.selectedZohoDropDown );
            }
            this.logger.log( this.userName );
            this.logger.log( this.password );
            this.getZohoContacts( self.contactType, this.userName, this.password );
        }
    }

    hideZohoModal(){
        $( "#zohoShowLoginPopup" ).hide();
    }
    
    checkingZohoContactsAuthentication(){
        this.contactService.checkingZohoAuthentication()
        .subscribe(
        ( data: any ) => {
            this.logger.info( data );
            if(data.showLogin == true){
                $( "#zohoShowLoginPopup" ).show();
            }
            if(data.authSuccess == true){
                $( "#zohoShowAuthorisedPopup" ).show();
            }
        },
        (error:any)=>{
            var body = error['_body'];
            if ( body != "" ) {
                var response = JSON.parse( body );
                if ( response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!" ) {
                    this.zohoAuthStorageError = 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!';
                     setTimeout(()=> {
                         this.zohoAuthStorageError = '';
                     },5000)
                }
            }
           console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error)
           
       },
        () => this.logger.info( "Add contact component loadContactListsName() finished" )
        )

    }
    
    getZohoContacts( contactType: any, username: string, password: string ) {
        /*$( "#zohoContact_button" ).hide();
        $( "#zohoContact_buttonNormal" ).show();*/
        this.saveAddCotactsUsers = false;
        this.saveClipBoardUsers = false;
        this.saveCsvUsers = false;
        this.saveGoogleContactUsers = false;
        this.saveZohoContactUsers = true;
        this.saveSalesforceContactUsers = false;
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
                   // this.hideZohoModal();
                }
                for ( var i = 0; i < this.getZohoConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getZohoConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getZohoConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getZohoConatacts.contacts[i].lastName;
                    this.zContacts.push( socialContact );
                    this.logger.info( this.getZohoConatacts );
                   // this.zohoImageNormal = true;
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "#Zfile_preview" ).show();
                    $( "button#addContacts" ).prop( 'disabled', true );
                    $( "button#uploadCSV" ).prop( 'disabled', true );
                    $( "input[type='file']" ).attr( "disabled", true );
                    $( "button#copyFromClipBoard" ).prop( 'disabled', true );
                    $( "button#cancel_button" ).prop( 'disabled', false );
                    $( "button#salesforceContact_button" ).prop( 'disabled', true );
                    $( "button#googleContact_button" ).prop( 'disabled', true );
                    $( "button#zohoContact_button" ).prop( 'disabled', true );
                    $( "button#microsoftContact_button" ).prop( 'disabled', true );
                    $( "#myModal .close" ).click()
                    $( "button#googleContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#zohoContact_buttonNormal" ).prop( 'disabled', true );

                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                }
            },
            (error:any)=>{
                var body = error['_body'];
                if ( body != "" ) {
                    var response = JSON.parse( body );
                    if ( response.message == "Username or password is incorrect" ) {
                        this.zohoCredentialError = 'Username or password is incorrect';
                         setTimeout(()=> {
                             this.zohoCredentialError = '';
                         },5000)
                    }
                    if ( response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!" ) {
                        this.zohoCredentialError = 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!';
                         setTimeout(()=> {
                             this.zohoCredentialError = '';
                         },5000)
                    }
                }
               console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error)
               
           },
            () => this.logger.log( "googleContacts data :" + JSON.stringify( this.getZohoConatacts.contacts ) )
            );
        this.isContactsThere = false;
    }
    
    hideZohoAuthorisedPopup(){
        $( "#zohoShowAuthorisedPopup" ).hide();
    }
    authorisedZohoContacts() {
        this.saveAddCotactsUsers = false;
        this.saveClipBoardUsers = false;
        this.saveCsvUsers = false;
        this.saveGoogleContactUsers = false;
        this.saveZohoContactUsers = true;
        this.saveSalesforceContactUsers = false;
        let self = this;
        self.selectedZohoDropDown = $( "select.opts:visible option:selected " ).val();
        if ( self.selectedZohoDropDown == "DEFAULT" ) {
            alert( "Please Select the which you like to import from:" );
            return false;
        }
        else {
            if ( self.selectedZohoDropDown == "contact" ) {
                self.contactType = self.selectedZohoDropDown;
                self.logger.log( self.selectedZohoDropDown );
            }
            else if ( this.selectedZohoDropDown == "lead" ) {
                self.contactType = self.selectedZohoDropDown;
                self.logger.log( self.selectedZohoDropDown );
            }
            
        }
        
        this.socialContact.socialNetwork = "ZOHO";
        this.socialContact.contactType = self.contactType;
        this.contactService.getZohoAutherizedContacts( this.socialContact )
            .subscribe(
            data => {
                this.getZohoConatacts = data;
                this.hideZohoAuthorisedPopup();
                if ( this.getZohoConatacts.contacts.length == 0 ) {
                    this.isContactsThere = true;
                   // this.hideZohoModal();
                }
                for ( var i = 0; i < this.getZohoConatacts.contacts.length; i++ ) {
                    let socialContact = new SocialContact();
                    let user = new User();
                    socialContact.id = i;
                    socialContact.emailId = this.getZohoConatacts.contacts[i].emailId;
                    socialContact.firstName = this.getZohoConatacts.contacts[i].firstName;
                    socialContact.lastName = this.getZohoConatacts.contacts[i].lastName;
                    this.zContacts.push( socialContact );
                    this.logger.info( this.getZohoConatacts );
                   // this.zohoImageNormal = true;
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "#Zfile_preview" ).show();
                    $( "button#addContacts" ).prop( 'disabled', true );
                    $( "button#uploadCSV" ).prop( 'disabled', true );
                    $( "input[type='file']" ).attr( "disabled", true );
                    $( "button#copyFromClipBoard" ).prop( 'disabled', true );
                    $( "button#cancel_button" ).prop( 'disabled', false );
                    $( "button#salesforceContact_button" ).prop( 'disabled', true );
                    $( "button#googleContact_button" ).prop( 'disabled', true );
                    $( "button#zohoContact_button" ).prop( 'disabled', true );
                    $( "button#microsoftContact_button" ).prop( 'disabled', true );
                    $( "#myModal .close" ).click()
                    $( "button#googleContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#zohoContact_buttonNormal" ).prop( 'disabled', true );

                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                }
            },
            error => this.logger.error( error ),
            () => this.logger.log( "googleContacts data :" + JSON.stringify( this.getZohoConatacts.contacts ) )
            );
        this.isContactsThere = false;
    }

    saveZohoContacts( isValid: boolean ) {
        this.socialContact.socialNetwork = "ZOHO";
        this.socialContact.contactName = this.model.contactListName;
        this.socialContact.contactType = this.contactType;
        this.socialContact.contacts = this.zContacts;
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            if ( this.zContacts.length > 0 ) {
                this.logger.info( isValid );
                this.contactService.saveSocialContactList( this.socialContact )
                    .subscribe(
                    data => {
                        data = data;
                        this.logger.info( "update Contacts ListUsers:" + data );
                        $( "#uploadContactsMessage" ).show();
                        this.router.navigateByUrl( '/home/contacts/manageContacts' )
                    },

                    error => this.logger.error( error ),
                    () => this.logger.info( "addcontactComponent saveZohoContact() finished" )
                    )
            } else
                this.logger.error( "AddContactComponent saveZohoContacts() Contacts Null Error" );
        }
        else {
            this.contactListNameError = true;
            this.logger.error( "AddContactComponent saveZohoContacts() ContactList Name Error" );
        }
    }

    saveZohoContactSelectedUsers( isValid: boolean ) {
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
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && selectedUsers.length != 0 ) {
            this.logger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( selectedUsers ) );
            this.contactService.saveContactList( this.model.contactListName, selectedUsers )
                .subscribe(
                data => {
                    data = data;
                    this.logger.info( "update Contacts ListUsers:" + data );
                    $( "#uploadContactsMessage" ).show();
                    this.router.navigateByUrl( '/home/contacts/manageContacts' )
                    this.contactService.successMessage = true;
                },

                error => this.logger.info( error ),
                () => this.logger.info( "addcontactComponent saveZohoContactUsers() finished" )
                )
        }
        else {
            this.contactListNameError = true;
            this.logger.error( "AddContactComponent saveZohoContactSelectedUsers() ContactList Name Error" );
        }
    }

    onChange( item: any ) {
        this.logger.log( item );
        /*if(this.salesforceListViewName != 'DEFAULT'){
        $( "button#salesforce_save_button" ).prop( 'disabled', false );
        }*/
        if(this.salesforceListViewName == "DEFAULT"){
            $( "button#salesforce_save_button" ).prop( 'disabled', true ); 
        }else{
            $( "button#salesforce_save_button" ).prop( 'disabled', false ); 
        }
        
        this.salesforceListViewId = item;
        for ( var i = 0; i < this.salesforceListViewsData.length; i++ ) {
            this.logger.log( this.salesforceListViewsData[i].listViewId );
            if ( item == this.salesforceListViewsData[i].listViewId ) {
                this.salesforceListViewName = this.salesforceListViewsData[i].listViewName;
            }
            this.logger.log( "listviewNameDROPDOWN" + this.salesforceListViewName );
        }
    }

    onChangeSalesforceDropdown( event: Event ) {
        this.contactType = event.target["value"];
        this.socialNetwork = "salesforce";
        this.salesforceListViewsData = [];
        if(this.contactType == "DEFAULT"){
            $( "button#salesforce_save_button" ).prop( 'disabled', true ); 
        }else{
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
                            this.logger.log( data.listViews[i] );
                        }
                    }
                },
                error => this.logger.error( error ),
                () => this.logger.log( "onChangeSalesforceDropdown" )
                );
        }
    }

    showModal() {
        $( "#salesforceModal" ).show();
    }

    hideModal() {
        $( "#salesforceModal" ).hide();
    }

    salesforceContacts() {
        this.contactType = "";
        this.isContactsThere = false;
        this.noOptionsClickError = false;
        //this.removeCsv();
        this.fileTypeError = false;
        this.inValidCsvContacts = false;
        this.socialContact.socialNetwork = "salesforce";
        this.logger.info( "socialContacts" + this.socialContact.socialNetwork );
        this.contactService.salesforceLogin()
            .subscribe(
            data => {
                this.storeLogin = data;
                console.log( data );
                if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
                    //$( "#myModal1" ).show();
                    this.showModal();
                    console.log( "AddContactComponent salesforce() Authentication Success" );
                    this.checkingPopupValues();
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

    checkingPopupValues() {
        $( "button#salesforce_save_button" ).prop( 'disabled', true ); 
        if ( this.contactType == "contact_listviews" || this.contactType == "lead_listviews" ) {
            this.getSalesforceListViewContacts( this.contactType );
        } else {
            this.getSalesforceContacts( this.contactType );
        }
    }

    getSalesforceContacts( contactType: any ) {
        this.saveAddCotactsUsers = false;
        this.saveClipBoardUsers = false;
        this.saveCsvUsers = false;
        this.saveGoogleContactUsers = false;
        this.saveZohoContactUsers = false;
        this.saveSalesforceContactUsers = true;
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
            this.logger.log( "AddContactComponent getSalesforceContacts() selected Dropdown value:" + this.contactType )
        }
        
        this.contactService.getSalesforceContacts( this.socialNetwork, this.contactType )
            .subscribe(
            data => {
                this.getSalesforceConatactList = data;
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
                    this.salesforceContactUsers.push( socialContact );
                    this.logger.info( this.getSalesforceConatactList );
                    //this.sfImageNormal = true;
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "#Sfile_preview" ).show();
                    $( "button#addContacts" ).prop( 'disabled', true );
                    $( "button#uploadCSV" ).prop( 'disabled', true );
                    $( "input[type='file']" ).attr( "disabled", true );
                    $( "button#copyFromClipBoard" ).prop( 'disabled', true );
                    $( "button#cancel_button" ).prop( 'disabled', false );
                    $( "button#zohoContact_button" ).prop( 'disabled', true );
                    $( "button#googleContact_button" ).prop( 'disabled', true );
                    $( "button#salesforceContact_button" ).prop( 'disabled', true );
                    $( "button#microsoftContact_button" ).prop( 'disabled', true );
                    $( "button#googleContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#zohoContact_buttonNormal" ).prop( 'disabled', true );
                    this.hideModal();
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                }
            },
            error => this.logger.error( error ),
            () => this.logger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getSalesforceConatactList.contacts ) )
            );
        this.isContactsThere = false;
    }

    getSalesforceListViewContacts( contactType: any ) {
        this.saveAddCotactsUsers = false;
        this.saveClipBoardUsers = false;
        this.saveCsvUsers = false;
        this.saveGoogleContactUsers = false;
        this.saveZohoContactUsers = false;
        this.saveSalesforceContactUsers = true;
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
            this.logger.log( "AddContactComponent getSalesforceContacts() selected Dropdown value:" + this.contactType )
        }
        this.contactService.getSalesforceListViewContacts( this.socialNetwork, this.contactType, this.salesforceListViewId, this.salesforceListViewName )
            .subscribe(
            data => {
                this.getSalesforceConatactList = data;
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
                    this.salesforceContactUsers.push( socialContact );
                    this.logger.info( this.getSalesforceConatactList );
                    //this.sfImageNormal = true;
                    $( "button#sample_editable_1_new" ).prop( 'disabled', false );
                    $( "#Sfile_preview" ).show();
                    $( "button#addContacts" ).prop( 'disabled', true );
                    $( "button#uploadCSV" ).prop( 'disabled', true );
                    $( "input[type='file']" ).attr( "disabled", true );
                    $( "button#copyFromClipBoard" ).prop( 'disabled', true );
                    $( "button#cancel_button" ).prop( 'disabled', false );
                    $( "button#zohoContact_button" ).prop( 'disabled', true );
                    $( "button#googleContact_button" ).prop( 'disabled', true );
                    $( "button#microsoftContact_button" ).prop( 'disabled', true );
                    $( "button#salesforceContact_button" ).prop( 'disabled', true );
                    $( "button#googleContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#salesforceContact_buttonNormal" ).prop( 'disabled', true );
                    $( "button#zohoContact_buttonNormal" ).prop( 'disabled', true );
                    $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                    this.hideModal();
                    $( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '.zohoImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
                    $( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '#ZgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -86px;left: 80px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
                    $( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
                }
            },
            error => this.logger.error( error ),
            () => this.logger.log( "addContactComponent getSalesforceContacts() Data:" + JSON.stringify( this.getSalesforceConatactList.contacts ) )
            );
        this.isContactsThere = false;
    }

    saveSalesforceContactSelectedUsers( isValid: boolean ) {
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
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        this.logger.info( "SelectedUserIDs:" + selectedUserIds );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && selectedUsers.length != 0) {
            this.logger.info( "update contacts #contactSelectedListId " + " data => " + JSON.stringify( selectedUsers ) );
            this.contactService.saveContactList( this.model.contactListName, selectedUsers )
                .subscribe(
                data => {
                    data = data;
                    this.logger.info( "update Contacts ListUsers:" + data );
                    $( "#uploadContactsMessage" ).show();
                    this.router.navigateByUrl( '/home/contacts/manageContacts' )
                    this.contactService.successMessage = true;
                },
                error => this.logger.info( error ),
                () => this.logger.info( "addcontactComponent saveZohoContactUsers() finished" )
                )
        }
        else {
            this.contactListNameError = true;
            this.logger.error( "AddContactComponent saveSalesforceContactSelectedUsers() ContactList Name Error" );
        }
    }

    saveSalesforceContacts( isValid: boolean ) {
        this.socialContact.socialNetwork = "salesforce";
        this.socialContact.contactName = this.model.contactListName;
        this.socialContact.contactType = this.contactType;
        this.socialContact.alias = this.salesforceListViewId;
        this.socialContact.contacts = this.salesforceContactUsers;
        this.model.contactListName = this.model.contactListName.replace( /\s\s+/g, ' ' );
        if ( this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' ) {
            if ( this.salesforceContactUsers.length > 0 ) {
                this.logger.info( isValid );
                this.contactService.saveSocialContactList( this.socialContact )
                    .subscribe(
                    data => {
                        data = data;
                        this.logger.info( "update Contacts ListUsers:" + data );
                        $( "#uploadContactsMessage" ).show();
                        this.router.navigateByUrl( '/home/contacts/manageContacts' )
                    },
                    error => this.logger.error( error ),
                    () => this.logger.info( "addcontactComponent saveSalesforceContacts() finished" )
                    )
            } else
                this.logger.error( "AddContactComponent saveSalesforceContacts() Contacts Null Error" );
        }
        else {
            this.contactListNameError = true;
            this.logger.error( "AddContactComponent saveSalesforceContacts() ContactList Name Error" );
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
            error => this.logger.error( error ),
            () => this.logger.log( "AddContactsComponent socialContactImage() finished." )
            );
    }

    loadContactListsNames() {
        this.contactService.loadContactListsNames()
            .subscribe(
            ( data: any ) => {
                this.logger.info( data );
                this.contactLists = data.listOfUserLists;
                for(let i=0;i< data.names.length;i++){
                this.names.push( data.names[i].replace(/\s/g, '') );
                }
            },
            error => {
                this.logger.error( error )
            },
            () => this.logger.info( "Add contact component loadContactListsName() finished" )
            )
    }

    
    unlinkSocailAccount(){
        let socialNetwork = this.settingSocialNetwork.toUpperCase();
        console.log("CheckBoXValueUNlink"+this.isUnLinkSocialNetwork);
        this.contactService.unlinkSocailAccount(socialNetwork, this.isUnLinkSocialNetwork)
        .subscribe(
                ( data: any ) => {
                    if(socialNetwork == 'SALESFORCE'){
                        $( "#salesforceContact_buttonNormal" ).hide();
                        $( "#salesforceGear" ).hide();
                        this.sfImageBlur = true;
                        this.unlinkSalesforceSuccessMessage = true;
                        setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                        this.socialContactImage();
                   }
                    else if(socialNetwork == 'GOOGLE'){
                        $( "#googleContact_buttonNormal" ).hide();
                        $( "#GoogleGear" ).hide();
                        this.googleImageBlur = true;
                        this.unlinkGoogleSuccessMessage = true;
                        setTimeout( function() { $( "#googleSuccessMessage" ).slideUp( 500 ); }, 3000 );
                    }
                    else if(socialNetwork == 'ZOHO'){
                        $( "#zohoContact_buttonNormal" ).hide();
                        $( "#zohoGear" ).hide();
                        this.zohoImageBlur = true;
                        this.unlinkZohoSuccessMessage = true;
                        setTimeout( function() { $( "#zohoSuccessMessage" ).slideUp( 500 ); }, 3000 );
                    }
                },
                ( error: any ) => {
                    if ( error.search( 'contactlist is being used in one or more campaigns. Please delete those campaigns first.' ) != -1 ) {
                        this.Campaign = error;
                        $( "#settingsSalesforce .close" ).click()
                        this.deleteErrorMessage = true;
                        setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );
                    }
                    console.log( error );
                },
                () => {
                    $( "#settingSocialNetwork .close" ).click();
                    this.cancelContacts();
                    this.logger.info( "deleted completed" );
                }
                );
            this.unlinkSalesforceSuccessMessage = false;
            this.unlinkGoogleSuccessMessage = false;
            this.unlinkZohoSuccessMessage = false;
            this.deleteErrorMessage = false;
    }
    
    convertToLowerCase(text : string){
        return text.toLowerCase();
    }
    
    settingSocialNetworkOpenModal(socialNetwork: string){
        this.settingSocialNetwork = socialNetwork;
        $('#settingSocialNetwork').modal();
    }

    ngOnInit() {
        
        this.socialContactImage();
        this.hideModal();
        this.gContactsValue = true;
        this.loadContactListsNames();
        if ( this.contactService.googleCallBack == true ) {
            this.getGoogleContactsUsers();
        } else if ( this.contactService.salesforceContactCallBack == true ) {
            this.showModal();
            this.contactService.salesforceContactCallBack = false;
        }

        this.contactListName = '';
        $( "#Gfile_preview" ).hide();
        $( "#Zfile_preview" ).hide();
        $( "#Sfile_preview" ).hide();
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
            this.logger.error( "addContacts.component error " + err );
        }
    }

    ngDestroy() {
        this.contactService.googleCallBack = false;
        this.contactService.salesforceContactCallBack = false;
        this.hideModal();

    }
}
