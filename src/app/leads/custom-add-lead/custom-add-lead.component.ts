import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { User } from 'app/core/models/user';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UserService } from 'app/core/services/user.service';
import { UtilService } from 'app/core/services/util.service';
import { Pipeline } from 'app/dashboard/models/pipeline';
import { PipelineStage } from 'app/dashboard/models/pipeline-stage';
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
import { CommentDealAndLeadDto } from 'app/deals/models/comment-deal-and-lead-dto';
import { EnvService } from 'app/env.service';
import { Http } from '@angular/http';
declare var $: any;
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
  opportunityAmount: string;
  opportunityAmountError: boolean = true;
  estimatedCloseDate: string;
  estimatedCloseDateError: boolean = true;
  dealType: string;
  createdForCompanyId: string;
  createdForCompanyIdError: boolean = true;
  pipelineId: string;
  pipelineIdError: boolean = true;
  pipelineStageId: string;
  pipelineStageIdError: boolean = true;
  isLeadRegistrationFormValid: boolean = true;
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

  lastNameDivClass: string;
  companyDivClass: string;
  emailDivClass: string;
  emailError: boolean = true;
  companyError: boolean = true;
  lastNameError: boolean = true;
  /***XNFR-623***/
  commentsCustomResponse:CustomResponse = new CustomResponse();
  commentsLoader = true;
  commentDealAndLeadDto:CommentDealAndLeadDto = new CommentDealAndLeadDto();
  readonly LEAD_CONSTANTS = LEAD_CONSTANTS;
  isCommentAndHistoryCollapsed = false;
  editTextArea = false;
  vendorListLoader:HttpRequestLoader = new HttpRequestLoader();
  /***XNFR-623***/
  isLatestPipelineApiEnabled = true;
  pipelineLoader:HttpRequestLoader = new HttpRequestLoader();
  stagesLoader:HttpRequestLoader = new HttpRequestLoader();

  constructor(private logger: XtremandLogger, public messageProperties: Properties, public authenticationService: AuthenticationService, private dealsService: DealsService,
    public dealRegistrationService: DealRegistrationService, public referenceService: ReferenceService,
    public utilService: UtilService, private leadsService: LeadsService, public regularExpressions: RegularExpressions, public userService: UserService,
     public countryNames: CountryNames, private integrationService: IntegrationService,public envService:EnvService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isMarketingCompany = this.authenticationService.module.isMarketingCompany;
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    }
    this.isLatestPipelineApiEnabled = this.envService.loadLatestPipeLineApi;
  }

  ngOnInit() {
    this.getDefaultLeadCustomFields();
    this.resetLeadData();
    if (this.actionType === "view") {
      this.loadDataForViewLead();
    } else if (this.actionType === "edit") {
      this.loadDataForEditLead();
    } else if (this.actionType === "add") {
      this.loadDataForAddLead();
    }
    if (this.preview || this.edit || this.vanityLoginDto.vanityUrlFilter || (this.dealToLead != undefined && this.dealToLead.dealActionType === 'edit')) {
      this.disableCreatedFor = true;
    }
    this.getVendorList();
    this.loadComments();
  }


  private resetLeadData() {
    this.errorMessage = "";
    this.lead.createdForCompanyId = 0;
    this.lead.pipelineId = 0;
    this.lead.pipelineStageId = 0;
    this.lead.createdForPipelineId = 0;
    this.lead.createdByPipelineId = 0;
    this.lead.createdForPipelineStageId = 0;
    this.lead.createdByPipelineStageId = 0;
    this.lead.halopsaTicketTypeId = 0;
  }

  private loadDataForEditLead() {
    this.edit = true;
    this.leadFormTitle = "Edit Lead";
    if (this.leadId > 0) {
      this.getLead(this.leadId);
    }
  }

  private loadDataForViewLead() {
    this.preview = true;
    this.leadFormTitle = "View Lead";
    if (this.leadId > 0) {
      this.getLead(this.leadId);
    }
    if (this.dealToLead != undefined && this.dealToLead.callingComponent === "DEAL") {
      $('#leadFormModel').modal('show');
      this.showAttachLeadPopUp = true;
    }
  }

  private loadDataForAddLead() {
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
      this.getCampaignInfoForAddLead();
    }
  }

  private getCampaignInfoForAddLead() {
    if (this.campaignId > 0) {
      this.lead.campaignId = this.campaignId;
      this.lead.campaignName = this.campaignName;
      this.lead.associatedUserId = this.selectedContact.userId;
      this.getCreatedForCompanyIdByCampaignId();
      this.getContactInfo();
    }
  }

   /***XNFR-623***/
   private loadComments() {
    if (this.preview) {
      this.commentsLoader = true;
      this.commentsCustomResponse = new CustomResponse();
      this.leadsService.findLeadAndLeadInfoForComments(this.leadId).
        subscribe(
          response => {
            let statusCode = response.statusCode;
            if (statusCode == 200) {
              let data = response.data;
              this.commentDealAndLeadDto = data;
              this.commentsLoader = false;
            } else {
              this.commentsLoader = false;
              this.commentsCustomResponse = new CustomResponse('ERROR', "Unable to load comments for this lead.",true);
            }
          }, error => {
            this.commentsLoader = false;
            this.commentsCustomResponse = new CustomResponse('ERROR', "Unable to load comments.Please contact admin.",true);
          }
        );
    }
  }

  /***XNFR-623***/
  toggleCommentsHistory(event:any){
    event.preventDefault();
    this.isCommentAndHistoryCollapsed = !this.isCommentAndHistoryCollapsed;
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
          //this.setFieldErrorStates();
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
    this.isLoading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    let self = this;
    if (this.lead.campaignId > 0) {
      this.leadsService.getCampaignLeadPipeline(this.lead.campaignId, this.loggedInUserId)
        .subscribe(
          data => {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.isLoading = false;
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
              self.hasCampaignPipeline = false;
            }
          },
          error => {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.isLoading = false;
            this.httpRequestLoader.isServerError = true;
          },
          () => { }
        );
    }
  }

  onChangeCreatedFor() {
    this.resetPipeLineAndStageData();
    if (this.lead.createdForCompanyId > 0) {
      let vendorCompany;
      vendorCompany = this.vendorList.find(vendor => vendor.companyId == this.lead.createdForCompanyId);
      this.vendorCompanyName = vendorCompany.companyName + "'s";
      this.getLeadCustomFieldsByVendorCompany(this.lead.createdForCompanyId);
      this.getActiveCRMDetails();
    } else {
      this.resetPipelines();
      this.resetLeadPipeLineVariables();
      this.activeCRMDetails.hasCreatedForPipeline = false;
      this.activeCRMDetails.hasCreatedByPipeline = false;
      this.showTicketTypesDropdown = false;
      this.resetLeadDetails();
      this.getDefaultLeadCustomFields();
      this.vendorCompanyName = '';
    }
  }

  private resetPipeLineAndStageData() {
    this.lead.createdForPipelineId = 0;
    this.lead.createdByPipelineId = 0;
    this.lead.createdByPipelineStageId = 0;
    this.lead.createdForPipelineStageId = 0;
    this.lead.halopsaTicketTypeId = 0;
    this.createdForStages = [];
    this.createdByStages = [];
    this.createdForPipelines = [];
    this.createdByPipelines = [];
  }

  private resetLeadPipeLineVariables() {
    this.lead.createdForPipelineId = 0;
    this.lead.createdByPipelineId = 0;
    this.lead.createdForPipelineStageId = 0;
    this.lead.createdByPipelineStageId = 0;
    this.lead.halopsaTicketTypeId = 0;
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

  /****Updated On 27/07/2024 */
  getStages() {
    if(this.isLatestPipelineApiEnabled){
      this.createdForStages = [];
      let createdForPipeLineId = this.lead.createdForPipelineId;
      let createdByPipelineId = this.lead.createdByPipelineId;
      if(createdForPipeLineId!=undefined && createdForPipeLineId>0){
        this.referenceService.loading(this.stagesLoader,true);
        this.leadsService.findPipelineStagesByPipelineId(createdForPipeLineId).subscribe(
          response=>{
            let data = response.data;
            this.createdForStages = data.list;
            this.referenceService.loading(this.stagesLoader,false);
          },error=>{
            this.referenceService.loading(this.stagesLoader,false);
            this.referenceService.showServerError(this.stagesLoader);
          })
      }

    }else{
      this.addCreatedForOrCreatedByStages();
    }

  }
  private addCreatedForOrCreatedByStages() {
    let self = this;
    if (this.lead.createdForPipelineId > 0) {
      this.createdForPipelines.forEach(p => {
        if (p.id == this.lead.createdForPipelineId) {
          self.createdForStages = p.stages;
        }
      });
    } else {
      self.createdForStages = [];
    }
    if (this.lead.createdByPipelineId > 0) {
      this.createdByPipelines.forEach(p => {
        if (p.id == this.lead.createdByPipelineId) {
          self.createdByStages = p.stages;
        }
      });
    } else {
      self.createdByStages = [];
    }
  }

  getVendorList() {
    this.referenceService.loading(this.vendorListLoader, true);
    this.leadsService.getVendorList(this.loggedInUserId)
      .subscribe(
        data => {
          if (data.statusCode == 200) {
            this.vendorList = data.data;
          }
          this.referenceService.loading(this.vendorListLoader, false);
        },
        error => {
          this.referenceService.loading(this.vendorListLoader, false);
          this.referenceService.showServerError(this.vendorListLoader);
        },
        () => { }
      );
  }


  getLead(leadId: number) {
    let self = this;
    self.isLoading = true;
    self.referenceService.loading(self.httpRequestLoader, true);
    self.leadsService.getLead(leadId, self.loggedInUserId)
      .subscribe(
        data => {
          self.referenceService.loading(self.httpRequestLoader, false);
          self.isLoading = false;
          self.referenceService.goToTop();
          if (data.statusCode == 200) {
            self.lead = data.data;
            if (!self.isVendorVersion) {
              self.getLeadCustomFieldsByVendorCompany(self.lead.createdForCompanyId);
            } else {
              self.getDefaultLeadCustomFields();
            }
            if (self.lead.industry == null || self.lead.industry == undefined || self.lead.industry == '') {
              self.lead.industry = self.industries[0];
            }
            self.existingHalopsaLeadTicketTypeId = self.lead.halopsaTicketTypeId;
            if (self.lead.createdForCompanyId > 0) {
            }
            self.getActiveCRMDetails();
          }
        },
        error => {
          self.httpRequestLoader.isServerError = true;
          self.referenceService.loading(this.httpRequestLoader, false);
          self.isLoading = false;
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
      this.isLeadRegistrationFormValid = false;
    }
  }

  resetCreatedForPipelineStages() {
    if (!this.preview && !this.hasCampaignPipeline && !this.activeCRMDetails.hasLeadPipeline) {
      this.lead.createdForPipelineStageId = 0;
      this.getStages();
      this.createdForPipelineStageId = "form-group has-error has-feedback";
      this.createdForPipelineStageIdError = true;
      this.isLeadRegistrationFormValid = false;
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

    if (!this.activeCRMDetails.showLeadPipeline && !this.isOrgAdmin && !this.isMarketingCompany) {
      this.lead.createdForPipelineId = this.activeCRMDetails.leadPipelineId;
    }
    if (!this.activeCRMDetails.showLeadPipelineStage && !this.isOrgAdmin && !this.isMarketingCompany) {
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
    var errorClass = "form-group has-error has-feedback";
    var successClass = "form-group has-success has-feedback";
    if (isFormElement && fieldId.key != null && fieldId.key != undefined) {
      this.addErrorOrSuccessClass(fieldId, successClass, errorClass);
    } else {
      let fieldValue = $.trim($('#' + fieldId).val());

      this.validateLastName(fieldId, successClass, errorClass);

      this.validateCompany(fieldId, successClass, errorClass);

      this.validateEmail(fieldId, successClass, errorClass);

      this.validateCreatedForCompanyId(fieldId, fieldValue, successClass, errorClass);

      this.validateCreatedByPipelineId(fieldId, successClass, errorClass);

      this.validateCreatedForPipelineId(fieldId, successClass, errorClass);

      this.validateCreatedByPipelineStageId(fieldId, successClass, errorClass);

      this.validateCreatedForPipelineStageId(fieldId, successClass, errorClass);

      this.checkOpportunityTypeIdAndError(fieldId, fieldValue, successClass, errorClass);
    }
    this.submitButtonStatus();
  }


  private checkOpportunityTypeIdAndError(fieldId: any, fieldValue: any, successClass: string, errorClass: string) {
    if (this.activeCRMDetails != undefined && this.activeCRMDetails.showHaloPSAOpportunityTypesDropdown) {
      this.validateOpportunityTypeId(fieldId, fieldValue, successClass, errorClass);
    } else {
      this.opportunityTypeId = successClass;
      this.opportunityTypeIdError = false;
    }
  }

  private validateOpportunityTypeId(fieldId: any, fieldValue: any, successClass: string, errorClass: string) {
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
  }

  private validateCreatedForPipelineStageId(fieldId: any, successClass: string, errorClass: string) {
    if (fieldId == "createdForPipelineStageId") {
      let createdForPipelineStageId = this.lead.createdForPipelineStageId;
      if (createdForPipelineStageId > 0) {
        this.createdForPipelineStageId = successClass;
        this.createdForPipelineStageIdError = false;
      } else {
        this.createdForPipelineStageId = errorClass;
        this.createdForPipelineStageIdError = true;
      }
    }
  }

  private validateCreatedByPipelineStageId(fieldId: any, successClass: string, errorClass: string) {
    if (fieldId == "createdByPipelineStageId") {
      let createdByPipelineStageId = this.lead.createdByPipelineStageId;
      if (createdByPipelineStageId > 0) {
        this.pipelineStageId = successClass;
        this.pipelineStageIdError = false;
      } else {
        this.pipelineStageId = errorClass;
        this.pipelineStageIdError = true;
      }
    }
  }

  private validateCreatedForPipelineId(fieldId: any, successClass: string, errorClass: string) {
    if (fieldId == "createdForPipelineId") {
      let createdForPipelineId = this.lead.createdForPipelineId;
      if (createdForPipelineId > 0) {
        this.createdForPipelineId = successClass;
        this.createdForPipelineIdError = false;
      } else {
        this.createdForPipelineId = errorClass;
        this.createdForPipelineIdError = true;
        this.createdForPipelineStageId = errorClass;
        this.createdForPipelineStageIdError = true;
      }
    }
  }

  private validateCreatedByPipelineId(fieldId: any, successClass: string, errorClass: string) {
    if (fieldId == "createdByPipelineId") {
      let createdByPipelineId = this.lead.createdByPipelineId;
      if (createdByPipelineId > 0) {
        this.pipelineId = successClass;
        this.pipelineIdError = false;
      } else {
        this.pipelineId = errorClass;
        this.pipelineIdError = true;
        this.pipelineStageId = errorClass;
        this.pipelineStageIdError = true;
      }
    }
  }

  private validateCreatedForCompanyId(fieldId: any, fieldValue: any, successClass: string, errorClass: string) {
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
  }

  private validateEmail(fieldId: any, successClass: string, errorClass: string) {
    if (fieldId == "email") {
      let email = this.lead.email;
      if (email.length > 0 && email != '' && this.regularExpressions.EMAIL_ID_PATTERN.test(email)) {
        this.emailDivClass = successClass;
        this.emailError = false;
        this.isValid = true;
        this.inValidEmailId = false;
      } else {
        this.emailDivClass = errorClass;
        this.emailError = true;
        this.inValidEmailId = true;
        this.isValid = false;
        this.errorMessage = "Please enter a valid email address";
      }
    }
  }

  private validateCompany(fieldId: any, successClass: string, errorClass: string) {
    if (fieldId == "company") {
      let company = this.lead.company;
      if (company.length > 0 && company != '') {
        this.companyDivClass = successClass;
        this.companyError = false;
      } else {
        this.companyDivClass = errorClass;
        this.companyError = true;
      }
    }
  }

  private validateLastName(fieldId: any, successClass: string, errorClass: string) {
    if (fieldId == "lastName") {
      let lastName = this.lead.lastName;
      if (lastName.length > 0 && lastName != '') {
        this.lastNameDivClass = successClass;
        this.lastNameError = false;
      } else {
        this.lastNameDivClass = errorClass;
        this.lastNameError = true;
      }
    }
  }

  private addErrorOrSuccessClass(fieldId: any, successClass: string, errorClass: string) {
    let fieldValue = $.trim($('#question_' + fieldId.id).val());
    if (fieldValue.length > 0) {
      fieldId.class = successClass;
      fieldId.error = false;
    } else {
      fieldId.class = errorClass;
      fieldId.error = true;
    }
  }

  submitButtonStatus() {
    let self = this;
    if (this.showCustomForm) {
      this.lastNameError = false;
      this.emailError = false;
      this.companyError = false;
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

    if (!this.lastNameError && !this.companyError && !this.emailError && !this.createdForCompanyIdError && !this.createdForPipelineIdError
      && !this.pipelineStageIdError && !this.createdForPipelineStageIdError && !this.opportunityTypeIdError) {
      let qCount = 0;
      let cCount = 0;
      this.propertiesQuestions.forEach(propery => {
        if (propery.error) {
          this.isLeadRegistrationFormValid = false;
          qCount++;
        }
      })
      this.propertiesComments.forEach(propery => {
        if (propery.error) {
          this.isLeadRegistrationFormValid = false;
          cCount++;
        }
      })
      if (qCount == 0 && cCount == 0)
        this.isLeadRegistrationFormValid = true;
      else
        this.isLeadRegistrationFormValid = false;
    } else {

      this.isLeadRegistrationFormValid = false;
    }
  }

  setFieldErrorStates() {
    if (this.lead.lastName != null && this.lead.lastName !='')
      this.lastNameError = false;
    else
      this.lastNameError = true;

    if (this.lead.email != null && this.lead.email !='')
      this.emailError = false;
    else
      this.emailError = true;

    if (this.lead.company != null && this.lead.company !='')
      this.companyError = false;
    else
      this.companyError = true;

    if (this.lead.createdForCompanyId != null && this.lead.createdForCompanyId > 0)
      this.createdForCompanyIdError = false
    else
      this.createdForCompanyIdError = true;

    if (this.lead.createdByPipelineId != null && this.lead.createdByPipelineId > 0)
      this.pipelineIdError = false
    else
      this.pipelineIdError = true;

    if ((this.lead.createdForPipelineId != null && this.lead.createdForPipelineId > 0) || (!this.activeCRMDetails.showLeadPipeline && "SALESFORCE" === this.activeCRMDetails.createdForActiveCRMType))
      this.createdForPipelineIdError = false
    else
      this.createdForPipelineIdError = true;

    if (this.lead.createdByPipelineStageId != null && this.lead.createdByPipelineStageId > 0)
      this.pipelineStageIdError = false
    else
      this.pipelineStageIdError = true;

    if ((this.lead.createdForPipelineStageId != null && this.lead.createdForPipelineStageId > 0) || (!this.activeCRMDetails.showLeadPipelineStage && "SALESFORCE" === this.activeCRMDetails.createdForActiveCRMType))
      this.createdForPipelineStageIdError = false
    else
      this.createdForPipelineStageIdError = true;
    
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
    this.isLoading = true;
    this.showCustomForm = false;
    this.showDefaultForm = false;
    this.integrationService.getActiveCRMDetails(this.lead.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        response => {
          if(this.isLatestPipelineApiEnabled){
            this.findActiveCRMDetailsAndCustomFormVariable(response);
          }else{
            this.ngxloading = false;
            this.isLoading = false;
            this.loadAllApis(response);
          }
        },
        error => {
          this.ngxloading = false;
          this.isLoading = false;
          this.showCustomForm = false;
          this.showDefaultForm = false;
        },
        () => {
          if(this.isLatestPipelineApiEnabled){
            this.findPipeLines();
          }else{
            this.setFieldErrorStates();
          }
        });
  }
  /***Added On 27/07/2024 By Sravan */
  private findPipeLines() {
    let activeCRMDetails = this.activeCRMDetails;
    if (activeCRMDetails != undefined) {
      this.createdForPipelines = [];
      this.createdForPipelineId = 0;
      this.createdForPipelineStageId = 0;
      let showLeadPipeline = activeCRMDetails.showLeadPipeline;
      let showLeadPipelineStage = activeCRMDetails.showLeadPipelineStage;
      if (showLeadPipeline) {
        this.referenceService.loading(this.pipelineLoader, true);
        this.leadsService.findLeadPipeLines(this.lead.createdForCompanyId).subscribe(
          response => {
            let data = response.data;
            let totalRecords = data.totalRecords;
            this.createdForPipelines = data.list;
            this.referenceService.loading(this.pipelineLoader, false);
          }, error => {
            this.referenceService.loading(this.pipelineLoader, false);
            this.referenceService.showServerError(this.pipelineLoader);
          });
      } else {

      }
    }
  }

  private findActiveCRMDetailsAndCustomFormVariable(response: any) {
    if (response.statusCode == 200) {
      this.activeCRMDetails = response.data;
      if ("SALESFORCE" === this.activeCRMDetails.createdForActiveCRMType) {
        this.showCustomForm = true;
      } else {
        this.showDefaultForm = true;
      }
    }
    this.ngxloading = false;
    this.isLoading = false;
  }

  private loadAllApis(response: any) {
    if (response.statusCode == 200) {
      this.activeCRMDetails = response.data;
      if ("SALESFORCE" === this.activeCRMDetails.createdForActiveCRMType) {
        this.showCustomForm = true;
      } else {
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
  }

  getActiveCRMPipeline() {
    let self = this;
    let halopsaTicketTypeId = 0;
    self.isLoading = true;
    self.referenceService.loading(this.httpRequestLoader, true);
    if (self.lead.halopsaTicketTypeId != undefined && self.lead.halopsaTicketTypeId > 0) {
      halopsaTicketTypeId = self.lead.halopsaTicketTypeId;
    }
    this.leadsService.getCRMPipelines(this.lead.createdForCompanyId, this.loggedInUserId, this.activeCRMDetails.type, halopsaTicketTypeId)
      .subscribe(
        data => {
          self.referenceService.loading(this.httpRequestLoader, false);
          self.isLoading = false;
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
          this.httpRequestLoader.isServerError = true;
          self.referenceService.loading(this.httpRequestLoader, false);
          self.isLoading = false;
        },
        () => { }
      );
  }

  getLeadPipelines() {
    let campaignId = 0;
    let self = this;
    let halopsaTicketTypeId = 0;
    self.isLoading = true;
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
          self.isLoading = false;
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
            this.setFieldErrorStates();
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
          self.referenceService.loading(this.httpRequestLoader, false);
          self.isLoading = false;
        },
        () => { }
      );
  }

  getLeadPipelinesForView() {
    let campaignId = 0;
    let self = this;
    self.isLoading = true;
    self.referenceService.loading(this.httpRequestLoader, true);
    if (this.lead.campaignId !== undefined && this.lead.campaignId > 0) {
      campaignId = this.lead.campaignId;
    }
    this.leadsService.getLeadPipelinesForView(this.leadId, this.loggedInUserId)
      .subscribe(
        data => {
          self.referenceService.loading(this.httpRequestLoader, false);
          self.isLoading = false;
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
          self.httpRequestLoader.isServerError = true;
          self.referenceService.loading(this.httpRequestLoader, false);
          self.isLoading = false;
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
        //this.setFieldErrorStates();
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
        //this.setFieldErrorStates();
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

  
  halopsaTicketTypeId: number = 0;
  halopsaTicketTypes: any;
  getHaloPSATicketTypes(companyId: number, integrationType: string) {
    this.ngxloading = true;
    this.integrationService.getHaloPSATicketTypes(companyId, integrationType.toLowerCase(), 'LEAD').subscribe(data => {
      this.ngxloading = false;
      if (data.statusCode == 200) {
        this.halopsaTicketTypes = data.data;
      } else if (data.statusCode == 401) {
        this.customResponse = new CustomResponse('ERROR', data.message, true);
      }
    },
    error => {
      this.customResponse = new CustomResponse('ERROR', 'Oops!Somethig went wrong.Please try after sometime', true);
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
