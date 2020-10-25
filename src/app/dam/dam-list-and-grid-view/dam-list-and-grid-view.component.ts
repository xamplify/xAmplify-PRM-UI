import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { DamUploadPostDto } from '../models/dam-upload-post-dto';
import {AssetDetailsViewDto} from '../models/asset-details-view-dto';
import { DamAnalyticsPostDto } from '../models/dam-analytics-post-dto';
import { Ng2DeviceService } from 'ng2-device-detector';

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
	assetDetailsViewDto:AssetDetailsViewDto = new AssetDetailsViewDto();
	selectedAsset: any;
	constructor(public deviceService: Ng2DeviceService,private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, public listLoader: HttpRequestLoader, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		this.callInitMethods();
	}

	callInitMethods() {
		this.isPartnerView = this.router.url.indexOf('/shared') > -1;
		this.startLoaders();
		this.getCompanyId();
		this.viewType = this.route.snapshot.params['viewType'];
		if (this.viewType != undefined) {
			this.modulesDisplayType = this.referenceService.setDisplayType(this.modulesDisplayType, this.viewType);
		} else {
			this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
			if(this.modulesDisplayType.isFolderGridView || this.modulesDisplayType.isFolderListView){
				this.modulesDisplayType = this.referenceService.setDisplayType(this.modulesDisplayType, 'l');
			}
		}
		if (this.referenceService.isCreated) {
			this.customResponse = new CustomResponse('SUCCESS', 'Template Added Successfully', true);
		} else if (this.referenceService.isUpdated) {
			this.customResponse = new CustomResponse('SUCCESS', 'Template Updated Successfully', true);
		} else if (this.referenceService.isUploaded) {
			this.customResponse = new CustomResponse('SUCCESS', 'Uploaded Successfully', true);
		}
	}

	ngOnDestroy() {
		this.referenceService.isCreated = false;
		this.referenceService.isUpdated = false;
		this.referenceService.isUploaded = false;
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
							this.listPublishedAssets(this.pagination);
						} else {
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
		this.damService.list(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				this.assets = data.assets;
				$.each(data.assets, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.createdDateInUTCString);
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
				$.each(data.assets, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.publishedTimeInUTCString);
				});
				pagination = this.pagerService.getPagedItems(pagination, data.assets);
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

	edit(id: number) {
		if (this.isPartnerView) {
			this.referenceService.goToRouter("/home/dam/editp/" + id);
		} else {
			this.referenceService.goToRouter("/home/dam/edit/" + id);
		}

	}

	openPopup(asset: any) {
		try {
			let alias = asset.alias;
			if (asset.beeTemplate) {
				this.selectedPdfAlias = alias;
				if (this.isPartnerView) {
					this.downloadAsPdf();
				} else {
					$('#downloadPdfModalPopup').modal('show');
					this.getDownloadOptions(alias);
				}
			} else {
				this.downloadContent(alias);
			}
		} catch (error) {
			this.xtremandLogger.error(error);
			this.referenceService.showSweetAlertErrorMessage(error.message + " " + error.name);
		}
	}

	downloadContent(alias: string) {
		if(this.isPartnerView){
			this.utilService.getJSONLocation().subscribe(
				(response:any) =>{
					let param = this.getLocationDetails(response,alias);
					let completeUrl = this.authenticationService.REST_URL+"dam/downloadpc?access_token=" + this.authenticationService.access_token;
					this.referenceService.post(param,completeUrl);
				},(_error:any) =>{
					this.xtremandLogger.error( "Error In Fetching Location Details");
				}
			);
		}else{
			window.open(this.authenticationService.REST_URL+"dam/downloadc/"+alias+"?access_token=" + this.authenticationService.access_token);

		}
	}

	getLocationDetails(response: any, alias: string) {
		let deviceInfo = this.deviceService.getDeviceInfo();
		if (deviceInfo.device === 'unknown') {
			deviceInfo.device = 'computer';
		}
		let param = {
			'alias': alias,
			'loggedInUserId': this.loggedInUserId,
			'deviceType': deviceInfo.device,
			'os': deviceInfo.os,
			'city': response.city,
			'country': response.country,
			'isp': response.isp,
			'ipAddress': response.query,
			'state': response.regionName,
			'zip': response.zip,
			'latitude': response.lat,
			'longitude': response.lon,
			'countryCode': response.countryCode,
			'timezone': response.timezone
		};
		return param;
	}

	downloadAsPdf() {
		this.modalPopupLoader = true;
		let selectedSize = $('#selectedSize option:selected').val();
		let selectedOrientation = $('#selectedOrientation option:selected').val();
		let self = this;
		swal({
			title: 'Please Wait',
			allowOutsideClick: false,
			showConfirmButton: false,
			imageUrl: 'assets/images/loader.gif',
		});
		setTimeout(function () {
			if(self.isPartnerView){
				self.downloadForPartner();
			}else{
				let downloadUrl = 'download/' + self.selectedPdfAlias + "/" + selectedSize + "/" + selectedOrientation;
				self.downloadPdfForVendor(self,downloadUrl);
			}
			swal.close();
		}, 1500);
	}

	downloadPdfForVendor(self:any,downloadUrl:string){
		window.open(self.authenticationService.REST_URL + "dam/" + downloadUrl + "?access_token=" + self.authenticationService.access_token);
		$('#downloadPdfModalPopup').modal('hide');
		self.modalPopupLoader = false;
	}
	
	downloadForPartner(){
		this.utilService.getJSONLocation().subscribe(
			(response:any) =>{
				let param = this.getLocationDetails(response,this.selectedPdfAlias);
				let completeUrl = this.authenticationService.REST_URL+"dam/downloadp?access_token=" + this.authenticationService.access_token;
				this.referenceService.post(param,completeUrl);
			},(_error:any) =>{
				this.xtremandLogger.error( "Error In Fetching Location Details");
			}
		);
	}

	hidePopup() {
		$('#downloadPdfModalPopup').modal('hide');
		this.modalPopupLoader = false;
		this.selectedPdfAlias = "";
		this.downloadOptionsCustomResponse = new CustomResponse();
	}

	openPublishPopup(assetId: number) {
		this.showPublishPopup = true;
		this.selectedAssetId = assetId;
	}

	notificationFromPublishToPartnersComponent() {
		this.showPublishPopup = false;
		this.selectedAssetId = 0;
		this.callInitMethods();
	}

	updateDownloadOptions() {
		this.downloadOptionsCustomResponse = new CustomResponse();
		this.modalPopupLoader = true;
		let selectedSize = $('#selectedSize option:selected').val();
		let selectedOrientation = $('#selectedOrientation option:selected').val();
		let input = {};
		input['alias'] = this.selectedPdfAlias;
		input['pageSize'] = selectedSize;
		input['pageOrientation'] = selectedOrientation;
		input['userId'] = this.loggedInUserId;
		this.damService.updateDownloadOptions(input).subscribe((result: any) => {
			this.modalPopupLoader = false;
			this.downloadOptionsCustomResponse = new CustomResponse('SUCCESS', 'Options Updated Successfully', true);
		}, error => {
			this.modalPopupLoader = false;
			this.downloadOptionsCustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
		});
	}

	getDownloadOptions(alias: string) {
		this.modalPopupLoader = true;
		this.damService.getDownloadOptions(alias).subscribe((result: any) => {
			let data = result.data;
			$('#selectedSize').val(data.pageSize);
			$('#selectedOrientation').val(data.pageOrientation);
			this.modalPopupLoader = false;
		}, error => {
			this.modalPopupLoader = false;
			this.downloadOptionsCustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
		});
	}

	viewGirdHistory(asset:any){
		this.isGridViewHistory = true;
		this.selectedAssetId = asset.id;
		this.selectedAssetName = asset.assetName;
		this.historyPagination.campaignId = asset.id;
		this.listAssetsHistory(this.historyPagination);
	}

	closeHistory(){
		this.isGridViewHistory = false;
		this.selectedAssetId = 0;
		this.selectedAssetName = "";
		this.historyPagination = new Pagination();
	}

	confirmDelete(asset:any) {
        try {
            let self = this;
            swal({
                title: 'Are you sure?',
                text: "You won't be able to undo this action!",
                type: 'warning',
                showCancelButton: true,
                swalConfirmButtonColor: '#54a7e9',
                swalCancelButtonColor: '#999',
                confirmButtonText: 'Yes, delete it!'

            }).then(function () {
                self.deleteById(asset);
            }, function (dismiss: any) {
                console.log('you clicked on option' + dismiss);
            });
        } catch (error) {
            this.xtremandLogger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
        }
	}
	
	deleteById(asset: any) {
        this.customResponse = new CustomResponse();
        this.referenceService.loading(this.listLoader, true);
		this.referenceService.goToTop();
		let damUploadPostDto = new DamUploadPostDto();
		damUploadPostDto.loggedInUserId = this.loggedInUserId;
		damUploadPostDto.id = asset.id;
        this.damService.delete(damUploadPostDto)
            .subscribe(
                (response: any) => {
                    if(response.access){
                        if (response.statusCode == 200) {
                            this.customResponse = new CustomResponse('SUCCESS', "Asset Deleted Successfully", true);
                            this.pagination.pageIndex = 1;
                            this.listAssets(this.pagination);
                        } 
                    }else{
                        this.authenticationService.forceToLogout();
                    }
                },
                (_error: string) => {
                    this.referenceService.showServerErrorMessage(this.listLoader);
                    this.customResponse = new CustomResponse('ERROR', this.listLoader.message, true);
                }
            );
	}
	
	viewDetails(asset:any){
		this.selectedAsset = asset;
		this.assetDetailsPreview = true;
		this.selectedAssetId = asset.id;
		this.assetViewLoader = true;
		this.damService.getSharedAssetDetailsById(asset.id)
		.subscribe(
			(response: any) => {
				if(response.access){
					if (response.statusCode == 200) {
						this.assetDetailsViewDto = response.data;
						this.assetDetailsViewDto.displayTime = new Date(this.assetDetailsViewDto.publishedTimeInUTCString);
					} 
				}else{
					this.authenticationService.forceToLogout();
				}
			},
			(error: string) => {
				this.xtremandLogger.errorPage(error);
			},
			() => {
				let damAnalyticsPostDto  = new DamAnalyticsPostDto();
				damAnalyticsPostDto.loggedInUserId = this.loggedInUserId;
				damAnalyticsPostDto.damPartnerId = asset.id;
				damAnalyticsPostDto.actionType = 1;
				this.damService.saveDamAnalytics(damAnalyticsPostDto).
				subscribe(
					(response:any) =>{
						this.assetViewLoader = false;
						this.xtremandLogger.info("View Analytics Are Saved");
					},(error:string) =>{
						this.xtremandLogger.errorPage(error);
					}
				);
			}
		);
	}

	closeAssetDetails(){
		this.selectedAsset = undefined;
		this.assetDetailsPreview = false;
		this.assetDetailsViewDto = new AssetDetailsViewDto();
	}
}
