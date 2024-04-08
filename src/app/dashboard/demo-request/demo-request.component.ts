import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';

declare var  $: any;
@Component({
  selector: 'app-demo-request',
  templateUrl: './demo-request.component.html',
  styleUrls: ['./demo-request.component.css','../admin-report/admin-report.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties,SortOption]
})
export class DemoRequestComponent implements OnInit {
    hasError: boolean;
    statusCode: any;
    pagination: Pagination = new Pagination();
    constructor(public dashboardService:DashboardService,public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader,
        public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router, 
        public logger: XtremandLogger, public sortOption: SortOption,private utilService:UtilService ) { }

  ngOnInit() {
      this.listDemoRequests(this.pagination);
  }
  
  listDemoRequests(pagination:Pagination){
      this.hasError = false;
      this.referenceService.loading( this.httpRequestLoader, true );
      this.dashboardService.listDemoRequests( pagination ).subscribe(
          ( response: any ) => {
              this.statusCode = response.statusCode;
              if(this.statusCode==200){
                  const data = response.data;
                  pagination.totalRecords = data.totalRecords;
                  this.sortOption.totalRecords = data.totalRecords;
                  $.each(data.demoRequests,function(index,request){
                      if($.trim(request.createdTimeInString).length>0){
                          request.displayTime = new Date(request.createdTimeInString);
                      }else{
                          request.displayTime = new Date();
                      }
                 });
                  pagination = this.pagerService.getPagedItems(pagination, data.demoRequests);
              }
              
              this.referenceService.loading( this.httpRequestLoader, false );
          },
          ( error: any ) => { this.hasError = true; this.referenceService.loading( this.httpRequestLoader, false );} );
  }
  
  
  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy( text: any ) {
      this.sortOption.selectedDemoRequestSortOption = text;
      this.getAllFilteredResults( this.pagination );
  }


  /*************************Search********************** */
  search() {
      this.getAllFilteredResults( this.pagination );
  }
  
  paginationDropdown(items:any){
      this.sortOption.itemsSize = items;
      this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage( event: any ) {
      this.pagination.pageIndex = event.page;
      this.listDemoRequests( this.pagination);
  }

  getAllFilteredResults( pagination: Pagination ) {
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.sortOption.searchKey;
      this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedDemoRequestSortOption, this.pagination);
      this.listDemoRequests( this.pagination);
  }
  eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }
  refreshList(){
      this.pagination.pageIndex = 1;
      this.sortOption.searchKey = "";
      this.pagination.searchKey = "";
      this.sortOption.selectedDemoRequestSortOption = this.sortOption.demoRequestSortOptions[7];
      this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedDemoRequestSortOption, this.pagination);
      this.listDemoRequests(this.pagination);
  }
  
  
  

}
