import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
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
import { EventEmitter } from '@angular/core';
import { ManageLeadsComponent } from '../manage-leads/manage-leads.component';


@Component({
    selector: 'app-manage-partners',
    templateUrl: './manage-partners.component.html',
    styleUrls: ['./manage-partners.component.css'],
    providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue]
})
export class ManagePartnersComponent implements OnInit
{


    @Input() campaignId: number;
    @Output() leadObj = new EventEmitter<any>();
    @Input() isCampaignByLeads: boolean;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    pagination: Pagination = new Pagination();
    partnerList: boolean = false;
    leadList: boolean = false;
    partner: any = 0;
    selectedDealId: ManageLeadsComponent;
    @ViewChild(ManageLeadsComponent)
    set dealId(deal: ManageLeadsComponent)
    {
        this.selectedDealId = deal;

    };
    constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
        public utilService: UtilService, public referenceService: ReferenceService,
        private dealRegistrationService: DealRegistrationService, public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
        public sortOption: SortOption, public pagerService: PagerService) { }

    ngOnInit()
    {
        this.partnerList = true;
        //this.referenceService.leadList = this.leadList;
        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
            this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
            this. pagination.vanityUrlFilter = true;
        }
        if (this.isCampaignByLeads)
            this.listCampaignPartners(this.pagination);
        else
            this.listCampaignPartnersByDeals(this.pagination);
    }


    listCampaignPartners(pagination: Pagination)
    {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.campaignId = this.campaignId;
        this.dealRegistrationService.listCampaignPartners(pagination)
            .subscribe(
                data =>
                {

                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.partners);
                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: any) =>
                {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }
    listCampaignPartnersByDeals(pagination: Pagination)
    {
        this.referenceService.loading(this.httpRequestLoader, true);
        pagination.campaignId = this.campaignId;
        this.dealRegistrationService.listCampaignPartnersByDeals(pagination)
            .subscribe(
                data =>
                {

                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.partners);
                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: any) =>
                {
                    this.httpRequestLoader.isServerError = true;
                }
            );
    }
    /********Pages Navigation***********/
    navigatePages(event: any)
    {
        this.pagination.pageIndex = event.page;
        this.listCampaignPartners(this.pagination);
    }
    /*****Dropdown**********/
    changeSize(items: any, type: any)
    {
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.pagination);

    }


    sortPartners(text: any)
    {
        this.sortOption.selectedSortedOption = text;
        this.getAllFilteredResults(this.pagination);
    }

    searchPartnersKeyPress(keyCode: any) { if (keyCode === 13) { this.getAllFilteredResults(this.pagination); } }

    searchPartners()
    {
        this.getAllFilteredResults(this.pagination);
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
        if (this.isCampaignByLeads)
            this.listCampaignPartners(this.pagination);
        else
            this.listCampaignPartnersByDeals(this.pagination);

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

    showLeads(partner: any)
    {
        this.leadList = true;
        this.partnerList = false;
        this.partner = partner;
        this.leadObj.emit(partner);
    }

}
