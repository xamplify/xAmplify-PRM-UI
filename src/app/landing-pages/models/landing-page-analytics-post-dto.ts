import { GeoLocationAnalyticsType } from '../../util/geo-location-analytics-type.enum';
export class LandingPageAnalyticsPostDto {
    
    landingPageId:number;
    campaignId:number;
    userId:number;
    timePeriod:string;
    filterValue:string;
    analyticsTypeString:string;
    landingPageAlias:string = "";
    partnerId:number;
    vendorPages:boolean;
    
    
}
