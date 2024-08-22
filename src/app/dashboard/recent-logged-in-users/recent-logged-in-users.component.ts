import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Properties } from '../../common/models/properties';
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
declare var $, swal: any;
@Component({
  selector: 'app-recent-logged-in-users',
  templateUrl: './recent-logged-in-users.component.html',
  styleUrls: ['./recent-logged-in-users.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class RecentLoggedInUsersComponent implements OnInit {

  @Input() type: string;
  tableHeaderText: string = "";
  pagination: Pagination = new Pagination();
  hasError: boolean;
  loading = false;
  @Output() notifyAdminReportComponent = new EventEmitter();
  copyIconButtonId = "";
  constructor(public dashboardService: DashboardService, public pagerService: PagerService, public referenceService: ReferenceService, public authenticationService: AuthenticationService, public router: Router,
    public xtremandLogger: XtremandLogger, public utilService: UtilService, public sortOption: SortOption, public httpRequestLoader: HttpRequestLoader, ) {
    if (this.authenticationService.getUserId() != 1) {
      this.router.navigate(['/access-denied']);
    }
  }

  ngOnInit() {
    this.tableHeaderText = "registered" == this.type ? ' Registered On ' : ' Last Login';
    this.copyIconButtonId = "registered" == this.type ? 'registered' : 'loggedIn';
    this.listUsersByType(this.pagination);
  }

  listUsersByType(pagination: Pagination) {
    this.hasError = false;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dashboardService.findUsersByType(pagination, this.type).subscribe(
      response => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        $.each(data.list, function (_index: number, list: any) {
          list.registeredOn = new Date(list.registeredOnInUTCString);
          list.lastLogin = new Date(list.lastLoginInUTCString);
        });
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        this.referenceService.loading(this.httpRequestLoader, false);
      }, _error => {
        this.hasError = true;
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    );
  }

  navigateToNextPage(event: any) {
    this.referenceService.goToDiv("registeredOrLoggedIn");
    this.pagination.pageIndex = event.page;
    this.listUsersByType(this.pagination);
  }

  usersSearchOnKeyEvent(keyCode: any) { if (keyCode === 13) { this.seachUsers(); } }

  /*************************Sort********************** */
  sortBy(text: any) {
    if (this.type == "registered") {
      this.sortOption.selectedRegisteredUsersSortDropDownOption = text;
    } else if (this.type == "logged in") {
      this.sortOption.selectedLoggedInUsersSortDropDownOption = text;
    }
    this.getAllFilteredResults(this.pagination, this.sortOption);
  }
  /*************************Search********************** */
  seachUsers() {
    this.getAllFilteredResults(this.pagination, this.sortOption);
  }
  getAllFilteredResults(pagination: Pagination, sortOption: SortOption) {
    pagination.pageIndex = 1;
    pagination.searchKey = sortOption.searchKey;
    if (this.type == "registered") {
      pagination = this.utilService.sortOptionValues(sortOption.selectedRegisteredUsersSortDropDownOption, pagination);
    } else if (this.type == "logged in") {
      pagination = this.utilService.sortOptionValues(sortOption.selectedLoggedInUsersSortDropDownOption, pagination);
    }
    this.listUsersByType(pagination);
  }

  refreshList() {
    this.listUsersByType(this.pagination);
  }

  goToVendorCompanyProfile(user: any) {
    this.loading = true;
    this.authenticationService.selectedVendorId = user.userId;
    this.router.navigate(['/home/dashboard/edit-company-profile']);
  }

  goToMyProfile(user: any) {
    this.loading = true;
    this.dashboardService.getVendorsMyProfile(user.emailId)
      .subscribe(
        (data: any) => {
          this.authenticationService.venorMyProfileReport = data;
          this.router.navigate(['/home/dashboard/myprofile'])
        },
        error => {
          this.loading = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        }
      )
  }

  
  navigateToDashboardStats(report:any){
    this.loading = true;
    this.referenceService.goToRouter('/home/dashboard/dashboard-stats/'+report.userId+"/"+report.companyId);
   } 

   copyRecentUserEmailAddress(inputElement:any,index:number){
    let id = 'copied-recent-users-email-address-' + index+"-"+this.copyIconButtonId;
    this.referenceService.copySelectedElement(inputElement,id);
	}
}
