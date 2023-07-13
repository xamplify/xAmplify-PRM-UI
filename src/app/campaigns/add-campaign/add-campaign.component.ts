import { Component, OnInit,ViewChild,Renderer } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CampaignService } from '../services/campaign.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { ActivatedRoute } from '@angular/router';
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

declare var swal:any, $:any, videojs:any, flatpickr:any, CKEDITOR:any, require: any;
var moment = require('moment-timezone');

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css'],
  providers:[CallActionSwitch,SortOption,Properties]
})
export class AddCampaignComponent implements OnInit {

  loggedInUserId = 0;
  campaign: Campaign = new Campaign();
  isAdd = false;
  isEmailCampaign = false;
  isVideoCampaign = false;
  isPageCampaign = false;
  isSurveyCampaign = false;
  ngxLoading = false;

  defaultTabClass = "col-block";
  activeTabClass = "col-block col-block-active width";
  completedTabClass = "col-block col-block-complete";
  disableTabClass = "col-block col-block-disable";
  campaignDetailsTabClass = this.activeTabClass;
  launchTabClass = this.activeTabClass;


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
  isValidCampaignName = false;
  categoryNames: any;
  @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
  partnerModuleCustomName = "Partner";
  toPartnerToolTipMessage = "";
  throughPartnerToolTipMessage = "";
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
  selectedLandingPageRow: number;
  selectedPartnershipId: number;
  replies: Array<Reply> = new Array<Reply>();
  urls: Array<Url> = new Array<Url>();
  dataError: boolean;
  showUsersPreview = false;
  mergeTagsInput: any = {};
  teamMemberEmailIds: any[] = [];
  showMarketingAutomationOption = false;
  leadPipelineClass: string = this.formGroupClass;
  dealPipelineClass: string = this.formGroupClass;
  endDateDivClass: string = this.formGroupClass;
  isOrgAdminCompany = false;
  endDatePickr: any;


