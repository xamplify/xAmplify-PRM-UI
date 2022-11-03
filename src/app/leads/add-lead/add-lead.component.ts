import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lead } from '../models/lead';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { LeadsService } from '../services/leads.service';
import { Pipeline } from 'app/dashboard/models/pipeline';
import { PipelineStage } from 'app/dashboard/models/pipeline-stage';
import { CustomResponse } from '../../common/models/custom-response';
import { CountryNames } from '../../common/models/country-names';
import { DealRegistrationService } from '../../deal-registration/services/deal-registration.service';
import { DealsService } from '../../deals/services/deals.service';
import {Properties} from 'app/common/models/properties';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { IntegrationService } from 'app/core/services/integration.service';

declare var swal, $, videojs: any;

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css'],
  providers: [ HttpRequestLoader, CountryNames,Properties, DealsService,RegularExpressions],
})
export class AddLeadComponent implements OnInit {
  @Input() public leadId: any;
  @Input() public campaignId: any;
  @Input() public campaignName: any;
  @Input() public actionType: string;  
  @Input() public selectedContact: any;
  @Input() public email: any;
  @Input() public isVendorVersion: any;
  @Input() public isOrgAdmin: any;
  @Output() notifyOtherComponent = new EventEmitter();
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifyManageLeadsComponentToHidePopup = new EventEmitter();
  @Output() notifyAnalyticsComponentToHidePopup= new EventEmitter();
  lead: Lead = new Lead();
  preview = false;
  edit = false;
  loggedInUserId : number;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  leadFormTitle = "Lead";
  vendorList = new Array();
  pipelines = new Array<Pipeline>();
  stages = new Array<PipelineStage>();
  isValid = true;
  errorMessage = "";
  leadModalResponse: CustomResponse = new CustomResponse();
  ngxloading : boolean;
  hasCampaignPipeline = false;
  salesForceEnabled = false;
  hasSfPipeline = false;
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
  activeCRMDetails: any;


