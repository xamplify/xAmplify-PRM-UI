import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { DEAL_CONSTANTS } from 'app/constants/deal.constants';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { User } from 'app/core/models/user';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UserService } from 'app/core/services/user.service';
import { UtilService } from 'app/core/services/util.service';
import { Pipeline } from 'app/dashboard/models/pipeline';
import { PipelineStage } from 'app/dashboard/models/pipeline-stage';
import { DealAnswer } from 'app/deal-registration/models/deal-answers';
import { DealDynamicProperties } from 'app/deal-registration/models/deal-dynamic-properties';
import { DealQuestions } from 'app/deal-registration/models/deal-questions';
import { DealType } from 'app/deal-registration/models/deal-type';
import { SfCustomFieldsDataDTO } from 'app/deal-registration/models/sfcustomfieldsdata';
import { DealRegistrationService } from 'app/deal-registration/services/deal-registration.service';
import { SfDealComponent } from 'app/deal-registration/sf-deal/sf-deal.component';
import { Deal } from 'app/deals/models/deal';
import { DealsService } from 'app/deals/services/deals.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { Lead } from '../models/lead';
import { LeadsService } from '../services/leads.service';
import { LEAD_CONSTANTS } from 'app/constants/lead.constants';
import { LeadCustomFieldDto } from '../models/lead-custom-field';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { CountryNames } from 'app/common/models/country-names';
declare var flatpickr: any, $: any, swal: any;
@Component({
  selector: 'app-custom-add-lead',
  templateUrl: './custom-add-lead.component.html',
  styleUrls: ['./custom-add-lead.component.css'],
  providers: [HttpRequestLoader, DealsService, LeadsService, Properties, RegularExpressions, CountryNames],
})
export class CustomAddLeadComponent implements OnInit {
  @Input() public dealId: any;
  @Input() public leadId: any;
  @Input() public campaignId: any;
  @Input() public campaignName: any;
  @Input() public actionType: string;
  @Input() public selectedContact: any;
  @Input() public isVendorVersion: boolean;
  @Input() public isOrgAdmin: boolean;
  @Input() public hideAttachLeadButton: boolean;
  @Input() public dealToLead: any;
  @Input() public disableCreatedForVendor;
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifyClose = new EventEmitter();
  @Output() notifyOtherComponent = new EventEmitter();
  @Output() notifyManageLeadsComponentToHidePopup = new EventEmitter();

  preview = false;
  edit = false;
  loggedInUserId: number;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  leadModalResponse: CustomResponse = new CustomResponse();
  leadFormTitle = "Lead Details";
  showCustomForm: boolean = false;
  vendorList = new Array();
  deal: Deal = new Deal();
  lead: Lead = new Lead();
  contact: User = new User();
  pipelines = new Array<Pipeline>();
  stages = new Array<PipelineStage>();
  hasCampaignPipeline = false;
  hasSfPipeline = false;
  dealTypes: DealType[] = [];
  defaultDealTypes = ['Select Dealtype', 'New Customer', 'New Product', 'Upgrade', 'Services'];
  questions: DealQuestions[] = [];
  propertiesQuestions: Array<DealDynamicProperties> = new Array<DealDynamicProperties>();
  propertiesComments: Array<DealDynamicProperties> = new Array<DealDynamicProperties>();
  properties: Array<DealDynamicProperties> = new Array<DealDynamicProperties>();
  showDefaultForm : boolean = false;
  showContactInfo : boolean  = false;

  ngxloading: boolean;
  isLoading = false;
  showLoadingButton: boolean;
  customResponse: CustomResponse = new CustomResponse();
  errorClass: string = "form-group has-error has-feedback";
  successClass: string = "form-group has-success has-feedback";

  title: string;
  titleError: boolean = true;
  opportunityAmount: string;
  opportunityAmountError: boolean = true;
  estimatedCloseDate: string;
  estimatedCloseDateError: boolean = true;
  dealType: string;
  dealTypeError: boolean = true;
  createdForCompanyId: string;
  createdForCompanyIdError: boolean = true;
  pipelineId: string;
  pipelineIdError: boolean = true;
  pipelineStageId: string;
  pipelineStageIdError: boolean = true;
  isDealRegistrationFormValid: boolean = true;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  property: DealDynamicProperties = new DealDynamicProperties();
  ownDeal: boolean = false;
  showCommentActions: boolean = false;

