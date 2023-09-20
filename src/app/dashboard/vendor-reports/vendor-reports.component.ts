import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service";
import { ReferenceService } from "../../core/services/reference.service";
import { Pagination } from "../../core/models/pagination";
import { DashboardService } from "../dashboard.service";
import { PagerService } from "../../core/services/pager.service";
import { CustomResponse } from "../../common/models/custom-response";
import { VanityURLService } from "app/vanity-url/services/vanity.url.service";
import { VanityLoginDto } from "app/util/models/vanity-login-dto";

@Component({
  selector: "app-vendor-reports",
  templateUrl: "./vendor-reports.component.html",
  styleUrls: ["./vendor-reports.component.css"],
  providers: [Pagination],
})
export class VendorReportsComponent implements OnInit {
  vendorDetails: any;
  loading = false;
  customResponse: CustomResponse = new CustomResponse();
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  
  constructor(
    public referenseService: ReferenceService,
    public pagination: Pagination,
    public dashboardService: DashboardService,
    public authenticationService: AuthenticationService,
    public pagerService: PagerService,
    private vanityURLService: VanityURLService
  ) {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.authenticationService.getUserId();
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.userId = this.authenticationService.getUserId();
      this.vanityLoginDto.vanityUrlFilter = false;
    }
  }


  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getVendors();
  }

  onChangeAllVendors(event: Pagination) {
    this.pagination = event;
    this.getVendors();
  }

  navigateToVendorCampaigns(venderReport: any, moduleToRedirect: any) {
    this.loading = true;
    this.referenseService.vendorDetails = venderReport;
    this.vanityURLService
      .findCompanyProfileNameByCompanyId(venderReport.companyId)
      .subscribe((result) => {
        if (result.statusCode === 200) {
          let vanityURL =
            result.data + "au/" + this.authenticationService.user.alias + "/" + moduleToRedirect.toLowerCase();
          window.open(vanityURL);
          this.loading = false;
        } else if (result.statusCode === 100) {
          window.open("/vanity-domain-error");
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        this.referenseService.showSweetAlertServerErrorMessage();
      });
  }
  errorHandler(event: any) {
    event.target.src = "assets/images/default-company.png";
  }

  ngOnInit() {
    this.getVendors();
  }

  getVendors() {
    this.loading = true;
    this.referenseService.scrollSmoothToTop();
    this.pagination.partnerId = this.authenticationService.getUserId();
    if (this.vanityLoginDto.vanityUrlFilter) {
      this.pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }

    this.dashboardService
      .getVendors(this.pagination)
      .subscribe(
        (data) => {
          this.vendorDetails = data.data;
          this.pagination.totalRecords = data.totalRecords;
          this.pagination = this.pagerService.getPagedItems(
            this.pagination,
            this.vendorDetails
          );
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.referenseService.showSweetAlertServerErrorMessage();
        }
      );
  }
  
  userProfileErrorHandler(event: any) {
    event.target.src = "assets/images/icon-user-default.png";
  }

}