  constructor(public properties:Properties,public authenticationService: AuthenticationService, private leadsService: LeadsService,
    public dealRegistrationService: DealRegistrationService, public referenceService: ReferenceService, public countryNames: CountryNames, 
    private dealsService: DealsService,public regularExpressions:RegularExpressions, private integrationService: IntegrationService) {
      this.loggedInUserId = this.authenticationService.getUserId();
      if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
        this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.vanityLoginDto.userId = this.loggedInUserId;
        this.vanityLoginDto.vanityUrlFilter = true;
      }  
   }   

  ngOnInit() {  
    $('#leadFormModel').modal('show');    
    this.errorMessage = "";
    this.lead.createdForCompanyId = 0;
    this.lead.pipelineId = 0;
    this.lead.pipelineStageId = 0;
    if (this.actionType === "view") {
      this.preview = true;
      this.leadFormTitle = "View Lead";
      if (this.leadId > 0) {
        this.getLead(this.leadId);      
      }
    } else if (this.actionType === "edit") {
      this.edit = true;
      this.leadFormTitle = "Edit Lead";
      if (this.leadId > 0) {
        this.getLead(this.leadId);      
      }
    } else if (this.actionType === "add") {
      this.leadFormTitle = "Add a Lead";
      if (this.vanityLoginDto.vanityUrlFilter) {
        this.setCreatedForCompanyId();
      } else {
        if (this.campaignId > 0) {
          this.lead.campaignId = this.campaignId;
          this.lead.campaignName = this.campaignName;
          this.lead.associatedUserId = this.selectedContact.userId;
          this.getCreatedForCompanyIdByCampaignId();
          //this.getCampaignLeadPipeline();
          this.getContactInfo();
        }
      }
    }
    
    this.getVendorList();
  }

  setCreatedForCompanyId() {
    this.leadsService.getCompanyIdByCompanyProfileName(this.vanityLoginDto.vendorCompanyProfileName, this.loggedInUserId)
    .subscribe(
      data => {
        this.referenceService.loading(this.httpRequestLoader, false);
        if (data.statusCode == 200) {
          this.lead.createdForCompanyId = data.data;
          if (this.campaignId > 0) {
            this.lead.campaignId = this.campaignId;
            this.lead.campaignName = this.campaignName;
            this.lead.associatedUserId = this.selectedContact.userId;
            this.getCreatedForCompanyIdByCampaignId();
            //this.getCampaignLeadPipeline();
            this.getContactInfo();
          } else {
            //this.isSalesForceEnabled(); 
            this.getActiveCRMDetails();   
          }
        }
      },
      error => {
        this.httpRequestLoader.isServerError = true;
      },
      () => { }
    );
    }

  isSalesForceEnabled() {
    this.dealsService.isSalesForceEnabled(this.lead.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.salesForceEnabled = response.data;
            if (!this.salesForceEnabled) {
              if (this.edit || this.preview) {
                if (this.lead.campaignId > 0) {              
                  this.getCampaignLeadPipeline();
                } else {
                  this.getPipelines();
                }
              } else {                
                if (this.campaignId > 0) {
                  this.getCampaignLeadPipeline();
                } else {
                  this.resetPipelines();
                }
              }
            } else {
              this.getSalesforcePipeline();
            }
          }
        },
        error => {
          console.log(error);
        },
        () => {
          
        });
  }

  getSalesforcePipeline() {
    let self = this;    
    this.leadsService.getSalesforcePipeline(this.lead.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            let salesforcePipeline = data.data;
            if (this.lead.pipelineId != undefined && this.lead.pipelineId !== salesforcePipeline.id) {
              this.lead.pipelineStageId = 0
            } 
            self.lead.pipelineId = salesforcePipeline.id;
            //self.pipelineIdError = false;
            self.stages = salesforcePipeline.stages;
            self.hasSfPipeline = true;
          } else if (data.statusCode == 404) {
            self.lead.pipelineId = 0;
            self.stages = [];
            self.getPipelines();
            self.hasSfPipeline = false;
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }


  getContactInfo() {
    this.dealRegistrationService.getLeadData(this.selectedContact)
      .subscribe(
        data => {
          console.log(data)
          this.setDefaultLeadData(data);

        },
        (error: any) => {
          this.httpRequestLoader.isServerError = true;
        }
      );
  }

  setDefaultLeadData(data: any)
    {
        this.lead.firstName = data.firstName;
        this.lead.lastName = data.lastName;
        this.lead.country = data.country;
        this.lead.street = data.address;
        this.lead.phone = data.mobileNumber;
        this.lead.state = data.state;
        this.lead.postalCode = data.zipCode;
        this.lead.company = data.contactCompany;
        this.lead.city = data.city;
        this.lead.email = this.selectedContact.emailId;
    }

  getCreatedForCompanyIdByCampaignId() {
    let self = this;    
    if (this.lead.campaignId > 0) {
      this.leadsService.getCreatedForCompanyIdByCampaignId(this.lead.campaignId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            self.lead.createdForCompanyId = data.data;
            //this.isSalesForceEnabled();
            this.getActiveCRMDetails(); 
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
    }
  }

  getCampaignLeadPipeline() {
    let self = this;    
    if (this.lead.campaignId > 0) {
      this.leadsService.getCampaignLeadPipeline(this.lead.campaignId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            let campaignLeadPipeline = data.data;
            self.lead.pipelineId = campaignLeadPipeline.id;
            self.stages = campaignLeadPipeline.stages;
            self.hasCampaignPipeline = true;
          } else if (data.statusCode == 404) {
            self.lead.pipelineId = 0;
            self.stages = [];
            self.getPipelines();
            self.hasCampaignPipeline = false;
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
    }
  }

  onChangeCreatedFor() {
    //this.validateField('createdForCompanyId',false);
    if (this.lead.createdForCompanyId > 0) {
      //this.isSalesForceEnabled();    
      this.getActiveCRMDetails();          
    } 
  }

  resetPipelines() {
    this.lead.pipelineId = 0;
    this.lead.pipelineStageId = 0;
    this.hasCampaignPipeline = false;
    this.hasSfPipeline = false;
    this.activeCRMDetails.hasLeadPipeline = false;
    this.getPipelines();
  }

  getPipelines() {
    let self = this;    
    if (this.lead.createdForCompanyId > 0) {
      this.leadsService.getPipelines(this.lead.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            self.pipelines = data.data;
            self.getStages();
          } else {
            self.stages = [];
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
    }    
  }

  resetStages() {
    this.lead.pipelineStageId = 0;
    this.getStages();
  }

  getStages() {
    let self = this;    
    if (this.lead.pipelineId > 0) {
      this.pipelines.forEach(p =>{
        if (p.id == this.lead.pipelineId) {
          self.stages = p.stages;
        }
      }); 
    } else {
      self.stages = [];
    }
    
  }

  getVendorList() {
    let self = this;
    this.leadsService.getVendorList(this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            self.vendorList = data.data;
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  closeLeadModal() {
    this.notifyOtherComponent.emit();
    this.notifyAnalyticsComponentToHidePopup.emit();
    this.notifyManageLeadsComponentToHidePopup.emit();
    $('#leadFormModel').modal('hide');
  }

  getLead(leadId: number) {
    let self = this;
    this.leadsService.getLead(leadId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          this.referenceService.goToTop();
          if (data.statusCode == 200) {
            self.lead = data.data; 
            //this.isSalesForceEnabled();          
            this.getActiveCRMDetails(); 
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  validateCreatedFor() {
    if (this.lead.createdForCompanyId > 0) {
      this.isValid = this.isValid && true; 
    } else {
      this.isValid = false;
    }
  }

  validateAndSubmit() {
    this.isValid = true;
    if (this.lead.campaignId <= 0 && (this.lead.createdForCompanyId == undefined || this.lead.createdForCompanyId <= 0)) {
      this.isValid = false;
      this.errorMessage = "Please select Lead For";
    } else if (this.lead.pipelineId == undefined || this.lead.pipelineId <= 0) {
      this.isValid = false;
      this.errorMessage = "Please select a Pipeline";
    } else if (this.lead.pipelineStageId == undefined || this.lead.pipelineStageId <= 0) {
      this.isValid = false;
      this.errorMessage = "Please select a Pipeline Stage ";
    } else if (this.lead.lastName == undefined || this.lead.lastName == "") {
      this.isValid = false;
      this.errorMessage = "Please fill Last Name field";
    } else if (this.lead.company == undefined || this.lead.company == "") {
      this.isValid = false;
      this.errorMessage = "Please fill Company field";
    } else if (this.lead.email == undefined || this.lead.email == "") {
      this.isValid = false;
      this.errorMessage = "Please fill email field";
    } else if (this.lead.email != undefined && this.lead.email.trim() != "" && !this.regularExpressions.EMAIL_ID_PATTERN.test(this.lead.email)){
      this.isValid = false;
      this.errorMessage = "Please fill Valid Email Id";          
    } else if (this.lead.website != undefined && this.lead.website.trim() != "" && !this.regularExpressions.URL_PATTERN.test(this.lead.website)){
      this.isValid = false;
      this.errorMessage = "Please fill Valid Website";      
    }

    if (this.isValid) {
      this.saveOrUpdateLead();
    } else {      
      this.referenceService.scrollToModalBodyTopByClass();
    }
  }

  saveOrUpdateLead() {
    this.ngxloading = true;
    this.leadModalResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.errorMessage = "";
    this.lead.userId = this.loggedInUserId;
    this.leadsService.saveOrUpdateLead(this.lead)
    .subscribe(
        data => {
            this.ngxloading = false;
            this.referenceService.loading(this.httpRequestLoader, false);
            this.referenceService.goToTop();
            if(data.statusCode==200){
                //this.leadModalResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);   
                this.notifySubmitSuccess.emit(); 
                this.closeLeadModal();                     
            } else if (data.statusCode==500) {
                this.leadModalResponse = new CustomResponse('ERROR', data.message, true);
            }
        },
        error => {
            this.ngxloading = false;
            this.referenceService.loading(this.httpRequestLoader, false);
            this.leadModalResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
            },
        () => { }
    );
  }

  getActiveCRMDetails() {
    this.integrationService.getActiveCRMDetails(this.lead.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.activeCRMDetails = response.data;
            if (!this.activeCRMDetails.activeCRM) {
              if (this.edit || this.preview) {
                if (this.lead.campaignId > 0) {              
                  this.getCampaignLeadPipeline();
                } else {
                  this.getPipelines();
                }
              } else {                
                if (this.campaignId > 0) {
                  this.getCampaignLeadPipeline();
                } else {
                  this.resetPipelines();
                }
              }
            } else {              
              //this.getSalesforcePipeline();
              this.getActiveCRMPipeline();
            }
          }
        },
        error => {
          console.log(error);
        },
        () => {
          
        });
  }
  getActiveCRMPipeline() {
    let self = this;    
    this.leadsService.getCRMPipelines(this.lead.createdForCompanyId, this.loggedInUserId, this.activeCRMDetails.type)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            let activeCRMPipelines = data.data;
            let activeCRMPipeline = activeCRMPipelines[0];
            if (this.lead.pipelineId != undefined && this.lead.pipelineId !== activeCRMPipeline.id) {
              this.lead.pipelineStageId = 0
            } 
            self.lead.pipelineId = activeCRMPipeline.id;
            //self.pipelineIdError = false;
            self.stages = activeCRMPipeline.stages;
            self.activeCRMDetails.hasLeadPipeline = true;
          } else if (data.statusCode == 404) {
            self.lead.pipelineId = 0;
            self.stages = [];
            self.getPipelines();
            self.activeCRMDetails.hasLeadPipeline = false;
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

}
