import { GeoLocationAnalytics } from "app/util/geo-location-analytics";

export class AssetDetailsViewDto {
    id:number;
    assetName = "";
    description = "";
    alias = "";
    displayTime:Date;
    publishedTimeInUTCString = "";
    thumbnailPath = "";
    damId:number;
    loggedInUserId: number;
    partnerSignatureRequired: boolean = false;
    geoLocationDetails:GeoLocationAnalytics = new GeoLocationAnalytics();
    partnerSignatureCompleted: boolean = false;
    selectedSignaturePath: any;
    vendorSignatureCompleted: boolean = false;
    sharedAssetPath: any;
    damPartnerId: any;
     categoryName ="";
	 displayName = "";
	 vendorCompanyName = "";
	 loggedInUserProfileImage = "";
    assetType = "";
    assetPath:any;
    beeTemplate:boolean;
}
