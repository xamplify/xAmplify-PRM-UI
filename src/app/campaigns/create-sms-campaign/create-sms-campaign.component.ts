import { Component, OnInit,OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Pagination } from '../../core/models/pagination';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { validateCampaignSchedule } from '../../form-validator';
import { VideoFileService} from '../../videos/services/video-file.service';
import { ContactService } from '../../contacts/services/contact.service';
import { CampaignService } from '../services/campaign.service';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { Campaign } from '../models/campaign';
import { Reply } from '../models/campaign-reply';
import { Url } from '../models/campaign-url';
import { CampaignType } from '../models/campaign-type';
import { CampaignVideo } from '../models/campaign-video';
import { CampaignEmailTemplate } from '../models/campaign-email-template';
import { CampaignContact } from '../models/campaign-contact';
import { EmailTemplate } from '../../email-template/models/email-template';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { ContactList } from '../../contacts/models/contact-list';
import { Category } from '../../videos/models/category';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SocialStatus } from "../../social/models/social-status";
import { SocialStatusProvider } from "../../social/models/social-status-provider";
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { SocialService } from "../../social/services/social.service";
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { Roles } from '../../core/models/roles';
import { Properties } from '../../common/models/properties';
declare var swal, $, videojs , Metronic, Layout , Demo,flatpickr,CKEDITOR,require:any;
var moment = require('moment-timezone');

@Component({
  selector: 'app-create-sms-campaign',
  templateUrl: './create-sms-campaign.component.html',
  styleUrls: ['./create-sms-campaign.component.css', '../../../assets/css/video-css/video-js.custom.css', '../../../assets/css/content.css'],
  providers:[HttpRequestLoader,CallActionSwitch,Properties]

})
export class CreateSmsCampaignComponent implements OnInit,OnDestroy{
    ngxloading: boolean;
    selectedRow:number;
    categories: Category[];
    partnerCategories:Category[];
    campaignVideos: Array<SaveVideoFile>;
    channelVideos:Array<SaveVideoFile>;
    isvideoThere:boolean;
    isPartnerVideoExists:boolean = false;
    isCategoryThere:boolean=false;
    isCategoryUpdated:boolean;
    isvideosLength:boolean;
    imagePath:string;
    campaign:Campaign;
    campaignVideo:CampaignVideo=new CampaignVideo();
    campaignContact:CampaignContact=new CampaignContact();
    campaignEmailTemplate:CampaignEmailTemplate = new CampaignEmailTemplate();
    names:string[]=[];
    teamMemberEmailIds:any[] = [];
    editedCampaignName:string = "";
    isAdd:boolean = true;
    name:string = "";
    width:string="";
    isListView: boolean = false;
    defaultTabClass = "col-block";
    activeTabClass = "col-block col-block-active";
    completedTabClass = "col-block col-block-complete";
    disableTabClass = "col-block col-block-disable";

    campaignDetailsTabClass = this.activeTabClass;
    videoTabClass:string = this.defaultTabClass;
    contactListTabClass:string = this.defaultTabClass;
    emailTemplateTabClass:string = this.defaultTabClass;
    launchCampaignTabClass:string = this.defaultTabClass;
    currentTabActiveClass:string = this.activeTabClass;
    inActiveTabClass:string = this.defaultTabClass;
    successTabClass:string = this.completedTabClass;
    invalidScheduleTimeError:string = "";
    toPartner:boolean = false;
    /*************Pagination********************/
    videosPagination:Pagination = new Pagination();
    channelVideosPagination:Pagination = new Pagination();
    contactsUsersPagination:Pagination = new Pagination();
    emailTemplatesPagination:Pagination = new Pagination();
    pagedItems: any[];
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
    channelCampaignFieldName:string = "";
    TO_PARTNER_MESSAGE:string = "";
    /************Video******************/
    isVideo:boolean = false;
    isCampaignDraftVideo:boolean = false;
    videoId:number=0;
    draftMessage:string = "";
    launchVideoPreview:SaveVideoFile = new SaveVideoFile();
    savedVideoFile:SaveVideoFile = new SaveVideoFile();
    videoSearchInput:string = "";
    channelVideoSearchInput:string = "";
    filteredVideoIds: Array<number>;
    showSelectedVideo:boolean = false;
    tabClass:string = "tablinks";
    tabClassActive = this.tabClass+" active";
    myVideosClass = this.tabClass;
    partnerVideosClass = this.tabClass;
    styleHiddenClass:string = "none";
    styleDisplayClass:string = "block";
    partnerVideosStyle = this.styleHiddenClass;
    myVideosStyle = this.styleHiddenClass;
    partnerVideoSelected:boolean = false;
    isMyVideosActive:boolean = true;
    /***************Contact List************************/
    isContactList:boolean = false;
    contactsPagination:Pagination = new Pagination();
    campaignContactLists: Array<ContactList>;
    numberOfContactsPerPage = [
                               {'name':'10','value':'10'},
                               {'name':'20','value':'20'},
                               {'name':'30','value':'30'},
                               {'name':'All','value':'0'},
                               ]
    contactItemsSize:any = this.numberOfContactsPerPage[0];
    isCampaignDraftContactList:boolean = false;
    selectedRowClass:string = "";
    selectedContactListIds = [];
    isHeaderCheckBoxChecked:boolean = false;
    emptyContactsMessage:string = "";
    contactSearchInput:string = "";
    contactListTabName:string = "";
    contactListSelectMessage:string = "";
    emptyContactListMessage:string = "";
    showContactType:boolean = false;
   /***********Email Template*************************/
    campaignEmailTemplates: Array<EmailTemplate>;
    campaignDefaultEmailTemplates: Array<EmailTemplate>;
    isEmailTemplate:boolean = false;
    isCampaignDraftEmailTemplate:boolean = false;
    emailTemplateHtmlPreivew:string = "";

    selectedEmailTemplateName:string = "";
    emailTemplateId:number=0;
    isDefaultCampaignEmailTemplate:boolean = true;
    defaultEmailTemplateActiveClass:string = "filter active";
    ownEmailTemplateActiveClass:string = "filter";
    selectedEmailTemplateRow:number;
    selectedEmailTemplateTypeIndex:number = 0;
    selectedEmailTemplateType:EmailTemplateType=EmailTemplateType.NONE;
    selectedTemplateBody;string = "";
    emailTemplate:EmailTemplate = new EmailTemplate();
    emailTemplateSearchInput:string = "";
    videoEmailTemplateSearchInput:string = "";
    filteredEmailTemplateIds: Array<number>;
    showSelectedEmailTemplate:boolean = false;
    hideCoBrandedEmailTemplate:boolean = false;
    /*****************Launch************************/
    isScheduleSelected:boolean = false;
    campaignLaunchForm: FormGroup;
    selectedContactLists: any;
    id:number;
    previewContactListId : number;
    sheduleCampaignValues = ['NOW', 'SCHEDULE', 'SAVE'];
    isLaunched:boolean = false;
    lauchTabPreivewDivClass = "col-xs-12 col-sm-12 col-md-7 col-lg-7";
    loggedInUserId:number = 0;
    buttonName:string = "Launch";

    selectedAccounts: number = 0;
    socialStatusList = new Array<SocialStatus>();
    socialStatusProviders = new Array<SocialStatusProvider>();
    isAllSelected: boolean = false;
	  isSocialEnable = false;
    statusMessage: string;
    userListDTOObj = [];


    replies:Array<Reply> = new Array<Reply>();
    urls:Array<Url> = new Array<Url>();
    date:Date;
    reply:Reply=new Reply();
    url:Url = new Url();
    allItems= [];
    emailTemplateHrefLinks:any[] = [];
    dataError:boolean = false;
    emailNotOpenedReplyDaysSum:number = 0;
    emailOpenedReplyDaysSum:number = 0;
    onClickScheduledDaysSum:number = 0;
    isReloaded:boolean = false;
    invalidScheduleTime:boolean = false;
    hasInternalError:boolean =false;
    countries: Country[];
    timezones: Timezone[];
    videojsPlayer: any;
    isOnlyPartner:boolean  = false;
    roleName: Roles= new Roles();
    createVideoFile:any;
    listName:string;
    loading = false;
    isPartnerToo:boolean = false;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();

     //Push Leads To Marketo
     showMarketoForm: boolean;
     clientId: string;
     secretId: string;
     marketoInstance: string;
     clientIdClass: string;
     secretIdClass: string;
     marketoInstanceClass: string;

     templateError: boolean;
     clentIdError: boolean;
     secretIdError: boolean;
     marketoInstanceError: boolean;
     isModelFormValid: boolean;
     templateSuccessMsg: any;
     pushToMarketo = false;

