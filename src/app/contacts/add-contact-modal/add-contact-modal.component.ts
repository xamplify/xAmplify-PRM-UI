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
import { AuthenticationService } from '../../core/services/authentication.service';
import { CustomResponse } from '../../common/models/custom-response';

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
    @Input() mdfAccess: boolean;
    isPartner: boolean;
    isAssignLeads = false;
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
    public placeHolder: string = 'Select Legal Basis';
    isValidLegalOptions = true;
    termsAndConditionStatus: boolean = true;
    gdprStatus:boolean = true;
    validLimit = false;
    teamMemberGroups:Array<any> = new Array<any>();
    loading = false;
    validTeamMemberGroupId: boolean;
    showModulesPopup = false;
    teamMemberGroupId = 0;
    showTeamMembers = false;
    /****XNFR-98******/
    @Input() isTeamMemberPartnerList:boolean;
    @Input() partnerListId : number;
    validationResponse : CustomResponse = new CustomResponse();
    partners: User[] = [];
    
    
    constructor( public countryNames: CountryNames, public regularExpressions: RegularExpressions,public router:Router,
                 public contactService: ContactService, public videoFileService: VideoFileService, public referenceService:ReferenceService,public logger: XtremandLogger,public authenticationService: AuthenticationService ) {
        this.notifyParent = new EventEmitter();


        if ( this.router.url.includes( 'home/contacts' ) ) {
          this.isPartner = false;
          // this.module = "contacts";
          this.checkingContactTypeName = "Contact"
      } else if( this.router.url.includes( 'home/assignleads' ) ){
          this.isPartner = false;
          this.isAssignLeads = true;
          this.checkingContactTypeName = "Lead"
      }
      else {
          this.isPartner = true;
          this.checkingContactTypeName = this.authenticationService.partnerModule.customName;
        
      }

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
        this.validateGdprLegalBasis();
    }

    validateLegalBasisOptions(){
        if(this.addContactuser.legalBasis.length==0){
            this.isValidLegalOptions = false;
        }else{
            this.isValidLegalOptions = true;
        }
    }

    validateGdprLegalBasis(){
        if(this.gdprStatus){
            if(this.addContactuser.legalBasis.length>0){
                this.isValidLegalOptions = true;
                if(this.isPartner){
                  this.validatePartners();
                }else{
                  this.closeAndEmitData();
               }
            }else{
                this.isValidLegalOptions = false;
            }
        }else{
            if(this.isPartner){
                  this.validatePartners();
                }else{
                  this.closeAndEmitData();
               }
        }

    }
    validatePartners(){
    try {
    this.partners.push(this.addContactuser);
    this.contactService.validatePartnersCompany(this.partners, this.partnerListId)
    .subscribe(
					(data: any) => {
						if(data.statusCode == 200){
						   this.closeAndEmitData();						   
						}else{
						this.partners = [];
						let emailIds = "";
					$.each(data.data, function (index: number, emailId: string) {
						emailIds += (index + 1) + "." + emailId + "\n";
					});
					let updatedMessage = data.message + "\n" + emailIds;
					this.validationResponse = new CustomResponse('ERROR', updatedMessage, true);
					}
					},
					error => this.logger.error(error),
						() => console.log('validatePartners() finished')
				);
		} catch (error) {
			this.logger.error(error, "AddContactModalComponent", "validating Partners");
		}
	}
    
    closeAndEmitData(){
        this.addContactModalClose();
        this.notifyParent.emit( this.addContactuser );
    }

    addEditContactRow() {
        this.validateGdprLegalBasis();
    }

    updateUser() {
    if(this.isPartner && (this.addContactuser.companyNameStatus==='inactive' || this.addContactuser.companyNameStatus===undefined)){
       if(this.gdprStatus){
            if(this.addContactuser.legalBasis.length>0){
                this.isValidLegalOptions = true;
                this.validatePartnerCompany();
            }else{
                this.isValidLegalOptions = false;
            }
        }else{
            this.validatePartnerCompany();
        }
    }
    else{
        if(this.gdprStatus){
            if(this.addContactuser.legalBasis.length>0){
                this.isValidLegalOptions = true;
                $( '#addContactModal' ).modal( 'hide' );
                this.contactService.isContactModalPopup = false;
                this.notifyParent.emit( this.addContactuser );
            }else{
                this.isValidLegalOptions = false;
            }
        }else{
            $( '#addContactModal' ).modal( 'hide' );
            this.contactService.isContactModalPopup = false;
            this.notifyParent.emit( this.addContactuser );
        }
       }
        
    }

    contactCompanyChecking( contactCompany: string ) {
        if ( contactCompany.trim() != '' ) {
            this.isCompanyDetails = true;
        } else {
            this.isCompanyDetails = false;
        }
    }

    validteContactsCount(contactsLimit:number){
        this.validLimit = contactsLimit>0;
    }

    

    ngOnInit() {
       try{
        this.addContactuser.country = this.countryNames.countries[0];
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
            this.addContactuser.legalBasis = this.contactDetails.legalBasis;
            this.addContactuser.contactsLimit = this.contactDetails.contactsLimit;
            this.validLimit = this.contactDetails.contactsLimit>0;
            this.addContactuser.mdfAmount = this.contactDetails.mdfAmount;
            if ( this.isPartner){
            this.addContactuser.displayContactCompany = this.contactDetails.displayContactCompany;
            this.addContactuser.companyNameStatus = this.contactDetails.companyNameStatus;
            }
            
            if ( this.isPartner || this.isAssignLeads ) {
                if ( this.addContactuser.contactCompany !== undefined && this.addContactuser.contactCompany !== '') {
                    this.isCompanyDetails = true;
                } else {
                    this.isCompanyDetails = false;
                }
                /*******XNFR-85*******/
                this.findTeamMemberGroups();
                
            }
        }
        if ( this.addContactuser.country == undefined ) {
            this.addContactuser.country = this.countryNames.countries[0];
        }
        /**************Show Legal Basis Content*******************/
        this.fields = { text: 'name', value: 'id' };
        if(this.gdprInput!=undefined){
            this.legalBasisOptions = this.gdprInput.legalBasisOptions;
            this.termsAndConditionStatus = this.gdprInput.termsAndConditionStatus;
            this.gdprStatus = this.gdprInput.gdprStatus;
        }
        /*****XNFR-98*****/
        if(this.isTeamMemberPartnerList==undefined){
            this.isTeamMemberPartnerList = false;
        }
        $( '#addContactModal' ).modal( 'show' );
        
       } catch ( error ) {
           console.error( error, "addcontactOneAttimeModalComponent()", "ngOnInit()" );
       }
    }
    /**********XNFR-85************ */
    findTeamMemberGroups(){
        if(this.isPartner){
            this.loading = true;
            this.addContactuser.selectedTeamMembersCount = this.contactDetails['selectedTeamMembersCount'];
            this.addContactuser.partnershipId = this.contactDetails.partnershipId;
            this.addContactuser.teamMemberGroupId = this.contactDetails.teamMemberGroupId;
            this.validTeamMemberGroupId = this.addContactuser.teamMemberGroupId>0;
            this.addContactuser.selectedTeamMemberIds = this.contactDetails['selectedTeamMemberIds'];
            /****XBI-1887****/
            this.authenticationService.findSelectedTeamMemberIds(this.contactDetails.partnershipId)
            .subscribe(
                response=>{
                    this.addContactuser.selectedTeamMemberIds = response.data;
                },error=>{
                    this.loading = false;
                },()=>{
                    this.authenticationService.findAllTeamMemberGroupIdsAndNames(true).
                    subscribe(
                        response=>{
                            this.teamMemberGroups = response.data;
                            this.enableOrDisableTeamMemberGroupDropDown();
                            this.loading = false;
                        },error=>{
                            this.loading = false;
                        }
                    );
                }
            );
        }
    }


    validateTeamMemberGroupId(teamMemberGroupId:any){
        this.validTeamMemberGroupId = teamMemberGroupId>0;
        if(this.validTeamMemberGroupId){
            this.previewTeamMembers();
        }
    }

    previewModules(teamMemberGroupId:number){
        this.showModulesPopup = true;
        this.teamMemberGroupId = teamMemberGroupId;
    }

    previewTeamMembers(){
        this.addContactuser['index'] = 0;
        this.showTeamMembers = true;
    }

    receiveTeamMemberIdsEntity(partner:any){
        this.addContactuser = partner;
        this.addContactuser.selectedTeamMembersCount = partner['selectedTeamMemberIds'].length;
        this.enableOrDisableTeamMemberGroupDropDown();
        this.showTeamMembers = false;
        
    }

    enableOrDisableTeamMemberGroupDropDown(){
        if(this.addContactuser.selectedTeamMembersCount>0 || this.isTeamMemberPartnerList){
            $('#sel-partner-tm').addClass("disabled-div");
        }else{
            this.addContactuser.teamMemberGroupId = 0;
            $('#sel-partner-tm').removeClass("disabled-div");
        }
    }

    hideModulesPreviewPopUp(){
        this.showModulesPopup = false;
		this.teamMemberGroupId = 0;
    }

    ngAfterViewInit(){
    }
    ngOnDestroy(){
        this.addContactModalClose();
    }
    
    contactCompanyChanged(updatedContactCompany : any){
     this.addContactuser.contactCompany = updatedContactCompany;
    }
    
    validatePartnerCompany(){
    try {
    this.contactService.validateCompanyName(this.addContactuser.contactCompany, this.contactDetails.companyId)
    .subscribe(
					(data: any) => {
						if(data.statusCode == 200){
						    $( '#addContactModal' ).modal( 'hide' );
                            this.contactService.isContactModalPopup = false;
                            this.notifyParent.emit( this.addContactuser );
						}else{
					let updatedMessage = data.message + "\n" + data.data;
					this.validationResponse = new CustomResponse('ERROR', updatedMessage, true);
					}},
					error => this.logger.error(error),
						() => console.log('validatePartnerCompany() finished')
				);
		} catch (error) {
			this.logger.error(error, "AddContactModalComponent", "validating Partners");
		}
	}

}
