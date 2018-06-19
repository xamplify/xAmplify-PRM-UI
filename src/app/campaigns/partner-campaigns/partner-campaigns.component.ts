import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../services/campaign.service';
import { UserService } from '../../core/services/user.service';
import { SocialService } from '../../social/services/social.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';

declare var $: any;
@Component({
    selector: 'app-partner-campaigns',
    templateUrl: './partner-campaigns.component.html',
    styleUrls: ['./partner-campaigns.component.css'],
    providers: [Pagination, HttpRequestLoader]
})
export class PartnerCampaignsComponent implements OnInit,OnDestroy {

    campaigns: Campaign[];
    pager: any = {};
    pagedItems: any[];
    public totalRecords: number = 1;
    public searchKey: string = "";
    campaignSuccessMessage: string = "";
    loggedInUserId: number = 0;
    sortByDropDown = [
        { 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' }
    ];

    numberOfItemsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' },
        { 'name': '---All---', 'value': '0' },
    ]

    public selectedSortedOption: any = this.sortByDropDown[3];
    public itemsSize: any = this.numberOfItemsPerPage[0];
    public isError: boolean = false;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    isListView: boolean = false;
    campaignType:string;

    customResponse: CustomResponse = new CustomResponse();

    constructor(private campaignService: CampaignService, private router: Router, private xtremandLogger: XtremandLogger,
        private pagination: Pagination, private pagerService: PagerService,
        public referenceService: ReferenceService, private userService: UserService, private socialService: SocialService,
        private authenticationService: AuthenticationService,private route: ActivatedRoute) {
        this.loggedInUserId = this.authenticationService.getUserId();
    }
    showMessageOnTop() {
        $(window).scrollTop(0);
    }

    listCampaign(pagination: Pagination) {
        this.referenceService.startLoader(this.httpRequestLoader);
        if(this.campaignType=="regular"){
            pagination.campaignType = "REGULAR";
        }else if(this.campaignType=="video"){
            pagination.campaignType="VIDEO";
        }else if(this.campaignType=="social"){
            pagination.campaignType = "SOCIAL";
        }else{
            pagination.campaignType = "NONE";
        }
        this.campaignService.listPartnerCampaigns(this.pagination, this.loggedInUserId)
            .subscribe(
                data => {
                    this.campaigns = data.campaigns;
                    this.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    this.referenceService.stopLoader(this.httpRequestLoader);
                },
                error => {
                    this.xtremandLogger.errorPage(error);
                },
                () => this.xtremandLogger.info("Finished listPartnerCampaigns()", this.campaigns)
            );
    }

    setPage(event) {
        this.pagination.pageIndex = event.page;
        this.listCampaign(this.pagination);
    }

    searchCampaigns() {
        this.getAllFilteredResults(this.pagination);
    }

    getSortedResult(text: any) {
        this.selectedSortedOption = text;
        this.getAllFilteredResults(this.pagination);
    }

    getNumberOfItemsPerPage(items: any) {
        this.itemsSize = items;
        this.getAllFilteredResults(this.pagination);
    }



    getAllFilteredResults(pagination: Pagination) {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.searchKey;
        let sortedValue = this.selectedSortedOption.value;
        if (sortedValue != "") {
            let options: string[] = sortedValue.split("-");
            this.pagination.sortcolumn = options[0];
            this.pagination.sortingOrder = options[1];
        }

        if (this.itemsSize.value == 0) {
            this.pagination.maxResults = this.pagination.totalRecords;
        } else {
            this.pagination.maxResults = this.itemsSize.value;
        }
        this.listCampaign(this.pagination);
    }



    ngOnInit() {
        try {
            this.isListView = !this.referenceService.isGridView;
            this.pagination.maxResults = 12;
            this.campaignType = this.route.snapshot.params['type'];
            this.listCampaign(this.pagination);
        } catch (error) {
            this.xtremandLogger.error("error in partner-campaigns.component.ts init() ", error);
        }

    }



    ngOnDestroy() {

    }


    filterCampaigns(type: string) {
        this.router.navigate(['/home/campaigns/partner/' + type]);
    }

    showCampaignPreview(campaignId:number){
        this.router.navigate(['/home/campaigns/preview/'+campaignId]);
    }

    navigateSocialCampaign(campaign:any) {
        this.socialService.getSocialCampaignByCampaignId( campaign.campaignId )
        .subscribe(
                data => {
                    this.router.navigate(['/home/campaigns/social', data.alias]);
                },
                error => { this.xtremandLogger.errorPage(error) },
                () => console.log()
            )
    }

    reDistributeCampaign(campaign:any){
        if(campaign.campaignType.indexOf('SOCIAL') > -1){
            this.navigateSocialCampaign(campaign);
        } else {
        const data = { 'campaignId': campaign.campaignId,'userId':this.loggedInUserId }
        this.campaignService.getParnterCampaignById(data)
            .subscribe(
                data => {
                    this.campaignService.reDistributeCampaign = data;
                    this.campaignService.isExistingRedistributedCampaignName = false;
                    this.router.navigate(['/home/campaigns/re-distribute-campaign']);
                },
                error => { this.xtremandLogger.errorPage(error) },
                () => console.log()
            )
        }

    }

}
