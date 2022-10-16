import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
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
import { VideoUtilService } from 'app/videos/services/video-util.service';
import { ActionsDescription } from 'app/common/models/actions-description';
import { Roles } from 'app/core/models/roles';
declare var $:any, swal: any;
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
	@Output() newItemEvent  = new EventEmitter<any>();
	/********XNFR-169******/
	roles:Roles = new Roles();
	categoryId = 0;
	showUpArrowButton = false;
	folderViewType = "";
	@Input() folderListViewCategoryId:any;
	folderListView = false;
	constructor(public deviceService: Ng2DeviceService, private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, public listLoader: HttpRequestLoader, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties,
			public videoFileService: VideoFileService, public userService: UserService, public videoUtilService:VideoUtilService, public actionsDescription:ActionsDescription) {
		this.loggedInUserId = this.authenticationService.getUserId();
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.vanityLoginDto.userId = this.loggedInUserId;
			this.vanityLoginDto.vanityUrlFilter = true;
		}
	}

	ngOnInit() {
		this.callInitMethods();
		this.videoFileService.campaignReport = false;
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
					this.referenceService.goToManageAssets(this.viewType,this.isPartnerView);
				}else if(this.modulesDisplayType.isFolderGridView){
					this.viewType = "fg";
					this.referenceService.goToManageAssets(this.viewType,this.isPartnerView);
				}
			}
		}
		if (this.referenceService.isCreated) {
			this.customResponse = new CustomResponse('SUCCESS', 'Template Added Successfully', true);
		} else if (this.referenceService.isUpdated) {
			this.customResponse = new CustomResponse('SUCCESS', 'Template Updated Successfully', true);
		} else if (this.referenceService.isUploaded) {
			this.customResponse = new CustomResponse('SUCCESS', 'Uploaded Successfully', true);
		} else if (this.referenceService.isAssetDetailsUpldated) {
			this.customResponse = new CustomResponse('SUCCESS', 'Details Updated Successfully', true);
		}
		this.getCompanyId();		
	}

	ngOnDestroy() {
		this.referenceService.isCreated = false;
		this.referenceService.isUpdated = false;
		this.referenceService.isUploaded = false;
		this.referenceService.isAssetDetailsUpldated = false;
	}

	/********XNFR-169******/
	setViewType(viewType: string) {
		if(this.viewType!=viewType){
			if (this.folderListView) {
				let gridView = "g" == viewType;
				this.modulesDisplayType.isGridView = gridView;
				this.modulesDisplayType.isListView = !gridView;
			} else {
				if (this.folderViewType != undefined && viewType != "fg") {
					this.referenceService.goToManageAssetsByCategoryId("fg", viewType, this.categoryId,this.isPartnerView);
				} else {
					this.referenceService.goToManageAssets(viewType,this.isPartnerView);
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
						if (this.isPartnerView) {
							if (this.vanityLoginDto.vanityUrlFilter) {
								this.pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
								this.pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
							}
							this.pagination.userId = this.loggedInUserId;
							this.listPublishedAssets(this.pagination);
						} else {
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
		if(!this.folderListView){
			this.referenceService.goToTop();
		}
		this.startLoaders();
		pagination.categoryId = this.categoryId;
		this.damService.list(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				this.assets = data.assets;
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
					if(asset.videoFileDTO && toolTipTagNames!=null && toolTipTagNames.length>0){
					asset.videoFileDTO.toolTipTagNames = toolTipTagNames;
					}
					if(asset.videoFileDTO && asset.tagNames!=null && asset.tagNames.length>0){
						asset.videoFileDTO.tagNames  = asset.tagNames.slice();
					}
				});
				pagination = this.pagerService.getPagedItems(pagination, data.assets);
			}
			this.stopLoaders();
		}, error => {
			this.stopLoadersAndShowError(error);
		});
	}

	listPublishedAssets(pagination: Pagination) {
		if(!this.folderListView){
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
				$.each(data.assets, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.createdDateInUTCString);
				});
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
			this.referenceService.goToRouter("/home/dam/editp/" + id);
		} else {
			this.referenceService.goToRouter("/home/dam/edit/" + id);
		}

	}


	viewGirdHistory(asset: any) {
		this.isGridViewHistory = true;
		this.selectedAssetId = asset.id;
		this.selectedAssetName = asset.assetName;
		this.historyPagination.campaignId = asset.id;
		this.listAssetsHistory(this.historyPagination);
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
                this.referenceService.goToRouter("/home/dam/pda/" + asset.id);
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
            if (this.isPartnerView) {
                this.referenceService.goToRouter("/home/dam/pda/" + asset.id);
            } else {
				this.navigateToPartnerAnalytics(asset.id);
            }
        }
    }

	private navigateToPartnerAnalytics(id: number) {
		if (this.categoryId > 0) {
			if (this.folderListView) {
				this.referenceService.goToRouter("/home/dam/partnerAnalytics/" + id + "/fl");
			} else {
				this.referenceService.goToRouter("/home/dam/partnerAnalytics/" + id + "/" + this.viewType + "/" + this.categoryId + "/" + this.folderViewType);
			}
		} else {
			this.referenceService.goToRouter("/home/dam/partnerAnalytics/" + id + "/" + this.viewType);
		}
	}

    editDetails(id: number, assetType: string, alias:string, beeTemplate : boolean) {
        if (!beeTemplate && this.isVideo(assetType)) {
            this.showEditVideo(alias, id);
        } else {
            this.loading = true;
            this.referenceService.goToRouter("/home/dam/editDetails/" + id);
        }
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
		}else if(campaign){
			this.campaignRouter(this.asset.alias, this.asset.viewBy);
		}else if(edit){
            this.editDetails(this.asset.id, this.asset.assetType, this.asset.alias, this.asset.beeTemplate);
        }else if(analytics){
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
            this.showPlayVideo(asset.id, asset.videoFileDTO);
        } else {
            this.isPreview = true;
            this.asset = asset;
        }
	}
    
    showPlayVideo(id: number, videoFile: SaveVideoFile) {
        try {
            this.videoFileService.getVideo(videoFile.alias, 'DRAFT')
                .subscribe((editVideoFile: SaveVideoFile) => {
                    if (editVideoFile.access) {
                        if (editVideoFile.imageFiles == null || editVideoFile.gifFiles == null) {
                            editVideoFile.gifFiles = []; editVideoFile.imageFiles = [];
                        }
                        editVideoFile.damId = id;
                        this.videoFileService.saveVideoFile = editVideoFile;
                        this.referenceService.selectedVideoLogo = editVideoFile.brandingLogoUri;
                        this.referenceService.selectedVideoLogodesc = editVideoFile.brandingLogoDescUri;
                        this.xtremandLogger.log(this.videoFileService.saveVideoFile);
                        this.videoFileService.actionValue = 'Update';
                        this.newItemEvent.emit(null);
                    } else {
                        this.authenticationService.forceToLogout();
                    }
                },
                (error: any) => {
                    this.xtremandLogger.error('Error In: showPlayVideo():' + error);
                    this.xtremandLogger.errorPage(error);
                }
                );
        } catch (error) {
            this.xtremandLogger.error('error' + error);
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

	deleteAssetSuccessEmitter(response:any) {
		if(response.statusCode==200){
		this.customResponse = new CustomResponse('SUCCESS', this.asset.assetName + " Deleted Successfully", true);
		this.deleteAsset = false;
		this.referenceService.loading(this.listLoader, false);
		this.asset = {};
		this.pagination.pageIndex = 1;
		this.listAssets(this.pagination);
		}else if(response.statusCode==401){
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

	viewDetails(asset:any){
		this.referenceService.goToRouter("/home/dam/shared/view/"+asset.id);
	}
	
    showEditVideo(alias:string, id: number) {
        if(this.referenceService.defaultPlayerSettings!=undefined && this.referenceService.defaultPlayerSettings.playerColor===undefined){ this.getDefaultVideoSettings(); }
        try{
        this.videoFileService.getVideo(alias, 'DRAFT')
            .subscribe((editVideoFile: SaveVideoFile) => {
                if(editVideoFile.access){
                this.xtremandLogger.log('enter the show edit vidoe method');
                if (editVideoFile.imageFiles == null || editVideoFile.gifFiles == null) {
                    editVideoFile.gifFiles = []; editVideoFile.imageFiles = [];
                }
                editVideoFile.damId = id;
                this.videoFileService.saveVideoFile = editVideoFile;
                this.referenceService.selectedVideoLogo = editVideoFile.brandingLogoUri;
                this.referenceService.selectedVideoLogodesc = editVideoFile.brandingLogoDescUri;
                this.xtremandLogger.log('show edit vidoe object :');
                this.xtremandLogger.log(this.videoFileService.saveVideoFile);
                this.videoFileService.actionValue = 'Update';
                this.newItemEvent.emit(false);
                }else{
                    this.authenticationService.forceToLogout();
                }
            },
            (error: any) => {
                this.xtremandLogger.error('Error In: show edit videos ():' + error);
                this.xtremandLogger.errorPage(error);
            }
            );
          }catch(error){
            this.xtremandLogger.error('error'+error);
          }
    }
    getDefaultVideoSettings() {
        this.userService.getVideoDefaultSettings().subscribe((data) => { this.referenceService.defaultPlayerSettings = data; });
    }

    showVideosPage(manageVideos: boolean, editVideo: boolean, playVideo: boolean, campaignReport: boolean) {
        this.newItemEvent.emit(false);
    }

    update(videoFile: SaveVideoFile) {

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
    
    campaignRouter(alias:string, viewBy:string) {
        try{
         this.xtremandLogger.log('ManageVideoComponent campaign router:');
         this.videoFileService.getVideo(alias, viewBy)
             .subscribe((videoFile: SaveVideoFile) => {
                 if(videoFile.access){
                 this.referenceService.campaignVideoFile = videoFile;
                 this.referenceService.selectedCampaignType = 'video';
                 this.referenceService.isCampaignFromVideoRouter = true;
                 this.router.navigateByUrl('/home/campaigns/create');
                 }else{
                     this.authenticationService.forceToLogout();
                 }
             },
             (error: string) => {
                 this.xtremandLogger.error('Error In: show campaign videos ():' + error);
                 this.xtremandLogger.errorPage(error);
             });
           }catch(error){ this.xtremandLogger.error('error'+error);}
     }



}
