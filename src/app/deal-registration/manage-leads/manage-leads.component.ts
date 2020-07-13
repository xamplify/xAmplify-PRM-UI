import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, Output } from '@angular/core';
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
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { EventEmitter } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Campaign } from '../../campaigns/models/campaign';
import { User } from '../../core/models/user';
declare var swal, $: any;



@Component({
    selector: 'app-manage-leads',
    templateUrl: './manage-leads.component.html',
    styleUrls: ['./manage-leads.component.css'],
    providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue, CallActionSwitch]
})
export class ManageLeadsComponent implements OnInit, OnChanges {

    @Input() partner: any;
    @Input() campaignId: any;
    @Input() selectedCampaign: Campaign;
    @Input() filter: string;
    @Output() dealObj = new EventEmitter<any>();
    @Output() dealPushObj = new EventEmitter<any>();
    @Input() isPartner: any;
    @Input() isCampaignByLeads: boolean;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    pagination: Pagination = new Pagination();
    selectedDealId: any;
    isDealAnalytics: boolean = false;
    customResponse: CustomResponse = new CustomResponse();
    pageHeader = "";
    pageText = "";


    leadStatusArray = ["APPROVED", "OPENED", "HOLD", "REJECTED"];
    isCommentSection = false;
    isDealRegistration = false;
    campaign: Campaign;
    user: User;
    item: any;
    commentForLead: any;
    isDealSection = false;
    loggedInUser: User;
    ownCampaignLeadAndDeal = false;


    constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
        public utilService: UtilService, public referenceService: ReferenceService,
        private dealRegistrationService: DealRegistrationService, public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
        public sortOption: SortOption, public pagerService: PagerService, public callActionSwitch: CallActionSwitch) { }

    ngOnInit() {
        this.changePointerStyle(true);
        this.loggedInUser = this.authenticationService.user;
        if (!this.isPartner)
            this.listLeadsBasedOnFilters();
        else
            this.listLeadsBasedOnFiltersByPartner();
    }

    changePointerStyle(loading: boolean) {
        if (loading) {
            $('#deals-page-content-div').css('pointer-events', 'none');
        } else {
            $('#deals-page-content-div').css('pointer-events', 'visible');
        }

    }
    ngOnChanges(changes: SimpleChanges) {
        this.changePointerStyle(true);
        const filter: SimpleChange = changes.filter;

        this.filter = filter.currentValue;

        this.pagination = new Pagination();
        if (!this.isPartner)
            this.listLeadsBasedOnFilters();
        else
            this.listLeadsBasedOnFiltersByPartner();


    }
    listLeadsBasedOnFilters() {
        switch (this.filter) {
            case "TOTAL_LEADS": {
                this.isDealSection = false;
                this.pageText = "";
                this.pageHeader = "TOTAL LEADS";
                this.listAllLeads(this.pagination);

                break;
            }
            case "TOTAL": {
                this.isDealSection = true;
                this.pageText = "TOTAL DEALS";
                this.pageHeader = "CAMPAIGN: " + this.selectedCampaign.campaignName;
                this.ownCampaignLeadAndDeal = false;
                this.listAllDeals(this.pagination);
                break;
            }
            case "APPROVED": {
                this.isDealSection = true;
                this.pageText = "";
                this.pageHeader = "APPROVED DEALS";
                this.ownCampaignLeadAndDeal = false;
                this.listApprovedLeads(this.pagination);
                break;
            }
            case "REJECTED": {
                this.isDealSection = true;
                this.pageText = "";
                this.pageHeader = "REJECTED DEALS";
                this.ownCampaignLeadAndDeal = false;
                this.listRejectedLeads(this.pagination);
                break;
            }
            case "OPENED": {
                this.isDealSection = true;
                this.pageText = "";
                this.pageHeader = "OPENED DEALS";
                this.ownCampaignLeadAndDeal = false;
                this.listOpenedLeads(this.pagination);
                console.log(this.pagination)
                break;
            }
            case "HOLD": {
                this.isDealSection = true;
                this.pageText = "";
                this.pageHeader = "DEALS ON HOLD";
                this.ownCampaignLeadAndDeal = false;
                this.listHoldLeads(this.pagination);
                break;
            }
            // case "CLOSED": {
            //     this.isDealSection = true;
            //     this.pageText = "";
            //     this.pageHeader = "CLOSED DEALS";
            //     this.listClosedLeads(this.pagination);
            //     break;
            // }
            default: {
                this.isDealSection = false;
                this.pageText = "TOTAL LEADS";
                this.pageHeader = "CAMPAIGN: " + this.selectedCampaign.campaignName;
                this.ownCampaignLeadAndDeal = this.selectedCampaign['ownCampaignLeadAndDeal'];
                this.listLeads(this.pagination);
                break;
            }
        }

    }
    listLeadsBasedOnFiltersByPartner() {
        switch (this.filter) {
            case "TOTAL_LEADS": {
                this.isDealSection = false;
                this.pageText = "";
                this.pageHeader = "TOTAL LEADS";
                this.listAllLeadsByPartner(this.pagination);
                break;
            }
            case "TOTAL": {
                this.isDealSection = true;
                this.pageText = "TOTAL DEALS";
                this.pageHeader = "CAMPAIGN: " + this.selectedCampaign.campaignName;
                console.log(this.selectedCampaign)
                this.listAllDealsByPartner(this.pagination);
                break;
            }
            case "APPROVED": {
                this.isDealSection = true;
                this.pageText = "";
                this.pageHeader = "APPROVED DEALS";
                this.listApprovedLeadsByPartner(this.pagination);
                break;
            }
            case "REJECTED": {
                this.isDealSection = true;
                this.pageText = "";
                this.pageHeader = "REJECTED DEALS";
                this.listRejectedLeadsByPartner(this.pagination);
                break;
            }
            case "OPENED": {
                this.isDealSection = true;
                this.pageText = "";
                this.pageHeader = "OPENED DEALS";
                this.listOpenedLeadsByPartner(this.pagination);
                console.log(this.pagination)
                break;
            }
            case "HOLD": {
                this.isDealSection = true;
                this.pageText = "";
                this.pageHeader = "DEALS ON HOLD";
                this.listHoldLeadsByPartner(this.pagination);
                break;
            }
            // case "CLOSED": {
            //     this.isDealSection = true;
            //     this.pageText = "";
            //     this.pageHeader = "CLOSED DEALS";
            //     this.listClosedLeadsByPartner(this.pagination);
            //     break;
            // }

            default: {
                this.isDealSection = false;
                this.pageText = "TOTAL LEADS";
                this.pageHeader = "CAMPAIGN: " + this.selectedCampaign.campaignName;
                console.log(this.selectedCampaign)
                this.listLeadsByPartner(this.pagination);
                break;
            }
        }

    }
    listAllLeads(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listAllLeads(pagination)
            .subscribe(
                data => {
                    console.log(data)
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);

                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }

    listAllDeals(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);

        pagination.userId = this.partner.partnerId;
        pagination.campaignId = this.campaignId;

        this.dealRegistrationService.listAllDeals(pagination)
            .subscribe(
                data => {
                    console.log(data)
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);

                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }

    listApprovedLeads(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listLeadsByStatus(pagination, "approved")
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }
    listHoldLeads(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listLeadsByStatus(pagination, "hold")
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }

    listRejectedLeads(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listLeadsByStatus(pagination, "rejected")
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }
    listOpenedLeads(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listLeadsByStatus(pagination, "opened")
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }
    // listClosedLeads(pagination: Pagination)
    // {

    //     this.referenceService.loading(this.httpRequestLoader, true);
    //     pagination.userId = this.authenticationService.getUserId();

    //     this.dealRegistrationService.listLeadsByStatus(pagination,"closed")
    //         .subscribe(
    //             data =>
    //             {
    //                 this.sortOption.totalRecords = data.totalRecords;
    //                 pagination.totalRecords = data.totalRecords;
    //                 pagination = this.pagerService.getPagedItems(pagination, data.leads);
    //                 this.referenceService.loading(this.httpRequestLoader, false);
    //                 this.changePointerStyle(false);
    //             },
    //             (error: any) =>
    //             {
    //                 this.httpRequestLoader.isServerError = true;
    //                 this.changePointerStyle(false);
    //             }
    //         );

    // }


    listAllLeadsByPartner(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listAllLeadsByPartner(pagination)
            .subscribe(
                data => {

                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    pagination.pagedItems.forEach(element => {
                        if (!element.deal)
                            element.dealButtonText = "Register Deal"
                        else
                            element.dealButtonText = "Update Deal "
                    });

                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);

                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }
    listAllDealsByPartner(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();
        pagination.campaignId = this.campaignId;

        this.dealRegistrationService.listAllDealsByPartner(pagination)
            .subscribe(
                data => {
                    console.log(data)
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    pagination.pagedItems.forEach(element => {
                        element.dealButtonText = "Update Deal "
                    });

                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);

                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }

    listApprovedLeadsByPartner(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listPartnerLeadsByStatus(pagination, "approved")
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    pagination.pagedItems.forEach(element => {
                        element.dealButtonText = "Update Deal "
                    });
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }

    listRejectedLeadsByPartner(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listPartnerLeadsByStatus(pagination, "rejected")
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    pagination.pagedItems.forEach(element => {
                        element.dealButtonText = "Update Deal "
                    });
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }

    listOpenedLeadsByPartner(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listPartnerLeadsByStatus(pagination, "opened")
            .subscribe(
                data => {
                    console.log(data.leads)
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    pagination.pagedItems.forEach(element => {
                        element.dealButtonText = "Update Deal "
                    });
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }
    // listClosedLeadsByPartner(pagination: Pagination)
    // {

    //     this.referenceService.loading(this.httpRequestLoader, true);
    //     pagination.userId = this.authenticationService.getUserId();

    //     this.dealRegistrationService.listPartnerLeadsByStatus(pagination,"closed")
    //         .subscribe(
    //             data =>
    //             {
    //                 this.sortOption.totalRecords = data.totalRecords;
    //                 pagination.totalRecords = data.totalRecords;
    //                 pagination = this.pagerService.getPagedItems(pagination, data.leads);
    //                 pagination.pagedItems.forEach(element =>
    //                 {
    //                     element.dealButtonText = "Update Deal "
    //                 });
    //                 this.referenceService.loading(this.httpRequestLoader, false);
    //                 this.changePointerStyle(false);
    //             },
    //             (error: any) =>
    //             {
    //                 this.httpRequestLoader.isServerError = true;
    //                 this.changePointerStyle(false);
    //             }
    //         );

    // }

    listHoldLeadsByPartner(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.authenticationService.getUserId();

        this.dealRegistrationService.listPartnerLeadsByStatus(pagination, "hold")
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    pagination.pagedItems.forEach(element => {
                        element.dealButtonText = "Update Deal "
                    });
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }

    listLeadsByPartner(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.partner.partnerId;
        pagination.campaignId = this.campaignId;
        this.dealRegistrationService.listLeadsByPartner(pagination)
            .subscribe(
                data => {

                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    pagination.pagedItems.forEach(element => {
                        if (!element.deal)
                            element.dealButtonText = "Register Deal"
                        else
                            element.dealButtonText = "Update Deal "
                    });
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }
    listLeads(pagination: Pagination) {

        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.userId = this.partner.partnerId;
        pagination.campaignId = this.campaignId;
        this.dealRegistrationService.listLeads(pagination)
            .subscribe(
                data => {
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.leads);
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.changePointerStyle(false);
                },
                (error: any) => {
                    this.httpRequestLoader.isServerError = true;
                    this.changePointerStyle(false);
                }
            );

    }



    /********Pages Navigation***********/
    navigatePages(event: any) {
        this.pagination.pageIndex = event.page;
        if (!this.isPartner)
            this.listLeadsBasedOnFilters();
        else
            this.listLeadsBasedOnFiltersByPartner();
    }
    /*****Dropdown**********/
    changeSize(items: any, type: any) {
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.pagination);

    }


    sortLeads(text: any) {
        this.sortOption.selectedSortedOption = text;
        this.getAllFilteredResults(this.pagination);
    }

    searchLeadsKeyPress(keyCode: any) { if (keyCode === 13) { this.getAllFilteredResults(this.pagination); } }

    searchLeads() {
        this.getAllFilteredResults(this.pagination);
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
        if (!this.isPartner)
            this.listLeadsBasedOnFilters();
        else
            this.listLeadsBasedOnFiltersByPartner();

    }

    setSortColumns(pagination: Pagination, sortedValue: any) {
        if (sortedValue != "") {
            let options: string[] = sortedValue.split("-");
            pagination.sortcolumn = options[0];
            pagination.sortingOrder = options[1];
        }
    }
    setDealStatus(dealId: number, event: any) {
        try {

            this.dealRegistrationService.changeDealStatus(dealId, event, this.loggedInUser).subscribe(data => {
                this.customResponse = new CustomResponse('SUCCESS', "Successfully Changed ", true);
                this.dealObj.emit("status_change");
                if (!this.isPartner)
                    this.listLeadsBasedOnFilters();
                else
                    this.listLeadsBasedOnFiltersByPartner();

            });


        } catch (error) {
            this.xtremandLogger.error(error, "ManageLeadsComponent", "setDealStatus()");
        }
    }
    dealRouter(deal: any, event: any) {
        this.selectedDealId = deal.dealId;
        this.isDealAnalytics = true;
        this.dealObj.emit(deal);
        //this.router.navigate(['home/deals/'+deal.dealId+'/details']);
    }
    showComments(leadObj: any) {
        this.commentForLead = leadObj;
        this.isCommentSection = !this.isCommentSection;
    }
    addCommentModalClose(event: any) {
        this.commentForLead.newCommentCount = 0;
        console.log(this.commentForLead.newCommentCount)
        this.isCommentSection = !this.isCommentSection;
    }

    showDealRegistrationForm(item) {
        this.selectedDealId = item.dealId;
        this.dealPushObj.emit(item.dealId);
    }
    showLeadRegistrationForm(item) {
        this.selectedDealId = item.dealId;
        this.dealObj.emit(item.dealId);
    }
    showTimeLineView() {
        this.isDealRegistration = false;

    }
    getCommentCount(leads: any) {
        leads.forEach(element => {
            this.dealRegistrationService.getCommentsCount(element.dealId).subscribe(result => {
                if (isNaN(result))
                    element.commentCount = result.data;
                else
                    element.commentCount = 0;
            },
                error => console.log(error),
                () => { })
        });
    }


}
