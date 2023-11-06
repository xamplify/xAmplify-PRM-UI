import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../dashboard.service";
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from 'app/common/models/properties';

@Component({
  selector: 'app-vendor-request-report',
  templateUrl: './vendor-request-report.component.html',
  styleUrls: ['./vendor-request-report.component.css'],
  providers: [DashboardService, Pagination, HttpRequestLoader,Properties]
})
export class VendorRequestReportComponent implements OnInit {

    vendorRequestReport: any;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    
    allVendorsCount: number = 0;
    approvedVendorsCount: number = 0;
    invitedVendorsCount: number = 0;
    declinedVendorsCount: number = 0;
    statusType = '';
    
  constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService,
     public dashboardService: DashboardService, public pagerService: PagerService,
      public pagination: Pagination,public properties:Properties) { }

  paginationDropDown( event: Pagination ) {
       this.pagination = event;
       this.listOfVendorRequestReports(this.statusType);
  }
  
  setPage( event: any ) {
      this.pagination.pageIndex = event.page;
      this.listOfVendorRequestReports(this.statusType);
  }
  
  requestVendorsReportCount() {
      try {
          this.dashboardService.loadRequestedVendorsCount(this.authenticationService.user.id)
              .subscribe(
              data => {
                  this.allVendorsCount = data.ALL;
                  this.approvedVendorsCount = data.APPROVED;
                  this.invitedVendorsCount = data.INVITED;
                  this.declinedVendorsCount = data.DECLINED;
              },
              ( error: any ) => {
                  console.error( error );
              },
              () => console.log( "LoadContactsCount Finished" )
              );
      } catch ( error ) {
          console.error( error, "ManageContactsComponent", "ContactReportCount()" );
      }
  }
  
  listOfVendorRequestReports(statusType: any) {
      this.statusType = statusType;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.pagination.userId = this.authenticationService.user.id;
      this.pagination.filterBy = statusType;
      this.dashboardService.listOfVendorRequestLogs(this.pagination)
          .subscribe(
              (data: any) => {
                  console.log(data);
                  if(data.referredVendors.length === 0){
                      this.customResponse = new CustomResponse( 'INFO','No records found', true );
                  }
                  this.vendorRequestReport = data.referredVendors;
                  this.pagination.totalRecords = data.totalRecords;
                  this.pagination = this.pagerService.getPagedItems(this.pagination, this.vendorRequestReport);
                  this.referenceService.loading(this.httpRequestLoader, false);
              },
              error => console.log(error),
              () => console.log('finished')
          );
  }

  
  ngOnInit() {
      this.requestVendorsReportCount();
      this.listOfVendorRequestReports('ALL');
  }

}