     smsService = false;

     loadingMarketo: boolean;
     marketoButtonClass = "btn btn-default";
 
     //ENABLE or DISABLE LEADS
     enableLeads : boolean;
     enableSMS:boolean;
    smsText: any;
    enableSmsText: boolean;
    smsTextDivClass: string;

    /***********End Of Declation*************************/
    constructor(private fb: FormBuilder,public refService:ReferenceService,
                private logger:XtremandLogger,private videoFileService:VideoFileService,
                public authenticationService:AuthenticationService,private pagerService:PagerService,
                public campaignService:CampaignService,private contactService:ContactService,
                private emailTemplateService:EmailTemplateService,private router:Router, private socialService: SocialService,
                public callActionSwitch: CallActionSwitch, public videoUtilService: VideoUtilService,public properties:Properties
            ){

                refService.getCompanyIdByUserId(this.authenticationService.getUserId()).subscribe(response=>{
                    refService.getOrgCampaignTypes(response).subscribe(data=>{
                        console.log(data)
                        this.enableLeads = data.enableLeads;
                        console.log(this.enableLeads);

                    });
                })
 				authenticationService.getSMSServiceModule(this.authenticationService.getUserId()).subscribe(response=>{
                    console.log(response);
                   this.enableSMS = response.data;
                })
        this.logger.info("create-campaign-component constructor loaded");
        $('.bootstrap-switch-label').css('cssText', 'width:31px;!important');
       
        CKEDITOR.config.height = '100';
        this.isPartnerToo = this.authenticationService.checkIsPartnerToo();
        this.countries = this.refService.getCountries();
        this.campaign = new Campaign();
       
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        if(this.isAdd){
            this.campaignType = this.refService.selectedCampaignType;
            this.campaign.countryId = this.countries[0].id;
            this.onSelect(this.campaign.countryId);
        }
        if ( this.authenticationService.user != undefined ) {
            this.loggedInUserId = this.authenticationService.getUserId();
            this.campaign.userId = this.loggedInUserId;
            this.loadCampaignNames( this.loggedInUserId );
            }
        if(this.campaignService.campaign==undefined){
            if(this.router.url=="/home/campaigns/edit"){
                this.isReloaded = true;
                this.router.navigate(["/home/campaigns/manage"]);
            }else if(this.campaignType.length==0){
                this.isReloaded = true;
                this.router.navigate(["/home/campaigns/select"]);
            }
        }
        if(this.campaignService.campaign!=undefined){
            this.resetTabClass();
            $('head').append('<script src="https://yanwsh.github.io/videojs-panorama/videojs/v5/video.min.js"  class="p-video"  />');
            this.isAdd = false;
            this.editedCampaignName = this.campaignService.campaign.campaignName;
            this.campaign = this.campaignService.campaign;
            this.userListDTOObj = this.campaignService.campaign.userLists;
            if(this.userListDTOObj===undefined){ this.userListDTOObj = [];}
            if(this.campaign.regularEmail){
                this.campaignType = 'regular';
                this.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
            }else{
                this.campaignType = 'video';
                this.emailTemplatesPagination.filterBy = "CampaignVideoEmails";
            }
            this.partnerVideoSelected = this.campaign.partnerVideoSelected;
            this.getCampaignReplies(this.campaign);
            this.getCampaignUrls(this.campaign);
            this.contactsPagination.campaignId = this.campaign.campaignId;
            /******************Campaign Details Tab**************************/
            var campaignNameLength= $.trim(this.campaign.campaignName).length;
            
            if(campaignNameLength>0 ){
                this.isCampaignDetailsFormValid = true;
            }else{
                this.isCampaignDetailsFormValid = false;
            }
            /***********Select Video Tab*************************/
            if(this.campaign.partnerVideoSelected || this.isOnlyPartner){
                this.partnerVideosClass = this.tabClassActive;
                this.partnerVideosStyle = this.styleDisplayClass;
            }else{
               this.myVideosClass = this.tabClassActive;
               this.myVideosStyle  = this.styleDisplayClass;
            }
            

            /***********Select Contact List Tab*************************/
            if(this.campaign.userListIds.length>0){
                this.isContactList = true;
                this.contactListTabClass = this.successTabClass;
                this.contactsPagination.editCampaign = true;
                this.selectedContactListIds = this.campaign.userListIds.sort();
                this.isCampaignDraftContactList = true;
            }
            /***********Select Email Template Tab*************************/
            var selectedTemplateId = this.campaignService.campaign.selectedEmailTemplateId;
            if(selectedTemplateId>0){
                this.emailTemplateTabClass = this.successTabClass;
                this.emailTemplateId = selectedTemplateId;
                this.selectedEmailTemplateRow = selectedTemplateId;
                this.isEmailTemplate = true;
                this.isCampaignDraftEmailTemplate = true;
                this.selectedTemplateBody = this.campaign.emailTemplate.body;
                this.emailTemplate = this.campaign.emailTemplate;
            }
            if(this.isOnlyPartner){
                this.loadPartnerEmailTemplates(this.emailTemplatesPagination);
            }else{
                if(this.campaign.enableCoBrandingLogo){
                    this.loadRegularOrVideoCoBrandedTemplates();
                }else{
                    this.loadEmailTemplates(this.emailTemplatesPagination);
                }
            }
          /************Launch Campaign**********************/
            if(this.campaignService.campaign.campaignScheduleType=="SCHEDULE"){
                this.campaign.scheduleCampaign  = this.sheduleCampaignValues[1];
                this.isScheduleSelected = true;
                this.launchCampaignTabClass = this.successTabClass;
            }else{
                this.campaign.scheduleTime = "";
                this.campaign.scheduleCampaign  = this.sheduleCampaignValues[2];
                this.isScheduleSelected = true;
                this.launchCampaignTabClass = this.successTabClass;
            }

            this.name = this.campaignService.campaign.campaignName;
            let emailTemplate = this.campaign.emailTemplate;
            if(emailTemplate!=undefined){
                this.isEmailTemplate = true;
            }else{
                this.logger.info("No Email Template Added For Campaign");
            }
            if(this.campaign.timeZoneId==undefined){
                this.campaign.countryId = this.countries[0].id;
                this.onSelect(this.campaign.countryId);
            }else{
                let countryNames = this.refService.getCountries().map(function(a) {return a.name;});
                let countryIndex = countryNames.indexOf(this.campaign.country)
                if(countryIndex>-1){
                    this.campaign.countryId = this.countries[countryIndex].id;
                    this.onSelect(this.campaign.countryId);
                }else{
                    this.campaign.countryId = this.countries[0].id;
                    this.onSelect(this.campaign.countryId);
                }

            }
        }//End Of Edit
        
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
               reply.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes(reply.replyTimeInHoursAndMinutes);
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
                this.loadEmailTemplatesForAddOnClick(url);
            }
        }

    }
    count(status:any){
     console.log(status);
    }
    eventHandler(event, type:string){
      if(event===13 && type==='contact'){ this.searchContactList();}
      if(event===13 && type==='emailTemplate'){ this.searchEmailTemplate();}
  }
  eventReplyHandler(keyCode: any, reply:Reply) {  if (keyCode === 13) {  this.searchReplyEmailTemplate(reply); } }
  eventUrlHandler(keyCode: any, url:any) {  if (keyCode === 13) {  this.searchClickEmailTemplate(url); } }

  ngOnInit(){
        flatpickr( '.flatpickr',{
            enableTime: true,
            dateFormat: 'm/d/Y h:i K',
            time_24hr: false
        } );
        //this.validatecampaignForm();
        this.isListView = !this.refService.isGridView;
        
             this.width="25%";
             this.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
             this.isVideo = true;
             $('#videoTab').hide();
             this.lauchTabPreivewDivClass = "col-xs-12 col-sm-12 col-md-7 col-lg-7";
         


        this.validateLaunchForm();
        
        if(this.isAdd){
           this.loadContacts();
            if(this.isOnlyPartner){
                this.loadPartnerEmailTemplates(this.emailTemplatesPagination);
            }else{
                this.loadEmailTemplates(this.emailTemplatesPagination);//Loading Email Templates
            }
        }else{
            this.loadContacts();
        }
        this.listAllTeamMemberEmailIds();

    }

    loadContacts(){
        const roles = this.authenticationService.getRoles();
        let isVendor = roles.indexOf(this.roleName.vendorRole)>-1;
        let isOrgAdmin = this.authenticationService.isOrgAdmin() || (!this.authenticationService.isAddedByVendor && !isVendor);
        if(isOrgAdmin){
            this.channelCampaignFieldName = "To Recipient";
        }else{
            this.channelCampaignFieldName = "To Partner";
        }
        if(isOrgAdmin){
            if(this.campaign.channelCampaign){
                this.setVendorPartnersData();
            }else{
                this.setOrgAdminReceipients();
            }

        }else if(isVendor|| this.authenticationService.isAddedByVendor){
           this.setVendorPartnersData();
        }
        this.loadCampaignContacts(this.contactsPagination);
    }


    setVendorPartnersData(){
        this.contactListTabName = "Partners";
        this.emptyContactListMessage = "No partner(s) found";
        this.contactListSelectMessage = "Select the partner list(s) to be used in this campaign";
        this.contactsPagination.filterValue = true;
        this.contactsPagination.filterKey = "isPartnerUserList";
        this.showContactType = false;
        this.TO_PARTNER_MESSAGE = "To Partner: Send a campaign intended just for your Partners";
    }

    setOrgAdminReceipients(){
        this.contactListTabName = "Partners & Recipients";
        this.contactListSelectMessage = "Select the partner(s) / recipient(s) to be used in this campaign";
        this.emptyContactListMessage = "No partner(s) / recipient(s) found";
        this.showContactType = true;
        this.contactsPagination.filterValue = false;
        this.contactsPagination.filterKey = null;
        this.TO_PARTNER_MESSAGE = "To Recipient: Send a campaign intended just for your Partners/ Contacts";
    }


    /******************************************Pagination Related Code******************************************/
    setPage(pageIndex:number,module:string){
        if(module=="contacts"){
            this.contactsPagination.pageIndex = pageIndex;
            this.loadCampaignContacts(this.contactsPagination);
        }else if(module=="contactUsers"){
           this.contactsUsersPagination.pageIndex = pageIndex;
            this.loadUsers(this.id,this.contactsUsersPagination,this.listName);
        }else if(module=="emailTemplates"){
            this.emailTemplatesPagination.pageIndex = pageIndex;
            this.emailTemplatesLoad();
        }

    }
    emailTemplatesLoad(){
      if(this.isOnlyPartner){this.loadPartnerEmailTemplates(this.emailTemplatesPagination);
      }else{ this.loadEmailTemplates(this.emailTemplatesPagination); }
    }
    setPagePagination(event:any){ this.setPage(event.page, event.type);}
    loadPaginationDropdownTemplates(event:Pagination){ this.emailTemplatesLoad();}
    /*************************************************************Campaign Details***************************************************************************************/
    isValidEmail:boolean = false;
    isValidCampaignName:boolean = true;
     validateForm() {
         var isValid = true;
         let self = this;
        $('#campaignDetailsForm input[type="text"]').each(function() {
            if ($.trim($(this).val())== '' ){
              isValid = false;
          }

        });
        if(this.smsService ){
            if( this.smsText!=null && this.smsText.length > 0)
                isValid = true;
            else
                isValid = false;
        }
        if(isValid && this.isValidCampaignName){
            this.isCampaignDetailsFormValid = true;
        }else{
            this.isCampaignDetailsFormValid = false;
        }
        console.log("is Valid Form"+this.isCampaignDetailsFormValid);
      }
     
     validateCampaignName(campaignName:string){
        // let lowerCaseCampaignName = campaignName.toLowerCase().trim().replace(/\s/g, "");//Remove all spaces
         let lowerCaseCampaignName = $.trim(campaignName.toLowerCase());//Remove all spaces
         var list = this.names[0];
         if(this.isAdd){
             if($.inArray(lowerCaseCampaignName, list) > -1){
                 this.isValidCampaignName = false;
             }else{
                 this.isValidCampaignName = true;
             }
         }else{
             console.log(this.editedCampaignName.toLowerCase()+":::::::::"+lowerCaseCampaignName);
             if($.inArray(lowerCaseCampaignName, list) > -1 && this.editedCampaignName.toLowerCase()!=lowerCaseCampaignName){
                 this.isValidCampaignName = false;
             }else{
                 this.isValidCampaignName = true;
             }
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

         }
         else if(fieldId=="smsText"){
            if(fieldValue.length>0){
                this.smsTextDivClass = successClass;
            }else{
                this.smsTextDivClass = errorClass;
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
    setEmailOpened(event:any){
        this.campaign.emailOpened = event;
    }

    setChannelCampaign(event:any){
        this.campaign.channelCampaign = event;
       /* if(roles.indexOf(this.roleName.vendorRole)<0){
            this.selectedContactListIds = [];
            this.isContactList = false;
        }*/
        this.contactsPagination.pageIndex = 1;
        this.clearSelectedContactList();
        if(event){
            this.removeTemplateAndAutoResponse();
            this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
            this.setCoBrandingLogo(event);
           // this.loadEmailTemplates(this.emailTemplatesPagination);
            this.loadContacts();
        }else{
            this.loadContacts();
            this.setCoBrandingLogo(event);
            this.removePartnerRules();
        }
    }

    clearSelectedContactList(){
        const roles = this.authenticationService.getRoles();
        let isVendor = roles.indexOf(this.roleName.vendorRole)>-1;
        if(this.authenticationService.isOrgAdmin() || (!this.authenticationService.isAddedByVendor && !isVendor)){
            this.selectedContactListIds = [];
            this.userListDTOObj = [];
            this.isContactList = false;
        }
    }

    removePartnerRules(){
        let self = this;
        $.each(this.replies,function(index,reply){
            if(reply.actionId==22 ||reply.actionId==23){
               self.remove(reply.divId, 'replies');
            }

        });
    }
    setCoBrandingLogo(event:any){
        this.campaign.enableCoBrandingLogo = event;
        let isRegularCoBranding = this.campaign.emailTemplate!=undefined &&this.campaign.emailTemplate.regularCoBrandingTemplate;
        let isVideoCoBranding =  this.campaign.emailTemplate!=undefined &&  this.campaign.emailTemplate.videoCoBrandingTemplate;
        /*if(!this.campaign.enableCoBrandingLogo || isRegularCoBranding || isVideoCoBranding){
            this.hideCoBrandedEmailTemplate = true;
        }else{
            this.hideCoBrandedEmailTemplate = false;
        }*/
        this.removeTemplateAndAutoResponse();
        this.filterCoBrandedTemplates(event);
    }

    removeTemplateAndAutoResponse(){
        this.urls = [];//Removing Auto-Response WebSites
        this.selectedEmailTemplateRow = 0;
        this.isEmailTemplate = false;
    }
    filterCoBrandedTemplates(event:any){
        if(event){
           this.loadRegularOrVideoCoBrandedTemplates();
        }else{
          this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
          this.loadAllEmailTemplates(this.emailTemplatesPagination);
        }
    }

   loadRegularOrVideoCoBrandedTemplates(){
        if(this.campaignType == "regular"){
            this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.REGULAR_CO_BRANDING;
            this.loadEmailTemplates(this.emailTemplatesPagination);
        }else{
            this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.VIDEO_CO_BRANDING;
            this.loadEmailTemplates(this.emailTemplatesPagination);
        }
    }

    loadAllEmailTemplates(emailTemplatesPagination:Pagination){
        if(this.isOnlyPartner){
            this.loadPartnerEmailTemplates(this.emailTemplatesPagination);
        }else{
            this.loadEmailTemplates(this.emailTemplatesPagination);
        }
    }
    setVideoPlayed(event:any){
        this.campaign.videoPlayed = event;
    }
    setReplyWithVideo(event:any){
        this.campaign.replyVideo  = event;
    }
    setSocialSharingIcons(event:any){
        this.campaign.socialSharingIcons = event;
    }


    /*************************************************************Select Video***************************************************************************************/
    setClickedRow = function(videoFile:any,videoType:string){
        console.log(videoFile);
       let videoId = videoFile.id;
        if(videoFile.viewBy=="DRAFT"){
            this.draftMessage = "Video is in draft mode, please update the publish options to Library or Viewers.";
        }else{
            this.selectedRow = videoId;
            this.campaign.selectedVideoId =videoFile.id;
            if(videoType=="partner-videos"){
                this.campaign.partnerVideoSelected = true;
                if(this.authenticationService.isOnlyPartner()){
                    this.selectedEmailTemplateRow=0;
                    this.isEmailTemplate = false;
                    this.emailTemplatesPagination.pageIndex = 1;
                    this.loadPartnerEmailTemplates(this.emailTemplatesPagination);
                }
            }else{
                this.campaign.partnerVideoSelected = false;
            }
            $('#campaign_video_id_'+videoId).prop( "checked", true );
            this.launchVideoPreview = videoFile;
            this.isVideo = true;
            if((!(this.isAdd) && this.campaign.campaignVideoFile!=undefined) || this.refService.campaignVideoFile!=undefined){
                if(videoId==this.campaign.campaignVideoFile.id){
                    $('#selectedVideoRow').addClass("active");
                }else{
                    $('#selectedVideoRow').removeClass("active");
                }

            }
        }


    }


    setReplyEmailTemplate(emailTemplateId:number,reply:Reply,index:number,isDraft:boolean){
        if(!isDraft){
            reply.selectedEmailTemplateId = emailTemplateId;
            $('#reply-'+index+emailTemplateId).prop("checked",true);
        }

    }
    setClickEmailTemplate(emailTemplateId:number,url:Url,index:number,isDraft:boolean){
        if(!isDraft){
            url.selectedEmailTemplateId = emailTemplateId;
            $('#url-'+index+emailTemplateId).prop("checked",true);
        }
    }
    

    /********************Filter Category Videos********************************/
    showUpdatevalue: boolean = false;
    showMessage: boolean = false;
    addUserEmailIds(){
        // let self = this;
        // self.selectedContactLists = [];
        // $('[name="campaignContact[]"]:checked').each(function(index){
        //     var id = $(this).val();
        //     var name = $(this)[0].lang;
        //     var  contactList = {'id':id,'name':name};
        //     if(self.selectedContactLists.length<=1){
        //         self.selectedContactLists.push(contactList);
        //     }
        //  });
       
    }

    


    isEven(n) {
      if(n % 2 === 0){ return true;}
      return false;
   }

    /************Showing Video Preview****************/
    showPreview(videoFile:SaveVideoFile){
     this.createVideoFile = videoFile;
    }
     closeCreateModal(event: any){
        this.createVideoFile = undefined;
      }
    destroyPreview(){
       if(this.videojsPlayer){
          this.videojsPlayer.dispose();
       }
       else{
           console.log('closed 360 video');
       }
    }
   
    /*************************************************************Contact List***************************************************************************************/
    loadCampaignContacts(contactsPagination:Pagination) {
        this.campaignContact.httpRequestLoader.isHorizontalCss=true;
        this.refService.loading(this.campaignContact.httpRequestLoader, true);
        console.log(this.contactsPagination);
        this.contactService.loadContactLists(contactsPagination)
            .subscribe(
            (data:any) => {
                this.campaignContactLists = data.listOfUserLists;
                console.log(this.campaignContactLists);
                contactsPagination.totalRecords = data.totalRecords;
                if(contactsPagination.filterBy!=null){
                    if(contactsPagination.filterBy==0){
                        contactsPagination.maxResults = data.totalRecords;
                    }else{
                        contactsPagination.maxResults = contactsPagination.filterBy;
                    }
                }
                this.contactsPagination = this.pagerService.getPagedItems(contactsPagination, this.campaignContactLists);
                this.refService.loading(this.campaignContact.httpRequestLoader, false);
                var contactIds = this.contactsPagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedContactListIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                if(items.length==contactIds.length){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }

            },
            (error:string) => {
                this.logger.errorPage(error);
            },
            () => this.logger.info("Finished loadCampaignContacts()", this.contactsPagination)
            )
    }


    getNumberOfContactItemsPerPage(items:any){
        try{
            $('#checkAllExistingContacts').prop("checked",false);
            this.contactItemsSize = items;
            this.getAllFilteredResults(this.contactsPagination);
        }catch(error){
            console.log(error, "getSelectedContacts","PublishContentComponent");
        }

    }
    getAllFilteredResults(pagination:Pagination){
        try{
            this.contactsPagination.pageIndex = 1;
            this.contactsPagination.filterBy = this.contactItemsSize.value;
            if(this.contactItemsSize.value==0){
                this.contactsPagination.maxResults = this.contactsPagination.totalRecords;
            }else{
                this.contactsPagination.maxResults = this.contactItemsSize.value;
            }
            this.loadCampaignContacts(this.contactsPagination);
        }catch(error){
            console.log(error, "Get Filtered Contacts","Publish Content Component")
        }
    }
    searchContactList(){
        this.contactsPagination.pageIndex = 1;
        this.contactsPagination.searchKey = this.contactSearchInput;
        this.loadCampaignContacts(this.contactsPagination);
    }
    highlightRow(contactList:any,event:any){
        let contactId = contactList.id;
        let isChecked = $('#'+contactId).is(':checked');
        if(isChecked){
            $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
            this.selectedContactListIds.push(contactId);
            this.userListDTOObj.push(contactList);
        }else{
            $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
            this.selectedContactListIds.splice($.inArray(contactId,this.selectedContactListIds),1);
            this.userListDTOObj = this.refService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
        }
        this.contactsUtility();
        event.stopPropagation();
    }
    highlightContactRow(contactList:any,event:any,count:number,isValid:boolean){
      let contactId = contactList.id;
      if(isValid){
            this.emptyContactsMessage = "";
            if(count>0){
                let isChecked = $('#'+contactId).is(':checked');
                if(isChecked){
                    //Removing Highlighted Row
                    $('#'+contactId).prop( "checked", false );
                    $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
                    console.log("Revmoing"+contactId);
                    this.selectedContactListIds.splice($.inArray(contactId,this.selectedContactListIds),1);
                    this.userListDTOObj= this.refService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
                  }else{
                  //Highlighting Row
                  $('#'+contactId).prop( "checked", true );
                  $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
                  console.log("Adding"+contactId);
                  this.selectedContactListIds.push(contactId);
                  this.userListDTOObj.push(contactList);
              }
                this.contactsUtility();
                event.stopPropagation();
                console.log(this.selectedContactListIds);
            }else{
                this.emptyContactsMessage = "Contacts are in progress";
            }

        }

    }
    contactsUtility(){
        var trLength = $('#user_list_tb tbody tr').length;
        var selectedRowsLength = $('[name="campaignContact[]"]:checked').length;
        if(selectedRowsLength>0){
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
            console.log("checked");
            $('[name="campaignContact[]"]').prop('checked', true);
            this.isContactList = true;
            let self = this;
            $('[name="campaignContact[]"]:checked').each(function(index){
                var id = $(this).val();
                self.selectedContactListIds.push(parseInt(id));
                self.userListDTOObj.push(self.contactsPagination.pagedItems[index]);
                console.log(self.selectedContactListIds);
                $('#campaignContactListTable_'+id).addClass('contact-list-selected');
             });
            this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
            if(this.selectedContactListIds.length==0){ this.isContactList = false; }
            this.userListDTOObj = this.refService.removeDuplicates( this.userListDTOObj );
        }else{
            $('[name="campaignContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("contact-list-selected");
            if(this.contactsPagination.maxResults>30||(this.contactsPagination.maxResults==this.contactsPagination.totalRecords)){
                this.isContactList = false;
                this.selectedContactListIds = [];
            }else{
                this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
                let currentPageContactIds = this.contactsPagination.pagedItems.map(function(a) {return a.id;});
                this.selectedContactListIds = this.refService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
                this.userListDTOObj =  this.refService.removeDuplicatesFromTwoArrays(this.userListDTOObj, this.contactsPagination.pagedItems);
                if(this.selectedContactListIds.length==0){
                    this.isContactList = false;
                    this.userListDTOObj = [];
                }
            }

        }
        ev.stopPropagation();
    }



    /*******************************Preview*************************************/
    contactListItems:any[];
      loadUsers(id:number,pagination:Pagination, ListName){
         //this.loading = true;
         if(id==undefined){
              id=this.previewContactListId;
          }else{
              this.previewContactListId = id;
          }
          this.listName = ListName;
          this.contactService.loadUsersOfContactList( id,this.contactsUsersPagination).subscribe(
                  (data:any) => {
                      console.log(data);
                      //this.loading = false;
                      console.log(pagination);
                      this.contactListItems = data.listOfUsers;
                      console.log(this.contactListItems);
                      pagination.totalRecords = data.totalRecords;
                      this.contactsUsersPagination = this.pagerService.getPagedItems(pagination, this.contactListItems);
                      $('#users-modal-body').html('');
                      var html = "";
                      html+= '<table  style="margin:0" class="table table-striped table-hover table-bordered" id="sample_editable_1">'+
                              '<thead>'+
                                  '<tr>'+
                                      '<th>EMAIL ID</th>'+
                                      '<th>FIRST NAME</th>'+
                                      '<th>LAST NAME</th>'+
                                  '</tr>'+
                              '</thead>'+
                               '<tbody>';
                      $.each(this.contactsUsersPagination.pagedItems,function(index,value){
                          var firstName = value.firstName;
                          var lastName = value.lastName;
                          if(firstName==null || firstName=="null"){
                              firstName="";
                          }
                         if(lastName==null || lastName=="null"){
                             lastName = "";
                         }
                          html+= '<tr>'+
                                      '<td>'+value.emailId+'</td>'+
                                      '<td>'+firstName+'</td>'+
                                      '<td>'+lastName+'</td>'+
                                  '</tr>';
                      });
                       html+='</tbody>';
                       html+='</table>';
                      $('#users-modal-body').append(html);
                      $('#usersModal').modal({backdrop: 'static', keyboard: false});
                  },
                  error => { this.loading = false; },
                  () => console.log( "MangeContactsComponent loadUsersOfContactList() finished" )
              )
      }

      closeModelPopup(){
          this.contactsUsersPagination = new Pagination();
      }
      showContactsAlert(count:number){
          this.emptyContactsMessage = "";
          if(count==0){
              this.emptyContactsMessage = "No Contacts Found For This Contact List";
          }
      }

    /*************************************************************Email Template***************************************************************************************/
    loadEmailTemplates(pagination:Pagination){
        pagination.throughPartner = this.campaign.channelCampaign;
        this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        if(pagination.searchKey==null || pagination.searchKey==""){
            pagination.campaignDefaultTemplate = true;
        }else{
            pagination.campaignDefaultTemplate = false;
            pagination.isEmailTemplateSearchedFromCampaign = true;
        }
        pagination.maxResults = 12;
        this.emailTemplateService.listTemplates(pagination,this.loggedInUserId)
        .subscribe(
            (data:any) => {
                this.campaignEmailTemplates = data.emailTemplates;
                pagination.totalRecords = data.totalRecords;
                this.emailTemplatesPagination = this.pagerService.getPagedItems(pagination, data.emailTemplates);
                if(this.emailTemplatesPagination.totalRecords==0 &&this.selectedEmailTemplateRow==0){
                    this.isEmailTemplate = false;
                }
                this.filterEmailTemplateForEditCampaign();
                this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error:string) => {
               this.logger.errorPage(error);
            },
            () => this.logger.info("Finished loadEmailTemplates()", this.emailTemplatesPagination)
            )
    }

    loadPartnerEmailTemplates(pagination:Pagination){
        this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        pagination.campaignDefaultTemplate = false;
        pagination.isEmailTemplateSearchedFromCampaign = true;
        pagination.maxResults = 12;
        this.emailTemplateService.listTemplatesForVideo(pagination,this.loggedInUserId,this.campaign.selectedVideoId)
        .subscribe(
            (data:any) => {
                this.campaignEmailTemplates = data.emailTemplates;
                pagination.totalRecords = data.totalRecords;
                this.emailTemplatesPagination = this.pagerService.getPagedItems(pagination, data.emailTemplates);
                if(this.emailTemplatesPagination.totalRecords==0 &&this.selectedEmailTemplateRow==0){
                    this.isEmailTemplate = false;
                }
                this.filterEmailTemplateForEditCampaign();
                if(this.refService.campaignVideoFile!=undefined){
                    let filteredEmailTemplateIds = this.emailTemplatesPagination.pagedItems.map(function(a) {return a.id;});
                    if(filteredEmailTemplateIds.length>0){
                        this.selectedEmailTemplateRow = filteredEmailTemplateIds[0];
                        this.isEmailTemplate = true;
                    }

                }
                this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error:string) => {
               this.logger.errorPage(error);
            },
            () => this.logger.info("Finished loadEmailTemplates()", this.emailTemplatesPagination)
            )
    }

     /**********************Email Templates For Add Reply**************************************************/
    loadEmailTemplatesForAddReply(reply:Reply){
        this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss=true;
        this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        /*if(this.campaignType=="video"){
            reply.emailTemplatesPagination.filterBy = "CampaignVideoEmails";
        }else{
            reply.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        }*/
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
                this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error:string) => {
               this.logger.errorPage(error);
            },
            () => this.logger.info("Finished loadEmailTemplatesForAddReply()",reply.emailTemplatesPagination)
            )
    }

    loadEmailTemplatesForAddOnClick(url:Url){
        this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss=true;
        this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
     /*   if(this.campaignType=="video"){
            url.emailTemplatesPagination.filterBy = "CampaignVideoEmails";
        }else{
            url.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        }*/
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
                this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error:string) => {
               this.logger.errorPage(error);
            },
            () => this.logger.info("Finished loadEmailTemplatesForAddOnClick()",url.emailTemplatesPagination)
            )
    }

    paginateEmailTemplateRows(pageIndex:number,reply:Reply){
        reply.emailTemplatesPagination.pageIndex = pageIndex;
        this.loadEmailTemplatesForAddReply(reply);
    }
    paginateClickEmailTemplateRows(pageIndex:number,url:Url){
        url.emailTemplatesPagination.pageIndex = pageIndex;
        this.loadEmailTemplatesForAddOnClick(url);
    }

    filterEmailTemplateForEditCampaign(){
        if(this.emailTemplatesPagination.emailTemplateType==0 && this.emailTemplatesPagination.searchKey==null){
            if(this.emailTemplatesPagination.pageIndex==1){
                this.showSelectedEmailTemplate=true;
            }else{
                this.showSelectedEmailTemplate=false;
            }
        }else{
            this.filteredEmailTemplateIds = this.emailTemplatesPagination.pagedItems.map(function(a) {return a.id;});
            if(this.filteredEmailTemplateIds.indexOf(this.emailTemplateId)>-1){
                this.showSelectedEmailTemplate=true;
            }else{
                this.showSelectedEmailTemplate=false;
            }
        }
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


    getEmailTemplatePreview(emailTemplate:EmailTemplate){
        this.ngxloading = true;
        this.emailTemplateService.getAllCompanyProfileImages(this.loggedInUserId).subscribe(
                ( data: any ) => {
                    console.log(data);
                    let body = emailTemplate.body;
                    let self  =this;
                    $.each(data,function(index,value){
                        body = body.replace(value,self.authenticationService.MEDIA_URL + self.refService.companyProfileImage);
                    });
                    body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.refService.companyProfileImage);
                    let emailTemplateName = emailTemplate.name;
                    if(emailTemplateName.length>50){
                        emailTemplateName = emailTemplateName.substring(0, 50)+"...";
                    }
                    this.selectedEmailTemplateName = emailTemplateName;
                    $("#htmlContent").empty();
                    $("#email-template-title").empty();
                    $("#email-template-title").append(emailTemplateName);
                    $('#email-template-title').prop('title',emailTemplate.name);
                    let updatedBody = this.refService.showEmailTemplatePreview(this.campaign, this.campaignType, this.launchVideoPreview.gifImagePath, body);
                    $("#htmlContent").append(updatedBody);
                    $('.modal .modal-body').css('overflow-y', 'auto');
                    $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
                    $("#show_email_template_preivew").modal('show');
                    this.ngxloading = false;
                },
                error => { this.ngxloading = false;this.logger.error("error in getAllCompanyProfileImages("+this.loggedInUserId+")", error); },
                () =>  this.logger.info("Finished getAllCompanyProfileImages()"));
    }
    filterTemplates(type:string,index:number){
       if(type=="BASIC"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.BASIC;
           this.selectedEmailTemplateType = EmailTemplateType.BASIC;
       }else if(type=="RICH"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.RICH;
           this.selectedEmailTemplateType = EmailTemplateType.RICH;
       }else if(type=="UPLOADED"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.UPLOADED;
           this.selectedEmailTemplateType = EmailTemplateType.UPLOADED;
       }else if(type=="NONE"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
           this.selectedEmailTemplateType = EmailTemplateType.NONE;
       }
       else if(type=="PARTNER"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.PARTNER;
           this.selectedEmailTemplateType = EmailTemplateType.PARTNER;
       }
       else if(type=="REGULAR_CO_BRANDING"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.REGULAR_CO_BRANDING;
           this.selectedEmailTemplateType = EmailTemplateType.REGULAR_CO_BRANDING;
       }else if(type=="VIDEO_CO_BRANDING"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.VIDEO_CO_BRANDING;
           this.selectedEmailTemplateType = EmailTemplateType.VIDEO_CO_BRANDING;
       }


        this.selectedEmailTemplateTypeIndex = index;
        this.emailTemplatesPagination.pageIndex = 1;
        this.loadEmailTemplates(this.emailTemplatesPagination);
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

    searchEmailTemplate(){
        this.emailTemplatesPagination.pageIndex = 1;
        this.emailTemplatesPagination.searchKey = this.emailTemplateSearchInput;
        this.emailTemplatesPagination.coBrandedEmailTemplateSearch = this.campaign.enableCoBrandingLogo;
        if(this.campaign.enableCoBrandingLogo){
            this.loadRegularOrVideoCoBrandedTemplates();
        }else{
            this.loadAllEmailTemplates(this.emailTemplatesPagination);
        }
       /* if(this.isOnlyPartner){
            this.loadPartnerEmailTemplates(this.emailTemplatesPagination);
        }else{
            this.loadEmailTemplates(this.emailTemplatesPagination);
        }
        */
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

    setEmailTemplate(emailTemplate:EmailTemplate){
     if(!emailTemplate.draft){
         $('#emailTemplateContent').html('');
         this.emailTemplateHrefLinks = [];
         this.getAnchorLinksFromEmailTemplate(emailTemplate.body);
         this.setEmailTemplateData(emailTemplate);
         if(this.emailTemplateHrefLinks.length == 0){
             this.urls = [];
         }
     }

       /* if(this.emailTemplateHrefLinks.length==0){
            let self = this;
            swal( {
                title: 'Are you sure?',
                text: "This Template has no urls.This will destroy all added ONCLICK data",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Select it!'
            }).then( function() {
               self.setEmailTemplateData(emailTemplate);
               self.urls = [];
            })
        }else{
            this.setEmailTemplateData(emailTemplate);
        }*/
    }
    setEmailTemplateData(emailTemplate:EmailTemplate){
        this.selectedEmailTemplateRow = emailTemplate.id;
        this.isEmailTemplate = true;
        this.selectedTemplateBody = emailTemplate.body;
        this.emailTemplate = emailTemplate;
    }

    getAnchorLinksFromEmailTemplate(body:string){
       /* $('#emailTemplateContent').html('');
        $('#emailTemplateContent').append(body);
        let self = this;
        $('#emailTemplateContent').find('a').each(function(e) {
           let href = $(this).attr('href');
           if(href!=undefined && $.trim(href).length>0){
               self.emailTemplateHrefLinks.push(href);
           }
        });
        this.emailTemplateHrefLinks = this.refService.removeDuplicates(this.emailTemplateHrefLinks);*/

        this.emailTemplateHrefLinks = this.refService.getAnchorTagsFromEmailTemplate(body, this.emailTemplateHrefLinks);
    }

    /*************************************************************Launch Campaign***************************************************************************************/
    validateLaunchForm(): void {
        this.campaignLaunchForm = this.fb.group( {
            'scheduleCampaign': [this.campaign.scheduleCampaign,Validators.required],
            'launchTime': [this.campaign.scheduleTime],
            'timeZoneId':[ this.campaign.timeZoneId],
            'countryId':[this.campaign.countryId]
        },{
            validator: validateCampaignSchedule('scheduleCampaign', 'launchTime')
        }
        );
        this.campaignLaunchForm.valueChanges
            .subscribe( data => this.onLaunchValueChanged( data ) );

        this.onLaunchValueChanged(); // (re)set validation messages now
    }

    //campaign lunch form value changed method
    onLaunchValueChanged( data?: any ) {
        if ( !this.campaignLaunchForm ) { return; }
        const form = this.campaignLaunchForm;
        let value = this.campaignLaunchForm['_value'].scheduleCampaign;
        if(value=="NOW"){
            this.buttonName = "Launch";
        }else if(value=="SAVE"){
            this.buttonName = "Save";
        }else if(value=="SCHEDULE"){
            this.buttonName = "Schedule";
        }
        if(this.campaignLaunchForm['_value'].scheduleCampaign!=null){this.isScheduleSelected=true}
        for ( const field in this.formErrors ) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get( field );

            if ( control && control.dirty && !control.valid ) {
                const messages = this.validationMessages[field];
                for ( const key in control.errors ) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    getCampaignData( emailId: string ) {
        if ( this.campaignType == "regular" ) {
            this.campaign.regularEmail = true;
        } else {
            this.campaign.regularEmail = false;
        }
        this.getRepliesData();
        this.getOnClickData();
        this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
        let timeZoneId = "";
        let scheduleTime:any;
        if( this.campaignLaunchForm.value.scheduleCampaign=="NOW" || this.campaignLaunchForm.value.scheduleCampaign=="SAVE" || this.campaignLaunchForm.value.scheduleCampaign==""){
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
        let campaignType = CampaignType.REGULAR;
        if("regular"==this.campaignType){
            campaignType = CampaignType.REGULAR;
        }else if("video"==this.campaignType){
            campaignType = CampaignType.VIDEO;
        }else if("sms" == this.campaignType){
            campaignType = CampaignType.SMS;
        }
        let country = $.trim($('#countryName option:selected').text());

        this.socialStatusList = [];
        this.socialStatusProviders.forEach(data => {
                if(data.selected){
                    let socialStatus = new SocialStatus();
                    socialStatus.socialStatusProvider = data;
                    if(socialStatus.socialStatusProvider.socialConnection.source.toLowerCase() === 'twitter'){
                        var statusMsg = this.statusMessage;
                        var length = 200;
                        var trimmedstatusMsg = statusMsg.length > length ? statusMsg.substring(0, length - 3) + "..." : statusMsg;
                        socialStatus.statusMessage = trimmedstatusMsg;
                        debugger;
                    }else{
                        socialStatus.statusMessage = this.statusMessage;
                    }
                    this.socialStatusList.push(socialStatus);
                }
            }
        )

        var data = {
            'campaignName': this.refService.replaceMultipleSpacesWithSingleSpace(this.campaign.campaignName),
           
            'emailOpened': this.campaign.emailOpened,
           
            'channelCampaign':this.campaign.channelCampaign,
            'enableCoBrandingLogo':this.campaign.enableCoBrandingLogo,
            'socialSharingIcons': true,
            'userId': this.loggedInUserId,
           
            'userListIds': this.selectedContactListIds,
            "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
            'scheduleTime': scheduleTime,
            'timeZoneId':timeZoneId,
            'campaignId': this.campaign.campaignId,
            'selectedEmailTemplateId': this.selectedEmailTemplateRow,
            'regularEmail': this.campaign.regularEmail,
            'socialStatusList': this.socialStatusList,
            'campaignReplies':this.replies,
            'campaignUrls':this.urls,
            'campaignType':campaignType,
            'country':country,
            'createdFromVideos':this.campaign.createdFromVideos,
            'nurtureCampaign':false,
            'pushToMarketo':this.pushToMarketo,
            'smsService':this.smsService,
            'smsText':this.smsText
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
            this.removeStyleAttrByDivId('reply-subject-'+reply.divId);
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
            if(errorLength==0){
                this.addEmailNotOpenedReplyDaysSum(reply, i);
                this.addEmailOpenedReplyDaysSum(reply, i);
            }

        }
    }

    validateReplyInDays(reply:Reply){
        if( reply.actionId!== 22 &&  reply.actionId!== 23 && reply.replyInDays==null){
           this.addReplyDaysErrorDiv(reply);
        }else if(reply.actionId==22 ||reply.actionId==23 ){
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
            console.log("Added Reply Subject Eror");
            $('#reply-subject-'+reply.divId).css('color','red');
        }
    }

    validateEmailTemplateForAddReply(reply:Reply){
        if(reply.defaultTemplate && reply.selectedEmailTemplateId==0){
            $('#'+reply.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#email-template-'+reply.divId).css('color','red');
        }else if(!reply.defaultTemplate &&(reply.body==null || reply.body==undefined || $.trim(reply.body).length==0)){
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
            $('#'+url.divId).removeClass('portlet light dashboard-stat2 border-error');
            this.removeStyleAttrByDivId('click-days-'+url.divId);
            this.removeStyleAttrByDivId('send-time-'+url.divId);
            this.removeStyleAttrByDivId('click-message-'+url.divId);
            this.removeStyleAttrByDivId('click-email-template-'+url.divId);
            this.removeStyleAttrByDivId('click-subject-'+url.divId);
            $('#'+url.divId).addClass('portlet light dashboard-stat2');
            if(url.actionId==21){
                url.scheduled = true;
                this.validateOnClickReplyTime(url);
                this.validateOnClickSubject(url);
                this.validateOnClickReplyInDays(url);
                this.validateEmailTemplateForAddOnClick(url);
            }else{
                url.scheduled = false;
                this.validateOnClickSubject(url);
                this.validateEmailTemplateForAddOnClick(url);
            }
            var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
            if(errorLength==0){
                this.addOnClickScheduledDaysSum(url, i);
            }
            console.log(errorLength);
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
            console.log("Added Subject Eror");
            $('#click-subject-'+url.divId).css('color','red');
        }
    }

    validateOnClickBody(url:Url){
        if(url.body==null || url.body==undefined || $.trim(url.body).length==0){
            this.addReplyDivError(url.divId);
            $('#click-message-'+url.divId).css('color','red');
        }
    }

    validateOnClickReplyInDays(url:Url){
        if(url.replyInDays==null){
            this.addReplyDivError(url.divId);
            $('#click-days-'+url.divId).css('color','red');
        }
    }

    validateEmailTemplateForAddOnClick(url:Url){
        if(url.defaultTemplate && url.selectedEmailTemplateId==0){
            console.log("Email Template Error Added For Choose Template On");
            $('#'+url.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#click-email-template-'+url.divId).css('color','red');
        }else if(!url.defaultTemplate &&(url.body==null || url.body==undefined || $.trim(url.body).length==0)){
            console.log("Email Template Error Added For Choose Template Off");
            $('#'+url.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#click-message-'+url.divId).css('color','red');
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






    /********************************************On Destory********************************************/
    ngOnDestroy() {
        this.campaignService.campaign = undefined;
        if(!this.hasInternalError && this.router.url!="/"){
            if(!this.isReloaded){
                if(!this.isLaunched){
                    // if(this.isAdd){
                    //     this.saveCampaignOnDestroy();
                    // }else{
                        let self = this;
                        swal( {
                            title: 'Are you sure?',
                            text: "You have unchanged Campaign data",
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#54a7e9',
                            cancelButtonColor: '#999',
                            confirmButtonText: 'Yes, Save it!',
                            cancelButtonText: "No"

                        }).then(function() {
                                self.saveCampaignOnDestroy();
                                /*self.getRepliesData();
                                self.getOnClickData();*/
                        },function (dismiss) {
                            if (dismiss == 'No') {
                                self.reInitialize();
                            }
                        })
                    // }
                 }
            }
         }
        $('.p-video').remove();
        $('.h-video').remove();
        $('.hls-video').remove();
        $('#usersModal').modal('hide');
        $('#show_email_template_preivew').modal('hide');
     }

    saveCampaignOnDestroy(){
        var data = this.getCampaignData("");
        if(data['scheduleCampaign']==null || data['scheduleCampaign']=="NOW" || $.trim(data['scheduleCampaign']).length==0){
            data['scheduleCampaign'] = "SAVE";
        }
        var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        if(errorLength==0){
            this.dataError = false;
            this.campaignService.saveCampaign( data )
            .subscribe(
            data => {
                console.log(data);
                if(data.message=="success"){
                    this.isLaunched = true;
                    this.reInitialize();
                    if("/home/campaigns/manage"==this.router.url){
                      this.router.navigate(["/home/campaigns/manage"]);
                    }

                }
            },
            error => {
                this.logger.error("error in saveCampaignOnDestroy()", error);
            },
            () => this.logger.info("Finished saveCampaignOnDestroy()")
        );
        }
    return false;
    }


    reInitialize(){
        this.refService.campaignVideoFile = undefined;
        this.refService.selectedCampaignType = "";
        this.selectedContactListIds = [];
        this.userListDTOObj = [];
        this.campaignService.campaign = undefined;
        this.names = [];
        this.name = "";
        this.refService.isCampaignFromVideoRouter = false;
    }
    /*************************************************************Form Errors**************************************************************************************/
    formErrors = {
            'campaignName': '',
           
            'scheduleCampaign': '',
            'launchTime': '',
            'contactListId': '',
            'countryId':''
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
                'pattern':'Invalid Email Id'
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
                'invalidCountry':'Country is required.'
            },


        };

    /************************************************Tab Click Events******************************************************************************/
        resetActive( event: any, percent: number, step: string ) {
            $( ".progress-bar" ).css( "width", percent + "%" ).attr( "aria-valuenow", percent );
            $( ".progress-completed" ).text( percent + "%" );
            this.hideSteps();
            this.showCurrentStepInfo( step );

        }

        hideSteps() {
            $( "div" ).each( function() {
                if ( $( this ).hasClass( "activeStepInfo" ) ) {
                    $( this ).removeClass( "activeStepInfo" );
                    $( this ).addClass( "hiddenStepInfo" );
                }
            });
        }

        showCurrentStepInfo( step ) {
            var id = "#" + step;
            if(step=="step-2"){
                this.campaignDetailsTabClass = this.currentTabActiveClass;
                if(this.isContactList){
                    //Setting Sky Blue Color
                    this.contactListTabClass = this.successTabClass;
                }else{
                    this.contactListTabClass = this.inActiveTabClass;
                }
               if(this.isVideo){
                   this.videoTabClass  = this.successTabClass;
               }else{
                   this.videoTabClass  = this.inActiveTabClass;
               }
               if(this.isEmailTemplate){
                   this.emailTemplateTabClass = this.successTabClass;
               }else{
                   this.emailTemplateTabClass = this.inActiveTabClass;
               }
               if(this.campaignLaunchForm.valid){
                   this.launchCampaignTabClass = this.successTabClass;
               }else{
                   this.launchCampaignTabClass = this.inActiveTabClass;
               }

            }
            else if(step=="step-3"){
                this.videoTabClass = this.currentTabActiveClass;
                this.campaignDetailsTabClass = this.successTabClass;
                if(this.isContactList){
                    this.contactListTabClass = this.successTabClass;
                }else{
                    this.contactListTabClass = this.inActiveTabClass;
                }
                if(this.isEmailTemplate){
                    this.emailTemplateTabClass = this.successTabClass;
                }else{
                    this.emailTemplateTabClass = this.inActiveTabClass;
                }
                if(this.campaignLaunchForm.valid){
                    this.launchCampaignTabClass = this.successTabClass;
                }else{
                    this.launchCampaignTabClass = this.inActiveTabClass;
                }
            }else if(step=="step-4"){
                //Highlighting Contact List Tab With Oragne
                this.contactListTabClass  = this.currentTabActiveClass;
                this.campaignDetailsTabClass = this.successTabClass;
                this.videoTabClass  = this.successTabClass;
                if(this.isEmailTemplate){
                    this.emailTemplateTabClass = this.successTabClass;
                }else{
                    this.emailTemplateTabClass = this.inActiveTabClass;
                }
                if(this.campaignLaunchForm.valid){
                    this.launchCampaignTabClass = this.successTabClass;
                }else{
                    this.launchCampaignTabClass = this.inActiveTabClass;
                }
            }else if(step=="step-5"){
              //Highlighting Email Templatet Tab With Oragne
                this.emailTemplateTabClass = this.currentTabActiveClass;
                this.videoTabClass = this.successTabClass;
                this.campaignDetailsTabClass = this.successTabClass;
                this.contactListTabClass = this.successTabClass;
                if(this.campaignLaunchForm.valid){
                    this.launchCampaignTabClass = this.successTabClass;
                }else{
                    this.launchCampaignTabClass = this.inActiveTabClass;
                }
            }else if(step=="step-6"){
              //Highlighting Launch With Oragne
                this.launchCampaignTabClass = this.currentTabActiveClass;
                this.campaignDetailsTabClass = this.successTabClass;
                this.contactListTabClass = this.successTabClass;
                this.videoTabClass  = this.successTabClass;
                this.emailTemplateTabClass = this.successTabClass;
                this.listSocialStatusProviders();
                this.statusMessage = this.campaign.campaignName;
                if(!this.isAdd && this.selectedTemplateBody!==undefined){
                    this.getAnchorLinksFromEmailTemplate(this.selectedTemplateBody);
                }

            }

            $( id ).addClass( "activeStepInfo" );
        }


        /**
         * @author Manas Ranjan Sahoo
         * @since 27/06/2017
         */

        toggleSelectAll() {
            this.isAllSelected = !this.isAllSelected;
            this.selectedAccounts = 0;
            if (this.isAllSelected) {
                this.socialStatusProviders.forEach(data => {
                    data.selected = false;
                    this.toggleSocialStatusProvider(data);
                })
            } else {
                this.socialStatusList.length = 1;
                this.socialStatusProviders.forEach(data => data.selected = false);
            }
        }

        toggleSocialStatusProvider(socialStatusProvider: SocialStatusProvider){
            socialStatusProvider.selected = !socialStatusProvider.selected;
            this.selectedAccounts = socialStatusProvider.selected ? this.selectedAccounts + 1 : this.selectedAccounts - 1;
            if (this.selectedAccounts === 0)
                this.isAllSelected = false;
            if (this.selectedAccounts === this.socialStatusProviders.length)
                this.isAllSelected = true;
        }

        listSocialStatusProviders() {
         if(this.socialStatusProviders.length < 1){
            const socialConnections = this.socialService.socialConnections;
            socialConnections.forEach( data => {
                if(data.active){
                    let socialStatusProvider = new SocialStatusProvider();
                    socialStatusProvider.socialConnection = data;
                    this.socialStatusProviders.push(socialStatusProvider);
                }
            })
         }
        }

 /***************************Email Rules***********************************/
        addReplyRows() {
            this.reply = new Reply();
            //$('.bs-timepicker-field').attr("disabled",'disabled');
            let length = this.allItems.length;
            length = length+1;
            var id = 'reply-'+length;
            this.reply.divId = id;
            this.reply.actionId =0;
            this.reply.subject = this.refService.replaceMultipleSpacesWithSingleSpace(this.campaign.subjectLine);
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
            this.url.subject = this.refService.replaceMultipleSpacesWithSingleSpace(this.campaign.subjectLine);
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
             return data.divId !== id
          });
         return arr;
     }

     showTab(evt, tabName) {
         let i, tabcontent, tablinks;
         tabcontent = document.getElementsByClassName("tabcontent");
         for (i = 0; i < tabcontent.length; i++) {
             tabcontent[i].style.display = "none";
         }
         tablinks = document.getElementsByClassName("tablinks");
         for (i = 0; i < tablinks.length; i++) {
             tablinks[i].className = tablinks[i].className.replace("active", "");
         }
         document.getElementById(tabName).style.display = "block";
         evt.currentTarget.className += " active";
         if(tabName=="my-videos"){
             this.isMyVideosActive = true;
         }else{
             this.isMyVideosActive  = false;
         }
     }

     resetTabClass(){
         this.myVideosClass = this.tabClass;
         this.myVideosStyle = this.styleHiddenClass;
         this.partnerVideosClass = this.tabClass;
         this.partnerVideosStyle  = this.styleHiddenClass;
     }

     selectReplyEmailBody(event:any,index:number,reply:Reply){
         reply.defaultTemplate = event;
     }
     selectClickEmailBody(event:any,index:number,url:Url){
         url.defaultTemplate = event;
     }

     onSelect(countryId) {
        this.timezones = this.refService.getTimeZonesByCountryId(countryId);
       }

     setFromName(){
         let user = this.teamMemberEmailIds.filter((teamMember)=> teamMember.emailId == this.campaign.email)[0];
         this.campaign.fromName = $.trim(user.firstName+" "+user.lastName);
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
           if(this.isAdd){
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
         () => console.log( "Campaign Names Loaded" )
         );
     }


     setLoggedInUserEmailId(){
         const userProfile = this.authenticationService.userProfile;
         this.campaign.email = userProfile.emailId;
         if(userProfile.firstName !== undefined && userProfile.lastName !== undefined){
             this.campaign.fromName = $.trim(userProfile.firstName + " " + userProfile.lastName);}
         else if(userProfile.firstName !== undefined && userProfile.lastName == undefined){
             this.campaign.fromName = $.trim(userProfile.firstName); }
         else {
             this.campaign.fromName = $.trim(userProfile.emailId); }
         this.setEmailIdAsFromName();
     }


     setEmailIdAsFromName(){
         if(this.campaign.fromName.length==0){
             this.campaign.fromName = this.campaign.email;
         }
     }



     launchCampaign(){
        this.refService.startLoader(this.httpRequestLoader);
         var data = this.getCampaignData("");
         var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
         if(errorLength==0){
             this.dataError = false;
             this.refService.goToTop();
             this.campaignService.saveCampaign( data )
             .subscribe(
             response => {
                 if(response.statusCode==2000){
                     this.refService.campaignSuccessMessage = data['scheduleCampaign'];
                     this.refService.launchedCampaignType = this.campaignType;
                     this.isLaunched = true;
                     this.reInitialize();
                     this.router.navigate(["/home/campaigns/manage"]);
                 }else{
                     this.invalidScheduleTime = true;
                     this.invalidScheduleTimeError = response.message;
                     if(response.statusCode==2016){
                         this.campaignService.addErrorClassToDiv(response.data.emailErrorDivs);
                         this.campaignService.addErrorClassToDiv(response.data.websiteErrorDivs);
                     }
                 }
                 this.refService.stopLoader(this.httpRequestLoader);
             },
             error => {
                 this.hasInternalError = true;
                 this.logger.errorPage(error);
             },
             () => this.logger.info("Finished launchCampaign()")
         );
         }else{
             this.refService.stopLoader(this.httpRequestLoader);
             this.refService.goToDiv("email-template-preview-div");
             this.dataError = true;
         }
     return false;
     }



    /**
     *
     * Push Leads to Marketo
     */

    pushMarketo(event: any)
    {
        this.pushToMarketo =  !this.pushToMarketo;
        console.log(this.pushToMarketo);

        if (this.pushToMarketo)
        {
            this.checkMarketoCredentials();
        }
    }
    
     smsServices(){
        
        this.smsService =  !this.smsService;
        
            this.enableSmsText =  this.smsService;
       
        
    }


    clearValues()
    {
        this.clientId = '';
        this.secretId = '';
        this.marketoInstance = '';
        this.clientIdClass = "form-group";
        this.secretIdClass = "form-group";
        this.marketoInstanceClass = "form-group";

    }
    checkMarketoCredentials()
    {
        this.loadingMarketo = true;
        this.emailTemplateService.checkMarketoCredentials(this.authenticationService.getUserId()).subscribe(response =>
        {
            if (response.statusCode == 8000)
            {
                this.loading = true;
                this.emailTemplateService.checkCustomObjects(this.authenticationService.getUserId()).subscribe(customObjectResponse =>
                    {
                        if (customObjectResponse.statusCode == 8020){
                            this.pushToMarketo =  true;
                            console.log(this.pushToMarketo);

                            this.templateError = false;
                            this.loading = false;
                        }else{
                            this.pushToMarketo = false;

                            this.templateError = false;
                            this.loading = false;
                        }

                    }, error =>
                    {
                        this.pushToMarketo = false;
                        this.templateError = error;

                        this.loadingMarketo = false;
                    })

            }
            else
            {
                this.pushToMarketo = false;

                $("#templateRetrieve").modal('show');
                $("#closeButton").show();
                this.templateError = false;
                this.loadingMarketo = false;

            }
        }, error =>
            {
                this.pushToMarketo = false;
                this.templateError = error;
                $("#templateRetrieve").modal('show');
                $("#closeButton").show();
                this.loadingMarketo = false;
            })
    }


    submitMarketoCredentials()
    {
        this.loadingMarketo = true;
        const obj = {
            userId: this.authenticationService.getUserId(),
            instanceUrl: this.marketoInstance,
            clientId: this.clientId,
            clientSecret: this.secretId
        }

        this.emailTemplateService.saveMarketoCredentials(obj).subscribe(response =>
        {
            if (response.statusCode == 8003)
            {
                $("#closeButton").hide();
                this.showMarketoForm = false;
                this.pushToMarketo = true;
                this.templateError = false;
                this.templateSuccessMsg = response.message;
                this.loadingMarketo = false;

                setTimeout(function () { $("#templateRetrieve").modal('hide') }, 3000);
            } else
            {
                this.pushToMarketo = false;
                $("#templateRetrieve").modal('show');
                $("#closeButton").show();
                this.templateError = response.message;
                this.templateSuccessMsg = false;
                this.loadingMarketo = false;
            }
        }, error =>
        {
        this.templateError = error;
            this.pushToMarketo = false;
            $("#closeButton").show();
            this.loadingMarketo = false;
        }
        )

    }
    getTemplatesFromMarketo()
    {
        this.clearValues();

        this.checkMarketoCredentials();



    }


    validateModelForm(fieldId: any)
    {
        var errorClass = "form-group has-error has-feedback";
        var successClass = "form-group has-success has-feedback";

        if (fieldId == 'email')
        {
            if (this.clientId.length > 0)
            {
                this.clientIdClass = successClass;
                this.clentIdError = false;
            } else
            {
                this.clientIdClass = errorClass;
                this.clentIdError = true;
            }
        } else if (fieldId == 'pwd')
        {
            if (this.secretId.length > 0)
            {
                this.secretIdClass = successClass;
                this.secretIdError = false;
            } else
            {
                this.secretIdClass = errorClass;
                this.secretIdError = true;
            }
        } else if (fieldId == 'instance')
        {
            if (this.marketoInstance.length > 0)
            {
                this.marketoInstanceClass = successClass;
                this.marketoInstanceError = false;
            } else
            {
                this.marketoInstanceClass = errorClass;
                this.marketoInstanceError = false;
            }
        }
        this.toggleSubmitButtonState();
    }


    saveMarketoTemplatesButtonState()
    {


    }


    toggleSubmitButtonState()
    {
        if (!this.clentIdError && !this.secretIdError && !this.marketoInstanceError)
            {
            this.isModelFormValid = true;
            this.marketoButtonClass = "btn btn-primary";
            }
        else
        {
            this.isModelFormValid = false;
            this.marketoButtonClass = "btn btn-default";
        }

    }
    closeModal()
    {
        this.pushToMarketo = false;
        $("#templateRetrieve").modal('hide');
    }


}
