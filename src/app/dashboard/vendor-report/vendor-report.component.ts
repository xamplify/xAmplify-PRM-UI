import { Component, OnInit, ViewChild } from '@angular/core';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { DynamicEmailContentComponent } from '../dynamic-email-content/dynamic-email-content.component';
import { unescape } from 'querystring';
declare var $: any, swal: any;
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
    copiedLinkCustomResponse: CustomResponse = new CustomResponse();
    @ViewChild('dynamicEmailContentComponent') dynamicEmailContentComponent: DynamicEmailContentComponent;
    userAlias: string = "";
    accessAccountVanityURL: string;
    loading = false;
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
            this.customResponse = new CustomResponse();
            this.isListLoading = true;
            this.dashboardService.getVendorsList(this.pagination)
                .subscribe(
                    (data: any) => {
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
                    () => {}
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

    getVendorCompanyProfile(report: any) {
        try {
            this.authenticationService.selectedVendorId = report.id;
            this.referenceService.goToRouter('/home/dashboard/edit-company-profile');
        } catch (error) {
            console.error(error, "adminReportComponent", "loadCompanyProfile()");
        }
    }

    getVendorMyProfile(report: any) {
        try {
            this.dashboardService.getVendorsMyProfile(report.emailId)
                .subscribe(
                    (data: any) => {
                        this.authenticationService.venorMyProfileReport = data;
                        this.referenceService.goToRouter('/home/dashboard/myprofile');
                    },
                    error => console.error(error),
                    () => console.info("vendors reports myProfile() finished")
                )
        } catch (error) {
            console.error(error, "adminReportComponent", "loadMyProfile()");
        }
    }

    sendWelcomeEmail(response: any) {
        if (response !== undefined) {
            this.dynamicEmailContentComponent.openModal(response);
        }
    }

    openLinkInPopup(report: any) {
        if (report !== undefined) {
            this.copiedLinkCustomResponse = new CustomResponse();
            this.userAlias = report.alias;
            if (report.enableVanityURL) {
                this.accessAccountVanityURL = window.location.protocol + "//" + report.companyProfileName + "." + window.location.hostname + "/axAa/" + report.alias;
            } else {
                this.accessAccountVanityURL = this.authenticationService.APP_URL + "axAa/" + report.alias;
            }
            $('#user-alias-modal').modal('show');
        }
    }


    /*********Copy The Link */
  copyAliasUrl(inputElement){
    this.copiedLinkCustomResponse = new CustomResponse();
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.copiedLinkCustomResponse = new CustomResponse('SUCCESS','Copied to clipboard successfully.',true );  

  }


    activateOrDeactivate(report: any) {
        let userStatus = report.userStatus;
        let text = "";
        let title = "";
        if (userStatus == "UNAPPROVED" || userStatus == "DECLINE") {
            title = 'Are you sure to activate this account?';
            text = "This account status is " + userStatus;
        } else if (userStatus == "APPROVED") {
            title = 'Are you sure to de-activate this account?';
            text = "This account status is " + userStatus;
        }
        let self = this;
        swal({
            title: title,
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#54a7e9',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes, Change it!',
            allowOutsideClick: false
        }).then(function () {
            self.loading = true;
            self.activateOrDeactiveStatus(report);
        }, function (dismiss: any) {
            console.log('you clicked on option' + dismiss);
        });

    }

    activateOrDeactiveStatus(report: any) {
        this.dashboardService.activateOrDeactiveStatus(report)
            .subscribe(
                (data: any) => {
                    this.loading = false;
                    this.search();
                    swal("Status Changed Successfully", "", "success");
                },
                error => { this.loading = false; console.error(error) },
                () => {

                }
            )
    }

    displayModuleAccess(report: any) {
        if (report && report.companyId && report.companyProfileName) {
            this.referenceService.goToRouter('/home/dashboard/module-access/' + report.companyId + "/" + report.alias + "/" + report.companyProfileName)
        }
    }

    editModuleNames(report: any) {
        if (report && report.companyId && report.companyProfileName) {
            this.referenceService.goToRouter('/home/dashboard/edit-module-names/' + report.companyId);
        }
    }

   navigateToDashboardStats(report:any){
    let companyProfileName = report['companyProfileName'];
    if(companyProfileName!=undefined){
        this.loading = true;
        this.referenceService.goToRouter('/home/dashboard/dashboard-stats/'+report.id+"/"+report.companyId+"/"+report.alias);
    }else{
        this.referenceService.showSweetAlertErrorMessage("Company Profile Not Created.");
    }
   
   } 

}
