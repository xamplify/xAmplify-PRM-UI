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
@Component({
    selector: 'app-manage-deals',
    templateUrl: './manage-deals.component.html',
    styleUrls: ['./manage-deals.component.css'],
    providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue],

})
export class ManageDealsComponent implements OnInit
{

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
    
    totalDealsLoader: boolean = false;
    openedDealsLoader: boolean = false;
    closedDealsLoader: boolean = false;
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
    dealsOnHoldLoader: boolean;
    dealsOnHoldError: boolean;
    totalLeadsLoader: boolean;
    totalLeadsError: boolean;
    approvedDealsLoader: boolean;
    approvedDealsError: boolean;
    isDealForm = false;
    campaign: any;
    isCampaignByDeals: boolean;
    isCampaignByLeads: boolean;
    selectedTabIndex = 1;
    rejectedDealsLoader: boolean = false;
    rejectedDealsError: boolean = false;
    rejectedDeals: number =0;
    isOnlyPartner: any;
    loggedInUser: User;


    @ViewChild(ManagePartnersComponent)
    set leadId(partner: ManagePartnersComponent)
    {
        this.selectedLeadId = partner;
    };




    constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
        public utilService: UtilService, public referenceService: ReferenceService,
        private dealRegistrationService: DealRegistrationService, public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
        public sortOption: SortOption, public pagerService: PagerService, private campaignService: CampaignService)
    {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.isListView = !this.referenceService.isGridView;
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        
        if(!this.isOnlyPartner){
            this.showVendor();
        }else{
            this.showPartner();
        }

    }

    ngOnInit()
    {
       

    }
    switchVersions()
    {
        this.resetAllDeals();
        if (this.isVendorVersion && !this.isOnlyPartner)
        {
            this.campaignsPagination = new Pagination();
            this.campaignsPaginationByDeals = new Pagination();
            try
            {
                this.campaingnList = true;
                this.isCampaignByLeads = true;
                this.isCampaignByDeals = false;
                this.getTotalLeads();
                this.getTotalDeals();
                this.getApprovedDeals();
                this.getRejectedDeals();
                this.getOpenedDeals();
                this.getClosedDeals();
                this.getDealsOnHold();
                this.showCampaigns();
                // if(this.isCampaignByLeads)
                //     this.listCampaigns(this.campaignsPagination);
                // if(this.isCampaignByDeals)
                //     this.listCampaignsByDeals(this.campaignsPaginationByDeals);
                this.parent = "manage-leads";
            } catch (error)
            {
                this.catchError(error, "ngOnInit()");
            }
        } else
        {
            this.campaignsPagination = new Pagination();
            this.campaignsPaginationByDeals = new Pagination();
            this.isPartner = true;
            this.partner = this.loggedInUserId;
            this.isCampaignByLeads = true;
            this.isCampaignByDeals = false;
            this.campaingnList = true;
            this.getTotalLeadsByPartner();
            this.getTotalDealsByPartner();
            this.getApprovedDealsByPartner();
            this.getRejectedDealsByPartner();
            this.getOpenedDealsByPartner();
            this.getClosedDealsByPartner();
            this.getDealsOnHoldByPartner();
            this.showCampaigns();
            // if(this.isCampaignByLeads)
            //     this.listCampaignsByPartner(this.campaignsPagination);
            // if(this.isCampaignByDeals)
            //     this.listCampaignsDealsByPartner(this.campaignsPaginationByDeals);
            this.parent = "manage-leads-by-partner";
        }
    }

    showCampaigns()
    {
        if(this.isVendorVersion)
            this.listCampaigns(this.campaignsPagination);
        
        if(this.isPartnerVersion)
            this.listCampaignsByPartner(this.campaignsPagination);
        this.selectedTabIndex = 1;
        this.isCampaignByLeads = true;
        this.isCampaignByDeals = false;
        this.campaignsPagination.pagedItems.forEach(element =>
        {
            element.expand = false;
        });
        this.campaingnList = true;
        this.leadList = false;

    }
    showCampaignsByDeals()
    {
        if(this.isVendorVersion)
            this.listCampaignsByDeals(this.campaignsPaginationByDeals);
        
        if(this.isPartnerVersion)
            this.listCampaignsDealsByPartner(this.campaignsPaginationByDeals);
        this.selectedTabIndex = 2;
        this.isCampaignByLeads = false;
        this.isCampaignByDeals = true;
        this.campaignsPaginationByDeals.pagedItems.forEach(element =>
        {
            element.expand = false;
        });
        this.campaingnList = true;
        this.leadList = false;

    }
    /******************Total Deals************************/
    getTotalLeads()
    {
        try
        {
            this.totalLeadsLoader = true;
            this.dealRegistrationService.getTotalLeads(this.loggedInUserId).subscribe(
                (data: any) =>
                {
                    this.totalLeads = data.data;
                    this.totalLeadsLoader = false;
                },
                (error: any) =>
                {
                    this.totalLeadsError = true;
                    this.totalLeadsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getTotalLeads()");
        }
    }
    getTotalLeadsByPartner()
    {
        try
        {
            this.totalLeadsLoader = true;
            this.dealRegistrationService.getTotalLeadsByPartner(this.loggedInUserId).subscribe(
                (data: any) =>
                {
                    this.totalLeads = data.data;
                    this.totalLeadsLoader = false;
                },
                (error: any) =>
                {
                    this.totalLeadsError = true;
                    this.totalLeadsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getTotalLeads()");
        }
    }
    /******************Total Deals************************/
    getTotalDeals()
    {
        try
        {
            this.totalDealsLoader = true;
            this.dealRegistrationService.getTotalDeals(this.loggedInUserId).subscribe(
                (data: any) =>
                {
                    this.totalDeals = data.data;
                    this.totalDealsLoader = false;
                },
                (error: any) =>
                {
                    this.totalDealsError = true;
                    this.totalDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getTotalDeals()");
        }
    }

    getTotalDealsByPartner()
    {
        try
        {
            this.totalDealsLoader = true;
            this.dealRegistrationService.getTotalDealsByPartner(this.loggedInUserId).subscribe(
                (data: any) =>
                {
                    this.totalDeals = data.data;
                    this.totalDealsLoader = false;
                },
                (error: any) =>
                {
                    this.totalDealsError = true;
                    this.totalDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getTotalDealsByPartner()");
        }
    }
    /*************Opened Deals****************************/
    getOpenedDeals()
    {
        try
        {
            this.openedDealsLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.loggedInUserId,"opened").subscribe(
                (data: any) =>
                {
                    this.openedDeals = data.data;
                    this.openedDealsLoader = false;
                },
                (error: any) =>
                {
                    this.openedDealsError = true;
                    this.openedDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getOpenedDeals()");
        }
    }
    /*************OnHold Deals****************************/
    getDealsOnHold()
    {
        try
        {
            this.dealsOnHoldLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.loggedInUserId,"hold").subscribe(
                (data: any) =>
                {
                    this.dealsOnHold = data.data;
                    this.dealsOnHoldLoader = false;
                },
                (error: any) =>
                {
                    this.dealsOnHoldError = true;
                    this.dealsOnHoldLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getDealsOnHold()");
        }
    }

    /*************Closed Deals****************************/
    getClosedDeals()
    {
        try
        {
            this.closedDealsLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.loggedInUserId,"closed").subscribe(
                (data: any) =>
                {
                    this.closedDeals = data.data;
                    this.closedDealsLoader = false;
                },
                (error: any) =>
                {
                    this.closedDealsError = true;
                    this.closedDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getClosedDeals()");
        }
    }


    /*************Approved Leads****************************/
    getApprovedDeals()
    {
        try
        {
            this.openedDealsLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.loggedInUserId,"approved").subscribe(
                (data: any) =>
                {
                    this.approvedDeals = data.data;
                    this.approvedDealsLoader = false;
                },
                (error: any) =>
                {
                    this.approvedDealsError = true;
                    this.approvedDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getApprovedDeals()");
        }
    }

    getApprovedDealsByPartner()
    {
        try
        {
            this.openedDealsLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.loggedInUserId,"approved").subscribe(
                (data: any) =>
                {
                    this.approvedDeals = data.data;
                    this.approvedDealsLoader = false;
                },
                (error: any) =>
                {
                    this.approvedDealsError = true;
                    this.approvedDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getApprovedDealsByPartner()");
        }
    }
    /*************REJECTED Leads****************************/
    getRejectedDeals()
    {
        try
        {
            this.closedDealsLoader = true;
            this.dealRegistrationService.getDealsCountByStatus(this.loggedInUserId,"rejected").subscribe(
                (data: any) =>
                {
                 
                    this.rejectedDeals = data.data;
                    this.rejectedDealsLoader = false;
                },
                (error: any) =>
                {
                    this.rejectedDealsError = true;
                    this.rejectedDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getRejectedDeals()");
        }
    }

    getRejectedDealsByPartner()
    {
        try
        {
            this.rejectedDealsLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.loggedInUserId,"rejected").subscribe(
                (data: any) =>
                {
                    this.rejectedDeals = data.data;
                    this.rejectedDealsLoader = false;
                },
                (error: any) =>
                {
                    this.rejectedDealsError = true;
                    this.rejectedDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getRejectedDealsByPartner()");
        }
    }

    /*************Opened Deals****************************/
    getOpenedDealsByPartner()
    {
        try
        {
            this.openedDealsLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.loggedInUserId,"opened").subscribe(
                (data: any) =>
                {
                    console.log(data)
                    this.openedDeals = data.data;
                    this.openedDealsLoader = false;
                },
                (error: any) =>
                {
                    this.openedDealsError = true;
                    this.openedDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getOpenedDeals()");
        }
    }
    /*************OnHold Deals ByPartner****************************/
    getDealsOnHoldByPartner()
    {
        try
        {
            this.dealsOnHoldLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.loggedInUserId,"hold").subscribe(
                (data: any) =>
                {
                    this.dealsOnHold = data.data;
                    this.dealsOnHoldLoader = false;
                },
                (error: any) =>
                {
                    this.dealsOnHoldError = true;
                    this.dealsOnHoldLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getDealsOnHold()");
        }
    }

    /*************Closed Deals ByPartner****************************/
    getClosedDealsByPartner()
    {
        try
        {
            this.closedDealsLoader = true;
            this.dealRegistrationService.getPartnerDealsCountByStatus(this.loggedInUserId,"closed").subscribe(
                (data: any) =>
                {
                    this.closedDeals = data.data;
                    this.closedDealsLoader = false;
                },
                (error: any) =>
                {
                    this.closedDealsError = true;
                    this.closedDealsLoader = false;
                }

            );
        } catch (error)
        {
            this.catchError(error, "getClosedDeals()");
        }
    }

    /*********************List Campaigns*****************/
    listCampaigns(pagination: Pagination)
    {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.loggedInUserId;

        this.dealRegistrationService.listCampaigns(pagination)
            .subscribe(
                data =>
                {

                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    data.campaigns.forEach(element =>
                        {
                            element.expand = false;
                        });
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                   

                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: any) =>
                {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }
    /*********************List Campaigns*****************/
    listCampaignsByDeals(pagination: Pagination)
    {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.loggedInUserId;

        this.dealRegistrationService.listCampaignsByDeals(pagination)
            .subscribe(
                data =>
                {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    pagination.pagedItems.forEach(element =>
                    {
                        element.expand = false;
                    });

                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: any) =>
                {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }

    listCampaignsByPartner(pagination: Pagination)
    {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.loggedInUserId;

        this.dealRegistrationService.listCampaignsByPartner(pagination)
            .subscribe(
                data =>
                {
                   
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    pagination.pagedItems.forEach(element =>
                    {
                        element.expand = false;
                    });
                    console.log(this.sortOption.totalRecords);
                    this.referenceService.loading(this.httpRequestLoader, false);
                   
                },
                (error: any) =>
                {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }

    /*********************List Campaigns*****************/
    listCampaignsDealsByPartner(pagination: Pagination)
    {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.loggedInUserId;

        this.dealRegistrationService.listCampaignsDealsByPartner(pagination)
            .subscribe(
                data =>
                {
                    console.log(data)
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    pagination.pagedItems.forEach(element =>
                    {
                        element.expand = false;
                    });
                   
                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: any) =>
                {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }


    sortCampaigns(text: any)
    {
        this.sortOption.selectedSortedOption = text;
        this.getAllFilteredResults(this.campaignsPagination);
    }

    searchCampaignsKeyPress(keyCode: any) { if (keyCode === 13) { this.getAllFilteredResults(this.campaignsPagination); } }

    searchCampaigns()
    {
        this.getAllFilteredResults(this.campaignsPagination);
    }

    getAllFilteredResults(pagination: Pagination)
    {
        pagination.pageIndex = 1;
        pagination.searchKey = this.sortOption.searchKey;
        if (this.sortOption.itemsSize.value == 0)
        {
            pagination.maxResults = pagination.totalRecords;
        } else
        {
            pagination.maxResults = this.sortOption.itemsSize.value;
        }
        let sortedValue = this.sortOption.selectedSortedOption.value;
        this.setSortColumns(pagination, sortedValue);
        if(this.isVendorVersion){
            if(this.isCampaignByLeads)
            this.listCampaigns(pagination);
            else
            this.listCampaignsByDeals(this.campaignsPaginationByDeals);
        }else{
            if(this.isCampaignByLeads)
            this.listCampaignsByPartner(this.campaignsPagination);
            else
            this.listCampaignsDealsByPartner (this.campaignsPaginationByDeals);
        }

    }

    setSortColumns(pagination: Pagination, sortedValue: any)
    {
        if (sortedValue != "")
        {
            let options: string[] = sortedValue.split("-");
            pagination.sortcolumn = options[0];
            pagination.sortingOrder = options[1];
        }
    }

    filterCampaigns(type: string, index: number)
    {
        if(this.isVendorVersion){
            this.sortOption.selectedCampaignTypeIndex = index;//This is to highlight the tab
           
            if(this.isCampaignByLeads){
                this.campaignsPagination.pageIndex = 1;
                this.campaignsPagination.campaignType = type;
                this.listCampaigns(this.campaignsPagination);
            }
            else{
                this.campaignsPaginationByDeals.pageIndex = 1;
                this.campaignsPaginationByDeals.campaignType = type;
                this.listCampaignsByDeals(this.campaignsPaginationByDeals);
            }
        }else{
            this.sortOption.selectedCampaignTypeIndex = index;//This is to highlight the tab
           
            if(this.isCampaignByLeads){
                this.campaignsPagination.pageIndex = 1;
                this.campaignsPagination.campaignType = type;
                this.listCampaignsByPartner(this.campaignsPagination);
            }
            else{
                this.campaignsPaginationByDeals.pageIndex = 1;
                this.campaignsPaginationByDeals.campaignType = type;
                this.listCampaignsDealsByPartner (this.campaignsPaginationByDeals);
            }
        }
    }

    /********Pages Navigation***********/
    navigatePages(event: any)
    {
        this.campaignsPagination.pageIndex = event.page;
        this.listCampaigns(this.campaignsPagination);
    }
    /*****Dropdown**********/
    changeSize(items: any, type: any)
    {
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.campaignsPagination);

    }

    /*********Show Partners***************/
    showPartners(campaign: any)
    {
        this.campaign = campaign
        if (!this.isPartner)
        {
            this.selectedCampaignId = campaign.id;
            //    this.campaingnList = false;
            campaign.expand = !campaign.expand;
            this.partnerList = true;
        } else
        {

            this.dealRegistrationService.getCampaignPartnerById(this.loggedInUserId).subscribe(data =>
            {
                this.selectedCampaignId = campaign.id;
                
                this.showLeads(data.partners);


            },
            error => console.log(error),
            () => { })


        }
    }
    showLeads(partner: any)
    {
        console.log(partner);
        this.partner = partner;
        this.leadList = true;
        this.campaingnList = false;
        if (this.isCampaignByLeads)
            this.filterDeals = "";
        else
            this.filterDeals = "TOTAL";

    }

    resetAllDeals()
    {
        this.isPartner = false;
        this.partner = null;
        this.leadList = false;
        this.campaingnList = true;
        this.partnerList = false;
        this.selectedCampaignId = null;
        this.filterDeals = "";
    }

    goToReDistributedPartnersDiv()
    {
        this.selectedTabIndex = 1;
        this.filterDeals = "TOTAL_LEADS";
        this.leadList = true;
        this.campaingnList = false;

    }
    showTotalDeals()
    {
        this.selectedTabIndex = 2;
        this.filterDeals = "TOTAL";
        this.leadList = true;
        this.campaingnList = false;

    }
    showOpenedLeads()
    {
        this.selectedTabIndex = 3;
        this.filterDeals = "OPENED";
        this.leadList = true;
        this.campaingnList = false;

    }
    showDealsOnHold()
    {
        this.selectedTabIndex = 5;
        this.filterDeals = "HOLD";
        this.leadList = true;
        this.campaingnList = false;

    }

    showApprovedLeads()
    {
        this.selectedTabIndex = 6;
        this.filterDeals = "APPROVED";
        this.leadList = true;
        this.campaingnList = false;

    }
    showRejectedLeads()
    {
        this.selectedTabIndex = 7;
        this.filterDeals = "REJECTED";
        this.leadList = true;
        this.campaingnList = false;

    }
    showClosedLeads()
    {
        this.selectedTabIndex = 4;
        this.filterDeals = "CLOSED";
        this.leadList = true;
        this.campaingnList = false;

    }

    dealAnalytics(deal: any)
    {

        if (deal === "status_change")
        {
            this.resetCounters();
        } else if (isNumber(deal))
        {
            this.showDealRegistrationForm(deal);
        } else
        {

            this.selectedDealId = deal.dealId;
            this.dealRegistrationService.getDealById(deal.dealId).subscribe(dealNew =>
            {
                this.selectedDeal = dealNew.data;

                const obj = { campaignId: this.selectedDeal.campaignId.toString() };


                this.campaignService.getCampaignById(obj).subscribe(campaign =>
                {

                    this.selectedCampaign = campaign;
                    this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.createdBy).subscribe(user =>
                    {

                        this.user = user;
                        this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.leadId).subscribe(lead =>
                        {

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
                    error =>
                    {
                        console.log(error);
                    })



            },
            error => console.log(error),
            () => { })
        }


    }
    dealRegistration(item: any)
    {


        this.dealRegistrationService.getDealById(item).subscribe(deal =>
        {
            this.selectedDeal = deal.data;
            this.selectedDealId = this.selectedDeal.dealId;
            const obj = { campaignId: this.selectedDeal.campaignId.toString() };

            this.campaignService.getCampaignById(obj).subscribe(campaign =>
            {

                this.selectedCampaign = campaign;


            },
                error =>
                {
                    console.log(error);
                })
            this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.createdBy).subscribe(user =>
            {

                this.user = user;

            },
            error => console.log(error),
            () => { })
            this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.leadId).subscribe(lead =>
            {

                this.selectedLead = lead;
                this.isDealAnalytics = false;
                this.isDealRegistration = false;
                this.isDealForm = true;



            },
            error => console.log(error),
            () => { })
            this.selectedDealId = item;
        },
        error => console.log(error),
        () => { })


    }

    dealAnalyticsDisable()
    {
        this.isDealAnalytics = !this.isDealAnalytics;
    }
    resetCounters()
    {
        if (!this.isPartner)
        {
            this.getTotalDeals();
            this.getOpenedDeals();
            this.getClosedDeals();
            this.getDealsOnHold();
            this.getApprovedDeals();
            this.getRejectedDeals();
        } else
        {
            this.getTotalDealsByPartner();
            this.getOpenedDealsByPartner();
            this.getClosedDealsByPartner();
            this.getDealsOnHoldByPartner();
            this.getApprovedDealsByPartner();
            this.getRejectedDealsByPartner();
        }

    }

    getDealInfo(item: any)
    {

        this.dealRegistrationService.getDealById(item).subscribe(deal =>
        {
            this.selectedDeal = deal.data;
            this.selectedDealId = this.selectedDeal.dealId;
            const obj = { campaignId: this.selectedDeal.campaignId.toString() };


            this.campaignService.getCampaignById(obj).subscribe(campaign =>
            {

                this.selectedCampaign = campaign;


            },
                error =>
                {
                    console.log(error);
                })
            this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.createdBy).subscribe(user =>
            {

                this.user = user;

            },
            error => console.log(error),
            () => { })
            this.dealRegistrationService.getDealCreatedBy(this.selectedDeal.leadId).subscribe(lead =>
            {

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
    showVendor()
    {
        
        this.isVendorVersion = true;
        this.isPartnerVersion = false;
        this.switchVersions();
    }
    showPartner()
    {
        this.isVendorVersion = false;
        this.isPartnerVersion = true;
        this.switchVersions();
    }

    showDealRegistrationForm(item)
    {

        this.getDealInfo(item);



    }
    disableDealRegistrationForm()
    {

        this.isDealRegistration = false;

    }
    disableDealPushRegistrationForm()
    {
        //this.resetCounters();
        this.isDealForm = false;
    }

    closeLeads(){
        if(this.isCampaignByLeads){
            this.showCampaigns();
        }else{
            this.showCampaignsByDeals();
        }
    }



    catchError(error: any, methodName: string)
    {
        this.hasClientErrors = true;
        this.xtremandLogger.showClientErrors(this.componentName, methodName, error);
    }

}
