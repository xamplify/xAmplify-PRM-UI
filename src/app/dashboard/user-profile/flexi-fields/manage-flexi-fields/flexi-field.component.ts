import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { UtilService } from 'app/core/services/util.service';
import { FlexiFieldService } from './../services/flexi-field.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { ErrorResponse } from 'app/util/models/error-response';
import { FlexiField } from '../models/flexi-field';
import { FLEXI_FIELD_LABELS } from './../../../../constants/flexi-field-lables.constants';

@Component({
  selector: 'app-flexi-field',
  templateUrl: './flexi-field.component.html',
  styleUrls: ['./flexi-field.component.css'],
  providers:[SortOption,HttpRequestLoader,Properties]
})
export class FlexiFieldComponent implements OnInit {

  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  flexiFields:Array<any> = new Array<any>();
  pagination:Pagination = new Pagination();
  flexiField:FlexiField = new FlexiField();
  submitButtonText = XAMPLIFY_CONSTANTS.save;
  addLoader: HttpRequestLoader = new HttpRequestLoader();
  isAdd: boolean;
  errorResponses:Array<ErrorResponse> = new Array<ErrorResponse>(); 
  errorFieldNames: Array<string> = new Array<string>();
  readonly XAMPLIFY_CONSTANTS = XAMPLIFY_CONSTANTS;
  successLabelClass = XAMPLIFY_CONSTANTS.successLabelClass;
  errorLabelClass = XAMPLIFY_CONSTANTS.errorLabelClass;
  fieldName = FLEXI_FIELD_LABELS.fieldName;
  isDeleteOptionClicked: boolean;
  selectedFieldId = 0;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public sortOption:SortOption,
    public pagerService:PagerService,public properties:Properties,public flexiFieldService:FlexiFieldService,public utilService:UtilService) { }

  ngOnInit() {
    this.findPaginatedFlexiFields(this.pagination);
  }

  findPaginatedFlexiFields(pagination:Pagination){
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.flexiFieldService.findPaginatedFlexiFields(pagination).subscribe(
      response=>{
        const data = response.data;
        let isSuccess = response.statusCode === 200;
        if(isSuccess){
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords
          pagination = this.pagerService.getPagedItems(pagination, data.list);
        }else{
          this.customResponse = new CustomResponse('ERROR',"Unable to get custom fields.",true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      },error=>{
        let message = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR',message,true);
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }


  navigateBetweenPageNumbers(event: any) {
    this.pagination.pageIndex = event.page;
    this.findPaginatedFlexiFields(this.pagination);
  }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchOnKeyPress(keyCode: any) { if (keyCode === 13) { this.search(); } }

  sortBy(text: any) {
    this.sortOption.selectedCustomFieldsSortDropDownOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedCustomFieldsSortDropDownOption, pagination);
    this.findPaginatedFlexiFields(pagination);
  }

  goToAddFlexiFieldDiv(){
    this.isAdd = true;
    this.flexiField = new FlexiField();
    this.customResponse = new CustomResponse();
    this.referenceService.hideDiv("manage-custom-fields");
    this.referenceService.showDiv("add-custom-field")
    this.submitButtonText = XAMPLIFY_CONSTANTS.save;
  }

  validateForm(){
    let isValidFieldName = this.referenceService.isValidText(this.flexiField.fieldName);
    this.flexiField.isValidForm = isValidFieldName;
    this.errorFieldNames = this.referenceService.filterArrayList(this.errorFieldNames,this.fieldName);
    this.flexiField.fieldNameLabelClass =  isValidFieldName ? this.successLabelClass :this.errorLabelClass;
  }

  goToManage(){
    this.flexiField = new FlexiField();
    this.errorResponses = [];
    this.errorFieldNames = [];
    this.referenceService.stopLoader(this.addLoader);
    this.referenceService.stopLoader(this.httpRequestLoader);
    this.customResponse = new CustomResponse();
    this.referenceService.hideDiv("add-custom-field");
    this.referenceService.showDiv("manage-custom-fields");
    this.referenceService.goToTop();
  }

  saveOrUpdate(){
    this.referenceService.startLoader(this.addLoader);
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
    this.flexiField.dupliateNameErrorMessage = "";
    this.flexiFieldService.saveOrUpdateFlexiField(this.flexiField,this.isAdd).subscribe(
      response => {
        let statusCode = response.statusCode;
        let data = response.data;
        if (statusCode==200) {
          this.goToManage();
          let message = this.isAdd ? 'created' : 'updated';
          this.customResponse = new CustomResponse('SUCCESS', 'Custom Field is  ' + message + ' successfully', true);
          this.pagination = new Pagination();
          this.sortOption = new SortOption();
          this.findPaginatedFlexiFields(this.pagination);
        }else{
          this.errorResponses = data['errorMessages'];
			    this.errorFieldNames = this.referenceService.filterSelectedColumnsFromArrayList(this.errorResponses,'field');
          this.referenceService.stopLoader(this.addLoader);
        }
      }, error => {
        let statusCode = JSON.parse(error['status']);
         if(statusCode==400 || statusCode == 409){
          let errorResponse = JSON.parse(error['_body']);
          let message = errorResponse['message'];
          if("Already Exists"==message){
            this.flexiField.dupliateNameErrorMessage = message;
          }else{
            this.customResponse = new CustomResponse('ERROR', message, true);
          }
        }else {
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        }
        this.referenceService.stopLoader(this.addLoader);
      }
    );
  }

  showConfirmSweetAlert(id:number){
    this.isDeleteOptionClicked = true;
    this.selectedFieldId = id;
  }

  delete(event:any){
    this.customResponse = new CustomResponse();
    if(event){
      this.referenceService.loading(this.httpRequestLoader, true);
      this.flexiFieldService.deleteFlexiField(this.selectedFieldId).subscribe(
        response=>{
          this.resetDeleteOptions();
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          this.refreshList();
        },error=>{
          let message = this.referenceService.showHttpErrorMessage(error);
          this.customResponse = new CustomResponse('ERROR', message, true);
          this.resetDeleteOptions();
          this.referenceService.loading(this.httpRequestLoader, false);
        }
      );
    }else{
      this.resetDeleteOptions();
    }
   
  }
  refreshList() {
    this.referenceService.scrollSmoothToTop();
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = "";
    this.findPaginatedFlexiFields(this.pagination);
  }

  resetDeleteOptions(){
    this.isDeleteOptionClicked = false;
    this.selectedFieldId = 0;
  }

}
