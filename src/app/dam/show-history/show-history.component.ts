import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { DamService } from '../services/dam.service';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'app/core/services/util.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';

declare var $: any;

@Component({
	selector: 'app-show-history',
	templateUrl: './show-history.component.html',
	styleUrls: ['./show-history.component.css'],
	providers: [Properties, HttpRequestLoader, SortOption]
})
export class ShowHistoryComponent implements OnInit {

	loading = false;
	loggedInUserId: number = 0;
	pagination: Pagination = new Pagination();
	customResponse: CustomResponse = new CustomResponse();
	loggedInUserCompanyId: any;
	assetId: number = 0;
	asset:any;
	historyLoader: HttpRequestLoader = new HttpRequestLoader();
	isPreview: boolean;
	selectedAssetId: any;
	showPublishPopup: boolean;
	showPdfModalPopup: boolean;
	deleteAsset: boolean;
	assetsLoader: boolean;
	isPartnerView = false;
	categoryId = 0;
	viewType: string;
	folderViewType = "";
	folderListView = false;
	assets: Array<any> = new Array<any>();
	@Output() updatedItemsCountEmitter = new EventEmitter();
	exportObject = {};
	showRefreshNotification: boolean;
	/****XNFR-381*****/
	isChangeAsParentPdfIconClicked = false;
	changeAsParentPdfSweetAlertParameterDto:SweetAlertParameterDto = new SweetAlertParameterDto();
	childAssetId = 0;
	/****XNFR-381*****/
	constructor(public damService: DamService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger,
		public referenceService: ReferenceService, public utilService: UtilService, public pagerService: PagerService, private router: Router,
		public activatedRoute: ActivatedRoute, public sortOption: SortOption, public videoFileService: VideoFileService, public listLoader: HttpRequestLoader) { }

