import { Component, OnInit,OnDestroy,ViewChild,Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { EmailTemplate } from '../../email-template/models/email-template';
import { CustomResponse } from '../../common/models/custom-response';

import { ReferenceService } from '../../core/services/reference.service';
import { PagerService } from '../../core/services/pager.service';
import { CampaignService } from '../services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ContactService } from '../../contacts/services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { validateCampaignSchedule } from '../../form-validator';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { CampaignEmailTemplate } from '../models/campaign-email-template';
import { Campaign } from '../models/campaign';
import { Reply } from '../models/campaign-reply';
import { Url } from '../models/campaign-url';
import { Pagination } from '../../core/models/pagination';
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CampaignContact } from '../models/campaign-contact';
import { Properties } from '../../common/models/properties';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
import {PreviewLandingPageComponent} from '../../landing-pages/preview-landing-page/preview-landing-page.component';
import { LandingPageService } from '../../landing-pages/services/landing-page.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import {AddFolderModalPopupComponent} from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { VanityLoginDto } from '../../util/models/vanity-login-dto';

declare var  $,swal,flatpickr,CKEDITOR,require:any;
var moment = require('moment-timezone');

@Component({
  selector: 'app-edit-partner-campaigns',
  templateUrl: './edit-partner-campaigns.component.html',
  styleUrls: ['./edit-partner-campaigns.component.css','../../../assets/css/content.css'],
  providers:[CallActionSwitch,HttpRequestLoader,Pagination,Properties,LandingPageService]
})
export class EditPartnerCampaignsComponent implements OnInit,OnDestroy {
    ngxloading: boolean;
    senderMergeTag:SenderMergeTag = new SenderMergeTag();
    selectedEmailTemplateId = 0;
    selectedLandingPageId = 0;
    campaign: Campaign;
    emailTemplate: EmailTemplate;
    userLists: any;
    videoFile: any;
    isListView = false;
    campaignLaunchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
    campaignLaunchForm: FormGroup;
    buttonName = "Launch";
    customResponse: CustomResponse = new CustomResponse();
    countries: Country[];
    timezones: Timezone[];
    replies: Array<Reply> = new Array<Reply>();
    urls: Array<Url> = new Array<Url>();
    date: Date;
    reply: Reply = new Reply();
    url: Url = new Url();
    allItems = [];
    campaignEmailTemplate: CampaignEmailTemplate = new CampaignEmailTemplate();
    dataError = false;
    emailTemplateHrefLinks: any[] = [];
    enableWorkFlow = true;
    teamMemberEmailIds:any[] = [];
    vanityLoginDto : VanityLoginDto = new VanityLoginDto();
    formErrors = {
        'campaignName': '',
        'fromName': '',
        'subjectLine': '',
        'email': '',
        'preHeader': '',
        'message': '',
        'scheduleCampaign': '',
        'launchTime': '',
        'contactListId': '',
        'countryId': ''
    };

    validationMessages = {
        'campaignName': {
            'required': 'Name is required.',
            'minlength': 'Title must be at least 4 characters long.',
            'maxlength': 'Title cannot be more than 24 characters long.',
        },
        'fromName': {
            'required': 'From Name is required'
        },
        'subjectLine': {
            'required': 'subject line is required'
        },
        'email': {
            'required': 'email is required',
            'pattern': 'Invalid Email Id'
        },
        'preHeader': {
            'required': 'preHeader is required'
        },

        'message': {
            'required': 'message is required'
        },
        'scheduleCampaign': {
            'required': 'please select the schedule campaign'
        },
        'launchTime': {
            'required': 'please select the launch time'
        },
        'contactListId': {
            'pattern': 'please select at least one contact list'
        },
        'countryId': {
            'required': 'Country is required.',
            'invalidCountry': 'Country is required.'
        },


    };

    /************Campaign Details******************/
    formGroupClass = "form-group";
    campaignNameDivClass:string = this.formGroupClass;
    fromNameDivClass:string =  this.formGroupClass;
    subjectLineDivClass:string = this.formGroupClass;
    fromEmaiDivClass:string = this.formGroupClass;
    preHeaderDivClass:string = this.formGroupClass;
    messageDivClass:string = this.formGroupClass;
    campaignType = "";
    isCampaignDetailsFormValid = true;
    names:string[]=[];
    editedCampaignName = "";
    /***************Contact List************************/
    isContactList = false;
    contactListBorderColor = "silver";
    numberOfContactsPerPage = [
                               {'name':'10','value':'10'},
                               {'name':'20','value':'20'},
                               {'name':'30','value':'30'},
                               {'name':'---All---','value':'0'},
                               ]
    contactItemsSize:any = this.numberOfContactsPerPage[0];
    isCampaignDraftContactList:boolean = false;
    selectedRowClass:string = "";
    isHeaderCheckBoxChecked:boolean = false;
    emptyContactsMessage:string = "";
    contactSearchInput:string = "";
    contactListPagination: Pagination = new Pagination();
    campaignContact:CampaignContact=new CampaignContact();
    selectedUserlistIds = [];
    previewContactListId : number;
    contactsUsersPagination:Pagination = new Pagination();
    previewText:string = "Select";
    /************Add Reply/Add OnClick**************/
    emailNotOpenedReplyDaysSum:number = 0;
    emailOpenedReplyDaysSum:number = 0;
    onClickScheduledDaysSum:number = 0;

    invalidScheduleTime:boolean = false;
    hasInternalError:boolean =false;
    invalidScheduleTimeError:string = "";
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    loggedInUserId:number = 0;
    listName:string;
    loading = false;
    isOnlyPartner = false;
    isOrgAdminAndPartner =false;
    isVendorAndPartner = false;
    validUsersCount: number;
    allUsersCount: number;
    
    @ViewChild('previewLandingPageComponent') previewLandingPageComponent: PreviewLandingPageComponent;
    isEditPartnerTemplate = false;
    start: any;
    pressed: boolean;
    startX: any;
    startWidth: any;
    companyProfileImages:string[]=[];
    partnerTemplateLoader = false;
    categoryNames: any;
    @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
    folderCustomResponse:CustomResponse = new CustomResponse();
    nurtureCampaign = false;
    showUsersPreview = false;
    selectedListName = "";   
    selectedListId = 0;
    showExpandButton = false; 
    expandedUserList: any;
    mergeTagsInput:any = {};
    dataShare: boolean;
    /*******XNFR-125******/
    oneClickLaunchCampaignRedistributedMessage:CustomResponse = new CustomResponse();  
    /*****XNFR-330****/
    isEditAutoResponseTemplate = false;
    selectedAutoResponseEmailTemplate:EmailTemplate;    
    selectedAutoResponseId = 0;  
    selectedAutoResponseCustomEmailTemplateId = 0;
    /*****XNFR-330****/                   