  @ViewChild(SfDealComponent)
  sfDealComponent: SfDealComponent;
  activeCRMDetails: any;
  isCollapsed: boolean;
  isCollapsed1: boolean;
  isCollapsed2: boolean;
  isCollapsed3: boolean;

  showLeadForm: boolean = false;
  showSelectLeadModel: boolean = false;
  showAttachLeadButton: boolean = false;
  attachLeadText: string = "Attach a Lead";

  createdByPipelines = new Array<Pipeline>();
  createdByStages = new Array<PipelineStage>();
  createdForPipelines = new Array<Pipeline>();
  createdForStages = new Array<PipelineStage>();
  createdForPipelineIdError: boolean = true;
  createdForPipelineStageIdError: boolean = true;
  pipelineText: any;
  pipelinestageText: string;
  /*** XNFR-476 ***/
  holdActiveCRMPipelineId: number = 0;
  showDetachLeadButton: boolean  = false;
  holdCreatedForCompanyId: number = 0;
  createdForPipelineId:any;
  createdForPipelineStageId:any;
  createdByActiveCRM: any;
  createdForActiveCRM: any;
  isMarketingCompany: boolean = false;
  showCreatedByPipelineAndStage: boolean = false;
  showCreatedByPipelineAndStageOnTop: boolean = false;
  vendorCompanyName:string = '';


  titleFields = ['title','name','symptom','Deal_Name','Title'];
  amountFields = ['amount','value','FOppValue','Amount'];
  closeDateFields = ['expected_close_date','expectedCloseDate','FOppTargetDate','CloseDate','Closing_Date'];
  firstNameFields = ['FirstName'];
  lastNameFields = ['LastName'];
  emailFields = ['Email'];
  companyFields = ['Company'];
  phoneFields = ['Phone'];
  websiteFields = ['Website'];
  streetFields = ['Street'];
  cityFields = ['City'];
  stateFields = ['State'];
  postalCodeFields = ['PostalCode'];
  countryFields = [];
  regionFields = [];
  industryFields = ['Industry'];

  type = "LEAD";
  showOpportunityTypes:boolean = false;
  opportunityTypeId: any;
  opportunityTypeIdError: boolean = true;
  isCreatedForStageIdDisable: boolean = false;
  isCampaignTicketTypeSelected: boolean = false;
  existingHalopsaDealTicketTypeId: any;
  isCopiedToClipboard : boolean = false;
  isZohoLeadAttached: boolean = false;
  isCreatedByStageIdDisable: boolean = false;
  isZohoLeadAttachedWithoutSelectingDealFor: boolean = false;
  disableCreatedFor: boolean = false;
  existingHalopsaLeadTicketTypeId: any;
  showTicketTypesDropdown: boolean = false;
  salesForceEnabled = false;
  holdTicketTypeId: any;
  isValid: boolean = false;
  errorMessage = "";
  leadCustomFields = new Array<LeadCustomFieldDto>();
  showAttachLeadPopUp: boolean = false;
  inValidEmailId : boolean = false;
  isValidPipeplineAndStage  : boolean = false;

  industries = [
    "Select Industry", "Agriculture", "Apparel", "Banking", "Biotechnology", "Chemicals", "Communications", "Construction", "Consulting", "Education",
    "Electronics", "Energy", "Engineering", "Entertainment", "Environmental", "Finance", "Food & Beverage", "Government", "Healthcare", "Hospitality",
    "Insurance", "Machinery", "Manufacturing", "Media", "Not For Profit", "Recreation", "Retail", "Shipping", "Technology", "Telecommunications",
    "Transportation", "Utilities", "Other"
  ];
  

