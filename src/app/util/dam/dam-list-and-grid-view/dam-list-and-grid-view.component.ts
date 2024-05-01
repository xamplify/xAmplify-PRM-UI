import { Component, OnInit, Input, OnDestroy, Output, EventEmitter,Renderer } from '@angular/core';
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
declare var $: any, swal: any, flatpickr;
@Component({
	selector: 'app-dam-list-and-grid-view',
	templateUrl: './dam-list-and-grid-view.component.html',
	styleUrls: ['./dam-list-and-grid-view.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties, ActionsDescription]
})
export class DamListAndGridViewComponent implements OnInit, OnDestroy {
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
	/****XNFR-381*****/
	constructor(public deviceService: Ng2DeviceService, private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, public listLoader: HttpRequestLoader, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties,
		public videoFileService: VideoFileService, public userService: UserService, public actionsDescription: ActionsDescription,public renderer:Renderer) {
		this.loggedInUserId = this.authenticationService.getUserId();
		this.referenceService.renderer = this.renderer;
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.vanityLoginDto.userId = this.loggedInUserId;
			this.vanityLoginDto.vanityUrlFilter = true;
		}
	}

	ngOnInit() {
		this.isEditVideo = this.router.url.indexOf('/editVideo') > -1;
		this.isPreviewVideo = this.router.url.indexOf('/previewVideo') > -1;
		if (!this.isEditVideo && !this.isPreviewVideo) {
			this.callInitMethods();
			this.videoFileService.campaignReport = false;
		}
		this.SuffixHeading = this.isPartnerView ? 'Shared ' : 'Manage ';
	}

	callInitMethods() {
		localStorage.removeItem('campaignReport');
		localStorage.removeItem('saveVideoFile');
		localStorage.removeItem('assetName');
		this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roles.videRole);
		this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
		this.hasAllAccess = this.referenceService.hasAllAccess();
		this.isPartnerView = this.router.url.indexOf('/shared') > -1;
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
				if (this.modulesDisplayType.isFolderListView) {
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

		if (this.viewType != "fl" && this.viewType != "fg") {
			this.getCompanyId();
		}
		
	}

	ngOnDestroy() {
		this.referenceService.isCreated = false;
		this.referenceService.isUpdated = false;
		this.referenceService.isUploaded = false;
		this.referenceService.isAssetDetailsUpldated = false;
		this.referenceService.assetResponseMessage = "";
	}

	/********XNFR-169******/
	setViewType(viewType: string) {
		if (this.viewType != viewType) {
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
							this.fetchWhiteLabeledContentSharedByVendorCompanies()
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
		localStorage.setItem('assetName', asset.assetName);
		let isVideo = this.isVideo(asset.assetType);
		if (isVideo) {
			if (this.isPartnerView) {
				this.navigateToDamAnalyticsForPartnerLogin(asset.id);
			} else {
				try {
					this.videoFileService.getVideo(asset.alias, 'DRAFT')
						.subscribe((editVideoFile: SaveVideoFile) => {
							if (editVideoFile.access) {
								if (editVideoFile.imageFiles == null || editVideoFile.gifFiles == null) {
									editVideoFile.gifFiles = []; editVideoFile.imageFiles = [];
								}
								editVideoFile.damId = asset.id;
								this.videoFileService.saveVideoFile = editVideoFile;
								this.referenceService.selectedVideoLogo = editVideoFile.brandingLogoUri;
								this.referenceService.selectedVideoLogodesc = editVideoFile.brandingLogoDescUri;
								this.videoFileService.campaignReport = true;
								localStorage.setItem('campaignReport', 'true');
								localStorage.setItem('saveVideoFile', JSON.stringify(editVideoFile));
								/*****XNFR-169***/
								this.navigateToPartnerAnalytics(asset.id);
							} else {
								this.authenticationService.forceToLogout();
							}
						},
							(error: any) => {
								this.xtremandLogger.error('Error In: show edit videos ():' + error);
								this.xtremandLogger.errorPage(error);
							}
						);
				} catch (error) {
					this.xtremandLogger.error('error' + error);
				}
			}
		} else {
			/*****XNFR-169***/
			if (this.isPartnerView) {
				this.navigateToDamAnalyticsForPartnerLogin(asset.id);
			} else {
				this.navigateToPartnerAnalytics(asset.id);
			}
		}
	}

	/*****XNFR-169***/
	navigateToPartnerAnalytics(id: number) {
		let url = "/home/dam/partnerAnalytics/" + id;
		this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
	}

	navigateToDamAnalyticsForPartnerLogin(id: number) {
		let url = "/home/dam/pda/" + id;
		this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
	}


	editDetails(id: number, assetType: string, alias: string, beeTemplate: boolean, videoId: number) {
		this.loading = true;
		setTimeout(() => {
			if (!beeTemplate && this.isVideo(assetType)) {
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
	}


	assetGridViewActionsEmitter(event: any) {
		let input = event;
		let preview = input['preview'];
		let showPublishPopup = input['publishPopup'];
		let campaign = input['campaign'];
		let edit = input['edit'];
		let analytics = input['analytics'];
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
		if (this.isVideo(asset.assetType)) {
			let url = "/home/dam/previewVideo/" + asset.videoId + "/" + asset.id;
			this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
		} else {
			if(this.authenticationService.isLocalHost()){
				this.referenceService.previewAssetPdfInNewTab(asset.id);
			}else{
				this.isPreview = true;
				this.asset = asset;
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

	isVideo(filename: any) {
		const parts = filename.split('.');
		const ext = parts[parts.length - 1];
		switch (ext.toLowerCase()) {
			case 'm4v':
			case 'mkv':
			case 'avi':
			case 'mpg':
			case 'mp4':
			case 'flv':
			case 'mov':
			case 'wmv':
			case 'divx':
			case 'f4v':
			case 'mpeg':
			case 'vob':
			case 'xvid':
				// etc
				return true;
		}
		return false;
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
		this.listItems(this.pagination);
	}
	closeFilterEmitter(event:any){
		if(event === 'close') {
			this.showFilterOption = false;
		} else {
			this.showFilterOption = true
		}
		this.pagination.fromDateFilterString = "";
		this.pagination.toDateFilterString = "";
		this.pagination.customFilterOption = false;
		this.sortOption.searchKey = '';
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination.criterias = new Array<Criteria>();
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


}
