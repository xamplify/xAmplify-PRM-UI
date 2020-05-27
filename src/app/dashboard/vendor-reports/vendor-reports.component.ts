import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service";
import { ReferenceService } from "../../core/services/reference.service";
import { Pagination } from "../../core/models/pagination";
import { DashboardService } from "../dashboard.service";
import { PagerService } from "../../core/services/pager.service";
import { PaginationComponent } from "../../common/pagination/pagination.component";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomResponse } from '../../common/models/custom-response';
import { VanityURLService } from "app/vanity-url/services/vanity.url.service";
declare var $: any;

@Component({
  selector: "app-vendor-reports",
  templateUrl: "./vendor-reports.component.html",
  styleUrls: ["./vendor-reports.component.css"],
  providers: [Pagination, PaginationComponent]
})
export class VendorReportsComponent implements OnInit {
  vendorDetails: any;
  loading = false;
  customResponse: CustomResponse = new CustomResponse();

  constructor(
    public referenseService: ReferenceService,
    public pagination: Pagination,
    public dashboardService: DashboardService,
    public authenticationService: AuthenticationService,
    public pagerService: PagerService,
    public paginationComponent: PaginationComponent,
    private router: Router,
    private vanityURLService: VanityURLService
  ) {

  }

  vendorReports() {
    this.loading = true;
    this.dashboardService
      .loadVendorDetails(
        this.authenticationService.getUserId(),
        this.pagination
      )
      .subscribe(
        data => {
          this.vendorDetails = data.data;
          this.pagination.totalRecords = data.totalRecords;
          this.pagination = this.pagerService.getPagedItems(
            this.pagination,
            this.vendorDetails
          );
          this.loading = false;
        },
        error => console.log(error),
        () => {
          console.log("vendor reports completed");
          this.loading = false;
        }
      );
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.vendorReports();
  }

  onChangeAllVendors(event: Pagination) {
    this.pagination = event;
    this.vendorReports();
  }

  navigateToVendorCampaigns(venderReport: any) {
    this.loading = true;
    this.referenseService.vendorDetails = venderReport;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    //this.router.navigateByUrl("/home/campaigns/vendor/all"); 

    this.vanityURLService.getCompanyProfileNameByCompanyName(venderReport.companyName).subscribe(result => {
      if (result.statusCode === 200) {
        let vanityURL = result.data + "au/" + this.authenticationService.user.alias;
        window.open(vanityURL);
      }
    });

  }
  errorHandler(event) {
    event.target.src = 'assets/images/default-company.png';
  }


  ngOnInit() {
    this.vendorReports();
  }
}