  constructor(private logger: XtremandLogger, public messageProperties: Properties, public authenticationService: AuthenticationService, private dealsService: DealsService,
    public dealRegistrationService: DealRegistrationService, public referenceService: ReferenceService,
    public utilService: UtilService, private leadsService: LeadsService, public regularExpressions: RegularExpressions, public userService: UserService, public countryNames: CountryNames, private integrationService: IntegrationService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isMarketingCompany = this.authenticationService.module.isMarketingCompany;
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;

    }
  }

  ngOnInit() {
    this.getDefaultLeadCustomFields();
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
      if (this.dealToLead != undefined && this.dealToLead.callingComponent === "DEAL") {
        $('#leadFormModel').modal('show');
        this.showAttachLeadPopUp = true;
        // if (this.dealToLead.createdForCompanyId != undefined && this.dealToLead.createdForCompanyId != null && this.dealToLead.createdForCompanyId > 0) {
        //   this.lead.createdForCompanyId = this.dealToLead.createdForCompanyId;
        //   this.getLeadCustomFieldsByVendorCompany(this.lead.createdForCompanyId);
        //   this.getActiveCRMDetails();
        // }
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
        if (this.dealToLead != undefined && this.dealToLead.callingComponent === "DEAL") {
          $('#leadFormModel').modal('show');
          this.showAttachLeadPopUp = true;
        }
      } else if (this.dealToLead != undefined && this.dealToLead.callingComponent === "DEAL") {
        $('#leadFormModel').modal('show');
        this.showAttachLeadPopUp = true;
        if (this.dealToLead.createdForCompanyId != undefined && this.dealToLead.createdForCompanyId != null && this.dealToLead.createdForCompanyId > 0) {
          this.lead.createdForCompanyId = this.dealToLead.createdForCompanyId;
          this.getLeadCustomFieldsByVendorCompany(this.lead.createdForCompanyId);
          this.getActiveCRMDetails();
        }
      } else {
        if (this.campaignId > 0) {
          this.lead.campaignId = this.campaignId;
          this.lead.campaignName = this.campaignName;
          this.lead.associatedUserId = this.selectedContact.userId;
          this.getCreatedForCompanyIdByCampaignId();
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
              this.getContactInfo();
              
            } else {
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
                let ticketTypeIdMap = data.map;
                self.lead.halopsaTicketTypeId = ticketTypeIdMap.halopsaTicketTypeId;
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
      let vendorCompany;
      vendorCompany = this.vendorList.find(vendor => vendor.companyId == this.lead.createdForCompanyId);
      this.vendorCompanyName = vendorCompany.companyName;
      this.getLeadCustomFieldsByVendorCompany(this.lead.createdForCompanyId);
      this.getActiveCRMDetails();
    } else {
      this.resetPipelines();
      this.lead.createdForPipelineId = 0;
      this.lead.createdByPipelineId = 0;
      this.lead.createdForPipelineStageId = 0;
      this.lead.createdByPipelineStageId = 0;
      this.lead.halopsaTicketTypeId = 0;
      this.activeCRMDetails.hasCreatedForPipeline = false;
      this.activeCRMDetails.hasCreatedByPipeline = false;
      this.showTicketTypesDropdown = false;
      this.resetLeadDetails();
      this.getDefaultLeadCustomFields();
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

  resetLeadDetails() {
    this.lead.firstName = "";
    this.lead.lastName = "";
    this.lead.email = "";
    this.lead.company = "";
    this.lead.city = "";
    this.lead.website = "";
    this.lead.country = 'Select Country';
    this.lead.phone = '';
    this.lead.street = '';
    this.lead.city = '';
    this.lead.state = '';
    this.lead.title = '';
    this.lead.postalCode = '';
    this.lead.leadComment = '';
    this.lead.industry = 'Select Industry';
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
    let displayName = '';
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
      this.leadCustomFields.forEach(field => {
        if (field.labelId === 'last_name') {
          displayName = field.displayName;
        }
      });
      this.isValid = false;
      this.errorMessage = `Please fill ${displayName} field`;
    } else if (this.lead.company == undefined || this.lead.company == "") {
      this.leadCustomFields.forEach(field => {
        if (field.labelId === 'company') {
          displayName = field.displayName;
        }
      });
      this.isValid = false;
      this.errorMessage = `Please fill ${displayName} field`;
    } else if (this.lead.email == undefined || this.lead.email == "") {
      this.leadCustomFields.forEach(field => {
        if (field.labelId === 'email') {
          displayName = field.displayName;
        }
      });
      this.isValid = false;
      this.errorMessage = `Please fill ${displayName} field`;
    } else if (this.lead.email != undefined && this.lead.email.trim() != "" && !this.regularExpressions.EMAIL_ID_PATTERN.test(this.lead.email)) {
      this.leadCustomFields.forEach(field => {
        if (field.labelId === 'email') {
          displayName = field.displayName;
        }
      });
      this.isValid = false;
      this.errorMessage = `Please fill Valid ${displayName} Id`;
    } else if (this.lead.website != undefined && this.lead.website.trim() != "" && !this.regularExpressions.URL_PATTERN.test(this.lead.website)) {
      this.leadCustomFields.forEach(field => {
        if (field.labelId === 'website') {
          displayName = field.displayName;
        }
      });
      this.isValid = false;
      this.errorMessage = `Please fill Valid ${displayName}`;
    }

    if (this.isValid) {
      this.save();
    } else {
      this.referenceService.scrollToModalBodyTopByClass();
    }

  }

  resetCreatedByPipelineStages() {
    if (!this.preview && !this.hasCampaignPipeline && !this.activeCRMDetails.hasLeadPipeline) {
      this.lead.pipelineStageId = 0;
      this.getStages();
      this.pipelineStageId = "form-group has-error has-feedback";
      this.pipelineStageIdError = true;
      this.isDealRegistrationFormValid = false;
    }
  }

  resetCreatedForPipelineStages() {
    if (!this.preview && !this.hasCampaignPipeline && !this.activeCRMDetails.hasLeadPipeline) {
      this.lead.createdForPipelineStageId = 0;
      this.getStages();
      this.createdForPipelineStageId = "form-group has-error has-feedback";
      this.createdForPipelineStageIdError = true;
      this.isDealRegistrationFormValid = false;
    }
  }

  save() {
    this.customResponse = new CustomResponse();
    this.ngxloading = true;
    this.isLoading = true;
    this.lead.userId = this.loggedInUserId;

    if (this.showCustomForm) {
      this.showLoadingButton = true;
      this.setSfFormFieldValues();
    }

    if (!this.activeCRMDetails.showLeadPipeline) {
      this.lead.createdForPipelineId = this.activeCRMDetails.leadPipelineId;
    }
    if (!this.activeCRMDetails.showLeadPipelineStage) {
      this.lead.createdForPipelineStageId = this.activeCRMDetails.leadPipelineStageId;
    }
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
          this.isLoading = false;
          this.referenceService.goToTop();
          this.referenceService.loading(this.httpRequestLoader, false);
          this.showLoadingButton = false;
          if (data.statusCode == 200) {
            this.notifySubmitSuccess.emit(data.data);
            this.closeLeadModal();
          } else if (data.statusCode == 500) {
            this.customResponse = new CustomResponse('ERROR', data.message, true);
          }
        },
        error => {
          this.referenceService.goToTop();
          this.ngxloading = false;
          this.isLoading = false;
          this.showLoadingButton = false;
          this.customResponse = new CustomResponse('ERROR', this.messageProperties.serverErrorMessage, true);
        },
        () => { }
      );
  }

  validateField(fieldId: any, isFormElement: boolean) {
    this.validateAllFields();
    var errorClass = "form-group has-error has-feedback";
    var successClass = "form-group has-success has-feedback";
    if (isFormElement && fieldId.key != null && fieldId.key != undefined) {
      let fieldValue = $.trim($('#question_' + fieldId.id).val());
      if (fieldValue.length > 0) {
        fieldId.class = successClass;
        fieldId.error = false;
      } 
    
      if (fieldId == "createdForCompanyId") {
        if (fieldValue.length > 0 && fieldValue != "0") {
          this.createdForCompanyId = successClass;
          this.createdForCompanyIdError = false;
        } else {
          this.createdForCompanyId = errorClass;
          this.createdForCompanyIdError = true;
          this.pipelineId = errorClass;
          this.pipelineIdError = true;
          this.pipelineStageId = errorClass;
          this.pipelineStageIdError = true;
          this.createdForPipelineId = errorClass;
          this.createdForPipelineIdError = true;
          this.createdForPipelineStageId = errorClass;
          this.createdForPipelineStageIdError = true;
        }
      }
      if (fieldId == "createdByPipelineId") {
        if (fieldValue.length > 0 && fieldValue != "0") {
          this.pipelineId = successClass;
          this.pipelineIdError = false;
        } else {
          this.pipelineId = errorClass;
          this.pipelineIdError = true;
          this.pipelineStageId = errorClass;
          this.pipelineStageIdError = true;
        }
      }
      if (fieldId == "createdForPipelineId") {
        if (fieldValue.length > 0 && fieldValue != "0") {
          this.createdForPipelineId = successClass;
          this.createdForPipelineIdError = false;
        } else {
          this.createdForPipelineId = errorClass;
          this.createdForPipelineIdError = true;
          this.createdForPipelineStageId = errorClass;
          this.createdForPipelineStageIdError = true;
        }
      }
      if (fieldId == "createdByPipelineStageId") {
        if (fieldValue.length > 0 && fieldValue != "0") {
          this.pipelineStageId = successClass;
          this.pipelineStageIdError = false;
        } else {
          this.pipelineStageId = errorClass;
          this.pipelineStageIdError = true;
        }
      }
      if (fieldId == "createdForPipelineStageId") {
        if (fieldValue.length > 0 && fieldValue != "0") {
          this.createdForPipelineStageId = successClass;
          this.createdForPipelineStageIdError = false;
        } else {
          this.createdForPipelineStageId = errorClass;
          this.createdForPipelineStageIdError = true;
        }
      }
      if (this.activeCRMDetails.showHaloPSAOpportunityTypesDropdown) {
        if (fieldId == "opportunityTypeId") {
          if (fieldValue.length > 0 && fieldValue != "0") {
            this.opportunityTypeId = successClass;
            this.opportunityTypeIdError = false;
            if (this.actionType == 'add' || this.existingHalopsaDealTicketTypeId == this.deal.haloPSATickettypeId) {
              this.createdForPipelineStageIdError = false;
              this.pipelineStageIdError = false;
            } else {
              this.createdForPipelineStageIdError = true;
              this.pipelineStageIdError = true;
            }
            this.createdForPipelineIdError = false;
          } else {
            this.opportunityTypeId = errorClass;
            this.opportunityTypeIdError = true;
            this.createdForPipelineStageIdError = true;
            this.pipelineStageIdError = false;
          }
        }
      } else {
        this.opportunityTypeId = successClass;
        this.opportunityTypeIdError = false;
      }
    }
    this.submitButtonStatus();
  }


  submitButtonStatus() {
    let self = this;
    if (this.showCustomForm) {
      this.opportunityAmountError = false;
      this.titleError = false;
      this.estimatedCloseDateError = false;
      this.dealTypeError = false;
      this.properties.length = 0;
      this.propertiesQuestions.length = 0;
    }

    if (!this.showCreatedByPipelineAndStage && !this.createdForPipelineStageIdError) {
      this.pipelineIdError = false;
      this.pipelineStageIdError = false;
    }
    if (this.deal.haloPSATickettypeId > 0 && this.activeCRMDetails.createdForActiveCRMType == 'HALOPSA') {
      this.opportunityTypeIdError = false;
      if (this.actionType == 'add') {
        this.pipelineStageIdError = false;
        this.createdForPipelineStageIdError = false;
      }
    } else {
      this.opportunityTypeIdError = false;
    }

    if (!this.opportunityAmountError && !this.estimatedCloseDateError
      && !this.titleError && !this.dealTypeError && !this.createdForCompanyIdError 
      && !this.pipelineStageIdError && !this.createdForPipelineStageIdError && !this.opportunityTypeIdError) {
      let qCount = 0;
      let cCount = 0;
      this.propertiesQuestions.forEach(propery => {
        if (propery.error) {
          this.isDealRegistrationFormValid = false;
          qCount++;
        }
      })
      this.propertiesComments.forEach(propery => {
        if (propery.error) {
          this.isDealRegistrationFormValid = false;
          cCount++;
        }
      })
      if (qCount == 0 && cCount == 0)
        this.isDealRegistrationFormValid = true;
      else
        this.isDealRegistrationFormValid = false;
    } else {

      this.isDealRegistrationFormValid = false;
    }
  }

  setFieldErrorStates() {
    /****************close Date *******************/
    if (this.deal.closeDateString != null && this.deal.closeDateString.length > 0)
      this.estimatedCloseDateError = false
    else
      this.estimatedCloseDateError = true;
    /**************** Title *******************/
    if (this.deal.title != null && this.deal.title.length > 0)
      this.titleError = false
    else
      this.titleError = true;
    /**************** Amount *******************/
    if (this.deal.amount != null
      && parseFloat(this.deal.amount) > 0)
      this.opportunityAmountError = false
    else
      this.opportunityAmountError = true;
    /**************** DealType *******************/
    if (this.deal.dealType != null && this.deal.dealType.length > 0
      && this.deal.dealType != 'Select Dealtype')
      this.dealTypeError = false
    else
      this.dealTypeError = true;
    /**************** Created For Company *******************/
    if (this.deal.createdForCompanyId != null && this.deal.createdForCompanyId > 0)
      this.createdForCompanyIdError = false
    else
      this.createdForCompanyIdError = true;
     /**************** Pipeline Id *******************/
     if (this.deal.createdByPipelineId != null && this.deal.createdByPipelineId > 0)
      this.pipelineIdError = false
    else
      this.pipelineIdError = true;
    /**************** Pipeline Id *******************/
    if (this.deal.createdForPipelineId != null && this.deal.createdForPipelineId > 0)
      this.createdForPipelineIdError = false
    else
      this.createdForPipelineIdError = true;
    /**************** Pipeline Stage Id *******************/
    if (this.deal.createdByPipelineStageId != null && this.deal.createdByPipelineStageId > 0)
      this.pipelineStageIdError = false
    else
      this.pipelineStageIdError = true;
     /**************** Pipeline Stage Id *******************/
     if (this.deal.createdForPipelineStageId != null && this.deal.createdForPipelineStageId > 0)
     this.createdForPipelineStageIdError = false


    this.submitButtonStatus();
  }

  setSfFormFieldValues() {
    if (this.sfDealComponent.form !== undefined || this.sfDealComponent.form !== null) {
      let formLabelDTOs = this.sfDealComponent.form.formLabelDTOs;
      if (formLabelDTOs.length !== 0) {
        let sfCfDataList = [];
        for (let formLabel of formLabelDTOs) {
          if (this.titleFields.includes(formLabel.labelId)) {
            this.lead.title = formLabel.value;
          } else if (this.lastNameFields.includes(formLabel.labelId)) {
            this.lead.lastName = formLabel.value;
          } else if (this.firstNameFields.includes(formLabel.labelId)) {
            this.lead.firstName = formLabel.value;
          } else if (this.emailFields.includes(formLabel.labelId)) {
            this.lead.email = formLabel.value;
          } else if (this.companyFields.includes(formLabel.labelId)) {
            this.lead.company = formLabel.value;
          } else if (this.phoneFields.includes(formLabel.labelId)) {
            this.lead.phone = formLabel.value;
          } else if (this.websiteFields.includes(formLabel.labelId)) {
            this.lead.website = formLabel.value;
          } else if (this.streetFields.includes(formLabel.labelId)) {
            this.lead.street = formLabel.value;
          } else if (this.cityFields.includes(formLabel.labelId)) {
            this.lead.city = formLabel.value;
          } else if (this.stateFields.includes(formLabel.labelId)) {
            this.lead.state = formLabel.value;
          } else if (this.postalCodeFields.includes(formLabel.labelId)) {
            this.lead.postalCode = formLabel.value;
          } else if (this.countryFields.includes(formLabel.labelId)) {
            this.lead.country = formLabel.value;
          } else if (this.industryFields.includes(formLabel.labelId)) {
            this.lead.industry = formLabel.value;
          } else if (this.regionFields.includes(formLabel.labelId)) {
            this.lead.region = formLabel.value;
          }
          let sfCfData = new SfCustomFieldsDataDTO();
          sfCfData.sfCfLabelId = formLabel.labelId;
          if (formLabel.labelType === 'multiselect') {
            if (formLabel.value != undefined && formLabel.value.length > 0) {
              for (let option of formLabel.value) {
                sfCfData.value = sfCfData.value + option.name + ";";
              }
              sfCfData.value = sfCfData.value.substring(0, sfCfData.value.length - 1);
            }

          } else if (formLabel.labelType === 'datetime') {
            if (formLabel.value != undefined && formLabel.value.length > 0) {
              sfCfData.value = formLabel.value;
              sfCfData.type = formLabel.labelType;
              const event = new Date(formLabel.value);
              sfCfData.dateTimeIsoValue = event.toISOString();
            }
          }
          else {
            sfCfData.value = formLabel.value;
          }
          sfCfDataList.push(sfCfData);
        }
        this.lead.sfCustomFieldsDataDto = sfCfDataList;
      }
    }
  }

  getActiveCRMDetails() {
    this.ngxloading = true;
    this.integrationService.getActiveCRMDetails(this.lead.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        response => {
          this.ngxloading = false;
          if (response.statusCode == 200) {
            this.activeCRMDetails = response.data;
            if("SALESFORCE" === this.activeCRMDetails.createdForActiveCRMType){
              this.showCustomForm = true;
            } else{
              this.showDefaultForm = true;
            }
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
          this.showCustomForm = false;
          this.showDefaultForm = false;
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
  toggleDealpipepline(event: Event) {
    event.preventDefault();
    this.isCollapsed = !this.isCollapsed;
  }
  toggleCollapsecontact(event: Event) {
    event.preventDefault();
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleCollapsecampaignInfo(event: Event) {
    event.preventDefault();
    this.isCollapsed2 = !this.isCollapsed2;
  }
  toggleCollapsepipepline(event: Event) {
    event.preventDefault();
    this.isCollapsed3 = !this.isCollapsed3;
  }

  /********XNFR-426********/
  // showComments(lead: any) {
  //   this.selectedLead = lead;
  //   this.isCommentSection = !this.isCommentSection;
  //   this.editTextArea = !this.editTextArea;
  // }

  // addCommentModalClose(event: any) {
  //   this.selectedLead.unReadChatCount = 0;
  //   // console.log(this.selectedLead.unReadChatCount)
  //   this.isCommentSection = !this.isCommentSection;
  //   this.editTextArea = !this.editTextArea;
  // }

  halopsaTicketTypeId: number = 0;
  halopsaTicketTypes: any;
  getHaloPSATicketTypes(companyId: number, integrationType: string) {
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

  getLeadCustomFieldsByVendorCompany(vendorCompanyId: number) {
    this.ngxloading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.getLeadCustomFieldsByVendorCompany(vendorCompanyId).subscribe(data => {
      if (data.statusCode == 200) {
        this.leadCustomFields = data.data;
      }
    });
  }

  closeLeadModal() {
    this.notifyOtherComponent.emit();
    this.notifyManageLeadsComponentToHidePopup.emit();
    if (this.actionType === "edit") {
    }
    this.notifyClose.emit();
    $('#leadFormModel').modal('hide');
  }

  validateAllFields() {

    this.isValid = true;
    this.isValidPipeplineAndStage = true;
    if (this.lead.campaignId <= 0 && (this.lead.createdForCompanyId == undefined || this.lead.createdForCompanyId <= 0)) {
      this.isValid = false;
    } else if ((this.lead.createdForPipelineId == undefined || this.lead.createdForPipelineId <= 0) && (this.activeCRMDetails.showLeadPipeline)) {
      this.isValid = false;
      this.isValidPipeplineAndStage = false;
    } else if ((this.lead.createdForPipelineStageId == undefined || this.lead.createdForPipelineStageId <= 0) && (this.activeCRMDetails.showLeadPipelineStage)) {
      this.isValid = false;
      this.isValidPipeplineAndStage = false;
    } else if (this.showCreatedByPipelineAndStage && (this.lead.createdByPipelineId == undefined || this.lead.createdByPipelineId <= 0)) {
      this.isValid = false;
      this.isValidPipeplineAndStage = false;
    } else if (this.showCreatedByPipelineAndStage && (this.lead.createdByPipelineStageId == undefined || this.lead.createdByPipelineStageId <= 0)) {
      this.isValid = false;
      this.isValidPipeplineAndStage = false;
    } else if (this.lead.lastName == undefined || this.lead.lastName == "") {
      this.isValid = false;
    } else if (this.lead.company == undefined || this.lead.company == "") {
      this.isValid = false;
    } else if (this.lead.email == undefined || this.lead.email == "") {
      this.isValid = false;
    } else if (this.lead.website != undefined && this.lead.website.trim() != "" && !this.regularExpressions.URL_PATTERN.test(this.lead.website)) {
      this.isValid = false;
    }

  }


  validateEmailId() {
    if (this.lead.email != undefined && this.lead.email.trim() != "" && !this.regularExpressions.EMAIL_ID_PATTERN.test(this.lead.email)) {
      this.inValidEmailId = true;
      this.isValid = false;
      this.errorMessage = "Please enter a valid email address";
    } else {
      this.inValidEmailId = false;
      this.isValid = true;
      this.validateAllFields();
    }
  }

  
copyReferenceId(inputElement: any) {
  inputElement.select();
  $('#copy-reference-id').hide();
  document.execCommand('copy');
  inputElement.setSelectionRange(0, 0);
  $('#copy-reference-id').show(500);
  this.isCopiedToClipboard = true;
}

}
