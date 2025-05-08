import { Component, OnInit } from '@angular/core';
import { DamService } from '../services/dam.service';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { ActivatedRoute } from '@angular/router';
import { DamAnalyticsPostDto } from '../models/dam-analytics-post-dto';
import { Ng2DeviceService } from 'ng2-device-detector';
import { GeoLocationAnalytics } from "app/util/geo-location-analytics";
import { UtilService } from '../../core/services/util.service';
import { AssetDetailsViewDto } from '../models/asset-details-view-dto';
import { DomSanitizer } from "@angular/platform-browser";
import { SignatureService } from 'app/dashboard/services/signature.service';
import { SignatureResponseDto } from 'app/dashboard/models/signature-response-dto';
import { HttpClient } from '@angular/common/http';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';

declare var $: any;
declare var pdfjsLib: any;

@Component({
  selector: 'app-view-dam',
  templateUrl: './view-dam.component.html',
  styleUrls: ['./view-dam.component.css'],
  providers: [Properties]
})
export class ViewDamComponent implements OnInit {
  assetViewLoader = false;
  assetDetailsViewDto : AssetDetailsViewDto = new AssetDetailsViewDto();
  assetId:number = 0;
  damViewStatusCode: number;
  selectedAsset: any;
  selectedAssetId: any;
  download = false;
  showDownload = true;
  /****XNFR-169****/
  viewType: string;
  categoryId: number;
  folderViewType: string;
  loadVideoPlayer = false;
  openDigitalSignatureModelPopup: boolean = false;
  signatureResponseDto:SignatureResponseDto = new SignatureResponseDto();
  openSelectDigitalSignatureModalPopUp: boolean = false;
  formData: any = new FormData();
  askAiValue: boolean;
  pdfDoc: any = null;
	previewContent: boolean = false;
	assetPath: any;
	fileType: string;
  damCompanyId:number;
  slug:any;
  isImageFormat:any ;
  isTextFormat:any;
  isVendorLogin:boolean = false;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger,public activatedRoute:ActivatedRoute,public damService:DamService,
    public utilService:UtilService,public deviceService: Ng2DeviceService, public domSanitizer: DomSanitizer, public signatureService:SignatureService,
	public properties: Properties,private http: HttpClient) {
		 /****XNFR-169****/
		 this.viewType = this.activatedRoute.snapshot.params['viewType'];
		 this.categoryId = this.activatedRoute.snapshot.params['categoryId'];
		 this.folderViewType = this.activatedRoute.snapshot.params['folderViewType'];
	 }

  ngOnInit() {
    this.assetId = parseInt(this.activatedRoute.snapshot.params['assetId']);
	this.damCompanyId = parseInt(this.activatedRoute.snapshot.params['damCompanyId']);
	this.slug = this.activatedRoute.snapshot.params['slug'];
	if(this.slug != null){
		this.viewDetailsBySlug(this.slug, this.damCompanyId);
	}else if(this.assetId>0){
      this.viewDetails(this.assetId);
    }else{
      this.referenceService.goToPageNotFound();
    }


  }

  viewContent(){
	this.saveGeoLocationAnalytics(this.assetId);
	if (!this.assetDetailsViewDto.beeTemplate) {
		this.previewContent = true;
		if(this.assetDetailsViewDto.sharedAssetPath){
			this.assetPath = this.assetDetailsViewDto.sharedAssetPath;
		} else {
			this.assetPath = this.assetDetailsViewDto.assetPath;
		}
		this.fileType = this.assetDetailsViewDto.assetType;
		this.isImageFormat = this.assetDetailsViewDto.imageFileType
		this.isTextFormat = this.assetDetailsViewDto.textFileType
	} else {
		this.referenceService.preivewAssetForPartnerOnNewHost(this.assetId);
	}
  }

  closeAssetDetails(){
	this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,true);
  }

  viewDetails(id: any) {
		this.damViewStatusCode = 200;
		this.assetViewLoader = true;
		this.damService.getSharedAssetDetailsById(id)
			.subscribe(
				(response: any) => {
					this.damViewStatusCode = response.statusCode;
					if (response.access) {
						if (response.statusCode == 200) {
							this.assetDetailsViewDto = response.data;
							this.selectedAsset = this.assetDetailsViewDto;
							this.assetDetailsViewDto.displayTime = new Date(this.assetDetailsViewDto.publishedTimeInUTCString);
							this.loadVideoPlayer = this.selectedAsset.videoId!=null && this.selectedAsset.videoId>0;
							if(!this.loadVideoPlayer){
								this.assetViewLoader = false;
							}
						} else if (response.statusCode == 404) {
							this.referenceService.goToPageNotFound();
						}
					} else {
						this.authenticationService.forceToLogout();
					}
				},
				(error: string) => {
					this.xtremandLogger.errorPage(error);
				},
				() => {
					if(this.loadVideoPlayer && this.damViewStatusCode==200){
						this.saveGeoLocationAnalytics(id);
					}
					// this.getPdfByAssetPath();
				}
			);
	}

	private saveGeoLocationAnalytics(id: any) {
		this.utilService.getJSONLocation().subscribe(
			(response: any) => {
				let damAnalyticsPostDto = new DamAnalyticsPostDto();
				let geoLocationDetails = new GeoLocationAnalytics();
				let deviceInfo = this.deviceService.getDeviceInfo();
				if (deviceInfo.device === 'unknown') {
					deviceInfo.device = 'computer';
				}
				geoLocationDetails.openedTime = new Date();
				geoLocationDetails.deviceType = deviceInfo.device;
				geoLocationDetails.os = deviceInfo.os;
				geoLocationDetails.city = response.city;
				geoLocationDetails.country = response.country;
				geoLocationDetails.isp = response.isp;
				geoLocationDetails.ipAddress = response.query;
				geoLocationDetails.state = response.regionName;
				geoLocationDetails.zip = response.zip;
				geoLocationDetails.latitude = response.lat;
				geoLocationDetails.longitude = response.lon;
				geoLocationDetails.countryCode = response.countryCode;
				geoLocationDetails.timezone = response.timezone;
				damAnalyticsPostDto.geoLocationDetails = geoLocationDetails;
				this.assetDetailsViewDto.geoLocationDetails = geoLocationDetails;
				damAnalyticsPostDto.damPartnerId = id;
				this.saveAnalytics(damAnalyticsPostDto);
			}, (_error: any) => {
				this.xtremandLogger.error("Error In Fetching Location Details");
				let damAnalyticsPostDto = new DamAnalyticsPostDto();
				damAnalyticsPostDto.damPartnerId = id;
				this.saveAnalytics(damAnalyticsPostDto);
				this.assetViewLoader = false;
			}
		);
	}

	saveAnalytics(damAnalyticsPostDto: DamAnalyticsPostDto) {
		damAnalyticsPostDto.loggedInUserId = this.authenticationService.getUserId();
		damAnalyticsPostDto.actionType = 1;
		this.damService.saveDamAnalytics(damAnalyticsPostDto).
			subscribe(
				(response: any) => {
					this.assetViewLoader = false;
					this.xtremandLogger.info("View Analytics Are Saved");
				}, (error: string) => {
					this.xtremandLogger.errorPage(error);
				}
			);
	}
	downloadContent(){
	    this.showDownload = false;
		this.download = true;
	}

	downloadAssetPopupEventEmitter(){
		this.download =false;
		this.showDownload = true;
	}

	openModelpopup() {
		this.openSelectDigitalSignatureModalPopUp = true;
	}

	uploadSignature() {
		this.assetViewLoader = true;
		this.assetDetailsViewDto.loggedInUserId = this.authenticationService.getUserId();
		this.getGeoLocationAnalytics((geoLocationDetails: GeoLocationAnalytics) => {
			this.assetDetailsViewDto.geoLocationDetails = geoLocationDetails;
			this.damService.uploadSignature(this.assetDetailsViewDto, this.formData).subscribe(
				(response: any) => {
					this.assetViewLoader = false;
					this.viewDetails(this.assetId);
				},
				(error: string) => {
					this.xtremandLogger.errorPage(error);
					this.assetViewLoader = false;
				}
			);
		});
	}

	private getGeoLocationAnalytics(callback: (geoLocationDetails: GeoLocationAnalytics) => void) {
		this.utilService.getJSONLocation().subscribe(
			(response: any) => {
				let geoLocationDetails = new GeoLocationAnalytics();
				let deviceInfo = this.deviceService.getDeviceInfo();
				if (deviceInfo.device === 'unknown') {
					deviceInfo.device = 'computer';
				}
				geoLocationDetails.openedTime = new Date();
				geoLocationDetails.deviceType = deviceInfo.device;
				geoLocationDetails.os = deviceInfo.os;
				geoLocationDetails.city = response.city;
				geoLocationDetails.country = response.country;
				geoLocationDetails.isp = response.isp;
				geoLocationDetails.ipAddress = response.query;
				geoLocationDetails.state = response.regionName;
				geoLocationDetails.zip = response.zip;
				geoLocationDetails.latitude = response.lat;
				geoLocationDetails.longitude = response.lon;
				geoLocationDetails.countryCode = response.countryCode;
				geoLocationDetails.timezone = response.timezone;
				callback(geoLocationDetails);
			},
			(_error: any) => {
				this.xtremandLogger.error("Error In Fetching Location Details");
			}
		);
	}
	

	notifySelectDigitalSignatureCloseModalPopUp(event){
		if(event == 'close'){
			this.openSelectDigitalSignatureModalPopUp = false;
		}
	}

	notifyDigitalSignatureCloseModalPopUp(event){
		if(event == 'close'){
			this.openDigitalSignatureModelPopup = false;
		}
	}

	notifySignatureSelection(event){
	 this.formData.append("uploadedFile", event, event['name']);
	 this.assetDetailsViewDto.selectedSignaturePath = 'http://localhost:8000/signatures/94105361/draw-signature.png'
	 this.uploadSignature();
	}
	AskAi(){
		let url = "/home/dam/askAi/view/" + this.assetId;
		this.referenceService.goToRouter(url)
	}
	closeAskAi(){
		this.askAiValue = false;
	}
	getPdfByAssetPath(){
		this.http.get(this.assetDetailsViewDto.sharedAssetPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token), { responseType: 'blob' })
        .subscribe(async response => {
		this.pdfDoc = response;
        });
	}
	extractTextFromPDF(url: string): void {
		const self = this;   
		pdfjsLib.getDocument(url).promise.then(function (pdf) {
		  let fullText = '';
		  let loadPagePromises = [];
	  
		  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
			loadPagePromises.push(
			  pdf.getPage(pageNum).then(function (page) {
				return page.getTextContent().then(function (textContent) {
				  const pageText = textContent.items.map(function (item: any) {
					return item.str;
				  }).join(' ');
	  
				  fullText += 'Page ' + pageNum + ':\n' + pageText + '\n\n';
				});
			  })
			);
		  }
	  
		  Promise.all(loadPagePromises).then(function () {
			console.log('Extracted PDF Text:', fullText);
			// If you want to use it elsewhere
			self.pdfDoc = fullText; // Define `extractedPdfText` in your component
		  });
		}).catch(function (error) {
		  console.error('Error extracting PDF text:', error);
		});
	  }

	  closePreview() {
		this.previewContent = false;
		if(this.isVendorLogin){
			this.goToDam();
		}
	  }

	    handleAssetPreview(item: any) {
		  if (this.referenceService.isVideo(item.assetType)) {
			let prefixurl = RouterUrlConstants['home'] + RouterUrlConstants['dam'] + RouterUrlConstants['approval']
			const videoUrl = `${prefixurl}/previewVideo/${item.videoId}/${item.id}`;
			this.referenceService.navigateToRouterByViewTypes(videoUrl, 0, undefined, undefined, undefined);
		  } else if (item.beeTemplate) {
			if ((item.contentPreviewType || item.imageFileType) && item.assetPath != undefined && item.assetPath != null && item.assetPath != '') {
			  if (item.assetProxyPath) {
				this.assetPath = item.assetProxyPath + item.assetPath;
			  } else {
				this.assetPath = item.assetPath;
			  }
			  //this.assetPath = item.assetPath;
			  this.fileType = item.assetType;
			  this.previewContent = true;
			  this.isImageFormat = item.imageFileType;
			  this.isTextFormat = item.textFileType;
			} else {
			  this.referenceService.previewAssetPdfInNewTab(item.id);
			}
		  } else {
			if ((item.contentPreviewType || item.imageFileType)) {
			  if (item.assetProxyPath) {
				this.assetPath = item.assetProxyPath + item.assetPath;
			  } else {
				this.assetPath = item.assetPath;
			  }
			  //this.assetPath = item.assetPath;
			  this.fileType = item.assetType;
			  this.previewContent = true;
			  this.isImageFormat = item.imageFileType;
			  this.isTextFormat = item.textFileType;
			} else {
			  this.referenceService.preivewAssetOnNewHost(item.id);
			}
		  }
		}

	viewDetailsBySlug(slug: string, companyId: number) {
		let damPartnerId = null;
		this.damService.getAssetDetailBySlug(slug, companyId)
			.subscribe(
				(response: any) => {
					this.damViewStatusCode = response.statusCode;
					if (response.access) {
						if (response.statusCode == 403) {
							this.referenceService.goToAccessDeniedPage();
						} else if (response.statusCode == 404) {
							this.referenceService.goToPageNotFound();
						} else if (response.statusCode == 200) {
							let map = response.map;
							this.isVendorLogin = map.isVendor;
							damPartnerId = map.damPartnerId;
							if (this.isVendorLogin) {
								this.handleAssetPreview(response.data);
							} else {
								this.assetDetailsViewDto = response.data;
								this.selectedAsset = this.assetDetailsViewDto;
								this.assetDetailsViewDto.displayTime = new Date(this.assetDetailsViewDto.publishedTimeInUTCString);
								this.loadVideoPlayer = this.selectedAsset.videoId != null && this.selectedAsset.videoId > 0;
								if (!this.loadVideoPlayer) {
									this.assetViewLoader = false;
								}
							}
						} 
					}else {
						this.authenticationService.forceToLogout();
					}
				},
				(error: string) => {
					this.xtremandLogger.errorPage(error);
				},
				() => {
					if (!this.isVendorLogin && this.loadVideoPlayer && this.damViewStatusCode == 200) {
						if (damPartnerId != null) {
							this.saveGeoLocationAnalytics(damPartnerId);
						}
					}
				}
			);
	}

	goToDam(){
		this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,false);
	}
}
