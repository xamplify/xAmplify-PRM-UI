import { ErrorResponse } from './../../util/models/error-response';
import { CsvDto } from './../../core/models/csv-dto';
import { Component, OnInit, ViewChild, Input, OnDestroy, AfterViewInit, ErrorHandler } from '@angular/core';
import { Router, Event } from '@angular/router';
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
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { AgencyPostDto } from '../models/agency-post-dto';
declare var $:any,swal:any;
@Component({
  selector: 'app-manage-agency',
  templateUrl: './manage-agency.component.html',
  styleUrls: ['./manage-agency.component.css'],
  providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch, Properties,SortOption],
  animations:[CustomAnimation]
})
export class ManageAgencyComponent implements OnInit,OnDestroy {
  agencyAccess = false;
  loader:HttpRequestLoader = new HttpRequestLoader();
  ngxLoading = false;
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  addAgencyLoader:HttpRequestLoader = new HttpRequestLoader();
  customResponse:CustomResponse = new CustomResponse();
  showAddAgencyDiv = false;
  editAgency = false;
  saveOrUpdateButtonText = "Save";
  agencyDto:AgencyDto = new AgencyDto();
  agencyPostDto:AgencyPostDto = new AgencyPostDto();
  agencyPostDtos:Array<AgencyPostDto> = new Array<AgencyPostDto>();  
  agencyDtos:Array<AgencyDto> = new Array<AgencyDto>();  
  defaultModules: Array<any> = new Array<any>();
  agencies: Array<any> = new Array<any>(); 
  errorResponses:Array<ErrorResponse> = new Array<ErrorResponse>(); 
  showUploadedAgencies = false;
  sortOption: SortOption = new SortOption();
  csvDto:CsvDto = new CsvDto();
  @ViewChild('agencyCsvInput')
  agencyCsvInput: any;
  statusCode = 0;
  showModulesPopup = false;
  selectedAgencyId = 0;
  constructor(public agencyService:AgencyService,public logger: XtremandLogger, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
    private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch,private router: Router, public properties: Properties,
    public utilService:UtilService) {

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
    this.sortOption.selectedAgencySortDropDownOption = text;
    this.getAllFilteredResults(this.pagination, this.sortOption);
  }
  /*************************Search********************** */
  eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
  search() {
    this.getAllFilteredResults(this.pagination, this.sortOption);
  }

