import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { DealsService } from '../services/deals.service';
import { Pipeline } from 'app/dashboard/models/pipeline';
import { PipelineStage } from 'app/dashboard/models/pipeline-stage';
import { CustomResponse } from '../../common/models/custom-response';
import { DealRegistrationService } from '../../deal-registration/services/deal-registration.service';
import { LeadsService } from '../../leads/services/leads.service';
import { UtilService } from '../../core/services/util.service';
import { Deal } from '../models/deal';
import { Lead } from 'app/leads/models/lead';
import { UserService } from 'app/core/services/user.service';
import { DealQuestions } from 'app/deal-registration/models/deal-questions';
import { DealType } from 'app/deal-registration/models/deal-type';
import { DealDynamicProperties } from 'app/deal-registration/models/deal-dynamic-properties';
import { DealAnswer } from 'app/deal-registration/models/deal-answers';
import { User } from 'app/core/models/user';
import { SfDealComponent } from 'app/deal-registration/sf-deal/sf-deal.component';
import { SfCustomFieldsDataDTO } from 'app/deal-registration/models/sfcustomfieldsdata';
import { Properties } from 'app/common/models/properties';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ConnectwiseProductsDto } from '../models/connectwise-products-dto';
import { ConnectwiseProductsRequestDto } from '../models/connectwise-products-request-dto';
import { ConnectwiseCatalogItemDto } from '../models/connectwise-catalog-item-dto';
import { ConnectwiseOpportunityDto } from '../models/connectwise-opportunity-dto';
import { ConnectwiseStatusDto } from '../models/connectwise-status-dto';
import { DealComments } from 'app/deal-registration/models/deal-comments';
declare var flatpickr: any, $: any, swal: any;


@Component({
  selector: 'app-add-deal',
  templateUrl: './add-deal.component.html',
  styleUrls: ['./add-deal.component.css'],
  providers: [HttpRequestLoader, LeadsService, Properties],
})
export class AddDealComponent implements OnInit {

  @Input() public dealId: any;
  @Input() public leadId: any;
  @Input() public campaignId: any;
  @Input() public campaignName: any;
  @Input() public actionType: string;
  @Input() public isVendorVersion: boolean;
  @Input() public isOrgAdmin: boolean;
  @Input() public hideAttachLeadButton: boolean;
  @Output() notifySubmitSuccess = new EventEmitter();

  preview = false;
  edit = false;
  loggedInUserId: number;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  dealFormTitle = "Deal Details";
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
  showDefaultForm = false;
  showContactInfo = false;

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
  dealToLead: any;
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

  titleFields = ['title','name','symptom'];
  amountFields = ['amount','value','FOppValue'];
  closeDateFields = ['expected_close_date','expectedCloseDate','FOppTargetDate','CloseDate'];
  type = "DEAL";
  showOpportunityTypes:boolean = false;
  opportunityTypeId: any;
  opportunityTypeIdError: boolean = true;
  isCreatedForStageIdDisable: boolean = false;
  isCampaignTicketTypeSelected: boolean = false;

