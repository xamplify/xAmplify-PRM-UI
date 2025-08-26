import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { ReferenceService } from 'app/core/services/reference.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

declare var $;

@Component({
  selector: 'app-partner-module-configurator',
  templateUrl: './partner-module-configurator.component.html',
  styleUrls: ['./partner-module-configurator.component.css']
})
export class PartnerModuleConfiguratorComponent implements OnInit {

  @Input() currentPartner:any;
  @Input() actionType:any;

  @Output() notifyClose = new EventEmitter();
  @Output() notifySubmit = new EventEmitter();
  @Output() notifyUpdateSuccess = new EventEmitter();
  @Output() notifyUpdateFailed = new EventEmitter();
  @Output() notifyMarketingModulesChange = new EventEmitter();

  ngxLoading:boolean = false;
  customResponse: CustomResponse = new CustomResponse();
  groupDto: any = {};
  defaultModules:any[];
  isAdd:boolean = false;
  isEdit:boolean = false;
  isContactsModuleToggleDisabled:boolean = false;
  hasMarketingModulesAccessToPartner: boolean = false;
  hasMarketingModulesAccessToVendor: boolean = false;
  vendorCompanyProfileName: string = '';
  marketingModules:any[];

  constructor(public referenceService: ReferenceService, public dashboardService: DashboardService, public properties: Properties, 
    private authenticationService: AuthenticationService) {
      this.vendorCompanyProfileName = this.authenticationService.companyProfileName;
  }

  ngOnInit() {
    if (this.actionType == 'add') {
      this.isAdd = true;
      if (this.currentPartner.defaultModules == undefined || this.currentPartner.defaultModules.length < 0) {
        this.findDefaultModules();
      } else {
        this.defaultModules = this.currentPartner.defaultModules;
        this.checkAndDisableContactsModuleToggleUsingCampaignModule();
      }
    } else {
      this.isEdit = true;
      this.fetchModulesForEdit();
      this.referenceService.openModalPopup('partnerModuleConfiguratorModalPopup');
    }
  }
  
  ngOnDestroy(){
    this.referenceService.closeModalPopup('partnerModuleConfiguratorModalPopup');
  }
  
  private checkAndDisableContactsModuleToggleUsingCampaignModule() {
    let campignModule = this.defaultModules.filter((item) => item.moduleName == "Campaign")[0];
    if (campignModule != undefined) {
      let contactModule = this.defaultModules.filter((item) => item.moduleName == "Contacts")[0];
      contactModule.partnerAccessModule = campignModule.partnerAccessModule ? true : contactModule.partnerAccessModule;
      this.isContactsModuleToggleDisabled = campignModule.partnerAccessModule || this.hasMarketingModulesAccessToPartner;
    }
  }

  findDefaultModules() {
    this.defaultModules = [];
    this.ngxLoading = true;
    this.dashboardService.fetchModuleForPartnerModuleAccess().subscribe(
      response => {
        this.defaultModules = response.data.defaultModules;
        this.marketingModules = response.data.marketingModules;
        this.hasMarketingModulesAccessToVendor = response.data.hasMarketingModulesAccessToVendor;
        this.hasMarketingModulesAccessToPartner = response.data.hasMarketingModulesAccessToPartner;
        this.checkAndDisableContactsModuleToggleUsingCampaignModule();
        this.ngxLoading = false;
      }, error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.ngxLoading = false;
      }
    );
  }

  changeStatus(event: any, module: any) {
    if (module.moduleName == "All") {
      this.enableOrDisableAllModules(event);
    } else if (module.moduleName == "Campaign") {
      module.partnerAccessModule = event;
      let contactModule = this.defaultModules.filter((item) => item.moduleName == "Contacts")[0];
      contactModule.partnerAccessModule = module.partnerAccessModule ? true : contactModule.partnerAccessModule;
      this.isContactsModuleToggleDisabled = module.partnerAccessModule || this.hasMarketingModulesAccessToPartner;
    } else {
      module.partnerAccessModule = event;
    }
    let enabledModules = this.defaultModules.filter((item) => item.partnerAccessModule);
    let roleIds = enabledModules.map(function (a) { return a.roleId; });
    this.groupDto.roleIds = roleIds;
    /*** XNFR-938 */
    if (this.isAdd) {
      this.currentPartner.defaultModules = this.defaultModules;
      this.notifySubmit.emit(this.currentPartner);
    }
  }

  enableOrDisableAllModules(event: any) {
    let self = this;
    $.each(self.defaultModules, function (_index: number, defaultModule: any) {
      defaultModule.partnerAccessModule = event;
    });
  }

  closeModalPopup() {
    this.referenceService.closeModalPopup('partnerModuleConfiguratorModalPopup');
    this.notifyClose.emit();
  }

  submit() {
    this.referenceService.closeModalPopup('partnerModuleConfiguratorModalPopup');
    this.currentPartner.defaultModules = this.defaultModules;
    this.notifySubmit.emit(this.currentPartner);
  }

  fetchModulesForEdit() {
    this.ngxLoading = true;
    this.dashboardService.fetchModulesForEditPartnerModule(this.currentPartner.partnershipId).subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.defaultModules = response.data.defaultModules;
          this.marketingModules = response.data.marketingModules;
          this.hasMarketingModulesAccessToVendor = response.data.hasMarketingModulesAccessToVendor;
          this.hasMarketingModulesAccessToPartner = response.data.hasMarketingModulesAccessToPartner;
          this.checkAndDisableContactsModuleToggleUsingCampaignModule();
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
  }

  update() {
    this.ngxLoading = true;
    this.currentPartner.defaultModules = this.defaultModules;
    this.currentPartner.marketingModules = this.marketingModules;
    this.currentPartner.marketingModulesAccessToVendor = this.hasMarketingModulesAccessToVendor;
    this.currentPartner.marketingModulesAccessToPartner = this.hasMarketingModulesAccessToPartner;
    this.dashboardService.updatePartnerModulesAccess(this.currentPartner).subscribe(
      response => {
        this.ngxLoading = false;
        this.referenceService.closeModalPopup('partnerModuleConfiguratorModalPopup');
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.notifyUpdateSuccess.emit(response.message);
        } else {
          this.notifyUpdateFailed.emit(response.message);
        }
      }, error => {
        this.ngxLoading = false;
        this.referenceService.closeModalPopup('partnerModuleConfiguratorModalPopup');
        this.notifyUpdateFailed.emit(this.properties.serverErrorMessage);
      }
    )
  }

  /***** XNFR-1066 *****/
  marketingModulesChange(event: any) {
    const isCampaignModule = this.defaultModules.find(module => module.moduleId === 2);
    if (isCampaignModule && !isCampaignModule.partnerAccessModule) {
      this.isContactsModuleToggleDisabled = event;
    }
    this.hasMarketingModulesAccessToPartner = event;
    this.defaultModules.forEach((module) => {
      module.partnerAccessModule = module.moduleId === 3 ? true : module.partnerAccessModule;
    });
    if (this.isAdd) {
      this.currentPartner.marketingModules = this.marketingModules;
      this.currentPartner.marketingModulesAccessToVendor = this.hasMarketingModulesAccessToVendor;
      this.currentPartner.marketingModulesAccessToPartner = this.hasMarketingModulesAccessToPartner;
      this.notifySubmit.emit(this.currentPartner);
    }
  }

}
