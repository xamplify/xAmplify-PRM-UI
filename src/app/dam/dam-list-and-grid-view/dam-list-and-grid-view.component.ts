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
import { ErrorResponse } from 'app/util/models/error-response';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';

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
	modalPopupLoader = false;
	selectedPdfAlias = "";
	showPublishPopup = false;
	selectedAssetId: number = 0;
	isPartnerView = false;
	downloadOptionsCustomResponse: CustomResponse = new CustomResponse();
	constructor(private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, public listLoader: HttpRequestLoader, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
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
							this.historyPagination.companyId = this.loggedInUserCompanyId;
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
		let url = this.isPartnerView ? 'downloadpc':'downloadc';
		window.open(this.authenticationService.REST_URL + "dam/"+url+"/" + alias + "?access_token=" + this.authenticationService.access_token);

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
		let downloadUrl = this.isPartnerView ? 'downloadp/' + self.selectedPdfAlias : 'download/' + self.selectedPdfAlias + "/" + selectedSize + "/" + selectedOrientation;
		setTimeout(function () {
			window.open(self.authenticationService.REST_URL + "dam/" + downloadUrl + "?access_token=" + self.authenticationService.access_token);
			$('#downloadPdfModalPopup').modal('hide');
			self.modalPopupLoader = false;
			swal.close();
		}, 1500);
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
}
