import { Component, OnInit } from '@angular/core';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
    selector: 'app-vendor-report',
    templateUrl: './vendor-report.component.html',
    styleUrls: ['./vendor-report.component.css', '../admin-report/admin-report.component.css'],
    providers: [Pagination, HttpRequestLoader, Properties, CampaignAccess]
})
export class VendorReportComponent implements OnInit {

    isListLoading = false;
    sortcolumn: string = null;
    sortingOrder: string = null;
    sortOptions = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
        { 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
        { 'name': 'Last Login (ASC)', 'value': 'dateLastLogin-ASC' },
        { 'name': 'Last Login (DESC)', 'value': 'dateLastLogin-DESC' },

    ];
    public sortOption: any = this.sortOptions[0];
    totalRecords: number;
    vendorsDetails: any;
    customResponse: CustomResponse = new CustomResponse();
    searchKey: string;
    constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService, public pagination: Pagination,
        public dashboardService: DashboardService, public pagerService: PagerService, public properties: Properties) { }

    ngOnInit() {
        this.getVendorsDetails();
    }

    eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }

    search() {

        try {
            this.pagination.searchKey = this.searchKey;
            this.pagination.pageIndex = 1;
            this.getVendorsDetails();
        } catch (error) {
            console.error(error, "ManageContactsComponent", "sorting()");
        }
    }

    sortByOption(event: any) {
        try {
            this.sortOption = event;
            const sortedValue = this.sortOption.value;
            if (sortedValue !== '') {
                const options: string[] = sortedValue.split('-');
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
        } catch (error) {
            console.error(error, "ManageContactsComponent", "sorting()");
        }
    }

    setPage(event: any) {
        this.pagination.pageIndex = event.page;
        this.getVendorsDetails();

    }

    getVendorsDetails() {
        try {
            this.isListLoading = true;
            this.dashboardService.getVendorsList(this.pagination)
                .subscribe(
                    (data: any) => {
                        console.log(data);
                        this.totalRecords = data.totalRecords;
                        this.vendorsDetails = data.data;
                        this.pagination.totalRecords = this.totalRecords;
                        this.pagination = this.pagerService.getPagedItems(this.pagination, this.vendorsDetails);

                        if (data.totalRecords === 0) {
                            this.customResponse = new CustomResponse('INFO', this.properties.NO_RESULTS_FOUND, true);
                        }
                        this.isListLoading = false;
                    },
                    error => console.error(error),
                    () => console.info("vendors reports() finished")
                )
        } catch (error) {
            console.error(error, "adminReportComponent", "loadingAllVendors()");
        }
    }


    onChangeAllContactUsers(event: Pagination) {
        try {
            this.pagination = event;
            this.getVendorsDetails();

        } catch (error) {
            console.error(error, "adminreport", "getAdminList");
        }
    }

}
