import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CampaignService } from '../services/campaign.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { ActivatedRoute } from '@angular/router';
import { CampaignAccess } from '../models/campaign-access';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pipeline } from 'app/dashboard/models/pipeline';
import { IntegrationService } from 'app/core/services/integration.service';
import { Pagination } from 'app/core/models/pagination';
import { EmailTemplateType } from 'app/email-template/models/email-template-type';
import { Reply } from '../models/campaign-reply';
import { Url } from '../models/campaign-url';
import { CustomResponse } from 'app/common/models/custom-response';
import { AddFolderModalPopupComponent } from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';

declare var $:any, swal:any;

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css'],
  providers:[CallActionSwitch]
})
export class AddCampaignComponent implements OnInit {

  loggedInUserId = 0;
  campaign: Campaign = new Campaign();
  loading = false;
  isAdd = false;

  defaultTabClass = "col-block";
  activeTabClass = "col-block col-block-active width";
  completedTabClass = "col-block col-block-complete";
  disableTabClass = "col-block col-block-disable";
  campaignDetailsTabClass = this.activeTabClass;


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
  contactsPagination: Pagination = new Pagination();
  emailTemplatesPagination:Pagination = new Pagination();
  selectedContactListIds = [];
  userListDTOObj = [];
  isContactList = false;
  selectedEmailTemplateRow: number;
  isEmailTemplate: boolean;
  selectedLandingPageRow: number;
  isLandingPage: boolean;
  selectedPartnershipId: number;
  replies: Array<Reply> = new Array<Reply>();
  urls: Array<Url> = new Array<Url>();
  dataError: boolean;
  folderCustomResponse: CustomResponse = new CustomResponse();
  @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
  showUsersPreview = false;
  mergeTagsInput: any = {};
  teamMemberEmailIds: any[] = [];
  showMarketingAutomationOption = false;
  leadPipelineClass: string = this.formGroupClass;
  dealPipelineClass: string = this.formGroupClass;
  endDateDivClass: string = this.formGroupClass;
  isOrgAdminCompany = false;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,
    public campaignService:CampaignService,public xtremandLogger:XtremandLogger,public callActionSwitch:CallActionSwitch,
    private activatedRoute:ActivatedRoute,public integrationService: IntegrationService) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.loadCampaignDetailsSection();
  }

  loadCampaignDetailsSection(){
        this.campaignDetailsLoader = true;
        this.campaign.emailNotification = true;
        let partnerModuleCustomName = localStorage.getItem("partnerModuleCustomName");
        if(partnerModuleCustomName!=null && partnerModuleCustomName!=undefined){
        this.partnerModuleCustomName = partnerModuleCustomName;
        }
        this.campaignType = this.activatedRoute.snapshot.params['campaignType'];
        if ('landingPage' == this.campaignType) {
        this.toPartnerToolTipMessage = "To "+this.partnerModuleCustomName+": Share a private page";
        this.throughPartnerToolTipMessage = "Through "+this.partnerModuleCustomName+": Share a public page";
    } else {
        this.toPartnerToolTipMessage = "To "+this.partnerModuleCustomName+": Send a campaign intended just for your "+this.partnerModuleCustomName;
        this.throughPartnerToolTipMessage = "Through "+this.partnerModuleCustomName+": Send a campaign that your "+this.partnerModuleCustomName+" can redistribute";
    }
    this.throughPartnerAndToPartnerHelpToolTip = this.throughPartnerToolTipMessage +"<br><br>"+this.toPartnerToolTipMessage;
    this.oneClickLaunchToolTip = "Send a campaign that your "+this.partnerModuleCustomName+" can redistribute with one click";

    this.findCampaignDetailsData();
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
            this.showMarketingAutomationOption = this.isOrgAdminCompany;
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
        this.campaignDetailsLoader = false;
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
        this.contactsPagination.pageIndex = 1;
        this.contactsPagination.maxResults = 12;
        this.clearSelectedContactList();
        this.setCoBrandingLogo(event);
        this.setSalesEnablementOptions(event);
        /***XNFR-255*****/
        if(this.campaignType!='landingPage'){
            this.campaign.whiteLabeled = false;
        }
        if (event) {
            this.setPartnerEmailNotification(event);
            this.removeTemplateAndAutoResponse();
            if (this.campaignType != 'landingPage') {
                this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
            }
          //  this.loadContacts();
        } else {
            this.campaign.oneClickLaunch = false;
            this.loadContacts();
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
        arr = $.grep(arr, function (data, index) {
            return data.divId !== id
        });
        return arr;
    }

    loadContacts() {
      //  throw new Error('Method not implemented.');
    }
    
    removeTemplateAndAutoResponse() {
        this.urls = [];//Removing Auto-Response WebSites
        this.selectedEmailTemplateRow = 0;
        this.isEmailTemplate = false;
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
        if (this.campaignType != 'landingPage') {
            this.filterCoBrandedTemplates(event);
        } else {
            this.filterCoBrandedLandingPages(event);
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
    this.contactsPagination.pageIndex = 1;
    this.contactsPagination.maxResults = 12;
    this.selectedContactListIds = [];
    this.userListDTOObj = [];
    this.isContactList = false;
    this.selectedPartnershipId = 0;
    if(!event){
        this.loadContacts();
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


}
