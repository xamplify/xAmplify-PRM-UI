import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomFieldService } from '../services/custom-field.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { UtilService } from 'app/core/services/util.service';
@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css'],
  providers:[SortOption,HttpRequestLoader,Properties]
})
export class CustomFieldsComponent implements OnInit {
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  customFields:Array<any> = new Array<any>();
  pagination:Pagination = new Pagination();
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public sortOption:SortOption,
    public pagerService:PagerService,public properties:Properties,public customFieldService:CustomFieldService,public utilService:UtilService) { }

  ngOnInit() {
    this.findPaginatedCustomFields(this.pagination);
  }

  findPaginatedCustomFields(pagination:Pagination){
    this.referenceService.scrollSmoothToTop();
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.customFieldService.findPaginatedCustomFields(pagination).subscribe(
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


}