    constructor(private renderer: Renderer,private router: Router,
            public campaignService: CampaignService,
            private authenticationService: AuthenticationService,
            private contactService: ContactService,
            public referenceService: ReferenceService,
            private emailTemplateService:EmailTemplateService,
            private pagerService: PagerService,
            public callActionSwitch: CallActionSwitch,
            private formBuilder: FormBuilder,
            public properties:Properties,
            private xtremandLogger: XtremandLogger,private vanityUrlService:VanityURLService) {
            this.vanityUrlService.isVanityURLEnabled();                
			this.referenceService.renderer = this.renderer;
            this.countries = this.referenceService.getCountries();
            this.contactListPagination = new Pagination();
            this.contactListPagination.filterKey = 'isPartnerUserList';
            this.contactListPagination.filterValue = false;
            this.loggedInUserId = this.authenticationService.getUserId();
            this.isOnlyPartner = this.authenticationService.isOnlyPartner();
            this.isOrgAdminAndPartner = this.authenticationService.isOrgAdminPartner();
            this.isVendorAndPartner = this.authenticationService.isVendorPartner();
             CKEDITOR.config.height = '100';
            if(this.campaignService.reDistributeCampaign!=undefined){
                this.nurtureCampaign = this.campaignService.reDistributeCampaign.nurtureCampaign;
                this.loadCampaignNames(this.loggedInUserId);
				if(this.campaignService.reDistributeCampaign.emailTemplate!=undefined){
                    if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
                        this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
                        this.vanityLoginDto.userId = this.loggedInUserId; 
                        this.vanityLoginDto.vanityUrlFilter = true;
                     }
					this.setCampaignData(this.campaignService.reDistributeCampaign);
				}else{
					this.referenceService.showSweetAlertErrorMessage("This campaign cannot be redistributed as the email template is not available");
					this.router.navigate(['/home/campaigns/partner/all']);
				}
            }else{
                this.router.navigate(['/home/campaigns/partner/all']);
            }
        }
        ngOnInit() {
            this.validateLaunchForm();
            if(this.campaignService.reDistributeCampaign!=undefined){
                flatpickr( '.flatpickr',{
                    enableTime: true,
                    dateFormat: 'm/d/Y h:i K',
                    time_24hr: false
                } );
                this.isListView = !this.referenceService.isGridView;
                this.listCategories();
            }
            
        }

    checkInteractiveData( text: any ) {
        if ( text == "true" ) {
            this.campaign.detailedAnalyticsShared = true;
        } else {
            this.campaign.detailedAnalyticsShared = false;
        }
    }

    setCampaignData(result:any){
        this.campaign = result;
        /*****XNFR-125****/
        this.showOneClickLaunchCampaignRedistributedInfo();
        if(this.campaignService.isExistingRedistributedCampaignName){
            this.editedCampaignName = this.campaign.campaignName;
        }
        if(this.campaign.parentCampaignId==undefined || this.campaign.parentCampaignId==0){
            this.campaign.parentCampaignId = this.campaign.campaignId;
            this.campaign.parentCampaignUserId = this.campaign.userId;
        }
        this.listAllTeamMemberEmailIds();
        this.getCampaignReplies(this.campaign);
        this.getCampaignUrls(this.campaign);
        this.loadContactList(this.contactListPagination);
        if(this.campaign.nurtureCampaign || this.campaign.oneClickLaunch){
            this.selectedUserlistIds = this.campaign.userListIds;
            this.getValidUsersCount();
        }
        this.campaignType = this.campaign.campaignType.toLocaleString();
        if(this.campaignType.includes('VIDEO')){
            this.campaignType=="VIDEO";
        }else if(this.campaignType.includes('REGULAR')){
            this.campaignType=="REGULAR";
        }else if(this.campaignType.includes('LANDINGPAGE')){
            this.campaignType=="LANDINGPAGE";
        }
        
        if(this.campaignType!="LANDINGPAGE"){
            this.getAnchorLinksFromEmailTemplate(this.campaign.emailTemplate.body);
            this.selectedEmailTemplateId = this.campaign.emailTemplate.id;
        }else{
            this.selectedLandingPageId = this.campaign.landingPage.id;
        }

        if(this.campaign.campaignScheduleType=="SCHEDULE" && this.campaign.userId==this.loggedInUserId){
            this.campaign.scheduleCampaign  = this.campaignLaunchOptions[1];
        }else{
            this.campaign.scheduleCampaign  = this.campaignLaunchOptions[2];
        }

        if(this.campaign.timeZoneId==undefined){
            this.campaign.countryId = this.countries[0].id;
            this.onSelect(this.campaign.countryId);
        }else{
            let countryNames = this.referenceService.getCountries().map(function(a) {return a.name;});
            let countryIndex = countryNames.indexOf(this.campaign.country);
            if(countryIndex>-1){
                this.campaign.countryId = this.countries[countryIndex].id;
                this.onSelect(this.campaign.countryId);
            }else{
                this.campaign.countryId = this.countries[0].id;
                this.onSelect(this.campaign.countryId);
            }
        }
           if(this.campaign.nurtureCampaign){
               this.findNurtureCampaignDataShareOption();       
        }else{
               this.findDataShareOption();
        }
    }
    
    findDataShareOption(){
        this.ngxloading = true;
        this.campaignService.findDataShareOption(this.campaign.parentCampaignId).subscribe(
            response=>{
                this.dataShare = response.data;
                this.campaign.dataShare = this.dataShare && this.campaign.oneClickLaunch;
                this.campaign.detailedAnalyticsShared = this.campaign.dataShare;
                this.ngxloading = false;
            },error=>{
                this.dataShare = false;
                this.ngxloading = false;
            }
        );
    }
    
        findNurtureCampaignDataShareOption(){
        this.ngxloading = true;
        this.campaignService.findDataShareOption(this.campaign.parentCampaignId).subscribe(
            response=>{
                this.dataShare = response.data;
              //  this.campaign.dataShare = this.dataShare && this.campaign.oneClickLaunch;
               // this.campaign.detailedAnalyticsShared = this.campaign.dataShare;
                this.ngxloading = false;
            },error=>{
                this.dataShare = false;
                this.ngxloading = false;
            }
        );
    }


    setLoggedInUserEmailId(){
        const userProfile = this.authenticationService.userProfile;
        this.campaign.email = userProfile.emailId;
        if(userProfile.firstName !== undefined && userProfile.lastName !== undefined)
            this.campaign.fromName = $.trim(userProfile.firstName + " " + userProfile.lastName);
        else if(userProfile.firstName !== undefined && userProfile.lastName == undefined)
            this.campaign.fromName = $.trim(userProfile.firstName);
        else
            this.campaign.fromName = $.trim(userProfile.emailId);
        this.setEmailIdAsFromName();
    }


    listAllTeamMemberEmailIds(){
        this.campaignService.getAllTeamMemberEmailIds(this.loggedInUserId)
        .subscribe(
        data => {
          let self = this;
          $.each(data,function(index,value){
              self.teamMemberEmailIds.push(data[index]);
          });
          if(!this.campaign.nurtureCampaign){
              let teamMember = this.teamMemberEmailIds.filter((teamMember)=> teamMember.id ==this.loggedInUserId)[0];
              this.campaign.email = teamMember.emailId;
              this.campaign.fromName = $.trim(teamMember.firstName+" "+teamMember.lastName);
              this.setEmailIdAsFromName();
          }else{
              let existingTeamMemberEmailIds =  this.teamMemberEmailIds.map(function(a) {return a.emailId;});
              if(existingTeamMemberEmailIds.indexOf(this.campaign.email)<0){
                  this.setLoggedInUserEmailId();
              }
          }
        },
        error => console.log( error ),
        () => console.log( "Team members loaded" )
        );
    }

    setFromName(){
        let user = this.teamMemberEmailIds.filter((teamMember)=> teamMember.emailId == this.campaign.email)[0];
        this.campaign.fromName = $.trim(user.firstName+" "+user.lastName);
        this.setEmailIdAsFromName();
    }

    getCampaignPartnerByCampaignIdAndUserId(campaignId: number, userId: number) {
        this.campaignService.getCampaignPartnerByCampaignIdAndUserId(campaignId, userId)
            .subscribe(
            result => {
                this.selectedEmailTemplateId = result.emailTemplateId;
            },
            error => console.log(error),
            () => { });
    }

    onSelect(countryId) {
        this.timezones  = this.referenceService.getTimeZonesByCountryId(countryId);
    }

    setEmailIdAsFromName() {
        if (this.campaign.fromName.length == 0) {
            this.campaign.fromName = this.campaign.email;
        }
    }

    setEmailOpened(event: any) {
        this.campaign.emailOpened = event;
    }


    setVideoPlayed(event: any) {
        this.campaign.videoPlayed = event;
    }

    setDataShare(event:any){
        this.campaign.dataShare = event;
        if(!event){
            this.campaign.detailedAnalyticsShared = event;
        }
    }

    shareAnalytics(event:any){
        this.campaign.detailedAnalyticsShared = event;
    }

    /*************************************************************Campaign Details***************************************************************************************/
    isValidEmail:boolean = false;
    isValidCampaignName:boolean = true;
     validateForm() {
         var isValid = true;
         var campaignNameLength= $.trim(this.campaign.campaignName).length;
         var fromNameLength = $.trim(this.campaign.fromName).length;
         var subjectLineLength = $.trim(this.campaign.subjectLine).length;
         var preHeaderLength  =  $.trim(this.campaign.preHeader).length;
         if(campaignNameLength>0 &&  fromNameLength>0 && subjectLineLength>0 && preHeaderLength>0){
             isValid = true;
         }else{
             isValid = false;
         }
        if(isValid && this.isValidCampaignName){
            this.isCampaignDetailsFormValid = true;
        }else{
            this.isCampaignDetailsFormValid = false;
        }
      }
     validateEmail(emailId:string){
         var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
         if(regex.test(emailId)){
             this.isValidEmail = true;
         }else{
             this.isValidEmail = false;
         }
     }
     validateCampaignName(campaignName:string){
         let lowerCaseCampaignName = $.trim(campaignName.toLowerCase());//Remove all spaces
         var list = this.names[0];
         if($.inArray(lowerCaseCampaignName, list) > -1 && this.editedCampaignName.toLowerCase()!=lowerCaseCampaignName){
             this.isValidCampaignName = false;
         }else{
             this.isValidCampaignName = true;
         }


     }
     validateField(fieldId:string){
         var errorClass = "form-group has-error has-feedback";
         var successClass = "form-group has-success has-feedback";
         let fieldValue = $.trim($('#'+fieldId).val())
         if(fieldId=="campaignName"){
             if(fieldValue.length>0&&this.isValidCampaignName){
                 this.campaignNameDivClass = successClass;
             }else{
                 this.campaignNameDivClass = errorClass;
             }

         }else if(fieldId=="fromName"){
             if(fieldValue.length>0){
                 this.fromNameDivClass = successClass;
             }else{
                 this.fromNameDivClass = errorClass;
             }
         }else if(fieldId=="subjectLine"){
             if(this.campaign.subjectLine.length>0){
                 this.subjectLineDivClass = successClass;
             }else{
                 this.subjectLineDivClass = errorClass;
             }
         }else if(fieldId=="preHeader"){
             if(fieldValue.length>0){
                 this.preHeaderDivClass = successClass;
             }else{
                 this.preHeaderDivClass = errorClass;
             }
         }else if(fieldId=="message"){
             if(fieldValue.length>0){
                 this.messageDivClass = successClass;
             }else{
                 this.messageDivClass = errorClass;
             }
         }
     }
    loadCampaignNames(userId:number){
        this.campaignService.getCampaignNames(userId)
        .subscribe(
        data => {
            this.names.push(data);
        },
        error => console.log( error ),
        () => console.log( "Campaign Names Loaded" )
        );
    }





    filterCampaigns(type: string) {
        this.router.navigate(['/home/campaigns/partner/' + type]);
    }



    validateLaunchForm(): void {
        this.campaign = this.campaign!=undefined ? this.campaign:new Campaign();
        this.campaignLaunchForm = this.formBuilder.group({
            'scheduleCampaign': [this.campaign.scheduleCampaign, Validators.required],
            'launchTime': [this.campaign.scheduleTime],
            'timeZoneId': [this.campaign.timeZoneId],
            'countryId': [this.campaign.countryId]
        }, {
                validator: validateCampaignSchedule('scheduleCampaign', 'launchTime')
            }
        );
        this.campaignLaunchForm.valueChanges
            .subscribe(data => this.onLaunchValueChanged(data));

        this.onLaunchValueChanged(); // (re)set validation messages now
    }

    //campaign lunch form value changed method
    onLaunchValueChanged(data?: any) {
        if (!this.campaignLaunchForm) { return; }
        const form = this.campaignLaunchForm;
        const value = this.campaignLaunchForm['_value'].scheduleCampaign;
        if (value == "NOW") {
            this.buttonName = "Launch";
        } else if (value == "SAVE") {
            this.buttonName = "Save";
        } else if (value == "SCHEDULE") {
            this.buttonName = "Schedule";
        }
        for (const field of Object.keys(this.formErrors)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key of Object.keys(control.errors)) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    previewVideo(videoFile: any) {
        this.videoFile = videoFile;
    }

    closePreviewVideoModal(event: any) {
        this.videoFile = undefined;
    }

    previewEmailTemplate(emailTemplate:EmailTemplate){
        this.ngxloading = true;
        this.emailTemplateService.getAllCompanyProfileImages(this.loggedInUserId).subscribe(
                ( data: any ) => {
                    let body = emailTemplate.body;
                    let self  =this;
                    $.each(data,function(index,value){
                        body = body.replace(value, self.authenticationService.MEDIA_URL+self.campaign.companyLogo);
                    });
                    body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL+this.campaign.companyLogo);
                    let emailTemplateName = emailTemplate.name;
                    if(emailTemplateName.length>50){
                        emailTemplateName = emailTemplateName.substring(0, 50)+"...";
                    }
                    $("#email-template-content").empty();
                    $("#email-template-title").empty();
                    $("#email-template-title").append(emailTemplateName);
                    $('#email-template-title').prop('title',emailTemplate.name);
                    if(this.referenceService.hasMyMergeTagsExits(body)){
                        let data = {};
                        data['emailId'] = this.campaign.email;
                        this.referenceService.getMyMergeTagsInfoByEmailId(data).subscribe(
                                response => {
                                    if(response.statusCode==200){
                                        this.campaign.myMergeTagsInfo = response.data;
                                        body = body.replace(this.senderMergeTag.aboutUsGlobal,this.campaign.myMergeTagsInfo.aboutUs);
                                        this.setMergeTagsInfo(body);
                                    }
                                },
                                error => {
                                    this.xtremandLogger.error(error);
                                    this.setMergeTagsInfo(body);
                                }
                            );

                    }else{
                        this.setMergeTagsInfo(body);
                    }
                },
                error => { this.ngxloading = false;this.xtremandLogger.error("error in getAllCompanyProfileImages("+this.loggedInUserId+")", error); },
                () =>  this.xtremandLogger.info("Finished getAllCompanyProfileImages()"));
    }

    setMergeTagsInfo(body:string){
        let videoGifPath = "";
        if(this.campaignType=="video"){
           videoGifPath =  this.campaign.campaignVideoFile.gifImagePath
        }
        let updatedBody = this.referenceService.showEmailTemplatePreview(this.campaign, this.campaignType,videoGifPath, body);
        $("#email-template-content").append(updatedBody);
          $('.modal .modal-body').css('overflow-y', 'auto');
          $("#email_template_preivew").modal('show');
          $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        this.ngxloading = false;
    }


    setUpdatedBody(body:any,emailTemplate:EmailTemplate){
        emailTemplate.body = body;
        this.referenceService.previewEmailTemplate(emailTemplate, this.campaign);
        this.ngxloading = false;
    }



    setContactListError(){
        if(this.selectedUserlistIds.length>0){
            this.contactListBorderColor = "silver";
            this.referenceService.goToDiv("campaign-options-div");
        }else{
            $('#contact-list-error').show(600);
            this.contactListBorderColor = "red";
            this.referenceService.goToTop();
        }
    }

    getCampaignData(emailId: string) {
        if(!this.enableWorkFlow){
            this.replies = [];
            this.urls = [];
        }else{
            this.getRepliesData();
            this.getOnClickData();
        }
        let country = $.trim($('#countryName option:selected').text());
        let timeZoneId = "";
        let scheduleTime:any;
        if(this.campaignLaunchForm.value.scheduleCampaign=="NOW" || this.campaignLaunchForm.value.scheduleCampaign=="SAVE"){
            let intlTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if(intlTimeZone!=undefined){
                timeZoneId = intlTimeZone;
            }else if(moment.tz.guess()!=undefined){
                timeZoneId = moment.tz.guess();
           }
            scheduleTime = this.campaignService.setLaunchTime();
        }else{
            timeZoneId = $('#timezoneId option:selected').val();
            scheduleTime = this.campaignLaunchForm.value.launchTime;
        }
        let campaignId = 0;
        if(this.campaign.nurtureCampaign){
            campaignId = this.campaign.campaignId;
        }else{
            campaignId = 0;
        }
        let vanityUrlDomainName = "";
        let vanityUrlCampaign = false;    
        /********Vanity Url Related Code******************** */
        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
            vanityUrlDomainName = this.authenticationService.companyProfileName;
            vanityUrlCampaign = true;
        }

        const data = {
            'campaignName': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.campaignName),
            'fromName': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.fromName),
            'subjectLine': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.subjectLine),
            'email': this.campaign.email,
            'categoryId':this.campaign.categoryId,
            'preHeader': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.preHeader),
            'emailOpened': this.campaign.emailOpened,
            'videoPlayed': this.campaign.videoPlayed,
            'replyVideo': true,
            'channelCampaign': false,
            'linkOpened':this.campaign.linkOpened,
            'emailNotification':true,
            'enableCoBrandingLogo': this.campaign.enableCoBrandingLogo,
            'socialSharingIcons': true,
            'userId': this.authenticationService.getUserId(),
            'selectedVideoId': this.campaign.selectedVideoId,
            'partnerVideoSelected': this.campaign.partnerVideoSelected,
            'userListIds': this.selectedUserlistIds,
            "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
            "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
            'scheduleTime': scheduleTime,
            'timeZoneId': timeZoneId,
            'campaignId': campaignId,
            'selectedEmailTemplateId': this.selectedEmailTemplateId,
            'regularEmail': this.campaign.regularEmail,
            'testEmailId': emailId,
            'campaignReplies': this.replies,
            'campaignUrls': this.urls,
            'campaignType': this.campaign.campaignType,
            'country': country,
            'createdFromVideos': false,
            'nurtureCampaign':true,
            'dataShare':this.campaign.dataShare,
            'detailedAnalyticsShared':this.campaign.detailedAnalyticsShared,
            'parentCampaignId':this.campaign.parentCampaignId,
            'landingPageId':this.selectedLandingPageId,
            'vanityUrlDomainName':vanityUrlDomainName,
            'vanityUrlCampaign':vanityUrlCampaign
        };
        return data;
    }



    getRepliesData(){
        for(var i=0;i< this.replies.length;i++){
            let reply = this.replies[i];
            $('#'+reply.divId).removeClass('portlet light dashboard-stat2 border-error');
            this.removeStyleAttrByDivId('reply-days-'+reply.divId);
            this.removeStyleAttrByDivId('send-time-'+reply.divId);
            this.removeStyleAttrByDivId('message-'+reply.divId);
            this.removeStyleAttrByDivId('reply-subject-'+reply.divId);
            this.removeStyleAttrByDivId('email-template-'+reply.divId);
            this.removeStyleAttrByDivId('reply-message-'+reply.divId);
            $('#'+reply.divId).addClass('portlet light dashboard-stat2');
            this.validateReplySubject(reply);
            this.validateReplyBody(reply);
            if(reply.actionId!==16 && reply.actionId!==17 && reply.actionId!==18){
                this.validateReplyInDays(reply);
                if(reply.actionId!==22 && reply.actionId!==23){
                    this.validateReplyTime(reply);
                }
            }
            var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
            if(errorLength==0){
                this.addEmailNotOpenedReplyDaysSum(reply, i);
                this.addEmailOpenedReplyDaysSum(reply, i);
            }

        }
    }

    validateReplyInDays(reply:Reply){
        if( reply.actionId!== 22 &&  reply.actionId!== 23 && reply.actionId!=33 && reply.replyInDays==null){
           this.addReplyDaysErrorDiv(reply);
        }else if(reply.actionId==22 ||reply.actionId==23 || reply.actionId==33 ){
           if(reply.replyInDays==null || reply.replyInDays==0){
               this.addReplyDaysErrorDiv(reply);
           }
        }
    }

    addReplyDaysErrorDiv(reply:Reply){
        this.addReplyDivError(reply.divId);
        $('#reply-days-'+reply.divId).css('color','red');
    }

    validateReplyTime(reply:Reply){
        if(reply.replyTime==undefined || reply.replyTime==null){
            this.addReplyDivError(reply.divId);
            $('#send-time-'+reply.divId).css('color','red');
        }else{
            reply.replyTime = this.campaignService.setAutoReplyDefaultTime(this.campaignLaunchForm.value.scheduleCampaign, reply.replyInDays,reply.replyTime,this.campaignLaunchForm.value.launchTime);
            reply.replyTimeInHoursAndMinutes = this.extractTimeFromDate(reply.replyTime);
        }
    }

    validateReplySubject(reply:Reply){
        if( reply.subject==null||reply.subject==undefined || $.trim(reply.subject).length==0){
            this.addReplyDivError(reply.divId);
            $('#reply-subject-'+reply.divId).css('color','red');
        }
    }

    validateReplyBody( reply: Reply ) {
        if ( reply.defaultTemplate && reply.selectedEmailTemplateId == 0 ) {
            $( '#' + reply.divId ).addClass( 'portlet light dashboard-stat2 border-error' );
            $( '#email-template-' + reply.divId ).css( 'color', 'red' );
        } else if ( !reply.defaultTemplate && ( reply.body == null || reply.body == undefined || $.trim( reply.body ).length == 0 ) ) {
            $( '#' + reply.divId ).addClass( 'portlet light dashboard-stat2 border-error' );
            $( '#reply-message-' + reply.divId ).css( 'color', 'red' );
        }


    }

    addReplyDivError(divId:string){
        $('#'+divId).addClass('portlet light dashboard-stat2 border-error');
    }
    removeStyleAttrByDivId(divId:string){
        $('#'+divId).removeAttr("style");
    }

    getOnClickData(){
        for(var i=0;i< this.urls.length;i++){
            let url = this.urls[i];
            $('#'+url.divId).removeClass('portlet light dashboard-stat2 border-error');
            this.removeStyleAttrByDivId('click-days-'+url.divId);
            this.removeStyleAttrByDivId('send-time-'+url.divId);
            this.removeStyleAttrByDivId('click-message-'+url.divId);
            this.removeStyleAttrByDivId('click-email-template-'+url.divId);
            this.removeStyleAttrByDivId('click-subject-'+url.divId);
            $('#'+url.divId).addClass('portlet light dashboard-stat2');
            this.validateOnClickSubject(url);
            this.validateOnClickBody(url);
            if(url.actionId==21){
                url.scheduled = true;
                this.validateOnClickReplyTime(url);
                this.validateOnClickReplyInDays(url);
            }else{
                url.scheduled = false;
            }
            var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
            if(errorLength==0){
                this.addOnClickScheduledDaysSum(url, i);
            }
        }
    }

    validateOnClickReplyTime(url:Url){
        if(url.replyTime==undefined || url.replyTime==null){
            this.addReplyDivError(url.divId);
            $('#send-time-'+url.divId).css('color','red');
        }else{
            url.replyTime = this.campaignService.setAutoReplyDefaultTime(this.campaignLaunchForm.value.scheduleCampaign, url.replyInDays,url.replyTime,this.campaignLaunchForm.value.launchTime);
            url.replyTimeInHoursAndMinutes = this.extractTimeFromDate(url.replyTime);
        }
    }

    validateOnClickSubject(url:Url){
        if( url.subject==null||url.subject==undefined || $.trim(url.subject).length==0){
            this.addReplyDivError(url.divId);
            $('#click-subject-'+url.divId).css('color','red');
        }
    }

    validateOnClickBody(url:Url){
        if(url.defaultTemplate && url.selectedEmailTemplateId==0){
            $('#'+url.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#click-email-template-'+url.divId).css('color','red');
        }else if(!url.defaultTemplate &&(url.body==null || url.body==undefined || $.trim(url.body).length==0)){
            $('#'+url.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#click-message-'+url.divId).css('color','red');
        }

    }

    validateOnClickReplyInDays(url:Url){
        if(url.replyInDays==null){
            this.addReplyDivError(url.divId);
            $('#click-days-'+url.divId).css('color','red');
        }
    }



    addEmailNotOpenedReplyDaysSum(reply:Reply,index:number){
        if(reply.actionId==0){
            if(index==0){
                this.emailNotOpenedReplyDaysSum = reply.replyInDays;
            }else{
                this.emailNotOpenedReplyDaysSum = reply.replyInDays+this.emailNotOpenedReplyDaysSum;
            }
            reply.replyInDaysSum = this.emailNotOpenedReplyDaysSum;
        }
    }
    addEmailOpenedReplyDaysSum(reply:Reply,index:number){
        if(reply.actionId==13){
            if(index==0){
                this.emailOpenedReplyDaysSum = reply.replyInDays;
            }else{
                this.emailOpenedReplyDaysSum = reply.replyInDays+this.emailOpenedReplyDaysSum;
            }
            reply.replyInDaysSum = this.emailOpenedReplyDaysSum;
        }
    }

    addOnClickScheduledDaysSum(url:Url,i:number){
        if(i==0){
            this.onClickScheduledDaysSum = url.replyInDays;
        }else{
            this.onClickScheduledDaysSum = url.replyInDays+this.onClickScheduledDaysSum;
            url.replyInDaysSum = this.onClickScheduledDaysSum;
        }
    }

    setUrlScheduleType(event,url:Url){
       //url.scheduled = event.target.value;
       if(event.target.value=="true"){
           url.scheduled = true;
       }else{
           url.scheduled = false;
       }

  }
    highlightRow(contactListId: number,event:any) {
        const isChecked = $('#' + contactListId).is(':checked');
        if (isChecked) {
            $('#campaignContactListTable_'+contactListId).addClass('contact-list-selected');
            if (!this.selectedUserlistIds.includes(contactListId)) {
                this.selectedUserlistIds.push(contactListId);
            }
            $('#' + contactListId).parent().closest('tr').addClass('highlight');
        } else {
            $('#campaignContactListTable_'+contactListId).removeClass('contact-list-selected');
            this.selectedUserlistIds.splice($.inArray(contactListId, this.selectedUserlistIds), 1);
            $('#' + contactListId).parent().closest('tr').removeClass('highlight');
        }
        this.contactsUtility();
        this.getValidUsersCount();
        event.stopPropagation();
    }

    getCampaignReplies( campaign: Campaign ) {
        if ( campaign.campaignReplies != undefined ) {
            this.replies = campaign.campaignReplies;
            for ( var i = 0; i < this.replies.length; i++ ) {
                let reply = this.replies[i];
                if ( reply.actionId != 23 &&  reply.actionId != 22) {
                    reply.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes( reply.replyTimeInHoursAndMinutes );
                    if ( $.trim( reply.subject ).length == 0 ) {
                        reply.subject = campaign.subjectLine;
                    }
                    let length = this.allItems.length;
                    length = length + 1;
                    var id = 'reply-' + length;
                    reply.divId = id;
                    this.allItems.push( id );
                } else {
                    this.replies.pop();
                }
            }
        }
     }

    getCampaignUrls(campaign:Campaign){
        if(campaign.campaignUrls!=undefined){
            this.urls = campaign.campaignUrls;
            for(var i=0;i<this.urls.length;i++){
                let url = this.urls[i];
                if(url.scheduled){
                    url.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes(url.replyTimeInHoursAndMinutes);
                }
                if($.trim(url.subject).length==0){
                    url.subject = campaign.subjectLine;
                }
                let length = this.allItems.length;
                length = length+1;
                var id = 'click-'+length;
                url.divId = id;
                this.allItems.push(id);
            }
        }
    }

    extractTimeFromDate(replyTime){
        //let dt = new Date(replyTime);
        let dt = replyTime;
        let hours = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
        let minutes = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
        return hours+":"+minutes;
    }



    addReplyRows() {
        this.reply = new Reply();
        let length = this.allItems.length;
        length = length + 1;
        var id = 'reply-' + length;
        this.reply.divId = id;
        this.reply.actionId = 0;
        this.reply.subject = this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.subjectLine);
        this.replies.push(this.reply);
        this.allItems.push(id);
    }
    addClickRows() {
        this.url = new Url();
        let length = this.allItems.length;
        length = length + 1
        var id = 'click-' + length;
        this.referenceService.goToDiv(id);
        this.url.divId = id;
        this.url.scheduled = false;
        this.url.actionId = 19;
        this.url.subject = this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.subjectLine);
        this.url.url = this.emailTemplateHrefLinks[0];
        this.urls.push(this.url);
        this.allItems.push(id);
    }

    remove(divId: string, type: string) {
        if (type == "replies") {
            this.replies = this.spliceArray(this.replies, divId);
        } else {
            this.urls = this.spliceArray(this.urls, divId);
        }
        $('#' + divId).remove();
        let index = divId.split('-')[1];
        let editorName = 'editor' + index;
        let errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        if (errorLength == 0) {
            this.dataError = false;
        }
        //CKEDITOR.instances[editorName].destroy();
    }

    spliceArray(arr: any, id: string) {
        arr = $.grep(arr, function (data, index) {
            return data.divId != id
        });
        return arr;
    }

    selectReplyEmailBody(event: any, index: number, reply: Reply) {
        reply.defaultTemplate = event;
    }
    selectClickEmailBody(event: any, index: number, url: Url) {
        url.defaultTemplate = event;
    }
    setReplyEmailTemplate(emailTemplateId: number, reply: Reply, index: number) {
        reply.selectedEmailTemplateId = emailTemplateId;
        $('#reply-' + index + emailTemplateId).prop("checked", true);
    }
    setClickEmailTemplate(emailTemplateId: number, url: Url, index: number) {
        url.selectedEmailTemplateId = emailTemplateId;
        $('#url-' + index + emailTemplateId).prop("checked", true);
    }
    getEmailTemplatePreview(emailTemplate: EmailTemplate) {
        let body = emailTemplate.body;
        let emailTemplateName = emailTemplate.name;
        if (emailTemplateName.length > 50) {
            emailTemplateName = emailTemplateName.substring(0, 50) + "...";
        }
        $("#email-template-content").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplateName);
        $('#email-template-title').prop('title', emailTemplate.name);
        if (this.campaignType == 'video') {
            let selectedVideoGifPath = this.campaign.campaignVideoFile.gifImagePath;
            let updatedBody = emailTemplate.body.replace("<SocialUbuntuImgURL>", selectedVideoGifPath);
            updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;", "javascript:void(0)");
            updatedBody = updatedBody.replace("<SocialUbuntuURL>", "javascript:void(0)");
            updatedBody = updatedBody.replace("https://dummyurl.com", "javascript:void(0)");
            updatedBody = updatedBody.replace("https://aravindu.com/vod/images/xtremand-video.gif", selectedVideoGifPath);
            updatedBody = updatedBody.replace("https://xamp.io/vod/images/xtremand-video.gif", selectedVideoGifPath);
            updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;", selectedVideoGifPath);
            $("#email-template-content").append(updatedBody);
        } else {
            let updatedBody = emailTemplate.body.replace("<div id=\"video-tag\">", "<div id=\"video-tag\" style=\"display:none\">");
            $("#email-template-content").append(updatedBody);
        }
        $('.modal .modal-body').css('overflow-y', 'auto');
        $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        $("#email_template_preivew").modal('show');
    }




    getAnchorLinksFromEmailTemplate(body: string) {
       /* body = this.referenceService.replaceCoBrandingDummyUrlByUserProfile(body);
        let self = this;
        $(body).find('a').each(function (e) {
            let href = $(this).attr('href');
            if(href!=undefined && $.trim(href).length>0){
                if(href!="<SocialUbuntuURL>" && href!="https://dummyurl.com" &&  href!="https://dummycobrandingurl.com" && href!="<unsubscribeURL>"){
                    self.emailTemplateHrefLinks.push(href);
                }

            }
        });
        this.emailTemplateHrefLinks = this.referenceService.removeDuplicates(this.emailTemplateHrefLinks);*/
        body = this.referenceService.replaceCoBrandingDummyUrlByUserProfile(body);
        this.emailTemplateHrefLinks = this.referenceService.getAnchorTagsFromEmailTemplate(body, this.emailTemplateHrefLinks);
    }

    setLaunchTime(){
        var date    = new Date(),
        year      = date.getFullYear(),
        month   = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth(),
        day     = date.getDate()  < 10 ? '0' + date.getDate()  : date.getDate(),
        hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
        minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
        return day+"/"+month+"/"+year+" "+hours+":"+minutes;

    }

    ngOnDestroy(){
        this.campaignService.campaign = undefined;
        this.campaignService.reDistributeCampaign = undefined;
        $('#usersModal').modal('hide');
    }

    /************Pagination-Search-Sort**************************/

    setContactPage(event){
        this.contactListPagination.pageIndex = event.page;
        this.loadContactList(this.contactListPagination);
    }

    /*************************************************************Contact List***************************************************************************************/
    loadContactList(contactsPagination: Pagination) {
        this.campaignContact.httpRequestLoader.isHorizontalCss=true;
        this.referenceService.loading(this.campaignContact.httpRequestLoader, true);
        if(this.campaign.nurtureCampaign){
            contactsPagination.editCampaign = true;
            contactsPagination.campaignId = this.campaign.campaignId;
            contactsPagination.parentCampaignId = this.campaign.parentCampaignId;
        }else{
            contactsPagination.editCampaign = false;
            contactsPagination.parentCampaignId = this.campaign.campaignId;
        }
        contactsPagination.userId = this.loggedInUserId;
        contactsPagination.redistributingCampaign = true;
        if(this.vanityLoginDto.vanityUrlFilter){
            contactsPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
            contactsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
        }
        this.campaignService.listCampaignUsers(contactsPagination)
            .subscribe(
            (data: any) => {
                let response = data.data;
                this.userLists = response.list;
                contactsPagination.totalRecords = response.totalRecords;
                if(contactsPagination.filterBy!=null){
                    if(contactsPagination.filterBy==0){
                        contactsPagination.maxResults = response.totalRecords;
                    }else{
                        contactsPagination.maxResults = contactsPagination.filterBy;
                    }
                }
                this.contactListPagination = this.pagerService.getPagedItems(contactsPagination,this.userLists);
                this.referenceService.loading(this.campaignContact.httpRequestLoader, false);
                var contactIds = this.contactListPagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedUserlistIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                if(items.length==contactIds.length){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }
            },
            (error: string) => this.xtremandLogger.errorPage(error),
            () => this.xtremandLogger.info("Finished loadContactList()", this.contactListPagination)
            );
    }

    showContacts(){
        if($('#campaign-contact-list').css('display') == 'none'){
            this.previewText = "Hide";
        }else{
            this.previewText = "Select";
        }
        $('#campaign-contact-list').toggle(500);
    }
    searchContactList(){
        this.contactListPagination.pageIndex = 1;
        this.contactListPagination.searchKey = this.contactSearchInput;
        if (this.contactListPagination.searchKey != undefined && this.contactListPagination.searchKey != null 
                && this.contactListPagination.searchKey.trim() != "") {
            this.showExpandButton = true;
        } else {
            this.showExpandButton = false;
        }
        this.loadContactList(this.contactListPagination);
    }
    highlightContactRow(contactId:number,event:any,count:number,isValid:boolean){
        if(isValid && !this.campaign.oneClickLaunch){
            this.emptyContactsMessage = "";
            if(count>0){
                let isChecked = $('#'+contactId).is(':checked');
                if(isChecked){
                    //Removing Highlighted Row
                    $('#'+contactId).prop( "checked", false );
                    $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
                    this.selectedUserlistIds.splice($.inArray(contactId,this.selectedUserlistIds),1);
              }else{
                  //Highlighting Row
                  $('#'+contactId).prop( "checked", true );
                  $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
                  this.selectedUserlistIds.push(contactId);
              }
                this.contactsUtility();
                this.getValidUsersCount();
                event.stopPropagation();
            }else{
                this.emptyContactsMessage = "Contacts are in progress";
            }

        }

    }
    contactsUtility(){
        var trLength = $('#user_list_tb tbody tr').length;
        var selectedRowsLength = $('[name="campaignContact[]"]:checked').length;
        if(selectedRowsLength>0 || this.selectedUserlistIds.length>0){
            this.isContactList = true;
        }else{
            this.isContactList = false;
        }
        if(trLength!=selectedRowsLength){
            $('#checkAllExistingContacts').prop("checked",false)
        }else if(trLength==selectedRowsLength){
            $('#checkAllExistingContacts').prop("checked",true);
        }
    }

    checkAll(ev:any){
        if(ev.target.checked){
            $('[name="campaignContact[]"]').prop('checked', true);
            this.isContactList = true;
            let self = this;
            $('[name="campaignContact[]"]:checked').each(function(){
                var id = $(this).val();
                self.selectedUserlistIds.push(parseInt(id));
                $('#campaignContactListTable_'+id).addClass('contact-list-selected');
             });
            this.selectedUserlistIds = this.referenceService.removeDuplicates(this.selectedUserlistIds);
            if(this.selectedUserlistIds.length==0){
                this.isContactList = false;
            }
        }else{
            $('[name="campaignContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("contact-list-selected");
            if(this.contactListPagination.maxResults>30||(this.contactListPagination.maxResults==this.contactListPagination.totalRecords)){
                this.isContactList = false;
                this.selectedUserlistIds = [];
            }else{
                this.selectedUserlistIds = this.referenceService.removeDuplicates(this.selectedUserlistIds);
                let currentPageContactIds = this.contactListPagination.pagedItems.map(function(a) {return a.id;});
                this.selectedUserlistIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedUserlistIds, currentPageContactIds);
                if(this.selectedUserlistIds.length==0){
                    this.isContactList = false;
                }
            }

        }
		this.getValidUsersCount();
        ev.stopPropagation();
    }
    
    showContactsAlert(count:number){
        this.emptyContactsMessage = "";
        if(count==0){
            this.emptyContactsMessage = "No Contacts Found For This Contact List";
        }
    }

    contactSearchInputKey( keyCode: any ) { if ( keyCode === 13 ) { this.searchContactList(); } }
  

  listCategories(){
    this.loading = true;    
    this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
        ( data: any ) => {
            this.categoryNames = data.data;
            let categoryIds = this.categoryNames.map(function (a:any) { return a.id; });
            if(this.campaign.categoryId==0 || this.campaign.categoryId==undefined || categoryIds.indexOf(this.campaign.categoryId)<0){
                this.campaign.categoryId = categoryIds[0];
            }
            this.loading = false;
           
        },
        error => { this.xtremandLogger.error( "error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error ); },
        () => this.xtremandLogger.info( "Finished listCategories()" ) );
}

  isEven(n) {
    if(n % 2 === 0){ return true;}
      return false;
  }

  goToCampaigns(){
      if(this.nurtureCampaign){
        this.goToManageCampaigns();
      }else{
        this.goToRedistributeCampaigns();
      }
      
  }


  launchCampaign() {
      this.validateCampaignName(this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.campaignName));
      if(this.isValidCampaignName){
          this.referenceService.startLoader(this.httpRequestLoader);
          $('#contact-list-error').hide();
          var data = this.getCampaignData("");
          var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
          if(errorLength==0 && this.selectedUserlistIds.length>0){
		 	let message = "";
             if("SAVE"==this.campaignLaunchForm.value.scheduleCampaign){
                message = " saving "
             }else if("SCHEDULE"==this.campaignLaunchForm.value.scheduleCampaign){
                message = " scheduling ";
             }else if("NOW"==this.campaignLaunchForm.value.scheduleCampaign){
                message = " launching ";
             }
             this.referenceService.showSweetAlertProcessingLoader(this.properties.deployingCampaignMessage);
              this.dataError = false;
              this.contactListBorderColor = "silver";
              this.referenceService.goToTop();
              this.campaignService.saveCampaign( data )
              .subscribe(
              response => {
				swal.close();
                if(response.access){
                    if (response.statusCode == 2000) {
                        this.referenceService.campaignSuccessMessage = data.scheduleCampaign;
                        this.referenceService.launchedCampaignType = this.campaignType;
                        this.campaign = null;
                        this.router.navigate(["/home/campaigns/manage"]);
                    } else {
                        this.invalidScheduleTime = true;
                        this.invalidScheduleTimeError = response.message;
                        if(response.statusCode==2016){
                            this.campaignService.addErrorClassToDiv(response.data.emailErrorDivs);
                            this.campaignService.addErrorClassToDiv(response.data.websiteErrorDivs);
                        }
                    }
                }else{
                    this.authenticationService.forceToLogout();
                }
                  this.referenceService.stopLoader(this.httpRequestLoader);
              },
              error => {
				  swal.close();
                  this.hasInternalError = true;
                  let statusCode = JSON.parse(error["status"]);
                  if (statusCode == 400) {
                      this.router.navigate(["/home/campaigns/manage"]);
                      this.referenceService.showSweetAlertErrorMessage("This campaign cannot be updated as we are processing this campaign.");
                  } else {
                    this.xtremandLogger.errorPage(error);
                  }
                  
              },
              () => this.xtremandLogger.info("Finished launchCampaign()")
          );
          }else{
              this.referenceService.stopLoader(this.httpRequestLoader);
              if(this.replies.length>0 ||this.urls.length>0){
                  this.dataError = true;
              }else{
                  this.dataError = false;
              }
              this.setContactListError();
          }
      }else{
          this.referenceService.goToTop();
      }
  return false;
  }
  previewCampaignLandingPage(campaign:Campaign){
      campaign.landingPage.showPartnerCompanyLogo = true;
      campaign.landingPage.partnerId = this.loggedInUserId;
      this.previewLandingPageComponent.showPreview(campaign.landingPage);
  }

  getValidUsersCount() {
      try {
         if(this.selectedUserlistIds.length > 0){
         this.ngxloading = true;
          this.contactService.findAllAndValidUserCounts( this.selectedUserlistIds )
              .subscribe(
              data => {
                  this.validUsersCount = data['validUsersCount'];
                  this.allUsersCount = data['allUsersCount'];
                  this.ngxloading = false;
              },
              ( error: any ) => {
                this.ngxloading = false;
				this.referenceService.showSweetAlertFailureMessage("Unable to find valid contacts count. Please contact admin.");
                  console.log( error );
              },
              () => console.info( "MangeContactsComponent ValidateInvalidContacts() finished" )
              )
         }
      } catch ( error ) {
        this.ngxloading = false;
          console.error( error, "ManageContactsComponent", "removingInvalidUsers()" );
      }
  }
  
  setLinkOpened(event){
      this.campaign.linkOpened = event;
  }

  editPartnerTemplate(){
      this.isEditPartnerTemplate = false;
      if(this.campaign.emailTemplate.vendorCompanyId!=undefined && this.campaign.emailTemplate.vendorCompanyId>0){
          if(this.campaign.emailTemplate.jsonBody!=undefined){
              this.isEditPartnerTemplate = true;
          }else{
              this.referenceService.showSweetAlert( "", "This template cannot be edited.", "error" );
          }
      }else{
          this.referenceService.showSweetAlert( "", "This template can't be edited because the vendor has deleted the campaign.", "error" );
         
      }
  }

  openCreateFolderPopup(){
    this.folderCustomResponse = new CustomResponse('');
    this.addFolderModalPopupComponent.openPopup();
    }

