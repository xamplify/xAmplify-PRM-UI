import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { ReferenceService } from 'app/core/services/reference.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { DashboardService } from 'app/dashboard/dashboard.service';

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

  ngxLoading:boolean = false;
  customResponse: CustomResponse = new CustomResponse();
  groupDto: any = {};
  defaultModules:any[];
  isAdd:boolean = false;
  isEdit:boolean = false;
  isContactsModuleToggleDisabled:boolean = false;

  constructor(public referenceService: ReferenceService, public dashboardService: DashboardService, public properties: Properties) { }

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
    // this.referenceService.openModalPopup('partnerModuleConfiguratorModalPopup');
  }
  
  ngOnDestroy(){
    this.referenceService.closeModalPopup('partnerModuleConfiguratorModalPopup');
  }
  
  private checkAndDisableContactsModuleToggleUsingCampaignModule() {
    let campignModule = this.defaultModules.filter((item) => item.moduleName == "Campaign")[0];
    if (campignModule != undefined) {
      let contactModule = this.defaultModules.filter((item) => item.moduleName == "Contacts")[0];
      contactModule.partnerAccessModule = campignModule.partnerAccessModule ? true : contactModule.partnerAccessModule;
      this.isContactsModuleToggleDisabled = campignModule.partnerAccessModule;
    }
  }

  findDefaultModules() {
    this.defaultModules = [];
    this.ngxLoading = true;
    this.dashboardService.fetchModuleForPartnerModuleAccess().subscribe(
      response => {
        this.defaultModules = response.data;
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
      this.isContactsModuleToggleDisabled = module.partnerAccessModule;
    } else {
      module.partnerAccessModule = event;
      let modulesWithoutAll = this.defaultModules.filter((item) => item.moduleName != "All");
      let enabledModulesLength = modulesWithoutAll.filter((item) => item.partnerAccessModule).length;
      let allModule = this.defaultModules.filter((item) => item.moduleName == "All")[0];
      allModule.partnerAccessModule = (modulesWithoutAll.length == enabledModulesLength);
    }
    let enabledModules = this.defaultModules.filter((item) => item.partnerAccessModule);
    let roleIds = enabledModules.map(function (a) { return a.roleId; });
    this.groupDto.roleIds = roleIds;
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
          this.defaultModules = response.data;
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

}
