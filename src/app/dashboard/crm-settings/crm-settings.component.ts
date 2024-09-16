import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { LeadsService } from 'app/leads/services/leads.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
declare var swal, $, videojs: any;

@Component({
  selector: 'app-crm-settings',
  templateUrl: './crm-settings.component.html',
  styleUrls: ['./crm-settings.component.css'],
  providers:[CallActionSwitch,LeadsService]
})
export class CrmSettingsComponent implements OnInit {
  @Input() integrationDetails: any;
  @Input() integrationType: String;
  @Output() notifySubmitSuccess = new EventEmitter<any>();

  loggedInUserId:any;
  showLeadPipeline:boolean = false;
  showLeadPipelineStage:boolean = false;
  showDealPipeline:boolean = false;
  showDealPipelineStage:boolean = false;
  leadDescription:string = '';
  dealDescription:string = '';
  leadPipelines:any;
  leadPipelineStages:any;
  dealPipelines:any;
  dealPipelineStages:any;
  customResponse: CustomResponse = new CustomResponse();
  errorClass: string = "form-group has-error has-feedback";
  successClass: string = "form-group has-success has-feedback";
  isValid:boolean = true;
  isLeadPipelineValid:boolean = false;
  isDealPipelineValid:boolean = false;
  isLeadPipelineStageValid:boolean = false;
  isDealPipelineStageValid:boolean = false;
  dealByPartner:boolean = false;
  pipelineResponse: CustomResponse = new CustomResponse();
  showDealPipeLineCRMIntegrationMessage = "";
	showDealPipeLineStageCRMIntegrationMessage = "";
	showLeadPipeLineCRMIntegrationMessage = "";
	showLeadPipeLineStageCRMIntegrationMessage = "";
	showRegisterDealToPartnerOffMessage = "";
	showRegisterDealToPartnerOnMessage = "";
  ngxLoading:boolean = false;
  showRegisterDealForPartnerLeadsOffMessage: string = "";
  showRegisterDealForPartnerLeadsOnMessage: string = "";
  showRegisterDealToVendor:boolean = false;
  dealByVendor:boolean ;
  dealBySelfLead:boolean;
  showRegisterDealToSelfLeadsOffMessage: string;
  showRegisterDealToSelfLeadsOnMessage: string;
  formLayoutTypes =[];
  leadFormColumnLayout:any;
  dealFormColumnLayout:any;
  leadFormLayoutPreviewImagePath = "";
  dealFormLayoutPreviewImagePath = "";
  singleColumnLeadLayoutImagePath = "../../../assets/images/Single-Column-Lead-Layout.png";
  twoColumnLeadLayoutImagePath = "../../../assets/images/Two-Column-Lead-Layout.png";
  singleColumnDealLayoutImagePath = "../../../assets/images/Single-Column-Deal-Layout.png";
  twoColumnDealLayoutImagePath = "../../../assets/images/Two-Column-Deal-Layout.png";
  isLocalHost = false;
  singleColumnLayout = XAMPLIFY_CONSTANTS.singleColumnLayout;
  twoColumnLayout = XAMPLIFY_CONSTANTS.twoColumnLayout;
  isVendorAndPartnerLeadsRegisterDealToggleVisible: boolean = false;
  isSelfLeadsRegisterDealToggleVisible: boolean = false;
  leadPipelineTooltipTitle:string;
  leadPipelineStageTooltipTitle:string;
  dealPipelineTooltipTitle:string;
  dealPipelineStageTooltipTitle:string;
  
