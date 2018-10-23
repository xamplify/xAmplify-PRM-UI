import { Component, OnInit } from '@angular/core';
import { DashboardReport } from '../../core/models/dashboard-report';
import { DashboardService } from '../dashboard.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Router } from '@angular/router';

declare var swal:any;

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css'],
  providers: [Pagination, HttpRequestLoader]
})

export class AdminReportComponent implements OnInit {
    dashboardReport: DashboardReport = new DashboardReport();
    public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    totalRecords: number;
    vendorsDetails: any;
    selectedVendorsDetails: any;
    detailsTielsView = false;
    selectedVendorRow: any;
    loading = false;
    isListLoading = false;
    public searchKey: string;
    
    sortcolumn: string = null;
    sortingOrder: string = null;

    
    sortOptions = [
                   { 'name': 'Sort by', 'value': '' },
                   { 'name': 'Conpany name (A-Z)', 'value': 'companyName-ASC' },
                   { 'name': 'Company name (Z-A)', 'value': 'companyName-DESC' },
                   { 'name': 'Last login (ASC)', 'value': 'lastLogin-ASC'},
                   { 'name': 'Last login (DESC)', 'value': 'lastLogin-DESC'},

               ];
    public sortOption: any = this.sortOptions[0];
    
    
    
  constructor( public dashboardService: DashboardService, public pagination: Pagination , public pagerService: PagerService, public referenceService: ReferenceService,
public authenticationService: AuthenticationService, public router:Router) {

  }
  
  eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }
  
  search() {
      
      try {
              this.pagination.searchKey = this.searchKey;
              this.pagination.pageIndex = 1;
              this.getVendorsDetails();
      } catch ( error ) {
          console.error( error, "ManageContactsComponent", "sorting()" );
      }
  }
  
  
  sortByOption( event: any ) {
      try {
          this.sortOption = event;
          const sortedValue = this.sortOption.value;
          if ( sortedValue !== '' ) {
              const options: string[] = sortedValue.split( '-' );
              this.sortcolumn = options[0];
              this.sortingOrder = options[1];
          } else {
              this.sortcolumn = null;
              this.sortingOrder = null;
          }
              this.pagination.pageIndex = 1;
              this.pagination.sortcolumn = this.sortcolumn;
              this.pagination.sortingOrder = this.sortingOrder;
              this.getVendorsDetails();
      } catch ( error ) {
          console.error( error, "ManageContactsComponent", "sorting()" );
      }
  }
  
  
  getVendorsDetails() {
      try {
          this.isListLoading = true;
          this.dashboardService.getVendorsList( this.pagination )
              .subscribe(
              ( data: any ) => {
                  console.log( data );
                  this.totalRecords = data.totalRecords;
                  this.vendorsDetails = data.data;
                  this.pagination.totalRecords = this.totalRecords;
                  this.pagination = this.pagerService.getPagedItems( this.pagination, this.vendorsDetails );
                  this.isListLoading = false;
              },
              error => console.error( error ),
              () => console.info( "vendors reports() finished" )
              )
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadingAllVendors()" );
      }
  }
  
  
  getVendorCompanyProfile(report:any) {
      try {
          this.authenticationService.selectedVendorId = report.id; 
          
          
          this.router.navigate(['/home/dashboard/edit-company-profile'])
          /*this.dashboardService.getVendorsCompanyProfile( report.id )
              .subscribe(
              ( data: any ) => {
                  console.log( data );
                  
              },
              error => console.error( error ),
              () => console.info( "vendors reports companyProfile() finished" )
              )*/
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadCompanyProfile()" );
      }
  }
  
  getVendorMyProfile(report:any) {
      try {
          this.dashboardService.getVendorsMyProfile( report.emailId )
              .subscribe(
              ( data: any ) => {
                  this.authenticationService.venorMyProfileReport = data;
                  console.log( data );
                  this.router.navigate(['/home/dashboard/myprofile'])
                  
              },
              error => console.error( error ),
              () => console.info( "vendors reports myProfile() finished" )
              )
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadMyProfile()" );
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
          this.loading = true;
          if(!selectedVendor.companyId){
              this.loading = false;
              swal("Vedor has signed up but not yet created company information.");
          }else{
    	  this.selectedVendorRow = selectedVendor;
          this.authenticationService.selectedVendorId = selectedVendor.id;
          this.dashboardService.loadDashboardReportsCount( selectedVendor.id )
              .subscribe(
              ( data: any ) => {
                  console.log( data );
                  this.selectedVendorsDetails = data;
                 this.detailsTielsView = true;
                 this.loading = false;
              },
              error => console.error( error ),
              () => {
                  this.loading = false;
                  console.info( "selectedVendors reports() finished" )
                  }
              )
          }
      } catch ( error ) {
          console.error( error, "adminReportComponent", "loadingSelectedVendorsDetails()" );
      }
  }
  

  ngOnInit() {
      this.getVendorsDetails();
      

  }

}