  /****Email Templates****/
  emailTemplatesOrLandingPagesLoader = false;
  campaignEmailTemplates:Array<any> = Array<any>();
  selectedEmailTemplateRow: number;
  isEmailTemplateOrPageSelected: boolean;
  isLandingPage: boolean;
  emailTemplatesSortOption:SortOption = new SortOption();
  isSendTestEmailIconClicked = false;
  isPreviewEmailTemplateButtonClicked = false;
  selectedEmailTemplateIdForPreview = 0;
  emailTemplateHrefLinks = [];
  isSendTestEmailOptionClicked = false;
  selectedEmailTemplateNameForPreview = "";
  /******Edit Template******/
  isEditTemplateLoader = false;
  beeContainerInput = {};
  isShowEditTemplatePopup = false;
  isShowEditTemplateMessageDiv = false;
  templateUpdateMessage = "";
  editTemplateMergeTagsInput:any = {};
  jsonBody: any;
  templateMessageClass = "";
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

  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,
    public campaignService:CampaignService,public xtremandLogger:XtremandLogger,public callActionSwitch:CallActionSwitch,
    private activatedRoute:ActivatedRoute,public integrationService: IntegrationService,private pagerService: PagerService,
    private utilService:UtilService,private emailTemplateService:EmailTemplateService,public properties:Properties,
    private contactService:ContactService,private render: Renderer,) {
    this.campaignType = this.activatedRoute.snapshot.params['campaignType'];
    if("email"!=this.campaignType){
        this.referenceService.goToPageNotFound();
    }
    $('.bootstrap-switch-label').css('cssText', 'width:31px;!important');
    this.loggedInUserId = this.authenticationService.getUserId();
    let currentUrl = this.referenceService.getCurrentRouteUrl();
    this.isAdd = currentUrl!=undefined && currentUrl!=null && currentUrl!="" && currentUrl.indexOf("create")>-1;
    this.referenceService.renderer = this.render;
    this.isEmailCampaign = "email"==this.campaignType;
    this.isVideoCampaign = "video"==this.campaignType;
    this.isSurveyCampaign = "survey"==this.campaignType;
    this.isPageCampaign = "page"==this.campaignType;

   }

    ngOnInit() {
        if(this.isAdd){
            this.showCampaignDetailsTab();
        }
        this.loadCampaignDetailsSection();
        this.findEmailTemplates(this.emailTemplatesPagination);
    }

    showCampaignDetailsTab(){
        $('#launch-tab').hide(600);
        $('#campaign-details').show(600);
       
    }

    showLaunchTab(){
        $('#campaign-details').hide(600);
        $('#launch-tab').show(600);
    }

    loadCampaignDetailsSection(){
        this.campaignDetailsLoader = true;
        this.campaign.emailNotification = true;
        let partnerModuleCustomName = localStorage.getItem("partnerModuleCustomName");
        if(partnerModuleCustomName!=null && partnerModuleCustomName!=undefined){
        this.partnerModuleCustomName = partnerModuleCustomName;
        }
        if ('landingPage' == this.campaignType) {
        this.toPartnerToolTipMessage = "To "+this.partnerModuleCustomName+": Share a private page";
        this.throughPartnerToolTipMessage = "Through "+this.partnerModuleCustomName+": Share a public page";
        } else {
            this.toPartnerToolTipMessage = "To "+this.partnerModuleCustomName+": Send a campaign intended just for your "+this.partnerModuleCustomName;
            this.throughPartnerToolTipMessage = "Through "+this.partnerModuleCustomName+": Send a campaign that your "+this.partnerModuleCustomName+" can redistribute";
        }
        this.throughPartnerAndToPartnerHelpToolTip = this.throughPartnerToolTipMessage +"<br><br>"+this.toPartnerToolTipMessage;
        this.oneClickLaunchToolTip = "Send a campaign that your "+this.partnerModuleCustomName+" can redistribute with one click";
        this.initializeEndDatePicker();
        this.findCampaignDetailsData();
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
                this.showMarketingAutomationOption = this.isOrgAdminCompany;
                if(this.isOrgAdminCompany){
                    this.contactsOrPartnersSelectionText = "  Select List of "+this.partnerModuleCustomName+" / Recipients  to be used in this campaign";
                }else if(isMarketingCompany){
                    this.contactsOrPartnersSelectionText = "Select List of Recipients to be used in this campaign";
                }else if(isVendorCompany){
                    this.contactsOrPartnersSelectionText = "Select List of "+this.partnerModuleCustomName+" to be used in this campaign";
                }
                this.setFromEmailAndFromName(data);
            },error=>{
                this.xtremandLogger.errorPage(error);
        },()=>{
            if (this.activeCRMDetails.activeCRM) {
                if("SALESFORCE" === this.activeCRMDetails.type){
                    this.integrationService.checkSfCustomFields(this.authenticationService.getUserId()).subscribe(data => {
                        let cfResponse = data;                            
                        if (cfResponse.statusCode === 400) {
                            swal("Oh! Custom fields are missing in your Salesforce account. Leads and Deals created by your partners will not be pushed into Salesforce.", "", "error");
                        } else if (cfResponse.statusCode === 401 && cfResponse.message === "Expired Refresh Token") {
                            swal("Your Salesforce Integration was expired. Please re-configure.", "", "error");
                        }
                    }, error => {
                        this.xtremandLogger.error(error, "Error in salesforce checkIntegrations()");
                    });
                }else{
                    this.listCampaignPipelines();
                }
            }else{
                this.listCampaignPipelines();
            }

            /***Load Partners /Contacts***/
            this.campaignDetailsLoader = false;
            this.findCampaignRecipients(this.campaignRecipientsPagination);
        });
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
    if($.inArray(lowerCaseCampaignName, list) > -1 && this.editedCampaignName.toLowerCase()!=lowerCaseCampaignName){
        this.isValidCampaignName = false;
    }else{
        this.isValidCampaignName = true;
    }
    }

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

    validateField(fieldId:string){
    var errorClass = "form-group has-error has-feedback";
    var successClass = "form-group has-success has-feedback";
    let fieldValue = $.trim($('#'+fieldId).val());
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
        if($.trim(this.campaign.subjectLine).length>0){
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

    setChannelCampaign(event: any) {
        this.campaign.channelCampaign = event;
        this.campaignRecipientsPagination.pageIndex = 1;
        this.campaignRecipientsPagination.maxResults = 12;
        this.clearSelectedContactList();
        this.setCoBrandingLogo(event);
        this.setSalesEnablementOptions(event);
        /***XNFR-255*****/
        if(this.campaignType!='page'){
            this.campaign.whiteLabeled = false;
        }
        if (event) {
            this.setPartnerEmailNotification(event);
            this.removeTemplateAndAutoResponse();
            if (this.campaignType != 'page') {
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
        this.selectedLandingPageRow = 0;
        this.isLandingPage = false;
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
        this.removeTemplateAndAutoResponse();
        if (this.campaignType != 'page') {
            this.findEmailTemplates(this.emailTemplatesPagination);
        } else {
            this.findEmailTemplates(this.emailTemplatesPagination);
        }
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
    this.campaignRecipientsPagination.pageIndex = 1;
    this.campaignRecipientsPagination.maxResults = 12;
    this.selectedContactListIds = [];
    this.userListDTOObj = [];
    this.isContactList = false;
    this.selectedPartnershipId = 0;
    if(!event){
        this.findCampaignRecipients(this.campaignRecipientsPagination);
    }
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
    setSocialSharingIcons(event: any) {
        this.campaign.socialSharingIcons = event;
    }


    filterCoBrandedLandingPages(event: any) {
        //throw new Error('Method not implemented.');
    }
    filterCoBrandedTemplates(event: any) {
       // throw new Error('Method not implemented.');
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
                this.validateField('subjectLine');
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
        if(this.isEmailCampaign){
            emailTemplatesPagination.filterBy = this.properties.campaignRegularEmailsFilter;
            if(this.campaign.enableCoBrandingLogo){
                emailTemplatesPagination.emailTemplateType = EmailTemplateType.REGULAR_CO_BRANDING;
            }else{
                emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
            }
        }
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
		this.emailTemplatesSortOption.selectedGroupsDropDownOption = text;
		this.setSearchAndSortOptionsForEmailTemplates(this.emailTemplatesPagination, this.emailTemplatesSortOption);
	}

    searchEmailTemplates(){
        this.setSearchAndSortOptionsForEmailTemplates(this.emailTemplatesPagination,this.emailTemplatesSortOption);
    }

    setSearchAndSortOptionsForEmailTemplates(pagination: Pagination, emailTemplatesSortOption: SortOption){
		pagination.pageIndex = 1;
		pagination.searchKey = emailTemplatesSortOption.searchKey;
        pagination = this.utilService.sortOptionValues(emailTemplatesSortOption.selectedGroupsDropDownOption, pagination);
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
        if(this.selectedFolderIds.length>0){
            this.selectedFolderIds = [];
            this.applyFilter();
        }else{
            this.selectedFolderIds = [];
        }
    }

    applyFilter(){
        if (this.selectedFolderIds.length > 0) {
            this.emailTemplatesPagination.categoryIds = this.selectedFolderIds;
        } else {
            this.emailTemplatesPagination.categoryIds = [];
        }
        this.emailTemplatesPagination.pageIndex = 1;
        this.findEmailTemplates(this.emailTemplatesPagination);
    }

    selectEmailTemplate(emailTemplate:any){
        this.ngxLoading = true;
        this.emailTemplateHrefLinks = [];
        this.emailTemplateService.getById(emailTemplate.id)
            .subscribe(
                (data: any) => {
                    this.emailTemplateHrefLinks = this.referenceService.getAnchorTagsFromEmailTemplate(data.body, this.emailTemplateHrefLinks);
                    this.urls = this.emailTemplateHrefLinks;this.selectedEmailTemplateRow = emailTemplate.id;
                    this.isEmailTemplateOrPageSelected = true;
                    this.ngxLoading = false;
                },
                error => {
                    this.emailTemplateHrefLinks = [];
                    this.urls = this.emailTemplateHrefLinks;
                    this.isEmailTemplateOrPageSelected = true;
                    this.ngxLoading = false;
                });
    }

    previewEmailTemplate(emailTemplate:any){
        this.selectedEmailTemplateIdForPreview = emailTemplate.id;
        this.selectedEmailTemplateNameForPreview = emailTemplate.name;
        this.isPreviewEmailTemplateButtonClicked = true;

    }

    sendTestEmailModalPopupEventReceiver(){
        this.selectedEmailTemplateIdForPreview = 0;
        this.selectedEmailTemplateNameForPreview = "";
        this.isPreviewEmailTemplateButtonClicked = false;
        this.isSendTestEmailOptionClicked = false;
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
       // throw new Error('Method not implemented.');
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
        this.reply.emailTemplatesPagination.maxResults = 12;
        this.findEmailTemplatesForAutoResponseWorkFlow(this.reply);
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
        this.findEmailTemplatesForWebSiteWorkFlow(this.url);
    }
    findEmailTemplatesForWebSiteWorkFlow(url: Url) {
        //throw new Error('Method not implemented.');
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
    }

    spliceArray(arr: any, id: string) {
        arr = $.grep(arr, function (data:any, index:number) {
            return data.divId !== id
        });
        return arr;
    }
    
    selectReplyEmailBody(event: any, index: number, reply: Reply) {
        reply.defaultTemplate = event;
    }
    selectClickEmailBody(event: any, index: number, url: Url) {
        url.defaultTemplate = event;
    }
}
