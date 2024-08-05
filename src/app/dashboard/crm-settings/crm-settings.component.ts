import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch'; 

@Component({
  selector: 'app-crm-settings',
  templateUrl: './crm-settings.component.html',
  styleUrls: ['./crm-settings.component.css'],
  providers:[CallActionSwitch]
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
  showRegisterDeal:boolean = false;
  pipelineResponse: CustomResponse = new CustomResponse();
  showDealPipeLineCRMIntegrationMessage = "";
	showDealPipeLineStageCRMIntegrationMessage = "";
	showLeadPipeLineCRMIntegrationMessage = "";
	showLeadPipeLineStageCRMIntegrationMessage = "";
	showRegisterDealOffMessage = "";
	showRegisterDealOnMessage = "";
  ngxLoading:boolean = false;
  formLayoutTypes = [
    {
      id:'SINGLE_COLUMN_LAYOUT',
      name:'Single Column Layout'
    },
    {
      id:'TWO_COLUMN_LAYOUT',
      name:'Two Column Layout'
    }
  ];
  leadFormColumnLayout:any;
  dealFormColumnLayout:any;
  leadFormLayoutPreviewImagePath = "";
  dealFormLayoutPreviewImagePath = "";
  singleColumnLeadLayoutImagePath = "../../../assets/images/Singe-Column-Lead-Layout.png";
  twoColumnLeadLayoutImagePath = "../../../assets/images/Two-Column-Lead-Layout.png";
  isLocalHost = false;
  constructor(public callActionSwitch: CallActionSwitch,private integrationService: IntegrationService,public authenticationService: AuthenticationService,
    public referenceService:ReferenceService,public properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isLocalHost = this.authenticationService.isLocalHost();
   }

  ngOnInit() {
    this.setTitles();
    this.showLeadPipeline = this.integrationDetails.showLeadPipeline;
    this.showLeadPipelineStage = this.integrationDetails.showLeadPipelineStage;
    this.showDealPipeline = this.integrationDetails.showDealPipeline;
    this.showDealPipelineStage = this.integrationDetails.showDealPipelineStage;
    this.leadDescription = this.integrationDetails.leadDescription;
    this.dealDescription = this.integrationDetails.dealDescription;
    this.showRegisterDeal = this.integrationDetails.showRegisterDeal;
    this.leadFormColumnLayout = this.integrationDetails.leadFormColumnLayout;
    this.dealFormColumnLayout = this.integrationDetails.dealFormColumnLayout;

    this.setLeadFormLayoutPreviewImages();

    this.getLeadPipelines();
    this.getDealPipelines();
    if (!this.showLeadPipeline && !this.showDealPipeline 
      && (this.integrationDetails.leadPipelineId == undefined || this.integrationDetails.leadPipelineId <= 0)
      && (this.integrationDetails.dealPipelineId == undefined || this.integrationDetails.dealPipelineId <= 0)) {
      this.pipelineResponse = new CustomResponse('ERROR', 'Something went wrong. Please unlink and configure your account.', true);
    }
  }

  private setLeadFormLayoutPreviewImages() {
    if (this.leadFormColumnLayout == "SINGLE_COLUMN_LAYOUT") {
      this.leadFormLayoutPreviewImagePath = this.singleColumnLeadLayoutImagePath;
    } else {
      this.leadFormLayoutPreviewImagePath = this.twoColumnLeadLayoutImagePath;
    }
  }

  private setTitles() {
    let partnerModuleCustomName = this.authenticationService.getPartnerModuleCustomName();
    let partnersMergeTag = this.properties.partnersMergeTag;
    this.showDealPipeLineCRMIntegrationMessage = this.properties.showDealPipeLineCRMIntegrationMessage.replace(partnersMergeTag, partnerModuleCustomName);
    this.showDealPipeLineStageCRMIntegrationMessage = this.properties.showDealPipeLineStageCRMIntegrationMessage.replace(partnersMergeTag, partnerModuleCustomName);
    this.showLeadPipeLineCRMIntegrationMessage = this.properties.showLeadPipeLineCRMIntegrationMessage.replace(partnersMergeTag, partnerModuleCustomName);
    this.showLeadPipeLineStageCRMIntegrationMessage = this.properties.showLeadPipeLineStageCRMIntegrationMessage.replace(partnersMergeTag, partnerModuleCustomName);
    this.showRegisterDealOffMessage = this.properties.showRegisterDealOffMessage.replace(partnersMergeTag, partnerModuleCustomName);
    this.showRegisterDealOnMessage = this.properties.showRegisterDealOnMessage.replace(partnersMergeTag, partnerModuleCustomName);
  }

  updateCRMSettings() {
    this.integrationDetails.showLeadPipeline = this.showLeadPipeline;
    this.integrationDetails.showLeadPipelineStage = this.showLeadPipelineStage;
    this.integrationDetails.showDealPipeline = this.showDealPipeline;
    this.integrationDetails.showDealPipelineStage = this.showDealPipelineStage;
    this.integrationDetails.leadDescription = this.leadDescription;
    this.integrationDetails.dealDescription = this.dealDescription;
    this.integrationDetails.showRegisterDeal = this.showRegisterDeal;
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
      },
      error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.notifySubmitSuccess.emit(this.customResponse);
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
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      data => {
        this.integrationService.getCRMPipelinesForCRMSettings(data,this.loggedInUserId,this.integrationType,0,'LEAD').subscribe(
          data => {
            this.ngxLoading = false;
            if (data.statusCode == 200) {
              this.leadPipelines = data.data;
              for (let leadPipeline of this.leadPipelines) {
                if (this.integrationDetails.leadPipelineId == leadPipeline.id) {
                  this.leadPipelineStages = leadPipeline.stages;
                }
              }
            }
          })
      })
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
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      data => {
        this.integrationService.getCRMPipelinesForCRMSettings(data,this.loggedInUserId,this.integrationType,0,'DEAL').subscribe(
          data => {
            this.ngxLoading = false;
            if (data.statusCode == 200) {
              this.dealPipelines = data.data;
              for (let dealPipeline of this.dealPipelines) {
                if (this.integrationDetails.dealPipelineId == dealPipeline.id) {
                  this.dealPipelineStages = dealPipeline.stages;
                }
              }
            }
          })
      });
  }

  onChangeLeadPipelineStage(showLeadPipelineStage){
    this.showLeadPipelineStage = showLeadPipelineStage;
    if (!showLeadPipelineStage) {
      if (this.showLeadPipeline && this.integrationDetails.leadPipelineId == '0') {
        this.showLeadPipeline = false;
        this.onChangeLeadPipelines(this.showLeadPipeline);
      } else {
        for (let leadPipeline of this.leadPipelines) {
          if (this.integrationDetails.leadPipelineId == leadPipeline.id) {
            this.leadPipelineStages = leadPipeline.stages;
          }
        }
      }
    } else {
      this.integrationDetails.leadPipelineStageId = 0;
    }
    this.validateField();
  }

  onChangeDealPipelineStage(showDealPipelineStage){
    this.showDealPipelineStage = showDealPipelineStage;
    if (!showDealPipelineStage) {
      if (this.showDealPipeline && this.integrationDetails.dealPipelineId == '0') {
        this.showDealPipeline = false;
        this.onChangeDealPipelines(this.showDealPipeline);
      } else {
        for (let dealPipeline of this.dealPipelines) {
          if (this.integrationDetails.dealPipelineId == dealPipeline.id) {
            this.dealPipelineStages = dealPipeline.stages;
          }
        }
      }
    } else {
      this.integrationDetails.dealPipelineStageId = 0;
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
        for (let leadPipeline of this.leadPipelines) {
          if (this.integrationDetails.leadPipelineId == leadPipeline.id) {
            this.leadPipelineStages = leadPipeline.stages;
          }
        }
      } else {
        this.leadPipelineStages = [];
        this.integrationDetails.leadPipelineStageId = 0;
      }
    }
  }

  onChangeDealPipeline(){
    if (!this.showDealPipelineStage) {
      if (this.integrationDetails.dealPipelineId != '0') {
        for (let dealPipeline of this.dealPipelines) {
          if (this.integrationDetails.dealPipelineId == dealPipeline.id) {
            this.dealPipelineStages = dealPipeline.stages;
          }
        }
      } else {
        this.dealPipelineStages = [];
        this.integrationDetails.dealPipelineStageId = 0;
      }
    }
  }

  onChangeRegisterDeal(showRegisterDeal){
    this.showRegisterDeal = showRegisterDeal;
  }

  onChangeLeadFormType(leadFormColumnLayout) {
    this.leadFormColumnLayout = leadFormColumnLayout;
    this.setLeadFormLayoutPreviewImages();

  }

  onChangeDealFormType(dealFormColumnLayout) {
    this.dealFormColumnLayout = dealFormColumnLayout;
  }

}
