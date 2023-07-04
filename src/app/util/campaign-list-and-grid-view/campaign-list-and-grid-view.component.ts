import { Component, OnInit, Input, OnDestroy, Output, EventEmitter,AfterViewInit,ViewChild,Renderer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/*****Common Imports**********************/
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from 'app/core/models/sort-option';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { UtilService } from 'app/core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';
import { AssetDetailsViewDto } from 'app/dam/models/asset-details-view-dto';
import { Ng2DeviceService } from 'ng2-device-detector';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { ActionsDescription } from 'app/common/models/actions-description';
import { Roles } from 'app/core/models/roles';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { Campaign } from 'app/campaigns/models/campaign';
import { EventCampaign } from 'app/campaigns/models/event-campaign';
import { AddMoreReceiversComponent } from 'app/campaigns/add-more-receivers/add-more-receivers.component';
import { PublicEventEmailPopupComponent } from 'app/campaigns/public-event-email-popup/public-event-email-popup.component';
import { UserService } from 'app/core/services/user.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';


declare var swal:any, $: any, flatpickr:any;

@Component({
  selector: 'app-campaign-list-and-grid-view',
  templateUrl: './campaign-list-and-grid-view.component.html',
  styleUrls: ['./campaign-list-and-grid-view.component.css'],
  providers: [Pagination, HttpRequestLoader, ActionsDescription, CampaignAccess, CallActionSwitch,Properties]
})
export class CampaignListAndGridViewComponent implements OnInit,AfterViewInit {

  @Input() folderListViewCategoryId:any;
  categoryId = 0;
  folderListView = false;
  viewType: string;
	modulesDisplayType = new ModulesDisplayType();
  folderViewType = "";
	showUpArrowButton = false;
  @Input() folderListViewExpanded = false;

  showEditEndDateForm: boolean;
  endDate: any;
  selectedEndDate: any;
  endDatePickr: any;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  campaignSuccessMessage = "";
  customResponse: CustomResponse = new CustomResponse();
  filterResponse: CustomResponse = new CustomResponse(); 
  isloading: boolean;
  campaignAccess:CampaignAccess = new CampaignAccess();
  pagination:Pagination = new Pagination();
  teamMemberId: number = 0;
  archived: boolean;
  loggedInUserId = 0;
  campaigns: Campaign[];
  templateEmailOpenedAnalyticsAccess = false;
  selectedCampaignTypeIndex = 0;


  isCampaignDeleted = false;
  hasCampaignRole = false;
  hasStatsRole = false;
  isScheduledCampaignLaunched = false;
  hasAllAccess = false;
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
  campaignPartnerLoader: HttpRequestLoader = new HttpRequestLoader();
  endDateRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  isError = false;
  saveAsCampaignId = 0;
  saveAsCampaignName = '';
  isOnlyPartner = false;
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
  previewCampaign: any;
  copiedLinkCustomResponse: CustomResponse = new CustomResponse();
  publicEventAlias:string = "";
  publicEventAliasUrl:string = "";
  @ViewChild('addMoreReceivers') adddMoreReceiversComponent: AddMoreReceiversComponent;
  @ViewChild('publiEventEmailPopup') publicEventEmailPopupComponent: PublicEventEmailPopupComponent;
  addWorkflows = false;
  selectedCampaign:any;
  exportObject:any = {};
  modalPopupLoader = false;
  showFilterOption: boolean = false;
  fromDateFilter: any = "";
  toDateFilter: any = "";
  filterMode: boolean = false;
  navigatingToRelatedComponent: boolean = false;
  endDateCustomResponse: CustomResponse = new CustomResponse();
  clicked = false;
  editButtonClicked = false;
  selectedCampaignId = 0;


  constructor(public userService: UserService, public callActionSwitch: CallActionSwitch, private campaignService: CampaignService, 
    private router: Router, private logger: XtremandLogger,
    private pagerService: PagerService, public utilService: UtilService, public actionsDescription: ActionsDescription,
    public referenceService: ReferenceService,public authenticationService: AuthenticationService,
    private route: ActivatedRoute,public renderer:Renderer,public properties:Properties) {
      this.referenceService.renderer = this.renderer;    
      this.loggedInUserId = this.authenticationService.getUserId();
     }
  
  
    ngAfterViewInit(): void {
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
    this.callInitMethods();

  }

  callInitMethods(){
    if(this.folderListViewCategoryId!=undefined){
			this.categoryId = this.folderListViewCategoryId;
			this.folderListView = true;
		}else{
			this.viewType = this.route.snapshot.params['viewType'];
			this.categoryId = this.route.snapshot.params['categoryId'];
			this.folderViewType = this.route.snapshot.params['folderViewType'];
			this.showUpArrowButton = this.categoryId!=undefined && this.categoryId!=0;
		}
		if (this.viewType != undefined) {
			this.modulesDisplayType = this.referenceService.setDisplayType(this.modulesDisplayType, this.viewType);
		} else {
			if(this.categoryId==undefined || this.categoryId==0){
				this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
				this.viewType = this.modulesDisplayType.isListView ? 'l' : this.modulesDisplayType.isGridView ?'g':'';
        if(this.modulesDisplayType.isFolderListView){
					this.viewType = "fl";
					this.referenceService.goToManageCampaigns(this.viewType);
				}else if(this.modulesDisplayType.isFolderGridView){
					this.viewType = "fg";
					this.referenceService.goToManageCampaigns(this.viewType);
				}
			}
		}
    if (this.referenceService.campaignSuccessMessage == "SCHEDULE") {
      this.showMessageOnTop();
      this.campaignSuccessMessage = "Campaign scheduled successfully";
      this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
  } else if (this.referenceService.campaignSuccessMessage == "SAVE") {
      this.showMessageOnTop();
      this.campaignSuccessMessage = "Campaign saved successfully";
      this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
  } else if (this.referenceService.campaignSuccessMessage == "NOW") {
      this.showMessageOnTop();
      this.campaignSuccessMessage = this.properties.campaignLaunchedMessage;
      this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
  } else if (this.referenceService.campaignSuccessMessage == "UPDATE") {
      this.showMessageOnTop();
      this.campaignSuccessMessage = "Campaign updated successfully";
      this.customResponse = new CustomResponse('SUCCESS', this.campaignSuccessMessage, true);
  }
		if(this.viewType!="fl" && this.viewType!="fg"){
			this.getCampaignTypes();		
		}
  }


  getCampaignTypes() {
     this.isloading = true;
     this.startLoaders();
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
    },error=>{
              this.stopLoaders();
              this.logger.errorPage(error);
    },()=>{
      this.findCampaigns(this.pagination);
    }
     )
  }


  findCampaigns(pagination: Pagination) {
    if(!this.folderListView){
			this.referenceService.goToTop();
		}
    this.startLoaders();
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
                    $.each(this.campaigns, function (_index:number, campaign:any) {
                        campaign.displayTime = new Date(campaign.utcTimeInString);
                        campaign.createdDate = new Date(campaign.createdDate);                        
                    });
                    pagination.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    this.stopLoaders();
                }else{
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.stopLoaders();
                this.logger.errorPage(error);
            });

  }

  showMessageOnTop() {
    $(window).scrollTop(0);
    this.customResponse = new CustomResponse('SUCCESS', 'Copy campaign saved successfully', true);
  }

  startLoaders() {
		this.referenceService.loading(this.httpRequestLoader, true);
	}

  stopLoaders(){
    this.referenceService.loading(this.httpRequestLoader, false);
    this.isloading = false;

  }

}
