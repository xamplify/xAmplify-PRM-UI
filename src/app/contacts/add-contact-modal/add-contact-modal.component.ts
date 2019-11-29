import { Component, OnInit, Input, Output, EventEmitter,AfterViewInit,OnDestroy,ViewChild } from '@angular/core';
import { User } from '../../core/models/user';
import { Router } from '@angular/router';
import { CountryNames } from '../../common/models/country-names';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { ContactService } from '../../contacts/services/contact.service';
import { VideoFileService } from '../../videos/services/video-file.service'
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';

declare var $: any;

@Component( {
    selector: 'app-add-contact-modal',
    templateUrl: './add-contact-modal.component.html',
    styleUrls: ['./add-contact-modal.component.css', '../../../assets/css/phone-number-plugin.css'],
    providers: [CountryNames, RegularExpressions]
})
export class AddContactModalComponent implements OnInit, AfterViewInit,OnDestroy {
    @Input() contactDetails: any;
    @Input() isContactTypeEdit: boolean;
    isPartner: boolean;
    @Input() isUpdateUser: boolean;
    @Input() totalUsers: any;
    @Output() notifyParent: EventEmitter<any>;
    addContactuser: User = new User();
    validEmailPatternSuccess = true;
    emailNotValid: boolean;
    checkingForEmail: boolean;
    editingEmailId = '';
    isEmailExist: boolean = false;
    isCompanyDetails = false;
    checkingContactTypeName = '';
    locationDetails: any;
    locationCountry = '';
    /*********Legal Basis Options******/
    @Input() gdprInput:any;
    legalBasisOptions :Array<LegalBasisOption>;
    public fields: any;
    public placeHolder: string = 'Select Legal Basis Options';
    termsAndConditionStatus: boolean = true;
    gdprStatus:boolean = true;


    constructor( public countryNames: CountryNames, public regularExpressions: RegularExpressions,public router:Router,
                 public contactService: ContactService, public videoFileService: VideoFileService, public referenceService:ReferenceService,public logger: XtremandLogger ) {
        this.notifyParent = new EventEmitter();
        this.isPartner = this.router.url.includes('home/contacts')? false: true;

    }

    addContactModalClose() {
        $( '#addContactModal' ).modal( 'toggle' );
        $( "#addContactModal .close" ).click()
        $( '#addContactModal' ).modal( 'hide' );
        $( 'body' ).removeClass( 'modal-open' );
        $( '.modal-backdrop fade in' ).remove();
        $( ".modal-backdrop in" ).css( "display", "none" );
        this.contactService.isContactModalPopup = false;
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

        if ( lowerCaseEmail != this.editingEmailId && this.totalUsers ) {
            for ( let i = 0; i < this.totalUsers.length; i++ ) {
                if ( lowerCaseEmail == this.totalUsers[i].emailId ) {
                    this.isEmailExist = true;
                    break;
                } else {
                    this.isEmailExist = false;
                }
            }
        }
    }

    validateEmailAddress( emailId: string ) {
        var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
        return EMAIL_ID_PATTERN.test( emailId );
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

    addRow() {
        this.addContactModalClose();
        this.notifyParent.emit( this.addContactuser );
    }

    addEditContactRow() {
        this.addContactModalClose();
        this.notifyParent.emit( this.addContactuser );
    }

    updateUser() {
        $( '#addContactModal' ).modal( 'hide' );
        this.contactService.isContactModalPopup = false;
        this.notifyParent.emit( this.addContactuser );
    }

    contactCompanyChecking( contactCompany: string ) {
        if ( contactCompany.trim() != '' ) {
            this.isCompanyDetails = true;
        } else {
            this.isCompanyDetails = false;
        }
    }

/*    geoLocation(){
        try{
        this.videoFileService.getJSONLocation()
        .subscribe(
        (data: any) => {
            this.locationCountry = data.country;
            if ( !this.isUpdateUser || this.addContactuser.country == undefined ) {
                this.addContactuser.country = data.country;
            }

            if ( !this.isUpdateUser || this.addContactuser.mobileNumber == undefined ) {
                for ( let i = 0; i < this.countryNames.countriesMobileCodes.length; i++ ) {
                    if ( data.countryCode == this.countryNames.countriesMobileCodes[i].code ) {
                        this.addContactuser.mobileNumber = this.countryNames.countriesMobileCodes[i].dial_code;
                        break;
                    }
                }
            }

        } )
        } catch ( error ) {
            console.error( error, "addcontactOneAttimeModalComponent()", "gettingGeoLocation" );
        }
    }*/

    ngOnInit() {
       try{
        //this.geoLocation();
        this.addContactuser.country = this.countryNames.countries[0];
        if(this.isPartner){
            this.checkingContactTypeName = "Partner"
        }else{
            this.checkingContactTypeName = "Contact"
        }

        if ( this.isUpdateUser ) {
            this.checkingForEmail = true;
            this.addContactuser.userId = this.contactDetails.id;
            this.addContactuser.firstName = this.contactDetails.firstName;
            this.addContactuser.lastName = this.contactDetails.lastName;
            this.addContactuser.contactCompany = this.contactDetails.contactCompany;
            this.addContactuser.jobTitle = this.contactDetails.jobTitle;
            this.addContactuser.emailId = this.contactDetails.emailId;
            this.editingEmailId = this.contactDetails.emailId;
            this.addContactuser.vertical = this.contactDetails.vertical;
            this.addContactuser.region = this.contactDetails.region;
            this.addContactuser.partnerType = this.contactDetails.partnerType;
            this.addContactuser.category = this.contactDetails.category;
            this.addContactuser.address = this.contactDetails.address;
            this.addContactuser.city = this.contactDetails.city;
            this.addContactuser.state = this.contactDetails.state;
            this.addContactuser.zipCode = this.contactDetails.zipCode;
            this.addContactuser.country = this.contactDetails.country;
            this.addContactuser.mobileNumber = this.contactDetails.mobileNumber;
           /* if ( this.addContactuser.mobileNumber == undefined ) {
                //this.addContactuser.mobileNumber = "+1";
                this.geoLocation()
            }*/
            if ( this.isPartner ) {
                if ( this.addContactuser.contactCompany != undefined ) {
                    this.isCompanyDetails = true;
                } else {
                    this.isCompanyDetails = false;
                }
            }

        }
        if ( this.addContactuser.country == undefined ) {
            //this.geoLocation();
            this.addContactuser.country = this.countryNames.countries[0];
        }
        /**************Show Legal Basis Content*******************/
        this.fields = { text: 'name', value: 'id' };
        if(this.gdprInput!=undefined){
            this.legalBasisOptions = this.gdprInput.legalBasisOptions;
            this.termsAndConditionStatus = this.gdprInput.termsAndConditionStatus;
            this.gdprStatus = this.gdprInput.gdprStatus;
        }
        $( '#addContactModal' ).modal( 'show' );
      
       } catch ( error ) {
           console.error( error, "addcontactOneAttimeModalComponent()", "ngOnInit()" );
       }
    }

    ngAfterViewInit(){
    }
    ngOnDestroy(){
        this.addContactModalClose();
    }

}
