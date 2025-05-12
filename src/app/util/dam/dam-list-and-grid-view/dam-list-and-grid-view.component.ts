import { Component, OnInit, Input, OnDestroy, Output, EventEmitter,Renderer, ViewChild } from '@angular/core';
import { DamService } from 'app/dam/services/dam.service';
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
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { UserService } from 'app/core/services/user.service';
import { ActionsDescription } from 'app/common/models/actions-description';
import { Roles } from 'app/core/models/roles';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';
import { Criteria } from 'app/contacts/models/criteria';
import { WhiteLabeledContentSharedByVendorCompaniesDto } from 'app/dam/models/white-labeled-content-shared-by-vendor-companies-dto';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { FontAwesomeClassName } from 'app/common/models/font-awesome-class-name';
import { CustomUiFilterComponent } from '../../custom-ui-filter/custom-ui-filter.component';
import { ContentModuleStatusAnalyticsComponent } from 'app/util/content-module-status-analytics/content-module-status-analytics.component';
import { DamUploadPostDto } from 'app/dam/models/dam-upload-post-dto';

declare var $: any, swal: any, flatpickr;
@Component({
	selector: 'app-dam-list-and-grid-view',
	templateUrl: './dam-list-and-grid-view.component.html',
	styleUrls: ['./dam-list-and-grid-view.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties, ActionsDescription]
})
export class DamListAndGridViewComponent implements OnInit, OnDestroy {
	readonly XAMPLIFY_CONSTANTS = XAMPLIFY_CONSTANTS;
	loading = false;
	loggedInUserId: number = 0;
	pagination: Pagination = new Pagination();
	customResponse: CustomResponse = new CustomResponse();
	loggedInUserCompanyId: any;
	viewType: string;
	modulesDisplayType = new ModulesDisplayType();
	colspanValue = 5;
	historyLoader: HttpRequestLoader = new HttpRequestLoader();
	assets: Array<any> = new Array<any>();
	historyPagination: Pagination = new Pagination();
	isGridViewHistory = false;
	modalPopupLoader = false;
	selectedPdfAlias = "";
	showPublishPopup = false;
	selectedAssetId: number = 0;
	isPartnerView = false;
	downloadOptionsCustomResponse: CustomResponse = new CustomResponse();
	selectedAssetName = "";
	assetDetailsPreview: boolean = false;
	assetViewLoader = false;
	assetDetailsViewDto: AssetDetailsViewDto = new AssetDetailsViewDto();
	selectedAsset: any;
	vanityLoginDto: VanityLoginDto = new VanityLoginDto();
	beeTemplatePreview = false;
	assetPath = "";
	imageLoading = false;
	damViewStatusCode = 200;
	isPreview: boolean;
	asset: any;
	showPdfModalPopup: boolean;
	deleteAsset = false;
	hasVideoRole = false;
	hasCampaignRole = false;
	hasAllAccess = false;
	hasDamAccess = false;
	@Output() newItemEvent = new EventEmitter<any>();
	/********XNFR-169******/
	roles: Roles = new Roles();
	categoryId = 0;
	showUpArrowButton = false;
	folderViewType = "";
	@Input() folderListViewCategoryId: any;
	folderListView = false;
	exportObject = {};
	@Output() updatedItemsCountEmitter = new EventEmitter();
	@Input() folderListViewExpanded = false;
	@Input() searchKeyValue : any;
	SuffixHeading: string = "";
	titleHeader: string = "";
	actionsDivClass = "actions-block override-actions custom-width-icon min-width-thtwpx ActionAlign";
	public fileTypes: Array<any> = new Array<any>();
	selectedFileType = "";
	/****XNFR-255*****/
	showWhiteLabeledPopup: boolean;
	showRefreshNotification = false;
	showRefreshNotificationForHistoryAssets = false;
	/****XNFR-381*****/
	isChangeAsParentPdfIconClicked = false;
	changeAsParentPdfSweetAlertParameterDto: SweetAlertParameterDto = new SweetAlertParameterDto();
	childAssetId = 0;
	isEditVideo = false;
	isPreviewVideo = false;

	/** XNFR-781 **/
	assetName: string = "";
	assetCreatedById: number;
	assetCreatedByFullName: string = "";
	callCommentsComponent: boolean = false;
	selectedDamId: number;
	createdByAnyApprovalManagerOrApprover: boolean = false;
	fontAwesomeClassName:FontAwesomeClassName = new FontAwesomeClassName();
	approvalStatus = {
		APPROVED: 'APPROVED',
		REJECTED: 'REJECTED',
		CREATED: 'CREATED',
		UPDATED: 'UPDATED',
		DRAFT: 'DRAFT'
	};
	videoId: number;
	/** XNFR-813 **/
	@ViewChild(ContentModuleStatusAnalyticsComponent) contentModuleStatusAnalyticsComponent: ContentModuleStatusAnalyticsComponent;



	/****XNFR-381*****/
	criteria: Criteria = new Criteria();
	@ViewChild(CustomUiFilterComponent) customUiFilterComponent: CustomUiFilterComponent;
	
	approvalReferenceId: number;
	previewContent: boolean;
	fileType: any;
	previewAssetPath: any;
	SendAssetToOliver : any;
	isOliverCalled : boolean = false;
	existingCriterias = new Array<Criteria>();
	fromDateFilter: any;
	toDateFilter: any;
	isImageFormat: boolean = false;
	isTextFormat: boolean = false;
	proxyAssetPath: any;
	showOliver: boolean;
	@Input() FromOliverPopUp: boolean = false;
	@Input() selectedItemFromOliver: any;
    selectedItems: any[] = []; 
    @Output() notifyasset = new EventEmitter<any>();
	formData: any = new FormData();
	dupliateNameErrorMessage: string;
	damUploadPostDto: DamUploadPostDto = new DamUploadPostDto();
	@Output() notifyFolders = new EventEmitter();
	@Input() selectedFoldersForOliver: any[] = [];
	isFromOliverFolderView: boolean = false;
	@Input() isPartnerViewFromOliver: boolean = false;
	files: any[] = ['csv','pdf','doc','docx','ppt','pptx','xls','xlsx'];
	constructor(public deviceService: Ng2DeviceService, private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, public listLoader: HttpRequestLoader, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties,
		public videoFileService: VideoFileService, public userService: UserService, public actionsDescription: ActionsDescription, public renderer: Renderer) {
		this.loggedInUserId = this.authenticationService.getUserId();
		this.accessForOliver();
		this.referenceService.renderer = this.renderer;
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.vanityLoginDto.userId = this.loggedInUserId;
			this.vanityLoginDto.vanityUrlFilter = true;
		}
	}

	ngOnInit() {
		if(this.referenceService.isOliverEnabled){
			this.referenceService.isOliverEnabled = false;
			this.AskOliver(this.referenceService.asset)
		}
		this.isEditVideo = this.router.url.indexOf('/editVideo') > -1;
		this.isPreviewVideo = this.router.url.indexOf('/previewVideo') > -1;
		if (!this.isEditVideo && !this.isPreviewVideo) {
			this.callInitMethods();
			this.videoFileService.campaignReport = false;
		}
		if (this.FromOliverPopUp) {
			this.SuffixHeading = 'Select ';
			if (this.selectedItemFromOliver != undefined && this.selectedItemFromOliver != null && this.selectedItemFromOliver.length > 0) {
				this.selectedItems = this.selectedItemFromOliver;
			}
		} else if (!this.FromOliverPopUp) {
			this.SuffixHeading = this.isPartnerView ? 'Shared ' : 'Manage ';
		}
		if (this.selectedFoldersForOliver.length > 0) {
			this.setViewType('fg');
		}
	}

	triggerUniversalSearch() {
		if (this.referenceService.universalSearchKey != null && this.referenceService.universalSearchKey != "" && this.referenceService.universalModuleType == 'Asset') {
			this.searchKeyValue = this.referenceService.universalSearchKey;
			this.sortOption.searchKey = this.referenceService.universalSearchKey;
			this.getAllFilteredResults();
		}
	}

	private accessForOliver() {
		if (this.authenticationService.isProductionDomain()) {
			const allowedUserIds = [813265, 812192, 37596, 39972, 962757, 1207651];
			this.showOliver = allowedUserIds.includes(this.authenticationService.getUserId());
		} else if (this.authenticationService.isLocalHost() || this.authenticationService.isQADomain()) {
			const allowedUserIds = [325063,37596,348038];
			this.showOliver = allowedUserIds.includes(this.authenticationService.getUserId());
		}
	}

	callInitMethods() {
		localStorage.removeItem('campaignReport');
		localStorage.removeItem('saveVideoFile');
		localStorage.removeItem('assetName');
		this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roles.videRole);
		this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
		this.hasAllAccess = this.referenceService.hasAllAccess();
		if (this.FromOliverPopUp) {
			this.isPartnerView = this.isPartnerViewFromOliver;
		} else {
			this.isPartnerView = this.router.url.indexOf('/shared') > -1;
		}
		this.startLoaders();
		if (this.folderListViewCategoryId != undefined) {
			this.categoryId = this.folderListViewCategoryId;
			this.folderListView = true;
		} else {
			this.viewType = this.route.snapshot.params['viewType'];
			this.categoryId = this.route.snapshot.params['categoryId'];
			this.folderViewType = this.route.snapshot.params['folderViewType'];
			this.showUpArrowButton = this.categoryId != undefined && this.categoryId != 0;
		}
		if (this.viewType != undefined) {
			this.modulesDisplayType = this.referenceService.setDisplayType(this.modulesDisplayType, this.viewType);
		} else {
			if (this.categoryId == undefined || this.categoryId == 0) {
				this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
				this.viewType = this.modulesDisplayType.isListView ? 'l' : this.modulesDisplayType.isGridView ? 'g' : '';
				if (this.modulesDisplayType.isFolderListView && !this.FromOliverPopUp) {
					this.viewType = "fl";
					this.referenceService.goToManageAssets(this.viewType, this.isPartnerView);
				} else if (this.modulesDisplayType.isFolderGridView) {
					this.viewType = "fg";
					this.referenceService.goToManageAssets(this.viewType, this.isPartnerView);
				}
			}
		}

		let message = this.referenceService.assetResponseMessage;
		if (message!=undefined && message.length > 0 && !this.folderListViewExpanded ) {
			this.customResponse = new CustomResponse('SUCCESS', message, true);
		}
		this.triggerUniversalSearch(); //XNFR-574
		if (this.viewType != "fl" && this.viewType != "fg" || this.FromOliverPopUp) {
			this.getCompanyId();
		}
		
	}

	ngOnDestroy() {
		this.referenceService.isCreated = false;
		this.referenceService.isUpdated = false;
		this.referenceService.isUploaded = false;
		this.referenceService.isAssetDetailsUpldated = false;
		this.referenceService.assetResponseMessage = "";
		this.referenceService.universalModuleType = "";//XNFR-574
		this.referenceService.isOliverEnabled = false;
		this.clearPreviousSelectedAsset();
	}

	/********XNFR-169******/
	setViewType(viewType: string) {
		if (this.utilService.folderListViewSelected) {
			if (this.isPartnerView) {
				if (viewType == 'g') {
					this.referenceService.goToRouter('home/dam/shared/g');
				} else if (viewType == 'l') {
					this.referenceService.goToRouter('/home/dam/manage/l/');
				}
				else {
					this.referenceService.goToRouter('home/dam/shared/fl');
				}
			}
			else {
				if (viewType == 'g') {
					this.referenceService.goToRouter('/home/dam/manage/g/');
				} else if (viewType == 'l') {
					this.referenceService.goToRouter('/home/dam/manage/l/');
				}
				else {
					this.referenceService.goToRouter('/home/dam/manage/fl/');
				}
			}
		} else {
			if (this.viewType != viewType && !this.FromOliverPopUp) {
				if (this.folderListView) {
					let gridView = "g" == viewType;
					this.modulesDisplayType.isGridView = gridView;
					this.modulesDisplayType.isListView = !gridView;
				} else {
					if (this.folderViewType != undefined && viewType != "fg") {
						this.referenceService.goToManageAssetsByCategoryId("fg", viewType, this.categoryId, this.isPartnerView);
					} else {
						this.referenceService.goToManageAssets(viewType, this.isPartnerView);
					}
					this.titleHeader = ' Assets';
				}
			} else {
				if (viewType == "l") {
					this.modulesDisplayType.isListView = true;
					this.modulesDisplayType.isGridView = false;
					this.modulesDisplayType.isFolderGridView = false;
					this.modulesDisplayType.isFolderListView = false;
				} else if (viewType == "g") {
					this.modulesDisplayType.isGridView = true;
					this.modulesDisplayType.isListView = false;
					this.modulesDisplayType.isFolderGridView = false;
					this.isFromOliverFolderView = false;
					this.modulesDisplayType.isFolderListView = false;
				} else if (viewType == "fg") {
					this.modulesDisplayType.isFolderGridView = true;
					this.modulesDisplayType.isListView = false;
					this.modulesDisplayType.isGridView = false;
					this.isFromOliverFolderView = false;
					this.modulesDisplayType.isFolderListView = false;
				}
			}
		}
	}

	startLoaders() {
		this.referenceService.loading(this.listLoader, true);
	}

	getCompanyId() {
		if (this.loggedInUserId != undefined && this.loggedInUserId > 0) {
			this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
				(result: any) => {
					if (result !== "") {
						this.loggedInUserCompanyId = result;
					} else {
						this.stopLoaders();
						this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
						this.router.navigate(["/home/dashboard"]);
					}
				}, (error: any) => {
					this.stopLoadersAndShowError(error);
				},
				() => {
					if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
						this.pagination.companyId = this.loggedInUserCompanyId;
						this.folderListSearchInFolder();
						if (this.isPartnerView) {
							if (this.vanityLoginDto.vanityUrlFilter) {
								this.pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
								this.pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
							}
							this.findFileTypesForPartnerView();
							/*** XBI-2133 ****/
							this.findSharedAssetsByCompaniesForPartnerView();
							this.pagination.userId = this.loggedInUserId;
								this.listPublishedAssets(this.pagination);
						} else {
							this.findFileTypes();
							/*** XBI-2133 ****/
							this.fetchWhiteLabeledContentSharedByVendorCompanies();
							this.pagination.userId = this.loggedInUserId;
							this.listAssets(this.pagination);
						}
					}
				}
			);
		} else {
			this.stopLoaders();
			this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
			this.router.navigate(["/home/dashboard"]);
		}
	}




	stopLoadersAndShowError(error: any) {
		this.stopLoaders();
		this.xtremandLogger.log(error);
		this.xtremandLogger.errorPage(error);
	}

	stopLoaders() {
		this.loading = false;
		this.modalPopupLoader = false;
		this.referenceService.loading(this.listLoader, false);
	}
	listAssets(pagination: Pagination) {
		if (!this.folderListView) {
			this.referenceService.goToTop();
		}
		this.startLoaders();
		pagination.categoryId = this.categoryId;
		this.damService.list(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				this.assets = data.assets;
				let publishingAssets = [];
				$.each(data.assets, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.createdDateInUTCString);
					let toolTipTagNames: string = "";
					asset.tagNames.sort();
					$.each(asset.tagNames, function (index, tagName) {
						if (index > 1) {
							if (toolTipTagNames.length > 0) {
								toolTipTagNames = toolTipTagNames + ", " + tagName;
							} else {
								toolTipTagNames = tagName;
							}
						}
					});
					asset.toolTipTagNames = toolTipTagNames;
					if (asset.videoFileDTO && toolTipTagNames != null && toolTipTagNames.length > 0) {
						asset.videoFileDTO.toolTipTagNames = toolTipTagNames;
					}
					if (asset.videoFileDTO && asset.tagNames != null && asset.tagNames.length > 0) {
						asset.videoFileDTO.tagNames = asset.tagNames.slice();
					}
					if (asset.publishingOrWhiteLabelingInProgress) {
						publishingAssets.push(asset);
					}
				});
				this.showRefreshNotification = publishingAssets.length > 0;
				pagination = this.pagerService.getPagedItems(pagination, data.assets);
			}
			this.stopLoaders();
		}, error => {
			this.stopLoadersAndShowError(error);
		},()=>{
			this.callFolderListViewEmitter();
		});
	}

	listPublishedAssets(pagination: Pagination) {
		if (!this.folderListView) {
			this.referenceService.goToTop();
		}
		this.startLoaders();
		pagination.categoryId = this.categoryId;
		this.damService.listPublishedAssets(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				$.each(data.list, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.publishedTimeInUTCString);
					let toolTipTagNames: string = "";
					asset.tagNames.sort();
					$.each(asset.tagNames, function (index, tagName) {
						if (index > 1) {
							if (toolTipTagNames.length > 0) {
								toolTipTagNames = toolTipTagNames + ", " + tagName;
							} else {
								toolTipTagNames = tagName;
							}
						}
					});
					asset.toolTipTagNames = toolTipTagNames;
				});
				pagination = this.pagerService.getPagedItems(pagination, data.list);
			}
			this.stopLoaders();
		}, error => {
			this.stopLoadersAndShowError(error);
		},()=>{
			this.callFolderListViewEmitter();
		});
	}


	/********************Pagaination&Search Code*****************/

	/*************************Sort********************** */
	sortAssets(text: any) {
		if (this.isPartnerView) {
			this.sortOption.publishedDamSortOption = text;
		} else {
			this.sortOption.damSortOption = text;
		}
		this.getAllFilteredResults();
	}
	/*************************Search********************** */
	folderListSearchInFolder() {
		this.sortOption.searchKey = this.searchKeyValue;
		if (this.utilService.searchKey) {
			this.sortOption.searchKey = this.utilService.searchKey;
			this.pagination.searchKey = this.sortOption.searchKey;
			this.showUpArrowButton = true;
		}
	}
	searchAssets() {
		this.getAllFilteredResults();
	}
	/************Page************** */
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		if (this.isPartnerView) {
			this.listPublishedAssets(this.pagination);
		} else {
			this.listAssets(this.pagination);
		}
	}
	listItems(event: any) {
		this.pagination = event;
		if (this.isPartnerView) {
			this.listPublishedAssets(this.pagination);
		} else {
			this.listAssets(this.pagination);
		}
	}

	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		if (this.isPartnerView) {
			this.pagination = this.utilService.sortOptionValues(this.sortOption.publishedDamSortOption, this.pagination);
			this.listPublishedAssets(this.pagination);
		} else {
			this.pagination = this.utilService.sortOptionValues(this.sortOption.damSortOption, this.pagination);
			this.listAssets(this.pagination);
		}

	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchAssets(); } }
	/********************Pagaination&Search Code*****************/
	expandHistory(asset: any, selectedIndex: number) {
		$.each(this.assets, function (index: number, row: any) {
			if (selectedIndex != index) {
				row.expand = false;
			}
		});
		asset.expand = !asset.expand;
		if (asset.expand) {
			this.historyPagination.campaignId = asset.id;
			this.listAssetsHistory(this.historyPagination);
		} else {
			this.historyPagination.campaignId = 0;
		}
	}

	listAssetsHistory(pagination: Pagination) {
		pagination.companyId = this.loggedInUserCompanyId;
		pagination.userId = this.loggedInUserId;
		this.referenceService.loading(this.historyLoader, true);
		this.damService.listHistory(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				let publishingAssets = [];
				$.each(data.assets, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.createdDateInUTCString);
					if (asset.publishingOrWhiteLabelingInProgress) {
						publishingAssets.push(asset);
					}
				});
				this.showRefreshNotificationForHistoryAssets = publishingAssets.length > 0;
				pagination = this.pagerService.getPagedItems(pagination, data.assets);
			}
			this.loading = false;
			this.referenceService.loading(this.historyLoader, false);
		}, error => {
			this.stopLoadersAndShowError(error);
		});
	}
	/************Page************** */
	setHistoryPage(event: any) {
		this.historyPagination.pageIndex = event.page;
		this.listAssetsHistory(this.historyPagination);
	}

	addOrEdit(id: number) {
		if (this.isPartnerView) {
			this.referenceService.navigateToRouterByViewTypes("/home/dam/editp/" + id, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
		} else {
			this.referenceService.navigateToRouterByViewTypes("/home/dam/edit/" + id, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
		}
	}

	closeHistory() {
		this.isGridViewHistory = false;
		this.selectedAssetId = 0;
		this.selectedAssetName = "";
		this.historyPagination = new Pagination();
	}

	viewAnalytics(asset: any) {
		this.loading = true;
		/*****XNFR-169***/
		if (this.isPartnerView) {
			this.navigateToDamAnalyticsForPartnerLogin(asset.id);
		} else {
			this.navigateToPartnerAnalytics(asset.id);
		}
	}

	/*****XNFR-169***/
	navigateToPartnerAnalytics(id: number) {
		this.referenceService.navigateToDamPartnerCompaniesAnalytics(id, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
	}

	navigateToDamAnalyticsForPartnerLogin(id: any) {
		let url = "/home/dam/pda/" + this.referenceService.encodePathVariable(id);
		this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
	}


	editDetails(id: number, assetType: string, alias: string, beeTemplate: boolean, videoId: number) {
		this.loading = true;
		setTimeout(() => {
			if (!beeTemplate && this.referenceService.isVideo(assetType)) {
				let url = "/home/dam/editVideo/" + videoId + "/" + id;
				this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
			} else {
				/*****XNFR-169***/
				let url = "/home/dam/editDetails/" + id;
				this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
			}
		}, 300);
		
	}

	refreshList() {
		if (this.isPartnerView) {
			this.listPublishedAssets(this.pagination);
		} else {
			this.listAssets(this.pagination);
		}
		/** XNFR-813 **/
		if (this.contentModuleStatusAnalyticsComponent && this.authenticationService.approvalRequiredForAssets) {
			this.contentModuleStatusAnalyticsComponent.getTileCounts();
		}
	}


	assetGridViewActionsEmitter(event: any) {
		let input = event;
		let preview = input['preview'];
		let showPublishPopup = input['publishPopup'];
		let campaign = input['campaign'];
		let edit = input['edit'];
		let analytics = input['analytics'];
		let askOliverFromGridView= input['askOliver'];
		let askAi = input['askAi'];
		this.asset = input['asset'];
		if (preview) {
			this.preview(this.asset);
		} else if (showPublishPopup) {
			this.selectedAssetId = this.asset.id;
			this.showPublishPopup = true;
		} else if (campaign) {
			this.campaignRouter(this.asset.alias, this.asset.viewBy);
		} else if (edit) {
			this.editDetails(this.asset.id, this.asset.assetType, this.asset.alias, this.asset.beeTemplate, this.asset.videoId);
		} else if (analytics) {
			this.viewAnalytics(this.asset);
		} else if(askOliverFromGridView){
			this.referenceService.OliverViewType = this.viewType;
			this.AskOliver(this.asset);

		}else if(askAi){
			this.AskAi(this.asset);
		}

	}

	/*****Publish To Partners******* */
	openPublishPopup(assetId: number) {
		this.showPublishPopup = true;
		this.selectedAssetId = assetId;
	}

	notificationFromPublishToPartnersComponent() {
		this.showPublishPopup = false;
		this.selectedAssetId = 0;
		this.callInitMethods();
	}
	/*****Preview Asset******* */
	preview(asset: any) {
		if (this.referenceService.isVideo(asset.assetType)) {
			let url = "/home/dam/previewVideo/" + asset.videoId + "/" + asset.id;
			this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
		} 
		else if (asset.beeTemplate && (asset.assetPath == null || asset.assetPath == '' || asset.assetPath.length == 0)) {
			this.referenceService.previewAssetPdfInNewTab(asset.id);
		}
		else {
			const nonImageFormats = ['pdf', 'pptx', 'doc', 'docx', 'ppt', 'xlsx', 'csv', 'txt', 'html'];
			let isNonImageFormat = nonImageFormats.includes(asset.assetType);
			if (asset.contentPreviewType || asset.imageFileType) {
				this.previewContent = true;
				if(asset.assetProxyPath){
					this.proxyAssetPath = asset.assetProxyPath + asset.assetPath;
				} else{
					this.proxyAssetPath = asset.assetPath;
				}
				this.previewAssetPath = asset.assetPath;
				this.isImageFormat = asset.imageFileType;
				this.isTextFormat = asset.textFileType;
				this.fileType = asset.assetType;
			} else {
				this.referenceService.preivewAssetOnNewHost(asset.id);
			}
		}
	}

	previewAssetPopupEmitter() {
		this.isPreview = false;
		this.asset = {};
	}

	/********Download */

	openPopup(asset: any) {
		this.showPdfModalPopup = true;
		this.asset = asset;
	}

	downloadAssetPopupEventEmitter() {
		this.showPdfModalPopup = false;
		this.asset = {};
	}

	assetGridViewActionsPdfEmitter(event: any) {
		this.asset = event;
		this.showPdfModalPopup = true;
	}

	/*************Delete******************/
	confirmDelete(asset: any) {
		this.deleteAsset = true;
		this.asset = asset;
	}

	assetGridViewActionsDeleteActionEmitter(event: any) {
		this.deleteAsset = true;
		this.asset = event;
	}

	deleteAssetSuccessEmitter(response: any) {
		this.customResponse = new CustomResponse();
		if (response.statusCode == 200) {
			this.customResponse = new CustomResponse('SUCCESS', this.asset.assetName + " Deleted Successfully", true);
			this.deleteAsset = false;
			this.referenceService.loading(this.listLoader, false);
			this.asset = {};
			this.pagination.pageIndex = 1;
			if (this.isPartnerView) {
				this.findFileTypesForPartnerView();
			} else {
				this.findFileTypes();
			}
			this.listAssets(this.pagination);
		} else if (response.statusCode == 401) {
			this.customResponse = new CustomResponse('ERROR', response.message, true);
		}
	}

	deleteAssetFailEmitter(message: any) {
		this.customResponse = new CustomResponse('ERROR', message, true);
		this.deleteAsset = false;
		this.referenceService.loading(this.listLoader, false);
		this.asset = {};
	}

	deleteAssetLoaderEmitter() {
		this.referenceService.loading(this.listLoader, true);
	}

	deleteAssetCancelEmitter() {
		this.deleteAsset = false;
		this.asset = {};
	}

	viewDetails(asset: any) {
		/*****XNFR-169***/
		let url = "/home/dam/sharedp/view/" + asset.id;
		this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
	}
	getDefaultVideoSettings() {
		this.userService.getVideoDefaultSettings().subscribe((data) => { this.referenceService.defaultPlayerSettings = data; });
	}

	

	listAssetsByType(videoType: string) {
		this.pagination.pageIndex = 1;
		this.pagination.maxResults = 12;
		this.pagination.type = videoType;
		this.pagination.userId = this.loggedInUserId;
		this.sortOption.searchKey = null;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.listAssets(this.pagination);
	}

	campaignRouter(alias: string, viewBy: string) {
		try {
			this.referenceService.showSweetAlertProcessingLoader("We are taking to you create campaign page.");
			this.videoFileService.getVideo(alias, viewBy)
				.subscribe((videoFile: SaveVideoFile) => {
					if (videoFile.access) {
						this.referenceService.campaignVideoFile = videoFile;
						this.referenceService.selectedCampaignType = 'video';
						this.referenceService.isCampaignFromVideoRouter = true;
						this.router.navigateByUrl('/home/campaigns/create/' + this.referenceService.selectedCampaignType);
						this.referenceService.closeSweetAlertWithDelay();
					} else {
						this.referenceService.closeSweetAlert();
						this.authenticationService.forceToLogout();
					}
				},
					(error: string) => {
						this.referenceService.closeSweetAlert();
						this.xtremandLogger.error('Error In: show campaign videos ():' + error);
						this.xtremandLogger.errorPage(error);
					});
		} catch (error) { this.xtremandLogger.error('error' + error); }
	}


	callFolderListViewEmitter() {
		if (this.folderListView) {
			this.exportObject['categoryId'] = this.categoryId;
			this.exportObject['itemsCount'] = this.pagination.totalRecords;
			this.updatedItemsCountEmitter.emit(this.exportObject);
		}
	}

	findFileTypes() {
		this.loading = true;
		this.damService.findFileTypes(this.loggedInUserCompanyId, this.categoryId).subscribe(
			response => {
				this.fileTypes = response.data;
				this.loading = false;
			}, error => {
				this.fileTypes = [];
				this.loading = false;
			}
		);
	}

	findFileTypesForPartnerView() {
		this.loading = true;
		this.damService.findFileTypesForPartnerView(this.vanityLoginDto, this.categoryId).subscribe(
			response => {
				this.fileTypes = response.data;
				this.loading = false;
			}, error => {
				this.loading = false;
				this.fileTypes = [];
			}
		);
	}

	filterAssetsByFileType(event: any) {
		this.pagination.pageIndex = 1;
		this.pagination.filterBy = event;
		this.listItems(this.pagination);
	}

	/*****XNFR-255******* */
	openWhiteLabeledPopup(assetId: number) {
		this.showWhiteLabeledPopup = true;
		this.selectedAssetId = assetId;
	}

	/****XNFR-381*****/
	changeAsParentPdf(assetId: number) {
		this.childAssetId = assetId;
		this.changeAsParentPdfSweetAlertParameterDto.text = 'Are you sure you want to switch this child template as the parent template?';
		this.changeAsParentPdfSweetAlertParameterDto.confirmButtonText = "Yes,swtich it";
		this.isChangeAsParentPdfIconClicked = true;
	}

	/****XNFR-381*****/
	changeAsParentPdfEmitter(event: boolean) {
		if (event) {
			this.customResponse = new CustomResponse();
			this.loading = true;
			this.referenceService.showSweetAlertProceesor('We are processing your request');
			this.damService.changeAsParentAsset(this.childAssetId).subscribe(
				response => {
					this.resetChangeAsParentPdfValues();
					this.customResponse = new CustomResponse('SUCCESS', 'Template switched successfully', true);
					this.referenceService.closeSweetAlert();
					this.listAssets(this.pagination);
				}, (error: any) => {
					this.resetChangeAsParentPdfValues();
					this.loading = false;
					this.referenceService.closeSweetAlert();
					let errorMessage = this.referenceService.getBadRequestErrorMessage(error);
					this.customResponse = new CustomResponse('ERROR', errorMessage, true);
				});
		} else {
			this.resetChangeAsParentPdfValues();
		}
	}
	/****XNFR-381*****/
	resetChangeAsParentPdfValues() {
		this.childAssetId = 0;
		this.isChangeAsParentPdfIconClicked = false;
	}
	/****** XNFR-409  *******/
	showFilterOption: boolean;
	/** XBI-2133 ***/
	isWhiteLabeledAsset:boolean;
	whiteLableContentSharedByVendorCompanies: WhiteLabeledContentSharedByVendorCompaniesDto[]=[];
	toggleFilterOption() {
		this.showFilterOption = true;
	}
	assetsFilter(event:any){
		let input = event;
	    this.pagination.fromDateFilterString = input['fromDate'];
		this.pagination.toDateFilterString = input['toDate'] ;
		this.pagination.timeZone = input['zone'];
		this.pagination.criterias = input['criterias'];
		this.pagination.dateFilterOpionEnable = input['isDateFilter'];
		this.pagination.filterOptionEnable = input['isCriteriasFilter'] ;
		this.pagination.customFilterOption = true;
		this.pagination.pageIndex = 1;
		this.existingCriterias = input['existingCriterias'];
		this.fromDateFilter = input['fromDateFilter'];
		this.toDateFilter = input['toDateFilter'];
		this.listItems(this.pagination);
	}
	closeFilterEmitter(event:any){
		if(event === 'close') {
			this.showFilterOption = false;
			this.existingCriterias = new Array<Criteria>();
			this.fromDateFilter = '';
			this.toDateFilter = '';
		} else {
			this.showFilterOption = true
		}
		this.criteria = new Criteria();
		this.pagination.fromDateFilterString = "";
		this.pagination.toDateFilterString = "";
		this.pagination.customFilterOption = false;
		this.sortOption.searchKey = '';
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination.criterias = null;
		this.pagination.pageIndex = 1;
		this.listItems(this.pagination);
	}

	/***** XBI-2133 ****/
	fetchWhiteLabeledContentSharedByVendorCompanies() {
		this.loading = true;
		this.damService.fetchWhiteLabeledContentSharedByVendorCompanies(this.loggedInUserCompanyId)
			.subscribe(
				(result) => {
					if (result.statusCode === 200) {
						this.whiteLableContentSharedByVendorCompanies = result.data;
						if (this.whiteLableContentSharedByVendorCompanies.length > 0) {
							this.isWhiteLabeledAsset = true;
						}
					} else {
						console.error('Status Code Error:', result.statusCode);
					}
					this.loading = false;
				},
				(error) => {
					console.error('Fetch Error:', error);
					this.whiteLableContentSharedByVendorCompanies = [];
					this.loading = false;
				}
			);
	}
	findSharedAssetsByCompaniesForPartnerView() {
		this.loading = true;
		this.damService.findSharedAssetsByCompaniesForPartnerView(this.vanityLoginDto)
			.subscribe(
				(result) => {
					if (result.statusCode === 200) {
						this.whiteLableContentSharedByVendorCompanies = result.data;
						if (this.whiteLableContentSharedByVendorCompanies.length > 0) {
							this.isWhiteLabeledAsset = true;
						}
					} else {
						console.error('Status Code Error:', result.statusCode);
					}
					this.loading = false;
				},
				(error) => {
					console.error('Fetch Error:', error);
					this.whiteLableContentSharedByVendorCompanies = [];
					this.loading = false;
				}
			);
	}
	
	filterAssets(tag:string){
		if( this.criteria != undefined && this.criteria.value1 != undefined && this.criteria.value1.length >0){
			
			$.each(this.pagination.criterias, function (index, criteria) {
						if (criteria.property === "tags") {
							criteria.value1 = criteria.value1 +","+ tag;
						}
					});
			
			$.each(this.customUiFilterComponent.criterias, function (index, criteria) {
						if (criteria.property === "Tags") {
					let exists = criteria.value1.toLowerCase().split(',').map(item => item.trim()).includes(tag.toLowerCase().trim());
							if(!exists){
								criteria.value1 = criteria.value1 +","+ tag;
							}
						}
					});
			
			
		    this.listItems(this.pagination);
            this.toggleFilterOption(); 
			this.showRefreshNotification = false;
			
		}else{
			let keyExists = false;
			
			 keyExists = this.customUiFilterComponent !=undefined && this.customUiFilterComponent.criterias!=undefined && this.customUiFilterComponent.criterias.length>0 && 
		                 this.customUiFilterComponent.criterias.some(criteria => criteria.property === 'tags'
			|| criteria.property === 'Tags');
			
			if(keyExists){
						$.each(this.customUiFilterComponent.criterias, function (index, criteria) {
						if (criteria.property === "Tags" || criteria.property === "tags" ) {
					let exists = criteria.value1.toLowerCase().split(',').map(item => item.trim()).includes(tag.toLowerCase().trim());
							if(!exists){
								criteria.value1 = criteria.value1 +","+ tag;
							}
						}
					});
					
			this.customUiFilterComponent.submittFilterData();
					
			}else{
		this.criteria = new Criteria();
		this.criteria.operation = "Contains";
		this.criteria.property = "Tags";
		this.criteria.value1 = tag;
		if(!this.showFilterOption){
		  this.toggleFilterOption(); 
		 }
	}
	
 }
}

	/** XNFR-781 **/
	showCommentsAndHistoryModalPopup(asset: any){
		this.callCommentsComponent = true;
		this.assetName = asset.assetName;
		this.assetCreatedById = asset.createdBy;
		this.assetCreatedByFullName = asset.fullName;
		this.selectedDamId = asset.id;
		this.createdByAnyApprovalManagerOrApprover = asset.createdByAnyApprovalManagerOrApprover;
		this.videoId = asset.videoId;
		this.approvalReferenceId = asset.approvalReferenceId;
	}

	closeCommentsAndHistoryModalPopup() {
		this.callCommentsComponent = false;
	}

	closeCommentsAndHistoryModalPopupAndRefreshList(event: boolean) {
		this.refreshList();
		this.callCommentsComponent = false;
		if (event) {
			this.referenceService.showSweetAlertSuccessMessage(this.properties.RE_APPROVAL_ASSET_HAS_REPLACED_BY_PARENT);
		}
	}

	getApprovalStatusText(status: string): string {
		switch (status) {
			case this.approvalStatus.APPROVED:
				return 'Approved';
			case this.approvalStatus.REJECTED:
				return 'Rejected';
			case this.approvalStatus.CREATED:
				return 'Pending Approval';
			case this.approvalStatus.UPDATED:
				return 'Updated';
			case this.approvalStatus.DRAFT:
				return 'Draft';
			default:
				return status;
		}
	}

	/** XNFR-813 **/
	filterContentByType(event: any) {
		this.customResponse = new CustomResponse();
		this.pagination.searchKey = '';
		this.sortOption.searchKey = '';
		this.pagination.pageIndex = 1;
		if (event == this.approvalStatus.APPROVED) {
			this.pagination.selectedApprovalStatusCategory = this.approvalStatus.APPROVED;
			this.listAssets(this.pagination);
		} else if (event == this.approvalStatus.REJECTED) {
			this.pagination.selectedApprovalStatusCategory = this.approvalStatus.REJECTED;
			this.listAssets(this.pagination);
		} else if (event == this.approvalStatus.CREATED) {
			this.pagination.selectedApprovalStatusCategory = this.approvalStatus.CREATED;
			this.listAssets(this.pagination);
		} else if (event == this.approvalStatus.DRAFT) {
			this.pagination.selectedApprovalStatusCategory = this.approvalStatus.DRAFT;
			this.listAssets(this.pagination);
		} else {
			this.pagination.selectedApprovalStatusCategory = '';
			this.refreshList();
		}
	}
	
	cancelSegmentationRowEmitter(event:any){
		if(event.property === 'Tags') {
			if( this.pagination.criterias !=undefined && this.pagination.criterias != null && this.pagination.criterias.length > 0 ){
		     for(let i = 0; i < this.pagination.criterias.length; i++){
			  if (this.pagination.criterias[i].property === "tags" || this.pagination.criterias[i].property === "Tags") {
                  this.pagination.criterias.splice(i, 1);
				  this.criteria = new Criteria();
                  break;
                 }
		      }
		  }
		}
	}
	AskAi(asset: any){
		let url = "";
		if(this.modulesDisplayType.isGridView){
			 url = "/home/dam/askAi/shared/view/g/" + asset.id;
		}else{
			url = "/home/dam/askAi/shared/view/" + asset.id;
		}
		this.referenceService.goToRouter(url)
	}
	AskOliver(asset: any){
		this.referenceService.isOliverEnabled = true;
		this.SendAssetToOliver = asset;
		this.isOliverCalled = true;
	}

	closePreview() {
		this.previewContent = false;
	}
	closeAskAi(event:any){
		this.isOliverCalled = false;
		this.SendAssetToOliver = "";
		this.referenceService.isOliverEnabled = false;
	}
	
	onCheckboxChange(item: any, event: any) {
		if (event.target.checked) {
			this.selectedItems.push(item);
		} else {
			const index = this.selectedItems.findIndex(selected => selected.id === item.id);
			if (index !== -1) {
				this.selectedItems.splice(index, 1);
			}
		}
		this.notifyasset.emit(this.selectedItems);
	}
      
	isSelected(item: any): boolean {
		if (!item || !this.selectedItems) {
			return false;
		}
		return this.selectedItems.some(selected => selected.id === item.id);
	}


	isAllSelected(): boolean {
		return this.pagination.pagedItems.length > 0 &&
			this.selectedItems.length === this.pagination.pagedItems.length;
	}

	toggleAllSelection(event: any) {
		if (event.target.checked) {
			this.selectedItems = [...this.pagination.pagedItems];
		} else {
			this.selectedItems = [];
		}
	}
    sendSelectedAssetsToOliver() {
        this.notifyasset.emit(this.selectedItems);
        this.selectedItems = [];
    }
	chooseAsset(event: any) {
		let files: Array<File>;
		if (event.target.files != undefined) {
			files = event.target.files;
		} else if (event.dataTransfer.files) {
			files = event.dataTransfer.files;
		}
		if (files.length > 0) {
			let file = files[0];
			let sizeInKb = file.size / 1024;
			let maxFileSizeInKb = 1024 * 800;
			if (sizeInKb == 0) {
				this.referenceService.showSweetAlertSuccessMessage('Invalid File');
			} else if (sizeInKb > maxFileSizeInKb) {
				this.referenceService.showSweetAlertSuccessMessage('Max file size is 800 MB');
			} else if (file['name'].lastIndexOf(".") == -1) {
				this.referenceService.showSweetAlertSuccessMessage("Selected asset does not have the proper extension. Please upload a valid asset.");
			}
			else {
				this.setUploadedFileProperties(file);
			}
		} else {
			this.clearPreviousSelectedAsset();
		}
	}

	clearPreviousSelectedAsset() {
		this.damUploadPostDto = new DamUploadPostDto();
		this.fileType = null;
		this.dupliateNameErrorMessage = "";
		this.formData.delete("damUploadPostDTO");
		this.customResponse = new CustomResponse();
		this.formData.delete("uploadedFile");
		this.referenceService.assetResponseMessage = "";
		this.referenceService.isAssetDetailsUpldated = false;
		this.damService.uploadAssetInProgress = false;
	}

	private setUploadedFileProperties(file: File) {
		this.clearPreviousSelectedAsset();
		this.fileType = file['type'];
		if (this.fileType == "application/pdf") {
			// this.isPdfFileSelected=true;
		}
		this.customResponse = new CustomResponse();
		this.formData.append("uploadedFile", file, file['name']);
		this.customResponse = new CustomResponse('SUCCESS', 'We are Uploading the assets', true);
		this.uploadOrUpdate();
	}

	uploadOrUpdate() {
		this.damService.uploadAssetInProgress = true;
		this.customResponse = new CustomResponse();
		this.setAssetData();
		this.referenceService.goToTop();
		this.referenceService.showSweetAlertProcessingLoader('Upload is in progress...');
		this.damUploadPostDto.loggedInUserId = this.authenticationService.getUserId();
		this.damService.uploadOrUpdate(this.formData, this.damUploadPostDto, true).subscribe(
			(result: any) => {
				swal.close();
				this.referenceService.assetResponseMessage = result.message;
				if (result.statusCode == 200) {
					if (result.message == undefined) {
						this.referenceService.assetResponseMessage = "Uploaded Successfully";
						this.referenceService.isUploaded = true;
					} else {
						this.referenceService.isAssetDetailsUpldated = true;
					}
					if (this.damService.uploadAssetInProgress) {
						this.damService.uploadAssetInProgress = false;
					}
					this.callInitMethods();
				} else if (result.statusCode == 400) {
					this.customResponse = new CustomResponse('ERROR', result.message, true);
				} else if (result.statusCode == 404) {
					this.referenceService.showSweetAlertErrorMessage("Invalid Request");
				} else if (result.statusCode == 401) {
					this.dupliateNameErrorMessage = "Already exists";
					this.formData.delete("damUploadPostDTO");
				}
			}, error => {
				swal.close();
				let statusCode = JSON.parse(error['status']);
				if (statusCode == 409) {
					this.dupliateNameErrorMessage = "Already exists";
				} else if (statusCode == 400) {
					let message = error['error']['message'];
					this.customResponse = new CustomResponse('ERROR', message, true);
				} else {
					this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
				}
				this.formData.delete("damUploadPostDTO");
			});
	}

	private setAssetData() {
		this.damUploadPostDto.loggedInUserId = this.authenticationService.getUserId();
		this.damUploadPostDto.assetType = this.fileType;
		const file = this.formData.get("uploadedFile") as File;
		const randomSuffix = Math.floor(1000 + Math.random() * 9000);
		const lastDotIndex = file.name.lastIndexOf('.');
		const assetName = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
		this.damUploadPostDto.assetName = assetName + randomSuffix;
		this.damUploadPostDto.description = file.name;
		this.damUploadPostDto.draft = true;
		this.damUploadPostDto.cloudContent = false;
		this.damUploadPostDto.slug = $.trim(assetName).toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');

	}

	viewAssets(event: any) {
		this.categoryId = event;
		this.showUpArrowButton = this.categoryId != undefined && this.categoryId != 0;
		this.viewType = "l";
		this.isFromOliverFolderView = true;
		this.setViewType(this.viewType);
		this.getCompanyId();
	}
	setViewTypeForOliver(event: any){
		this.categoryId = 0;
		this.showUpArrowButton = false;
		this.viewType = event;
		this.setViewType(this.viewType);
		this.getCompanyId();
	}

	handleFolders(event) {
		this.notifyFolders.emit(event);
	}
}
