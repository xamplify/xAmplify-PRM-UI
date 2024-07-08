import { LEAD_CONSTANTS } from 'app/constants/lead.constants';
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
import { Properties } from 'app/common/models/properties';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { IntegrationService } from 'app/core/services/integration.service';
import { LeadCustomFieldDto } from '../models/lead-custom-field';

declare var swal, $, videojs: any;

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css'],
  providers: [HttpRequestLoader, CountryNames, Properties, DealsService, RegularExpressions],
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
  @Input() public dealToLead: any;
  @Input() public disableCreatedForVendor;
  @Output() notifyOtherComponent = new EventEmitter();
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifyManageLeadsComponentToHidePopup = new EventEmitter();

  @Output() notifyAnalyticsComponentToHidePopup = new EventEmitter();
  /****XNFR-426****/
  @Output() notifyUnReadChatCount = new EventEmitter();
  @Output() notifyClose = new EventEmitter();

  lead: Lead = new Lead();
  preview = false;
  edit = false;
  loggedInUserId: number;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  leadFormTitle = "Lead";
  vendorList = new Array();
  pipelines = new Array<Pipeline>();
  stages = new Array<PipelineStage>();
  isValid = true;
  errorMessage = "";
  leadModalResponse: CustomResponse = new CustomResponse();
  ngxloading: boolean;
  hasCampaignPipeline = false;
  salesForceEnabled = false;
  hasSfPipeline = false;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  activeCRMDetails: any;

  //XNFR-426
  selectedLead: Lead;
  isCommentSection = false;
  editTextArea: boolean = false;

  disableCreatedFor: boolean = false;
  createdByActiveCRM: any;
  createdForActiveCRM: any;
  showCreatedByPipelineAndStage: boolean = false;
  showCreatedByPipelineAndStageOnTop: boolean = false;
  createdForStages: any[];
  createdByStages: any[];
  createdByPipelines: any;
  createdForPipelines: any;
  type = "LEAD";
  showTicketTypesDropdown: boolean = false;
  isCreatedForStageIdDisable: boolean = false;
  isCreatedByStageIdDisable: boolean = false;
  isCampaignTicketTypeSelected: boolean = false;
  existingHalopsaLeadTicketTypeId: any;
  leadCustomFields = new Array<LeadCustomFieldDto>();

  industries = [
    "Select Industry", "Agriculture", "Apparel", "Banking", "Biotechnology", "Chemicals", "Communications", "Construction", "Consulting", "Education",
    "Electronics", "Energy", "Engineering", "Entertainment", "Environmental", "Finance", "Food & Beverage", "Government", "Healthcare", "Hospitality",
    "Insurance", "Machinery", "Manufacturing", "Media", "Not For Profit", "Recreation", "Retail", "Shipping", "Technology", "Telecommunications",
    "Transportation", "Utilities", "Other"
  ];
 

  constructor(public properties: Properties, public authenticationService: AuthenticationService, private leadsService: LeadsService,
    public dealRegistrationService: DealRegistrationService, public referenceService: ReferenceService, public countryNames: CountryNames,
    private dealsService: DealsService, public regularExpressions: RegularExpressions, private integrationService: IntegrationService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    }
  }

  ngOnInit() {
    this.getDefaultLeadCustomFields();
    $('#leadFormModel').modal('show');
    this.errorMessage = "";
    this.lead.createdForCompanyId = 0;
    this.lead.pipelineId = 0;
    this.lead.pipelineStageId = 0;
    this.lead.createdForPipelineId = 0;
    this.lead.createdByPipelineId = 0;
    this.lead.createdForPipelineStageId = 0;
    this.lead.createdByPipelineStageId = 0;
    this.lead.halopsaTicketTypeId = 0;
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
      this.leadFormTitle = LEAD_CONSTANTS.registerALead;
      if (this.vanityLoginDto.vanityUrlFilter) {
        this.setCreatedForCompanyId();
      } else if (this.dealToLead != undefined && this.dealToLead.callingComponent === "DEAL") {
        if (this.dealToLead.createdForCompanyId != undefined && this.dealToLead.createdForCompanyId != null && this.dealToLead.createdForCompanyId > 0) {
          this.lead.createdForCompanyId = this.dealToLead.createdForCompanyId;
          this.getActiveCRMDetails();
        }
      } else {
        if (this.campaignId > 0) {
          this.lead.campaignId = this.campaignId;
          this.lead.campaignName = this.campaignName;
          this.lead.associatedUserId = this.selectedContact.userId;
          this.getCreatedForCompanyIdByCampaignId();
          // this.getCampaignLeadPipeline();
          this.getContactInfo();
        }
      }
    }
    if (this.preview || this.edit || this.vanityLoginDto.vanityUrlFilter || (this.dealToLead != undefined && this.dealToLead.dealActionType === 'edit')) {
      this.disableCreatedFor = true;
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
              this.getLeadCustomFieldsByVendorCompany(this.lead.createdForCompanyId);
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

  setDefaultLeadData(data: any) {
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
              this.getLeadCustomFieldsByVendorCompany(self.lead.createdForCompanyId);
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
    this.ngxloading = true;
    let self = this;
    if (this.lead.campaignId > 0) {
      this.leadsService.getCampaignLeadPipeline(this.lead.campaignId, this.loggedInUserId)
        .subscribe(
          data => {
            this.ngxloading = false;
            this.referenceService.loading(this.httpRequestLoader, false);
            if (data.statusCode == 200) {
              let campaignLeadPipeline = data.data;
              let ticketTypeIdMap = data.map;
              self.lead.halopsaTicketTypeId = ticketTypeIdMap.halopsaTicketTypeId;
              if (campaignLeadPipeline.createdForCampaignPipelines != undefined) {
                self.lead.pipelineId = campaignLeadPipeline.createdForCampaignPipelines.id;
                self.lead.createdForPipelineId = campaignLeadPipeline.createdForCampaignPipelines.id;
                self.createdForStages = campaignLeadPipeline.createdForCampaignPipelines.stages;
              }
              if (campaignLeadPipeline.createdByCampaignPipelines != undefined) {
                self.lead.createdByPipelineId = campaignLeadPipeline.createdByCampaignPipelines.id;
                self.createdByStages = campaignLeadPipeline.createdByCampaignPipelines.stages;
              }
              self.hasCampaignPipeline = true;
              if ('HALOPSA' === this.activeCRMDetails.createdForActiveCRMType
                 || 'ZOHO' === this.activeCRMDetails.createdForActiveCRMType) {
                self.isCampaignTicketTypeSelected = true;
              }
            } else if (data.statusCode == 404) {
              self.lead.pipelineId = 0;
              self.stages = [];
              self.getPipelines();
              // this.getActiveCRMPipeline();
              self.hasCampaignPipeline = false;
            }
          },
          error => {
            this.ngxloading = false;
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
      this.getLeadCustomFieldsByVendorCompany(this.lead.createdForCompanyId);   
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
    if (this.lead.createdForPipelineId > 0) {
      this.createdForPipelines.forEach(p => {
        if (p.id == this.lead.createdForPipelineId) {
          self.createdForStages = p.stages;
        }
      });
    } else if (this.lead.createdByPipelineId > 0) {
      this.createdByPipelines.forEach(p => {
        if (p.id == this.lead.createdByPipelineId) {
          self.createdByStages = p.stages;
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

    if (this.actionType === "edit") {
      this.notifyUnReadChatCount.emit();
    }

    this.notifyClose.emit();

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
            if (!this.isVendorVersion) {
              this.getLeadCustomFieldsByVendorCompany(self.lead.createdForCompanyId);
            } else {
              this.getDefaultLeadCustomFields();
            }
            if (self.lead.industry == null || self.lead.industry == undefined || self.lead.industry == '') {
              self.lead.industry = this.industries[0];
            }
            self.existingHalopsaLeadTicketTypeId = self.lead.halopsaTicketTypeId;
            if (self.lead.createdForCompanyId > 0) {
            }
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
    if ('HALOPSA' === this.activeCRMDetails.createdForActiveCRMType && (this.lead.halopsaTicketTypeId == undefined ||
      this.lead.halopsaTicketTypeId <= 0)) {
      this.isValid = false;
      this.errorMessage = "Please select Ticket Type";
    } else if (this.lead.campaignId <= 0 && (this.lead.createdForCompanyId == undefined || this.lead.createdForCompanyId <= 0)) {
      this.isValid = false;
      this.errorMessage = "Please select Lead For";
    } else if (this.lead.createdForPipelineId == undefined || this.lead.createdForPipelineId <= 0) {
      this.isValid = false;
      this.errorMessage = "Please select a Pipeline";
    } else if (this.lead.createdForPipelineStageId == undefined || this.lead.createdForPipelineStageId <= 0) {
      this.isValid = false;
      this.errorMessage = "Please select a Pipeline Stage ";
    } else if (this.showCreatedByPipelineAndStage && (this.lead.createdByPipelineId == undefined || this.lead.createdByPipelineId <= 0)) {
      this.isValid = false;
      this.errorMessage = "Please select a Pipeline";
    } else if (this.showCreatedByPipelineAndStage && (this.lead.createdByPipelineStageId == undefined || this.lead.createdByPipelineStageId <= 0)) {
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
    } else if (this.lead.email != undefined && this.lead.email.trim() != "" && !this.regularExpressions.EMAIL_ID_PATTERN.test(this.lead.email)) {
      this.isValid = false;
      this.errorMessage = "Please fill Valid Email Id";
    } else if (this.lead.website != undefined && this.lead.website.trim() != "" && !this.regularExpressions.URL_PATTERN.test(this.lead.website)) {
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
    if (this.lead.createdForPipelineId > 0 && this.lead.createdForPipelineStageId > 0) {
      this.lead.pipelineId = this.lead.createdForPipelineId;
      this.lead.pipelineStageId = this.lead.createdForPipelineStageId;
    }
    else if (this.lead.createdByPipelineId > 0 && this.lead.createdByPipelineStageId > 0) {
      this.lead.pipelineId = this.lead.createdByPipelineId;
      this.lead.pipelineStageId = this.lead.createdByPipelineStageId;
    }
    this.leadsService.saveOrUpdateLead(this.lead)
      .subscribe(
        data => {
          this.ngxloading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          this.referenceService.goToTop();
          if (data.statusCode == 200) {
            //this.leadModalResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);   
            this.notifySubmitSuccess.emit(data.data);
            this.closeLeadModal();
          } else if (data.statusCode == 500) {
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
    this.ngxloading = true;
    this.integrationService.getActiveCRMDetails(this.lead.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        response => {
          this.ngxloading = false;
          if (response.statusCode == 200) {
            this.activeCRMDetails = response.data;
            if (("HALOPSA" === this.activeCRMDetails.createdForActiveCRMType 
              || "ZOHO" === this.activeCRMDetails.createdForActiveCRMType) && this.activeCRMDetails.showHaloPSAOpportunityTypesDropdown) {
              this.showTicketTypesDropdown = true;
              this.getHaloPSATicketTypes(this.lead.createdForCompanyId, this.activeCRMDetails.createdForActiveCRMType);
              if (this.actionType === 'add') {
                this.lead.createdForPipelineId = 0;
                this.lead.createdByPipelineId = 0;
                this.lead.createdForPipelineStageId = 0;
                this.lead.createdByPipelineStageId = 0;
                this.lead.halopsaTicketTypeId = 0;
              }
            } else if ("HALOPSA" === this.activeCRMDetails.createdByActiveCRMType && this.activeCRMDetails.showHaloPSAOpportunityTypesDropdown) {
              this.showTicketTypesDropdown = true;
              this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
                (result: any) => {
                  this.getHaloPSATicketTypes(result, this.activeCRMDetails.createdByActiveCRMType);
                });
              if (this.actionType === 'add') {
                this.lead.createdForPipelineId = 0;
                this.lead.createdByPipelineId = 0;
                this.lead.createdForPipelineStageId = 0;
                this.lead.createdByPipelineStageId = 0;
                this.lead.halopsaTicketTypeId = 0;
              }
            } else {
              this.showTicketTypesDropdown = false;
            }
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
              if (this.lead.campaignId > 0) {
                this.getCampaignLeadPipeline();
              } else {
                this.getActiveCRMPipeline();
              }
            }
            if (this.actionType === "view") {
              this.getLeadPipelinesForView();
            }
            else {
              if (!this.activeCRMDetails.showHaloPSAOpportunityTypesDropdown || this.actionType === "edit" || this.lead.campaignId > 0) {
                this.getLeadPipelines();
              }
            }
          }
        },
        error => {
          this.ngxloading = false;
          console.log(error);
        },
        () => {

        });
  }
  getActiveCRMPipeline() {
    this.ngxloading = true;
    let self = this;
    let halopsaTicketTypeId = 0;
    if (self.lead.halopsaTicketTypeId != undefined && self.lead.halopsaTicketTypeId > 0) {
      halopsaTicketTypeId = self.lead.halopsaTicketTypeId;
    }
    this.leadsService.getCRMPipelines(this.lead.createdForCompanyId, this.loggedInUserId, this.activeCRMDetails.type, halopsaTicketTypeId)
      .subscribe(
        data => {
          this.ngxloading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            let activeCRMPipelines = data.data;
            if (activeCRMPipelines.length === 1) {
              let activeCRMPipeline = activeCRMPipelines[0];
              if (this.lead.pipelineId != undefined && this.lead.pipelineId !== activeCRMPipeline.id) {
                this.lead.pipelineStageId = 0
              }
              self.lead.pipelineId = activeCRMPipeline.id;
              //self.pipelineIdError = false;
              self.stages = activeCRMPipeline.stages;
              self.activeCRMDetails.hasLeadPipeline = true;
            } else {
              self.pipelines = activeCRMPipelines;
              self.activeCRMDetails.hasLeadPipeline = false;
              for (let p of activeCRMPipelines) {
                if (p.id == this.lead.pipelineId) {
                  self.stages = p.stages;
                  //self.activeCRMDetails.hasLeadPipeline = true;
                  break;
                }
              }
            }

          } else if (data.statusCode == 404) {
            self.lead.pipelineId = 0;
            self.stages = [];
            self.getPipelines();
            self.activeCRMDetails.hasLeadPipeline = false;
          }
        },
        error => {
          this.ngxloading = false;
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  getLeadPipelines() {
    let campaignId = 0;
    let self = this;
    let halopsaTicketTypeId = 0;
    self.ngxloading = true;
    self.referenceService.loading(this.httpRequestLoader, true);
    if (this.lead.campaignId !== undefined && this.lead.campaignId > 0) {
      campaignId = this.lead.campaignId;
    }
    if (self.lead.halopsaTicketTypeId != undefined && self.lead.halopsaTicketTypeId > 0) {
      halopsaTicketTypeId = self.lead.halopsaTicketTypeId;
    }
    this.dealsService.getActiveCRMPipelines(this.lead.createdForCompanyId, this.loggedInUserId, campaignId, this.type, halopsaTicketTypeId)
      .subscribe(
        data => {
          self.referenceService.loading(this.httpRequestLoader, false);
          self.ngxloading = false;
          if (data.statusCode == 200) {
            let activeCRMPipelinesResponse: any = data.data;
            self.createdByActiveCRM = activeCRMPipelinesResponse.createdByActiveCRM;
            self.createdForActiveCRM = activeCRMPipelinesResponse.createdForActiveCRM;
            self.showCreatedByPipelineAndStage = activeCRMPipelinesResponse.showCreatedByLeadPipelineAndStage;
            self.showCreatedByPipelineAndStageOnTop = activeCRMPipelinesResponse.showCreatedByLeadPipelineAndStageOnTop;
            let createdByPipelines: Array<any> = activeCRMPipelinesResponse.createdByCompanyPipelines;
            if (createdByPipelines !== undefined && createdByPipelines !== null) {
              this.handleCreatedByPipelines(createdByPipelines);
            }

            let createdForPipelines: Array<any> = activeCRMPipelinesResponse.createdForCompanyPipelines;
            if (createdForPipelines !== undefined && createdForPipelines !== null) {
              this.handleCreatedForPipelines(createdForPipelines);
            }

          } else if (data.statusCode == 404) {
            this.lead.createdForPipelineId = 0;
            this.lead.createdByPipelineId = 0;
            this.createdForStages = [];
            this.createdByStages = [];
            this.getPipelines();
            this.activeCRMDetails.hasCreatedForPipeline = false;
            this.activeCRMDetails.hasCreatedByPipeline = false;
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  getLeadPipelinesForView() {
    let campaignId = 0;
    let self = this;
    this.ngxloading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    if (this.lead.campaignId !== undefined && this.lead.campaignId > 0) {
      campaignId = this.lead.campaignId;
    }
    this.leadsService.getLeadPipelinesForView(this.leadId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          this.ngxloading = false;
          if (data.statusCode == 200) {
            let activeCRMPipelinesResponse: any = data.data;
            self.createdByActiveCRM = activeCRMPipelinesResponse.createdByActiveCRM;
            self.createdForActiveCRM = activeCRMPipelinesResponse.createdForActiveCRM;
            self.showCreatedByPipelineAndStage = activeCRMPipelinesResponse.showCreatedByLeadPipelineAndStage;
            self.showCreatedByPipelineAndStageOnTop = activeCRMPipelinesResponse.showCreatedByLeadPipelineAndStageOnTop;
            let createdByPipelines: Array<any> = activeCRMPipelinesResponse.createdByCompanyPipelines;
            let createdForPipelines: Array<any> = activeCRMPipelinesResponse.createdForCompanyPipelines;

            if (createdByPipelines !== undefined && createdByPipelines !== null) {
              this.handleCreatedByPipelines(createdByPipelines);
            }

            if (createdForPipelines !== undefined && createdForPipelines !== null) {
              this.handleCreatedForPipelines(createdForPipelines);
            }

          } else if (data.statusCode == 404) {
            this.lead.createdForPipelineId = 0;
            this.lead.createdByPipelineId = 0;
            this.createdForStages = [];
            this.createdByStages = [];
            this.getPipelines();
            this.activeCRMDetails.hasCreatedForPipeline = false;
            this.activeCRMDetails.hasCreatedByPipeline = false;
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  handleCreatedByPipelines(createdByPipelines: any) {
    let self = this;
    self.createdByPipelines = createdByPipelines;
    if (createdByPipelines.length === 1) {
      let createdByPipeline = createdByPipelines[0];
      self.lead.createdByPipelineId = createdByPipeline.id;
      if ('HALOPSA' === this.activeCRMDetails.createdByActiveCRMType && this.actionType === 'add') {
        let createdByPipelineStage = null;
        let stages = createdByPipeline.stages;
        createdByPipelineStage = stages.reduce((mindisplayIndexStage, currentStage) =>
          mindisplayIndexStage.displayIndex < currentStage.displayIndex ? mindisplayIndexStage : currentStage
        );
        self.createdByStages = createdByPipeline.stages;
        self.lead.createdByPipelineStageId = createdByPipelineStage.id;
        self.isCreatedByStageIdDisable = true;
      } else {
        self.createdByStages = createdByPipeline.stages;
        self.isCreatedByStageIdDisable = false;
      }
      self.activeCRMDetails.hasCreatedByPipeline = true;
    } else {
      let createdByPipelineExist = false;
      for (let p of createdByPipelines) {
        if (p.id == this.lead.createdByPipelineId) {
          createdByPipelineExist = true;
          self.createdByStages = p.stages;
          break;
        }
      }
      if (!createdByPipelineExist) {
        self.lead.createdByPipelineId = 0;
        self.lead.createdByPipelineStageId = 0;
      }
      self.activeCRMDetails.hasCreatedByPipeline = false;
      self.isCreatedByStageIdDisable = false;
    }
  }

  handleCreatedForPipelines(createdForPipelines: any) {
    let self = this;
    self.createdForPipelines = createdForPipelines;
    if (createdForPipelines.length === 1) {
      let createdForPipeline = createdForPipelines[0];
      self.lead.createdForPipelineId = createdForPipeline.id;
      if ('HALOPSA' === this.activeCRMDetails.createdForActiveCRMType && this.actionType === 'add'
        || (self.existingHalopsaLeadTicketTypeId != undefined && self.existingHalopsaLeadTicketTypeId != self.lead.halopsaTicketTypeId)) {
        let createdForPipelineStage = null;
        let stages = createdForPipeline.stages;
        createdForPipelineStage = stages.reduce((mindisplayIndexStage, currentStage) =>
          mindisplayIndexStage.displayIndex < currentStage.displayIndex ? mindisplayIndexStage : currentStage
        );
        self.createdForStages = createdForPipeline.stages;
        self.lead.createdForPipelineStageId = createdForPipelineStage.id;
        self.isCreatedForStageIdDisable = true;
      } else {
        self.createdForStages = createdForPipeline.stages;
        self.isCreatedForStageIdDisable = false;
      }
      self.activeCRMDetails.hasCreatedForPipeline = true;
    } else {
      let createdForPipelineExist = false;
      for (let p of createdForPipelines) {
        if (p.id == this.lead.createdForPipelineId) {
          createdForPipelineExist = true;
          self.createdForStages = p.stages;
          break;
        }
      }
      if (!createdForPipelineExist) {
        self.lead.createdForPipelineId = 0;
        self.lead.createdForPipelineStageId = 0;
      }
      self.activeCRMDetails.hasCreatedForPipeline = false;
      self.isCreatedForStageIdDisable = false;
    }
  }


  /********XNFR-426********/
  showComments(lead: any) {
    this.selectedLead = lead;
    this.isCommentSection = !this.isCommentSection;
    this.editTextArea = !this.editTextArea;
  }

  addCommentModalClose(event: any) {
    this.selectedLead.unReadChatCount = 0;
    // console.log(this.selectedLead.unReadChatCount)
    this.isCommentSection = !this.isCommentSection;
    this.editTextArea = !this.editTextArea;
  }

  halopsaTicketTypeId: number = 0;
  halopsaTicketTypes: any;
  getHaloPSATicketTypes(companyId:number, integrationType:string) {
    this.ngxloading = true;
    this.integrationService.getHaloPSATicketTypes(companyId, integrationType.toLowerCase(), 'LEAD').subscribe(data => {
      this.ngxloading = false;
      if (data.statusCode == 200) {
        this.halopsaTicketTypes = data.data;
      }
    })
  }

  onChangeTicketType() {
    if (this.actionType === 'edit') {
      this.lead.createdForPipelineStageId = 0;
    }
    this.getLeadPipelines();
  }

  getDefaultLeadCustomFields() {
    this.ngxloading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.getLeadCustomFields().subscribe(data => {
      this.ngxloading = false;
      this.referenceService.loading(this.httpRequestLoader, false);
      if (data.statusCode == 200) {
        this.leadCustomFields = data.data;
      }
    });
  }

  getLeadCustomFieldsByVendorCompany(vendorCompanyId : number){
    this.ngxloading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.getLeadCustomFieldsByVendorCompany(vendorCompanyId).subscribe(data => {
      if (data.statusCode == 200) {
        this.leadCustomFields = data.data;
      }
    });
  }

}