  constructor(public callActionSwitch: CallActionSwitch,private integrationService: IntegrationService,public authenticationService: AuthenticationService,
    public referenceService:ReferenceService,public properties: Properties, public leadSerivce: LeadsService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isLocalHost = this.authenticationService.isLocalHost();
    this.isVendorAndPartnerLeadsRegisterDealToggleVisible = this.authenticationService.module.isOrgAdmin || this.authenticationService.module.isVendor || this.authenticationService.module.isPrm 
    || (this.authenticationService.module.adminOrSuperVisor && !this.authenticationService.module.isMarketingCompany);
    this.isSelfLeadsRegisterDealToggleVisible = this.authenticationService.module.isOrgAdmin || this.authenticationService.module.isMarketing || this.authenticationService.isOrgAdminSuperVisor 
    || (this.authenticationService.module.isMarketingTeamMember && this.authenticationService.module.adminOrSuperVisor);
   }

  ngOnInit() {
    this.formLayoutTypes = [
      {
        id:XAMPLIFY_CONSTANTS.singleColumnLayout,
        name:'Single Column Layout'
      },
      {
        id:XAMPLIFY_CONSTANTS.twoColumnLayout,
        name:'Two Column Layout'
      }
    ];
    this.setTitles();
    this.showLeadPipeline = this.integrationDetails.showLeadPipeline;
    this.showLeadPipelineStage = this.integrationDetails.showLeadPipelineStage;
    this.showDealPipeline = this.integrationDetails.showDealPipeline;
    this.showDealPipelineStage = this.integrationDetails.showDealPipelineStage;
    this.leadDescription = this.integrationDetails.leadDescription;
    this.dealDescription = this.integrationDetails.dealDescription;
    this.dealByPartner = this.integrationDetails.dealByPartnerEnabled;
    this.dealByVendor = this.integrationDetails.dealByVendorEnabled;
    this.dealBySelfLead = this.integrationDetails.dealBySelfLeadEnabled;
    this.leadFormColumnLayout = this.integrationDetails.leadFormColumnLayout;
    this.dealFormColumnLayout = this.integrationDetails.dealFormColumnLayout;

    this.setLeadFormLayoutPreviewImage();
    this.setDealFormLayoutPreviewImage();

    this.getLeadPipelines();
    this.getDealPipelines();
    if (!this.showLeadPipeline && !this.showDealPipeline 
      && (this.integrationDetails.leadPipelineId == undefined || this.integrationDetails.leadPipelineId <= 0)
      && (this.integrationDetails.dealPipelineId == undefined || this.integrationDetails.dealPipelineId <= 0)) {
      this.pipelineResponse = new CustomResponse('ERROR', 'Something went wrong. Please unlink and configure your account.', true);
    }
  }

  private setLeadFormLayoutPreviewImage() {
    if (this.leadFormColumnLayout == this.singleColumnLayout) {
      this.leadFormLayoutPreviewImagePath = this.singleColumnLeadLayoutImagePath;
    } else if(this.leadFormColumnLayout == this.twoColumnLayout) {
      this.leadFormLayoutPreviewImagePath = this.twoColumnLeadLayoutImagePath;
    }
  }

  private setDealFormLayoutPreviewImage(){
    if (this.dealFormColumnLayout == this.singleColumnLayout) {
      this.dealFormLayoutPreviewImagePath = this.singleColumnDealLayoutImagePath;
    } else if(this.dealFormColumnLayout ==  this.twoColumnLayout) {
      this.dealFormLayoutPreviewImagePath = this.twoColumnDealLayoutImagePath;
    }
  }