  constructor(private logger: XtremandLogger, public messageProperties: Properties, public authenticationService: AuthenticationService, private dealsService: DealsService,
    public dealRegistrationService: DealRegistrationService, public referenceService: ReferenceService,
    public utilService: UtilService, private leadsService: LeadsService, public userService: UserService, private integrationService: IntegrationService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isMarketingCompany = this.authenticationService.module.isMarketingCompany;
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;

    }
  }

  ngOnInit() {
    this.utilService.getJSONLocation().subscribe(response => console.log(response));
    this.deal.createdForCompanyId = 0;
    this.deal.pipelineId = 0;
    this.deal.pipelineStageId = 0;
    this.deal.createdForPipelineId =0;
    this.deal.createdByPipelineId = 0;
    this.deal.createdForPipelineStageId = 0;
    this.deal.createdByPipelineStageId = 0;
    if (this.actionType === "add") {
      this.showCommentActions = true;
      this.showAttachLeadButton = true;
      if(this.hideAttachLeadButton){
        this.showAttachLeadButton = false;
      }
      this.dealFormTitle = "Add a Deal";
      if (this.leadId > 0) {
        this.getLead(this.leadId);
      } else {
        if (this.vanityLoginDto.vanityUrlFilter) {
          this.setCreatedForCompanyId();
        } else {

        }
      }
    } else if (this.actionType === "view") {
      this.preview = true;
      this.showAttachLeadButton = false;
      this.dealFormTitle = "Deal Details";
      if (this.dealId > 0) {
        this.getDeal(this.dealId);
      }
    } else if (this.actionType === "edit") {
      this.edit = true;
      this.dealFormTitle = "Edit Deal";
      if (this.dealId > 0) {
        this.getDeal(this.dealId);
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
            this.deal.createdForCompanyId = data.data;
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

  getQuestions() {
    this.userService.listFormByCompanyId(this.deal.createdForCompanyId).subscribe(questions => {
      this.questions = questions;
      this.propertiesQuestions = [];
      this.questions.forEach(q => {
        let property = new DealDynamicProperties();
        property.id = q.id;
        property.key = q.question;
        property.propType = 'QUESTION';
        this.propertiesQuestions.push(property);
        if (property.value == null || property.value.length == 0) {
          property.error = true;
          //property.class = this.errorClass;
        }

      });
    },
      error => console.log(error),
      () => {

      });
  }

  getDealTypes() {
    this.dealRegistrationService.listDealTypesByCompanyId(this.deal.createdForCompanyId).subscribe(dealTypes => {
      this.dealTypes = dealTypes.data;
    },
      error => console.log(error),
      () => { });
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
            self.showContactInfo = true;
            self.contact.firstName = self.lead.firstName;
            self.contact.lastName = self.lead.lastName;
            self.contact.emailId = self.lead.email;
            self.deal.associatedLeadId = self.lead.id;
            self.deal.associatedUserId = self.lead.associatedUserId;
            //this.isSalesForceEnabled();
            if (this.deal.createdForCompanyId == 0 && this.deal.createdForCompanyId != undefined) {
              self.deal.createdForCompanyId = self.lead.createdForCompanyId;
              self.createdForCompanyIdError = false;
              self.getActiveCRMDetails();
            }
            if (self.lead.campaignId != null && self.lead.campaignId > 0) {
              self.deal.campaignId = self.lead.campaignId;
              self.deal.campaignName = self.lead.campaignName;
              this.getCampaignDealPipeline();
            } else {
              self.deal.campaignId = 0;
              self.deal.campaignName = '';
              this.hasCampaignPipeline = false;
              //self.getPipelines();
            }
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  getCampaignDealPipeline() {
    let self = this;
    if (this.deal.campaignId > 0) {
      this.dealsService.getCampaignDealPipeline(this.deal.campaignId, this.loggedInUserId)
        .subscribe(
          data => {
            this.referenceService.loading(this.httpRequestLoader, false);
            if (data.statusCode == 200) {
              let campaignDealPipeline = data.data;
              let ticketTypeIdMap = data.map;
              if ((self.deal.createdForPipelineId !== campaignDealPipeline.createdForCampaignPipelines.id && this.actionType == 'add')
                 || (self.deal.createdForPipelineId !== campaignDealPipeline.createdForCampaignPipelines.id && this.actionType == 'edit')
                 || this.actionType == 'view') {
                self.pipelines.push(campaignDealPipeline.createdForCampaignPipelines);
                self.createdForPipelines.push(campaignDealPipeline.createdForCampaignPipelines);
                if (campaignDealPipeline.createdForCampaignPipelines != undefined) {
                  self.deal.createdForPipelineId = campaignDealPipeline.createdForCampaignPipelines.id;
                  self.createdForStages = campaignDealPipeline.createdForCampaignPipelines.stages;
                  self.createdForPipelineIdError = false;
                }
                if (campaignDealPipeline.createdByCampaignPipelines != undefined) {
                  self.deal.createdByPipelineId = campaignDealPipeline.createdByCampaignPipelines.id;
                  self.createdByStages = campaignDealPipeline.createdByCampaignPipelines.stages;
                }     
                self.pipelineIdError = false;
                if (this.actionType == 'add' || this.actionType == 'edit') {
                  if ("HALOPSA" === this.activeCRMDetails.type) {
                    self.deal.haloPSATickettypeId = ticketTypeIdMap.halopsaTicketTypeId;   
                    self.showCustomForm = true;
                    if (this.actionType == 'add') {
                      let createdForPipelineStage = null;
                      let stages = self.stages;
                      createdForPipelineStage = stages.reduce((mindisplayIndexStage, currentStage) =>
                        mindisplayIndexStage.displayIndex < currentStage.displayIndex ? mindisplayIndexStage : currentStage
                      );
                      self.deal.createdForPipelineStageId = createdForPipelineStage.id;
                      self.createdForPipelineStageIdError = false;
                      self.isCreatedForStageIdDisable = true;
                      self.submitButtonStatus();
                    }
                    self.isCampaignTicketTypeSelected = true;
                  } else {
                    self.resetStages();
                  }
                }
              } else if (self.deal.haloPSATickettypeId > 0 && this.actionType === 'edit') {
                self.isCampaignTicketTypeSelected = true;
              }
              self.hasCampaignPipeline = true;
            } else if (data.statusCode == 404) {
              self.deal.pipelineId = 0;
              self.deal.createdForPipelineId = 0;
              self.stages = [];
              self.createdForStages = [];
              self.getActiveCRMPipelines();
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

  getDeal(dealId: number) {
    let self = this;
    this.isLoading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dealsService.getDeal(dealId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          this.isLoading = false;
          this.referenceService.goToTop();
          if (data.statusCode == 200) {
            self.deal = data.data;
            if (self.deal.createdForCompanyId === self.deal.createdByCompanyId) {
              self.ownDeal = true;
            }
            if (self.edit && (!self.isVendorVersion || self.ownDeal)) {
              self.showCommentActions = true;
            }
            if (self.deal.associatedContact != undefined) {
              self.showContactInfo = true;
              self.showAttachLeadButton = false;
              self.contact = self.deal.associatedContact;
            }
            else if (this.actionType !== 'view') {
              self.showAttachLeadButton = true;
            }
            self.setCloseDate(data);
            if (self.deal.createdForCompanyId > 0) {
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

  setQuestions() {
    if (this.questions.length > 0) {
      this.questions.forEach(q => {
        let property = new DealDynamicProperties();
        property.id = q.id;
        property.key = q.question;
        property.propType = 'QUESTION';
        this.propertiesQuestions.push(property);
        if (property.value == null || property.value.length == 0) {
          property.error = true;
          property.class = this.errorClass;
        }

      });
      console.log(this.propertiesQuestions)
    }
  }

  setProperties() {
    if (this.deal.properties != undefined && this.deal.properties.length > 0) {
      this.properties = this.deal.properties;
      let i = 1;
      this.propertiesQuestions = this.properties.filter(p => p.propType == 'QUESTION')
      this.propertiesComments = this.properties.filter(p => p.propType == 'PROPERTY')
      this.propertiesComments.forEach(property => {
        property.divId = "property-" + i++;
        property.isSaved = true;
      });
    } else {
      this.setQuestions();
    }
  }

  setCloseDate(data: any) {
    let date: any;
    if (this.deal.closeDate != null) {
      date = this.getFormatedDate(new Date(this.deal.closeDate));
    } else {
      date = this.getFormatedDate(new Date());
    }
    //this.deal.closeDate = date;
    this.deal.closeDateString = date;
  }

  getFormatedDate(date: Date) {
    //return string
    var returnDate = "";
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //because January is 0!
    var yyyy = date.getFullYear();
    returnDate += `${yyyy}-`;
    if (mm < 10) {
      returnDate += `0${mm}-`;
    } else {
      returnDate += `${mm}-`;
    }
    //Interpolation date
    if (dd < 10) {
      returnDate += `0${dd}`;
    } else {
      returnDate += `${dd}`;
    }

    return returnDate;
  }

  isSalesForceEnabled() {
    this.showCustomForm = false;
    this.dealsService.isSalesForceEnabled(this.deal.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.showCustomForm = response.data;
          }
        },
        error => {
          console.log(error);
        },
        () => {
          this.setFieldErrorStates();
          if (!this.showCustomForm) {
            this.showDefaultForm = true;
            this.hasSfPipeline = false;
            if (this.edit || this.preview) {
              this.setProperties();
              if (this.deal.campaignId > 0) {
                this.getCampaignDealPipeline();
              } else {
                this.getPipelines();
              }
            } else {
              this.getQuestions();
              this.resetPipelines();
            }
            this.getDealTypes();
          } else {
            this.getSalesforcePipeline();
          }
        });
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

  resetPipelines() {
    this.deal.pipelineId = 0;
    this.deal.pipelineStageId = 0;
    this.getPipelines();
    this.hasSfPipeline = false;
    this.activeCRMDetails.hasDealPipeline = false;
  }

  onChangeCreatedFor() {
    this.holdCreatedForCompanyId = this.deal.createdForCompanyId;
    if (this.deal.createdForCompanyId > 0) {
      this.getActiveCRMDetails();
    } else {
      this.deal.pipelineId = 0;
      this.pipelines = [];
      this.activeCRMDetails.hasDealPipeline = false;
      this.stages = [];
      this.showDefaultForm = false;
      this.propertiesQuestions = [];
      this.hasCampaignPipeline = false;
    }
  }

  getSalesforcePipeline() {
    let self = this;
    this.dealsService.getSalesforcePipeline(this.deal.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            let salesforcePipeline = data.data;
            self.deal.pipelineId = salesforcePipeline.id;
            self.pipelineIdError = false;
            self.stages = salesforcePipeline.stages;
            self.hasSfPipeline = true;
          } else if (data.statusCode == 404) {
            self.deal.pipelineId = 0;
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

  getPipelines() {
    let self = this;
    if (this.deal.createdForCompanyId > 0) {
      this.dealsService.getPipelines(this.deal.createdForCompanyId, this.loggedInUserId)
        .subscribe(
          data => {
            this.referenceService.loading(this.httpRequestLoader, false);
            if (data.statusCode == 200) {
              self.pipelines = data.data;
              self.createdForPipelines = data.data;
              self.getStages();
            } else {
              self.stages = [];
              self.createdForStages = [];
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
    if (!this.preview && !this.hasCampaignPipeline && !this.activeCRMDetails.hasDealPipeline) {
      this.deal.pipelineStageId = 0;
      this.deal.createdForPipelineStageId = 0;
      this.getStages();
      this.pipelineStageId = "form-group has-error has-feedback";
      this.createdForPipelineStageId = "form-group has-error has-feedback";
      this.pipelineStageIdError = true;
      this.createdForPipelineStageIdError = true;
      this.isDealRegistrationFormValid = false;
    }
  }

  resetCreatedByPipelineStages() {
    if (!this.preview && !this.hasCampaignPipeline && !this.activeCRMDetails.hasDealPipeline) {
      this.deal.pipelineStageId = 0;
      this.getStages();
      this.pipelineStageId = "form-group has-error has-feedback";
      this.pipelineStageIdError = true;
      this.isDealRegistrationFormValid = false;
    }
  }

  resetCreatedForPipelineStages() {
    if (!this.preview && !this.hasCampaignPipeline && !this.activeCRMDetails.hasDealPipeline) {
      this.deal.createdForPipelineStageId = 0;
      this.getStages();
      this.createdForPipelineStageId = "form-group has-error has-feedback";
      this.createdForPipelineStageIdError = true;
      this.isDealRegistrationFormValid = false;
    }
  }

  getStages() {
    let self = this;
    if (this.deal.createdForPipelineId > 0) {
      this.createdForPipelines.forEach(p => {
        if (p.id == this.deal.createdForPipelineId) {
          self.createdForStages = p.stages;
        }
      });
    } else if (this.deal.createdByPipelineId > 0) {
      this.createdByPipelines.forEach(p => {
        if (p.id == this.deal.createdByPipelineId) {
          self.createdByStages = p.stages;
        }
      });
    } else {
      self.stages = [];
    }

  }

  save() {
    this.customResponse = new CustomResponse();
    this.ngxloading = true;
    this.isLoading = true;
    this.deal.userId = this.loggedInUserId;
    var obj = [];
    let answers: DealAnswer[] = [];

    if (this.showCustomForm) {
      this.showLoadingButton = true;
      this.setSfFormFieldValues();
    }

    if (this.edit) {
      this.propertiesQuestions.forEach(property => {
        var question = {
          id: property.id,
          key: property.key,
          value: property.value,
          propType: 'QUESTION'
        }
        obj.push(question)
      })
      this.propertiesComments.forEach(property => {
        var question = {
          id: property.id,
          key: property.key,
          value: property.value,
          propType: 'PROPERTY'
        }
        obj.push(question)
      })
    } else {
      this.propertiesQuestions.forEach(property => {
        var question = {
          key: property.key,
          value: property.value,
          propType: 'QUESTION'
        }
        obj.push(question)
      })
      this.propertiesComments.forEach(property => {
        var question = {
          key: property.key,
          value: property.value,
          propType: 'PROPERTY'
        }
        obj.push(question)
      })
    }
    this.deal.answers = answers;
    this.deal.properties = obj;

    /********XNFR-403***********/
    if (this.activeCRMDetails.createdForActiveCRMType === "CONNECTWISE" || this.activeCRMDetails.createdByActiveCRMType === "CONNECTWISE") {
      let filtertedForecastItems = new Array<any>();
      $.each(this.sfDealComponent.forecastItems, function (_index: number,
        forecastItem: any) {
        let id = forecastItem['catalogItem']['id'];
        if (id != undefined && id > 0) {
          forecastItem['revenue'] = forecastItem['price'];
          delete forecastItem['price'];
          filtertedForecastItems.push(forecastItem);
        }
      });
      if (filtertedForecastItems.length > 0) {
        this.deal.forecastItemsJson = JSON.stringify(filtertedForecastItems);
      }
    }

    /********XNFR-403***********/
    //xnfr-461
    // if((this.isOrgAdmin || this.isMarketingCompany) && this.deal.createdForPipelineId == 0 && this.deal.createdForPipelineStageId == 0){
    //   this.deal.createdForPipelineId = this.deal.createdByPipelineId;
    //   this.deal.createdForPipelineStageId = this.deal.createdByPipelineStageId;
    // }
    if(this.deal.createdForPipelineId > 0 && this.deal.createdForPipelineStageId > 0){
      this.deal.pipelineId = this.deal.createdForPipelineId;
      this.deal.pipelineStageId = this.deal.createdForPipelineStageId;
    }
    else if (this.deal.createdByPipelineId > 0 && this.deal.createdByPipelineStageId > 0) {
      this.deal.pipelineId = this.deal.createdByPipelineId;
      this.deal.pipelineStageId = this.deal.createdByPipelineStageId;
    }

    this.dealsService.saveOrUpdateDeal(this.deal)
      .subscribe(
        data => {
          this.ngxloading = false;
          this.isLoading = false;
          this.referenceService.goToTop();
          this.referenceService.loading(this.httpRequestLoader, false);
          this.showLoadingButton = false;
          this.deal.properties.forEach(p => p.isSaved = true);
          if (data.statusCode == 200) {
            this.notifySubmitSuccess.emit();
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

  validateQuestion(property: DealDynamicProperties) {
    if (property.key.length > 0 && property.value.length > 0 && property.key.trim() && property.value.trim()) {
      property.validationStausKey = this.successClass;
      property.error = false;
    } else {
      property.validationStausKey = this.errorClass;
      property.error = true;
    }

    this.submitButtonStatus()
  }

  validateComment(property: DealDynamicProperties) {

    if (property.key.length > 0 && property.value.length > 0 && property.key.trim() && property.value.trim()) {
      property.validationStausKey = this.successClass;
      property.error = false;
    } else {
      property.validationStausKey = this.errorClass;
      property.error = true;
    }
    this.submitButtonStatus()


  }


  validateField(fieldId: any, isFormElement: boolean) {
    var errorClass = "form-group has-error has-feedback";
    var successClass = "form-group has-success has-feedback";
    if (isFormElement && fieldId.key != null && fieldId.key != undefined) {
      let fieldValue = $.trim($('#question_' + fieldId.id).val());
      if (fieldValue.length > 0) {
        fieldId.class = successClass;
        fieldId.error = false;
      } else {
        fieldId.class = errorClass;
        fieldId.error = true;
      }
    } else {
      let fieldValue = $.trim($('#' + fieldId).val());
      if (fieldId == "amount") {
        fieldValue = fieldValue.replace('$', '').replace(',', '');
        if (fieldValue.length > 0 && parseFloat(fieldValue) > 0) {
          this.opportunityAmount = successClass;
          this.opportunityAmountError = false;
        } else {
          this.opportunityAmount = errorClass;
          this.opportunityAmountError = true;
        }
      }
      if (fieldId == "estimatedCloseDate") {
        let fieldValue = this.deal.closeDateString;
        if (fieldValue.length > 0) {
          this.estimatedCloseDate = successClass;
          this.estimatedCloseDateError = false;
        } else {
          this.estimatedCloseDate = errorClass;
          this.estimatedCloseDateError = true;
        }
      }
      if (fieldId == "title") {
        if (fieldValue.length > 0) {
          this.title = successClass;
          this.titleError = false;
        } else {
          this.title = errorClass;
          this.titleError = true;
        }

      }
      if (fieldId == "dealType") {
        if (fieldValue.length > 0 && fieldValue != "Select Dealtype") {
          this.dealType = successClass;
          this.dealTypeError = false;
        } else {
          this.dealType = errorClass;
          this.dealTypeError = true;
        }

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
            this.createdForPipelineStageIdError = false;
            this.pipelineStageIdError = false;
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
      this.pipelineStageIdError = false;
      this.createdForPipelineStageIdError = false;
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
   else
     this.createdForPipelineStageIdError = true;

    this.propertiesQuestions.forEach(property => {
      this.validateQuestion(property);

    })
    this.propertiesComments.forEach(property => {
      this.validateComment(property);
    })

    this.submitButtonStatus();
  }

  setSfFormFieldValues() {
    if (this.sfDealComponent.form !== undefined || this.sfDealComponent.form !== null) {
      let formLabelDTOs = this.sfDealComponent.form.formLabelDTOs;
      if (formLabelDTOs.length !== 0) {
        this.deal.amount = 0;
        if (this.activeCRMDetails.type === "SALESFORCE") {
          let sfDefaultFields = formLabelDTOs.filter(fLabel => fLabel.sfCustomField === false);
          for (let formLabel of sfDefaultFields) {
            if (formLabel.labelId === "Name") {
              this.deal.title = formLabel.value;
            } else if (formLabel.labelId === "Description") {
              this.deal.description = formLabel.value;
            } else if (formLabel.labelId === "Type") {
              this.deal.dealType = formLabel.value;
            } else if (formLabel.labelId === "LeadSource") {
              this.deal.leadSource = formLabel.value;
            } else if (formLabel.labelId === "Amount" || formLabel.labelId === "amount") {
              this.deal.amount = formLabel.value;
            } else if (formLabel.labelId === "CloseDate") {
              this.deal.closeDateString = formLabel.value;
            } else if (formLabel.labelId === "NextStep") {
              this.deal.nextStep = formLabel.value;
            } else if (formLabel.labelId === "Probability") {
              this.deal.probability = formLabel.value;
            } else if (formLabel.labelId === "StageName") {
              this.deal.stage = formLabel.value;
            }
          }
        }
        let sfCustomFields = formLabelDTOs.filter(fLabel => fLabel.sfCustomField === true);
        let sfCfDataList = [];
        for (let formLabel of sfCustomFields) {
          if (this.activeCRMDetails.type === "HUBSPOT") {
            if (formLabel.formDefaultFieldType === "DEAL_NAME") {
              this.deal.title = formLabel.value;
            } else if (formLabel.formDefaultFieldType === "AMOUNT") {
              this.deal.amount = formLabel.value;
            } else if (formLabel.formDefaultFieldType === "CLOSE_DATE") {
              this.deal.closeDateString = formLabel.value;
            }
          }
          if (this.titleFields.includes(formLabel.labelId)) {
            this.deal.title = formLabel.value;
          } else if (this.amountFields.includes(formLabel.labelId) && this.activeCRMDetails.type != "HUBSPOT") {
            this.deal.amount = formLabel.value;
          } else if (this.closeDateFields.includes(formLabel.labelId)) {
            this.deal.closeDateString = formLabel.value;
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
            sfCfData.value = formLabel.value;
            sfCfData.type = formLabel.labelType;
            const event = new Date(formLabel.value);
            sfCfData.dateTimeIsoValue = event.toISOString();
          }
          else {
            sfCfData.value = formLabel.value;
          }
          sfCfDataList.push(sfCfData);
        }
        this.deal.sfCustomFieldsDataDto = sfCfDataList;
      }
    }
  }

  addProperties() {
    this.property = new DealDynamicProperties();
    let length = this.propertiesComments.length;
    length = length + 1;
    var id = 'property-' + length;
    this.property.divId = id;
    this.property.propType = 'PROPERTY';
    this.property.isSaved = false;
    this.property.error = true;
    this.propertiesComments.push(this.property);

    this.submitButtonStatus()

  }

  isEven(n) {
    if (n % 2 === 0) { return true; }
    return false;
  }

  showAlert(i: number, question: DealDynamicProperties) {
    if (question.isSaved) {
      this.deleteComment(i, question);

    } else {
      this.remove(i, question.id);
    }
  }

  commentsection(property: DealDynamicProperties) {
    property.isCommentSection = !property.isCommentSection;
    property.unReadPropertyChatCount = 0;

  }

  deleteComment(i: number, comment: DealDynamicProperties) {
    try {
      this.logger.info("Comment in sweetAlert() " + comment.id);
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#54a7e9',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes, delete it!'

      }).then(function (myData: any) {
        console.log("deleteComment showAlert then()" + comment);
        self.dealsService.deleteProperty(comment).subscribe(response => {
          self.remove(i, comment.id)

        }, error => this.logger.error(error, "DealComponent", "deleteComment()"))
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.logger.error(error, "DealComponent", "deleteCommentAlert()");
    }
  }

  remove(i, id) {
    if (id)
      console.log(id)
    var index = 1;

    this.propertiesComments = this.propertiesComments.filter(property => property.divId !== 'property-' + i)
      .map(property => {
        property.divId = 'property-' + index++;
        return property;
      });
    this.submitButtonStatus()

  }

  getActiveCRMDetails() {
    this.showCustomForm = false;
    this.integrationService.getActiveCRMDetails(this.deal.createdForCompanyId, this.loggedInUserId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.activeCRMDetails = response.data;
            if (this.activeCRMDetails.hasCustomForm
              && ("HUBSPOT" === this.activeCRMDetails.type || "SALESFORCE" === this.activeCRMDetails.type
                || "PIPEDRIVE" === this.activeCRMDetails.type || "CONNECTWISE" === this.activeCRMDetails.type)) {
              this.showCustomForm = true;
            } else if ("HALOPSA" === this.activeCRMDetails.type 
            && (this.actionType === "edit" || this.actionType === "view")) {
              this.showCustomForm = true;
            }
            if (this.activeCRMDetails.showHaloPSAOpportunityTypesDropdown) {
              this.showOpportunityTypes = true;
              if ("HALOPSA" === this.activeCRMDetails.createdForActiveCRMType) {
                this.getHaloPSATicketTypes(this.deal.createdForCompanyId);
                this.createdForStages = [];
                this.createdForPipelines = [];
                if (this.actionType === "add") {
                  this.deal.haloPSATickettypeId = 0;
                  this.deal.createdForPipelineId = 0;
                  this.deal.createdForPipelineStageId = 0;
                }
                this.activeCRMDetails.hasCreatedForPipeline = false;
              } else if ("HALOPSA" === this.activeCRMDetails.createdByActiveCRMType) {
                this.getHaloPSATicketTypes(this.deal.createdByCompanyId);
                this.createdByStages = [];
                this.createdByPipelines = [];
                if (this.actionType === "add") {
                  this.deal.haloPSATickettypeId = 0;
                  this.deal.createdByPipelineId = 0;
                  this.deal.createdByPipelineStageId = 0;
                }
                this.activeCRMDetails.hasCreatedByPipeline = false;
              }
            } else {
              this.showOpportunityTypes = false;
              this.halopsaTicketTypeId = 0;
              this.halopsaTicketTypes = [];
              if (this.actionType === "add") {
                this.deal.haloPSATickettypeId = 0;
              }
            }
          }
        },
        error => {
          console.log(error);
        },
        () => {
          this.setFieldErrorStates();
          if (!this.showCustomForm && !(this.activeCRMDetails.type !== undefined && "HALOPSA" === this.activeCRMDetails.type)) {
            this.showDefaultForm = true;
            this.activeCRMDetails.hasDealPipeline = false;
            if (this.edit || this.preview) {
              this.setProperties();
            } else {
              this.getQuestions();
            }
            this.getDealTypes();           
          }   
      
          //XNFR-461
          if (this.deal.campaignId > 0) {
            this.getCampaignDealPipeline();
          } else {
            this.getActiveCRMPipelines();
          }
          if (this.actionType === "view") {
            this.getDealPipelinesForView();
          }
          else {
            if (!this.activeCRMDetails.showHaloPSAOpportunityTypesDropdown || this.actionType === "edit") {
              this.getDealPipelines();
            }
          }
        });
  }

  getDealPipelines() {
    let campaignId = 0;
    let self = this;
    self.isLoading = true;
    self.referenceService.loading(this.httpRequestLoader, true);
    if (this.deal.campaignId !== undefined && this.deal.campaignId > 0) {
      campaignId = this.deal.campaignId;
    }
    if (this.deal.haloPSATickettypeId != undefined) {
      this.halopsaTicketTypeId = this.deal.haloPSATickettypeId;
    }
    this.dealsService.getActiveCRMPipelines(this.deal.createdForCompanyId, this.loggedInUserId, campaignId, this.type, this.halopsaTicketTypeId)
      .subscribe(
        data => {
          self.referenceService.loading(this.httpRequestLoader, false);
          self.isLoading = false;
          if (data.statusCode == 200) {
            let activeCRMPipelinesResponse: any = data.data;
            self.createdByActiveCRM = activeCRMPipelinesResponse.createdByActiveCRM;
            self.createdForActiveCRM = activeCRMPipelinesResponse.createdForActiveCRM;
            self.showCreatedByPipelineAndStage = activeCRMPipelinesResponse.showCreatedByPipelineAndStage;
            self.showCreatedByPipelineAndStageOnTop = activeCRMPipelinesResponse.showCreatedByPipelineAndStageOnTop;
            let createdByPipelines: Array<any> = activeCRMPipelinesResponse.createdByCompanyPipelines;
            if (createdByPipelines !== undefined && createdByPipelines !== null) {
              this.handleCreatedByPipelines(createdByPipelines);
            }

            let createdForPipelines: Array<any> = activeCRMPipelinesResponse.createdForCompanyPipelines;
            if (createdForPipelines !== undefined && createdForPipelines !== null) {
              this.handleCreatedForPipelines(createdForPipelines);
            }

          } else if (data.statusCode == 404) {
            this.deal.createdForPipelineId = 0;
            this.deal.createdByPipelineId = 0;
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

  getDealPipelinesForView() {
    let campaignId = 0;
    let self = this;
    this.isLoading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    if (this.deal.campaignId !== undefined && this.deal.campaignId > 0) {
      campaignId = this.deal.campaignId;
    }
    this.dealsService.getDealPipelinesForView(this.dealId, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          this.isLoading = false;
          if (data.statusCode == 200) {
            let activeCRMPipelinesResponse: any = data.data;
            self.createdByActiveCRM = activeCRMPipelinesResponse.createdByActiveCRM;
            self.createdForActiveCRM = activeCRMPipelinesResponse.createdForActiveCRM;
            self.showCreatedByPipelineAndStage = activeCRMPipelinesResponse.showCreatedByPipelineAndStage;
            self.showCreatedByPipelineAndStageOnTop = activeCRMPipelinesResponse.showCreatedByPipelineAndStageOnTop;
            let createdByPipelines: Array<any> = activeCRMPipelinesResponse.createdByCompanyPipelines;
            let createdForPipelines: Array<any> = activeCRMPipelinesResponse.createdForCompanyPipelines;

            if (createdByPipelines !== undefined && createdByPipelines !== null) {
              this.handleCreatedByPipelines(createdByPipelines);
            }

            if (createdForPipelines !== undefined && createdForPipelines !== null) {
              this.handleCreatedForPipelines(createdForPipelines);
            }

          } else if (data.statusCode == 404) {
            this.deal.createdForPipelineId = 0;
            this.deal.createdByPipelineId = 0;
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

  getActiveCRMPipelines() {
    let self = this;
    this.isLoading = true;
    let haloPSATickettypeId = 0;
    let type = "XAMPLIFY";
    if (this.activeCRMDetails != undefined && this.activeCRMDetails.type != undefined) {
      type = this.activeCRMDetails.type;
    }
    if (this.deal.haloPSATickettypeId != undefined && this.deal.haloPSATickettypeId > 0) {
      haloPSATickettypeId = this.deal.haloPSATickettypeId;
    }
    this.dealsService.getCRMPipelines(this.deal.createdForCompanyId, this.loggedInUserId, type, haloPSATickettypeId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          this.isLoading = false;
          if (data.statusCode == 200) {
            let activeCRMPipelines: Array<any> = data.data;
            self.pipelines = activeCRMPipelines;
            self.createdForPipelines = activeCRMPipelines;
            if (activeCRMPipelines.length === 1) {
              let activeCRMPipeline = activeCRMPipelines[0];
              self.deal.pipelineId = activeCRMPipeline.id;
              self.deal.createdForPipelineId = activeCRMPipeline.id;
              self.createdForStages = activeCRMPipeline.stages;
              self.pipelineIdError = false;
              self.stages = activeCRMPipeline.stages;
              self.activeCRMDetails.hasDealPipeline = true;
              this.holdActiveCRMPipelineId = activeCRMPipeline.id;
            } else {
              let dealPipelineExist = false;
              for (let p of activeCRMPipelines) {
                if (p.id == this.deal.pipelineId) {
                  dealPipelineExist = true;
                  self.stages = p.stages;
                  break;
                }
              }
              if (!dealPipelineExist) {
                self.deal.pipelineId = 0;
                self.deal.createdForPipelineId = 0;
                self.deal.pipelineStageId = 0;
                self.deal.createdForPipelineStageId = 0;
                this.setFieldErrorStates();
              }
              self.hasCampaignPipeline = false;
              self.activeCRMDetails.hasDealPipeline = false;
            }
          } else if (data.statusCode == 404) {
            self.deal.pipelineId = 0;
            self.deal.createdForPipelineId = 0;
            self.stages = [];
            self.createdForStages = [];
            self.getPipelines();
            self.activeCRMDetails.hasDealPipeline = false;
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
      self.deal.createdByPipelineId = createdByPipeline.id;
      self.pipelineIdError = false;
      self.createdByStages = createdByPipeline.stages;
      self.activeCRMDetails.hasCreatedByPipeline = true;
    } else {
      let createdByPipelineExist = false;
      for (let p of createdByPipelines) {
        if (p.id == this.deal.createdByPipelineId) {
          createdByPipelineExist = true;
          self.createdByStages = p.stages;
          break;
        }
      }
      if (!createdByPipelineExist) {
        self.deal.createdByPipelineId = 0;
        self.deal.createdByPipelineStageId = 0;
        this.setFieldErrorStates();
      }
      self.activeCRMDetails.hasCreatedByPipeline = false;
    }
  }

  handleCreatedForPipelines(createdForPipelines: any) {
    let self = this;
    self.createdForPipelines = createdForPipelines;
    if (createdForPipelines.length === 1) {
      let createdForPipeline = createdForPipelines[0];
      self.deal.createdForPipelineId = createdForPipeline.id;
      self.pipelineIdError = false;
      if ("HALOPSA" == this.activeCRMDetails.createdForActiveCRMType && self.actionType == 'add') {
        let createdForPipelineStage = null;
        let stages = createdForPipeline.stages;
        createdForPipelineStage = stages.reduce((mindisplayIndexStage, currentStage) =>
          mindisplayIndexStage.displayIndex < currentStage.displayIndex ? mindisplayIndexStage : currentStage
        );
        self.createdForStages = createdForPipeline.stages;
        self.deal.createdForPipelineStageId = createdForPipelineStage.id;
        self.isCreatedForStageIdDisable = true;
      } else {
        self.createdForStages = createdForPipeline.stages;
        self.isCreatedForStageIdDisable = false;
      }
      self.activeCRMDetails.hasCreatedForPipeline = true;
      self.activeCRMDetails.hasDealPipeline = true;
    } else {
      let createdForPipelineExist = false;
      for (let p of createdForPipelines) {
        if (p.id == this.deal.createdForPipelineId) {
          createdForPipelineExist = true;
          self.createdForStages = p.stages;
          break;
        }
      }
      if (!createdForPipelineExist) {
        self.deal.createdForPipelineId = 0;
        self.deal.createdForPipelineStageId = 0;
        this.setFieldErrorStates();
      }
      self.activeCRMDetails.hasCreatedForPipeline = false;
    }
  }
  //
  // isCollapsedcontact:boolean=true;
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

  addLead() {
    this.showLeadForm = true;
    this.leadId = 0;
    this.dealToLead = new Object();
    this.dealToLead.dealId = this.dealId;
    this.dealToLead.leadActionType = "add";
    this.dealToLead.dealActionType = this.actionType;
    this.dealToLead.createdForCompanyId = this.deal.createdForCompanyId;
    this.dealToLead.callingComponent = "DEAL";
  }

  closeLeadForm() {
    this.showLeadForm = false;
  }

  leadSelected(leadId: any) {
    this.showSelectLeadModel = false;
    this.leadId = leadId;
    this.attachLeadText = "Change Lead";
    this.showDetachLeadButton = true;
    this.getLead(this.leadId);
  }

  leadCreated(leadId: any) {
    this.showLeadForm = false;
    this.leadId = leadId;
    this.getLead(this.leadId);
  }

  openSelectLeadModel() {
    this.showSelectLeadModel = true;
    this.dealToLead = new Object();
    this.dealToLead.dealId = this.dealId;
    this.dealToLead.leadId = this.leadId;
    this.dealToLead.leadActionType = "add";
    this.dealToLead.dealActionType = this.actionType;
    this.dealToLead.createdForCompanyId = this.deal.createdForCompanyId;
    this.dealToLead.callingComponent = "DEAL";
    this.dealToLead.isOrgAdmin = this.isOrgAdmin;
    this.dealToLead.isVendorVersion = this.isVendorVersion;
  }


  closeSelectLeadModel() {
    this.showSelectLeadModel = false;
  }

  /*** XNFR-476 ***/
  resetAttachedLeadInfo() {
    this.showContactInfo = false;
    this.deal.associatedLeadId = 0;
    this.attachLeadText = 'Attach Lead';
    this.showDetachLeadButton = false;
    this.deal.campaignId = 0;
    this.deal.campaignName = '';
    this.leadId = 0;
    if (this.actionType == 'add' && !this.vanityLoginDto.vanityUrlFilter) {
      this.deal.createdForCompanyId = this.holdCreatedForCompanyId;
      if (this.deal.createdForCompanyId == 0) {
        this.resetPipelines();
        this.resetStages();
        this.isDealRegistrationFormValid = false;
      }
      if (this.deal.pipelineId == 0) {
        this.activeCRMDetails.hasDealPipeline = false;
        this.hasCampaignPipeline = false;
      }
      if (this.hasCampaignPipeline) {
        this.hasCampaignPipeline = false;
      }
    }
    if (this.actionType == 'edit' && this.lead.campaignId != null && this.lead.campaignId > 0) {
      this.hasCampaignPipeline = false;
    }
  }

  halopsaTicketTypeId:number = 0;
  halopsaTicketTypes: any;
  getHaloPSATicketTypes(loggedInUserId:number) {
    this.isLoading = true;
    this.integrationService.getHaloPSATicketTypes(loggedInUserId).subscribe(data => {
      this.isLoading = false;
      if (data.statusCode == 200) {
        this.halopsaTicketTypes = data.data;
      }
    })
  }

  onChangeTicketType() {
    this.showCustomForm = true;
    this.getDealPipelines();
  }

}
