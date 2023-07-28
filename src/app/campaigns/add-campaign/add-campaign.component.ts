import { Component, OnInit,ViewChild,Renderer } from '@angular/core';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CampaignService } from '../services/campaign.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pipeline } from 'app/dashboard/models/pipeline';
import { IntegrationService } from 'app/core/services/integration.service';
import { Pagination } from 'app/core/models/pagination';
import { EmailTemplateType } from 'app/email-template/models/email-template-type';
import { Reply } from '../models/campaign-reply';
import { Url } from '../models/campaign-url';
import { CustomResponse } from 'app/common/models/custom-response';
import { AddFolderModalPopupComponent } from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import { PagerService } from 'app/core/services/pager.service';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { Properties } from 'app/common/models/properties';
import { ContactService } from 'app/contacts/services/contact.service';
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { CampaignType } from '../models/campaign-type';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { EnvService } from 'app/env.service';
import { PreviewLandingPageComponent } from 'app/landing-pages/preview-landing-page/preview-landing-page.component';
import { LandingPage } from 'app/landing-pages/models/landing-page';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { CustomAnimation } from 'app/core/models/custom-animation';
import { ComponentCanDeactivate } from 'app/component-can-deactivate';


declare var swal:any, $:any, videojs:any, flatpickr:any, CKEDITOR:any, require: any;
var moment = require('moment-timezone');

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css'],
  providers:[CallActionSwitch,SortOption,Properties,LandingPageService],
  animations:[CustomAnimation]
})
export class AddCampaignComponent implements OnInit,ComponentCanDeactivate {

  loggedInUserId = 0;
  campaignId = 0;
  campaign: Campaign = new Campaign();
  isAdd = false;
  isEmailCampaign = false;
  isVideoCampaign = false;
  isPageCampaign = false;
  isSurveyCampaign = false;
  ngxLoading = false;

  errorClass = "form-group has-error has-feedback";
  successClass = "form-group has-success has-feedback";
  defaultTabClass = "col-block";
  activeTabClass = "col-block col-block-active width";
  completedTabClass = "col-block col-block-complete";
  disableTabClass = "col-block col-block-disable";
  campaignDetailsTabClass = this.activeTabClass;
  launchTabClass = this.disableTabClass;


  /************Campaign Details******************/
  campaignDetailsTabText ="Campaign Details & Templates";
  isValidCampaignDetailsTab = false;
  isValidFirstTab = false;
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
  isValidCampaignName = true;
  categoryNames: any;
  @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
  partnerModuleCustomName = "Partner";
  toPartnerToolTipMessage = "";
  throughPartnerToolTipMessage = "";
  toPartnerText = "To Partner";
  throughPartnerText = "Through Partner";
  throughPartnerAndToPartnerHelpToolTip: string;
  shareWhiteLabeledContent = false;
  campaignDetailsLoader = false;
  campaignAccess:any;
  activeCRMDetails: any;
  leadPipelines = new Array<Pipeline>();
  dealPipelines = new Array<Pipeline>();
  defaultLeadPipelineId = 0;
  defaultDealPipelineId = 0;
  showConfigurePipelines = false;
  pipelineLoader: HttpRequestLoader = new HttpRequestLoader();
  isGdprEnabled = false;
  oneClickLaunchToolTip = "";
  emailTemplatesPagination:Pagination = new Pagination();
  selectedContactListIds = [];
  userListDTOObj = [];
  isContactList = false;
  selectedPartnershipId: number;
  replies: Array<Reply> = new Array<Reply>();
  urls: Array<Url> = new Array<Url>();
  workflowError: boolean;
  showUsersPreview = false;
  mergeTagsInput: any = {};
  teamMemberEmailIds: any[] = [];
  showMarketingAutomationOption = false;
  leadPipelineClass: string = this.formGroupClass;
  dealPipelineClass: string = this.formGroupClass;
  endDateDivClass: string = this.formGroupClass;
  isOrgAdminCompany = false;
  isMarketingCompany = false;
  isVendorCompany = false;
  endDatePickr: any;
  notifyPartnersLabelText  = "";
  notifyPartnersToolTipMessage = "";

  /****Video***/
  videosLoader = false;
  videosPagination:Pagination = new Pagination();
  selectedVideoId = 0;
  videosSortOption:SortOption = new SortOption();
  videos:Array<any> = new Array<any>();
  draftMessage = "";
  selectedVideoFileForPreview:SaveVideoFile;
  videoCategories:Array<any> = new Array<any>();
  isVideoSelected = false;
  isNavigatedFromManageContent = false;
  /****Email Templates****/
  emailTemplatesOrLandingPagesLoader = false;
  campaignEmailTemplates:Array<any> = Array<any>();
  selectedEmailTemplateRow = 0;
  isEmailTemplateOrPageSelected: boolean;
  emailTemplatesSortOption:SortOption = new SortOption();
  isPreviewEmailTemplateButtonClicked = false;
  selectedEmailTemplateIdForPreview = 0;
  emailTemplateHrefLinks = [];
  isSendTestEmailOptionClicked = false;
  selectedEmailTemplateNameForPreview = "";
  
  /********Pages*******/
  selectedPageId = 0;
  pagesPagination = new Pagination();
  pagesLoader = false;
  isLandingPageSelected = false;
  pagesSortOption:SortOption = new SortOption();
  isPreviewPageButtonClicked = false;
  selectedPageIdForPreview = 0;
  selectedPageNameForPreview = "";
  @ViewChild('previewLandingPageComponent') previewLandingPageComponent: PreviewLandingPageComponent;
  landingPage: LandingPage = new LandingPage();

  /******Edit Template******/
  isEditTemplateLoader = false;
  beeContainerInput = {};
  isShowEditTemplatePopup = false;
  isShowEditTemplateMessageDiv = false;
  templateUpdateMessage = "";
  editTemplateMergeTagsInput:any = {};
  jsonBody: any;
  templateMessageClass = "";
  emailTemplate:any;
  sendTestEmailToolTip = "Please select an email template";
 /***Filter Popup****/
  public selectedFolderIds = [];
  public emailTemplateFolders: Array<any>;
  public folderFields: any;
  public folderFilterPlaceHolder: string = 'Select folder';
  folderErrorCustomResponse: CustomResponse = new CustomResponse();
  isFolderSelected = true;
  folderCustomResponse: CustomResponse = new CustomResponse();
  filterCategoryLoader = false;
  isShowFilterDiv = false;
  /***Filter Popup****/

