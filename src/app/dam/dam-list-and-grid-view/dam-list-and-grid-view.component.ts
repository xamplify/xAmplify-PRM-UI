import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DamService } from '../services/dam.service';
import { ActivatedRoute } from '@angular/router';

/*****Common Imports**********************/
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';
import { AssetDetailsViewDto } from '../models/asset-details-view-dto';
import { Ng2DeviceService } from 'ng2-device-detector';
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { VideoFileService } from '../../videos/services/video-file.service';
import { UserService } from '../../core/services/user.service';

declare var $, swal: any;
@Component({
	selector: 'app-dam-list-and-grid-view',
	templateUrl: './dam-list-and-grid-view.component.html',
	styleUrls: ['./dam-list-and-grid-view.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties]
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
	@Output() newItemEvent  = new EventEmitter<any>();
	
	constructor(public deviceService: Ng2DeviceService, private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, public listLoader: HttpRequestLoader, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties,
			public videoFileService: VideoFileService, public userService: UserService) {
		this.loggedInUserId = this.authenticationService.getUserId();
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.vanityLoginDto.userId = this.loggedInUserId;
			this.vanityLoginDto.vanityUrlFilter = true;
		}
		this.videoFileService.videoType ='myVideos'
	}

	ngOnInit() {
		this.callInitMethods();
		this.videoFileService.campaignReport = false;
	}

	callInitMethods() {
		this.isPartnerView = this.router.url.indexOf('/shared') > -1;
		this.startLoaders();
		this.viewType = this.route.snapshot.params['viewType'];
		if (this.viewType != undefined) {
			this.modulesDisplayType = this.referenceService.setDisplayType(this.modulesDisplayType, this.viewType);
		} else {
			this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
			if (this.modulesDisplayType.isFolderGridView || this.modulesDisplayType.isFolderListView) {
				this.modulesDisplayType = this.referenceService.setDisplayType(this.modulesDisplayType, 'l');
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

	setViewType(viewType: string) {
		if (this.isPartnerView) {
			this.referenceService.goToRouter("/home/dam/shared/" + viewType);
		} else {
			this.referenceService.goToRouter("/home/dam/manage/" + viewType);
		}

	}

	startLoaders() {
		this.loading = true;
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
		this.referenceService.goToTop();
		this.startLoaders();
		this.pagination.type = this.videoFileService.videoType;
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
				});
				pagination = this.pagerService.getPagedItems(pagination, data.assets);
			}
			this.stopLoaders();
		}, error => {
			this.stopLoadersAndShowError(error);
		});
	}

	listPublishedAssets(pagination: Pagination) {
		this.referenceService.goToTop();
		this.startLoaders();
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
		this.loading = true;
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
                                this.referenceService.goToRouter("/home/dam/partnerAnalytics/" + asset.id);
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
                this.referenceService.goToRouter("/home/dam/partnerAnalytics/" + asset.id);
            }
        }
    }

    editDetails(id: number, assetType: string, alias:string) {
        if (this.isVideo(assetType)) {
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
		this.asset = input['asset'];
		if (preview) {
			this.isPreview = true;
		} else if (showPublishPopup) {
			this.selectedAssetId = this.asset.id;
			this.showPublishPopup = true;
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
            this.showPlayVideo(asset.id, asset.alias);
        } else {
            this.isPreview = true;
            this.asset = asset;
        }
	}
    
    showPlayVideo(id: number, alias: string) {
        try {
            this.videoFileService.getVideo(alias, 'DRAFT')
                .subscribe((editVideoFile: SaveVideoFile) => {
                    if (editVideoFile.access) {
                        if (editVideoFile.imageFiles == null || editVideoFile.gifFiles == null) {
                            editVideoFile.gifFiles = []; editVideoFile.imageFiles = [];
                        }
                        editVideoFile.damId = id;
                        this.videoFileService.saveVideoFile = editVideoFile;
                        this.videoFileService.videoType ='myVideos';
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
                //this.showVideosPage(false, true, false, false);
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
        // this.manageVideos = manageVideos;
        
       // this.playVideo = playVideo;
        //this.campaignReport = campaignReport;
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
    
    getVideoTypes(videoType : string){
    	
    }



}