	ngOnInit() {
		this.assetId = parseInt(this.activatedRoute.snapshot.params['assetId']);
		/****XNFR-169****/
		this.viewType = this.activatedRoute.snapshot.params['viewType'];
		this.categoryId = this.activatedRoute.snapshot.params['categoryId'];
		this.folderViewType = this.activatedRoute.snapshot.params['folderViewType'];
		this.loggedInUserId = this.authenticationService.getUserId();
		this.referenceService.loading(this.historyLoader, true);
		if (this.assetId > 0) {
			this.pagination.campaignId = this.assetId;
			this.getCompanyId();
		}
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
						this.listAssetsHistory(this.pagination);

					}
				}
			);
		} else {
			this.stopLoaders();
			this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
			this.router.navigate(["/home/dashboard"]);
		}
	}

	listAssetsHistory(pagination: Pagination) {
		this.referenceService.goToTop();
		pagination.companyId = this.loggedInUserCompanyId;
		pagination.userId = this.loggedInUserId;
		this.referenceService.loading(this.historyLoader, true);
		this.damService.listHistory(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				let publishingAssets = [];
				pagination.totalRecords = data.totalRecords;
				$.each(data.assets, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.createdDateInUTCString);
					if(asset.publishingOrWhiteLabelingInProgress){
						publishingAssets.push(asset);
					}
				});
				this.showRefreshNotification = publishingAssets.length>0;
				pagination = this.pagerService.getPagedItems(pagination, data.assets);
			}
			this.loading = false;
			this.referenceService.loading(this.historyLoader, false);
		}, error => {
			this.stopLoadersAndShowError(error);
		});
	}

	stopLoadersAndShowError(error: any) {
		this.stopLoaders();
		this.xtremandLogger.log(error);
		this.xtremandLogger.errorPage(error);
	}

	stopLoaders() {
		this.loading = false;
		this.referenceService.loading(this.historyLoader, false);
	}
	/************Page************** */
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.listAssetsHistory(this.pagination);
	}

	/*************************Sort********************** */
	sortAssets(text: any) {
		this.sortOption.damSortOption = text;
		this.getAllFilteredResults();
	}
	/*************************Search********************** */
	searchAssets() {
		this.getAllFilteredResults();
	}
	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination = this.utilService.sortOptionValues(this.sortOption.damSortOption, this.pagination);
		this.listAssetsHistory(this.pagination);

	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchAssets(); } }

	goToDam(){
		this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,false);
	}

	refreshList(){
		this.listAssetsHistory(this.pagination);
	}
	  
	  	assetGridViewActionsEmitter(event: any) {
		let input = event;
		let preview = input['preview'];
		let showPublishPopup = input['publishPopup'];
		let campaign = input['campaign'];
		let edit = input['edit'];
		let analytics = input['analytics'];
		/***XNFR-381****/
		let changeAsParentTemplate = input['changeAsParentPdf'];
		this.asset = input['asset'];
		if (preview) {
			this.preview(this.asset);
		} else if (showPublishPopup) {
			this.selectedAssetId = this.asset.id;
			this.showPublishPopup = true;
		}else if(campaign){
			this.campaignRouter(this.asset.alias, this.asset.viewBy);
		}else if(edit){
            this.editDetails(this.asset.id, this.asset.assetType, this.asset.alias, this.asset.beeTemplate, this.asset.videoId);
        }else if(analytics){
            this.viewAnalytics(this.asset);
        }else if(changeAsParentTemplate){
			this.changeAsParentPdf(this.asset.id);
		}


	}
	  
	  previewAssetPopupEmitter(){
		this.isPreview = false;
		this.asset = {};
	  }
	  /*********Publish Popup **********/
	  notificationFromPublishToPartnersComponent() {
		this.showPublishPopup = false;
		this.selectedAssetId = 0;
		this.getCompanyId();
	  }
	  
	  
	  /*************Download PDF***********/
	  assetGridViewActionsPdfEmitter(event:any){
		this.asset = event;
		this.showPdfModalPopup = true;
	  }
	  
	  downloadAssetPopupEventEmitter(){
		this.asset = {};
		this.showPdfModalPopup = false;
	  }
	  
	  /**********Delete***********/
	  assetGridViewActionsDeleteActionEmitter(event:any){
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
		this.listAssetsHistory(this.pagination);
		this.callFolderListViewEmitter();
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
	  
	   preview(asset: any) {
        if (this.isVideo(asset.assetType)) {
			let url = "/home/dam/previewVideo/"+asset.videoId+"/"+asset.id;
			this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
        } else {
            this.isPreview = true;
            this.asset = asset;
        }
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
     
       editDetails(id: number, assetType: string, alias:string, beeTemplate : boolean, videoId:number) {
		this.loading = true;
        if (!beeTemplate && this.isVideo(assetType)) {
			let url = "/home/dam/editVideo/"+videoId+"/"+id;
			this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
        } else {
			/*****XNFR-169***/
			let url = "/home/dam/editDetails/"+id;
			this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
        }
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
    
    	navigateToPartnerAnalytics(id:number){
		let url = "/home/dam/partnerAnalytics/"+id;
		this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
	}

	navigateToDamAnalyticsForPartnerLogin(id:number){
		let url = "/home/dam/pda/" + id;
		this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
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
	
		 callFolderListViewEmitter(){
		if(this.folderListView){
			this.exportObject['categoryId'] = this.categoryId;
            this.exportObject['itemsCount'] = this.pagination.totalRecords;	
            this.updatedItemsCountEmitter.emit(this.exportObject);
		}
	 }
	 
	 startLoaders() {
		this.referenceService.loading(this.listLoader, true);
	}

	/****XNFR-381*****/
	changeAsParentPdf(assetId:number){
		this.childAssetId = assetId;
		this.changeAsParentPdfSweetAlertParameterDto.text = 'Are you sure you want to switch this child template as the parent template?';
		this.changeAsParentPdfSweetAlertParameterDto.confirmButtonText = "Yes,swtich it";
		this.isChangeAsParentPdfIconClicked = true;
	}

	/****XNFR-381*****/
	changeAsParentPdfEmitter(event:boolean){
		if(event){
			this.customResponse = new CustomResponse();
			this.loading = true;
			this.referenceService.showSweetAlertProceesor('We are processing your request');
			this.damService.changeAsParentAsset(this.childAssetId).subscribe(
				response=>{
					let assetId = this.childAssetId;
					this.resetChangeAsParentPdfValues();
					this.referenceService.showSweetAlertSuccessMessage("Template switched successfully");
					this.referenceService.navigateToRouterByViewTypes("/home/dam/history/"+assetId,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
				},(error:any)=>{
					this.resetChangeAsParentPdfValues();
					this.loading = false;
					this.referenceService.closeSweetAlert();
					let errorMessage = this.referenceService.getBadRequestErrorMessage(error);
					this.referenceService.showSweetAlertErrorMessage(errorMessage);
				});
		}else{
			this.resetChangeAsParentPdfValues();
		}
	}
	/****XNFR-381*****/
	resetChangeAsParentPdfValues(){
		this.childAssetId = 0;
		this.isChangeAsParentPdfIconClicked = false;
	}
}
