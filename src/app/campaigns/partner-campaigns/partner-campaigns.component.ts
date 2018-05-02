import { CampaignType } from '../models/campaign-type';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { EmailTemplate } from '../../email-template/models/email-template';
import { CustomResponse } from '../../common/models/custom-response';

import { ReferenceService } from '../../core/services/reference.service';
import { PagerService } from '../../core/services/pager.service';
import { CampaignService } from '../services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
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
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { HttpRequestLoader } from '../../core/models/http-request-loader';


declare var $: any;
@Component({
    selector: 'app-partner-campaigns',
    templateUrl: './partner-campaigns.component.html',
    styleUrls: ['./partner-campaigns.component.css'],
    providers: [DatePipe, CallActionSwitch,HttpRequestLoader,Pagination]
})
export class PartnerCampaignsComponent implements OnInit,OnDestroy {
    selectedEmailTemplateId: number=0;
    loggedInUserId: number;
    campaigns: any;
    campaign: Campaign;
    emailTemplate: EmailTemplate;
    userLists: any;
    isNurture: boolean=false;
    videoFile: any;
    public campaignLaunchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
    campaignLaunchForm: FormGroup;
    buttonName = "Launch";
    isScheduleSelected = false;
    isLoading:boolean  = false;

    contactListPagination: Pagination;
    selectedUserlistIds = [];
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
            'pattern': 'please select atleast one contact list'
        },
        'countryId': {
            'required': 'Country is required.',
            'invalidCountry': 'Country is required.'
        },


    };
    
    
    
    /************Campaign Details******************/
    formGroupClass:string = "form-group";
    campaignNameDivClass:string = this.formGroupClass;
    fromNameDivClass:string =  this.formGroupClass;
    subjectLineDivClass:string = this.formGroupClass;
    fromEmaiDivClass:string = this.formGroupClass;
    preHeaderDivClass:string = this.formGroupClass;
    messageDivClass:string = this.formGroupClass;
    campaignType:string = "";
    isCampaignDetailsFormValid:boolean = false;
    names:string[]=[];
    editedCampaignName:string = "";
    /************Contact List**************/
    contactListBorderColor:string = "silver";
    
    /************Add Reply/Add OnClick**************/
    emailNotOpenedReplyDaysSum:number = 0;
    emailOpenedReplyDaysSum:number = 0;
    onClickScheduledDaysSum:number = 0;
    
    invalidScheduleTime:boolean = false;
    hasInternalError:boolean =false;
    invalidScheduleTimeError:string = "";
    
    /****************Pagination**********************/
    pager: any = {};
    pagedItems: any[];
    public totalRecords: number = 1;
    public searchKey: string = "";
    sortByDropDown = [
                      { 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
                      { 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
                      { 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
                      { 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' }
                  ];

                  numberOfItemsPerPage = [
                      { 'name': '12', 'value': '12' },
                      { 'name': '24', 'value': '24' },
                      { 'name': '48', 'value': '48' },
                      { 'name': '---All---', 'value': '0' },
                  ]

      public selectedSortedOption: any = this.sortByDropDown[3];
      public itemsSize: any = this.numberOfItemsPerPage[0];
      httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
      parterCampaingsPagination:Pagination = new Pagination();

    constructor(private router: Router,
        private route: ActivatedRoute,
        private campaignService: CampaignService,
        private authenticationService: AuthenticationService,
        private contactService: ContactService,
        public referenceService: ReferenceService,
        private pagerService: PagerService,
        private emailTemplateService: EmailTemplateService,
        public callActionSwitch: CallActionSwitch,
        private formBuilder: FormBuilder,
        private xtremandLogger: XtremandLogger) {
        this.countries = this.referenceService.getCountries();
        this.contactListPagination = new Pagination();
        this.contactListPagination.filterKey = 'isPartnerUserList';
        this.contactListPagination.filterValue = false;
       
    }

    
    nurtureCampaign(campaignId: number) {
        this.isNurture = true;
        const data = { 'campaignId': campaignId,'userId':this.loggedInUserId }
        this.campaignService.getParnterCampaignById(data)
            .subscribe(
            result => {
                this.setCampaignData(result);
            },
            error => console.log(error),
            () => { });
    }
    editNurtureCampaign(campaignId:number){
        this.isNurture = true;
        const data = { 'campaignId': campaignId }
        this.campaignService.getCampaignById(data)
            .subscribe(
            result => {
                this.setCampaignData(result);
             
            },
            error => console.log(error),
            () => { });
    
    }
    
    
    setCampaignData(result){
        this.campaign = result;
        const userProfile = this.authenticationService.userProfile;
        this.campaign.email = userProfile.emailId;
        if(userProfile.firstName !== undefined && userProfile.lastName !== undefined)
            this.campaign.fromName = $.trim(userProfile.firstName + " " + userProfile.lastName);
        else if(userProfile.firstName !== undefined && userProfile.lastName === undefined)
            this.campaign.fromName = $.trim(userProfile.firstName);
        else
            this.campaign.fromName = $.trim(userProfile.emailId);
        
        this.setEmailIdAsFromName();

        this.campaign.countryId = this.countries[0].id;
        this.onSelect(this.campaign.countryId);

        this.getCampaignReplies(this.campaign);
        this.getCampaignUrls(this.campaign);

        this.validateLaunchForm();
        this.loadContactList(this.contactListPagination);
        this.getAnchorLinksFromEmailTemplate(this.campaign.emailTemplate.body);
        this.selectedEmailTemplateId = this.campaign.emailTemplate.id;
        if(this.campaign.nurtureCampaign){
            this.selectedUserlistIds = this.campaign.userListIds;
        }
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
        if (this.campaign.fromName.length === 0) {
            this.campaign.fromName = this.campaign.email;
        }
    }

    setEmailOpened(event: any) {
        this.campaign.emailOpened = event;
    }

    setVideoPlayed(event: any) {
        this.campaign.videoPlayed = event;
    }

    
    
    /*************************************************************Campaign Details***************************************************************************************/
    isValidEmail:boolean = false;
    isValidCampaignName:boolean = true;
     validateForm() {
         var isValid = true;
         let self = this;
        $('#campaignDetailsForm input[type="text"]').each(function() {
            if ($.trim($(this).val())=== '' ){
              isValid = false;
          }
             
        });
        if(isValid && this.isValidCampaignName){
            this.isCampaignDetailsFormValid = true;
        }else{
            this.isCampaignDetailsFormValid = false;
        }
        console.log("is Valid Form"+this.isCampaignDetailsFormValid);
      }
     validateEmail(emailId:string){
         console.log(emailId);
         var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
         if(regex.test(emailId)){
             this.isValidEmail = true;
             console.log("Valid Email Id");
         }else{
             this.isValidEmail = false;
             console.log("Invalid Email Id");
         }
     }
     validateCampaignName(campaignName:string){
        // let lowerCaseCampaignName = campaignName.toLowerCase().trim().replace(/\s/g, "");//Remove all spaces
         let lowerCaseCampaignName = $.trim(campaignName.toLowerCase());//Remove all spaces
         var list = this.names[0];
         console.log(list);
         console.log(this.editedCampaignName.toLowerCase()+":::::::::"+lowerCaseCampaignName);
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
             if(fieldValue.length>0){
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
    
   /* listPartnerCampaigns(userId: number, campaignType: string) {
        this.campaignService.listPartnerCampaigns(userId, campaignType)
            .subscribe(
            result => { this.campaigns = result; },
            error => console.log(error),
            () => { });
    }*/
    
    
    listPartnerCampaigns(pagination:Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        if(this.campaignType=="regular"){
            pagination.campaignType = "REGULAR";
        }else if(this.campaignType=="video"){
            pagination.campaignType="VIDEO";
        }else if(this.campaignType=="social"){
            pagination.campaignType = "SOCIAL";
        }
        this.campaignService.listPartnerCampaigns(this.parterCampaingsPagination, this.loggedInUserId)
            .subscribe(
                data => {
                    console.log(data);
                    this.campaigns = data.campaigns;
                    this.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                error => {
                    this.xtremandLogger.errorPage(error);
                },
                () => this.xtremandLogger.info("Finished listPartnerCampaigns()", this.campaigns)
            );
    }
    
    

    filterCampaigns(type: string) {
        this.router.navigate(['/home/campaigns/partner/' + type]);
    }


   
    validateLaunchForm(): void {
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
        if (this.campaignLaunchForm['_value'].scheduleCampaign != null) { this.isScheduleSelected = true }
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

    previewEmailTemplate(emailTemplate: EmailTemplate) {
        const body = emailTemplate.body;
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
            updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;", selectedVideoGifPath);
            $("#email-template-content").append(updatedBody);
        } else {
            let updatedBody = emailTemplate.body.replace("<div id=\"video-tag\">", "<div id=\"video-tag\" style=\"display:none\">");
            $("#email-template-content").append(updatedBody);
        }

        $('.modal .modal-body').css('overflow-y', 'auto');
        $("#email_template_preivew").modal('show');
        $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
    }

    loadContactList(contactListPagination: Pagination) {
        this.contactService.loadContactLists(contactListPagination)
            .subscribe(
            (data: any) => {
                this.xtremandLogger.info("contactListPagination:-->", data);
                this.userLists = data["listOfUserLists"];
            },
            (error: string) => this.xtremandLogger.errorPage(error),
            () => this.xtremandLogger.info("Finished loadContactList()", this.contactListPagination)
            )
    }
    launchCampaign() {
        this.isLoading = true;
        $('#contact-list-error').hide();
        var data = this.getCampaignData("");
        var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        if(errorLength===0 && this.selectedUserlistIds.length>0){
            this.dataError = false;
            this.contactListBorderColor = "silver";
            this.referenceService.goToTop();
            this.campaignService.saveCampaign( data )
            .subscribe(
            response => {
                this.isNurture = true;
                if (response.statusCode === 2000) {
                    this.referenceService.campaignSuccessMessage = data.scheduleCampaign;
                    this.campaign = null;
                    this.router.navigate(["/home/campaigns/manage"]);
                } else {
                    this.isLoading = false;
                    this.invalidScheduleTime = true;
                    this.invalidScheduleTimeError = response.message;
                }
                
            },
            error => {
                this.hasInternalError = true;
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info("Finished launchCampaign()")
        ); 
        }else{
            this.isLoading = false;
            if(this.replies.length>0 ||this.urls.length>0){
                this.dataError = true;
            }else{
                this.dataError = false;
            }
            this.setContactListError();
        }
    return false;
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
        let campaignType = CampaignType.REGULAR;
        if ("regular" === this.campaignType) {
            campaignType = CampaignType.REGULAR;
        } else if ("video" === this.campaignType) {
            campaignType = CampaignType.VIDEO;
        }
        // Enable work flow is disabled
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
        if( this.campaignLaunchForm.value.scheduleCampaign==="NOW"){
            timeZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;
            scheduleTime = this.setLaunchTime();
        }else{
         //   timeZoneId = this.campaignLaunchForm.value.timeZoneId;
            timeZoneId = $('#timezoneId option:selected').val();
            scheduleTime = this.campaignLaunchForm.value.launchTime;
        }
        let campaignId = 0;
        if(this.campaign.nurtureCampaign){
            campaignId = this.campaign.campaignId;
        }else{
            campaignId = 0;
        }
        const data = {
            'campaignName': this.campaign.campaignName,
            'fromName': this.campaign.fromName,
            'subjectLine': this.campaign.subjectLine,
            'email': this.campaign.email,
            'preHeader': this.campaign.preHeader,
            'emailOpened': this.campaign.emailOpened,
            'videoPlayed': this.campaign.videoPlayed,
            'replyVideo': true,
            'channelCampaign': false,
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
            'campaignType': campaignType,
            'country': country,
            'createdFromVideos': this.campaign.createdFromVideos,
            'nurtureCampaign':true
        };
        console.log(data);
        return data;
    }

    
    
    getRepliesData(){
        for(var i=0;i<this.replies.length;i++){
            let reply = this.replies[i];
            $('#'+reply.divId).removeClass('portlet light dashboard-stat2 border-error');
            this.removeStyleAttrByDivId('reply-days-'+reply.divId);
            this.removeStyleAttrByDivId('send-time-'+reply.divId);
            this.removeStyleAttrByDivId('message-'+reply.divId);
            this.removeStyleAttrByDivId('email-template-'+reply.divId);
            this.removeStyleAttrByDivId('reply-message-'+reply.divId);
            $('#'+reply.divId).addClass('portlet light dashboard-stat2');
            this.validateReplySubject(reply);
            if(reply.actionId!==16 && reply.actionId!==17 && reply.actionId!==18){
                this.validateReplyInDays(reply);
                if(reply.actionId!==22 && reply.actionId!==23){
                    this.validateReplyTime(reply);
                }
                this.validateEmailTemplateForAddReply(reply);
            }else{
                this.validateEmailTemplateForAddReply(reply);
            }
            var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
            if(errorLength===0){
                this.addEmailNotOpenedReplyDaysSum(reply, i);
                this.addEmailOpenedReplyDaysSum(reply, i);
            }
           
        }
    }
   
    validateReplyInDays(reply:Reply){
        if( reply.actionId!== 22 &&  reply.actionId!== 23 && reply.replyInDays===null){
           this.addReplyDaysErrorDiv(reply);
        }else if(reply.actionId===22 ||reply.actionId===23 ){
           if(reply.replyInDays===null || reply.replyInDays===0){
               this.addReplyDaysErrorDiv(reply);
           }
        }
    }
    
    addReplyDaysErrorDiv(reply:Reply){
        this.addReplyDivError(reply.divId);
        $('#reply-days-'+reply.divId).css('color','red');
    }
    
    validateReplyTime(reply:Reply){
        if(reply.replyTime===undefined || reply.replyTime===null){
            this.addReplyDivError(reply.divId);
            $('#send-time-'+reply.divId).css('color','red');
        }else{
            reply.replyTimeInHoursAndMinutes = this.extractTimeFromDate(reply.replyTime);
        }
    }
    
    validateReplySubject(reply:Reply){
        if( reply.subject==null||reply.subject===undefined || $.trim(reply.subject).length===0){
            this.addReplyDivError(reply.divId);
            console.log("Added Reply Subject Eror");
            $('#reply-subject-'+reply.divId).css('color','red');
        }
    }
    
    validateEmailTemplateForAddReply(reply:Reply){
        if(reply.defaultTemplate && reply.selectedEmailTemplateId===0){
            $('#'+reply.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#email-template-'+reply.divId).css('color','red');
        }else if(!reply.defaultTemplate &&(reply.body===null || reply.body===undefined || $.trim(reply.body).length===0)){
            $('#'+reply.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#reply-message-'+reply.divId).css('color','red');
        }
    }
    
    addReplyDivError(divId:string){
        $('#'+divId).addClass('portlet light dashboard-stat2 border-error');
    }
    removeStyleAttrByDivId(divId:string){
        $('#'+divId).removeAttr("style");
    }
    
    getOnClickData(){
        for(var i=0;i<this.urls.length;i++){
            let url = this.urls[i];
            url.replyTimeInHoursAndMinutes = this.extractTimeFromDate(url.replyTime);
            $('#'+url.divId).removeClass('portlet light dashboard-stat2 border-error');
            this.removeStyleAttrByDivId('click-days-'+url.divId);
            this.removeStyleAttrByDivId('click-send-time-'+url.divId);
            this.removeStyleAttrByDivId('click-message-'+url.divId);
            this.removeStyleAttrByDivId('click-email-template-'+url.divId);
            this.removeStyleAttrByDivId('click-subject-'+url.divId);
            $('#'+url.divId).addClass('portlet light dashboard-stat2');
            console.log(url.scheduled);
            if(url.actionId===21){
                url.scheduled = true;
                console.log("1632");
                this.validateOnClickReplyTime(url);
                this.validateOnClickSubject(url);
                this.validateOnClickReplyInDays(url);
                this.validateEmailTemplateForAddOnClick(url);
            }else{
                url.scheduled = false;
                console.log("1637");
                this.validateOnClickSubject(url);
                this.validateEmailTemplateForAddOnClick(url);
            }
            var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
            if(errorLength===0){
                this.addOnClickScheduledDaysSum(url, i);
            }
            console.log(errorLength);
        }
    }
    
    validateOnClickReplyTime(url:Url){
        if(url.replyTime===undefined || url.replyTime===null){
            this.addReplyDivError(url.divId);
            $('#click-send-time-'+url.divId).css('color','red');
        }
    }
    
    validateOnClickSubject(url:Url){
        if( url.subject===null||url.subject===undefined || $.trim(url.subject).length===0){
            this.addReplyDivError(url.divId);
            console.log("Added Subject Eror");
            $('#click-subject-'+url.divId).css('color','red');
        }
    }
    
    validateOnClickBody(url:Url){
        if(url.body===null || url.body===undefined || $.trim(url.body).length===0){
            this.addReplyDivError(url.divId);
            $('#click-message-'+url.divId).css('color','red');
        }
    }
    
    validateOnClickReplyInDays(url:Url){
        if(url.replyInDays===null){
            this.addReplyDivError(url.divId);
            $('#click-days-'+url.divId).css('color','red');
        }
    }
    
    validateEmailTemplateForAddOnClick(url:Url){
        if(url.defaultTemplate && url.selectedEmailTemplateId===0){
            console.log("Email Template Error Added For Choose Template On");
            $('#'+url.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#click-email-template-'+url.divId).css('color','red');
        }else if(!url.defaultTemplate &&(url.body===null || url.body===undefined || $.trim(url.body).length===0)){
            console.log("Email Template Error Added For Choose Template Off");
            $('#'+url.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#click-message-'+url.divId).css('color','red');
        }
    }
    
    
    addEmailNotOpenedReplyDaysSum(reply:Reply,index:number){
        if(reply.actionId===0){
            if(index===0){
                this.emailNotOpenedReplyDaysSum = reply.replyInDays;
            }else{
                this.emailNotOpenedReplyDaysSum = reply.replyInDays+this.emailNotOpenedReplyDaysSum;
            }
            reply.replyInDaysSum = this.emailNotOpenedReplyDaysSum;
        }
    }
    addEmailOpenedReplyDaysSum(reply:Reply,index:number){
        if(reply.actionId===13){
            if(index===0){
                this.emailOpenedReplyDaysSum = reply.replyInDays;
            }else{
                this.emailOpenedReplyDaysSum = reply.replyInDays+this.emailOpenedReplyDaysSum;
            }
            reply.replyInDaysSum = this.emailOpenedReplyDaysSum;
        }
    }
    
    addOnClickScheduledDaysSum(url:Url,i:number){
        if(i===0){
            this.onClickScheduledDaysSum = url.replyInDays;
        }else{
            this.onClickScheduledDaysSum = url.replyInDays+this.onClickScheduledDaysSum;
            url.replyInDaysSum = this.onClickScheduledDaysSum;
        }
    }
    
    setUrlScheduleType(event,url:Url){
       //url.scheduled = event.target.value;
       if(event.target.value==="true"){
           url.scheduled = true;
       }else{
           url.scheduled = false;
       }
       
  }
    
    
    
    
    
    
    
    highlightRow(contactListId: number) {
        const isChecked = $('#' + contactListId).is(':checked');
        if (isChecked) {
            if (!this.selectedUserlistIds.includes(contactListId)) {
                this.selectedUserlistIds.push(contactListId);
            }
            $('#' + contactListId).parent().closest('tr').addClass('highlight');
        } else {
            this.selectedUserlistIds.splice($.inArray(contactListId, this.selectedUserlistIds), 1);
            $('#' + contactListId).parent().closest('tr').removeClass('highlight');
        }
    }

    getCampaignReplies(campaign: Campaign) {
        if(campaign.campaignReplies!=undefined){
            this.replies = campaign.campaignReplies;
            for(var i=0;i<this.replies.length;i++){
                let reply = this.replies[i];
                if(reply.defaultTemplate){
                    reply.selectedEmailTemplateIdForEdit = reply.selectedEmailTemplateId;
                }
                reply.emailTemplatesPagination = new Pagination();
                reply.replyTime = new Date(reply.replyTime);
                reply.replyTimeInHoursAndMinutes = this.extractTimeFromDate(reply.replyTime);
                if($.trim(reply.subject).length==0){
                    reply.subject = campaign.subjectLine;
                }
                let length = this.allItems.length;
                length = length+1;
                var id = 'reply-'+length;
                reply.divId = id;
                this.allItems.push(id);
                this.loadEmailTemplatesForAddReply(reply);
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
    getCampaignUrls(campaign:Campaign){
        if(campaign.campaignUrls!=undefined){
            this.urls = campaign.campaignUrls;
            for(var i=0;i<this.urls.length;i++){
                let url = this.urls[i];
                if(url.defaultTemplate){
                    url.selectedEmailTemplateIdForEdit = url.selectedEmailTemplateId;
                }
                url.emailTemplatesPagination = new Pagination();
                url.replyTime = new Date(url.replyTime);
                url.replyTimeInHoursAndMinutes = this.extractTimeFromDate(url.replyTime);
                let length = this.allItems.length;
                length = length+1;
                var id = 'click-'+length;
                url.divId = id;
                this.allItems.push(id);
                this.loadEmailTemplatesForAddOnClick(url);
            }
        }
       
    }
    
    loadEmailTemplatesForAddReply(reply: Reply) {
        this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss = true;
        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        reply.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        if (reply.emailTemplatesPagination.searchKey == null || reply.emailTemplatesPagination.searchKey == "") {
            reply.emailTemplatesPagination.campaignDefaultTemplate = true;
        } else {
            reply.emailTemplatesPagination.campaignDefaultTemplate = false;
            reply.emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
        }
        reply.emailTemplatesPagination.maxResults = 12;
        this.emailTemplateService.listTemplates(reply.emailTemplatesPagination, this.loggedInUserId)
            .subscribe(
            (data: any) => {
                reply.emailTemplatesPagination.totalRecords = data.totalRecords;
                reply.emailTemplatesPagination = this.pagerService.getPagedItems(reply.emailTemplatesPagination, data.emailTemplates);
                this.filterReplyrEmailTemplateForEditCampaign(reply);
                this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error: string) => {
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info("Finished loadEmailTemplatesForAddReply()", reply.emailTemplatesPagination)
            )
    }

    loadEmailTemplatesForAddOnClick(url: Url) {
        this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss = true;
        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        url.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        if (url.emailTemplatesPagination.searchKey == null || url.emailTemplatesPagination.searchKey == "") {
            url.emailTemplatesPagination.campaignDefaultTemplate = true;
        } else {
            url.emailTemplatesPagination.campaignDefaultTemplate = false;
            url.emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
        }
        url.emailTemplatesPagination.maxResults = 12;
        this.emailTemplateService.listTemplates(url.emailTemplatesPagination, this.loggedInUserId)
            .subscribe(
            (data: any) => {
                url.emailTemplatesPagination.totalRecords = data.totalRecords;
                url.emailTemplatesPagination = this.pagerService.getPagedItems(url.emailTemplatesPagination, data.emailTemplates);
                this.filterClickEmailTemplateForEditCampaign(url);
                this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error: string) => {
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info("Finished loadEmailTemplatesForAddOnClick()", url.emailTemplatesPagination)
            )
    }

    filterReplyrEmailTemplateForEditCampaign(reply: Reply) {
        if (reply.emailTemplatesPagination.emailTemplateType == 0 && reply.emailTemplatesPagination.searchKey == null) {
            if (reply.emailTemplatesPagination.pageIndex == 1) {
                reply.showSelectedEmailTemplate = true;
            } else {
                reply.showSelectedEmailTemplate = false;
            }
        } else {
            let emailTemplateIds = reply.emailTemplatesPagination.pagedItems.map(function (a) { return a.id; });
            if (emailTemplateIds.indexOf(reply.selectedEmailTemplateIdForEdit) > -1) {
                reply.showSelectedEmailTemplate = true;
            } else {
                reply.showSelectedEmailTemplate = false;
            }
        }
    }

    filterClickEmailTemplateForEditCampaign(url: Url) {
        if (url.emailTemplatesPagination.emailTemplateType == 0 && url.emailTemplatesPagination.searchKey == null) {
            if (url.emailTemplatesPagination.pageIndex == 1) {
                url.showSelectedEmailTemplate = true;
            } else {
                url.showSelectedEmailTemplate = false;
            }
        } else {
            let emailTemplateIds = url.emailTemplatesPagination.pagedItems.map(function (a) { return a.id; });
            if (emailTemplateIds.indexOf(url.selectedEmailTemplateIdForEdit) > -1) {
                url.showSelectedEmailTemplate = true;
            } else {
                url.showSelectedEmailTemplate = false;
            }
        }
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
        this.loadEmailTemplatesForAddReply(this.reply);
    }
    addClickRows() {
        this.url = new Url();
        let length = this.allItems.length;
        length = length + 1
        var id = 'click-' + length;
        this.url.divId = id;
        this.url.scheduled = false;
        this.url.actionId = 19;
        this.url.url = this.emailTemplateHrefLinks[0];
        this.urls.push(this.url);
        this.allItems.push(id);
        this.loadEmailTemplatesForAddOnClick(this.url);
    }

    remove(divId: string, type: string) {
        if (type == "replies") {
            this.replies = this.spliceArray(this.replies, divId);
            console.log(this.replies);
        } else {
            this.urls = this.spliceArray(this.urls, divId);
            console.log(this.urls);
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

    filterReplyTemplates(type: string, index: number, reply: Reply) {
        if (type == "BASIC") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.BASIC;
        } else if (type == "RICH") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.RICH;
        } else if (type == "UPLOADED") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.UPLOADED;
        } else if (type == "NONE") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
        }
        else if (type == "PARTNER") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.PARTNER;
        }
        reply.selectedEmailTemplateTypeIndex = index;
        reply.emailTemplatesPagination.pageIndex = 1;
        this.loadEmailTemplatesForAddReply(reply);
    }

    filterClickTemplates(type: string, index: number, url: Url) {
        if (type == "BASIC") {
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.BASIC;
        } else if (type == "RICH") {
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.RICH;
        } else if (type == "UPLOADED") {
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.UPLOADED;
        } else if (type == "NONE") {
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
        }
        else if (type == "PARTNER") {
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.PARTNER;
        }
        url.selectedEmailTemplateTypeIndex = index;
        url.emailTemplatesPagination.pageIndex = 1;
        this.loadEmailTemplatesForAddOnClick(url);
    }
    searchReplyEmailTemplate(reply: Reply) {
        reply.emailTemplatesPagination.pageIndex = 1;
        reply.emailTemplatesPagination.searchKey = reply.emailTemplateSearchInput;
        this.loadEmailTemplatesForAddReply(reply);
    }



    searchClickEmailTemplate(url: Url) {
        url.emailTemplatesPagination.pageIndex = 1;
        url.emailTemplatesPagination.searchKey = url.emailTemplateSearchInput;
        this.loadEmailTemplatesForAddOnClick(url);
    }
    getAnchorLinksFromEmailTemplate(body: string) {
        $('#emailTemplateContent').html('');
        $('#emailTemplateContent').append(body);
        console.log($('#emailTemplateContent').find('a'));
        let self = this;
        $('#emailTemplateContent').find('a').each(function (e) {
            let href = $(this).attr('href');
            self.emailTemplateHrefLinks.push(href);
        });
        this.emailTemplateHrefLinks = this.referenceService.removeDuplicates(this.emailTemplateHrefLinks);
        var index = $.inArray("<SocialUbuntuURL>", this.emailTemplateHrefLinks);
        if (index >= 0) {
            this.emailTemplateHrefLinks.splice(index, 1);
        }
        console.log(this.emailTemplateHrefLinks);
    }
    ngOnInit() {
        this.campaignType = this.route.snapshot.params['type'];
        this.loggedInUserId = this.authenticationService.getUserId();
        this.loadCampaignNames( this.loggedInUserId );       
        this.parterCampaingsPagination.maxResults = 12;
        this.listPartnerCampaigns(this.parterCampaingsPagination);
        if(this.referenceService.isEditNurtureCampaign){
            this.editNurtureCampaign(this.referenceService.nurtureCampaignId);
        }
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
        this.isNurture = false;
        this.referenceService.isEditNurtureCampaign = false;
    }
    
    /************Pagination-Search-Sort**************************/
    setPage(event) {
        this.parterCampaingsPagination.pageIndex = event.page;
        this.listPartnerCampaigns(this.parterCampaingsPagination);
    }

    searchCampaigns() {
        this.getAllFilteredResults(this.parterCampaingsPagination);
    }

    getSortedResult(text: any) {
        this.selectedSortedOption = text;
        this.getAllFilteredResults(this.parterCampaingsPagination);
    }

    getNumberOfItemsPerPage(items: any) {
        this.itemsSize = items;
        this.getAllFilteredResults(this.parterCampaingsPagination);
    }



    getAllFilteredResults(pagination: Pagination) {
        this.parterCampaingsPagination.pageIndex = 1;
        this.parterCampaingsPagination.searchKey = this.searchKey;
        let sortedValue = this.selectedSortedOption.value;
        if (sortedValue != "") {
            let options: string[] = sortedValue.split("-");
            this.parterCampaingsPagination.sortcolumn = options[0];
            this.parterCampaingsPagination.sortingOrder = options[1];
        }

        if (this.itemsSize.value == 0) {
            this.parterCampaingsPagination.maxResults = this.parterCampaingsPagination.totalRecords;
        } else {
            this.parterCampaingsPagination.maxResults = this.itemsSize.value;
        }
        this.listPartnerCampaigns(this.parterCampaingsPagination);
    }

}
