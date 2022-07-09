import { Component, OnInit, ViewChild, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { FileUtil } from '../../core/models/file-util';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { AgencyService } from './../services/agency.service';
import { CustomAnimation } from 'app/core/models/custom-animation';
import { AgencyDto } from './../models/agency-dto';
import { TeamMemberService } from './../../team/services/team-member.service';
declare var $:any,swal:any;
@Component({
  selector: 'app-manage-agency',
  templateUrl: './manage-agency.component.html',
  styleUrls: ['./manage-agency.component.css'],
  providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch, Properties,TeamMemberService],
  animations:[CustomAnimation]
})
export class ManageAgencyComponent implements OnInit,OnDestroy {
  loader:HttpRequestLoader = new HttpRequestLoader();
  addAgencyLoader:HttpRequestLoader = new HttpRequestLoader();
  customResponse:CustomResponse = new CustomResponse();
  showAddAgencyDiv = false;
  editAgency = false;
  saveOrUpdateButtonText = "Save";
  agencyDto:AgencyDto = new AgencyDto();
  defaultModules: Array<any> = new Array<any>();
  /*****Form Related**************/
  formGroupClass: string = "col-sm-8";
  emaillIdDivClass: string = this.formGroupClass;
  groupNameDivClass: string = this.formGroupClass;
  errorClass: string = "col-sm-8 has-error has-feedback";
  successClass: string = "col-sm-8 has-success has-feedback";
  defaultClass: string = this.formGroupClass;
  /************CSV Related************* */
  showUploadedAgencies = false;
  csvErrors: any[];
  constructor(public agencyService:AgencyService,public logger: XtremandLogger, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
    private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch,private router: Router, public properties: Properties,
    private teamMemberService:TeamMemberService) {

    }
    ngOnDestroy(): void {
      $('#delete-agency-popup').modal('hide');
      $('#preview-agency-popup').modal('hide');
      swal.close();
    }

  ngOnInit() {
    this.referenceService.loading(this.loader,true);

    setTimeout(() => {
      let agencyAccess = this.authenticationService.module.agencyAccess;
      if(!agencyAccess){
        this.referenceService.goToPageNotFound();
      }else{
        this.findDefaultModules();
      }
      this.referenceService.loading(this.loader, false);
    }, 500);
  }

  checkAgentAccess(){
    
  }

  findDefaultModules() {
    this.referenceService.loading(this.addAgencyLoader, true);
    this.defaultModules = [];
    this.teamMemberService.findDefaultModules().
      subscribe(
        response => {
          this.defaultModules = response.data.modules;
          this.referenceService.loading(this.addAgencyLoader, false);
        }, error => {
          this.referenceService.loading(this.addAgencyLoader, false);
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
          this.logger.errorPage(error);
        }
      );
  }

  refreshList() {
    throw new Error('Method not implemented.');
  }

   /***********Add*******************/
   goToAddAgencyDiv() {
    this.referenceService.hideDiv('agency-csv-error-div');
    this.customResponse = new CustomResponse();
    this.agencyDto = new AgencyDto();
    this.showAddAgencyDiv = true;
  }

  clearAgencyForm() {
    this.emaillIdDivClass = this.defaultClass;
    this.agencyDto = new AgencyDto();
    this.showAddAgencyDiv = false;
    this.showUploadedAgencies = false;
    this.editAgency = false;
    this.saveOrUpdateButtonText = "Save";
    this.refreshList();
  }

  validateAddAgencyForm(fieldName: string) {
    if ("emailId" == fieldName) {
      this.agencyDto.validEmailId = this.referenceService.validateEmailId(this.agencyDto.emailId);
      this.agencyDto.emailIdErrorMessage = this.agencyDto.validEmailId ? '' : 'Please enter a valid email address';
      this.emaillIdDivClass = this.agencyDto.validEmailId ? this.successClass : this.errorClass;
      let enabledModulesCount = this.defaultModules.filter((item) => item.enabled).length;
      this.agencyDto.validForm = this.agencyDto.validEmailId &&  enabledModulesCount > 0;
    }
  }

  changeStatus(event: any, module: any) {
    if (module.moduleName == "All") {
      this.enableOrDisableAllModules(event);
    } else {
      module.enabled = event;
      let modulesWithoutAll = this.defaultModules.filter((item) => item.moduleName != "All");
      let enabledModulesLength = modulesWithoutAll.filter((item) => item.enabled).length;
      let allModule = this.defaultModules.filter((item) => item.moduleName == "All")[0];
      allModule.enabled = (modulesWithoutAll.length == enabledModulesLength);
    }
    this.validateAddAgencyForm('emailId');
    let enabledModules = this.defaultModules.filter((item) => item.enabled);
    let roleIds = enabledModules.map(function (a) { return a.roleId; });
    this.agencyDto.roleIds = roleIds;
  }

  enableOrDisableAllModules(event: any) {
    let self = this;
    $.each(self.defaultModules, function (_index: number, defaultModule: any) {
      defaultModule.enabled = event;
    });
  }

}
