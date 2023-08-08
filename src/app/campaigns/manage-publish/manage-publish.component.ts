import { Component, OnInit, OnDestroy,ViewChild,Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../services/campaign.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { EventCampaign } from '../models/event-campaign';
import { ActionsDescription } from '../../common/models/actions-description';
import { CampaignAccess } from '../models/campaign-access';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import {AddMoreReceiversComponent} from '../add-more-receivers/add-more-receivers.component';
import {PublicEventEmailPopupComponent} from '../public-event-email-popup/public-event-email-popup.component';
import { UserService } from '../../core/services/user.service';
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import { utc } from 'moment';
import { Properties } from 'app/common/models/properties';

declare var swal, $: any, flatpickr;

@Component({
    selector: 'app-manage-publish',
    templateUrl: './manage-publish.component.html',
    styleUrls: ['./manage-publish.component.css'],
    providers: [Pagination, HttpRequestLoader, ActionsDescription, CampaignAccess, CallActionSwitch,Properties]
})
export class ManagePublishComponent implements OnInit, OnDestroy {
    campaigns: Campaign[];
    isCampaignDeleted = false;
    hasCampaignRole = false;
    hasStatsRole = false;
    campaignSuccessMessage = "";
    isScheduledCampaignLaunched = false;
    loggedInUserId = 0;
    hasAllAccess = false;
    selectedCampaignTypeIndex = 0;
    pager: any = {};
    pagedItems: any[];
    totalRecords = 1;
    searchKey = "";
    isLastElement = false;
    campaignType: string;
    sortByDropDown = [
        { 'name': 'Sort By', 'value': 'createdTime-DESC' },
        { 'name': 'Name (A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Name (Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' }
    ];

    sortByDropDownArchived = [
        { 'name': 'Sort By', 'value': 'createdTime-DESC' },
        { 'name': 'Name (A-Z)', 'value': 'campaign-ASC' },
        { 'name': 'Name (Z-A)', 'value': 'campaign-DESC' },
        { 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' },
        { 'name': 'Archived On (ASC)', 'value': 'archivedTime-ASC' },
        { 'name': 'Archived On (DESC)', 'value': 'archivedTime-DESC' }
    ];

    numberOfItemsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' },
        { 'name': 'All', 'value': '0' },
    ]
    itemsSize: any;
    selectedSortedOption: any = this.sortByDropDown[0];
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    campaignPartnerLoader: HttpRequestLoader = new HttpRequestLoader();
    endDateRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    isError = false;
    saveAsCampaignId = 0;
    saveAsCampaignName = '';
    isOnlyPartner = false;
    customResponse: CustomResponse = new CustomResponse();
    saveAsCampaignInfo: any;
    partnerActionResponse: CustomResponse = new CustomResponse();
    partnersPagination: Pagination = new Pagination();

    cancelEventMessage = "";
    selectedCancelEventId: number;
    selectedCancelEventChannelCampaign=false;
    selectedCancelEventNurtureCampaign=false;
    selectedCancelEventToPartnerCampaign=false;
    eventCampaign: EventCampaign = new EventCampaign();
    cancelEventSubjectLine = "";
    cancelEventButton = false;
    isloading: boolean;
    previewCampaign: any;
    copiedLinkCustomResponse: CustomResponse = new CustomResponse();
    publicEventAlias:string = "";
    publicEventAliasUrl:string = "";
    @ViewChild('addMoreReceivers') adddMoreReceiversComponent: AddMoreReceiversComponent;
    @ViewChild('publiEventEmailPopup') publicEventEmailPopupComponent: PublicEventEmailPopupComponent;
    addWorkflows = false;
    selectedCampaign:any;
    teamMemberId: number;
    categoryId:number = 0;
    modulesDisplayType = new ModulesDisplayType();
    exportObject:any = {};
    templateEmailOpenedAnalyticsAccess = false;
    modalPopupLoader = false;
    showFilterOption: boolean = false;
    fromDateFilter: any = "";
    toDateFilter: any = "";
    filterResponse: CustomResponse = new CustomResponse(); 
    filterMode: boolean = false;
    archived: boolean = false;
    navigatingToRelatedComponent: boolean = false;
    showEditEndDateForm: boolean;
    endDate: any;
    selectedEndDate: any;
    endDateCustomResponse: CustomResponse = new CustomResponse();
    endDatePickr: any;
    clicked = false;
    editButtonClicked = false;
    selectedCampaignId = 0;
    showUpArrowButton = false;
    /******** user guide *************/
    mergeTagForGuide:any;
    constructor(public userService: UserService, public callActionSwitch: CallActionSwitch, private campaignService: CampaignService, private router: Router, private logger: XtremandLogger,
        public pagination: Pagination, private pagerService: PagerService, public utilService: UtilService, public actionsDescription: ActionsDescription,
        public refService: ReferenceService, public campaignAccess: CampaignAccess, public authenticationService: AuthenticationService,
        private route: ActivatedRoute,public renderer:Renderer,public properties:Properties) {
		this.refService.renderer = this.renderer;    
        this.loggedInUserId = this.authenticationService.getUserId();
        this.utilService.setRouterLocalStorage('managecampaigns');
        this.itemsSize = this.numberOfItemsPerPage[0];
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
            this.campaignSuccessMessage = this.properties.campaignLaunchedMessage;
            this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
        } else if (this.refService.campaignSuccessMessage == "UPDATE") {
            this.showMessageOnTop();
            this.campaignSuccessMessage = "Campaign updated successfully";
            this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
        }
        this.hasCampaignRole = this.refService.hasSelectedRole(this.refService.roles.campaignRole);
        this.hasStatsRole = this.refService.hasSelectedRole(this.refService.roles.statsRole);
        this.hasAllAccess = this.refService.hasAllAccess();
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        this.modulesDisplayType = this.refService.setDefaultDisplayType(this.modulesDisplayType);       
    }


    receiveNotificationFromWorkflows(event:string) {
        if(event.length>0){
            this.customResponse = new CustomResponse('SUCCESS',event, true);
        }
        this.addWorkflows = false;
    }

    showMessageOnTop() {
        $(window).scrollTop(0);
        this.customResponse = new CustomResponse('SUCCESS', 'Copy campaign saved successfully', true);
        // setTimeout(function() { $("#lanchSuccess").slideUp(500); }, 5000);
    }

    listCampaign(pagination: Pagination) {
        this.refService.goToTop();
        this.isloading = true;
        this.refService.loading(this.httpRequestLoader, true);
        pagination.searchKey = this.searchKey;
        if(this.pagination.teamMemberAnalytics){
            this.pagination.teamMemberId = this.teamMemberId;
        }
        //Added by Vivek for Vanity URL
        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
            this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
            this.pagination.vanityUrlFilter = true;
        }
        this.pagination.archived = this.archived;
        this.campaignService.listCampaign(pagination, this.loggedInUserId)
            .subscribe(
            data => {
                this.isloading = false;
                if(data.access){
                    this.campaigns = data.campaigns;
                    this.templateEmailOpenedAnalyticsAccess = data.templateEmailOpenedAnalyticsAccess;
                    $.each(this.campaigns, function (_index:number, campaign) {
                        campaign.displayTime = new Date(campaign.utcTimeInString);
                        campaign.createdDate = new Date(campaign.createdDate);                        
                    });
                    this.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    this.refService.loading(this.httpRequestLoader, false);
                }else{
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.isloading = false;
                this.logger.errorPage(error);
            });
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
        this.pagination = pagination;
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.searchKey;
        this.pagination = this.utilService.sortOptionValues(this.selectedSortedOption, this.pagination);
        this.pagination.maxResults = pagination.maxResults;
        if (this.itemsSize.value === "0") {
            this.pagination.maxResults = this.pagination.totalRecords;
        } else {
            this.pagination.maxResults = this.itemsSize.value;
        }
        this.listCampaign(this.pagination);
    }
    eventHandler(keyCode: any) { if (keyCode === 13) { this.searchCampaigns(); } }
    checkLastElement(i: any) {
        if (this.pagination.pagedItems.length > 2 && (i === (this.pagination.pagedItems.length - 1) || i === this.pagination.pagedItems.length - 2)) { this.isLastElement = true; } else { this.isLastElement = false; }
    }
    
    ngAfterViewInit() {        
        let now:Date = new Date();
        let defaultDate = now;
        if (this.selectedEndDate != undefined && this.selectedEndDate != null) {
            defaultDate = new Date(this.selectedEndDate);
        }

        this.endDatePickr = flatpickr('#campaignEndDate', {
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            time_24hr: true,
            minDate: now,
            defaultDate: defaultDate
        }); 
        
        flatpickr('.dateFilterPickr', {
            enableTime: false,
            dateFormat: 'Y-m-d',
            maxDate: new Date()
        });
    }
   
    
    ngOnInit() {
        try {             
            this.archived = this.campaignService.archived;    
            if (this.archived) {
                this.selectedSortedOption = this.sortByDropDownArchived[0];
            }   
            this.refService.loading(this.httpRequestLoader, true);
            this.authenticationService.isPartnershipOnlyWithPrm().subscribe(
                response=>{
                    if(response.data){
                        this.refService.goToAccessDeniedPage();
                    }else{
                        this.refService.loading(this.httpRequestLoader, false);
                        this.getCampaignTypes();
                    }
                },error=>{
                    this.isloading = false;
                    this.logger.errorPage(error);
                });
                 /******* user guide  ********/
            if (this.authenticationService.isOnlyPartner() || this.authenticationService.module.loggedInThroughVendorVanityUrl) {
                this.mergeTagForGuide = 'manage_campaigns_partner';
            } else {
                this.mergeTagForGuide = 'manage_campaigns_vendor';
            }
            /******* user guide  ********/
            
        } catch (error) {
            this.logger.error("error in manage-publish-component init() ", error);
        }
    }

    getCampaignTypes(){
        this.isloading = true;
        this.refService.loading(this.httpRequestLoader, true);
        this.campaignService.getCampaignTypes().subscribe(
            response=>{
                let campaignAccess = response.data;
                this.campaignAccess.emailCampaign = campaignAccess.regular;
                this.campaignAccess.videoCampaign = campaignAccess.video;
                this.campaignAccess.socialCampaign = campaignAccess.social;
                this.campaignAccess.eventCampaign = campaignAccess.event;
                this.campaignAccess.landingPageCampaign = campaignAccess.page;
                this.campaignAccess.formBuilder = campaignAccess.form;
                this.campaignAccess.survey = campaignAccess.survey;
            },_error=>{
                this.refService.showSweetAlertErrorMessage("Unable to fetch campaign types");
                this.isloading = false;
                this.refService.loading(this.httpRequestLoader, false);
            },()=>{
                this.isloading = false;
                this.refService.loading(this.httpRequestLoader, false);
                this.teamMemberId = this.route.snapshot.params['teamMemberId'];
                if(this.teamMemberId!=undefined){
                    this.pagination.teamMemberAnalytics = true;
                }else{
                    this.pagination.teamMemberAnalytics = false;
                }
                if(this.router.url.endsWith('/')){
                    this.setViewType('Folder-Grid');
                }else{
                    this.refService.manageRouter = true;
                    this.pagination.maxResults = 12;
                    this.categoryId = this.route.snapshot.params['categoryId'];
                    if(this.categoryId!=undefined ){
                        this.pagination.categoryId = this.categoryId;
                        this.pagination.categoryType = 'c';
                    }
                    let showList = this.modulesDisplayType.isListView || this.modulesDisplayType.isGridView || this.categoryId!=undefined;
                    let isTeamMemberFilter = this.router.url.indexOf("manage/tm")>-1;
                    if(showList || isTeamMemberFilter){
                        if(!this.modulesDisplayType.isListView && !this.modulesDisplayType.isGridView){
                            this.modulesDisplayType.isListView = true;
                            this.modulesDisplayType.isGridView = false;
                        }
                        this.modulesDisplayType.isFolderListView = false;
                        this.modulesDisplayType.isFolderGridView = false;
                        this.listCampaign(this.pagination);
                    }else if(this.modulesDisplayType.isFolderGridView){
                        this.setViewType('Folder-Grid');
                    }else if(this.modulesDisplayType.isFolderListView){
                        this.setViewType('Folder-List');
                    }
                }
            }
        );
    }


    updateEvent(campaign: any) {
        this.router.navigate(['/home/campaigns/event-update/' + campaign.campaignId])
    }

    editCampaign(campaign: any) {
        this.isloading = true;
        this.customResponse = new CustomResponse();
        if(campaign.launched){
            this.editButtonClicked = true;
            this.selectedCampaignId = campaign.campaignId;
            this.isloading = false;
        }else{
            this.editCampaignsWhichAreNotLaunched(campaign);
        }
    }

    editCampaignsWhichAreNotLaunched(campaign:any){
        if (campaign.campaignType.indexOf('EVENT') > -1) {
            let obj = { 'campaignId': campaign.campaignId }
            this.campaignService.editCampaign(obj)
                .subscribe(
                data => {
                        this.campaignService.campaign = data; 
                        let endDate = this.campaignService.campaign.endDate;
                        if (endDate != undefined && endDate != null) {
                            this.campaignService.campaign.endDate = utc(endDate).local().format("YYYY-MM-DD HH:mm");
                        }                      
                        let isLaunched = this.campaignService.campaign.launched;
                        if (isLaunched || data.campaignProcessing) {
                        	this.isScheduledCampaignLaunched = true;
                            this.isloading = false;
                        } else {
                        	 if (campaign.nurtureCampaign) {
                                 this.campaignService.reDistributeEvent = false;
                                 this.isPartnerGroupSelected(campaign.campaignId,true);
                             } else {
                                  this.router.navigate(['/home/campaigns/event-edit/' + campaign.campaignId]); 
                              }
                        }
                },
                error => {
                    this.showErrorResponse(error);
                    });
            this.isScheduledCampaignLaunched = false;     	
        }
        else {
            let obj = { 'campaignId': campaign.campaignId }
            this.campaignService.editCampaign(obj)
                .subscribe(
                data => {
                    if (data.campaignType === 'SOCIAL') {
                        let isLaunched = data.launched;
                        if (isLaunched || data.campaignProcessing) {
                            this.isScheduledCampaignLaunched = true;
                            this.isloading = false;
                        }else{
                            this.editButtonClicked = true;
                            this.selectedCampaignId = campaign.campaignId;
                            this.isloading = false;
                        }
                    } else {
                        this.campaignService.campaign = data;
                        let endDate = this.campaignService.campaign.endDate;
                        if (endDate != undefined && endDate != null) {
                            this.campaignService.campaign.endDate = utc(endDate).local().format("YYYY-MM-DD HH:mm");
                        }
                        let isLaunched = this.campaignService.campaign.launched;
                        let isNurtureCampaign = this.campaignService.campaign.nurtureCampaign;
                        if (isLaunched || data.campaignProcessing) {
                            this.isScheduledCampaignLaunched = true;
                            this.isloading = false;
                        } else {
                            if (isNurtureCampaign) {
                                /*********XNFR-125*********/
                                if(campaign.oneClickLaunch){
                                    this.checkOneClickLaunchRedistributeEditAccess(data,campaign);
                                }else{
                                   this.navigateToRedistributeCampaign(data,campaign);
                                }
                            }
                            else {
                                /********XNFR-125*******/
                                this.checkOneClickLaunchAccess(campaign.campaignId,data.campaignType);
                            }
                        }
                    }
                },
                error => {
                    this.showErrorResponse(error);
                });
            this.isScheduledCampaignLaunched = false;
        }
    }
    private showErrorResponse(error: any) {
        let statusCode = JSON.parse(error["status"]);
        if (statusCode == 400) {
            this.refService.scrollSmoothToTop();
            this.isScheduledCampaignLaunched = true;
            this.isloading = false;
        } else {
            this.logger.errorPage(error);
        }
    }

    /*****XNFR-125*****/
    checkOneClickLaunchAccess(campaignId:number,campaignType:string){
        this.isloading = true;
        this.customResponse = new CustomResponse();
        this.campaignService.checkOneClickLaunchAccess(campaignId).
        subscribe(
            response=>{
                let access = response.data;
                if(access){
                    this.refService.isEditNurtureCampaign = false;
                    if("REGULAR"==campaignType || "SURVEY"==campaignType || "VIDEO"==campaignType || "LANDINGPAGE"==campaignType){
                        let urlSuffix = "";
                        if("REGULAR"==campaignType){
                            urlSuffix="email";
                        }else if("SURVEY"==campaignType){
                            urlSuffix = "survey";
                        }else if("VIDEO"==campaignType){
                            urlSuffix = "video";
                        }else if("LANDINGPAGE"==campaignType){
                            urlSuffix = "page";
                        }
                        this.router.navigate(["/home/campaigns/edit/"+urlSuffix]);
                    }else{
                        this.router.navigate(["/home/campaigns/edit"]);
                    }
                }else{
                    this.refService.scrollSmoothToTop();
                    let message = "Edit Campaign is not available, as One-Click Launch access has been removed for your account";
                    this.customResponse = new CustomResponse('ERROR',message,true);
                }
                this.isloading = false;
            },error=>{
                this.isloading = false;
                this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
            });
    }


    /**********XNFR-125***********/
    checkOneClickLaunchRedistributeEditAccess(data:any,campaign:any){
        this.customResponse = new CustomResponse();
        this.campaignService.checkOneClickLaunchRedistributeEditAccess(campaign.campaignId).
        subscribe(
            response=>{
                if(response.data){
                    this.navigateToRedistributeCampaign(data,campaign);
                }else{
                    this.refService.goToTop();
                    let statusCode = response.statusCode;
                    let message = statusCode==400 ? this.properties.emptyShareListErrorMessage : this.properties.oneClickLaunchRedistributeAccessRemovedErrorMessage;
                    this.customResponse = new CustomResponse("ERROR",message,true);
                    this.isloading = false;
                }
            },_error=>{
                this.isloading = false;
                this.customResponse = new CustomResponse("ERROR",this.properties.serverErrorMessage,true);
            }
        );
    }
    /**********XNFR-125***********/
    navigateToRedistributeCampaign(data:any,campaign:any){
        this.campaignService.reDistributeCampaign = data;
        this.campaignService.isExistingRedistributedCampaignName = true;
        this.isPartnerGroupSelected(campaign.campaignId,false);
    }



    isPartnerGroupSelected(campaignId:number,eventCampaign:boolean){
        this.pagination.campaignId = campaignId;
        this.pagination.userId = this.loggedInUserId;
        this.campaignService.isPartnerGroupSelected(this.pagination).
        subscribe(
            response=>{
               if(response.data){
                   let message = "This campaign cannot be edited as "+this.authenticationService.partnerModule.customName+" group has been selected.";
                   this.customResponse = new CustomResponse('ERROR',message,true); 
                   this.isloading = false;
 				   this.refService.goToTop();
               }else{
                   if(eventCampaign){
                    this.router.navigate(['/home/campaigns/re-distribute-manage/' + campaignId]);
                   }else{
                    this.router.navigate(['/home/campaigns/re-distribute-campaign']);

                   }
               }
        },error=>{
            this.isloading = false;
            this.logger.errorPage(error);
        });
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
        this.customResponse = new CustomResponse();
        this.refService.goToTop();
        this.refService.loading(this.httpRequestLoader, true);
        this.campaignService.delete(id)
            .subscribe(
            data => {
                if(data.access){
                    this.refService.loading(this.httpRequestLoader, false);
                    this.isCampaignDeleted = true;
                    const deleteMessage = campaignName + ' deleted successfully';
                    this.customResponse = new CustomResponse('SUCCESS', deleteMessage, true);
                    this.pagination.pagedItems.splice(position, 1);
                    this.pagination.pageIndex = 1;
                    this.listCampaign(this.pagination);
                    this.listNotifications();
                }else{
                    this.authenticationService.forceToLogout();
                }
                
            },
            error => { 
                this.refService.loading(this.httpRequestLoader, false);
                this.customResponse = new CustomResponse('ERROR','This campaign cannot be deleted at this time.Please try after sometime',true);
               // this.logger.errorPage(error)
             },
            () => console.log("Campaign Deleted Successfully")
            );
        this.isCampaignDeleted = false;
    }

    ngOnDestroy() {
        this.isCampaignDeleted = false;
        this.refService.campaignSuccessMessage = "";
        swal.close();
        $('#saveAsModal').modal('hide');
        $('#campaignFilterModal').modal('hide');
        $('#cancelEventModal').modal('hide');
        $('#public-event-url-modal').modal('hide');
        $('#public-event-url-modal').modal('hide');
        $('#endDateModal').modal('hide');
                
    }
    openSaveAsModal(campaign: any) {
        $('#saveAsModal').modal('show');
        this.saveAsCampaignId = campaign.campaignId;
        this.saveAsCampaignName = campaign.campaignName + "_copy";
        this.saveAsCampaignInfo = campaign;
    }
    setCampaignData() {
        let campaignData: any;
        if (this.saveAsCampaignInfo.campaignType === 'EVENT') {
            const saveAsCampaignData = new EventCampaign();
            saveAsCampaignData.id = this.saveAsCampaignInfo.campaignId;
            saveAsCampaignData.campaign = this.saveAsCampaignName;
            campaignData = saveAsCampaignData;
            campaignData.campaignType = this.saveAsCampaignInfo.campaignType;
        }
        else {
            const campaign = new Campaign();
            campaign.campaignName = this.saveAsCampaignName;
            campaign.campaignId = this.saveAsCampaignId;
            campaign.scheduleCampaign = "SAVE";
            campaign.campaignType = this.saveAsCampaignInfo.campaignType;
            
            campaignData = campaign;
        }
        return campaignData;
    }
    saveAsCampaign() {
        this.customResponse = new CustomResponse();
        $('#saveAsModal').modal('hide');
        this.refService.loading(this.httpRequestLoader, true);
        const campaignData = this.setCampaignData();
        campaignData.userId = this.authenticationService.getUserId();
        this.campaignService.saveAsCampaign(campaignData)
            .subscribe(data => {
                this.clicked = false;
                if(data.access){
                    this.refService.loading(this.httpRequestLoader, false);
                    let statusCode =  data.statusCode;
                    if(statusCode==404){
                        this.refService.scrollSmoothToTop();
                        this.customResponse = new CustomResponse('ERROR',data.message,true);
                    }else{
                        this.campaignSuccessMessage = "Campaign copied successfully";
                        $('#lanchSuccess').show(600);
                        this.showMessageOnTop();
                        this.listCampaign(this.pagination);
                    }
                }else{
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.clicked = false;
                $('#saveAsModal').modal('hide'); this.logger.errorPage(error)
                this.customResponse = new CustomResponse('ERROR', 'something went wrong in saving copy campaign', true);
            },
            () => console.log("saveAsCampaign Successfully")
            );
    }
    filterCampaigns(type: string, index: number) {
        this.selectedCampaignTypeIndex = index;//This is to highlight the tab
        this.pagination.pageIndex = 1;
        this.pagination.maxResults = 12;
        this.itemsSize = this.numberOfItemsPerPage[0];
        this.pagination.campaignType = type;
        this.listCampaign(this.pagination);
    }
    campaginRouter(campaign: any) {
        this.refService.campaignType = campaign.campaignType;
        this.router.navigate(['/home/campaigns/' + campaign.campaignId + '/details']);
    }
    showCampaignPreview(campaign: any) {
        this.refService.loadingPreview = true;
        if (campaign.campaignType.indexOf('EVENT') > -1) {
            this.campaignType = 'EVENT';
            this.previewCampaign = campaign.campaignId;
        } else {
            this.campaignType = campaign.campaignType.toLocaleString();
            this.previewCampaign = campaign.campaignId;
        }
    }
    goToRedistributedCampaigns(campaign: Campaign) {
        this.isloading = true;
        this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/re-distributed"]);
    }
    goToPreviewPartners(campaign: Campaign) {
        this.isloading = true;
        this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/plc"]);
    }

    goToTemplateDownloadPartners(campaign: Campaign) {
        this.isloading = true;
        this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/tda"]);
    }

    goToTemplateEmailOpenedAnalytics(campaign: Campaign) {
        this.isloading = true;
        this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/teoa"]);
    }

    getCancelEventDetails(campaignId: number, channelCampaign:boolean, nurtureCampaign:boolean, toPartner:boolean) {
        this.selectedCancelEventId = campaignId;
        this.selectedCancelEventChannelCampaign = channelCampaign;
        this.selectedCancelEventNurtureCampaign=nurtureCampaign;
        this.selectedCancelEventToPartnerCampaign=toPartner;
        this.campaignService.getEventCampaignById(campaignId).subscribe(
            (result) => {
                this.eventCampaign = result.data;
                $('#cancelEventModal').modal('show');
            });
    }
    cancelEvent() {
        var cancelEventData = {
            "id": this.selectedCancelEventId,
            "isCancelled": true,
            "message": this.cancelEventMessage,
            "subject": this.cancelEventSubjectLine
        }

        this.isloading = true;
        $('#cancelEventModal').modal('hide');
        this.campaignService.cancelEvent(cancelEventData, this.loggedInUserId, this.selectedCancelEventChannelCampaign,this.selectedCancelEventNurtureCampaign,
        		this.selectedCancelEventToPartnerCampaign)
            .subscribe(data => {
            	if(data.access){
                console.log(data);
                $(window).scrollTop(0);
                this.customResponse = new CustomResponse('SUCCESS', "Event has been cancelled successfully", true);
                console.log("Event Successfully cancelled");
                this.cancelEventMessage = "";
                this.listCampaign(this.pagination);
                this.isloading = false;
            }else{
                this.authenticationService.forceToLogout();
            }
            },
            error => { $('#cancelEventModal').modal('hide'); this.logger.errorPage(error) },
            () => console.log("cancelCampaign completed")
            );
    }

    closeCancelEventodal() {
        $('#cancelEventModal').modal('hide');
        this.cancelEventMessage = "";
    }

    validateCancelEventButton() {
        if (this.cancelEventMessage.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.cancelEventSubjectLine.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
            this.cancelEventButton = true;
        } else {
            this.cancelEventButton = false;
        }
    }
    closePreviewCampaign(event) {
        this.previewCampaign = undefined;
        if (event === 'copy campaign success') {
            this.showMessageOnTop();
            this.pagination.pageIndex = 1;
            this.listCampaign(this.pagination);
        }
        if (event.delete === 'deleted campaign success') {
            this.refService.loading(this.httpRequestLoader, false);
            this.isCampaignDeleted = true;
            const deleteMessage = event.campaignName + ' campaign deleted successfully';
            this.customResponse = new CustomResponse('SUCCESS', deleteMessage, true);
            this.pagination.pageIndex = 1;
            this.listCampaign(this.pagination);
        }
        if (event.delete === 'something went wrong in delete') {
            this.refService.loading(this.httpRequestLoader, false);
            const deleteMessage = 'something went wrong  when ' + event.campaignName + ' deleting. please try again';
            this.customResponse = new CustomResponse('ERROR', deleteMessage, true);
        }
        if (event === 'something went wrong') {
            this.customResponse = new CustomResponse('ERROR', 'something went wrong, please try again', true);
        }
        if(event['updated']){
            this.resetValues('updated');
        }
    }
    
    goToFormAnalytics(id:number){
        this.router.navigate(['/home/forms/cf/'+id]);
    }
    
    openEventUrlModal(campaign:Campaign){
        this.modalPopupLoader = true;
        this.publicEventAliasUrl = "";
        this.publicEventAlias = "";
        this.copiedLinkCustomResponse = new CustomResponse();
        $('#public-event-url-modal').modal('show');
        this.campaignService.getPublicEventCampaignAlias(campaign.campaignId).
        subscribe(
            data =>{
                this.publicEventAlias = data;
                if (this.authenticationService.vanityURLEnabled && this.authenticationService.vanityURLink) {           
                    this.publicEventAliasUrl = this.authenticationService.vanityURLink + "rsvp/" + this.publicEventAlias +"?type=YES&utm_source=public";
                  }else{              
                    this.publicEventAliasUrl = this.authenticationService.APP_URL + "rsvp/" + this.publicEventAlias +"?type=YES&utm_source=public";
                  }
                  this.modalPopupLoader = false;
            },_error =>{
                this.modalPopupLoader = false;
                this.copiedLinkCustomResponse = new CustomResponse('ERROR','Please try after sometime',true);
            });
        }
    copyUrl(inputElement){
        this.copiedLinkCustomResponse = new CustomResponse();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.copiedLinkCustomResponse = new CustomResponse('SUCCESS','Copied to clipboard successfully.',true );  
    }
    inviteMore(campaign:Campaign){
        this.adddMoreReceiversComponent.showPopup(campaign);
    }
    sendEventEmail(campaign:Campaign){
        this.publicEventEmailPopupComponent.showPopup(campaign);
    }
    
    listNotifications() {
        try{
          this.userService.listNotifications(this.authenticationService.getUserId())
              .subscribe(
              data => {
                  console.log("list Notifications in manage publish page "+data);
                  this.getUnreadNotificationsCount();
              },
              error => console.log(error),
              () => console.log('Finished')
              );
          }catch(error) {console.error('error'+error); }
      }
    getUnreadNotificationsCount() {
    	   try{
    	    this.userService.getUnreadNotificationsCount(this.authenticationService.getUserId())
    	      .subscribe(
    	      data => {
    	        this.userService.unreadNotificationsCount = data;
    	      },
    	      error => this.logger.log(error),
    	      () => this.logger.log('Finished')
    	      );
    	    }catch(error) {this.logger.error('error'+error); }
          }
        
          
          goToCalendarView(){
              this.navigatingToRelatedComponent = true;
              if(this.teamMemberId>0){
                if(this.categoryId!=undefined && this.categoryId>0){
                    this.router.navigate(['/home/campaigns/calendar/' + this.teamMemberId+"/"+this.categoryId]);
                }else{
                    this.router.navigate(['/home/campaigns/calendar/' + this.teamMemberId]);
                }
                
              }else{
                  if(this.categoryId!=undefined && this.categoryId>0){
                    this.router.navigate(['/home/campaigns/calendar/f/'+this.categoryId]);
                  }else{
                    this.router.navigate(['/home/campaigns/calendar']);
                  }
                
              }
          }     
          
    /************Adding Workflows**************** */
    addWorkFlows(campaign:Campaign){
        this.customResponse = new CustomResponse();
        this.addWorkflows = true;
        this.selectedCampaign = campaign;
        
    }
    setViewType(viewType:string){
        if("List"==viewType){
            this.modulesDisplayType.isListView = true;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.navigateToManageSection(viewType);    
        }else if("Grid"==viewType){
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.navigateToManageSection(viewType);    
        }else if("Folder-Grid"==viewType){
            this.closeFilterOption();
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = true;
            this.modulesDisplayType.isFolderListView = false;
            this.exportObject['type'] = 4;
            this.exportObject['folderType'] = viewType;
            this.exportObject['teamMemberId'] = this.teamMemberId;
            this.exportObject['archived'] = this.archived;
            if(this.categoryId>0){
                this.navigatingToRelatedComponent = true;
                if(this.teamMemberId!=undefined && this.teamMemberId>0){
                    this.router.navigateByUrl('/home/campaigns/manage/tm/'+this.teamMemberId+"/");
                }else{
                    this.router.navigateByUrl('/home/campaigns/manage/');
                }
                
            }
        }else if("Folder-List"==viewType){
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = true;
			this.exportObject['folderType'] = viewType;
            this.exportObject['type'] = 4;
			this.exportObject['teamMemberId'] = this.teamMemberId;
            this.exportObject['archived'] = this.archived;
            this.closeFilterOption();
        }
    }

    navigateToManageSection(viewType:string){
        if("List"==viewType && (this.categoryId==undefined || this.categoryId==0)){
            this.modulesDisplayType.isListView = true;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.listCampaign(this.pagination);
        }else if("Grid"==viewType && (this.categoryId==undefined || this.categoryId==0)){
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.modulesDisplayType.isListView = false;
            this.listCampaign(this.pagination);
        }else if(this.modulesDisplayType.defaultDisplayType=="FOLDER_GRID" || this.modulesDisplayType.defaultDisplayType=="FOLDER_LIST"
                 &&  (this.categoryId==undefined || this.categoryId==0)){
           this.modulesDisplayType.isFolderGridView = false;
           this.modulesDisplayType.isFolderListView = false;
           if("List"==viewType){
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isListView = true;
           }else{
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isListView = false;
           }
           this.listCampaign(this.pagination);
        }else  if(this.router.url.endsWith('/')){
            if(this.teamMemberId!=undefined){
                this.router.navigateByUrl('/home/campaigns/manage/tm/'+this.teamMemberId);
            }else{
                this.router.navigateByUrl('/home/campaigns/manage');
            }
            
        }
    }


    getUpdatedValue(event:any){
        //this.archived = event.archived;
        let viewType = event.viewType;        
        if(viewType!=undefined){
            this.setViewType(viewType);
        }
        
    }
    
    downloadCampaignHighLevelAnalytics() {
    	let param = null;
        let campaignType = this.pagination.campaignType;
        let teamMemberId : number = 0;
        let teamMemberAnalytics = null;
        let categoryId : number = 0;
        let categoryType = '';
        let searchKey = this.pagination.searchKey;
    	
    	if(this.teamMemberId!=undefined){
    		teamMemberId = this.teamMemberId;
    		teamMemberAnalytics = true;
        }else{
        	teamMemberAnalytics = false;
        }
    	
    	if(this.categoryId!=undefined){
            categoryId = this.categoryId;
            categoryType = 'c';
        }
    	 
         if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
             param = {
                 'userId': this.loggedInUserId,
                 'vendorCompanyProfileName': this.authenticationService.companyProfileName,
                 'vanityUrlFilter': true,
                 'campaignType' : campaignType,
                 'teamMemberId' : teamMemberId,
                 'teamMemberAnalytics' : teamMemberAnalytics,
                 'categoryId' :categoryId,
                 'categoryType' : categoryType,
                 'searchKey' : searchKey,
                 'fromDate' : this.pagination.fromDateFilterString,
                 'toDate' : this.pagination.toDateFilterString,
                 'archived': this.pagination.archived,
                 'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
             };
         } else {
             param = {
                 'userId': this.loggedInUserId,
                 'vanityUrlFilter': false,
                 'vendorCompanyProfileName':null,
                 'campaignType' : campaignType,
                 'teamMemberId' :  teamMemberId,
                 'teamMemberAnalytics' : teamMemberAnalytics,
                 'categoryId' :categoryId,
                 'categoryType' : categoryType,
                 'searchKey' : searchKey,
                 'fromDate' : this.pagination.fromDateFilterString,
                 'toDate' : this.pagination.toDateFilterString,
                 'archived': this.pagination.archived,
                 'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
             };
         }
         let completeUrl = this.authenticationService.REST_URL + "campaign/download-campaign-highlevel-analytics?access_token=" + this.authenticationService.access_token;
         this.refService.post(param, completeUrl);
    }
    
    refreshPage() {
    	   try {
    		   this.isScheduledCampaignLaunched = false;
            this.getCampaignTypes();
        } catch (error) {
            this.logger.error("error in manage-publish-component init() ", error);
        }
    }

    toggleFilterOption() {
        this.showFilterOption = !this.showFilterOption;    
        this.fromDateFilter = "";
        this.toDateFilter = "";
        if (!this.showFilterOption) {
          this.pagination.fromDateFilterString = "";
          this.pagination.toDateFilterString = "";
          this.filterResponse.isVisible = false;
          if (this.filterMode) {
            this.pagination.pageIndex = 1;
            this.listCampaign(this.pagination);
            this.filterMode = false;
          }      
        } else {
          this.filterMode = false;
        }
    }
    
      closeFilterOption() {
        this.showFilterOption = false;
        this.fromDateFilter = "";
        this.toDateFilter = ""; 
        this.pagination.fromDateFilterString = "";
        this.pagination.toDateFilterString = "";
        this.filterResponse.isVisible = false;
        if (this.filterMode) {
          this.pagination.pageIndex = 1;
          this.listCampaign(this.pagination);
          this.filterMode = false;
        }    
      }
    
    validateDateFilters() {
        if (this.fromDateFilter != undefined && this.fromDateFilter != "") {
            var fromDate = Date.parse(this.fromDateFilter);
            if (this.toDateFilter != undefined && this.toDateFilter != "") {
                var toDate = Date.parse(this.toDateFilter);
                if (fromDate <= toDate) {
                    this.pagination.pageIndex = 1;
                    this.pagination.fromDateFilterString = this.fromDateFilter;
                    this.pagination.toDateFilterString = this.toDateFilter;
                    this.filterMode = true;
                    this.filterResponse.isVisible = false;
                    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    this.listCampaign(this.pagination);
                } else {
                    this.filterResponse = new CustomResponse('ERROR', "From date should be less than To date", true);
                }
            } else {
                this.filterResponse = new CustomResponse('ERROR', "Please pick To Date", true);
            }
        } else {
            this.filterResponse = new CustomResponse('ERROR', "Please pick From Date", true);
        }
    }

    showArchivedCampaigns() {
        this.archived = true;
        this.campaignService.archived = true;
        this.resetPagination();        
        this.listCampaign(this.pagination);
    }

    showActiveCampaigns() {
        this.archived = false;
        this.campaignService.archived = false;  
        this.resetPagination();      
        this.listCampaign(this.pagination);
    }

    resetPagination() {
        this.pagination.pageIndex = 1;
        this.searchKey = this.pagination.searchKey = "";
        this.pagination.sortcolumn = this.pagination.sortingOrder = null;
        if (this.archived) {
            this.selectedSortedOption = this.sortByDropDownArchived[0];
        } else {
            this.selectedSortedOption = this.sortByDropDown[0];
        }
        
        this.pagination.maxResults = 12;
        this.itemsSize = this.numberOfItemsPerPage[0];
        this.pagination.campaignType = 'NONE';
        this.selectedCampaignTypeIndex = 0;
        this.modulesDisplayType.isListView = true;
        this.modulesDisplayType.isGridView = false;
        this.modulesDisplayType.isFolderGridView = false;
        this.modulesDisplayType.isFolderListView = false;

        this.showFilterOption = false;
        this.fromDateFilter = "";
        this.toDateFilter = ""; 
        this.pagination.fromDateFilterString = "";
        this.pagination.toDateFilterString = "";
        this.filterResponse.isVisible = false;
        this.filterMode = false;
        this.customResponse = new CustomResponse();

        if (this.categoryId != undefined && this.categoryId > 0) {
            this.showUpArrowButton = this.categoryId!=undefined && this.categoryId!=0;
            this.navigatingToRelatedComponent = true;
            if(this.teamMemberId!=undefined && this.teamMemberId>0){
                this.router.navigateByUrl('/home/campaigns/manage/tm/'+this.teamMemberId+"/");
            }else{
                this.router.navigateByUrl('/home/campaigns/manage');
            }
        }
    }

    archiveCampaign(campaign: any) {
        var request = { loggedInUserId: this.loggedInUserId, id: campaign.campaignId };
        this.campaignService.archiveCampaign(request)
            .subscribe(
                response => {
                    this.isloading = false;
                    if (response.statusCode == 200) {
                        this.listCampaign(this.pagination);
                        this.refService.loading(this.httpRequestLoader, false);
                        this.customResponse = new CustomResponse('SUCCESS', "Campaign Archived Successfully", true);
                    }
                },
                error => {
                    this.isloading = false;
                    this.logger.errorPage(error);
                },
                () => this.logger.info("Finished archiveCampaign()", campaign)
            );
    }

    unarchiveCampaign(campaign: any) {
        var request = { loggedInUserId: this.loggedInUserId, id: campaign.campaignId };
        this.campaignService.unarchiveCampaign(request)
            .subscribe(
                response => {
                    this.isloading = false;
                    if (response.statusCode == 200) {
                        this.listCampaign(this.pagination);
                        this.refService.loading(this.httpRequestLoader, false);
                        this.customResponse = new CustomResponse('SUCCESS', "Campaign Unarchived Successfully", true);
                    }
                },
                error => {
                    this.isloading = false;
                    this.logger.errorPage(error);
                },
                () => this.logger.info("Finished archiveCampaign()", campaign)
            );
    }

    navigatedToCategoryItems() {
        this.navigatingToRelatedComponent = true;
    }

    showEndDateModal(campaign: any) {
        this.showEditEndDateForm = true;
        $('#endDateModal').modal('show');
        this.selectedCampaign = campaign;

        if (campaign.endDate != undefined && campaign.endDate != null) {
            this.selectedEndDate = utc(campaign.endDate).local().format("YYYY-MM-DD HH:mm");
            let selectedDate = new Date(this.selectedEndDate);            
            if (Array.isArray(this.endDatePickr)) {
                $.each(this.endDatePickr, function (_index:number, endDatePickrObj) {
                    endDatePickrObj.setDate(selectedDate);                        
                });
            } else {
                this.endDatePickr.setDate(selectedDate);
            }
        } else {
            this.clearEndDate();
        }

        if (Array.isArray(this.endDatePickr)) {
            $.each(this.endDatePickr, function (_index:number, endDatePickrObj) {
                endDatePickrObj.set("minDate", new Date());                        
            });
        } else {
            this.endDatePickr.set("minDate", new Date());
        }
        
    }

    closeEndDateModal() {       
        this.showEditEndDateForm = false;
        this.selectedCampaign = undefined;        
        this.endDateCustomResponse.isVisible = false;

        //this.selectedEndDate = undefined;
        //this.endDatePickr.clear();
        this.clearEndDate();

        $('#endDateModal').modal('hide');
    }

    updateEndDate() {
        this.refService.loading(this.endDateRequestLoader, true);
        let obj = {
            'campaignId': this.selectedCampaign.campaignId, 'endDate': this.selectedEndDate,
            'userId': this.loggedInUserId, 'clientTimeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.campaignService.updateEndDate(obj)
            .subscribe(
            data => {
                if(data.statusCode == 200){
                    this.closeEndDateModal();
                    this.customResponse = new CustomResponse('SUCCESS','End Date updated successfully',true);
                    this.listCampaign(this.pagination);               
                } else {
                    this.endDateCustomResponse = new CustomResponse('ERROR', data.message, true);
                }
                this.refService.loading(this.endDateRequestLoader, false);
            },
            error => { 
                this.refService.loading(this.endDateRequestLoader, false);
                this.endDateCustomResponse = new CustomResponse('ERROR','Failed to update end date',true);
             },
            () => console.log("End date updated Successfully")
            );
    }

    clearEndDate() {        
        if (Array.isArray(this.endDatePickr)) {
            $.each(this.endDatePickr, function (_index:number, endDatePickrObj) {
                endDatePickrObj.clear();                        
            });
        } else {
            this.endDatePickr.clear();
        }       
        this.selectedEndDate = undefined;
    }

    /*****XNFR-118********/
    resetValues(event:any){
    if("updated"==event){
      this.listCampaign(this.pagination);
    }
    this.selectedCampaignId = 0;
    this.editButtonClicked = false;
    }
   

}