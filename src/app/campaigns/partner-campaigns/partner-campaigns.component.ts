import { CampaignType } from '../models/campaign-type';
import { Component, OnInit } from '@angular/core';
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
declare var $: any;
@Component({
  selector: 'app-partner-campaigns',
  templateUrl: './partner-campaigns.component.html',
  styleUrls: ['./partner-campaigns.component.css'],
  providers: [DatePipe, CallActionSwitch]
})
export class PartnerCampaignsComponent implements OnInit {
  loggedInUserId: number;
  campaigns: any;
  campaign:Campaign;
  emailTemplate: EmailTemplate;
  userLists: any;
  isNurture: boolean;
  videoFile: any;
  public campaignLaunchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
  campaignLaunchForm: FormGroup;
  buttonName = "Launch";
  isScheduleSelected = false;
  campaignType: string;

  contactListPagination:Pagination;
  selectedUserlistIds = [];
  customResponse: CustomResponse = new CustomResponse();
  countries: Country[];
  timezones: Timezone[];
  replies:Array<Reply> = new Array<Reply>();
  urls:Array<Url> = new Array<Url>();
  date:Date;
  reply:Reply=new Reply();
  url:Url = new Url();
  allItems= [];
  campaignEmailTemplate:CampaignEmailTemplate = new CampaignEmailTemplate();
  dataError:boolean = false;
  emailTemplateHrefLinks:any[] = [];
  
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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private authenticationService: AuthenticationService,
    private contactService:ContactService,
    public referenceService:ReferenceService,
    private pagerService: PagerService,
    private emailTemplateService:EmailTemplateService,
    public callActionSwitch: CallActionSwitch,
    private formBuilder: FormBuilder,
    private xtremandLogger: XtremandLogger) {
          this.countries = this.referenceService.getCountries();
          this.contactListPagination = new Pagination();
          this.contactListPagination.filterKey = 'isPartnerUserList';
          this.contactListPagination.filterValue = false;
     }

  listPartnerCampaigns(userId: number, campaignType: string) {
    this.campaignService.listPartnerCampaigns(userId, campaignType)
      .subscribe(
      result => { this.campaigns = result; },
      error => console.log(error),
      () => { });
  }

  filterCampaigns(type: string) {
    this.router.navigate(['/home/campaigns/partner/' + type]);
  }

  nurtureCampaign(campaignId: number) {
    this.isNurture = true;
    const data = { 'campaignId': campaignId }
    this.campaignService.getCampaignById(data)
      .subscribe(
      result => {
        this.campaign = result;
        const userProfile = this.authenticationService.userProfile;
        this.campaign.email = userProfile.emailId;
        this.campaign.fromName = $.trim(userProfile.firstName + " " + userProfile.lastName);
        this.setEmailIdAsFromName();

        this.campaign.countryId = this.countries[0].id;
        this.onSelect(this.campaign.countryId);

        this.getCampaignReplies(this.campaign);
        this.getCampaignUrls(this.campaign);
        
        this.validateLaunchForm();
        this.loadContactList(this.contactListPagination);
        this.getAnchorLinksFromEmailTemplate(this.campaign.emailTemplate.body);
      },
      error => console.log(error),
      () => { });
  }
  
  onSelect(countryId) {
      this.timezones = this.referenceService.getTimeZones().filter((item)=> item.countryId == countryId);
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

  previewEmailTemplate(emailTemplate:EmailTemplate){
      const body = emailTemplate.body;
      let emailTemplateName = emailTemplate.name;
      if(emailTemplateName.length>50){
          emailTemplateName = emailTemplateName.substring(0, 50)+"...";
      }
      $("#email-template-content").empty();
      $("#email-template-title").empty();
      $("#email-template-title").append(emailTemplateName);
      $('#email-template-title').prop('title',emailTemplate.name);
      
      if(this.campaignType=='video'){
          let selectedVideoGifPath = this.campaign.campaignVideoFile.gifImagePath;
          let updatedBody = emailTemplate.body.replace("<SocialUbuntuImgURL>",selectedVideoGifPath);
          updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;","javascript:void(0)");
          updatedBody = updatedBody.replace("<SocialUbuntuURL>","javascript:void(0)");
          updatedBody = updatedBody.replace("https://dummyurl.com","javascript:void(0)");
          updatedBody = updatedBody.replace("https://aravindu.com/vod/images/xtremand-video.gif",selectedVideoGifPath);
          updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;",selectedVideoGifPath);
          $("#email-template-content").append(updatedBody);
      }else{
          let updatedBody = emailTemplate.body.replace("<div id=\"video-tag\">","<div id=\"video-tag\" style=\"display:none\">");
          $("#email-template-content").append(updatedBody);
      }

      $('.modal .modal-body').css('overflow-y', 'auto'); 
      $("#email_template_preivew").modal('show');
      $('.modal .modal-body').css('max-height', $(window).height() * 0.75);      
  }

    loadContactList(contactListPagination:Pagination) {
        this.contactService.loadContactLists(contactListPagination)
            .subscribe(
              (data:any) => {
                this.xtremandLogger.info("contactListPagination:-->", data);
                this.userLists = data["listOfUserLists"];
              },
              (error:string) => this.xtremandLogger.errorPage(error),
              () => this.xtremandLogger.info("Finished loadContactList()", this.contactListPagination)
            )
    }
    launchCampaign(){
        var data = this.getCampaignData("");
            this.campaignService.saveCampaign( data )
            .subscribe(
            response => {
                this.isNurture = true;
                if(response.statusCode === 2000){
                    this.customResponse = new CustomResponse('SUCCESS', 'Campaign has been launched successfully.', true);
                    this.campaign = null;
                    this.router.navigate(["/home/campaigns/manage"]);
                }else{
                    this.customResponse = new CustomResponse('ERROR', 'An error occurred while launching the campaign.', true);
                }
            },
            error => {
              this.xtremandLogger.errorPage(error);
              this.customResponse = new CustomResponse('ERROR', 'An error occurred while launching the campaign.', true);            
          },
            () => this.xtremandLogger.info("Finished launchCampaign()")
        ); 
    return false;
    }  

    getCampaignData( emailId: string ) {
        let campaignType = CampaignType.REGULAR;
        if("regular" === this.campaignType){
            campaignType = CampaignType.REGULAR;
        }else if("video" === this.campaignType){
            campaignType = CampaignType.VIDEO;
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
            'channelCampaign':false,
            'enableCoBrandingLogo':this.campaign.enableCoBrandingLogo,
            'socialSharingIcons': true,
            'userId': this.authenticationService.getUserId(),
            'selectedVideoId': this.campaign.selectedVideoId,
            'partnerVideoSelected':this.campaign.partnerVideoSelected,
            'userListIds': this.selectedUserlistIds,
            "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
            "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
            'scheduleTime': this.campaignLaunchForm.value.launchTime,
            'timeZoneId':"Asia/Calcutta",
            'campaignId': 0,
            'selectedEmailTemplateId': this.campaign.emailTemplate.id,
            'regularEmail': this.campaign.regularEmail,
            'testEmailId': emailId,
            'campaignReplies':this.replies,
            'campaignUrls':this.urls,
            'campaignType':campaignType,
            'country':"---Please Select Country---",
            'createdFromVideos':this.campaign.createdFromVideos
        };
        return data;
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

    getCampaignReplies(campaign:Campaign){
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
               let length = this.allItems.length;
               length = length+1;
               var id = 'reply-'+length;
               reply.divId = id;
               this.allItems.push(id);
               this.loadEmailTemplatesForAddReply(reply);
           } 
       }
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
   extractTimeFromDate(replyTime){
       let dt = replyTime;
       let hours = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
       let minutes = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
       return hours+":"+minutes;
   } 
    loadEmailTemplatesForAddReply(reply:Reply){
        this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss=true;
        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        reply.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        if(reply.emailTemplatesPagination.searchKey==null || reply.emailTemplatesPagination.searchKey==""){
            reply.emailTemplatesPagination.campaignDefaultTemplate = true;
        }else{
            reply.emailTemplatesPagination.campaignDefaultTemplate = false;
            reply.emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
        }
        reply.emailTemplatesPagination.maxResults = 12;
        this.emailTemplateService.listTemplates(reply.emailTemplatesPagination,this.loggedInUserId)
        .subscribe(
            (data:any) => {
                reply.emailTemplatesPagination.totalRecords = data.totalRecords;
                reply.emailTemplatesPagination = this.pagerService.getPagedItems(reply.emailTemplatesPagination, data.emailTemplates);
                this.filterReplyrEmailTemplateForEditCampaign(reply);
                this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error:string) => {
               this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info("Finished loadEmailTemplatesForAddReply()",reply.emailTemplatesPagination)
            )
    }
    
    loadEmailTemplatesForAddOnClick(url:Url){
        this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss=true;
        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        url.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        if(url.emailTemplatesPagination.searchKey==null || url.emailTemplatesPagination.searchKey==""){
            url.emailTemplatesPagination.campaignDefaultTemplate = true;
        }else{
            url.emailTemplatesPagination.campaignDefaultTemplate = false;
            url.emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
        }
        url.emailTemplatesPagination.maxResults = 12;
        this.emailTemplateService.listTemplates(url.emailTemplatesPagination,this.loggedInUserId)
        .subscribe(
            (data:any) => {
                url.emailTemplatesPagination.totalRecords = data.totalRecords;
                url.emailTemplatesPagination = this.pagerService.getPagedItems(url.emailTemplatesPagination, data.emailTemplates);
                this.filterClickEmailTemplateForEditCampaign(url);
                this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error:string) => {
               this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info("Finished loadEmailTemplatesForAddOnClick()",url.emailTemplatesPagination)
            )
    }
    
    filterReplyrEmailTemplateForEditCampaign(reply:Reply){
        if(reply.emailTemplatesPagination.emailTemplateType==0 && reply.emailTemplatesPagination.searchKey==null){
            if(reply.emailTemplatesPagination.pageIndex==1){
                reply.showSelectedEmailTemplate=true;
            }else{
                reply.showSelectedEmailTemplate=false;
            }
        }else{
            let emailTemplateIds = reply.emailTemplatesPagination.pagedItems.map(function(a) {return a.id;});
            if(emailTemplateIds.indexOf(reply.selectedEmailTemplateIdForEdit)>-1){
                reply.showSelectedEmailTemplate=true;
            }else{
                reply.showSelectedEmailTemplate=false;
            }
        }
    } 
    
    filterClickEmailTemplateForEditCampaign(url:Url){
        if(url.emailTemplatesPagination.emailTemplateType==0 && url.emailTemplatesPagination.searchKey==null){
            if(url.emailTemplatesPagination.pageIndex==1){
                url.showSelectedEmailTemplate=true;
            }else{
                url.showSelectedEmailTemplate=false;
            }
        }else{
            let emailTemplateIds = url.emailTemplatesPagination.pagedItems.map(function(a) {return a.id;});
            if(emailTemplateIds.indexOf(url.selectedEmailTemplateIdForEdit)>-1){
                url.showSelectedEmailTemplate=true;
            }else{
                url.showSelectedEmailTemplate=false;
            }
        }
    }

    addReplyRows() {
        this.reply = new Reply();
        $('.bs-timepicker-field').attr("disabled",'disabled');
        let length = this.allItems.length;
        length = length+1;
        var id = 'reply-'+length;
        this.reply.divId = id;
        this.reply.actionId =0;
        this.replies.push(this.reply);
        this.allItems.push(id);
        this.loadEmailTemplatesForAddReply(this.reply);
    }
    addClickRows(){
        this.url = new Url();
        let length = this.allItems.length;
        length = length+1
        var id = 'click-'+ length;
        this.url.divId = id;
        this.url.scheduled = false;
        this.url.actionId = 19;
        this.url.url = this.emailTemplateHrefLinks[0];
        this.urls.push(this.url);
        this.allItems.push(id);
        this.loadEmailTemplatesForAddOnClick(this.url);
    }
    
    remove(divId:string,type:string){
        if(type=="replies"){
            this.replies = this.spliceArray(this.replies,divId);
            console.log(this.replies);
        }else{
            this.urls = this.spliceArray(this.urls,divId);
            console.log(this.urls);
        }
        $('#'+divId).remove();
        let index = divId.split('-')[1];
        let editorName = 'editor'+index;
        let errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        if(errorLength==0){
            this.dataError = false;
        }
        //CKEDITOR.instances[editorName].destroy();
    }    
    
    spliceArray(arr:any,id:string){
        arr = $.grep(arr, function(data, index) {
            return data.divId != id
         });
        return arr;
    }

    selectReplyEmailBody(event:any,index:number,reply:Reply){
        reply.defaultTemplate = event;
    }
    selectClickEmailBody(event:any,index:number,url:Url){
        url.defaultTemplate = event;
    }  
    setReplyEmailTemplate(emailTemplateId:number,reply:Reply,index:number){
        reply.selectedEmailTemplateId = emailTemplateId;
        $('#reply-'+index+emailTemplateId).prop("checked",true);
    }
    setClickEmailTemplate(emailTemplateId:number,url:Url,index:number){
        url.selectedEmailTemplateId = emailTemplateId;
        $('#url-'+index+emailTemplateId).prop("checked",true);
    }
    getEmailTemplatePreview(emailTemplate:EmailTemplate){
        let body = emailTemplate.body;
        let emailTemplateName = emailTemplate.name;
        if(emailTemplateName.length>50){
            emailTemplateName = emailTemplateName.substring(0, 50)+"...";
        }
        $("#email-template-content").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplateName);
        $('#email-template-title').prop('title',emailTemplate.name);
        if(this.campaignType=='video'){
            let selectedVideoGifPath = this.campaign.campaignVideoFile.gifImagePath;
            let updatedBody = emailTemplate.body.replace("<SocialUbuntuImgURL>",selectedVideoGifPath);
            updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;","javascript:void(0)");
            updatedBody = updatedBody.replace("<SocialUbuntuURL>","javascript:void(0)");
            updatedBody = updatedBody.replace("https://dummyurl.com","javascript:void(0)");
            updatedBody = updatedBody.replace("https://aravindu.com/vod/images/xtremand-video.gif",selectedVideoGifPath);
            updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;",selectedVideoGifPath);
            $("#email-template-content").append(updatedBody);
        }else{
            let updatedBody = emailTemplate.body.replace("<div id=\"video-tag\">","<div id=\"video-tag\" style=\"display:none\">");
            $("#email-template-content").append(updatedBody);
        }
        $('.modal .modal-body').css('overflow-y', 'auto'); 
        $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        $("#email_template_preivew").modal('show');
    }

    filterReplyTemplates(type:string,index:number,reply:Reply){
        if(type=="BASIC"){
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.BASIC;
        }else if(type=="RICH"){
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.RICH;
        }else if(type=="UPLOADED"){
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.UPLOADED;
        }else if(type=="NONE"){
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
        }
        else if(type=="PARTNER"){
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.PARTNER;
        }
         reply.selectedEmailTemplateTypeIndex = index;
         reply.emailTemplatesPagination.pageIndex = 1;
         this.loadEmailTemplatesForAddReply(reply);
     }
    
    filterClickTemplates(type:string,index:number,url:Url){
        if(type=="BASIC"){
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.BASIC;
        }else if(type=="RICH"){
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.RICH;
        }else if(type=="UPLOADED"){
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.UPLOADED;
        }else if(type=="NONE"){
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
        }
        else if(type=="PARTNER"){
            url.emailTemplatesPagination.emailTemplateType = EmailTemplateType.PARTNER;
        }
        url.selectedEmailTemplateTypeIndex = index;
        url.emailTemplatesPagination.pageIndex = 1;
         this.loadEmailTemplatesForAddOnClick(url);
     }
    searchReplyEmailTemplate(reply:Reply){
        reply.emailTemplatesPagination.pageIndex = 1;
        reply.emailTemplatesPagination.searchKey = reply.emailTemplateSearchInput;
        this.loadEmailTemplatesForAddReply(reply);
    }
    
  
    
    searchClickEmailTemplate(url:Url){
        url.emailTemplatesPagination.pageIndex = 1;
        url.emailTemplatesPagination.searchKey = url.emailTemplateSearchInput;
        this.loadEmailTemplatesForAddOnClick(url);
    }    
    getAnchorLinksFromEmailTemplate(body:string){
        $('#emailTemplateContent').html('');
        $('#emailTemplateContent').append(body);
        console.log($('#emailTemplateContent').find('a'));
        let self = this;
        $('#emailTemplateContent').find('a').each(function(e) {
           let href = $(this).attr('href');
           self.emailTemplateHrefLinks.push(href);
        });
        this.emailTemplateHrefLinks = this.referenceService.removeDuplicates(this.emailTemplateHrefLinks);
        var index = $.inArray("<SocialUbuntuURL>", this.emailTemplateHrefLinks);
        if (index>=0) {
            this.emailTemplateHrefLinks.splice(index, 1);
        }
        console.log(this.emailTemplateHrefLinks);
    }    
  ngOnInit() {
    this.campaignType = this.route.snapshot.params['type'];
    this.loggedInUserId = this.authenticationService.getUserId();

    this.listPartnerCampaigns(this.loggedInUserId, this.campaignType);
  }

}