  private setTitles() {
    let partnerModuleCustomName = this.authenticationService.getPartnerModuleCustomName();
    let partnersMergeTag = this.properties.partnersMergeTag;
    if (this.authenticationService.module.isMarketingCompany) {
      this.showDealPipeLineCRMIntegrationMessage = this.properties.showDealPipeLineCRMIntegrationMessageForMarketing;
      this.showDealPipeLineStageCRMIntegrationMessage = this.properties.showDealPipeLineStageCRMIntegrationMessageForMarketing;
      this.showLeadPipeLineCRMIntegrationMessage = this.properties.showLeadPipeLineCRMIntegrationMessageForMarketing;
      this.showLeadPipeLineStageCRMIntegrationMessage = this.properties.showLeadPipeLineStageCRMIntegrationMessageForMarketing;
      this.leadPipelineTooltipTitle = this.properties.leadPipelineTooltipTitleForMarketing;
      this.leadPipelineStageTooltipTitle = this.properties.leadPipelineStageTooltipTitleForMarketing;
      this.dealPipelineTooltipTitle = this.properties.dealPipelineTooltipTitleForMarketing;
      this.dealPipelineStageTooltipTitle = this.properties.dealPipelineStageTooltipTitleForMarketing;
    } else {
      this.showDealPipeLineCRMIntegrationMessage = this.properties.showDealPipeLineCRMIntegrationMessage.replace(partnersMergeTag, partnerModuleCustomName);
      this.showDealPipeLineStageCRMIntegrationMessage = this.properties.showDealPipeLineStageCRMIntegrationMessage.replace(partnersMergeTag, partnerModuleCustomName);
      this.showLeadPipeLineCRMIntegrationMessage = this.properties.showLeadPipeLineCRMIntegrationMessage.replace(partnersMergeTag, partnerModuleCustomName);
      this.showLeadPipeLineStageCRMIntegrationMessage = this.properties.showLeadPipeLineStageCRMIntegrationMessage.replace(partnersMergeTag, partnerModuleCustomName);
      this.leadPipelineTooltipTitle = this.properties.leadPipelineTooltipTitle;
      this.leadPipelineStageTooltipTitle = this.properties.leadPipelineStageTooltipTitle;
      this.dealPipelineTooltipTitle = this.properties.dealPipelineTooltipTitle;
      this.dealPipelineStageTooltipTitle = this.properties.dealPipelineStageTooltipTitle;
    }
    this.showRegisterDealToPartnerOffMessage = this.properties.showRegisterDealOffMessage.replace(partnersMergeTag, partnerModuleCustomName);
    this.showRegisterDealToPartnerOnMessage = this.properties.showRegisterDealOnMessage.replace(partnersMergeTag, partnerModuleCustomName);
    this.showRegisterDealForPartnerLeadsOffMessage = this.properties.showRegisterDealForPartnerLeadsOffMessage;
    this.showRegisterDealForPartnerLeadsOnMessage = this.properties.showRegisterDealForPartnerLeadsOnMessage;
    this.showRegisterDealToSelfLeadsOffMessage = this.properties.showRegisterDealToSelfLeadsOffMessage;
    this.showRegisterDealToSelfLeadsOnMessage = this.properties.showRegisterDealToSelfLeadsOnMessage;
  }