  /***Launch Tab****/
  launchTabText = "";
  contactsOrPartnersSelectionText = "";
  campaignRecipientsLoader = false;
  campaignRecipientsPagination:Pagination = new Pagination();
  recipientsSortOption: SortOption = new SortOption();
  showRecipientsSearchResultExpandButton = false;
  campaignRecipientsList: Array<any>;
  isHeaderCheckBoxChecked: boolean;
  showContactType = false;
  selectedListName: any;
  selectedListId: any;
  expandedUserList: any;
  emptyContactsMessage: string;
  /***Workflows*****/
  reply: Reply = new Reply();
  url: Url = new Url();
  allItems = [];
  emailNotOpenedReplyDaysSum: number = 0;
  emailOpenedReplyDaysSum: number = 0;
  onClickScheduledDaysSum: number = 0;
  isReloaded: boolean = false;
  invalidScheduleTime: boolean = false;
  hasInternalError: boolean = false;
  countries: Country[];
  timezones: Timezone[];
  sheduleCampaignValues = ['NOW', 'SCHEDULE', 'SAVE'];
  launchOptions = [{'key':'Launch','value':'NOW'},{'key':'Schedule','value':'SCHEDULE'},{'key':'Save','value':'SAVE'}]
  isLaunched: boolean = false;
  lauchTabPreivewDivClass = "col-xs-12 col-sm-12 col-md-7 col-lg-7";
  buttonName: string = "Save";
  selectedLaunchOption = "SAVE";
  invalidShareLeadsSelection: boolean;
  invalidShareLeadsSelectionErrorMessage: any;
  invalidScheduleTimeError: any;
  isValidSelectedCountryId = true;
  isValidSelectedTimeZone = true;
  isValidLaunchTime = true;
  launchOptionsDivClass = "col-md-4 form-group";
  launchOptionsErrorClass = this.launchOptionsDivClass+" has-error has-feedback";
  launchOptionsSuccessClass =  this.launchOptionsDivClass+" has-success has-feedback";
  countryNameDivClass:string = this.launchOptionsDivClass;
  timeZoneDivClass:string =  this.launchOptionsDivClass;
  launchTimeDivClass:string = this.launchOptionsDivClass;
  statusCode =0;
  emailReceiversCountError: boolean;
  validUsersCount = 0;
  allUsersCount = 0;
  emailReceiversCountLoader = true;
  emailTemplateIdForSendTestEmail = 0;
  emailTemplateNameForSendTestEmail = "";
  anyLaunchButtonClicked = false;
  
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,
    public campaignService:CampaignService,public xtremandLogger:XtremandLogger,public callActionSwitch:CallActionSwitch,
    private activatedRoute:ActivatedRoute,public integrationService: IntegrationService,private pagerService: PagerService,
    private utilService:UtilService,private emailTemplateService:EmailTemplateService,public properties:Properties,
    private contactService:ContactService,private render: Renderer,private router:Router,private envService:EnvService,
    private landingPageService:LandingPageService) {
    this.campaignType = this.activatedRoute.snapshot.params['campaignType'];
    this.campaignId = this.activatedRoute.snapshot.params['campaignId'];
    this.isEmailCampaign = "email"==this.campaignType;
    this.isVideoCampaign = "video"==this.campaignType;
    this.isSurveyCampaign = "survey"==this.campaignType;
    this.isPageCampaign = "page"==this.campaignType;
    if(this.isPageCampaign){
        this.campaignDetailsTabText = "Campaign Details & Pages";
    }
    if(this.isEmailCampaign || this.isSurveyCampaign || this.isPageCampaign || this.isVideoCampaign){
        let currentUrl = this.referenceService.getCurrentRouteUrl();
        this.isAdd = currentUrl!=undefined && currentUrl!=null && currentUrl!="" && currentUrl.indexOf("create")>-1;
        this.campaign = new Campaign();
        if (this.campaignService.campaign == undefined) {
            if (this.router.url == "/home/campaigns/edit/"+this.campaignType) {
                this.isReloaded = true;
                this.router.navigate(["/home/campaigns/manage"]);
            } else if (this.campaignType.length == 0) {
                this.isReloaded = true;
                this.router.navigate(["/home/campaigns/select"]);
            }
        }
        if(!this.isReloaded){
            $('.bootstrap-switch-label').css('cssText', 'width:31px;!important');
            this.loggedInUserId = this.authenticationService.getUserId();
            this.campaign.userId = this.loggedInUserId;
            this.referenceService.renderer = this.render;
            
        }
    }else{
        this.isReloaded = true;
        this.referenceService.goToPageNotFound();
    }
    
   }

    ngOnInit() {
        if(!this.isReloaded){
            this.addBlur();
            this.countries = this.referenceService.getCountries();
            this.editCampaign();
            this.showCampaignDetailsTab();
            this.loadCampaignDetailsSection();
        }
       
        
    }

    private editCampaign() {
        let campaign = this.campaignService.campaign;
        if (!this.isAdd && campaign != undefined) {
            this.editedCampaignName = campaign.campaignName;
            this.campaign = campaign;
            this.userListDTOObj = this.campaignService.campaign.userLists;
            if (this.userListDTOObj === undefined) { this.userListDTOObj = []; }
            this.campaignRecipientsPagination.campaignId = this.campaign.campaignId;
            this.setEmailTemplatesFilter(this.emailTemplatesPagination);
            this.getCampaignReplies(this.campaign);
            this.getCampaignUrls(this.campaign);
            /***********Select Contact List Tab*************************/
            if (this.campaign.userListIds.length > 0) {
                this.isContactList = true;
                this.launchTabClass = this.activeTabClass;
                this.campaignRecipientsPagination.editCampaign = true;
                this.selectedContactListIds = this.campaign.userListIds.sort();
                let selectedListSortOption = {
                    'name': 'Selected List', 'value': 'selectedList'
                };
                this.recipientsSortOption.campaignRecipientsDropDownOptions.push(selectedListSortOption);
                this.recipientsSortOption.selectedCampaignRecipientsDropDownOption = this.recipientsSortOption.campaignRecipientsDropDownOptions[this.recipientsSortOption.campaignRecipientsDropDownOptions.length - 1];
                this.getValidUsersCount();

            }
            /****XNFR-125****/
            this.selectedPartnershipId = this.campaign.partnershipId;
            /***********Select Email Template*************************/
            var selectedTemplateId = campaign.selectedEmailTemplateId;
            if (selectedTemplateId > 0) {
                this.selectedEmailTemplateRow = selectedTemplateId;
                this.isEmailTemplateOrPageSelected = true;
                this.emailTemplate = this.campaign.emailTemplate;
                this.emailTemplateIdForSendTestEmail = this.emailTemplate.id;
                this.emailTemplateNameForSendTestEmail = this.emailTemplate.name;
                let selectedEmailTemplateSortOption = {
                    'name': 'Selected Email Template', 'value': 'selectedEmailTemplate'
                };
                this.emailTemplatesSortOption.eventCampaignRecipientsDropDownOptions.push(selectedEmailTemplateSortOption);
                this.emailTemplatesSortOption.selectedCampaignEmailTemplateDropDownOption = this.emailTemplatesSortOption.eventCampaignRecipientsDropDownOptions[this.emailTemplatesSortOption.eventCampaignRecipientsDropDownOptions.length - 1];
                this.emailTemplatesPagination = this.utilService.sortOptionValues(this.emailTemplatesSortOption.selectedCampaignEmailTemplateDropDownOption, this.emailTemplatesPagination);
                this.emailTemplatesPagination.editCampaign = true;
                this.emailTemplatesPagination.selectedEmailTempalteId = selectedTemplateId;
                this.emailTemplateHrefLinks = this.referenceService.getAnchorTagsFromEmailTemplate(this.emailTemplate.body, this.emailTemplateHrefLinks);
                this.sendTestEmailToolTip = this.properties.sendTestEmail;
            }

             /*****************Landing Page**************************/
             let selectedLandingPageId = this.campaignService.campaign.landingPageId;
             if (this.campaignType == "page") {
                 if (selectedLandingPageId > 0) {
                     this.selectedPageId = selectedLandingPageId;
                     this.landingPage = this.campaign.landingPage;
                 }
                 let selectedPageSortOption = {
                    'name': 'Selected Page', 'value': 'selectedPage'
                };
                this.pagesSortOption.eventCampaignRecipientsDropDownOptions.push(selectedPageSortOption);
                this.pagesSortOption.selectedCampaignEmailTemplateDropDownOption = this.pagesSortOption.eventCampaignRecipientsDropDownOptions[this.pagesSortOption.eventCampaignRecipientsDropDownOptions.length - 1];
                this.pagesPagination = this.utilService.sortOptionValues(this.pagesSortOption.selectedCampaignEmailTemplateDropDownOption, this.pagesPagination);
                this.pagesPagination.selectedEmailTempalteId = selectedLandingPageId;
             }

            var selectedVideoId = this.campaignService.campaign.selectedVideoId;
            if (selectedVideoId > 0) {
                this.selectedVideoId = selectedVideoId;
                this.setVideoSortOptionForSelectedVideo();
                
            }   
            /************Launch Campaign**********************/
            if (campaign.campaignScheduleType == "SCHEDULE") {
                this.selectedLaunchOption = this.sheduleCampaignValues[1];
                this.buttonName = this.launchOptions[1]['key'];
            } else {
                this.campaign.scheduleTime = "";
                this.selectedLaunchOption = this.sheduleCampaignValues[2];
            }
            if (this.campaign.timeZoneId == undefined) {
                this.campaign.countryId = this.countries[0].id;
                this.getTimeZones(this.campaign.countryId);
            } else {
                let countryNames = this.referenceService.getCountries().map(function (a) { return a.name; });
                let countryIndex = countryNames.indexOf(this.campaign.country);
                if (countryIndex > -1) {
                    this.campaign.countryId = this.countries[countryIndex].id;
                    this.getTimeZones(this.campaign.countryId);
                } else {
                    this.campaign.countryId = this.countries[0].id;
                    this.getTimeZones(this.campaign.countryId);
                }

            }
            this.validateForm();
        }
    }

    private setEmailTemplatesFilter(emailTemplatesPagination:Pagination) {
        if (this.isEmailCampaign) {
            emailTemplatesPagination.filterBy = this.properties.campaignRegularEmailsFilter;
            if (this.campaign.enableCoBrandingLogo) {
                emailTemplatesPagination.emailTemplateType = EmailTemplateType.REGULAR_CO_BRANDING;
            } else {
                emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
            }
        } else if (this.isVideoCampaign) {
            emailTemplatesPagination.filterBy = this.properties.campaignVideoEmailsFilter;
            if (this.campaign.enableCoBrandingLogo) {
                emailTemplatesPagination.emailTemplateType = EmailTemplateType.VIDEO_CO_BRANDING;
            } else {
                emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
            }
        } else if (this.isSurveyCampaign) {
            emailTemplatesPagination.filterBy = this.properties.campaignSurveyEmailsFilter;
            if (this.campaign.enableCoBrandingLogo) {
                emailTemplatesPagination.emailTemplateType = EmailTemplateType.SURVEY_CO_BRANDING;
            } else {
                emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
            }
        }
    }

    getCampaignReplies(campaign: Campaign) {
        if (campaign.campaignReplies != undefined) {
            this.replies = campaign.campaignReplies;
            for (var i = 0; i < this.replies.length; i++) {
                let reply = this.replies[i];
                if (reply.defaultTemplate) {
                    reply.selectedEmailTemplateIdForEdit = reply.selectedEmailTemplateId;
                }
                reply.emailTemplatesPagination = new Pagination();
                reply.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes(reply.replyTimeInHoursAndMinutes);
                if ($.trim(reply.subject).length == 0) {
                    reply.subject = campaign.subjectLine;
                }
                let length = this.allItems.length;
                length = length + 1;
                var id = 'reply-' + length;
                reply.divId = id;
                this.allItems.push(id);
                if(reply.selectedEmailTemplateId>0){
                    reply.emailTemplatesPagination.selectedEmailTempalteId = reply.selectedEmailTemplateId;
                    reply.emailTemplatesPagination.sortcolumn = "selectedEmailTemplate";
                }
                this.findEmailTemplatesForAutoResponseWorkFlow(reply);
            }
        }

    }


    getCampaignUrls(campaign: Campaign) {
        if (campaign.campaignUrls != undefined) {
            this.urls = campaign.campaignUrls;
            for (var i = 0; i < this.urls.length; i++) {
                let url = this.urls[i];
                if (url.defaultTemplate) {
                    url.selectedEmailTemplateIdForEdit = url.selectedEmailTemplateId;
                }
                url.emailTemplatesPagination = new Pagination();
                if (url.scheduled) {
                    url.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes(url.replyTimeInHoursAndMinutes);
                }
                if ($.trim(url.subject).length == 0) {
                    url.subject = campaign.subjectLine;
                }
                let length = this.allItems.length;
                length = length + 1;
                var id = 'click-' + length;
                url.divId = id;
                this.allItems.push(id);
                if(url.selectedEmailTemplateId>0){
                    url.emailTemplatesPagination.selectedEmailTempalteId = url.selectedEmailTemplateId;
                    url.emailTemplatesPagination.sortcolumn = "selectedEmailTemplate";
                }
                this.findEmailTemplatesForWebSiteWorkFlow(url);
            }
        }

    }



    addBlur(){
        this.referenceService.addBlur("campaign-details-and-launch-tabs");
    }
    removeBlur(){
        this.referenceService.removeBlur("campaign-details-and-launch-tabs");
    }

    showCampaignDetailsTab(){
        this.campaignDetailsTabClass = this.activeTabClass;
        if(this.isContactList && this.isValidCampaignDetailsTab && (this.selectedEmailTemplateRow>0 || this.selectedPageId>0) && this.isVideoSelected){
            this.launchTabClass = this.completedTabClass;
        }else{
           // this.launchTabClass = this.activeTabClass;
        }
        $('#launch-tab').hide(600);
        $('#campaign-details').show(600);
        this.referenceService.goToTop();
    }

    showLaunchTab(){
        this.isValidVideoSelected();
        if(this.isValidCampaignDetailsTab && (this.selectedEmailTemplateRow>0 || this.selectedPageId>0) && this.isVideoSelected){
            this.referenceService.goToTop();
            this.campaignDetailsTabClass = this.completedTabClass;
            this.launchTabClass = this.activeTabClass;
            $('#campaign-details').hide(600);
            $('#launch-tab').show(600);
        }
    }

    private isValidVideoSelected() {
        if (this.isVideoCampaign) {
            this.isVideoSelected = this.campaign.selectedVideoId > 0;
        } else {
            this.isVideoSelected = true;
        }
    }

    loadCampaignDetailsSection(){
        this.campaignDetailsLoader = true;
        this.initializeEndDatePicker();
        this.initializeLaunchTimeDatePicker();
        this.findCampaignDetailsData();
    }
    private initializeLaunchTimeDatePicker() {
        flatpickr('#launchTime', {
            enableTime: true,
            dateFormat: 'm/d/Y h:i K',
            time_24hr: false
        });  
    }

    private initializeEndDatePicker() {
        let now: Date = new Date();
        let defaultDate = now;
        if (this.campaign.endDate != undefined && this.campaign.endDate != null) {
            defaultDate = new Date(this.campaign.endDate);
        }

        this.endDatePickr = flatpickr('#campaignEndDatePicker', {
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            time_24hr: true,
            minDate: now,
            defaultDate: defaultDate
        });
    }

    findCampaignDetailsData(){
        this.campaignService.findCampaignDetailsData().subscribe(
            response=>{
                let data = response.data;
                this.names.push(data['campaignNames']);
                this.categoryNames = data['categories'];
                let categoryIds = this.categoryNames.map(function (a:any) { return a.id; });
                if(this.campaign.categoryId==0 || this.campaign.categoryId==undefined || categoryIds.indexOf(this.campaign.categoryId)<0){
                    this.campaign.categoryId = categoryIds[0];
                }
                this.campaignAccess = data['campaignAccess'];
                this.activeCRMDetails = data['activeCRMDetails'];
                this.isGdprEnabled = data['isGdprEnabled'];
                this.isOrgAdminCompany  = data['isOrgAdminCompany'];
                let isMarketingCompany  = data['isMarketingCompany'];
                let isVendorCompany = data['isVendorCompany'];
                this.isVendorCompany = isVendorCompany;
                this.isMarketingCompany = isMarketingCompany;
                this.showMarketingAutomationOption = this.isOrgAdminCompany || this.isMarketingCompany;
                this.setRecipientsHeaderText();
                this.setFromEmailAndFromName(data);
                let partnerModuleCustomName = localStorage.getItem("partnerModuleCustomName");
                if(partnerModuleCustomName!=null && partnerModuleCustomName!=undefined){
                    this.partnerModuleCustomName = partnerModuleCustomName;
                }
                if(this.isPageCampaign){
                    this.toPartnerText = "Private";
                    this.throughPartnerText = "Public";
                    this.toPartnerToolTipMessage = this.toPartnerText+": Share a private page";
                    this.throughPartnerToolTipMessage = this.throughPartnerText+": Share a public page";
                    this.throughPartnerAndToPartnerHelpToolTip = this.throughPartnerToolTipMessage +"<br><br>"+this.toPartnerToolTipMessage;
                    this.notifyPartnersLabelText = "Send Email Notifications";
                    this.notifyPartnersToolTipMessage = "Send email notification about your page";
                }else{
                    this.notifyPartnersLabelText = "Notify "+this.partnerModuleCustomName+"?";
                    this.notifyPartnersToolTipMessage = "Send email notifications to your "+this.partnerModuleCustomName+" about your campaign";
                    if(this.isOrgAdminCompany){
                        this.toPartnerText = "To Recipients";
                    }else{
                        this.toPartnerText = "To "+this.partnerModuleCustomName;
                    }
                    this.throughPartnerText = "Through "+this.partnerModuleCustomName;
                    let toolTipSuffixMessage  = this.isOrgAdminCompany ? this.partnerModuleCustomName+' / Contacts':this.partnerModuleCustomName;
                    this.toPartnerToolTipMessage = this.toPartnerText+": Send a campaign intended just for your "+ toolTipSuffixMessage;
                    this.throughPartnerToolTipMessage = this.throughPartnerText+": Send a campaign that your "+this.partnerModuleCustomName+" can redistribute";
                    this.throughPartnerAndToPartnerHelpToolTip = this.throughPartnerToolTipMessage +"<br><br>"+this.toPartnerToolTipMessage;
                }
                this.oneClickLaunchToolTip = "Send a campaign that your "+this.partnerModuleCustomName+" can redistribute with one click";
                if(this.isAdd){
                    this.campaign.countryId = this.countries[0].id;
                    this.campaign.emailNotification = true;
                    this.getTimeZones(this.campaign.countryId);
                }
                this.removeBlur();
            },error=>{
                this.removeBlur();
                this.xtremandLogger.errorPage(error);
        },()=>{
            this.findCampaignPipeLines();
            /***Load Email Templates/Videos/ Partners /Contacts***/
            this.campaignDetailsLoader = false;
            this.loadVideos();
            if(this.isPageCampaign){
               this.setPageCampaignFilterOptions()
                this.findPages(this.pagesPagination);
            }else{
                this.emailTemplatesPagination.maxResults = 4;
                this.findEmailTemplates(this.emailTemplatesPagination);
            }
            this.campaignRecipientsPagination.maxResults = 4;
            this.findCampaignRecipients(this.campaignRecipientsPagination);
        });
    }

    findPages(pagesPagination:Pagination){
        this.pagesLoader = true;
        this.campaignService.findPages(pagesPagination).subscribe(
            response=>{
                const data = response.data;
                pagesPagination.totalRecords = data.totalRecords;
                this.pagesSortOption.totalRecords = data.totalRecords;
                pagesPagination = this.pagerService.getPagedItems(pagesPagination, data.list);
                this.pagesLoader =  false;
            },error=>{
                this.xtremandLogger.errorPage(error);
            });
    }

    findPagesOnEnterKeyPress(eventKeyCode:number){
        if(eventKeyCode==13){
            this.searchPages();
        }
    }

    paginatePages(event:any){
        this.pagesPagination.pageIndex = event.page;
		this.findPages(this.pagesPagination);
    }

    sortPages(text: any) {
		this.pagesSortOption.selectedCampaignEmailTemplateDropDownOption = text;
		this.setSearchAndSortOptionsForPages(this.pagesPagination,this.pagesSortOption);
	}

    searchPages(){
        this.setSearchAndSortOptionsForPages(this.pagesPagination,this.pagesSortOption);
    }

    setSearchAndSortOptionsForPages(pagination: Pagination, pagesSortOption: SortOption){
		pagination.pageIndex = 1;
		pagination.searchKey = pagesSortOption.searchKey;
        pagination = this.utilService.sortOptionValues(pagesSortOption.selectedCampaignEmailTemplateDropDownOption, pagination);
        this.findPages(pagination);
    }

    selectPage(page:any){
        this.selectedPageId = page.id;
        this.landingPage = page;
        if(this.isValidCampaignDetailsTab){
            this.isValidFirstTab = true;
            this.launchTabClass = this.activeTabClass;
        }else{
            this.isValidFirstTab = false;
            this.launchTabClass = this.disableTabClass;
        }
    }
    showPagePreview(landingPage: LandingPage) {
        if (this.campaign.enableCoBrandingLogo) {
            landingPage.showYourPartnersLogo = true;
        } else {
            landingPage.showYourPartnersLogo = false;
        }
        this.previewLandingPageComponent.showPreview(landingPage);
    }

    editPage(landingPage:any){
        this.isShowEditTemplateMessageDiv = false;
        this.isEditTemplateLoader = true;
        this.referenceService.goToTop();
        $('#campaign-details-and-launch-tabs').hide(600);
        $('#edit-campaign-template').show(600);
        this.beeContainerInput['emailTemplateName'] = landingPage.name;
        this.landingPageService.getById(landingPage.id).subscribe(
            response=>{
                if(response.statusCode==200){
                    this.beeContainerInput['module'] = "pages";
                    this.beeContainerInput['jsonBody'] = response.data.jsonBody;
                    this.beeContainerInput['id'] = landingPage.id;
                }else{
                    this.hideEditTemplateDiv();
                    this.referenceService.showSweetAlertServerErrorMessage();
                }
            },error=>{
                this.hideEditTemplateDiv();
                this.referenceService.showSweetAlertServerErrorMessage();
            },() =>{
                this.setOpenLinksInNewTab(landingPage.id);
            });
    }

    setOpenLinksInNewTab(id:number){
        this.landingPageService.getOpenLinksInNewTab(id).subscribe(
            response=>{
                this.beeContainerInput['module'] = "pages";
                this.editTemplateMergeTagsInput['page'] = true;
                this.beeContainerInput['openLinksInNewTab'] = response.data;
                this.isShowEditTemplatePopup = true;
                this.isEditTemplateLoader = false;
            },error=>{
                this.hideEditTemplateDiv();
                this.referenceService.showSweetAlertServerErrorMessage();
            });
    }


    /*****Pages*****/

    private findCampaignPipeLines() {
        if (this.activeCRMDetails.activeCRM) {
            if ("SALESFORCE" === this.activeCRMDetails.type) {
                this.integrationService
                    .checkSfCustomFields(this.authenticationService.getUserId())
                    .subscribe(
                        (data) => {
                            let cfResponse = data;
                            if (cfResponse.statusCode === 400) {
                                swal(
                                    "Oh! Custom fields are missing in your Salesforce account. Leads and Deals created by your partners will not be pushed into Salesforce.",
                                    "",
                                    "error"
                                );
                            } else if (cfResponse.statusCode === 401 &&
                                cfResponse.message === "Expired Refresh Token") {
                                swal(
                                    "Your Salesforce Integration was expired. Please re-configure.",
                                    "",
                                    "error"
                                );
                            }
                        },
                        (error) => {
                            this.xtremandLogger.error(
                                error,
                                "Error in salesforce checkIntegrations()"
                            );
                        }
                    );
            } else {
                this.listCampaignPipelines();
            }
        } else {
            this.listCampaignPipelines();
        }
    }

    private loadVideos() {
        if (this.isVideoCampaign) {
            let contentVideoFile = this.referenceService.campaignVideoFile;
            if (contentVideoFile != undefined) {
                this.selectedVideoId = contentVideoFile.id;
                this.campaign.campaignVideoFile = contentVideoFile;
                this.isNavigatedFromManageContent = true;
                this.setVideoSortOptionForSelectedVideo();
                this.videosPagination.maxResults = 1;
            } else {
                this.isNavigatedFromManageContent = false;
                this.videosPagination.maxResults = 4;
            }
            this.findVideos(this.videosPagination);
        }
    }

    private setVideoSortOptionForSelectedVideo() {
        this.campaign.selectedVideoId = this.selectedVideoId;
        let selectedVideoSortOption = {
            'name': 'Selected Video', 'value': 'selectedVideo'
        };
        this.videosSortOption.videosDropDownOptions.push(selectedVideoSortOption);
        this.videosSortOption.selectedVideoDropDownOption = this.videosSortOption.videosDropDownOptions[this.videosSortOption.videosDropDownOptions.length - 1];
        this.videosPagination = this.utilService.sortOptionValues(this.videosSortOption.selectedVideoDropDownOption, this.videosPagination);
        this.videosPagination.selectedVideoId = this.selectedVideoId;
        this.isVideoSelected = true;
    }

    /***********Videos********************/
    findVideos(videosPagination: Pagination) {
        this.videosLoader = true;
        this.campaignService.findVideos(videosPagination).subscribe(
            response=>{
                const data = response.data;
                this.videos = data.list;
                this.videoCategories = data.categories;
                videosPagination.totalRecords = data.totalRecords;
                this.videosSortOption.totalRecords = data.totalRecords;
                videosPagination = this.pagerService.getPagedItems(videosPagination, this.videos);
                this.videosLoader =  false;
            },error=>{
                this.videosLoader = false;
                this.xtremandLogger.errorPage(error);
            });
    }

    filterVideos(event: any) {
        if (event.target.value != "") {
            this.videosPagination.categoryId = event.target.value;
            this.videosPagination.pageIndex = 1;
            this.videosPagination.maxResults = 4;
            this.findVideos(this.videosPagination);
        } else {
            this.videosPagination.categoryId = 0;
            this.videosPagination.pageIndex = 1;
            this.videosPagination.maxResults = 4;
            this.findVideos(this.videosPagination);
        }

    }

    findVideosOnEnterKeyPress(eventKeyCode:number){
        if(eventKeyCode==13){
            this.searchVideos();
        }
    }

    paginateVideos(event:any){
        this.videosPagination.pageIndex = event.page;
		this.findVideos(this.videosPagination);
    }

    sortVideos(text: any) {
		this.videosSortOption.selectedVideoDropDownOption = text;
		this.setSearchAndSortOptionsForVideos(this.videosPagination, this.videosSortOption);
	}

    searchVideos(){
        this.setSearchAndSortOptionsForVideos(this.videosPagination,this.videosSortOption);
    }

    setSearchAndSortOptionsForVideos(pagination: Pagination, videosSortOption: SortOption){
		pagination.pageIndex = 1;
		pagination.searchKey = videosSortOption.searchKey;
        pagination = this.utilService.sortOptionValues(videosSortOption.selectedVideoDropDownOption, pagination);
        this.findVideos(pagination);
    }

    findVideosOnLimitChange(videosPagination:Pagination){
        this.referenceService.goToDiv('videos-section');
        this.findVideos(videosPagination);
    }


    showToolTip(videoType: string) {
        if (videoType == "DRAFT") {
            this.draftMessage = "Video is in draft mode, please update the publish options to Library or Viewers.";
        } else {
            this.draftMessage = "";
        }
    }

    highlightSelectedVideo = function (videoFile: any) {
        let videoId = videoFile.id;
        if (videoFile.viewBy == "DRAFT" || !videoFile.processed) {
            this.draftMessage = "Video is in draft mode, please update the publish options to Library or Viewers.";
        } else {
            this.selectedVideoId = videoId;
            this.campaign.selectedVideoId = videoFile.id;
            $('#campaign_video_id_' + videoId).prop("checked", true);
            this.isValidVideoSelected();
            if(this.isValidCampaignDetailsTab && this.isVideoSelected && (this.selectedEmailTemplateRow>0||this.selectedPageId>0)){
                this.isValidFirstTab = true;
                this.launchTabClass = this.activeTabClass;
            }else{
                this.isValidFirstTab = false;
                this.launchTabClass = this.disableTabClass;
            }
        }
    }

    showVideoPreview(videoFile: SaveVideoFile) {
        let videoPath = "";
        if (videoFile.videoPath.startsWith("https")) {
            videoPath = videoFile.videoPath;
        } else {
            videoPath = this.envService.SERVER_URL + "vod/" + videoFile.videoPath;
        }
        videoFile.videoPath = videoPath;
        this.selectedVideoFileForPreview = videoFile;
    }
    closeCreateModal(event: any) {
        this.selectedVideoFileForPreview = undefined;
    }

    /***********End Of Videos********************/

    private setRecipientsHeaderText() {
        if(this.campaign.oneClickLaunch){
            this.launchTabText = "Select "+this.partnerModuleCustomName +" & Launch";
            this.contactsOrPartnersSelectionText = "Select One "+ this.partnerModuleCustomName + " Company";
        }else{
            if (this.isOrgAdminCompany) {
                if(this.campaign.channelCampaign){
                    this.launchTabText = "Select "+this.partnerModuleCustomName +" & Launch";
                    this.contactsOrPartnersSelectionText = "Select List of " + this.partnerModuleCustomName + " to be used in this campaign";
                }else{
                    this.launchTabText = "Select "+this.partnerModuleCustomName +" / Recipients & Launch";
                    this.contactsOrPartnersSelectionText = "Select List of " + this.partnerModuleCustomName + " / Recipients  to be used in this campaign";
                }
            } else if (this.isMarketingCompany) {
                this.launchTabText = "Select Recipients & Launch";
                this.contactsOrPartnersSelectionText = "Select List of Recipients to be used in this campaign";
            } else if (this.isVendorCompany) {
                this.launchTabText = "Select "+this.partnerModuleCustomName +" & Launch";
                this.contactsOrPartnersSelectionText = "Select List of " + this.partnerModuleCustomName + " to be used in this campaign";
            }
        }
        
    }

    private setFromEmailAndFromName(data: any) {
        let teamMembers = data['teamMembers'];
        let self = this;
        $.each(teamMembers, function (index: number, value: any) {
            self.teamMemberEmailIds.push(teamMembers[index]);
        });
        if (this.isAdd) {
            let teamMember = this.teamMemberEmailIds.filter((teamMember) => teamMember.id == this.loggedInUserId)[0];
            this.campaign.email = teamMember.emailId;
            this.campaign.fromName = $.trim(teamMember.firstName + " " + teamMember.lastName);
            this.setEmailIdAsFromName();
        } else {
            let existingTeamMemberEmailIds = this.teamMemberEmailIds.map(function (a) { return a.emailId; });
            if (existingTeamMemberEmailIds.indexOf(this.campaign.email) < 0) {
                this.setLoggedInUserEmailId();
            }
        }
    }

    setFromName() {
        let user = this.teamMemberEmailIds.filter((teamMember) => teamMember.emailId == this.campaign.email)[0];
        this.campaign.fromName = $.trim(user.firstName + " " + user.lastName);
        this.setEmailIdAsFromName();
    }

    setLoggedInUserEmailId() {
        const userProfile = this.authenticationService.userProfile;
        this.campaign.email = userProfile.emailId;
        if (userProfile.firstName !== undefined && userProfile.lastName !== undefined) {
            this.campaign.fromName = $.trim(userProfile.firstName + " " + userProfile.lastName);
        }
        else if (userProfile.firstName !== undefined && userProfile.lastName == undefined) {
            this.campaign.fromName = $.trim(userProfile.firstName);
        }
        else {
            this.campaign.fromName = $.trim(userProfile.emailId);
        }
        this.setEmailIdAsFromName();
    }


    setEmailIdAsFromName() {
        if (this.campaign.fromName.length == 0) {
            this.campaign.fromName = this.campaign.email;
        }
    }

    configurePipelines() {
         this.campaign.configurePipelines = !this.campaign.configurePipelines;
         if (!this.campaign.configurePipelines) {
             this.campaign.leadPipelineId = this.defaultLeadPipelineId;
             if (this.campaign.dealPipelineId == undefined || this.campaign.dealPipelineId === 0) {
                 this.campaign.dealPipelineId = this.defaultDealPipelineId;
             } 
         }
     }

    listCampaignPipelines() {
        if (this.campaignAccess.enableLeads) {
            this.showConfigurePipelines = true;
            this.referenceService.startLoader(this.pipelineLoader);
            this.campaignService.listCampaignPipelines(this.loggedInUserId)
                .subscribe(
                    response => {
                        if (response.statusCode == 200) {
                            let data = response.data;
                            this.leadPipelines = data.leadPipelines;
                            this.dealPipelines = data.dealPipelines;
                            if (!this.activeCRMDetails.activeCRM) {
                                this.leadPipelines.forEach(pipeline => {
                                    if (pipeline.default) {
                                        this.defaultLeadPipelineId = pipeline.id;
                                        if (this.campaign.leadPipelineId == undefined || this.campaign.leadPipelineId == null || this.campaign.leadPipelineId === 0) {
                                            this.campaign.leadPipelineId = pipeline.id;
                                        }                                     }
                                });

                                this.dealPipelines.forEach(pipeline => {
                                    if (pipeline.default) {
                                        this.defaultDealPipelineId = pipeline.id;
                                        if (this.campaign.dealPipelineId == undefined || this.campaign.dealPipelineId == null || this.campaign.dealPipelineId === 0) {
                                            this.campaign.dealPipelineId = pipeline.id;
                                        }                                     }
                                });
                            } else {
                                this.defaultLeadPipelineId = this.leadPipelines[0].id;
                                this.campaign.leadPipelineId = this.leadPipelines[0].id;
                                this.defaultDealPipelineId = this.dealPipelines[0].id;
                                if (this.campaign.dealPipelineId == undefined || this.campaign.dealPipelineId == null || this.campaign.dealPipelineId === 0) {
                                    this.campaign.dealPipelineId = this.dealPipelines[0].id;
                                }
                                
                            }

                        }
                        this.referenceService.stopLoader(this.pipelineLoader);
                    },
                    error => {
                        this.referenceService.stopLoader(this.pipelineLoader);
                        this.xtremandLogger.error(error);
                    });
        }

    }


  /****************Campaign Details***********/
    validateCampaignName(campaignName:string){
        let lowerCaseCampaignName = $.trim(campaignName.toLowerCase());//Remove all spaces
        var list = this.names[0];
        if (this.isAdd) {
            if ($.inArray(lowerCaseCampaignName, list) > -1) {
                this.isValidCampaignName = false;
            } else {
                this.isValidCampaignName = true;
            }
        } else {
            if ($.inArray(lowerCaseCampaignName, list) > -1 && this.editedCampaignName.toLowerCase() != lowerCaseCampaignName) {
                this.isValidCampaignName = false;
            } else {
                this.isValidCampaignName = true;
            }
        }
    }

    validateForm() {
        let errorClass = this.errorClass;
        let successClass = this.successClass;
        /*******Campaign Name*****/
        let trimmedCampaignName = $.trim(this.campaign.campaignName);
        let isValidCampaignName = trimmedCampaignName.length>0 &&  this.isValidCampaignName;
        this.campaignNameDivClass =  isValidCampaignName ? successClass :errorClass;
        /***From Name****/
        let trimmedFromName = $.trim(this.campaign.fromName);
        let isValidFromName= trimmedFromName.length>0;
        this.fromNameDivClass = isValidFromName ? successClass : errorClass;
        /*********Subject Line*****/
        let trimmedSubjectLine = $.trim(this.campaign.subjectLine);
        let isValidSubjectLine = trimmedSubjectLine.length>0;
        this.subjectLineDivClass = isValidSubjectLine ? successClass : errorClass;
        /*******Pre Header****/
        let trimmedPreHeader = $.trim(this.campaign.preHeader);
        let isValidPreHeader = trimmedPreHeader.length>0;
        this.preHeaderDivClass = isValidPreHeader ? successClass : errorClass;
        this.isValidCampaignDetailsTab = isValidCampaignName && isValidFromName && isValidSubjectLine && isValidPreHeader;
        /****Configure PipeLines**/
        if((this.campaign.channelCampaign && this.campaign.configurePipelines) || (this.showMarketingAutomationOption && this.campaign.configurePipelines)){
            let isValidLeadPipeLineSelected = this.campaign.leadPipelineId!=undefined && this.campaign.leadPipelineId>0;
            let isValidDealPipeLineSelected = this.campaign.dealPipelineId!=undefined && this.campaign.dealPipelineId>0;
            this.leadPipelineClass = isValidLeadPipeLineSelected ? successClass : errorClass;
            this.dealPipelineClass = isValidDealPipeLineSelected ? successClass : errorClass;
            this.isValidCampaignDetailsTab = this.isValidCampaignDetailsTab && isValidDealPipeLineSelected && isValidLeadPipeLineSelected;
        }
        this.isValidVideoSelected();
        if(this.isValidCampaignDetailsTab && (this.selectedEmailTemplateRow>0 || this.selectedPageId>0) && this.isVideoSelected){
            this.isValidFirstTab = true;
            this.launchTabClass = this.activeTabClass;
        }else{
            this.isValidFirstTab = false;
            this.disableLaunchTab();
        }
    }

    private disableLaunchTab() {
        this.launchTabClass = this.disableTabClass;
        this.campaignDetailsTabClass = this.activeTabClass;
    }

    setChannelCampaign(event: any) {
        this.campaign.channelCampaign = event;
        this.setRecipientsHeaderText();
        this.campaignRecipientsPagination.pageIndex = 1;
        this.campaignRecipientsPagination.maxResults = 4;
        this.clearSelectedContactList();
        if(this.isPageCampaign){
            this.setCoBrandingLogoForPageCampaign();
        }else{
            this.setCoBrandingLogo(event);
        }
        this.setSalesEnablementOptions(event);
        /***XNFR-255*****/
        if(!this.isPageCampaign){
            this.campaign.whiteLabeled = false;
        }
        if (event) {
            this.setPartnerEmailNotification(event);
            this.removeTemplateAndAutoResponse();
            if (!this.isPageCampaign) {
                this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
            }
           this.findCampaignRecipients(this.campaignRecipientsPagination);
        } else {
            this.campaign.oneClickLaunch = false;
            this.campaign.configurePipelines = false;
            this.findCampaignRecipients(this.campaignRecipientsPagination);
            this.removePartnerRules();
            this.setPartnerEmailNotification(true);
        }
        this.updateLaunchTabClass();

    }
    private updateLaunchTabClass() {
        this.isValidVideoSelected();
        if (this.isEmailTemplateOrPageSelected && this.isContactList && this.isValidCampaignDetailsTab && this.isVideoSelected) {
            this.launchTabClass = this.completedTabClass;
        } else if (this.isEmailTemplateOrPageSelected  && !this.isContactList && this.isValidCampaignDetailsTab && this.isVideoSelected) {
            this.launchTabClass = this.activeTabClass;
        } else {
            this.launchTabClass = this.disableTabClass;
        }
    }

    /****XNFR-255****/
    setWhiteLabeled(event:any){
        this.campaign.whiteLabeled = event;
    }
    

    removePartnerRules() {
        let self = this;
        $.each(this.replies, function (index, reply) {
            if (reply.actionId == 22 || reply.actionId == 23) {
                self.remove(reply.divId, 'replies');
            }

        });
    }

    
    removeTemplateAndAutoResponse() {
        this.urls = [];//Removing Auto-Response WebSites
        this.selectedEmailTemplateRow = 0;
        this.isEmailTemplateOrPageSelected = false;
    }

    setPartnerEmailNotification(event: any) {
      this.campaign.emailNotification = event;
        if (!event) {
            this.campaign.emailOpened = false;
            this.campaign.videoPlayed = false;
            this.campaign.linkOpened = false;
        }
    }

    setSalesEnablementOptions(channelCampaign: any) {
        if (this.campaignType == 'email') {
            if (channelCampaign) {
                this.campaign.viewInBrowserTag = false;
                this.campaign.unsubscribeLink = false;
            } else {
                this.campaign.viewInBrowserTag = true;
                this.campaign.unsubscribeLink = this.isGdprEnabled;
            }
        }
    }

    setCoBrandingLogo(event: any) {
        this.campaign.enableCoBrandingLogo = event;
        if(this.isPageCampaign){
            this.filterPageTypeAndFindPages();
        }else{
            this.removeTemplateAndAutoResponse();
            this.emailTemplatesPagination.pageIndex = 1;
            this.emailTemplatesPagination.maxResults = 4;
            let dropDownLength =   this.emailTemplatesSortOption.eventCampaignRecipientsDropDownOptions.length;
            if(this.selectedEmailTemplateRow==0 && !this.isAdd && dropDownLength==5){
                this.emailTemplatesSortOption.eventCampaignRecipientsDropDownOptions.pop();
                this.emailTemplatesSortOption.selectedCampaignEmailTemplateDropDownOption = this.emailTemplatesSortOption.eventCampaignRecipientsDropDownOptions[this.emailTemplatesSortOption.eventCampaignRecipientsDropDownOptions.length - 1];
                this.emailTemplatesPagination = this.utilService.sortOptionValues(this.emailTemplatesSortOption.selectedCampaignEmailTemplateDropDownOption, this.emailTemplatesPagination);
            }
            this.findEmailTemplates(this.emailTemplatesPagination);
            this.updateLaunchTabClass();
        }
        
    }

    private filterPageTypeAndFindPages() {
        this.setPageCampaignFilterOptions();
        let dropDownLength =   this.pagesSortOption.eventCampaignRecipientsDropDownOptions.length;
        if(this.selectedPageId==0 && !this.isAdd && dropDownLength==5){
            this.pagesSortOption.eventCampaignRecipientsDropDownOptions.pop();
            this.pagesSortOption.selectedCampaignEmailTemplateDropDownOption = this.pagesSortOption.eventCampaignRecipientsDropDownOptions[this.pagesSortOption.eventCampaignRecipientsDropDownOptions.length - 1];
            this.pagesPagination = this.utilService.sortOptionValues(this.pagesSortOption.selectedCampaignEmailTemplateDropDownOption, this.pagesPagination);
        }
        this.findPages(this.pagesPagination)
    }

    private setPageCampaignFilterOptions() {
        if (this.campaign.channelCampaign) {
            if (this.campaign.enableCoBrandingLogo) {
                this.pagesPagination.filterKey = "Co-Branded&PUBLIC";
            } else {
                this.pagesPagination.filterKey = "PUBLIC";
            }
        } else {
            if (this.campaign.enableCoBrandingLogo) {
                this.pagesPagination.filterKey = "Co-Branded&PRIVATE";
            } else {
                this.pagesPagination.filterKey = "PRIVATE";
            }
        }
        this.pagesPagination.pageIndex = 1;
        this.pagesPagination.maxResults = 4;
    }

    setCoBrandingLogoForPageCampaign(){
        this.filterPageTypeAndFindPages();
    }

    
    setViewInBrowser(event: any) {
        this.campaign.viewInBrowserTag = event;
    }


    setUnsubscribeLink(event: any) {
        this.campaign.unsubscribeLink = event;
    }

    /***XNFR-125****/
    setOneClickLaunch(event:any){
        this.campaign.oneClickLaunch = event;
        this.setRecipientsHeaderText();
        this.campaignRecipientsPagination.pageIndex = 1;
        this.campaignRecipientsPagination.maxResults = 4;
        this.selectedContactListIds = [];
        this.userListDTOObj = [];
        this.isContactList = false;
        this.selectedPartnershipId = 0;
        if(!event){
            this.findCampaignRecipients(this.campaignRecipientsPagination);
        }
    }

     /***XNFR-125*****/
     getSelectedPartnerCompanyIdAndShareLeads(event:any){
        this.selectedPartnershipId = event['selectedPartnershipId'];
        this.selectedContactListIds = event['selectedShareListIds'];
        this.isContactList = this.selectedPartnershipId>0 && this.selectedContactListIds.length>0;
    }

    setEmailOpened(event: any) {
        this.campaign.emailOpened = event;
    }

    setLinkOpened(event: any) {
        this.campaign.linkOpened = event;
    }

    setVideoPlayed(event: any) {
        this.campaign.videoPlayed = event;
    }
    setReplyWithVideo(event: any) {
        this.campaign.replyVideo = event;
    }

    clearSelectedContactList() {
        if (this.isOrgAdminCompany) {
            this.selectedContactListIds = [];
            this.userListDTOObj = [];
            this.isContactList = false;
        }
    }

    openMergeTagsPopup(type: string, autoResponseSubject: any) {
        this.mergeTagsInput['isEvent'] = false;
        this.mergeTagsInput['isCampaign'] = true;
        this.mergeTagsInput['hideButton'] = true;
        this.mergeTagsInput['type'] = type;
        this.mergeTagsInput['autoResponseSubject'] = autoResponseSubject;
    }

    clearHiddenClick() {
        this.mergeTagsInput['hideButton'] = false;
    }

    appendValueToSubjectLine(event: any) {
        if (event != undefined) {
            let type = event['type'];
            let copiedValue = event['copiedValue'];
            if (type == "campaignSubjectLine") {
                let subjectLine = $.trim($('#subjectLineId').val());
                let updatedValue = subjectLine + " " + copiedValue;
                $('#subjectLineId').val(updatedValue);
                this.campaign.subjectLine = updatedValue;
                this.validateForm();
            } else {
                let autoResponse = event['autoResponseSubject'];
                autoResponse.subject = autoResponse.subject + " " + copiedValue;
            }
        }
        this.mergeTagsInput['hideButton'] = false;
    }

    openCreateFolderPopup() {
        this.folderCustomResponse = new CustomResponse('');
        this.addFolderModalPopupComponent.openPopup();
    }

    showSuccessMessage(message: any) {
        this.folderCustomResponse = new CustomResponse('SUCCESS', message, true);
        this.listCategories();
    }
    listCategories() {
        this.campaignDetailsLoader = true;
        this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
            (data: any) => {
                this.categoryNames = data.data;
                let categoryIds = this.categoryNames.map(function (a: any) { return a.id; });
                if (this.isAdd || this.campaign.categoryId == undefined || this.campaign.categoryId == 0) {
                    this.campaign.categoryId = categoryIds[0];
                }
                this.campaignDetailsLoader = false;
            },
            error => {
                this.campaignDetailsLoader = false;
              },
           );
    }

    clearEndDate() {
        this.endDatePickr.clear();
        this.campaign.endDate = undefined;
    }


    /*************************Email Templates**************************/
    findEmailTemplates(emailTemplatesPagination:Pagination){
        this.emailTemplatesOrLandingPagesLoader = true;
        this.setEmailTemplatesFilter(this.emailTemplatesPagination);
        this.campaignService.findCampaignEmailTemplates(emailTemplatesPagination).subscribe(
            response=>{
                const data = response.data;
                this.campaignEmailTemplates = data.list;
                emailTemplatesPagination.totalRecords = data.totalRecords;
                this.emailTemplatesSortOption.totalRecords = data.totalRecords;
                emailTemplatesPagination = this.pagerService.getPagedItems(emailTemplatesPagination, this.campaignEmailTemplates);
                this.emailTemplatesOrLandingPagesLoader =  false;
            },error=>{
                this.emailTemplatesOrLandingPagesLoader = false;
                this.xtremandLogger.errorPage(error);
            });

    }

    findEmailTemplatesOnEnterKeyPress(eventKeyCode:number){
        if(eventKeyCode==13){
            this.searchEmailTemplates();
        }
    }

    paginateEmailTempaltes(event:any){
        this.emailTemplatesPagination.pageIndex = event.page;
		this.findEmailTemplates(this.emailTemplatesPagination);
    }

    sortEmailTemplates(text: any) {
		this.emailTemplatesSortOption.selectedCampaignEmailTemplateDropDownOption = text;
		this.setSearchAndSortOptionsForEmailTemplates(this.emailTemplatesPagination, this.emailTemplatesSortOption);
	}

    searchEmailTemplates(){
        this.setSearchAndSortOptionsForEmailTemplates(this.emailTemplatesPagination,this.emailTemplatesSortOption);
    }

    setSearchAndSortOptionsForEmailTemplates(pagination: Pagination, emailTemplatesSortOption: SortOption){
		pagination.pageIndex = 1;
		pagination.searchKey = emailTemplatesSortOption.searchKey;
        pagination = this.utilService.sortOptionValues(emailTemplatesSortOption.selectedCampaignEmailTemplateDropDownOption, pagination);
        this.findEmailTemplates(pagination);
    }

    findEmailTemplatesOrPagesFolder() {
        if(this.isShowFilterDiv){
            this.filterCategoryLoader = true;
            this.folderFields = { text: 'name', value: 'id' };
            this.campaignService.listEmailTemplateOrLandingPageFolders(this.loggedInUserId, this.campaignType).
            subscribe(data => {
                this.emailTemplateFolders = data;
                this.filterCategoryLoader = false;
            }, error => {
                this.emailTemplateFolders = [];
                this.filterCategoryLoader = false;
            });
        }
    }

    clearFilter() {
        this.isShowFilterDiv = false;
        this.selectedFolderIds = [];
        this.applyFilter();
    }

    applyFilter(){
        if(this.isPageCampaign){
            if (this.selectedFolderIds.length > 0) {
                this.pagesPagination.categoryIds = this.selectedFolderIds;
            } else {
                this.pagesPagination.categoryIds = [];
            }
            this.pagesPagination.pageIndex = 1;
            this.pagesPagination.maxResults = 4;
            this.findPages(this.pagesPagination);
        }else{
            if (this.selectedFolderIds.length > 0) {
                this.emailTemplatesPagination.categoryIds = this.selectedFolderIds;
            } else {
                this.emailTemplatesPagination.categoryIds = [];
            }
            this.emailTemplatesPagination.pageIndex = 1;
            this.emailTemplatesPagination.maxResults = 4;
            this.findEmailTemplates(this.emailTemplatesPagination);
        }
       
    }

    selectEmailTemplate(emailTemplate:any){
        this.ngxLoading = true;
        this.emailTemplateHrefLinks = [];
        this.urls = [];
        this.emailTemplateIdForSendTestEmail = emailTemplate.id;
        this.emailTemplateNameForSendTestEmail = emailTemplate.name;
        this.emailTemplateService.getById(emailTemplate.id)
            .subscribe(
                (data: any) => {
                    this.emailTemplateHrefLinks = this.referenceService.getAnchorTagsFromEmailTemplate(data.body, this.emailTemplateHrefLinks);
                    this.emailTemplate = data;
                    this.selectedEmailTemplateRow = emailTemplate.id;
                    this.isEmailTemplateOrPageSelected = true;
                    this.isValidVideoSelected();
                    if(this.isValidCampaignDetailsTab && this.isVideoSelected){
                        this.isValidFirstTab = true;
                        this.launchTabClass = this.activeTabClass;
                    }else{
                        this.isValidFirstTab = false;
                        this.launchTabClass = this.disableTabClass;
                    }
                    this.ngxLoading = false;
                    this.sendTestEmailToolTip = this.properties.sendTestEmail;
                },
                error => {
                    this.emailTemplateHrefLinks = [];
                    this.urls = [];
                    this.isEmailTemplateOrPageSelected = false;
                    this.ngxLoading = false;
        });
    }

    previewEmailTemplate(emailTemplate:any){
        this.selectedEmailTemplateIdForPreview = emailTemplate.id;
        this.selectedEmailTemplateNameForPreview = emailTemplate.name;
        this.isPreviewEmailTemplateButtonClicked = true;

    }

    openSendTestEmailModalPopUp(){
        this.isSendTestEmailOptionClicked = true;
    }

    sendTestEmailModalPopupEventReceiver(){
        this.isSendTestEmailOptionClicked = false;
    }

    previewEmailTemplateModalPopupEventReceiver(){
        this.selectedEmailTemplateIdForPreview = 0;
        this.selectedEmailTemplateNameForPreview = "";
        this.isPreviewEmailTemplateButtonClicked = false;
    }

    editTemplate(emailTemplate:any){
        this.isShowEditTemplateMessageDiv = false;
        if (emailTemplate['type'] != 'UPLOADED' && emailTemplate.userDefined) {
            this.isEditTemplateLoader = true;
           this.referenceService.goToTop();
           $('#campaign-details-and-launch-tabs').hide(600);
           $('#edit-campaign-template').show(600);
           this.beeContainerInput['emailTemplateName'] = emailTemplate.name;
           this.emailTemplateService.findJsonBody(emailTemplate.id).subscribe(
                response => {
                    this.beeContainerInput['module'] = "emailTemplates";
                    this.beeContainerInput['jsonBody'] = response;
                    this.beeContainerInput['id'] = emailTemplate.id;
                    this.isShowEditTemplatePopup = true;
                    this.isEditTemplateLoader = false;
                }, error => {
                    this.hideEditTemplateDiv();
                    this.referenceService.showSweetAlertServerErrorMessage();
                }
            );
        } else {
            this.referenceService.showSweetAlertErrorMessage('Uploaded Templates Cannot Be Edited');
        }
    }

    hideEditTemplateDiv() {
        $('#edit-campaign-template').hide(600);
        this.isShowEditTemplatePopup = false;
        this.isEditTemplateLoader = false;
        this.beeContainerInput = {};
        this.editTemplateMergeTagsInput = {};
        $('#campaign-details-and-launch-tabs').show(600);
    }

    updateTemplate(event:any){
        this.ngxLoading =true;
        let module = event['module'];
        if("pages"==module){
            this.updatePage(event);
        }else{
            this.updateEmailTemplate(event);
        }
    }
    updateEmailTemplate(event: any) {
       let emailTemplate = new EmailTemplate();
       emailTemplate.id = event.id;
       emailTemplate.jsonBody = event.jsonContent;
       emailTemplate.body = event.htmlContent;
       emailTemplate.userId = this.loggedInUserId;
       this.emailTemplateService.updateJsonAndHtmlBody(emailTemplate).subscribe(
           response => {
               if (response.statusCode == 200) {
                   this.showTemplateUpdatedSuccessMessage();
               } else if (response.statusCode == 500) {
                   this.showUpdateTemplateErrorMessage(response.message);
               }                
           }, error => {
               this.showTemplateUpdateErrorMessage();
           }
       )
    }

    
    showTemplateUpdatedSuccessMessage(){
        this.ngxLoading =false;
        this.isShowEditTemplateMessageDiv = true;
        this.templateMessageClass = "alert alert-success";
        this.templateUpdateMessage = "Template Updated Successfully";
        this.referenceService.goToTop();
    }

    showTemplateUpdateErrorMessage(){
        this.ngxLoading =false;
        this.templateMessageClass = "alert alert-danger";
        this.templateUpdateMessage = this.properties.serverErrorMessage;
        this.isShowEditTemplateMessageDiv = true;
    }

    showUpdateTemplateErrorMessage(message: string){
        this.ngxLoading =false;
        this.templateMessageClass = "alert alert-danger";
        if (message != undefined && message != null && message.trim().length > 0) {
            this.templateUpdateMessage = message;
        } else {
            this.templateUpdateMessage = this.properties.serverErrorMessage;
        }
        
        this.isShowEditTemplateMessageDiv = true;
    }
    updatePage(event: any) {
        let landingPage = new LandingPage();
        landingPage.id = event.id;
        landingPage.jsonBody = event.jsonContent;
        landingPage.htmlBody = event.htmlContent;
        landingPage.userId = this.loggedInUserId;
        landingPage.openLinksInNewTab = this.beeContainerInput['openLinksInNewTab'];
        landingPage.companyProfileName = this.authenticationService.companyProfileName;
        this.landingPageService.updateJsonAndHtmlBody(landingPage).subscribe(
            response => {
                this.showTemplateUpdatedSuccessMessage();
            }, error => {
                this.ngxLoading =false;
                if (error.status == 400) {
                    let message = JSON.parse(error['_body']).message;
                    swal(message, "", "error");
                } else {
                    this.showTemplateUpdateErrorMessage();
                }
            }
        )
    }
  
    /***********Contacts/Partners************/
    findCampaignRecipientsOnEnterKeyPress(eventKeyCode:number){
        if(eventKeyCode==13){
            this.searchCampaignRecipients();
        }
    }
    searchCampaignRecipients(){
        this.setSearchAndSortOptionsForRecipients(this.campaignRecipientsPagination,this.recipientsSortOption);
    }
    sortRecipientsList(text:any){
        this.recipientsSortOption.selectedCampaignRecipientsDropDownOption = text;
        this.setSearchAndSortOptionsForRecipients(this.campaignRecipientsPagination,this.recipientsSortOption);
    }
    setSearchAndSortOptionsForRecipients(campaignRecipientsPagination: Pagination, recipientsSortOption: SortOption){
		campaignRecipientsPagination.pageIndex = 1;
        campaignRecipientsPagination.searchKey = this.recipientsSortOption.searchKey.trim();
        if (campaignRecipientsPagination.searchKey != undefined && campaignRecipientsPagination.searchKey != null 
            && campaignRecipientsPagination.searchKey.trim() != "") {
            this.showRecipientsSearchResultExpandButton = true;
        } else {
            this.showRecipientsSearchResultExpandButton = false;
        }
        this.campaignRecipientsPagination = this.utilService.sortOptionValues(this.recipientsSortOption.selectedCampaignRecipientsDropDownOption, this.campaignRecipientsPagination);
        this.findCampaignRecipients(campaignRecipientsPagination);
    }

    paginateCampaignRecipients(event:any){
        this.campaignRecipientsPagination.pageIndex = event.page;
		this.findCampaignRecipients(this.campaignRecipientsPagination);
    }

    findCampaignRecipientsOnLimitChange(campaignRecipientsPagination:Pagination){
        this.referenceService.goToDiv("user-list-div");
        this.findCampaignRecipients(campaignRecipientsPagination);
    }

    findCampaignRecipients(campaignRecipientsPagination: Pagination) {
        this.campaignRecipientsLoader = true;
        campaignRecipientsPagination.channelCampaign = this.campaign.channelCampaign;
        this.showContactType = this.isOrgAdminCompany && !this.campaign.channelCampaign;
        if (!this.isAdd) {
            campaignRecipientsPagination.campaignId = this.campaign.campaignId;
        }
        this.contactService.findContactsAndPartnersForCampaign(campaignRecipientsPagination)
            .subscribe(
                (response: any) => {
                    let data = response.data;
                    this.campaignRecipientsList = data.list;
                    campaignRecipientsPagination.totalRecords = data.totalRecords;
                    this.recipientsSortOption.totalRecords = data.totalRecords;
                    campaignRecipientsPagination = this.pagerService.getPagedItems(campaignRecipientsPagination, this.campaignRecipientsList);
                    var contactIds = campaignRecipientsPagination.pagedItems.map(function (a) { return a.id; });
                    var items = $.grep(this.selectedContactListIds, function (element) {
                        return $.inArray(element, contactIds) !== -1;
                    });
                    if (items.length == contactIds.length) {
                        this.isHeaderCheckBoxChecked = true;
                    } else {
                        this.isHeaderCheckBoxChecked = false;
                    }
                    this.campaignRecipientsLoader = false;
                },
                (error: string) => {
                    this.xtremandLogger.errorPage(error);
                })
    }

    previewUsers(contactList: any) {
        this.showUsersPreview = true;
        this.selectedListName = contactList.name;
        this.selectedListId = contactList.id;
    }

    resetValues() {
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

    highlightRow(contactList: any, event: any) {
        let contactId = contactList.id;
        let isChecked = $('#' + contactId).is(':checked');
        if (isChecked) {
            $('#campaignContactListTable_' + contactId).addClass('contact-list-selected');
            this.selectedContactListIds.push(contactId);
            this.userListDTOObj.push(contactList);
        } else {
            $('#campaignContactListTable_' + contactId).removeClass('contact-list-selected');
            this.selectedContactListIds.splice($.inArray(contactId, this.selectedContactListIds), 1);
            this.userListDTOObj = this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
        }
        this.contactsUtility();
        event.stopPropagation();
        
        
    }
    highlightContactRow(contactList: any, event: any, count: number, isValid: boolean) {
        let contactId = contactList.id;
        if (isValid) {
            this.emptyContactsMessage = "";
             if (count > 0) {
                let isChecked = $('#' + contactId).is(':checked');
                if (isChecked) {
                    //Removing Highlighted Row
                    $('#' + contactId).prop("checked", false);
                    $('#campaignContactListTable_' + contactId).removeClass('contact-list-selected');
                    this.selectedContactListIds.splice($.inArray(contactId, this.selectedContactListIds), 1);
                    this.userListDTOObj = this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
                } else {
                    //Highlighting Row
                    $('#' + contactId).prop("checked", true);
                    $('#campaignContactListTable_' + contactId).addClass('contact-list-selected');
                    this.selectedContactListIds.push(contactId);
                    this.userListDTOObj.push(contactList);
                }
                this.contactsUtility();
                event.stopPropagation();
            } else {
                this.emptyContactsMessage = "Users are in progress";
            }

        }

    }
    contactsUtility() {
        var trLength = $('#campaignRecipientsTable tbody tr').length;
        var selectedRowsLength = $('[name="campaignContact[]"]:checked').length;
        if (selectedRowsLength > 0 || this.selectedContactListIds.length > 0) {
            this.isContactList = true;
        } else {
            this.isContactList = false;
        }
        if (trLength != selectedRowsLength) {
            $('#checkAllExistingContacts').prop("checked", false)
        } else if (trLength == selectedRowsLength) {
            $('#checkAllExistingContacts').prop("checked", true);
        }
        this.getValidUsersCount();


    }

    getValidUsersCount() {
        if (this.selectedContactListIds.length > 0 && this.campaign.emailNotification) {
            this.ngxLoading = true;
            this.emailReceiversCountError = false;
            this.contactService.findAllAndValidUserCounts(this.selectedContactListIds)
                .subscribe(
                    data => {
                        this.validUsersCount = data['validUsersCount'];
                        this.allUsersCount = data['allUsersCount'];
                        this.emailReceiversCountError = false;
                        this.ngxLoading = false;
                    },
                    (error: any) => {
                        this.ngxLoading = false;
                        this.emailReceiversCountError = true;
                    });
        }
    }

    checkAll(ev: any) {
        if (ev.target.checked) {
            $('[name="campaignContact[]"]').prop('checked', true);
            this.isContactList = true;
            let self = this;
            $('[name="campaignContact[]"]:checked').each(function (index) {
                var id = $(this).val();
                self.selectedContactListIds.push(parseInt(id));
                self.userListDTOObj.push(self.campaignRecipientsPagination.pagedItems[index]);
                $('#campaignContactListTable_' + id).addClass('contact-list-selected');
            });
            this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
            if (this.selectedContactListIds.length == 0) { this.isContactList = false; }
            this.userListDTOObj = this.referenceService.removeDuplicates(this.userListDTOObj);
            this.getValidUsersCount();
        } else {
            $('[name="campaignContact[]"]').prop('checked', false);
            $('#campaignRecipientsTable tr').removeClass("contact-list-selected");
            if (this.campaignRecipientsPagination.maxResults > 30 || (this.campaignRecipientsPagination.maxResults == this.campaignRecipientsPagination.totalRecords)) {
                this.isContactList = false;
                this.selectedContactListIds = [];
            } else {
                this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
                let currentPageContactIds = this.campaignRecipientsPagination.pagedItems.map(function (a) { return a.id; });
                this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
                this.userListDTOObj = this.referenceService.removeDuplicatesFromTwoArrays(this.userListDTOObj, this.campaignRecipientsPagination.pagedItems);
                if (this.selectedContactListIds.length == 0) {
                    this.isContactList = false;
                    this.userListDTOObj = [];
                }
            }

        }
        ev.stopPropagation();
    }


    /********Workflows**************/

    isEven(n:number) {
        if (n % 2 === 0) { return true; }
        return false;
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
            this.workflowError = false;
        }
    }

    spliceArray(arr: any, id: string) {
        arr = $.grep(arr, function (data:any, index:number) {
            return data.divId !== id
        });
        return arr;
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
        this.reply.emailTemplatesPagination.maxResults = 4;
        this.findEmailTemplatesForAutoResponseWorkFlow(this.reply);
    }

    findEmailTemplatesForAutoResponseWorkFlowOnLimitChange(reply:Reply,index:number){
        this.referenceService.goToDiv("reply-email-template-"+index);
        this.findEmailTemplatesForAutoResponseWorkFlow(reply);
    }

    findEmailTemplatesForAutoResponseWorkFlow(reply: Reply) {
        reply.loader = true;
        reply.emailTemplatesPagination.filterBy = this.properties.campaignRegularEmailsFilter;
        this.campaignService.findCampaignEmailTemplates(reply.emailTemplatesPagination).subscribe(
            response=>{
                const data = response.data;
                reply.emailTemplatesPagination.totalRecords = data.totalRecords;
                this.emailTemplatesSortOption.totalRecords = data.totalRecords;
                reply.emailTemplatesPagination = this.pagerService.getPagedItems(reply.emailTemplatesPagination, data.list);
                reply.loader = false;
            },error=>{
                reply.loader = false;
                this.xtremandLogger.errorPage(error);
            });
    }

    findAutoResponseEmailTemplatesOnEnterKeyPress(eventKeyCode:number,reply:Reply){
        if (eventKeyCode === 13) {
            this.searchAutoResponseEmailTemplates(reply);
        }
    }

    searchAutoResponseEmailTemplates(reply:Reply){
        reply.emailTemplatesPagination.pageIndex = 1;
        reply.emailTemplatesPagination.searchKey = reply.emailTemplateSearchInput;
        this.findEmailTemplatesForAutoResponseWorkFlow(reply);
    }

    paginateAutoResponseEmailTempaltes(event: any, reply: Reply){
        reply.emailTemplatesPagination.pageIndex = event.page;
        this.findEmailTemplatesForAutoResponseWorkFlow(reply);
    }
    
    setReplyEmailTemplate(emailTemplateId: number, reply: Reply, index: number, isDraft: boolean) {
        if (!isDraft) {
            reply.selectedEmailTemplateId = emailTemplateId;
            $('#reply-' + index + emailTemplateId).prop("checked", true);
        }
    }
    selectEmailTemplateForEmailAutoResponseWorkflow(event: any, index: number, reply: Reply) {
        reply.defaultTemplate = event;
    }
    /********Website Workflows****/
    addClickRows() {
        this.url = new Url();
        let length = this.allItems.length;
        length = length + 1
        var id = 'click-' + length;
        this.url.divId = id;
        this.url.scheduled = false;
        this.url.actionId = 19;
        this.url.subject = this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.subjectLine);
        this.url.url = this.emailTemplateHrefLinks[0];
        this.urls.push(this.url);
        this.allItems.push(id);
        this.url.emailTemplatesPagination.maxResults = 4;
        this.findEmailTemplatesForWebSiteWorkFlow(this.url);
    }

    findEmailTemplatesForWebSiteWorkFlowOnLimitChange(url:Url,index:number){
        this.referenceService.goToDiv("click-email-template-"+index);
        this.findEmailTemplatesForWebSiteWorkFlow(url);
    }
    findEmailTemplatesForWebSiteWorkFlow(url: Url) {
        url.loader = true;
        url.emailTemplatesPagination.filterBy = this.properties.campaignRegularEmailsFilter;
        this.campaignService.findCampaignEmailTemplates(url.emailTemplatesPagination).subscribe(
            response=>{
                const data = response.data;
                url.emailTemplatesPagination.totalRecords = data.totalRecords;
                this.emailTemplatesSortOption.totalRecords = data.totalRecords;
                url.emailTemplatesPagination = this.pagerService.getPagedItems(url.emailTemplatesPagination, data.list);
                url.loader = false;
            },error=>{
                url.loader = false;
                this.xtremandLogger.errorPage(error);
            });
    }


    findAutoWebsiteLikAutoResponseEmailTemplatesOnEnterKeyPress(eventKeyCode:number,reply:Reply){
        if (eventKeyCode === 13) {
            this.searchAutoResponseEmailTemplates(reply);
        }
    }

    searchWebsiteLinkAutoResponseEmailTemplates(url:Url){
        url.emailTemplatesPagination.pageIndex = 1;
        url.emailTemplatesPagination.searchKey = url.emailTemplateSearchInput;
        this.findEmailTemplatesForWebSiteWorkFlow(url);
    }

    paginateWebsiteLinkAutoResponseEmailTempaltes(event: any, url: Url){
        url.emailTemplatesPagination.pageIndex = event.page;
        this.findEmailTemplatesForWebSiteWorkFlow(url);
    }
   
    selectEmailTemplateForWebsiteLinkWorkflow(event: any, index: number, url: Url) {
        url.defaultTemplate = event;
    }

    setWebsiteLinkEmailTemplate(emailTemplateId: number, url: Url, index: number, isDraft: boolean) {
        if (!isDraft) {
            url.selectedEmailTemplateId = emailTemplateId;
            $('#url-' + index + emailTemplateId).prop("checked", true);
        }
    }

    selectLaunchOption(){
       this.selectedLaunchOption =  $('input[name="scheduleCampaign"]:checked').val();
       if("SCHEDULE"==this.selectedLaunchOption){
        this.validateLaunchTimeAndCountryAndTimeZone();
       }
    }

    validateAndLaunchCampaign(){
        this.ngxLoading = true;
        this.anyLaunchButtonClicked = false;
        var data = this.getCampaignData("");
        var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        this.validateLaunchTimeAndCountryAndTimeZone();
        this.workflowError = errorLength>0;
        if(this.workflowError){
            this.referenceService.goToDiv('campaign-work-flow');
        }
        if(!this.workflowError && this.isValidSelectedCountryId && this.isValidSelectedTimeZone && this.isValidLaunchTime && this.isContactList){
            this.referenceService.showSweetAlertProcessingLoader(this.properties.deployingCampaignMessage);
            this.workflowError = false;
            this.campaignService.saveCampaign(data)
            .subscribe(
                response => {
                    swal.close();
                    if (response.access) {
                        this.statusCode = response.statusCode;
                        if (response.statusCode == 2000) {
                            this.referenceService.campaignSuccessMessage = data['scheduleCampaign'];
                            this.isLaunched = true;
                            this.anyLaunchButtonClicked = true;
                            this.reInitialize();
                            this.router.navigate(["/home/campaigns/manage"]);
                       }else if(response.statusCode==2020){
                            this.referenceService.goToDiv('campaign-work-flow');
                            this.selectedContactListIds = [];
                            this.selectedPartnershipId = 0;
                            this.isContactList = false;
                            this.invalidShareLeadsSelection = true;
                            this.invalidShareLeadsSelectionErrorMessage = response.message;
                        } else {
                           this.invalidScheduleTime = true;
                           this.invalidScheduleTimeError = response.message;
                            if (response.statusCode == 2016) {
                               this.referenceService.goToDiv('campaign-work-flow');
                               this.campaignService.addErrorClassToDiv(response.data.emailErrorDivs);
                               this.campaignService.addErrorClassToDiv(response.data.websiteErrorDivs);
                            }else{
                                this.referenceService.goToDiv('launch-section');
                                this.isValidLaunchTime = false;
                                this.launchTimeDivClass = this.launchOptionsErrorClass;
                            }
                        }
                   } else {
                        this.ngxLoading = false;
                        this.authenticationService.forceToLogout();
                    }
                    this.ngxLoading = false;
                },
                error => {
                  this.ngxLoading = false;
                   swal.close();
                    this.hasInternalError = true;
                    let statusCode = JSON.parse(error["status"]);
                    if (statusCode == 400) {
                        if(this.isAdd){
                            this.referenceService.showSweetAlertErrorMessage(this.properties.serverErrorMessage);
                        }else{
                            this.router.navigate(["/home/campaigns/manage"]);
                            this.referenceService.scrollSmoothToTop();
                            this.referenceService.showSweetAlertErrorMessage("This campaign cannot be updated as we are processing this campaign.");
                        }
                        
                    } else {
                        this.xtremandLogger.errorPage(error);
                   }
                });
        }
        this.ngxLoading = false;
        return false;
    }

    private validateLaunchTimeAndCountryAndTimeZone() {
        let isCampaignScheduled = this.selectedLaunchOption == "SCHEDULE";
        if (isCampaignScheduled) {
            let selectedCountryId = $.trim($('#countryName option:selected').val());
            let selectedTimeZone = $('#timezoneId option:selected').val();
            this.isValidSelectedCountryId = selectedCountryId > 0;
            this.isValidSelectedTimeZone = $.trim(selectedTimeZone).length > 0;
            let trimmedScheduleTime = $.trim(this.campaign.scheduleTime);
            this.isValidLaunchTime = trimmedScheduleTime!=undefined && trimmedScheduleTime.length>0;
        } else {
            this.isValidSelectedCountryId = true;
            this.isValidSelectedTimeZone = true;
            this.isValidLaunchTime = true;
        }
        this.countryNameDivClass = this.isValidSelectedCountryId ? this.launchOptionsSuccessClass : this.launchOptionsErrorClass;
        this.timeZoneDivClass = this.isValidSelectedTimeZone ? this.launchOptionsSuccessClass : this.launchOptionsErrorClass;
        this.launchTimeDivClass = this.isValidLaunchTime ? this.launchOptionsSuccessClass : this.launchOptionsErrorClass;
    }

    reInitialize() {
        this.selectedContactListIds = [];
        this.userListDTOObj = [];
        this.names = [];
        this.statusCode = 0;
    }
    getCampaignData(emailId: string) {
        this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
        let timeZoneId = "";
        let selectedLaunchOption = this.selectedLaunchOption;
        if (selectedLaunchOption == "NOW" || selectedLaunchOption == "SAVE" || selectedLaunchOption == "") {
            timeZoneId = this.referenceService.getBrowserTimeZone();
            this.campaign.scheduleTime = this.campaignService.setLaunchTime();
        } else {
            timeZoneId = $('#timezoneId option:selected').val();
            this.campaign.scheduleTime = this.campaign.scheduleTime;
        }
        this.getRepliesData();
        this.getOnClickData();
        let campaignType = CampaignType.REGULAR;
        if(this.isEmailCampaign){
            campaignType = CampaignType.REGULAR;
        }else if(this.isVideoCampaign){
            campaignType = CampaignType.VIDEO;
        }else if(this.isPageCampaign){
            campaignType = CampaignType.LANDINGPAGE;
        }else if(this.isSurveyCampaign){
            campaignType = CampaignType.SURVEY;
        }
        let country = $.trim($('#countryName option:selected').text());
        let vanityUrlDomainName = "";
        let vanityUrlCampaign = false;
        /********Vanity Url Related Code******************** */
        if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
            vanityUrlDomainName = this.authenticationService.companyProfileName;
            vanityUrlCampaign = true;
        }
        var data = {
            'campaignName': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.campaignName),
            'fromName': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.fromName),
            'subjectLine': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.subjectLine),
            'email': this.campaign.email,
            'categoryId': this.campaign.categoryId,
            'preHeader': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.campaign.preHeader),
            'emailOpened': this.campaign.emailOpened,
            'videoPlayed': this.campaign.videoPlayed,
            'replyVideo': true,
            'channelCampaign': this.campaign.channelCampaign,
            'emailNotification': this.campaign.emailNotification,
            'linkOpened': this.campaign.linkOpened,
            'enableCoBrandingLogo': this.campaign.enableCoBrandingLogo,
            'userId': this.loggedInUserId,
            'selectedVideoId': this.campaign.selectedVideoId,
            'partnerVideoSelected': this.campaign.partnerVideoSelected,
            'userListIds': this.selectedContactListIds,
            "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
            "scheduleCampaign": this.selectedLaunchOption,
            'scheduleTime': this.campaign.scheduleTime,
            'timeZoneId': timeZoneId,
            'campaignId': this.campaign.campaignId,
            'selectedEmailTemplateId': this.selectedEmailTemplateRow,
            'regularEmail': this.isEmailCampaign,
            'testEmailId': emailId,
            'campaignReplies': this.replies,
            'campaignUrls': this.urls,
            'campaignType': campaignType,
            'country': country,
            'createdFromVideos': this.campaign.createdFromVideos,
            'nurtureCampaign': false,
            'pushToCRM': [],
            'landingPageId': this.selectedPageId,
            'vanityUrlDomainName': vanityUrlDomainName,
            'vanityUrlCampaign': vanityUrlCampaign,
            'leadPipelineId': this.campaign.leadPipelineId,
            'dealPipelineId': this.campaign.dealPipelineId,
            'viewInBrowserTag': this.campaign.viewInBrowserTag,
            'unsubscribeLink': this.campaign.unsubscribeLink,
            'endDate': this.campaign.endDate,
            'clientTimeZone': this.referenceService.getBrowserTimeZone(),
            /****XNFR-125****/
            "oneClickLaunch":this.campaign.oneClickLaunch,
            'partnershipId':this.selectedPartnershipId,
            'configurePipelines': this.campaign.configurePipelines,
            /***XNFR-255****/
            'whiteLabeled':this.campaign.whiteLabeled
        };
        return data;
    }

    getRepliesData() {
        for (var i = 0; i < this.replies.length; i++) {
            let reply = this.replies[i];
            $('#' + reply.divId).removeClass('portlet light dashboard-stat2 border-error');
            this.removeStyleAttrByDivId('reply-days-' + reply.divId);
            this.removeStyleAttrByDivId('send-time-' + reply.divId);
            this.removeStyleAttrByDivId('message-' + reply.divId);
            this.removeStyleAttrByDivId('reply-subject-' + reply.divId);
            this.removeStyleAttrByDivId('email-template-' + reply.divId);
            this.removeStyleAttrByDivId('reply-message-' + reply.divId);
            $('#' + reply.divId).addClass('portlet light dashboard-stat2');
            this.validateReplySubject(reply);
            if (reply.actionId !== 16 && reply.actionId !== 17 && reply.actionId !== 18) {
                this.validateReplyInDays(reply);
                if (reply.actionId !== 22 && reply.actionId !== 23) {
                    this.validateReplyTime(reply);
                }
                this.validateEmailTemplateForAddReply(reply);
            } else {
                this.validateEmailTemplateForAddReply(reply);
            }
            var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
            if (errorLength == 0) {
                this.addEmailNotOpenedReplyDaysSum(reply, i);
                this.addEmailOpenedReplyDaysSum(reply, i);
            }

        }
    }

    validateReplyInDays(reply: Reply) {
        if (reply.actionId !== 22 && reply.actionId !== 23 && reply.actionId!=33 && reply.replyInDays == null) {
            this.addReplyDaysErrorDiv(reply);
        } else if (reply.actionId == 22 || reply.actionId == 23 || reply.actionId==33) {
            if (reply.replyInDays == null || reply.replyInDays == 0) {
                this.addReplyDaysErrorDiv(reply);
            }
        }
    }

    addReplyDaysErrorDiv(reply: Reply) {
        this.addReplyDivError(reply.divId);
        $('#reply-days-' + reply.divId).css('color', 'red');
    }

    validateReplyTime(reply: Reply) {
        if (reply.replyTime == undefined || reply.replyTime == null) {
            this.addReplyDivError(reply.divId);
            $('#send-time-' + reply.divId).css('color', 'red');
        } else {
            reply.replyTime = this.campaignService.setAutoReplyDefaultTime(this.selectedLaunchOption, reply.replyInDays, reply.replyTime, this.campaign.scheduleTime);
            reply.replyTimeInHoursAndMinutes = this.extractTimeFromDate(reply.replyTime);
        }
    }
    extractTimeFromDate(replyTime) {
        let dt = replyTime;
        let hours = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
        let minutes = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
        return hours + ":" + minutes;
    }

    validateReplySubject(reply: Reply) {
        if (reply.subject == null || reply.subject == undefined || $.trim(reply.subject).length == 0) {
            this.addReplyDivError(reply.divId);
            $('#reply-subject-' + reply.divId).css('color', 'red');
        }
    }

    validateEmailTemplateForAddReply(reply: Reply) {
        if (reply.defaultTemplate && reply.selectedEmailTemplateId == 0) {
            $('#' + reply.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#email-template-' + reply.divId).css('color', 'red');
        } else if (!reply.defaultTemplate && (reply.body == null || reply.body == undefined || $.trim(reply.body).length == 0)) {
            $('#' + reply.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#reply-message-' + reply.divId).css('color', 'red');
        }
    }

    addReplyDivError(divId: string) {
        $('#' + divId).addClass('portlet light dashboard-stat2 border-error');
    }
    removeStyleAttrByDivId(divId: string) {
        $('#' + divId).removeAttr("style");
    }

    getOnClickData() {
        for (var i = 0; i < this.urls.length; i++) {
            let url = this.urls[i];
            $('#' + url.divId).removeClass('portlet light dashboard-stat2 border-error');
            this.removeStyleAttrByDivId('click-days-' + url.divId);
            this.removeStyleAttrByDivId('send-time-' + url.divId);
            this.removeStyleAttrByDivId('click-message-' + url.divId);
            this.removeStyleAttrByDivId('click-email-template-' + url.divId);
            this.removeStyleAttrByDivId('click-subject-' + url.divId);
            $('#' + url.divId).addClass('portlet light dashboard-stat2');
            if (url.actionId == 21) {
                url.scheduled = true;
                this.validateOnClickReplyTime(url);
                this.validateOnClickSubject(url);
                this.validateOnClickReplyInDays(url);
                this.validateEmailTemplateForAddOnClick(url);
            } else {
                url.scheduled = false;
                this.validateOnClickSubject(url);
                this.validateEmailTemplateForAddOnClick(url);
            }
            var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
            if (errorLength == 0) {
                this.addOnClickScheduledDaysSum(url, i);
            }
        }
    }

    validateOnClickReplyTime(url: Url) {
        if (url.replyTime == undefined || url.replyTime == null) {
            this.addReplyDivError(url.divId);
            $('#send-time-' + url.divId).css('color', 'red');
        } else {
            url.replyTime = this.campaignService.setAutoReplyDefaultTime(this.selectedLaunchOption, url.replyInDays, url.replyTime, this.campaign.scheduleTime);
            url.replyTimeInHoursAndMinutes = this.extractTimeFromDate(url.replyTime);
        }
    }

    validateOnClickSubject(url: Url) {
        if (url.subject == null || url.subject == undefined || $.trim(url.subject).length == 0) {
            this.addReplyDivError(url.divId);
            $('#click-subject-' + url.divId).css('color', 'red');
        }
    }

    validateOnClickBody(url: Url) {
        if (url.body == null || url.body == undefined || $.trim(url.body).length == 0) {
            this.addReplyDivError(url.divId);
            $('#click-message-' + url.divId).css('color', 'red');
        }
    }

    validateOnClickReplyInDays(url: Url) {
        if (url.replyInDays == null) {
            this.addReplyDivError(url.divId);
            $('#click-days-' + url.divId).css('color', 'red');
        }
    }

    validateEmailTemplateForAddOnClick(url: Url) {
        if (url.defaultTemplate && url.selectedEmailTemplateId == 0) {
            $('#' + url.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#click-email-template-' + url.divId).css('color', 'red');
        } else if (!url.defaultTemplate && (url.body == null || url.body == undefined || $.trim(url.body).length == 0)) {
            $('#' + url.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#click-message-' + url.divId).css('color', 'red');
        }
    }


    addEmailNotOpenedReplyDaysSum(reply: Reply, index: number) {
        if (reply.actionId == 0) {
            if (index == 0) {
                this.emailNotOpenedReplyDaysSum = reply.replyInDays;
            } else {
                this.emailNotOpenedReplyDaysSum = reply.replyInDays + this.emailNotOpenedReplyDaysSum;
            }
            reply.replyInDaysSum = this.emailNotOpenedReplyDaysSum;
        }
    }
    addEmailOpenedReplyDaysSum(reply: Reply, index: number) {
        if (reply.actionId == 13) {
            if (index == 0) {
                this.emailOpenedReplyDaysSum = reply.replyInDays;
            } else {
                this.emailOpenedReplyDaysSum = reply.replyInDays + this.emailOpenedReplyDaysSum;
            }
            reply.replyInDaysSum = this.emailOpenedReplyDaysSum;
        }
    }

    addOnClickScheduledDaysSum(url: Url, i: number) {
        if (i == 0) {
            this.onClickScheduledDaysSum = url.replyInDays;
        } else {
            this.onClickScheduledDaysSum = url.replyInDays + this.onClickScheduledDaysSum;
            url.replyInDaysSum = this.onClickScheduledDaysSum;
        }
    }

    setUrlScheduleType(event, url: Url) {
        if (event.target.value == "true") {
            url.scheduled = true;
        } else {
            url.scheduled = false;
        }

    }

    getTimeZones(countryId:number){
        this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
        this.isValidSelectedCountryId  = countryId>0;
        this.isValidSelectedTimeZone = countryId>0;
        this.countryNameDivClass = this.isValidSelectedCountryId ? this.launchOptionsSuccessClass : this.launchOptionsErrorClass;
        this.timeZoneDivClass = this.isValidSelectedTimeZone ? this.launchOptionsSuccessClass : this.launchOptionsErrorClass;
    }

    spamCheck() {
        $("#email_spam_check").modal('show');
    }

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        this.authenticationService.stopLoaders();
        let isInvalidEditPage = !this.isAdd && this.campaignService.campaign==undefined;
        if(this.anyLaunchButtonClicked || isInvalidEditPage || this.authenticationService.module.logoutButtonClicked){
            return true;
        }else{
            return false;
        }
        
    }
}
