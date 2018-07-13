import { Component, OnInit, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';

import { CampaignService } from '../services/campaign.service';
import { UserService } from '../../core/services/user.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { ActionsDescription } from '../../common/models/actions-description';


declare var swal, $: any;

@Component({
    selector: 'app-manage-publish',
    templateUrl: './manage-publish.component.html',
    styleUrls: ['./manage-publish.component.css'],
    providers: [Pagination, HttpRequestLoader, ActionsDescription]
})
export class ManagePublishComponent implements OnInit, OnDestroy {
    campaigns: Campaign[];
    isCampaignDeleted: boolean = false;
    hasCampaignRole: boolean = false;
    hasStatsRole: boolean = false;
    campaignSuccessMessage: string = "";
    isScheduledCampaignLaunched: boolean = false;
    loggedInUserId: number = 0;
    hasAllAccess: boolean = false;
    selectedCampaignTypeIndex: number = 0;
        pager: any = {};
        pagedItems: any[];
        public totalRecords: number = 1;
        public searchKey: string = "";
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

    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    isListView: boolean = false;

    public isError: boolean = false;
    saveAsCampaignId = 0;
    saveAsCampaignName = '';
    isOnlyPartner: boolean = false;
    customResponse: CustomResponse = new CustomResponse();

    constructor(private campaignService: CampaignService, private router: Router, private logger: XtremandLogger,
        public pagination: Pagination, private pagerService: PagerService, public utilService:UtilService, public actionsDescription: ActionsDescription,
        public refService: ReferenceService, private userService: UserService, public authenticationService: AuthenticationService) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.utilService.setRouterLocalStorage('managecampaigns');
        if (this.refService.campaignSuccessMessage == "SCHEDULE") {
            this.showMessageOnTop();
            this.campaignSuccessMessage = "Campaign scheduled successfully";
            this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
        } else if (this.refService.campaignSuccessMessage == "SAVE") {
            this.showMessageOnTop();
            this.campaignSuccessMessage = "Campaign saved successfully";
            this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
        } else if (this.refService.campaignSuccessMessage == "NOW") {
            this.showMessageOnTop();
            this.campaignSuccessMessage = "Campaign launched successfully";
            this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
        }
        this.hasCampaignRole = this.refService.hasSelectedRole(this.refService.roles.campaignRole);
        this.hasStatsRole = this.refService.hasSelectedRole(this.refService.roles.statsRole);
        this.hasAllAccess = this.refService.hasAllAccess();
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();

    }
    showMessageOnTop() {
        $(window).scrollTop(0);
        // setTimeout(function() { $("#lanchSuccess").slideUp(500); }, 5000);
    }

    listCampaign(pagination: Pagination) {
        this.refService.loading(this.httpRequestLoader, true);
        pagination.searchKey = this.searchKey;
        this.campaignService.listCampaign(pagination, this.loggedInUserId)
            .subscribe(
                data => {
                    this.campaigns = data.campaigns;
                    this.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    this.refService.loading(this.httpRequestLoader, false);
                },
                error => {
                    this.logger.errorPage(error);
                },
                () => this.logger.info("Finished listCampaign()", this.campaigns)
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
        this.pagination = this.utilService.sortOptionValues(this.selectedSortedOption, this.pagination);
        if (this.itemsSize.value == 0) {
            this.pagination.maxResults = this.pagination.totalRecords;
        } else {
            this.pagination.maxResults = this.itemsSize.value;
        }
        this.listCampaign(this.pagination);
    }



    ngOnInit() {
        try {
            this.isListView = !this.refService.isGridView;
            this.pagination.maxResults = 12;
            this.listCampaign(this.pagination);

        } catch (error) {
            this.logger.error("error in manage-publish-component init() ", error);
        }

    }

    editCampaign(id: number) {
        var obj = { 'campaignId': id }
        this.campaignService.getCampaignById(obj)
            .subscribe(
                data => {
                    this.campaignService.campaign = data;
                    let isLaunched = this.campaignService.campaign.launched;
                    let isNurtureCampaign = this.campaignService.campaign.nurtureCampaign;
                    let campaignType = this.campaignService.campaign.campaignType;
                    if (isLaunched) {
                        this.isScheduledCampaignLaunched = true;
                        //  setTimeout(function() { $("#scheduleCompleted").slideUp(1000); }, 5000);
                    } else {
                        if (isNurtureCampaign) {
                            this.campaignService.reDistributeCampaign = data;
                            this.campaignService.isExistingRedistributedCampaignName = true;
                            this.router.navigate(['/home/campaigns/re-distribute-campaign']);
                        } else {
                            this.refService.isEditNurtureCampaign = false;
                            this.router.navigate(["/home/campaigns/edit"]);
                        }


                    }

                },
                error => { this.logger.errorPage(error) },
                () => console.log()
            )
        this.isScheduledCampaignLaunched = false;
    }

    confirmDeleteCampaign(id: number, position: number, name: string) {
        let self = this;
        swal({
            title: 'Are you sure?',
            text: "You won't be able to undo this action",
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it!'

        }).then(function () {
            self.deleteCampaign(id, position, name);
        }, function (dismiss: any) {
            console.log('you clicked on option' + dismiss);
        });
    }

    deleteCampaign(id: number, position: number, campaignName: string) {
        this.campaignService.delete(id)
            .subscribe(
                data => {
                    this.isCampaignDeleted = true;
                    // $('#campaignListDiv_' + id).remove();
                    //  setTimeout(function() { $("#deleteSuccess").slideUp(500); }, 5000);
                    //  this.pagination.pageIndex = this.pagination.pageIndex - 1;
                    const deleteMessage = campaignName + ' Campaign deleted successfully';
                    this.customResponse = new CustomResponse('SUCCESS', deleteMessage, true);
                    this.pagination.pagedItems.splice(position, 1);
                    this.pagination.pageIndex = 1;
                    this.listCampaign(this.pagination);
                },
                error => { this.logger.errorPage(error) },
                () => console.log("Campaign Deleted Successfully")
            );
        this.isCampaignDeleted = false;
    }

    ngOnDestroy() {
        this.isCampaignDeleted = false;
        this.refService.campaignSuccessMessage = "";
        swal.close();

    }
    openSaveAsModal(id: number, name: string) {
        $('#saveAsModal').modal('show');
        this.saveAsCampaignId = id;
        this.saveAsCampaignName = name + "_copy";
    }

    saveAsCampaign() {
        console.log(this.saveAsCampaignId + '-' + this.saveAsCampaignName);
        let campaign = new Campaign();
        campaign.campaignName = this.saveAsCampaignName;
        campaign.campaignId = this.saveAsCampaignId;
        campaign.scheduleCampaign = "SAVE";
        console.log(campaign);
        this.campaignService.saveAsCampaign(campaign)
            .subscribe(
                data => {
                    console.log(data);
                    this.campaignSuccessMessage = "Campaign copied successfully";
                    $('#lanchSuccess').show(600);
                    $('#saveAsModal').modal('hide');
                    this.showMessageOnTop();
                    this.listCampaign(this.pagination);
                    console.log("saveAsCampaign Successfully")
                },
                error => { $('#saveAsModal').modal('hide'); this.logger.errorPage(error) },
                () => console.log("saveAsCampaign Successfully")
            );
    }


    filterCampaigns(type: string, index: number) {
        this.selectedCampaignTypeIndex = index;//This is to highlight the tab
        this.pagination.pageIndex = 1;
        this.pagination.campaignType = type;
        this.listCampaign(this.pagination);

    }
    filterByUserNameOrDate() {

    }
    campaginRouter(campaign:any){
      this.refService.campaignType = campaign.campaignType;
      this.router.navigate(['/home/campaigns/'+campaign.campaignId+'/details']);

    }
    showCampaignPreview(campaignId:number){
        this.router.navigate(['/home/campaigns/preview/'+campaignId]);
    }

}