  updateCRMSettings() {
    this.ngxLoading = true;
    this.integrationDetails.showLeadPipeline = this.showLeadPipeline;
    this.integrationDetails.showLeadPipelineStage = this.showLeadPipelineStage;
    this.integrationDetails.showDealPipeline = this.showDealPipeline;
    this.integrationDetails.showDealPipelineStage = this.showDealPipelineStage;
    this.integrationDetails.leadDescription = $.trim(this.leadDescription);
    this.integrationDetails.dealDescription = $.trim(this.dealDescription);
    this.integrationDetails.dealByPartnerEnabled = this.dealByPartner;
    this.integrationDetails.dealByVendorEnabled = this.dealByVendor;
    this.integrationDetails.dealBySelfLeadEnabled = this.dealBySelfLead;
    this.integrationDetails.leadFormColumnLayout = this.leadFormColumnLayout;
    this.integrationDetails.dealFormColumnLayout = this.dealFormColumnLayout;
    if (this.integrationDetails.showLeadPipeline) {
      this.integrationDetails.leadPipelineId = 0;
    }
    if (this.integrationDetails.showDealPipeline) {
      this.integrationDetails.dealPipelineId = 0;
    }
    this.integrationService.updateCRMSettings(this.integrationType.toLowerCase(),this.loggedInUserId,this.integrationDetails)
      .subscribe(data => {
        if (data.statusCode == 200) {
          this.referenceService.goToTop();
          this.customResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
          this.notifySubmitSuccess.emit(this.customResponse);
        } else {
          this.referenceService.goToTop();
          this.customResponse = new CustomResponse('ERROR', data.message, true);
          this.notifySubmitSuccess.emit(this.customResponse);
        }
        this.ngxLoading = false;
      },
      error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.notifySubmitSuccess.emit(this.customResponse);
        this.ngxLoading = false;
      })
  }

  onChangeLeadPipelines(showLeadPipeline) {
    this.showLeadPipeline = showLeadPipeline;
    if (!showLeadPipeline) {
      if (this.leadPipelines.length === 1) {
        this.integrationDetails.leadPipelineId = this.leadPipelines[0].id;
      }
      this.onChangeLeadPipeline();
    } else {
      this.integrationDetails.leadPipelineId = 0;
      this.leadPipelineStages = [];
      this.integrationDetails.leadPipelineStageId = 0;
    }
    this.validateField();
  }

  getLeadPipelines(){
    this.ngxLoading = true;
    this.integrationService.findPipelinesForCRMSettings(this.loggedInUserId,this.integrationType,'LEAD',0).subscribe(
      data => {
        this.ngxLoading = false;
        if (data.statusCode === 200) {
          this.leadPipelines = data.data;
          if (this.integrationDetails.leadPipelineId != undefined && this.integrationDetails.leadPipelineId>0 
            && !this.integrationDetails.showLeadPipelineStage) {
            this.findLeadPipelineStagesByPipelineId(this.integrationDetails.leadPipelineId);
          }
        }
      },
      error => {
        this.ngxLoading = false;
      }
    )
  }

  findLeadPipelineStagesByPipelineId(pipelineId:any) {
    this.ngxLoading = true;
    this.leadSerivce.findPipelineStagesByPipelineId(pipelineId, this.loggedInUserId).subscribe(
      data => {
        this.ngxLoading = false;
        if (data.statusCode === 200) {
          let response = data.data;
          this.leadPipelineStages = response.list;
        }
      },
      error => {
        this.ngxLoading = false;
      }
    )
  }

  findDealPipelineStagesByPipelineId(pipelineId:any) {
    this.ngxLoading = true;
    this.leadSerivce.findPipelineStagesByPipelineId(pipelineId, this.loggedInUserId).subscribe(
      data => {
        this.ngxLoading = false;
        if (data.statusCode === 200) {
          let response = data.data;
          this.dealPipelineStages = response.list;
        }
      },
      error => {
        this.ngxLoading = false;
      }
    )
  }

  onChangeDealPipelines(showDealPipeline) {
    this.showDealPipeline = showDealPipeline;
    if (!showDealPipeline) {
      if (this.dealPipelines.length === 1) {
        this.integrationDetails.dealPipelineId = this.dealPipelines[0].id;
      }
      this.onChangeDealPipeline();
    } else {
      this.integrationDetails.dealPipelineId = 0;
      this.dealPipelineStages = [];
      this.integrationDetails.dealPipelineStageId = 0;
    }
    this.validateField();
  }

  getDealPipelines(){
    this.ngxLoading = true;
    this.integrationService.findPipelinesForCRMSettings(this.loggedInUserId,this.integrationType,'DEAL',0).subscribe(
      data => {
        this.ngxLoading = false;
        if (data.statusCode === 200) {
          this.dealPipelines = data.data;
          if (this.integrationDetails.dealPipelineId != undefined && this.integrationDetails.dealPipelineId>0 
            && !this.integrationDetails.showDealPipelineStage) {
            this.findDealPipelineStagesByPipelineId(this.integrationDetails.dealPipelineId);
          }
        }
      },
      error => {
        this.ngxLoading = false;
      }
    )
  }

  onChangeLeadPipelineStage(showLeadPipelineStage){
    this.showLeadPipelineStage = showLeadPipelineStage;
    if (!showLeadPipelineStage) {
      if (this.showLeadPipeline && this.integrationDetails.leadPipelineId == '0') {
        this.showLeadPipeline = false;
        this.onChangeLeadPipelines(this.showLeadPipeline);
      } else if (this.integrationDetails.leadPipelineId != undefined && this.integrationDetails.leadPipelineId > 0) {
        this.findLeadPipelineStagesByPipelineId(this.integrationDetails.leadPipelineId);
      }
    } else {
      this.integrationDetails.leadPipelineStageId = 0;
      this.leadPipelineStages = [];
    }
    this.validateField();
  }

  onChangeDealPipelineStage(showDealPipelineStage){
    this.showDealPipelineStage = showDealPipelineStage;
    if (!showDealPipelineStage) {
      if (this.showDealPipeline && this.integrationDetails.dealPipelineId == '0') {
        this.showDealPipeline = false;
        this.onChangeDealPipelines(this.showDealPipeline);
      } else if (this.integrationDetails.dealPipelineId != undefined && this.integrationDetails.dealPipelineId > 0) {
        this.findDealPipelineStagesByPipelineId(this.integrationDetails.dealPipelineId);
      }
    } else {
      this.integrationDetails.dealPipelineStageId = 0;
      this.dealPipelineStages = [];
    }
    this.validateField();
  }

  validateField(){
    if (!this.showLeadPipeline && (this.integrationDetails.leadPipelineId <= 0 || this.integrationDetails.leadPipelineId == "0")) {
      this.isLeadPipelineValid = false;
    } else {
      this.isLeadPipelineValid = true;
    }
    if (!this.showDealPipeline && (this.integrationDetails.dealPipelineId <= 0 || this.integrationDetails.dealPipelineId == "0")) {
      this.isDealPipelineValid = false;
    } else {
      this.isDealPipelineValid = true;
    }
    if (!this.showLeadPipelineStage && (this.integrationDetails.leadPipelineStageId == "0")) {
      this.isLeadPipelineStageValid = false;
    } else {
      this.isLeadPipelineStageValid = true;
    }
    if (!this.showDealPipelineStage && (this.integrationDetails.dealPipelineStageId == "0")) {
      this.isDealPipelineStageValid = false;
    } else {
      this.isDealPipelineStageValid = true;
    }
    if (this.isLeadPipelineValid && this.isDealPipelineValid && this.isLeadPipelineStageValid && this.isDealPipelineStageValid) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  onChangeLeadPipeline(){
    if (!this.showLeadPipelineStage) {
      if (this.integrationDetails.leadPipelineId != '0') {
        this.findLeadPipelineStagesByPipelineId(this.integrationDetails.leadPipelineId);
      } else {
        this.leadPipelineStages = [];
        this.integrationDetails.leadPipelineStageId = 0;
      }
    }
  }

  onChangeDealPipeline(){
    if (!this.showDealPipelineStage) {
      if (this.integrationDetails.dealPipelineId != '0') {
        this.findDealPipelineStagesByPipelineId(this.integrationDetails.dealPipelineId);
      } else {
        this.dealPipelineStages = [];
        this.integrationDetails.dealPipelineStageId = 0;
      }
    }
  }

  onChangeRegisterDeal(dealByPartner){
    if (dealByPartner) {
      this.dealByVendor = false;
    }
    this.dealByPartner = dealByPartner;
  }

  onChangeVendorRegisterDeal(dealByVendor){
    if (dealByVendor) {
      this.dealByPartner = false;
    }
    this.dealByVendor = dealByVendor;
  }

  onChangeSelfRegisterDeal(dealBySelfLead) {
    this.dealBySelfLead = dealBySelfLead;
  }

  onChangeLeadFormType(leadFormColumnLayout) {
    this.leadFormColumnLayout = leadFormColumnLayout;
    this.setLeadFormLayoutPreviewImage();

  }

  onChangeDealFormType(dealFormColumnLayout) {
    this.dealFormColumnLayout = dealFormColumnLayout;
    this.setDealFormLayoutPreviewImage();
  }

}
