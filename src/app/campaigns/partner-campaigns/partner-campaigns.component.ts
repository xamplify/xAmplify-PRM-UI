import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../services/campaign.service';
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
    campaignName:string;
    sortByDropDown = [
        { 'name': 'Campaign Name(A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Campaign Name(Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Company Name(A-Z)', 'value': 'company-ASC' },
        { 'name': 'Company Name(Z-A)', 'value': 'company-DESC' },
        { 'name': 'Date Received(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Date Received(DESC)', 'value': 'createdTime-DESC' }
    ];

    numberOfItemsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' },
        { 'name': '---All---', 'value': '0' },
    ]

    public selectedSortedOption: any = this.sortByDropDown[5];
    public itemsSize: any = this.numberOfItemsPerPage[0];
    public isError: boolean = false;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    isListView: boolean = false;
    campaignType:string;
    role = '';

    customResponse: CustomResponse = new CustomResponse();

    constructor(private campaignService: CampaignService, private router: Router, private xtremandLogger: XtremandLogger,
        public pagination: Pagination, private pagerService: PagerService,
        public referenceService: ReferenceService, private socialService: SocialService,
        private authenticationService: AuthenticationService,private route: ActivatedRoute) {
        this.loggedInUserId = this.authenticationService.getUserId();

        const currentUrl = this.router.url;
        if ( currentUrl.includes( 'campaigns/vendor' ) ) {
            this.role = "Vendor"
        } else {
            this.role = "Partner"
        }
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
        }else if(this.campaignType=="event"){
          pagination.campaignType = "EVENT";
        }else{
            pagination.campaignType = "NONE";
        }

        if ( this.role == "Vendor" ) {
            pagination.filterValue = this.referenceService.vendorDetails.id;
            pagination.filterKey = "customerId";
        }else{
            pagination.filterValue = null;
            pagination.filterKey = null;
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
        if ( this.role == "Vendor" ) {
            this.router.navigate( ['/home/campaigns/vendor/' + type] );
        } else {
            this.router.navigate( ['/home/campaigns/partner/' + type] );
        }
    }

    showCampaignPreview(campaign:any){
        if(campaign.campaignType === 'EVENT') {
       //   this.router.navigate(['/home/campaigns/event-preview/'+campaign.campaignId]);
          this.getEventCampaignId(campaign.campaignId);
        } else {
        //  this.router.navigate(['/home/campaigns/preview/'+campaign.campaignId]);
           this.getCampaignById(campaign.campaignId);
        }
    }
//    showCampaignPreview(campaignId:number){
//        this.referenceService.isRedistributionCampaignPage = true;
//        this.router.navigate(['/home/campaigns/preview/'+campaignId]);
//    }

    getCampaignById(campaignId) {
      var obj = { 'campaignId': campaignId }
      this.campaignService.getCampaignById( obj )
          .subscribe(
          data => {
            const emailTemplateId = data.emailTemplate;
            this.campaignName = data.campaignName;
            this.previewEmailTemplate(emailTemplateId, data)
          },
          error => { this.xtremandLogger.errorPage( error ) },
          () => console.log() )
    }
    previewEmailTemplate(emailTemplate: any, campaign){
      this.referenceService.previewEmailTemplate(emailTemplate, campaign);
    }
    getEventCampaignId(campaignid){
      this.campaignService.getEventCampaignById(campaignid).subscribe(
        (result)=>{
          console.log(result.data.emailTemplateDTO.body)
          result.data.emailTemplateDTO.body = result.data.emailTemplateDTO.body.replace( "https://aravindu.com/vod/images/us_location.png", " " );
          this.campaignName = result.data.campaign;
          $("#email-template-content").empty();
          $("#email-template-title").empty();
          $("#email-template-content").append(result.data.emailTemplateDTO.body);
          $('.modal .modal-body').css('overflow-y', 'auto');
          $("#email_template_preivew").modal('show');
          $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
         });
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
    listCampaigns(event){

    }

    reDistributeCampaign(campaign:any){
        if(campaign.campaignType.indexOf('SOCIAL') > -1){
            this.navigateSocialCampaign(campaign);
        } else if(campaign.campaignType.indexOf('EVENT') > -1) {
          this.router.navigate(['/home/campaigns/re-distribute-event/'+campaign.campaignId]);
        }
        else {
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
