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
	constructor(public damService: DamService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger,
		public referenceService: ReferenceService, public utilService: UtilService, public pagerService: PagerService, private router: Router,
		public activatedRoute: ActivatedRoute, public sortOption: SortOption) { }

	ngOnInit() {
		this.assetId = parseInt(this.activatedRoute.snapshot.params['assetId']);
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
		this.referenceService.goToRouter("/home/dam/manage/g");
	}

	refreshList(){
		this.listAssetsHistory(this.pagination);
	}

	assetGridViewActionsEmitter(event:any){
		let input =event;
		let preview = input['preview'];
		let showPublishPopup = input['publishPopup'];
		this.asset = input['asset'];
		if(preview){
		  this.isPreview = true;
		}else if(showPublishPopup){
		  this.selectedAssetId = this.asset.id;
		  this.showPublishPopup = true;
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
	  
	  deleteAssetSuccessEmitter(){
		this.customResponse = new CustomResponse('SUCCESS',this.asset.assetName+" Deleted Successfully",true);
		this.deleteAsset = false;
		this.assetsLoader = false;
		this.asset = {};
		this.pagination.pageIndex = 1;
		this.listAssetsHistory(this.pagination);
	  }
	  
	  deleteAssetLoaderEmitter(){
		this.assetsLoader = true;
	  }
	  
	  deleteAssetCancelEmitter(){
		this.deleteAsset = false;
		this.asset = {};
	  }  
	  



}
