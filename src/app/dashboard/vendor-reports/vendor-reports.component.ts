import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Pagination } from '../../core/models/pagination';
import { DashboardService } from '../dashboard.service';
import { PagerService } from '../../core/services/pager.service';
import { PaginationComponent } from '../../common/pagination/pagination.component';

@Component({
  selector: 'app-vendor-reports',
  templateUrl: './vendor-reports.component.html',
  styleUrls: ['./vendor-reports.component.css'],
  providers: [ Pagination, PaginationComponent]
})
export class VendorReportsComponent implements OnInit {

    vendorDetails: any;
    
  constructor(public referenseService:ReferenceService, public pagination: Pagination, public dashboardService: DashboardService,
              public authenticationService: AuthenticationService, public pagerService: PagerService, public paginationComponent: PaginationComponent) { 
  
  }
  
  vendorReports() {
      this.pagination.maxResults = 6;
      this.dashboardService.loadVendorDetails(this.authenticationService.getUserId(), this.pagination)
          .subscribe(
              data => {
                  this.vendorDetails = data.data;
                  
                  this.pagination.totalRecords = data.totalRecords;
                  this.pagination = this.pagerService.getPagedItems( this.pagination, this.vendorDetails.data );
              },
              error => console.log(error),
              () => console.log('vendor reports completed')
          );
  }
  
  setPage( event: any ) {
          this.pagination.pageIndex = event.page;
          this.vendorReports();
  }
  
  onChangeAllVendors( event: Pagination ) {
      this.pagination = event;
      this.vendorReports();

  }

  ngOnInit() {
      this.vendorReports();
  
  }

}
