import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router }   from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

import { VideoFileService} from '../../videos/services/video-file.service';
import { ContactService } from '../../contacts/services/contact.service';
import { CampaignService } from '../services/campaign.service';
import { UserService } from '../../core/services/user.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign} from '../models/campaign';
import { SaveVideoFile} from '../../videos/models/save-video-file';
import { ContactList } from '../../contacts/models/contact-list';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination} from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var swal, $, videojs, Metronic, Layout, Demo, TableManaged, Promise: any;


@Component({
    selector: 'app-manage-publish',
    templateUrl: './manage-publish.component.html',
    styleUrls: ['./manage-publish.component.css'],
    providers: [Pagination, HttpRequestLoader]
})
export class ManagePublishComponent implements OnInit, OnDestroy {
    campaigns: Campaign[];
    pager: any = {};
    pagedItems: any[];
    public totalRecords: number = 1;
    public searchKey: string = "";
    isCampaignDeleted: boolean = false;
    hasCampaignRole: boolean = false;
    hasStatsRole: boolean = false;
    campaignSuccessMessage: string = "";
    isScheduledCampaignLaunched: boolean = false;
    loggedInUserId: number = 0;
    hasAllAccess: boolean = false;
    sortByDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' }
    ];

    numberOfItemsPerPage = [
        { 'name': '10', 'value': '10' },
        { 'name': '20', 'value': '20' },
        { 'name': '30', 'value': '30' },
        { 'name': '40', 'value': '40' },
        { 'name': '50', 'value': '50' },
        { 'name': '---All---', 'value': '0' },
    ]

    public selectedSortedOption: any = this.sortByDropDown[0];
    public itemsSize: any = this.numberOfItemsPerPage[0];
    public isError: boolean = false;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    isListView: boolean = false;

    saveAsCampaignId = 0;
    saveAsCampaignName = '';

    constructor(private campaignService: CampaignService, private router: Router, private logger: XtremandLogger,
        private pagination: Pagination, private pagerService: PagerService,
        private refService: ReferenceService, private userService: UserService, private authenticationService: AuthenticationService) {
        this.loggedInUserId = this.authenticationService.getUserId();
        if (this.refService.campaignSuccessMessage == "SCHEDULE") {
            this.showMessageOnTop();
            this.campaignSuccessMessage = "Campaign Scheduled Successfully";
        } else if (this.refService.campaignSuccessMessage == "SAVE") {
            this.showMessageOnTop();
            this.campaignSuccessMessage = "Campaign Saved Successfully";
        } else if (this.refService.campaignSuccessMessage == "NOW") {
            this.showMessageOnTop();
            this.campaignSuccessMessage = "Campaign Launched Successfully";
        }
        this.hasCampaignRole = this.refService.hasSelectedRole(this.refService.roles.campaignRole);
        this.hasStatsRole = this.refService.hasSelectedRole(this.refService.roles.statsRole);
        this.hasAllAccess = this.refService.hasAllAccess();

    }
    showMessageOnTop() {
        $(window).scrollTop(0);
        setTimeout(function() { $("#lanchSuccess").slideUp(500); }, 5000);
    }

    listCampaign(pagination: Pagination) {
        this.refService.loading(this.httpRequestLoader, true);
        this.pagination.maxResults = 12;
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

    setPage(page: number) {
        this.pagination.pageIndex = page;
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
            this.isListView = this.refService.isListView;
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
                console.log(this.campaignService.campaign);
                let isLaunched = this.campaignService.campaign.launched;
                if (isLaunched) {
                    this.isScheduledCampaignLaunched = true;
                    setTimeout(function() { $("#scheduleCompleted").slideUp(1000); }, 5000);
                } else {
                    this.router.navigate(["/home/campaigns/edit"]);
                }

            },
            error => { this.logger.errorPage(error) },
            () => console.log()
            )
        this.isScheduledCampaignLaunched = false;
    }

    confirmDeleteCampaign(id: number) {
        let self = this;
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'

        }).then(function() {
            self.deleteCampaign(id);
        })
    }

    deleteCampaign(id: number) {
        this.campaignService.delete(id)
            .subscribe(
            data => {
                this.isCampaignDeleted = true;
                $('#campaignListDiv_' + id).remove();
                setTimeout(function() { $("#deleteSuccess").slideUp(500); }, 5000);
                this.pagination.pageIndex = this.pagination.pageIndex - 1;
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
                this.listCampaign(this.pagination);
                console.log("saveAsCampaign Successfully")
            },
            error => { this.logger.errorPage(error) },
            () => console.log("saveAsCampaign Successfully")
            );
    }
}
