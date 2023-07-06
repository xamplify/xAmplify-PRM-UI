import { Component, OnInit } from '@angular/core';
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




setChannelCampaign(event:any){
  this.campaign.channelCampaign = event;
}

}
