import { GeoLocationAnalytics } from "app/util/geo-location-analytics";

export class DamAnalyticsPostDto {
	
	damPartnerId:number = 0;
	loggedInUserId:number = 0;
	actionType:number = 1;
	geoLocationDetails:GeoLocationAnalytics = new GeoLocationAnalytics();
	
}
