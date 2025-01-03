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
    providers: [DashboardService, Pagination, HttpRequestLoader, Properties]
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

    constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService,
        public dashboardService: DashboardService, public pagerService: PagerService,
        public pagination: Pagination, public properties: Properties) {
        let currentUrl = this.referenceService.getCurrentRouteUrl();
        if (currentUrl.includes('team-member-request')) {
            this.isTeamMemberRequest = true;
        }
    }

    paginationDropDown(event: Pagination) {
        this.pagination = event;
        this.listOfVendorRequestReports(this.statusType);
    }

    setPage(event: any) {
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
            this.listOfTeamMemberReports('ALL');
        } else {
            this.requestVendorsReportCount();
            this.listOfVendorRequestReports('ALL');
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
        this.tableHeader = type + " " + this.properties.invitedTeamMeberAnalytics;
        this.referenceService.loading(this.httpRequestLoader, true);
        type = type === 'INVITED' ? 'UNAPPROVED' : type;
        this.dashboardService.listOfTeamMemberRequestReports(type)
            .subscribe((data: any) => {
                console.log(data);
                if (data.inviteTeamMembers.length === 0) {
                    this.customResponse = new CustomResponse('INFO', 'No records found', true);
                }
                this.vendorRequestReport = data.inviteTeamMembers;
                this.pagination.totalRecords = data.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.vendorRequestReport);
                this.referenceService.loading(this.httpRequestLoader, false);
            }, error => {
                console.log(error);
                this.referenceService.loading(this.httpRequestLoader, false);
                this.referenceService.showSweetAlertServerErrorMessage();
            });
    }

}
