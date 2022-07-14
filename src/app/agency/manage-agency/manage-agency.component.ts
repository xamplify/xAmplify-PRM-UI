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
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';


declare var $:any,swal:any;
@Component({
  selector: 'app-manage-agency',
  templateUrl: './manage-agency.component.html',
  styleUrls: ['./manage-agency.component.css'],
  providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch, Properties,TeamMemberService,SortOption],
  animations:[CustomAnimation]
})
export class ManageAgencyComponent implements OnInit,OnDestroy {
  agencyAccess = false;
  loader:HttpRequestLoader = new HttpRequestLoader();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  addAgencyLoader:HttpRequestLoader = new HttpRequestLoader();
  customResponse:CustomResponse = new CustomResponse();
  showAddAgencyDiv = false;
  editAgency = false;
  saveOrUpdateButtonText = "Save";
  agencyDto:AgencyDto = new AgencyDto();
  defaultModules: Array<any> = new Array<any>();
  agencies: Array<any> = new Array<any>();  
  /************CSV Related************* */
  showUploadedAgencies = false;
  csvErrors: any[];
  sortOption: SortOption = new SortOption();

  constructor(public agencyService:AgencyService,public logger: XtremandLogger, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
    private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch,private router: Router, public properties: Properties,
    private teamMemberService:TeamMemberService,public utilService:UtilService) {

    }
    ngOnDestroy(): void {
      $('#delete-agency-popup').modal('hide');
      $('#preview-agency-popup').modal('hide');
      swal.close();
    }

  ngOnInit() {
    this.referenceService.loading(this.loader,true);
    this.authenticationService.hasAgencyAccess().subscribe(
    response=>{
      this.agencyAccess = response.statusCode==200;
    },error=>{
      this.logger.errorPage(error);
    },()=>{
      if(this.agencyAccess){
        this.referenceService.loading(this.loader,false);
        this.findAll(this.pagination);
      }else{
        this.referenceService.goToPageNotFound();
      }
    });
  }
  
  findAll(pagination:Pagination){
    this.referenceService.loading(this.httpRequestLoader, true);
    this.referenceService.scrollSmoothToTop();
    this.agencyService.findAll(pagination).subscribe(
      response=>{
        let data = response.data;
        this.agencies = data.list;
        pagination.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, this.agencies);
        this.referenceService.loading(this.httpRequestLoader, false);
      },error=>{
        this.logger.errorPage(error);
      }
    );
  }
/*************************Sort********************** */
sortBy(text: any) {
  this.sortOption.selectedActiveUsersSortOption = text;
  this.getAllFilteredResults(this.pagination, this.sortOption);
}
/*************************Search********************** */
eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
search() {
  this.getAllFilteredResults(this.pagination, this.sortOption);
}

getAllFilteredResults(pagination: Pagination, sortOption: SortOption) {
  pagination.pageIndex = 1;
  pagination.searchKey = sortOption.searchKey;
  pagination = this.utilService.sortOptionValues(sortOption.selectedActiveUsersSortOption, pagination);
  this.findAll(pagination);
}
  /**************Pagination***************/
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.findAll(this.pagination);
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
    this.referenceService.scrollSmoothToTop();
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = "";
    this.findAll(this.pagination);
  }

   /***********Add*******************/
   goToAddAgencyDiv() {
    this.referenceService.hideDiv('agency-csv-error-div');
    this.customResponse = new CustomResponse();
    this.agencyDto = new AgencyDto();
    this.showAddAgencyDiv = true;
    this.findDefaultModules();
  }

  clearAgencyForm() {
    this.agencyDto = new AgencyDto();
    this.showAddAgencyDiv = false;
    this.showUploadedAgencies = false;
    this.editAgency = false;
    this.saveOrUpdateButtonText = "Save";
    this.refreshList();
  }

  validateAddAgencyForm(fieldName: string) {
    if ("emailId" == fieldName) {
        this.validateAgencyEmailId();
    }else if("agencyName"==fieldName){
        this.validateAgencyName();
    }
    let enabledModulesCount = this.defaultModules.filter((item) => item.enabled).length;
    this.agencyDto.validForm = this.agencyDto.validEmailId && this.agencyDto.validAgencyName &&  enabledModulesCount > 0;
  }

  validateAgencyEmailId(){
    this.agencyDto.validEmailId = this.referenceService.validateEmailId(this.agencyDto.emailId);
    this.agencyDto.emailIdErrorMessage = this.agencyDto.validEmailId ? '' : 'Please enter a valid email address';
    this.agencyDto.emaillIdDivClass = this.referenceService.getSuccessOrErrorClassName(this.agencyDto.validEmailId);
  }

  validateAgencyName(){
    let agencyName = this.agencyDto.agencyName;
    this.agencyDto.validAgencyName = agencyName!=undefined && agencyName!="" && $.trim(agencyName).length>0;
    this.agencyDto.agencyNameErrorMessage = this.agencyDto.validAgencyName ? '' : 'Please enter Agency Name';
    this.agencyDto.agencyNameDivClass = this.referenceService.getSuccessOrErrorClassName(this.agencyDto.validAgencyName);
  }

  validateAgencyForm(){
    this.validateAddAgencyForm("emailId");
    this.validateAddAgencyForm("agencyName");
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
    this.validateAgencyForm();
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