  getAllFilteredResults(pagination: Pagination, sortOption: SortOption) {
    pagination.pageIndex = 1;
    pagination = this.utilService.sortOptionValues(sortOption.selectedAgencySortDropDownOption, pagination);
    this.findAll(pagination);
  }
  /**************Pagination***************/
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.findAll(this.pagination);
  }

  findDefaultModules(csv:boolean,csvDto:CsvDto,agencyDto:AgencyDto) {
    this.referenceService.loading(this.addAgencyLoader, true);
    this.defaultModules = [];
    this.agencyService.findAllModules().
      subscribe(
        response => {
          this.defaultModules = response.data.modules;
          if(this.agencyDto.id!=undefined && this.agencyDto.id>0){
            let moduleIds = agencyDto.moduleIds;
            $.each(this.defaultModules,function(_index:number,module:any){
                module.enabled = moduleIds.indexOf(module.roleId)>-1;
            });
            this.validateAgencyForm();
            this.editAgency =true;
            this.ngxLoading = false;
          }else{
            this.addModuleIds();
          }
          if(csv){
            this.appendCsvDataToTable(csvDto);
          }else{
            this.referenceService.loading(this.addAgencyLoader, false);
          }
        }, error => {
          this.referenceService.loading(this.addAgencyLoader, false);
          this.ngxLoading = false;
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

   /***********Add/Edit*******************/
  goToAddAgencyDiv() {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.hideDiv('agency-csv-error-div');
    this.customResponse = new CustomResponse();
    this.agencyDto = new AgencyDto();
    this.showAddAgencyDiv = true;
    this.findDefaultModules(false,this.csvDto,this.agencyDto);
  }

   /***************Edit**********/
   edit(id:number){
    this.ngxLoading = true;
    this.customResponse = new CustomResponse(); 
    this.referenceService.scrollSmoothToTop();
    this.agencyService.getById(id).subscribe(
      response=>{
        this.statusCode = response.statusCode;
        if(this.statusCode==200){
          this.agencyDto = new AgencyDto();
          let data = response.data;
          this.agencyDto.id = data.id;
          this.agencyDto.firstName = data.firstName;
          this.agencyDto.lastName = data.lastName;
          this.agencyDto.agencyName = data.companyName;
          this.agencyDto.emailId = data.emailId;
          this.agencyDto.moduleIds = data.moduleIds;
          
        }
      },error=>{
          this.logger.errorPage(error);
      },()=>{
        if(this.statusCode==200){
          this.saveOrUpdateButtonText = "Update";
          this.findDefaultModules(false,this.csvDto,this.agencyDto);
        }
        
      }
    );
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

  changeStatus(event: any, module: any,isUploadCsv:boolean,agencyDto:any) {
    if(!isUploadCsv){
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
      this.addModuleIds();
    }else if(isUploadCsv){
      let modules = agencyDto.modules;
      if(module.moduleName=="All"){
      $.each(modules, function (_index: number, edit: any) {
        edit.enabled = event;
      });
      }else{
        module.enabled = event;
        let modulesWithoutAll = modules.filter((item:any) => item.moduleName != "All");
        let enabledModulesLength = modulesWithoutAll.filter((item:any) => item.enabled).length;
        let allModule = modules.filter((item:any) => item.moduleName == "All")[0];
        allModule.enabled = (modulesWithoutAll.length == enabledModulesLength);
      }
    }
   
  }

  addModuleIds(){
    let enabledModules = this.defaultModules.filter((item) => item.enabled);
    let moduleIds = enabledModules.map(function (a) { return a.roleId; });
    this.agencyDto.moduleIds = moduleIds;
  }

  enableOrDisableAllModules(event: any) {
    let self = this;
    $.each(self.defaultModules, function (_index: number, defaultModule: any) {
      defaultModule.enabled = event;
    });
  }
  
  addOrUpdate(){
    this.ngxLoading = true;
    this.agencyPostDto = new AgencyPostDto();
    this.agencyPostDtos = new Array<AgencyPostDto>();
    this.agencyPostDto.agencyName = this.agencyDto.agencyName;
    this.agencyPostDto.emailId = this.agencyDto.emailId.toLowerCase();
    this.agencyPostDto.firstName = this.agencyDto.firstName;
    this.agencyPostDto.lastName = this.agencyDto.lastName;
    this.agencyPostDto.moduleIds = this.agencyDto.moduleIds;
    this.agencyPostDto.id = this.agencyDto.id;
    if(this.editAgency){
      this.update();
    }else{
      this.save();
    }
    
  }

  private update() {
    this.agencyService.update(this.agencyPostDto).subscribe(
      response => {
        this.showSuccessOrFailureResponse(response);
      }, error => {
        this.showHttpError(error);
      });
  }

  private save() {
    this.agencyPostDtos.push(this.agencyPostDto);
    this.agencyService.save(this.agencyPostDtos).subscribe(
      response => {
        this.showSuccessOrFailureResponse(response);
      }, error => {
        this.showHttpError(error);
      });
  }

  private showHttpError(error: any) {
    let errorMessage = this.referenceService.showHttpErrorMessage(error);
    this.customResponse = new CustomResponse('ERROR', errorMessage, true);
    this.referenceService.scrollSmoothToTop();
    this.ngxLoading = false;
  }

  private showSuccessOrFailureResponse(response: any) {
    let statusCode = response.statusCode;
    if (statusCode == 400) {
      this.addErrorMessages(response);
    } else if (statusCode == 200) {
      this.customResponse = new CustomResponse('SUCCESS', response.message, true);
      this.clearFormAndShowList();
    }
    this.referenceService.scrollSmoothToTop();
    this.ngxLoading = false;
  }

  

  clearFormAndShowList() {
    this.agencyDto = new AgencyDto();
    this.agencyPostDto = new AgencyPostDto();
    this.editAgency =  false;
    this.showAddAgencyDiv = false;
    this.saveOrUpdateButtonText = "Save";
    this.refreshList();
  }

  cancel(){
    this.customResponse = new CustomResponse();
    this.clearFormAndShowList();
  }

  private addErrorMessages(response: any) {
    this.agencyDto.emailIdErrorMessage = "";
    this.customResponse = new CustomResponse('ERROR', this.properties.formSubmissionFailed, true);
    let data = response.data;
    this.errorResponses = data.errorMessages;
    let self = this;
    $.each(this.errorResponses, function (_index: number, errorResponse: ErrorResponse) {
      let field = errorResponse.field;
      if ("agencies[0]emailId" == field) {
        self.agencyDto.emailIdErrorMessage = errorResponse.message;
      }
    });
  }

/***************E N D OF ADD**********/
  downloadCsv(){
    this.referenceService.downloadCsvTemplate("agencies/downloadCsvTemplate/Add-Agencies.csv");
  }

  readCsvFile(event: any) {
    this.csvDto = new CsvDto();
    this.customResponse = new CustomResponse();
    this.csvDto.csvErrors = [];
    var files = event.srcElement.files;
    if (this.fileUtil.isCSVFile(files[0])) {
      $("#agency-csv-error-div").hide();
      var input = event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = (data) => {
        let csvData = reader.result;
        let csvRecordsArray = csvData['split'](/\r\n|\n/);
        let headersRow = this.fileUtil
          .getHeaderArray(csvRecordsArray);
        let headers = headersRow[0].split(',');
        if (this.validateHeaders(headers)) {
          this.csvDto.csvRecords = this.fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          if (this.csvDto.csvRecords.length > 1) {
            this.processCSVData();
          } else {
            this.showCsvFileError('You Cannot Upload Empty File');
          }
        } else {
          this.showCsvFileError('Invalid CSV');
        }
      }
      let self = this;
      reader.onerror = function () {
        self.showErrorMessageDiv('Unable to read the file');
      };
    } else {
      this.showErrorMessageDiv('Please Import csv file only');
      this.fileReset();
    }
  }

  processCSVData() {
    this.validateCsvData();
    if (this.csvDto.csvErrors.length > 0) {
      $("#agency-csv-error-div").show();
    } else {
      this.findDefaultModules(true,this.csvDto,this.agencyDto);
    }
    this.fileReset();
  }
  appendCsvDataToTable(csvDto:CsvDto) {
    let csvRecords = csvDto.csvRecords;
    for (var i = 1; i < csvRecords.length; i++) {
      let rows = csvRecords[i];
      let row = rows[0].split(',');
      let emailId = row[0].toLowerCase();
      if (emailId != undefined && $.trim(emailId).length > 0) {
        let agencyDto = new AgencyDto();
        agencyDto.emailId = emailId;
        agencyDto.firstName = row[1];
        agencyDto.lastName = row[2];
        agencyDto.agencyName= row[3];
        agencyDto.companyName = row[3];
        agencyDto.expand = false;
        agencyDto.modules = this.defaultModules;
        $.each(agencyDto.modules,function(_index:number,module:any){
           module.enabled = true;
        });
        agencyDto.module = agencyDto.modules[0];
        this.agencyDtos.push(agencyDto);
      }
    }     
    this.referenceService.loading(this.addAgencyLoader, false);
    this.showUploadedAgencies = true;
  }

  validateCsvData() {
    let csvRecords = this.csvDto.csvRecords;
    let names = csvRecords.map(function (a) { return a[0].split(',')[0].toLowerCase() });
    let duplicateEmailIds = this.referenceService.returnDuplicates(names);
    this.agencyDtos = [];
    if (duplicateEmailIds.length == 0) {
      for (var i = 1; i < csvRecords.length; i++) {
        let rows = csvRecords[i];
        let row = rows[0].split(',');
        let emailId = row[0];
        if (emailId != undefined && $.trim(emailId).length > 0) {
          if (!this.referenceService.validateEmailId(emailId)) {
            this.csvDto.csvErrors.push(emailId + " is invalid email address.");
          }
        }

      }
    } else {
      for (let d = 0; d < duplicateEmailIds.length; d++) {
        let emailId = duplicateEmailIds[d];
        if (emailId != undefined && $.trim(emailId).length > 0) {
          this.csvDto.csvErrors.push(duplicateEmailIds[d] + " is duplicate email address.");
        }
      }
    }
  }

  validateHeaders(headers: any) {
    return (headers[0] == "Email Id" && headers[1] == "First Name" && headers[2] == "Last Name" && headers[3]=="Agency Name");
  }

  showErrorMessageDiv(message: string) {
    this.customResponse = new CustomResponse('ERROR', message, true);
  }

  hideErrorMessageDiv() {
    this.customResponse = new CustomResponse('ERROR', "", false);
  }

  showCsvFileError(message: string) {
    this.customResponse = new CustomResponse('ERROR', message, true);
    this.fileReset();
  }

  fileReset() {
    if (this.agencyCsvInput != undefined) {
      this.agencyCsvInput.nativeElement.value = "";
    }
    this.csvDto = new CsvDto();
  }

  deleteRow(index: number, agency: any) {
    let emailId = agency['emailId'];
    $('#agency-' + index).remove();
    emailId = emailId.toLowerCase();
    this.agencyDtos = this.spliceArray(this.agencyDtos, emailId);
    let tableRows = $("#add-agency-table > tbody > tr").length;
    if (tableRows == 0 || this.agencyDtos.length == 0) {
      this.clearUploadCsvDataAndGoBack();
    }
  }

  spliceArray(arr: any, emailId: string) {
    arr = $.grep(arr, function (data: any, _index: number) {
      return data.emailId != emailId
    });
    return arr;
  }

  clearUploadCsvDataAndGoBack() {
    this.customResponse = new CustomResponse();
    this.showUploadedAgencies = false;
    this.agencyDtos = [];
    this.fileReset();
    this.referenceService.scrollSmoothToTop();
  }

  showOrHideModules(agencyDto:AgencyDto){
    agencyDto.expand = !agencyDto.expand;
  }

  addOrRemoveModules(event:any,agencyDto:any){
    let module = agencyDto.module;
    if (module.moduleName == "All") {
      $.each(agencyDto.modules, function (_index: number, module: any) {
        module.enabled = event;
      });

    } else {
     
    }
  }


  preview(id:number){
    this.showModulesPopup = true;
    this.selectedAgencyId = id;
  }

 


}
