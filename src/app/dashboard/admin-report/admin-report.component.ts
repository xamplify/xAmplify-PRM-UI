import { Component, OnInit } from '@angular/core';
import { DashboardReport } from '../../core/models/dashboard-report';
import { DashboardService } from '../dashboard.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css'],
  providers: [Pagination]
})
export class AdminReportComponent implements OnInit {

    dashboardReport: DashboardReport = new DashboardReport();
    totalRecords: number;
    vendorsDetails: any;
    selectedVendorsDetails: any;
    detailsTielsView = false;
    selectedVendorRow: any;
    
  constructor( public dashboardService: DashboardService, public pagination: Pagination , public pagerService: PagerService, public referenceService: ReferenceService,
public authenticationService: AuthenticationService) {

  }
  
  
  getVendorsDetails() {
      try {
          this.dashboardService.getVendorsList( this.pagination )
              .subscribe(
              ( data: any ) => {
                  console.log( data );
                  this.totalRecords = data.totalRecords;
                  this.vendorsDetails = data.data;
                  this.pagination.totalRecords = this.totalRecords;
                  this.pagination = this.pagerService.getPagedItems( this.pagination, this.vendorsDetails );
              },
              error => console.error( error ),
              () => console.info( "vendors reports() finished" )
              )
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadingAllVendors()" );
      }
  }
  
  setPage( event: any ) {
      this.pagination.pageIndex = event.page;
      this.getVendorsDetails();

  }
  
  onChangeAllContactUsers( event: Pagination ) {
      try {
          this.pagination = event;
          this.getVendorsDetails();
          
      } catch ( error ) {
          console.error( error, "adminreport", "getAdminList" );
      }
  }
  
  selectedVendorDetails(selectedVendor:any){
      try {
          this.selectedVendorRow = selectedVendor;
          this.authenticationService.selectedVendorId = selectedVendor.id;
          this.dashboardService.loadDashboardReportsCount( selectedVendor.id )
              .subscribe(
              ( data: any ) => {
                  console.log( data );
                  this.selectedVendorsDetails = data;
                 this.detailsTielsView = true;
              },
              error => console.error( error ),
              () => console.info( "selectedVendors reports() finished" )
              )
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadingSelectedVendorsDetails()" );
      }
  }
  

  ngOnInit() {
      this.getVendorsDetails();
      

  }

}