showSuccessMessage(message:any){
  this.folderCustomResponse = new CustomResponse('SUCCESS',message, true);
  this.listCategories();
}

goToManageCampaigns(){
    this.ngxloading = true;
    this.referenceService.goToRouter("/home/campaigns/manage");
}
goToRedistributeCampaigns(){
    this.ngxloading = true;
    this.referenceService.goToRouter("/home/campaigns/partner/all");
}

previewUsers(contactList:any){
    this.showUsersPreview = true;
    this.selectedListName = contactList.name;
    this.selectedListId = contactList.id;
}

resetValues(){
    this.showUsersPreview = false;
    this.selectedListName = "";
    this.selectedListId = 0;
}


viewMatchedContacts(userList: any) {		
    userList.expand = !userList.expand;		
    if (userList.expand) {
        if ((this.expandedUserList != undefined || this.expandedUserList != null)
         && userList != this.expandedUserList) {				
            this.expandedUserList.expand = false;				
        }			
        this.expandedUserList = userList;			
    }
}


openMergeTagsPopup(type:string,autoResponseSubject:any){
    this.mergeTagsInput['isEvent'] = false;
    this.mergeTagsInput['isCampaign'] = true;
    this.mergeTagsInput['hideButton'] = true;
    this.mergeTagsInput['type'] = type;
    this.mergeTagsInput['autoResponseSubject'] = autoResponseSubject;
}

