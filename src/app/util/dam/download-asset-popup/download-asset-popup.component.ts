import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Ng2DeviceService } from 'ng2-device-detector';
import { GeoLocationAnalytics } from "app/util/geo-location-analytics";
import { UtilService } from 'app/core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DamService } from 'app/dam/services/dam.service';

declare var $:any,swal:any;
@Component({
  selector: 'app-download-asset-popup',
  templateUrl: './download-asset-popup.component.html',
  styleUrls: ['./download-asset-popup.component.css'],
  providers: [Properties]
})
export class DownloadAssetPopupComponent implements OnInit,OnDestroy {
	

  @Input() asset:any;
  @Input() isPartnerView:boolean;
  @Output() downloadAssetPopupEventEmitter = new EventEmitter();
  @Input() isNavigatedFromAddSection:boolean;
  @Input() htmlBody:any;
  @Input() pdfTitle = "";
  selectedPdfAlias: any;
  loggedInUserId: number = 0;
  downloadOptionsCustomResponse: CustomResponse = new CustomResponse();
  modalPopupLoader: boolean;
  properties:Properties = new Properties();
  constructor(public xtremandLogger:XtremandLogger,public referenceService:ReferenceService,public deviceService: Ng2DeviceService,
    private utilService: UtilService,public authenticationService:AuthenticationService,public damService:DamService) {
      this.loggedInUserId = this.authenticationService.getUserId();
     }

  ngOnInit() {
	  this.openPopup(this.asset);
  }

  ngOnDestroy(): void {
	this.hidePopup();
}

  /***************Download*************/
	openPopup(asset: any) {
		try {
			if(this.isNavigatedFromAddSection){
				$('#downloadPdfModalPopup').modal('show');
				this.modalPopupLoader = true;
				let data = {};
				data['pageSize'] = 'A4';
				data['pageOrientation']  = 'Portrait';
				$('#selectedSize').val(data['pageSize']);
				$('#selectedOrientation').val(data['pageOrientation']);
				this.modalPopupLoader = false;
			}else{
				this.downloadSavedPdf(asset);
			}
		} catch (error) {
			this.xtremandLogger.error(error);
			this.referenceService.showSweetAlertErrorMessage(error.message + " " + error.name);
		}
	}

	private downloadSavedPdf(asset: any) {
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
			this.downloadContent(asset);
		}
	}

	downloadContent(asset: any) {
		if (this.isPartnerView) {
			this.utilService.getJSONLocation().subscribe(
				(response: any) => {
					let param = this.getLocationDetails(response, asset.alias);
					param.id = asset.damId;
					let completeUrl = this.authenticationService.REST_URL + "dam/downloadpc?access_token=" + this.authenticationService.access_token;
					this.referenceService.post(param, completeUrl);
				}, (_error: any) => {
					this.xtremandLogger.error("Error In Fetching Location Details");
				}
			);
		} else {
			window.open(this.authenticationService.REST_URL + "dam/downloadc/" + asset.alias +"/" + asset.id + "/"+ this.authenticationService.user.id+ "?access_token=" + this.authenticationService.access_token);
		}
		this.downloadAssetPopupEventEmitter.emit();
	}

	getLocationDetails(response: any, alias: string) {
		let deviceInfo = this.deviceService.getDeviceInfo();
		if (deviceInfo.device === 'unknown') {
			deviceInfo.device = 'computer';
		}
		let param : any = {
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
		/**** XNFR-379 ****/
		if(this.isNavigatedFromAddSection){
			this.downloadPdfPreview(selectedSize, selectedOrientation);
		}else{
			setTimeout(function () {
				if (self.isPartnerView) {
					self.downloadForPartner();
				} else {
					let downloadUrl = 'download/' + self.selectedPdfAlias + "/" + selectedSize + "/" + selectedOrientation;
					self.downloadPdfForVendor(self, downloadUrl);
				}
			}, 1500);
		}
		
	}
	/**** XNFR-379 ****/
	private downloadPdfPreview(selectedSize: any, selectedOrientation: any) {
		this.modalPopupLoader = true;
		if (this.pdfTitle == undefined) {
			this.pdfTitle = "Preview";
		}
		let param: any = {
			'size': selectedSize,
			'orientation': selectedOrientation,
			'htmlBody': this.htmlBody,
			'loggedInUserId': this.loggedInUserId,
			'title': this.pdfTitle
		};
		let completeUrl = this.authenticationService.REST_URL + "dam/downloadPdfPreview?access_token=" + this.authenticationService.access_token;
		this.referenceService.post(param, completeUrl);
		swal.close();
		this.downloadAssetPopupEventEmitter.emit();
		this.modalPopupLoader = false;
	}

	downloadPdfForVendor(self: any, downloadUrl: string) {
		window.open(self.authenticationService.REST_URL + "dam/" + downloadUrl + "?access_token=" + self.authenticationService.access_token);
		$('#downloadPdfModalPopup').modal('hide');
		self.modalPopupLoader = false;
		swal.close();
		this.downloadAssetPopupEventEmitter.emit();

	}

	downloadForPartner() {
		this.utilService.getJSONLocation().subscribe(
			(response: any) => {
				let param = this.getLocationDetails(response, this.selectedPdfAlias);
				let completeUrl = this.authenticationService.REST_URL + "dam/downloadp?access_token=" + this.authenticationService.access_token;
				this.referenceService.post(param, completeUrl);
				swal.close();
				this.downloadAssetPopupEventEmitter.emit();
			}, (_error: any) => {
				this.xtremandLogger.error("Error In Fetching Location Details");
			}
		);
	}

	hidePopup() {
		$('#downloadPdfModalPopup').modal('hide');
		this.modalPopupLoader = false;
		this.selectedPdfAlias = "";
		this.downloadOptionsCustomResponse = new CustomResponse();
		this.downloadAssetPopupEventEmitter.emit();
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
	/***************Download*************/

}
