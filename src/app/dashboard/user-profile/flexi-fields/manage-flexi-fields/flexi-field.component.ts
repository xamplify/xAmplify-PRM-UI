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
  customFields:Array<any> = new Array<any>();
  pagination:Pagination = new Pagination();
  customField:FlexiField = new FlexiField();
  submitButtonText = XAMPLIFY_CONSTANTS.save;
  addLoader: HttpRequestLoader = new HttpRequestLoader();
  isAdd: boolean;
  errorResponses:Array<ErrorResponse> = new Array<ErrorResponse>(); 
  errorFieldNames: Array<string> = new Array<string>();
  readonly XAMPLIFY_CONSTANTS = XAMPLIFY_CONSTANTS;
  successLabelClass = XAMPLIFY_CONSTANTS.successLabelClass;
  errorLabelClass = XAMPLIFY_CONSTANTS.errorLabelClass;
  fieldName = FLEXI_FIELD_LABELS.fieldName;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public sortOption:SortOption,
    public pagerService:PagerService,public properties:Properties,public flexiFieldService:FlexiFieldService,public utilService:UtilService) { }

  ngOnInit() {
    this.findPaginatedCustomFields(this.pagination);
  }

  findPaginatedCustomFields(pagination:Pagination){
    this.referenceService.scrollSmoothToTop();
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.flexiFieldService.findPaginatedCustomFields(pagination).subscribe(
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
    this.findPaginatedCustomFields(this.pagination);
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
    this.findPaginatedCustomFields(pagination);
  }

  goToAddCustomFieldDiv(){
    this.isAdd = true;
    this.customField = new FlexiField();
    this.customResponse = new CustomResponse();
    this.referenceService.hideDiv("manage-custom-fields");
    this.referenceService.showDiv("add-custom-field")
    this.submitButtonText = XAMPLIFY_CONSTANTS.save;
  }

  validateForm(){
    let isValidFieldName = this.referenceService.isValidText(this.customField.fieldName);
    this.customField.isValidForm = isValidFieldName;
    this.errorFieldNames = this.referenceService.filterArrayList(this.errorFieldNames,this.fieldName);
    this.customField.fieldNameLabelClass =  isValidFieldName ? this.successLabelClass :this.errorLabelClass;
    console.log(this.errorResponses);
    let new_updated_data =
    this.errorResponses.map((errorResponse:ErrorResponse) => {
        if (errorResponse.field == this.fieldName) {
            return {
                ...errorResponse,
                message: "Anthony",
            };
        }
        return errorResponse;
    });
    console.log(new_updated_data);
  }

  goToManage(){
    this.customField = new FlexiField();
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
    this.customField.dupliateNameErrorMessage = "";
    this.flexiFieldService.saveOrUpdateCustomField(this.customField,this.isAdd).subscribe(
      response => {
        let statusCode = response.statusCode;
        let data = response.data;
        if (statusCode==200) {
          this.goToManage();
          let message = this.isAdd ? 'created' : 'updated';
          this.customResponse = new CustomResponse('SUCCESS', 'Custom Field is  ' + message + ' successfully', true);
          this.pagination = new Pagination();
          this.sortOption = new SortOption();
          this.findPaginatedCustomFields(this.pagination);
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
            this.customField.dupliateNameErrorMessage = message;
          }else{
            this.customResponse = new CustomResponse('ERROR', message, true);
          }
        }else {
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        }
      }
    );
  }

}