clearHiddenClick(){
    this.mergeTagsInput['hideButton'] = false;
}

appendValueToSubjectLine(event:any){
    if(event!=undefined){
        let type = event['type'];
        let copiedValue = event['copiedValue'];
        if(type=="campaignSubjectLine"){
            let subjectLine = this.campaign.subjectLine;
            let updatedValue = subjectLine+" "+copiedValue;
            this.campaign.subjectLine = updatedValue;
            $('#subjectLine').val(updatedValue);
            this.validateForm();
            this.validateField('subjectLine');
        }else{
             let autoResponse = event['autoResponseSubject'];
            autoResponse.subject = autoResponse.subject+" "+copiedValue;
        }
     }
     this.mergeTagsInput['hideButton'] = false;
    }

    /*****XNFR-125****/
    private showOneClickLaunchCampaignRedistributedInfo() {
        if (this.campaign.oneClickLaunch && this.campaign.oneClickLaunchCampaignRedistributed) {
            let message = "This campaign is already redistributed";
            this.oneClickLaunchCampaignRedistributedMessage = new CustomResponse('INFO', message, true);
        }
    }

    /****XNFR-330****/
    editAutoResponseTemplate(emailTemplate:any,autoResponseId:number){
        this.partnerTemplateLoader = true;
        this.selectedAutoResponseEmailTemplate = emailTemplate;
        this.selectedAutoResponseId = autoResponseId;
        this.isEditAutoResponseTemplate = true;
        this.selectedAutoResponseCustomEmailTemplateId = emailTemplate.customEmailTemplateId;
        this.partnerTemplateLoader = false;

    }
    /****XNFR-330****/
    resetAutoResponseEmailTemplate(){
        this.selectedAutoResponseEmailTemplate = new EmailTemplate();
        this.selectedAutoResponseId = 0;
        this.selectedAutoResponseCustomEmailTemplateId = 0;
        this.isEditAutoResponseTemplate = false;
    }



}
