import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../dashboard.service";
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { TeamMemberService } from 'app/team/services/team-member.service';

@Component({
    selector: 'app-vendor-request-report',
    templateUrl: './vendor-request-report.component.html',
    styleUrls: ['./vendor-request-report.component.css'],
    providers: [DashboardService, Pagination, HttpRequestLoader, Properties, SortOption, TeamMemberService]
})
export class VendorRequestReportComponent implements OnInit {

    vendorRequestReport: any;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();

    allVendorsCount: number = 0;
    approvedVendorsCount: number = 0;
    invitedVendorsCount: number = 0;
    declinedVendorsCount: number = 0;
    statusType = '';
    tableHeader = "";
    /***** XNFR-805 *****/
    isTeamMemberRequest = false;
    /***** XNFR-850 *****/
    filterActiveBg: string;
    public teamMemberInfoFilters: Array<any>;
    showFilterOption: boolean = false;
    public multiSelectPlaceholder: string = "Select Invited By";
    public dateFilterText: string = "Select Date Filter";
    filterResponse: CustomResponse = new CustomResponse();

    constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService,
        public dashboardService: DashboardService, public pagerService: PagerService, public pagination: Pagination, 
        public properties: Properties, public sortOption: SortOption, public utilService: UtilService, private teamMemberService: TeamMemberService) {
        let currentUrl = this.referenceService.getCurrentRouteUrl();
        this.isTeamMemberRequest = currentUrl.includes('team-member-request') ? true : false;
    }

    paginationDropDown(event: Pagination) {
        this.pagination = event;
        this.listOfResults(this.statusType);
    }

    setPage(event: any) {
        this.pagination.pageIndex = event.page;
        this.listOfRequestReports(this.statusType);
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
                    (error: any) => {
                        console.error(error);
                    },
                    () => console.log("LoadContactsCount Finished")
                );
        } catch (error) {
            console.error(error, "ManageContactsComponent", "ContactReportCount()");
        }
    }

    listOfVendorRequestReports(statusType: any) {
        this.statusType = statusType;
        if ("INVITED" == statusType) {
            this.tableHeader = this.properties.InvitedVendorAnalytics;
        } else {
            this.tableHeader = statusType + " " + this.properties.InvitedVendorAnalytics;
        }
        this.referenceService.loading(this.httpRequestLoader, true);
        this.pagination.userId = this.authenticationService.user.id;
        this.pagination.filterBy = statusType;
        this.dashboardService.listOfVendorRequestLogs(this.pagination)
            .subscribe(
                (data: any) => {
                    console.log(data);
                    if (data.referredVendors.length === 0) {
                        this.customResponse = new CustomResponse('INFO', 'No records found', true);
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
        if (this.isTeamMemberRequest) {
            this.loadTeamMembersReportCount();
            this.pagination = this.utilService.sortOptionValues(
                this.sortOption.teamMemberAnalyticsSortOptions,
                this.pagination
            );
            this.listOfResults('ALL');
            this.findPrimaryAdminAndExtraAdmins();
        } else {
            if (this.sortOption.inviteTeamMemberAnalyticsDropDownOptions &&
                this.sortOption.inviteTeamMemberAnalyticsDropDownOptions.length > 2) {

                this.sortOption.inviteTeamMemberAnalyticsDropDownOptions =
                    this.sortOption.inviteTeamMemberAnalyticsDropDownOptions.slice(2);
            }
            this.requestVendorsReportCount();
            this.listOfVendorRequestReports('ALL');
            this.pagination = this.utilService.sortOptionValues(
                this.sortOption.teamMemberAnalyticsSortOptions,
                this.pagination
            );
        }
    }


    /***** XNFR-805 *****/
    listOfRequestReports(statusType: any) {
        if (this.isTeamMemberRequest) {
            this.listOfTeamMemberReports(statusType);
        } else {
            this.listOfVendorRequestReports(statusType);
        }
    }

    listOfResults(statusType: any) {
        this.pagination.pageIndex = 1;
        this.listOfRequestReports(statusType);
    }

    /***** XNFR-805 *****/
    loadTeamMembersReportCount() {
        this.dashboardService.loadTeamMembersReportCount()
            .subscribe(data => {
                this.allVendorsCount = data.ALL;
                this.approvedVendorsCount = data.APPROVE;
                this.invitedVendorsCount = data.UNAPPROVED;
                this.declinedVendorsCount = data.DECLINE;
            }, (error: any) => {
                console.log(error);
            });
    }

    /***** XNFR-805 *****/
    listOfTeamMemberReports(type: string) {
        this.statusType = type;
        const statusMap = { ALL: 'ALL', APPROVED: 'ACTIVATED', INVITED: '', DECLINED: 'DEACTIVATED' };
        this.tableHeader = statusMap[type] + ' ' + this.properties.invitedTeamMeberAnalytics;
        this.referenceService.loading(this.httpRequestLoader, true);
        this.customResponse = new CustomResponse();
        this.dashboardService.listOfTeamMemberRequestReports(this.pagination, this.getStatusType(type))
            .subscribe((data: any) => {
                console.log(data);
                if (data.list.length === 0) {
                    this.customResponse = new CustomResponse('INFO', 'No records found', true);
                }
                this.vendorRequestReport = data.list;
                this.pagination.totalRecords = data.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.vendorRequestReport);
                this.referenceService.loading(this.httpRequestLoader, false);
            }, error => {
                console.log(error);
                this.referenceService.loading(this.httpRequestLoader, false);
                this.referenceService.showSweetAlertServerErrorMessage();
            });
    }

    /***** XNFR-805 *****/
    getStatusType(status) {
        const statusMap = {
            UNAPPROVED: 'INVITED', APPROVE: 'ACTIVATED', DECLINE: 'DEACTIVATED',
            INVITED: 'UNAPPROVED', APPROVED: 'APPROVE', DECLINED: 'DECLINE', ALL: 'ALL'
        };
        return this.isTeamMemberRequest ? statusMap[status] : status;
    }

    /***** XNFR-850 *****/
    searchDataOnKeyPress(keyCode: any) { if (keyCode === 13) { this.listOfResults(this.statusType); } }

    /***** XNFR-850 *****/
    sortOptionDropdown(sortBy: any) {
        this.sortOption.teamMemberAnalyticsSortOptions = sortBy;
        this.pagination = this.utilService.sortOptionValues(this.sortOption.teamMemberAnalyticsSortOptions, this.pagination);
        this.listOfResults(this.statusType);
    }

    /***** XNFR-850 *****/
    downloadTeamMembersCsv() {
        let loggedInUserId = this.authenticationService.getUserId();
        let pageIndex = this.pagination.pageIndex;
        let maxResults = this.pagination.maxResults;
        this.pagination.pageIndex = 1;
        this.pagination.maxResults = this.pagination.totalRecords;
        let pageableUrl = this.referenceService.getPagebleUrl(this.pagination);
        this.pagination.maxResults = maxResults;
        this.pagination.pageIndex = pageIndex;
             window.location.href = this.authenticationService.REST_URL + "teamMember/invite-team-member/downloadCsv/type/" + this.getStatusType(this.statusType) + "?userId=" + loggedInUserId + "&access_token=" + this.authenticationService.access_token + pageableUrl;
    }


    downloadInviteVendorCsv() {
        let pageIndex = this.pagination.pageIndex;
        let maxResults = this.pagination.maxResults;
        this.pagination.loginAsUserId = this.authenticationService.getUserId();
        this.pagination.maxResults = this.pagination.totalRecords;
        let pageableUrl = this.referenceService.getPagebleUrl(this.pagination);
        let url = this.authenticationService.REST_URL + "partnership"
            + "/vendor-invitation/download/Csv"
            + "?access_token=" + this.authenticationService.access_token + pageableUrl;
        this.referenceService.openWindowInNewTab(url);
        this.pagination.maxResults = maxResults;
        this.pagination.pageIndex = pageIndex;
    }
    /***** XNFR-850 *****/
    clickFilterOption() {
        this.showFilterOption = !this.showFilterOption;
        this.filterResponse.isVisible = false;
    }

    /***** XNFR-850 *****/
    findPrimaryAdminAndExtraAdmins() {
        this.teamMemberInfoFilters = [];
        this.teamMemberService.findPrimaryAdminAndExtraAdmins()
            .subscribe(response => {
                response.data.forEach((admin) => {
                    this.teamMemberInfoFilters.push(admin.emailId);
                });
            }, error => {
                this.teamMemberInfoFilters = [];
                this.filterResponse = new CustomResponse('ERROR', "Enable to get the admin's email id(s)", true);
                console.log(error);
            });
    }

    /***** XNFR-850 *****/
    closeFilterOption() {
        this.showFilterOption = false;
        this.clearFilter();
    }

    /***** XNFR-850 *****/
    clearFilter() {
        this.pagination.fromDateFilterString = '';
        this.pagination.toDateFilterString = '';
        this.pagination.filterBy = [];
        this.filterActiveBg = 'defaultFilterACtiveBg';
        this.listOfResults(this.statusType);
    }

    /***** XNFR-850 *****/
    validateDateFilter() {
        if (this.pagination.fromDateFilterString && this.pagination.toDateFilterString) {
            var fromDate = Date.parse(this.pagination.fromDateFilterString);
            var toDate = Date.parse(this.pagination.toDateFilterString);
            if (fromDate <= toDate) {
                this.applyFilters();
            } else {
                this.filterResponse = new CustomResponse('ERROR', "From Date should be less than To Date", true);
            }
        } else if (this.pagination.fromDateFilterString && !this.pagination.toDateFilterString) {
            this.filterResponse = new CustomResponse('ERROR', "Please Select To Date", true);
        } else if (!this.pagination.fromDateFilterString && this.pagination.toDateFilterString) {
            this.filterResponse = new CustomResponse('ERROR', "Please Select From Date", true);
        } else {
            if (this.pagination.filterBy != null && this.pagination.filterBy.length > 0) {
                this.applyFilters();
            } else {
                this.filterResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
            }
        }
    }

    /***** XNFR-850 *****/
    applyFilters() {
        this.showFilterOption = false;
        this.filterResponse.isVisible = false;
        this.filterActiveBg = 'filterActiveBg';
        this.listOfResults(this.statusType);
    }

}
