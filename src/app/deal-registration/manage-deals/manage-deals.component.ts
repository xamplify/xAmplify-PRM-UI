import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HomeComponent } from '../../core/home/home.component';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';
import { DealRegistrationService } from '../services/deal-registration.service';
import { ManagePartnersComponent } from 'app/deal-registration/manage-partners/manage-partners.component';
import { Campaign } from '../../campaigns/models/campaign';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { User } from '../../core/models/user';
import { isNumber } from 'util';
import { Roles } from '../../core/models/roles';
import { CustomResponse } from '../../common/models/custom-response';
import { UserService } from 'app/core/services/user.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";
import { IntegrationService } from '../../core/services/integration.service';
declare var $: any;


@Component({
    selector: 'app-manage-deals',
    templateUrl: './manage-deals.component.html',
    styleUrls: ['./manage-deals.component.css'],
    providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue],

})
export class ManageDealsComponent implements OnInit {

    loggedInUserId: number = 0;
    isListView = false;
    componentName = "manage-deals.component.ts"
    hasClientErrors: boolean = false;
    totalDealsError: boolean = false;
    openedDealsError: boolean = false;
    closedDealsError: boolean = false;
    totalDeals: number = 0;
    openedDeals: number = 0;
    closedDeals: number = 0;
    totalLeads: number = 0;
    dealsOnHold: number = 0;
    approvedDeals: number = 0;

    totalDealsLoader: boolean = true;
    openedDealsLoader: boolean = true;
    closedDealsLoader: boolean = true;
    allApisLoader: boolean = true;
    campaingnList: boolean = false;
    partnerList: boolean = false;
    selectedCampaignId: number = 0;
    filterDeals: string = "";

    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    campaignsPagination: Pagination;
    campaignsPaginationByDeals: Pagination;



    leadList: boolean;
    selectedLeadId: any;
    selectedDealId: any;
    selectedCampaign: Campaign;
    selectedDeal: any;
    selectedLead: any;
    partner: number;
    isDealAnalytics: boolean;
    isDealRegistration: boolean;
    user: User;
    isPartner: boolean;
    parent = "";
    isVendorVersion: boolean;
    isPartnerVersion: boolean;
    dealsOnHoldLoader: boolean = true;
    dealsOnHoldError: boolean;
    totalLeadsLoader: boolean = true;
    totalLeadsError: boolean;
    approvedDealsLoader: boolean = true;
    approvedDealsError: boolean;
    isDealForm = false;
    campaign: any;
    isCampaignByDeals: boolean;
    isCampaignByLeads: boolean;
    selectedTabIndex = 1;
    rejectedDealsLoader: boolean = true;
    rejectedDealsError: boolean = false;
    rejectedDeals: number = 0;
    isOnlyPartner: any;
    loggedInUser: User;
    roleName: Roles = new Roles();
    isVendor: boolean;
    isCompanyPartner: boolean;

    enableLeads = false;

    customResponse: CustomResponse;
    superiorId: number = 0;
	syncSalesForce = false;

