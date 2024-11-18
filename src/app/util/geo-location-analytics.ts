import { GeoLocationAnalyticsType } from './geo-location-analytics-type.enum';
export class GeoLocationAnalytics {
    id:number;
    landingPageAlias:string;
    deviceType:string;
    os:string;
    city:string;
    state:string;
    zip:string;
    country:string;
    isp:string; 
    ipAddress:string;
    latitude:string;
    longitude:string;
    countryCode:string;
    timezone:string;
    openedTime:Date=new Date();
    openedTimeInString:string;
    campaignId:number;
    userId:number;
    url:string;
    formId:number;
    analyticsType:GeoLocationAnalyticsType;
    analyticsTypeString:string = "";
    landingPageId:number;  
    partnerLandingPageAlias:string = "";
    partnerCompanyId:number;
    openedInBrowser = false;
    vendorJourney:boolean = false;
    fromMasterLandingPage:boolean =false;

    partnerJourneyPage:boolean = false;
    fromVendoeMarketplacePage:boolean = false;
}
