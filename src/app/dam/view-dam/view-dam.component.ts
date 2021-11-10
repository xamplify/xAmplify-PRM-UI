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
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";

declare var $: any;


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
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger,public activatedRoute:ActivatedRoute,public damService:DamService,
    public utilService:UtilService,public deviceService: Ng2DeviceService, public domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.assetId = parseInt(this.activatedRoute.snapshot.params['assetId']);
    if(this.assetId>0){
      this.viewDetails(this.assetId);
    }else{
      this.referenceService.goToPageNotFound();
    }
  }

  

  closeAssetDetails(){
    this.referenceService.goToRouter(this.referenceService.sharedDamRouter);
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
					if (this.damViewStatusCode == 200) {
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
								damAnalyticsPostDto.damPartnerId = id;
								this.saveAnalytics(damAnalyticsPostDto);
							}, (_error: any) => {
								this.xtremandLogger.error("Error In Fetching Location Details");
							}
						);
					}
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
		this.download = true;
	}

	downloadAssetPopupEventEmitter(){
		this.download =false;
	}

}