    @ViewChild(ManagePartnersComponent)
    set leadId(partner: ManagePartnersComponent) {
        this.selectedLeadId = partner;
    };
    opportunitiesAnalyticsLoader = false;
    opportunitiesAnalytics: any;
    dashboardAnalyticsDto: DashboardAnalyticsDto = new DashboardAnalyticsDto();
    constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
        public utilService: UtilService, public referenceService: ReferenceService,
        private dealRegistrationService: DealRegistrationService, public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
        public sortOption: SortOption, public pagerService: PagerService, private campaignService: CampaignService, userService: UserService,
         public vanityUrlService: VanityURLService, public integrationService: IntegrationService) {
        this.loggedInUserId = this.authenticationService.getUserId();
        const url = "admin/getRolesByUserId/" + this.loggedInUserId + "?access_token=" + this.authenticationService.access_token;
        userService.getHomeRoles(url)
            .subscribe(
                response => {
                    if (response.statusCode == 200) {
                        this.authenticationService.loggedInUserRole = response.data.role;
                        this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
                        this.authenticationService.superiorRole = response.data.superiorRole;
                        if (this.authenticationService.loggedInUserRole == "Team Member") {
                            dealRegistrationService.getSuperorId(this.loggedInUserId).subscribe(response => {
                                this.superiorId = response;
                                this.init();
                            });
                        } else {
                            this.superiorId = this.authenticationService.getUserId();
                            this.init();
                        }
                    }
                })



    }

    ngOnInit() {
        this.opportunitiesAnalyticsLoader = true;
        this.dashboardAnalyticsDto = this.vanityUrlService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
        this.startOrStopAllCountsLoader(true);
        this.checkSalesforceIntegration();
    }
    init() {
        this.isListView = "LIST" == localStorage.getItem('defaultDisplayType');

        const roles = this.authenticationService.getRoles();
        if (roles !== undefined) {
            if (this.authenticationService.loggedInUserRole != "Team Member") {
                this.isOnlyPartner = this.authenticationService.isOnlyPartner();
                if (
                    roles.indexOf(this.roleName.orgAdminRole) > -1 ||
                    roles.indexOf(this.roleName.allRole) > -1 ||
                    roles.indexOf(this.roleName.vendorRole) > -1 || roles.indexOf(this.roleName.vendorTierRole) > -1 ) {
                    this.isVendor = true;
                }
                if (this.authenticationService.isCompanyPartner || this.authenticationService.isPartnerTeamMember) {
                    this.isCompanyPartner = true;
                }
            } else {
                if (!this.authenticationService.superiorRole.includes("Vendor") && !this.authenticationService.superiorRole.includes("OrgAdmin")
                    && this.authenticationService.superiorRole.includes("Partner")) {
                    this.isOnlyPartner = true;
                }
                if (this.authenticationService.superiorRole.includes("Vendor") || this.authenticationService.superiorRole.includes("OrgAdmin")) {
                    this.isVendor = true;
                }
                if (this.authenticationService.superiorRole.includes("Partner")) {
                    this.isCompanyPartner = true;
                }
            }
        }
        this.referenceService.getCompanyIdByUserId(this.superiorId).subscribe(response => {
            console.log(this.superiorId)
            this.referenceService.getOrgCampaignTypes(response).subscribe(data => {
                this.enableLeads = data.enableLeads;
                if (!this.isOnlyPartner) {
                    if (this.authenticationService.vanityURLEnabled) {
                        if (this.authenticationService.isPartnerTeamMember) {
                            this.showPartner();
                        } else {
                            this.isCompanyPartner = false;
                            this.showVendor();
                        }
                    } else {
                        this.showVendor();
                    }
                } else {
                    this.showPartner();
                }
            });
        })

        console.log(this.authenticationService.getRoles())
    }
    switchVersions() {
        this.startOrStopAllCountsLoader(true);
        this.resetAllDeals();
        if (this.isVendorVersion && !this.isOnlyPartner) {
            this.campaignsPagination = new Pagination();
            this.campaignsPaginationByDeals = new Pagination();
            try {
                this.campaingnList = true;
                this.isCampaignByLeads = true;
                this.isCampaignByDeals = false;
                this.getOpportunitesAnalyticsForVendor();
                this.showCampaigns();
                // if(this.isCampaignByLeads)
                //     this.listCampaigns(this.campaignsPagination);
                // if(this.isCampaignByDeals)
                //     this.listCampaignsByDeals(this.campaignsPaginationByDeals);
                this.parent = "manage-leads";
            } catch (error) {
                this.catchError(error, "ngOnInit()");
            }
        } else {
            this.campaignsPagination = new Pagination();
            this.campaignsPaginationByDeals = new Pagination();
            this.isPartner = true;
            this.partner = this.superiorId;
            this.isCampaignByLeads = true;
            this.isCampaignByDeals = false;
            this.campaingnList = true;
            this.getOpportunitesAnalyticsForPartner();
            this.showCampaigns();
            // if(this.isCampaignByLeads)
            //     this.listCampaignsByPartner(this.campaignsPagination);
            // if(this.isCampaignByDeals)
            //     this.listCampaignsDealsByPartner(this.campaignsPaginationByDeals);
            this.parent = "manage-leads-by-partner";
        }
    }


    getOpportunitesAnalyticsForVendor() {
        this.opportunitiesAnalyticsLoader = true;
        this.dealRegistrationService.getOpportunitesAnalyticsForVendor(this.loggedInUserId).
            subscribe(result => {
                this.opportunitiesAnalytics = result.data;
                this.opportunitiesAnalyticsLoader = false;
            },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    //this.opportunitiesAnalyticsLoader = false;
                });
    }

    getOpportunitesAnalyticsForPartner() {
        this.opportunitiesAnalyticsLoader = true;
        this.vanityUrlService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
        this.dealRegistrationService.getOpportunitesAnalyticsForPartner(this.dashboardAnalyticsDto).
            subscribe(result => {
                this.opportunitiesAnalytics = result.data;
                this.opportunitiesAnalyticsLoader = false;
            },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    //this.opportunitiesAnalyticsLoader = false;
                });
    }


    showCampaigns() {
        $('#deals-page-content-div').css('pointer-events', 'none');
        this.clearPagination();
        this.clearFields();
        if (this.isVendorVersion)
            this.listCampaigns(this.campaignsPagination);

        if (this.isPartnerVersion)
            this.listCampaignsByPartner(this.campaignsPagination);
        this.selectedTabIndex = 1;
        this.isCampaignByLeads = true;
        this.isCampaignByDeals = false;
        this.campaignsPagination.pagedItems.forEach(element => {
            element.expand = false;
        });
        this.campaingnList = true;
        this.leadList = false;

    }
    showCampaignsByDeals() {
        this.clearFields();
        $('#deals-page-content-div').css('pointer-events', 'none');
        this.clearPagination();
        if (this.isVendorVersion)
            this.listCampaignsByDeals(this.campaignsPaginationByDeals);

        if (this.isPartnerVersion)
            this.listCampaignsDealsByPartner(this.campaignsPaginationByDeals);
        this.selectedTabIndex = 2;
        this.isCampaignByLeads = false;
        this.isCampaignByDeals = true;
        this.campaignsPaginationByDeals.pagedItems.forEach(element => {
            element.expand = false;
        });
        this.campaingnList = true;
        this.leadList = false;

    }
    /******************Total Deals************************/
    getTotalLeads() {
        try {
            //this.totalLeadsLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getTotalLeads(this.superiorId).subscribe(
                (data: any) => {
                    this.totalLeads = data.data;
                    // this.totalLeadsLoader = false;
                },
                (error: any) => {
                    this.totalLeadsError = true;
                    this.totalLeadsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getTotalLeads()");
        }
    }
    getTotalLeadsByPartner() {
        try {
            //this.totalLeadsLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getTotalLeadsByPartner(this.superiorId).subscribe(
                (data: any) => {
                    this.totalLeads = data.data;
                    //this.totalLeadsLoader = false;
                },
                (error: any) => {
                    this.totalLeadsError = true;
                    this.totalLeadsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getTotalLeads()");
        }
    }
    /******************Total Deals************************/
    getTotalDeals() {
        try {
            // this.totalDealsLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getTotalDeals(this.superiorId).subscribe(
                (data: any) => {
                    this.totalDeals = data.data;
                    // this.totalDealsLoader = false;
                },
                (error: any) => {
                    this.totalDealsError = true;
                    this.totalDealsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getTotalDeals()");
        }
    }

    getTotalDealsByPartner() {
        try {
            // this.totalDealsLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getTotalDealsByPartner(this.superiorId).subscribe(
                (data: any) => {
                    this.totalDeals = data.data;
                    //this.totalDealsLoader = false;
                },
                (error: any) => {
                    this.totalDealsError = true;
                    this.totalDealsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getTotalDealsByPartner()");
        }
    }
    /*************Opened Deals****************************/
    getOpenedDeals() {
        try {
            //  this.openedDealsLoader = true;
            //  this.allApisLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.superiorId, "opened").subscribe(
                (data: any) => {
                    this.openedDeals = data.data;
                    //this.openedDealsLoader = false;
                },
                (error: any) => {
                    this.openedDealsError = true;
                    this.openedDealsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getOpenedDeals()");
        }
    }
    /*************OnHold Deals****************************/
    getDealsOnHold() {
        try {
            //this.dealsOnHoldLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.superiorId, "hold").subscribe(
                (data: any) => {
                    this.dealsOnHold = data.data;
                    //   this.dealsOnHoldLoader = false;
                },
                (error: any) => {
                    this.dealsOnHoldError = true;
                    this.dealsOnHoldLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getDealsOnHold()");
        }
    }

    /*************Closed Deals****************************/
    // getClosedDeals()
    // {
    //     try
    //     {
    //        // this.closedDealsLoader = true;
    //        // this.allApisLoader = true;
    //         this.dealRegistrationService.getDealsCountByStatus(this.superiorId,"closed").subscribe(
    //             (data: any) =>
    //             {
    //                 this.closedDeals = data.data;
    //               //  this.closedDealsLoader = false;
    //             },
    //             (error: any) =>
    //             {
    //                 this.closedDealsError = true;
    //                 this.closedDealsLoader = false;
    //                 this.allApisLoader = false;
    //             }

    //         );
    //     } catch (error)
    //     {
    //         this.catchError(error, "getClosedDeals()");
    //     }
    // }


    /*************Approved Leads****************************/
    getApprovedDeals() {
        try {
            // this.openedDealsLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.superiorId, "approved").subscribe(
                (data: any) => {
                    this.approvedDeals = data.data;
                    //  this.approvedDealsLoader = false;
                },
                (error: any) => {
                    this.approvedDealsError = true;
                    this.approvedDealsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getApprovedDeals()");
        }
    }

    getApprovedDealsByPartner() {
        try {
            // this.openedDealsLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.superiorId, "approved").subscribe(
                (data: any) => {
                    this.approvedDeals = data.data;
                    //  this.approvedDealsLoader = false;
                },
                (error: any) => {
                    this.approvedDealsError = true;
                    this.approvedDealsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getApprovedDealsByPartner()");
        }
    }
    /*************REJECTED Leads****************************/
    getRejectedDeals() {
        try {
            //  this.closedDealsLoader = true;
            //  this.allApisLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.superiorId, "rejected").subscribe(
                (data: any) => {

                    this.rejectedDeals = data.data;
                    //  this.rejectedDealsLoader = false;
                },
                (error: any) => {
                    this.rejectedDealsError = true;
                    this.rejectedDealsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getRejectedDeals()");
        }
    }

    getRejectedDealsByPartner() {
        try {
            //  this.rejectedDealsLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.superiorId, "rejected").subscribe(
                (data: any) => {
                    this.rejectedDeals = data.data;
                    // this.rejectedDealsLoader = false;
                },
                (error: any) => {
                    this.rejectedDealsError = true;
                    this.rejectedDealsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getRejectedDealsByPartner()");
        }
    }

    /*************Opened Deals****************************/
    getOpenedDealsByPartner() {
        try {
            // this.openedDealsLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.superiorId, "opened").subscribe(
                (data: any) => {
                    console.log(data)
                    this.openedDeals = data.data;
                    //  this.openedDealsLoader = false;
                },
                (error: any) => {
                    this.openedDealsError = true;
                    this.openedDealsLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getOpenedDeals()");
        }
    }
    /*************OnHold Deals ByPartner****************************/
    getDealsOnHoldByPartner() {
        try {
            // this.dealsOnHoldLoader = true;
            // this.allApisLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.superiorId, "hold").subscribe(
                (data: any) => {
                    this.dealsOnHold = data.data;
                    //  this.dealsOnHoldLoader = false;
                },
                (error: any) => {
                    this.dealsOnHoldError = true;
                    this.dealsOnHoldLoader = false;
                    this.allApisLoader = false;
                }

            );
        } catch (error) {
            this.catchError(error, "getDealsOnHold()");
        }
    }

    /*************Closed Deals ByPartner****************************/
    // getClosedDealsByPartner()
    // {
    //     try
    //     {
    //        // this.closedDealsLoader = true;
    //      //   this.allApisLoader = true;
    //         this.dealRegistrationService.getPartnerDealsCountByStatus(this.superiorId,"closed").subscribe(
    //             (data: any) =>
    //             {
    //                 this.closedDeals = data.data;
    //              // this.closedDealsLoader = false;
    //             },
    //             (error: any) =>
    //             {
    //                 this.closedDealsError = true;
    //                 this.closedDealsLoader = false;
    //                 this.allApisLoader = false;
    //             }

    //         );
    //     } catch (error)
    //     {
    //         this.catchError(error, "getClosedDeals()");
    //     }
    // }


    startOrStopAllCountsLoader(condition: boolean) {
        this.totalLeadsLoader = condition;
        this.totalDealsLoader = condition;
        this.openedDealsLoader = condition;
        this.dealsOnHoldLoader = condition;
        //this.closedDealsLoader = condition;
        this.approvedDealsLoader = condition;
        this.rejectedDealsLoader = condition;
        this.openedDealsLoader = condition;
        //this.closedDealsLoader = condition;
        this.allApisLoader = condition;
        if (condition) {
            $('#deals-page-content-div').css('pointer-events', 'none');
        } else {
            $('#deals-page-content-div').css('pointer-events', 'visible');
        }

    }
    /*********************List Campaigns*****************/
    listCampaigns(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.superiorId;
        this.dealRegistrationService.listCampaigns(pagination)
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    data.campaigns.forEach(element => {
                        element.expand = false;
                    });
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.startOrStopAllCountsLoader(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }
    /*********************List Campaigns*****************/
    listCampaignsByDeals(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.superiorId;

        this.dealRegistrationService.listCampaignsByDeals(pagination)
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    pagination.pagedItems.forEach(element => {
                        element.expand = false;
                    });

                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.startOrStopAllCountsLoader(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }

    listCampaignsByPartner(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.superiorId;
        if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
            pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
            pagination.vanityUrlFilter = true;
        }
        this.dealRegistrationService.listCampaignsByPartner(pagination)
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    pagination.pagedItems.forEach(element => {
                        element.expand = false;
                    });
                    console.log(this.sortOption.totalRecords);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.startOrStopAllCountsLoader(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }

    /*********************List Campaigns*****************/
    listCampaignsDealsByPartner(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.superiorId;
        if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
            pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
            pagination.vanityUrlFilter = true;
        }
        this.dealRegistrationService.listCampaignsDealsByPartner(pagination)
            .subscribe(
                data => {
                    console.log(data)
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    pagination.pagedItems.forEach(element => {
                        element.expand = false;
                    });

                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.startOrStopAllCountsLoader(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }


    sortCampaigns(text: any) {
        this.sortOption.selectedSortedOption = text;
        this.getAllFilteredResults(this.campaignsPagination);
    }

    searchCampaignsKeyPress(keyCode: any) { if (keyCode === 13) { this.getAllFilteredResults(this.campaignsPagination); } }

    searchCampaigns() {
        this.getAllFilteredResults(this.campaignsPagination);
    }

    getAllFilteredResults(pagination: Pagination) {
        pagination.pageIndex = 1;
        pagination.searchKey = this.sortOption.searchKey;
        if (this.sortOption.itemsSize.value == 0) {
            pagination.maxResults = pagination.totalRecords;
        } else {
            pagination.maxResults = this.sortOption.itemsSize.value;
        }
        let sortedValue = this.sortOption.selectedSortedOption.value;
        this.setSortColumns(pagination, sortedValue);
        if (this.isVendorVersion) {
            if (this.isCampaignByLeads) {
                this.listCampaigns(pagination);
            }
            else {
                this.campaignsPaginationByDeals.pageIndex = 1;
                if (this.sortOption.itemsSize.value == 0) {
                    this.campaignsPaginationByDeals.maxResults = pagination.totalRecords;
                } else {
                    this.campaignsPaginationByDeals.maxResults = this.sortOption.itemsSize.value;
                }
                let sortedValue = this.sortOption.selectedSortedOption.value;
                this.campaignsPaginationByDeals.searchKey = this.sortOption.searchKey;
                this.setSortColumns(this.campaignsPaginationByDeals, sortedValue);
                this.listCampaignsByDeals(this.campaignsPaginationByDeals);
            }
        } else {
            if (this.isCampaignByLeads) {
                this.listCampaignsByPartner(this.campaignsPagination);
            }
            else {
                this.campaignsPaginationByDeals.pageIndex = 1;
                this.campaignsPaginationByDeals.searchKey = this.sortOption.searchKey;
                if (this.sortOption.itemsSize.value == 0) {
                    this.campaignsPaginationByDeals.maxResults = pagination.totalRecords;
                } else {
                    this.campaignsPaginationByDeals.maxResults = this.sortOption.itemsSize.value;
                }
                let sortedValue = this.sortOption.selectedSortedOption.value;
                this.setSortColumns(this.campaignsPaginationByDeals, sortedValue);
                this.listCampaignsDealsByPartner(this.campaignsPaginationByDeals);
            }
        }

    }

    setSortColumns(pagination: Pagination, sortedValue: any) {
        if (sortedValue != "") {
            let options: string[] = sortedValue.split("-");
            pagination.sortcolumn = options[0];
            pagination.sortingOrder = options[1];
        }
    }

    filterCampaigns(type: string, index: number) {
        if (this.isVendorVersion) {
            this.sortOption.selectedCampaignTypeIndex = index;//This is to highlight the tab

            if (this.isCampaignByLeads) {
                this.campaignsPagination.pageIndex = 1;
                this.campaignsPagination.campaignType = type;
                this.listCampaigns(this.campaignsPagination);
            }
            else {
                this.campaignsPaginationByDeals.pageIndex = 1;
                this.campaignsPaginationByDeals.campaignType = type;
                this.listCampaignsByDeals(this.campaignsPaginationByDeals);
            }
        } else {
            this.sortOption.selectedCampaignTypeIndex = index;//This is to highlight the tab

            if (this.isCampaignByLeads) {
                this.campaignsPagination.pageIndex = 1;
                this.campaignsPagination.campaignType = type;
                this.listCampaignsByPartner(this.campaignsPagination);
            }
            else {
                this.campaignsPaginationByDeals.pageIndex = 1;
                this.campaignsPaginationByDeals.campaignType = type;
                this.listCampaignsDealsByPartner(this.campaignsPaginationByDeals);
            }
        }
    }

    /********Pages Navigation***********/
    navigatePages(event: any) {


        if (this.isVendorVersion) {
            if (this.isCampaignByLeads) {
                this.campaignsPagination.pageIndex = event.page;
                this.campaignsPagination.searchKey = this.sortOption.searchKey;
                this.listCampaigns(this.campaignsPagination);
            }
            else {
                this.campaignsPaginationByDeals.pageIndex = event.page;
                this.campaignsPaginationByDeals.searchKey = this.sortOption.searchKey;
                this.listCampaignsByDeals(this.campaignsPaginationByDeals);
            }
        } else {
            if (this.isCampaignByLeads) {
                this.campaignsPagination.pageIndex = event.page;
                this.campaignsPagination.searchKey = this.sortOption.searchKey;
                this.listCampaignsByPartner(this.campaignsPagination);
            }
            else {
                this.campaignsPaginationByDeals.pageIndex = event.page;
                this.campaignsPaginationByDeals.searchKey = this.sortOption.searchKey;
                this.listCampaignsDealsByPartner(this.campaignsPaginationByDeals);
            }
        }


    }
    /*****Dropdown**********/
    changeSize(items: any, type: any) {
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.campaignsPagination);

    }

    /*********Show Partners***************/
    showPartners(campaign: any) {
        this.clearFields();
        this.campaign = campaign;
        if (!this.isPartner) {
            this.selectedCampaignId = campaign.id;
            campaign.expand = !campaign.expand;
            this.partnerList = true;
        } else {
            this.dealRegistrationService.getCampaignPartnerById(this.superiorId).subscribe(data => {
                this.selectedCampaignId = campaign.id;
                this.showLeads(data.partners);
            },
                error => console.log(error),
                () => { })
        }
    }
    showOwnLeads(campaign:any){
        this.clearFields();
        this.campaign = campaign;
        this.selectedCampaignId = campaign.id;
        let loggedInUserData = {};
        loggedInUserData['partnerId'] = this.loggedInUserId;
        this.showLeads(loggedInUserData);
    }
    showOwnDeals(){
    }
    showLeads(partner: any) {
        this.clearFields()
        this.partner = partner;
        this.leadList = true;
        this.campaingnList = false;
        if (this.isCampaignByLeads)
            this.filterDeals = "";
        else
            this.filterDeals = "TOTAL";
    }

    resetAllDeals() {
        this.clearFields()
        this.isPartner = false;
        this.partner = null;
        this.leadList = false;
        this.campaingnList = true;
        this.partnerList = false;
        this.selectedCampaignId = null;
        this.filterDeals = "";
    }

    goToReDistributedPartnersDiv() {
        this.clearFields()
        this.selectedTabIndex = 1;
        this.filterDeals = "TOTAL_LEADS";
        this.leadList = true;
        this.campaingnList = false;

    }
    showTotalDeals() {
        this.clearFields()
        this.selectedTabIndex = 2;
        this.filterDeals = "TOTAL";
        this.leadList = true;
        this.campaingnList = false;

    }
    showOpenedLeads() {
        this.clearFields()
        if (!this.isPartner) {
            this.getOpenedDeals();
        } else {
            this.getOpenedDealsByPartner();
        }
        this.selectedTabIndex = 3;
        this.filterDeals = "OPENED";
        this.leadList = true;
        this.campaingnList = false;

    }
    clearFields() {
        this.sortOption.searchKey = '';
    }
    showDealsOnHold() {
        this.clearFields()
        if (!this.isPartner) {
            this.getDealsOnHold();
        } else {
            this.getDealsOnHoldByPartner();
        }
        this.selectedTabIndex = 5;
        this.filterDeals = "HOLD";
        this.leadList = true;
        this.campaingnList = false;

    }

    showApprovedLeads() {
        this.clearFields()
        if (!this.isPartner) {
            this.getApprovedDeals();
        } else {
            this.getApprovedDealsByPartner();
        }
        this.selectedTabIndex = 6;
        this.filterDeals = "APPROVED";
        this.leadList = true;
        this.campaingnList = false;

    }
    showRejectedLeads() {
        this.clearFields()
        if (!this.isPartner) {
            this.getRejectedDeals();
        } else {
            this.getRejectedDealsByPartner();
        }
        this.selectedTabIndex = 7;
        this.filterDeals = "REJECTED";
        this.leadList = true;
        this.campaingnList = false;

    }
    // showClosedLeads()
    // {
    //   this.clearFields()
    //     if (!this.isPartner)
    //     {
    //         this.getClosedDeals();
    //     }else {
    //         this.getClosedDealsByPartner();
    //     }
    //     this.selectedTabIndex = 4;
    //     this.filterDeals = "CLOSED";
    //     this.leadList = true;
    //     this.campaingnList = false;

    // }

    dealAnalytics(deal: any) {

        if (deal === "status_change") {
            this.resetCounters(0);
        } else if (isNumber(deal)) {
            this.showDealRegistrationForm(deal);
        } else {

            this.selectedDealId = deal.dealId;
            this.dealRegistrationService.getDealById(deal.dealId, this.superiorId).subscribe(dealNew => {
                this.selectedDeal = dealNew.data;

                const obj = { campaignId: this.selectedDeal.parentCampaignId.toString() };


                this.campaignService.getCampaignById(obj).subscribe(campaign => {

                    this.selectedCampaign = campaign;
                    this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.createdBy).subscribe(user => {

                        this.user = user;
                        this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.leadId).subscribe(lead => {

                            this.selectedLead = lead;
                            this.selectedDealId = deal.dealId;
                            this.isDealRegistration = false;
                            this.isDealAnalytics = true;


                        },
                            error => console.log(error),
                            () => { })
                    },
                        error => console.log(error),
                        () => { })


                },
                    error => {
                        console.log(error);
                    })



            },
                error => console.log(error),
                () => { })
        }


    }
    dealRegistration(item: any) {
        this.dealRegistrationService.getDealById(item, this.superiorId).subscribe(deal => {
            this.selectedDeal = deal.data;
            this.selectedDealId = item;
            const obj = { campaignId: this.selectedDeal.parentCampaignId.toString() };
            this.campaignService.getCampaignById(obj).subscribe(campaign => {
                this.selectedCampaign = campaign;
            },error => {
                this.referenceService.showSweetAlertErrorMessage('Vendor has deleted the parent campaign');
            },()=>{
                this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.createdBy).subscribe(user => {
                    this.user = user;
                },error => console.log(error),
                    () => { });
    
                this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.leadId).subscribe(lead => {
                    this.selectedLead = lead;
                    this.isDealAnalytics = false;
                    this.isDealRegistration = false;
                    this.isDealForm = true;
                },
                error => console.log(error),
                    () => { });
               
            });
            
        },error => {
            this.xtremandLogger.errorPage(error)
        },
            () => { });


    }
    

    dealAnalyticsDisable() {
        this.isDealAnalytics = !this.isDealAnalytics;
    }
    resetCounters(event: number) {
        if (event == 0) {
            if (!this.isPartner) {
                this.getOpportunitesAnalyticsForVendor();
            } else {
                this.getOpportunitesAnalyticsForPartner();
            }
        } else {
            this.disableDealPushRegistrationForm();

            if (event == 1) {
                this.customResponse = new CustomResponse('SUCCESS', "Deal Registered Successfully", true);
                this.resetCounters(0);

            } else if (event == 2) {
                this.customResponse = new CustomResponse('SUCCESS', "Deal Updated Successfully", true);
            }


        }

    }

    getDealInfo(item: any) {

        this.dealRegistrationService.getDealById(item, this.superiorId).subscribe(deal => {
            this.selectedDeal = deal.data;
            this.selectedDealId = this.selectedDeal.dealId;
            const obj = { campaignId: this.selectedDeal.parentCampaignId.toString() };


            this.campaignService.getCampaignById(obj).subscribe(campaign => {

                this.selectedCampaign = campaign;


            },
                error => {
                    console.log(error);
                })
            this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.createdBy).subscribe(user => {

                this.user = user;

            },
                error => console.log(error),
                () => { })
            this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.leadId).subscribe(lead => {

                this.selectedLead = lead;
                this.isDealAnalytics = false;
                this.isDealRegistration = true;



            },
                error => console.log(error),
                () => { })
            this.selectedDealId = item;

        },
            error => console.log(error),
            () => { })
    }
    showVendor() {
        if (this.enableLeads) {
            this.isVendorVersion = true;
            this.isPartnerVersion = false;
            this.switchVersions();
        } else {
            this.showPartner();
        }
    }
    showPartner() {

        if (this.isCompanyPartner) {
            this.isVendorVersion = false;
            this.isPartnerVersion = true;
            this.switchVersions();
        }
    }

    showDealRegistrationForm(item) {

        this.getDealInfo(item);



    }
    disableDealRegistrationForm() {

        this.isDealRegistration = false;

    }
    disableDealPushRegistrationForm() {
        //this.resetCounters();
        this.isDealForm = false;
    }

    closeLeads() {
        if (this.isCampaignByLeads) {
            this.showCampaigns();
        } else {
            this.showCampaignsByDeals();
        }
    }



    catchError(error: any, methodName: string) {
        this.hasClientErrors = true;
        this.xtremandLogger.showClientErrors(this.componentName, methodName, error);
    }

    clearPagination() {
        this.campaignsPagination = new Pagination();
        this.campaignsPaginationByDeals = new Pagination();
    }
    
	checkSalesforceIntegration(): any {
	  this.referenceService.loading(this.httpRequestLoader, true);
      this.integrationService.checkConfigurationByTypeAndUserId("isalesforce", this.loggedInUserId).subscribe(data =>{
           let response = data;
           if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
               this.integrationService.checkSfCustomFields(this.loggedInUserId).subscribe(cfData =>{
           			let cfResponse = cfData;
           			if (cfResponse.statusCode === 400) {
           				this.syncSalesForce = false;
           			} else {
           				this.syncSalesForce = true;
           			}
       			},error =>{
           			console.log("Error in salesforce checkSalesforceIntegration()");
       			}, () => console.log("Error in salesforce checkSalesforceIntegration()"));
              	console.log("Error in salesforce checkSalesforceIntegration()");
           } else{
                 this.syncSalesForce = false;             
              }
       },error =>{
       		console.log("Error in salesforce checkSalesforceIntegration()");
       }, () => console.log("Error in checkSalesforceIntegration()"));
       this.referenceService.loading(this.httpRequestLoader, false);
   }
}
